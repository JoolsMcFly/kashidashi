import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Book } from '../../entities/book.entity';
import { Borrower } from '../../entities/borrower.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Borrower])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
