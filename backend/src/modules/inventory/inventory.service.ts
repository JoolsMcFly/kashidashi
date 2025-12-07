import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { Inventory } from '../../entities/inventory.entity';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { Book } from '../../entities/book.entity';
import { Loan } from '../../entities/loan.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { AddInventoryItemDto } from './dto/add-inventory-item.dto';
import { CloseInventoryDto } from './dto/close-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    // Check if there's already an open inventory
    const openInventory = await this.inventoryRepository.findOne({
      where: { stoppedAt: IsNull() },
    });

    if (openInventory) {
      throw new BadRequestException('An inventory is already in progress');
    }

    // Count total available books (not deleted)
    const availableBookCount = await this.bookRepository.count({
      where: { deleted: 0 },
    });

    const inventory = this.inventoryRepository.create({
      startedAt: createInventoryDto.startedAt ? new Date(createInventoryDto.startedAt) : new Date(),
      stoppedAt: null,
      bookCount: 0,
      availableBookCount,
    });

    return this.inventoryRepository.save(inventory);
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      relations: ['items', 'items.book', 'items.foundAt', 'items.belongsAt'],
      order: { startedAt: 'DESC' },
    });
  }

  async findCurrent(): Promise<Inventory | null> {
    return this.inventoryRepository.findOne({
      where: { stoppedAt: IsNull() },
      relations: ['items', 'items.book', 'items.book.location', 'items.foundAt', 'items.belongsAt', 'items.book.loans', 'items.book.loans.borrower'],
    });
  }

  async findOne(id: number): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['items', 'items.book', 'items.book.location', 'items.foundAt', 'items.belongsAt'],
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return inventory;
  }

  async addItem(inventoryId: number, addItemDto: AddInventoryItemDto): Promise<InventoryItem> {
    const inventory = await this.findOne(inventoryId);

    if (inventory.stoppedAt) {
      throw new BadRequestException('Cannot add items to a closed inventory');
    }

    // Check if book exists and load its location
    const book = await this.bookRepository.findOne({
      where: { id: addItemDto.bookId },
      relations: ['location'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${addItemDto.bookId} not found`);
    }

    // Load foundAt location
    const foundAtLocation = await this.bookRepository.manager.getRepository('Location').findOne({
      where: { id: addItemDto.foundAtId },
    });

    if (!foundAtLocation) {
      throw new NotFoundException(`Location with ID ${addItemDto.foundAtId} not found`);
    }

    // Check if book is already in this inventory
    const existingItem = await this.inventoryItemRepository.findOne({
      where: {
        inventory: { id: inventoryId },
        book: { id: addItemDto.bookId },
      },
    });

    if (existingItem) {
      throw new BadRequestException('This book has already been added to the inventory');
    }

    // Create inventory item with relation objects
    const item = this.inventoryItemRepository.create({
      inventory,
      book,
      foundAt: foundAtLocation,
      belongsAt: book.location,
    });

    const savedItem = await this.inventoryItemRepository.save(item);

    // Increment book count
      await this.inventoryRepository.increment(
          { id: inventoryId },
          "bookCount",
          1
      );

    // Return item with relations
    return this.inventoryItemRepository.findOne({
      where: { id: savedItem.id },
      relations: ['book', 'book.location', 'foundAt', 'belongsAt', 'book.loans', 'book.loans.borrower'],
    });
  }

  async removeItem(inventoryId: number, itemId: number): Promise<void> {
    const inventory = await this.findOne(inventoryId);

    if (inventory.stoppedAt) {
      throw new BadRequestException('Cannot remove items from a closed inventory');
    }

    const item = await this.inventoryItemRepository.findOne({
      where: { id: itemId, inventory: { id : inventoryId } },
    });

    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${itemId} not found`);
    }

    await this.inventoryItemRepository.remove(item);

    // Decrement book count
    inventory.bookCount -= 1;
    await this.inventoryRepository.save(inventory);
  }

  async close(inventoryId: number, closeDto: CloseInventoryDto): Promise<Inventory> {
    const inventory = await this.findOne(inventoryId);

    if (inventory.stoppedAt) {
      throw new BadRequestException('Inventory is already closed');
    }

    const stoppedAt = closeDto.stoppedAt ? new Date(closeDto.stoppedAt) : new Date();

    // Get all book IDs in this inventory
    const bookIds = inventory.items.map(item => item.bookId);

    // Close all active loans for these books
    if (bookIds.length > 0) {
      await this.loanRepository
        .createQueryBuilder()
        .update(Loan)
        .set({ stoppedAt })
        .where('book_id IN (:...bookIds)', { bookIds })
        .andWhere('stopped_at IS NULL')
        .execute();
    }

    // Close the inventory
    inventory.stoppedAt = stoppedAt;
    return this.inventoryRepository.save(inventory);
  }

  async getItemsByLocation(inventoryId: number): Promise<{ [locationName: string]: InventoryItem[] }> {
    const inventory = await this.findOne(inventoryId);

    const grouped: { [locationName: string]: InventoryItem[] } = {};

    for (const item of inventory.items) {
      const locationName = item.belongsAt?.name || 'Unknown Location';
      if (!grouped[locationName]) {
        grouped[locationName] = [];
      }
      grouped[locationName].push(item);
    }

    return grouped;
  }

  async getMisplacedItems(inventoryId: number): Promise<InventoryItem[]> {
    const inventory = await this.findOne(inventoryId);

    return inventory.items.filter(item => item.foundAtId !== item.belongsAtId);
  }
}
