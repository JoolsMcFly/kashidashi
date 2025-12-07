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
        stoppedAt: IsNull(),
      },
    });

    if (existingLoan) {
      throw new BadRequestException('This book is already loaned out');
    }

    const loan = this.loansRepository.create({
      borrowerId: createLoanDto.borrowerId,
      bookId: createLoanDto.bookId,
      creatorId: createLoanDto.creatorId || null,
      startedAt: createLoanDto.startedAt ? new Date(createLoanDto.startedAt) : new Date(),
      stoppedAt: null,
    });

    return this.loansRepository.save(loan);
  }

  async returnBook(loanId: number, stoppedAt?: string): Promise<Loan> {
    const loan = await this.loansRepository.findOne({
      where: { id: loanId },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${loanId} not found`);
    }

    if (loan.stoppedAt) {
      throw new BadRequestException('This book has already been returned');
    }

    loan.stoppedAt = stoppedAt ? new Date(stoppedAt) : new Date();
    return this.loansRepository.save(loan);
  }

  async findAll(): Promise<Loan[]> {
    return this.loansRepository.find({
      relations: ['borrower', 'book', 'book.location', 'creator'],
    });
  }

  async findActiveLoans(): Promise<Loan[]> {
    return this.loansRepository.find({
      where: { stoppedAt: IsNull() },
      relations: ['borrower', 'book', 'book.location', 'creator'],
    });
  }

  async findByBorrower(borrowerId: number): Promise<Loan[]> {
    return this.loansRepository.find({
      where: { borrowerId },
      relations: ['book', 'book.location', 'creator'],
      order: { startedAt: 'DESC' },
    });
  }

  async findByBook(bookId: number): Promise<Loan[]> {
    return this.loansRepository.find({
      where: { bookId },
      relations: ['borrower', 'creator'],
      order: { startedAt: 'DESC' },
    });
  }
}
