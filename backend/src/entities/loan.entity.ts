import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Borrower } from './borrower.entity';
import { Book } from './book.entity';
import { User } from './user.entity';

@Entity('loan')
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'book_id' })
  bookId: number;

  @ManyToOne(() => Book, book => book.loans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ name: 'borrower_id' })
  borrowerId: number;

  @ManyToOne(() => Borrower, borrower => borrower.loans)
  @JoinColumn({ name: 'borrower_id' })
  borrower: Borrower;

  @Column({ name: 'creator_id', nullable: true })
  creatorId: number | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'creator_id' })
  creator: User | null;

  @Column({ name: 'started_at', type: 'datetime' })
  startedAt: Date;

  @Column({ name: 'stopped_at', type: 'datetime', nullable: true })
  stoppedAt: Date | null;
}
