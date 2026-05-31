import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  createLoan(@Body() createLoanDto: CreateLoanDto) {
    return this.loansService.createLoan(createLoanDto);
  }

  @Put(':id/return')
  returnBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() returnBookDto: ReturnBookDto,
  ) {
    return this.loansService.returnBook(id, returnBookDto.returnDate);
  }

  @Get()
  findAll(@Query('active') active?: string) {
    if (active === 'true') {
      return this.loansService.findActiveLoans();
    }
    return this.loansService.findAll();
  }

  @Get('overdue')
  findOverdue() {
    return this.loansService.findOverdueLoans();
  }

  @Get('overdue/export')
  async exportOverdue(@Res() res: Response) {
    const loans = await this.loansService.findOverdueLoans();
    const headers = [
      'Book code',
      'Borrower',
      'Book location',
      'Loan start date',
      'Duration in days',
      'Book title',
    ];
    const now = Date.now();
    const dayMs = 1000 * 60 * 60 * 24;
    const rows = loans.map((loan) => {
      const borrowerName = [loan.borrower?.surname, loan.borrower?.frenchSurname]
        .filter(Boolean)
        .join(' ');
      const startedAt = new Date(loan.startedAt);
      const duration = Math.floor((now - startedAt.getTime()) / dayMs);
      return [
        loan.book?.code ?? '',
        borrowerName,
        loan.book?.location?.name ?? '',
        startedAt.toISOString().slice(0, 10),
        duration,
        loan.book?.title ?? '',
      ];
    });
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => csvEscape(cell)).join(','))
      .join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="overdue-loans-${new Date().toISOString().slice(0, 10)}.csv"`,
    );
    res.send('﻿' + csv);
  }

  @Get('borrower/:borrowerId')
  findByBorrower(@Param('borrowerId', ParseIntPipe) borrowerId: number) {
    return this.loansService.findByBorrower(borrowerId);
  }

  @Get('book/:bookId')
  findByBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.loansService.findByBook(bookId);
  }
}

function csvEscape(value: string | number): string {
  const str = String(value ?? '');
  if (/[",\r\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}
