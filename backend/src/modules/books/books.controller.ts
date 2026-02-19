import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
import * as XLSX from 'xlsx';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.booksService.searchByCode(query);
  }

  @Get('stats/count')
  async getStats() {
    return this.booksService.getStats();
  }

  @Get('download')
  async download(@Res() res: Response) {
    const books = await this.booksService.findAll();
    const data = books.map(b => ({
      Code: b.code,
      Title: b.title,
      Location: b.location?.name || '',
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Books');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=books.xlsx');
    res.send(buffer);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: number) {
    return this.booksService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Get(':id/current-loan')
  getCurrentLoan(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.getCurrentLoan(id);
  }

  @Get(':id/borrow-count')
  getBorrowCount(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.getBorrowCount(id);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }
}
