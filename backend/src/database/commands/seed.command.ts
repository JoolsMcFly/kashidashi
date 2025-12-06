import { Command, CommandRunner } from 'nest-commander';
import { UsersSeed } from '../seeds/users.seed';

@Command({
  name: 'seed',
  description: 'Seed the database with initial data',
})
export class SeedCommand extends CommandRunner {
  constructor(private readonly usersSeed: UsersSeed) {
    super();
  }

  async run(): Promise<void> {
    console.log('Starting database seeding...\n');

    try {
      await this.usersSeed.run();
      console.log('\n✓ Database seeding completed successfully!');
    } catch (error) {
      console.error('\n✗ Error during seeding:', error.message);
      throw error;
    }
  }
}
