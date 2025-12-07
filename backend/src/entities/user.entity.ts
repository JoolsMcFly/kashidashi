import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Location } from './location.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, length: 100 })
  firstname: string | null;

  @Column({ nullable: true, length: 100 })
  surname: string | null;

  @Column({ length: 100 })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ length: 255 })
  roles: string;

  @Column({ name: 'location_id', nullable: true })
  locationId: number | null;

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location: Location | null;
}
