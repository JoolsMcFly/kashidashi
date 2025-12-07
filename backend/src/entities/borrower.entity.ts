import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, Index } from 'typeorm';
import { Loan } from './loan.entity';

@Entity('borrower')
@Index(['surname', 'firstname'])
export class Borrower {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 100 })
  firstname: string | null;

  @Column({ length: 100 })
  surname: string;

  @Column({ length: 100 })
  katakana: string;

  @Column({ name: 'french_surname', length: 100 })
  frenchSurname: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'longtext', nullable: true })
  stats: string | null;

  @OneToMany(() => Loan, loan => loan.borrower)
  loans: Loan[];
}
