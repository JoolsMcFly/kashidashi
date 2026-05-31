import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId, Index } from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity('inventory_missing_book')
@Index(['inventory'])
export class InventoryMissingBook {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @RelationId((m: InventoryMissingBook) => m.inventory)
  inventoryId: number;

  @Column({ name: 'book_code', type: 'int' })
  bookCode: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  borrower: string | null;

  @Column({ name: 'loan_start', type: 'datetime', nullable: true })
  loanStart: Date | null;
}
