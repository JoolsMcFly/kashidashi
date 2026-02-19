import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { BorrowersService } from '../borrowers/borrowers.service';
import { BooksService } from '../books/books.service';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class UploadService {
  constructor(
    private borrowersService: BorrowersService,
    private booksService: BooksService,
    private locationsService: LocationsService,
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
      created: 0,
      updated: 0,
      failed: 0,
      errors: [],
    };

    for (const row of data as any[]) {
      try {
        const id = row.ID || row.id;
        const borrowerData = {
          surname: row.surname || row.Surname || '',
          katakana: row.katakana || row.Katakana || '',
          frenchSurname: row.frenchSurname || row.FrenchSurname || row['French surname'] || row.french_surname || '',
        };

        if (id) {
          await this.borrowersService.update(Number(id), borrowerData);
          results.updated++;
        } else {
          await this.borrowersService.create(borrowerData);
          results.created++;
        }
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
      created: 0,
      updated: 0,
      failed: 0,
      errors: [],
    };

    const locations = await this.locationsService.findAll();
    const locationLookup: Record<string, number> = {};
    for (const loc of locations) {
      if (loc.name) locationLookup[loc.name] = loc.id;
    }

    for (const row of data as any[]) {
      try {
        const locationName = row.Location || '';
        const locationId = locationLookup[locationName] || 1;

        const { isNew } = await this.booksService.upsertByCode({
          code: row.Code,
          title: row.Title,
          locationId,
          deleted: (row.deleted === true || row.deleted === 'true' ? 1 : 0) || 0,
        });
        if (isNew) {
          results.created++;
        } else {
          results.updated++;
        }
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
