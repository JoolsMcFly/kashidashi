import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersSeed } from './seeds/users.seed';
import { SeedCommand } from './commands/seed.command';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersSeed, SeedCommand],
})
export class DatabaseModule {}
