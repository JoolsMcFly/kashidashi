import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Loan } from '../../entities/loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loansRepository: Repository<Loan>,
  ) {}

  async createLoan(createLoanDto: CreateLoanDto): Promise<Loan> {
    // Check if book is already loaned out
    const existingLoan = await this.loansRepository.findOne({
      where: {
        bookId: createLoanDto.bookId,
        returnDate: IsNull(),
      },
    });

    if (existingLoan) {
      throw new BadRequestException('This book is already loaned out');
    }

    const loan = this.loansRepository.create({
      ...createLoanDto,
      startDate: createLoanDto.startDate ? new Date(createLoanDto.startDate) : new Date(),
    });

    return this.loansRepository.save(loan);
  }

  async returnBook(loanId: number, returnDate?: string): Promise<Loan> {
    const loan = await this.loansRepository.findOne({
      where: { id: loanId },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${loanId} not found`);
    }

    if (loan.returnDate) {
      throw new BadRequestException('This book has already been returned');
    }

    loan.returnDate = returnDate ? new Date(returnDate) : new Date();
    return this.loansRepository.save(loan);
  }

  async findAll(): Promise<Loan[]> {
    return this.loansRepository.find({
      relations: ['borrower', 'book', 'book.location'],
    });
  }

  async findActiveLoans(): Promise<Loan[]> {
    return this.loansRepository.find({
      where: { returnDate: IsNull() },
      relations: ['borrower', 'book', 'book.location'],
    });
  }

  async findByBorrower(borrowerId: number): Promise<Loan[]> {
    return this.loansRepository.find({
      where: { borrowerId },
      relations: ['book', 'book.location'],
      order: { startDate: 'DESC' },
    });
  }

  async findByBook(bookId: number): Promise<Loan[]> {
    return this.loansRepository.find({
      where: { bookId },
      relations: ['borrower'],
      order: { startDate: 'DESC' },
    });
  }
}
