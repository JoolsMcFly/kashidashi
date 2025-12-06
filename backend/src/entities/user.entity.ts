import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Location } from './location.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ name: 'location_id', nullable: true })
  locationId: number | null;

  @ManyToOne(() => Location, location => location.users, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location: Location | null;
}
