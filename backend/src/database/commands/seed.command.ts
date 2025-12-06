import { Command, CommandRunner } from 'nest-commander';
import { UsersSeed } from '../seeds/users.seed';
import { LocationsSeed } from '../seeds/locations.seed';
import { BorrowersSeed } from '../seeds/borrowers.seed';
import { BooksSeed } from '../seeds/books.seed';

@Command({
  name: 'seed',
  description: 'Seed the database with initial data',
})
export class SeedCommand extends CommandRunner {
  constructor(
    private readonly usersSeed: UsersSeed,
    private readonly locationsSeed: LocationsSeed,
    private readonly borrowersSeed: BorrowersSeed,
    private readonly booksSeed: BooksSeed,
  ) {
    super();
  }

  async run(): Promise<void> {
    console.log('Starting database seeding...\n');

    try {
      await this.locationsSeed.run();
      await this.usersSeed.run();
      await this.borrowersSeed.run();
      await this.booksSeed.run();
      console.log('\n✓ Database seeding completed successfully!');
    } catch (error) {
      console.error('\n✗ Error during seeding:', error.message);
      throw error;
    }
  }
}
