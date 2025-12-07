import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Inventory } from './inventory.entity';
import { Book } from './book.entity';
import { Location } from './location.entity';

@Entity('inventory_item')
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inventory)
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @RelationId((item: InventoryItem) => item.inventory)
  inventoryId: number;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @RelationId((item: InventoryItem) => item.book)
  bookId: number;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'found_at_id' })
  foundAt: Location;

  @RelationId((item: InventoryItem) => item.foundAt)
  foundAtId: number;

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'belongs_at_id' })
  belongsAt: Location | null;

  @RelationId((item: InventoryItem) => item.belongsAt)
  belongsAtId: number | null;
}
