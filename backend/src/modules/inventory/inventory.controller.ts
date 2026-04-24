import { Controller, Get, Post, Delete, Body, Param, Res, UseGuards, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import * as XLSX from 'xlsx';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { AddInventoryItemDto } from './dto/add-inventory-item.dto';
import { CloseInventoryDto } from './dto/close-inventory.dto';
import { Put } from "@nestjs/common";

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

  @Get(':id/stats')
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getStats(id);
  }

  @Get(':id/download/books-to-move')
  async downloadBooksToMove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const rows = await this.inventoryService.getBooksToMove(id);
    const data = rows.map(r => ({
      Code: r.code,
      Title: r.title,
      'Move To': r.previousLocation,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Books to move');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=inventory-${id}-books-to-move.xlsx`);
    res.send(buffer);
  }

  @Get(':id/download/missing')
  async downloadMissingBooks(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const rows = await this.inventoryService.getMissingBooks(id);
    const data = rows.map(r => ({
      Code: r.code,
      Title: r.title,
      Location: r.location,
      'Borrowed by': r.borrower,
      'Borrowed since': r.loanStart,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Missing books');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=inventory-${id}-missing-books.xlsx`);
    res.send(buffer);
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

  @Put(':id/close')
  @UseGuards(AdminGuard)
  close(
    @Param('id', ParseIntPipe) id: number,
    @Body() closeDto: CloseInventoryDto,
  ) {
    return this.inventoryService.close(id, closeDto);
  }
}
