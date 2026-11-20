import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull } from 'typeorm';
import { Borrower } from '../../entities/borrower.entity';
import { CreateBorrowerDto } from './dto/create-borrower.dto';

export type BorrowerWriteData = Partial<CreateBorrowerDto> & {
  /** true → mark deleted (keeps an existing deleted_at), false → clear, undefined → leave as is */
  deleted?: boolean;
};

export const BORROWER_DELETED_AT_HEADER = 'Deleted At';

@Injectable()
export class BorrowersService {
  constructor(
    @InjectRepository(Borrower)
    private borrowersRepository: Repository<Borrower>,
  ) {}

  async create(data: BorrowerWriteData): Promise<Borrower> {
    const { deleted, ...fields } = data;
    const borrower = this.borrowersRepository.create(fields);
    this.applyDeleted(borrower, deleted);
    return this.borrowersRepository.save(borrower);
  }

  async update(id: number, data: BorrowerWriteData): Promise<Borrower> {
    const borrower = await this.borrowersRepository.findOne({ where: { id } });
    if (!borrower) {
      throw new NotFoundException(`Borrower with ID ${id} not found`);
    }
    const { deleted, ...fields } = data;
    Object.assign(borrower, fields);
    this.applyDeleted(borrower, deleted);
    return this.borrowersRepository.save(borrower);
  }

  private applyDeleted(borrower: Borrower, deleted: boolean | undefined): void {
    if (deleted === undefined) return;
    borrower.deletedAt = deleted ? (borrower.deletedAt ?? new Date()) : null;
  }

  async getExportRows(): Promise<Record<string, string | number>[]> {
    const borrowers = await this.borrowersRepository.find({ order: { id: 'ASC' } });
    return borrowers.map(b => ({
      ID: b.id,
      Surname: b.surname,
      'French surname': b.frenchSurname,
      Katakana: b.katakana,
      [BORROWER_DELETED_AT_HEADER]: b.deletedAt ? 'Yes' : 'No',
    }));
  }

  async search(query: string): Promise<Borrower[]> {
    return this.borrowersRepository.find({
      where: [
        { katakana: Like(`%${query}%`), deletedAt: IsNull() },
        { frenchSurname: Like(`%${query}%`), deletedAt: IsNull() },
        { surname: Like(`%${query}%`), deletedAt: IsNull() },
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

  async getStats() {
    const total = await this.borrowersRepository.count({ where: { deletedAt: IsNull() } });

    return {
      total,
    };
  }
}
