import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, Index } from 'typeorm';
import { Book } from './book.entity';
import { User } from './user.entity';

@Entity('location')
@Index(['name'])
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 255 })
  name: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Book, book => book.location)
  books: Book[];

  @OneToMany(() => User, user => user.location)
  users: User[];
}
