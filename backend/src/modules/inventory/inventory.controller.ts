import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { AddInventoryItemDto } from './dto/add-inventory-item.dto';
import { CloseInventoryDto } from './dto/close-inventory.dto';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('current')
  findCurrent() {
    return this.inventoryService.findCurrent();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.findOne(id);
  }

  @Get(':id/misplaced')
  getMisplacedItems(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getMisplacedItems(id);
  }

  @Get(':id/by-location')
  getItemsByLocation(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getItemsByLocation(id);
  }

  @Post(':id/items')
  addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() addItemDto: AddInventoryItemDto,
  ) {
    return this.inventoryService.addItem(id, addItemDto);
  }

  @Delete(':id/items/:itemId')
  removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.inventoryService.removeItem(id, itemId);
  }

  @Post(':id/close')
  @UseGuards(AdminGuard)
  close(
    @Param('id', ParseIntPipe) id: number,
    @Body() closeDto: CloseInventoryDto,
  ) {
    return this.inventoryService.close(id, closeDto);
  }
}
