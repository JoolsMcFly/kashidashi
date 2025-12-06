import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { BorrowersModule } from '../borrowers/borrowers.module';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [BorrowersModule, BooksModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
