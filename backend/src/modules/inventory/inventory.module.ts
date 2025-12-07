import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from '../../entities/inventory.entity';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { Book } from '../../entities/book.entity';
import { Loan } from '../../entities/loan.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, InventoryItem, Book, Loan])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
