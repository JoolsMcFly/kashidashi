import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { UploadService } from './upload.service';
import { BorrowersService } from '../borrowers/borrowers.service';
import { BooksService } from '../books/books.service';
import { LocationsService } from '../locations/locations.service';
import { Borrower } from '../../entities';
import { TestDbModule, TestEntitiesModule, clearTables } from '../../test/test-db.helper';
import { createBorrower, resetCounter } from '../../test/seed.helper';

function xlsxFile(rows: Record<string, unknown>[]): Express.Multer.File {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Sheet1');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return { buffer } as Express.Multer.File;
}

describe('UploadService (integration)', () => {
  let service: UploadService;
  let dataSource: DataSource;
  let borrowerRepo: Repository<Borrower>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDbModule, TestEntitiesModule],
      providers: [UploadService, BorrowersService, BooksService, LocationsService],
    }).compile();

    service = module.get(UploadService);
    dataSource = module.get(DataSource);
    borrowerRepo = module.get(getRepositoryToken(Borrower));
  });

  beforeEach(async () => {
    resetCounter();
    await clearTables(dataSource);
  });

  describe('uploadBorrowers – Deleted ?', () => {
    const base = { Surname: 'Doe', 'French surname': 'Dupont', Katakana: 'ドウ' };

    it.each(['Yes', 'yes', 'YES', ' yes '])('marks new borrower deleted when "Deleted ?" is %p', async value => {
      const result = await service.uploadBorrowers(xlsxFile([{ ...base, 'Deleted ?': value }]));

      expect(result.created).toBe(1);
      const [b] = await borrowerRepo.find();
      expect(b.deletedAt).toBeInstanceOf(Date);
    });

    it.each(['No', 'no', '', 'oui'])('leaves new borrower active when "Deleted ?" is %p', async value => {
      await service.uploadBorrowers(xlsxFile([{ ...base, 'Deleted ?': value }]));

      const [b] = await borrowerRepo.find();
      expect(b.deletedAt).toBeNull();
    });

    it('marks an existing borrower deleted on update', async () => {
      const existing = await createBorrower(borrowerRepo);

      const result = await service.uploadBorrowers(
        xlsxFile([{ ID: existing.id, ...base, 'Deleted ?': 'Yes' }]),
      );

      expect(result.updated).toBe(1);
      const b = await borrowerRepo.findOneByOrFail({ id: existing.id });
      expect(b.deletedAt).toBeInstanceOf(Date);
    });

    it('restores an existing borrower when "Deleted ?" is No', async () => {
      const existing = await createBorrower(borrowerRepo, { deletedAt: new Date() });

      await service.uploadBorrowers(xlsxFile([{ ID: existing.id, ...base, 'Deleted ?': 'No' }]));

      const b = await borrowerRepo.findOneByOrFail({ id: existing.id });
      expect(b.deletedAt).toBeNull();
    });

    it('leaves deletedAt untouched when the column is absent', async () => {
      const existing = await createBorrower(borrowerRepo, { deletedAt: new Date() });

      await service.uploadBorrowers(xlsxFile([{ ID: existing.id, ...base }]));

      const b = await borrowerRepo.findOneByOrFail({ id: existing.id });
      expect(b.deletedAt).toBeInstanceOf(Date);
    });
  });
});
