import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('borrowers')
  @UseInterceptors(FileInterceptor('file'))
  uploadBorrowers(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadBorrowers(file);
  }

  @Post('books')
  @UseInterceptors(FileInterceptor('file'))
  uploadBooks(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadBooks(file);
  }
}
