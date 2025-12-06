import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Borrower } from './borrower.entity';
import { Book } from './book.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'borrower_id' })
  borrowerId: number;

  @ManyToOne(() => Borrower, borrower => borrower.loans)
  @JoinColumn({ name: 'borrower_id' })
  borrower: Borrower;

  @Column({ name: 'book_id' })
  bookId: number;

  @ManyToOne(() => Book, book => book.loans)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'return_date', type: 'date', nullable: true })
  returnDate: Date | null;
}
