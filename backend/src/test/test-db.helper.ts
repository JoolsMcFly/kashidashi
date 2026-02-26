import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  Location,
  Book,
  Borrower,
  User,
  Loan,
  Inventory,
  InventoryItem,
} from '../entities';

const allEntities = [Location, Book, Borrower, User, Loan, Inventory, InventoryItem];

export const TestDbModule = TypeOrmModule.forRoot({
  type: 'better-sqlite3',
  database: ':memory:',
  synchronize: true,
  dropSchema: true,
  entities: allEntities,
});

export const TestEntitiesModule = TypeOrmModule.forFeature(allEntities);

/**
 * Clears all tables in FK-safe order (children before parents).
 */
export async function clearTables(dataSource: DataSource): Promise<void> {
  // Disable FK checks for SQLite, truncate all, re-enable
  await dataSource.query('PRAGMA foreign_keys = OFF');
  for (const entity of dataSource.entityMetadatas) {
    await dataSource.query(`DELETE FROM "${entity.tableName}"`);
  }
  await dataSource.query('PRAGMA foreign_keys = ON');
}
