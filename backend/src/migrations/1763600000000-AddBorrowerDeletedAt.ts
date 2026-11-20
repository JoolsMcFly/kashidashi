import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBorrowerDeletedAt1763600000000 implements MigrationInterface {
  name = 'AddBorrowerDeletedAt1763600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('borrower', 'deleted_at');
    if (!hasColumn) {
      await queryRunner.query(`
        ALTER TABLE \`borrower\`
        ADD COLUMN \`deleted_at\` DATETIME NULL DEFAULT NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('borrower', 'deleted_at');
    if (hasColumn) {
      await queryRunner.query(`ALTER TABLE \`borrower\` DROP COLUMN \`deleted_at\``);
    }
  }
}
