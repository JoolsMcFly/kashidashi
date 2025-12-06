import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Loan } from './loan.entity';

@Entity('borrowers')
export class Borrower {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  katakana: string;

  @Column({ name: 'french_surname' })
  frenchSurname: string;

  @OneToMany(() => Loan, loan => loan.borrower)
  loans: Loan[];
}
