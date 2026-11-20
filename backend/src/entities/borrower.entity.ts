import { Transform } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, Index } from 'typeorm';
import { Loan } from './loan.entity';

/**
 * Soft-deleted borrowers keep their data in the DB, but it must not leak through
 * the API. Applied at serialization time only (ClassSerializerInterceptor), so
 * repository reads/saves and the XLSX export still see the real values.
 */
export const hideIfDeleted = () =>
  Transform(({ value, obj }) => (obj?.deletedAt ? null : value), { toPlainOnly: true });

@Entity('borrower')
@Index(['surname'])
export class Borrower {
  @PrimaryGeneratedColumn()
  id: number;

  @hideIfDeleted()
  @Column({ length: 100 })
  surname: string;

  @hideIfDeleted()
  @Column({ length: 100 })
  katakana: string;

  @hideIfDeleted()
  @Column({ name: 'french_surname', length: 100 })
  frenchSurname: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'deleted_at', type: 'datetime', nullable: true, default: null })
  deletedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  stats: string | null;

  @OneToMany(() => Loan, loan => loan.borrower)
  loans: Loan[];
}
