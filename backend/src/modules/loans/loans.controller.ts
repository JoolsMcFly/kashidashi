import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
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

  @Get('borrower/:borrowerId')
  findByBorrower(@Param('borrowerId', ParseIntPipe) borrowerId: number) {
    return this.loansService.findByBorrower(borrowerId);
  }

  @Get('book/:bookId')
  findByBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.loansService.findByBook(bookId);
  }
}
