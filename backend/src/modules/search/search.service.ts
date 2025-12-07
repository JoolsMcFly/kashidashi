import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from '../../entities/book.entity';
import { Borrower } from '../../entities/borrower.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Borrower)
    private borrowersRepository: Repository<Borrower>,
  ) {}

  async search(query: string) {
    if (!query || !query.trim()) {
      return {
        books: [],
        borrowers: [],
      };
    }

    // Check if query contains any digits - if so, search books by code
    const hasDigits = /\d/.test(query);

    let books = [];
    let borrowers = [];

    if (hasDigits) {
      // Search books by code
      books = await this.booksRepository.find({
        where: {
          code: Number(query),
          deleted: 0,
        },
        relations: ['location'],
        take: 10,
      });
    } else {
      // Search borrowers by katakana or French surname
      borrowers = await this.borrowersRepository.find({
        where: [
          { katakana: Like(`%${query}%`) },
          { frenchSurname: Like(`%${query}%`) },
        ],
        take: 20,
      });
    }

    return {
      books,
      borrowers,
    };
  }
}
