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
import { BorrowersService } from './borrowers.service';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('borrowers')
@UseGuards(JwtAuthGuard)
export class BorrowersController {
  constructor(private readonly borrowersService: BorrowersService) {}

  @Post()
  create(@Body() createBorrowerDto: CreateBorrowerDto) {
    return this.borrowersService.create(createBorrowerDto);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.borrowersService.search(query);
  }

  @Get('stats/count')
  async getStats() {
    return this.borrowersService.getStats();
  }

  @Get('download')
  async download(@Res() res: Response) {
    const borrowers = await this.borrowersService.findAll();
    const data = borrowers.map(b => ({
      ID: b.id,
      Surname: b.surname,
      'French surname': b.frenchSurname,
      Katakana: b.katakana,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Borrowers');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=borrowers.xlsx');
    res.send(buffer);
  }

  @Get()
  findAll() {
    return this.borrowersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.borrowersService.findOne(id);
  }
}
