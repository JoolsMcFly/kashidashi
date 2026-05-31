import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThan } from 'typeorm';
import { Book } from '../../entities/book.entity';
import { Borrower } from '../../entities/borrower.entity';
import { Loan } from '../../entities/loan.entity';

export const OVERDUE_THRESHOLD_DAYS = 21;

export function overdueThresholdDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() - OVERDUE_THRESHOLD_DAYS);
  return date;
}

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Borrower)
    private borrowersRepository: Repository<Borrower>,
    @InjectRepository(Loan)
    private loansRepository: Repository<Loan>,
  ) {}

  async getStats() {
    const [books, borrowers, activeLoans, overdueLoans] = await Promise.all([
      this.booksRepository.count({ where: { deleted: 0 } }),
      this.borrowersRepository.count(),
      this.loansRepository.count({ where: { stoppedAt: IsNull() } }),
      this.loansRepository.count({
        where: {
          stoppedAt: IsNull(),
          startedAt: LessThan(overdueThresholdDate()),
        },
      }),
    ]);

    return {
      books,
      borrowers,
      loans: {
        count: activeLoans,
        overdue: overdueLoans,
      },
    };
  }
}
