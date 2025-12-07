import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { Location } from './location.entity';
import { Loan } from './loan.entity';

@Entity('book')
@Index(['title'])
@Index(['code'])
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'smallint' })
  code: number;

  @Column({ nullable: true, length: 255 })
  title: string | null;

  @Column({ name: 'location_id', nullable: true })
  locationId: number | null;

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location: Location | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'longtext', nullable: true })
  stats: string | null;

  @Column({ type: 'smallint', nullable: true })
  deleted: number | null;

  @OneToMany(() => Loan, loan => loan.book)
  loans: Loan[];
}
