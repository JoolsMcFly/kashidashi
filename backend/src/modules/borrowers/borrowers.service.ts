import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Borrower } from '../../entities/borrower.entity';
import { CreateBorrowerDto } from './dto/create-borrower.dto';

@Injectable()
export class BorrowersService {
  constructor(
    @InjectRepository(Borrower)
    private borrowersRepository: Repository<Borrower>,
  ) {}

  async create(createBorrowerDto: CreateBorrowerDto): Promise<Borrower> {
    const borrower = this.borrowersRepository.create(createBorrowerDto);
    return this.borrowersRepository.save(borrower);
  }

  async search(query: string): Promise<Borrower[]> {
    return this.borrowersRepository.find({
      where: [
        { katakana: Like(`%${query}%`) },
        { frenchSurname: Like(`%${query}%`) },
      ],
      take: 20,
    });
  }

  async findOne(id: number): Promise<Borrower> {
    const borrower = await this.borrowersRepository.findOne({
      where: { id },
      relations: ['loans', 'loans.book', 'loans.book.location'],
    });

    if (!borrower) {
      throw new NotFoundException(`Borrower with ID ${id} not found`);
    }

    return borrower;
  }

  async findAll(): Promise<Borrower[]> {
    return this.borrowersRepository.find();
  }
}
