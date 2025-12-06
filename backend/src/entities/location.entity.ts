import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from './book.entity';
import { User } from './user.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Book, book => book.location)
  books: Book[];

  @OneToMany(() => User, user => user.location)
  users: User[];
}
