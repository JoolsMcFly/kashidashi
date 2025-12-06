import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Location } from '../entities/location.entity';
import { Borrower } from '../entities/borrower.entity';
import { Book } from '../entities/book.entity';
import { UsersSeed } from './seeds/users.seed';
import { LocationsSeed } from './seeds/locations.seed';
import { BorrowersSeed } from './seeds/borrowers.seed';
import { BooksSeed } from './seeds/books.seed';
import { SeedCommand } from './commands/seed.command';

@Module({
  imports: [TypeOrmModule.forFeature([User, Location, Borrower, Book])],
  providers: [UsersSeed, LocationsSeed, BorrowersSeed, BooksSeed, SeedCommand],
})
export class DatabaseModule {}
