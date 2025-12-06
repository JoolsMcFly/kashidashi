import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull } from 'typeorm';
import { Book } from '../../entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(book);
  }

  async upsertByCode(createBookDto: CreateBookDto): Promise<Book> {
    const existingBook = await this.booksRepository.findOne({
      where: { code: createBookDto.code },
    });

    if (existingBook) {
      Object.assign(existingBook, createBookDto);
      return this.booksRepository.save(existingBook);
    }

    return this.create(createBookDto);
  }

  async searchByCode(query: string): Promise<Book[]> {
    return this.booksRepository.find({
      where: {
        code: Like(`%${query}%`),
        deleted: false,
      },
      relations: ['location'],
      take: 10,
    });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: ['location', 'loans', 'loans.borrower'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async findByCode(code: string): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { code },
      relations: ['location', 'loans', 'loans.borrower'],
    });

    if (!book) {
      throw new NotFoundException(`Book with code ${code} not found`);
    }

    return book;
  }

  async getCurrentLoan(bookId: number) {
    const book = await this.booksRepository.findOne({
      where: { id: bookId },
      relations: ['loans', 'loans.borrower'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    const currentLoan = book.loans.find(loan => loan.returnDate === null);
    return currentLoan || null;
  }

  async getBorrowCount(bookId: number): Promise<number> {
    const book = await this.booksRepository.findOne({
      where: { id: bookId },
      relations: ['loans'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    return book.loans.length;
  }

  async findAll(): Promise<Book[]> {
    return this.booksRepository.find({
      where: { deleted: false },
      relations: ['location'],
    });
  }

  async getStats() {
    const total = await this.booksRepository.count({
      where: { deleted: false },
    });

    const booksWithLoans = await this.booksRepository
      .createQueryBuilder('book')
      .leftJoin('book.loans', 'loan')
      .where('book.deleted = :deleted', { deleted: false })
      .andWhere('loan.returnDate IS NULL')
      .getCount();

    return {
      total,
      onLoan: booksWithLoans,
    };
  }
}
