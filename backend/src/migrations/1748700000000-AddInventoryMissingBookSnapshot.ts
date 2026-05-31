import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInventoryMissingBookSnapshot1748700000000 implements MigrationInterface {
  name = 'AddInventoryMissingBookSnapshot1748700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('inventory', 'missing_snapshot_at');
    if (!hasColumn) {
      await queryRunner.query(`
        ALTER TABLE \`inventory\`
        ADD COLUMN \`missing_snapshot_at\` DATETIME NULL
      `);
    }

    const hasTable = await queryRunner.hasTable('inventory_missing_book');
    if (!hasTable) {
      await queryRunner.query(`
        CREATE TABLE \`inventory_missing_book\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`inventory_id\` INT NOT NULL,
          \`book_code\` INT NOT NULL,
          \`title\` VARCHAR(255) NULL,
          \`location\` VARCHAR(255) NULL,
          \`borrower\` VARCHAR(255) NULL,
          \`loan_start\` DATETIME NULL,
          PRIMARY KEY (\`id\`),
          KEY \`IDX_inventory_missing_book_inventory\` (\`inventory_id\`),
          CONSTRAINT \`FK_inventory_missing_book_inventory\`
            FOREIGN KEY (\`inventory_id\`) REFERENCES \`inventory\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`inventory_missing_book\``);
    const hasColumn = await queryRunner.hasColumn('inventory', 'missing_snapshot_at');
    if (hasColumn) {
      await queryRunner.query(`ALTER TABLE \`inventory\` DROP COLUMN \`missing_snapshot_at\``);
    }
  }
}
