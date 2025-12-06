import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Location } from './location.entity';
import { Loan } from './loan.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  title: string;

  @Column({ name: 'location_id' })
  locationId: number;

  @ManyToOne(() => Location, location => location.books)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ default: false })
  deleted: boolean;

  @OneToMany(() => Loan, loan => loan.book)
  loans: Loan[];
}
