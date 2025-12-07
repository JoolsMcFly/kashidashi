import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
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
