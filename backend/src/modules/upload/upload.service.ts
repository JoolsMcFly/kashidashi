import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { BorrowersService } from '../borrowers/borrowers.service';
import { BooksService } from '../books/books.service';

@Injectable()
export class UploadService {
  constructor(
    private borrowersService: BorrowersService,
    private booksService: BooksService,
  ) {}

  async uploadBorrowers(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const row of data as any[]) {
      try {
        await this.borrowersService.create({
          firstname: row.firstname || row.Firstname || '',
          surname: row.surname || row.Lastname || '',
          katakana: row.katakana || row.Katakana || '',
          frenchSurname: row.frenchSurname || row.FrenchSurname || row.french_surname || '',
        });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row,
          error: error.message,
        });
      }
    }

    return results;
  }

  async uploadBooks(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const row of data as any[]) {
      try {
        await this.booksService.upsertByCode({
          code: row.code || row.Code || '',
          title: row.title || row.Title || '',
          locationId: parseInt(row.locationId || row.LocationId || row.location_id || '1'),
          deleted: (row.deleted === true || row.deleted === 'true' ? 1 : 0) || 0,
        });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row,
          error: error.message,
        });
      }
    }

    return results;
  }
}
