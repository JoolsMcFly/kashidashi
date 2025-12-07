import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'started_at', type: 'datetime' })
  startedAt: Date;

  @Column({ name: 'stopped_at', type: 'datetime', nullable: true })
  stoppedAt: Date | null;

  @Column({ name: 'book_count', type: 'int', default: 0 })
  bookCount: number;

  @Column({ name: 'available_book_count', type: 'int', default: 0 })
  availableBookCount: number;

  @OneToMany(() => InventoryItem, item => item.inventory)
  items: InventoryItem[];
}
