import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';
import { BorrowersService } from './borrowers.service';
import { Borrower } from '../../entities';
import { TestDbModule, TestEntitiesModule, clearTables } from '../../test/test-db.helper';
import { createBorrower, resetCounter } from '../../test/seed.helper';

describe('BorrowersService (integration)', () => {
  let service: BorrowersService;
  let dataSource: DataSource;
  let borrowerRepo: Repository<Borrower>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDbModule, TestEntitiesModule],
      providers: [BorrowersService],
    }).compile();

    service = module.get(BorrowersService);
    dataSource = module.get(DataSource);
    borrowerRepo = module.get(getRepositoryToken(Borrower));
  });

  beforeEach(async () => {
    resetCounter();
    await clearTables(dataSource);
  });

  describe('create', () => {
    it('leaves deletedAt null by default', async () => {
      const b = await service.create({ surname: 'A', katakana: 'ア', frenchSurname: 'A' });
      expect(b.deletedAt).toBeNull();
    });

    it('sets deletedAt when deleted is true', async () => {
      const b = await service.create({ surname: 'A', katakana: 'ア', frenchSurname: 'A', deleted: true });
      expect(b.deletedAt).toBeInstanceOf(Date);
    });
  });

  describe('update', () => {
    it('sets deletedAt to now when deleted is true', async () => {
      const existing = await createBorrower(borrowerRepo);
      const before = Date.now();

      const b = await service.update(existing.id, { deleted: true });

      expect(b.deletedAt).toBeInstanceOf(Date);
      expect(b.deletedAt!.getTime()).toBeGreaterThanOrEqual(before - 1000);
    });

    it('keeps the original deletedAt when already deleted', async () => {
      const original = new Date('2025-01-01T00:00:00Z');
      const existing = await createBorrower(borrowerRepo, { deletedAt: original });

      const b = await service.update(existing.id, { deleted: true });

      expect(b.deletedAt!.getTime()).toBe(original.getTime());
    });

    it('clears deletedAt when deleted is false', async () => {
      const existing = await createBorrower(borrowerRepo, { deletedAt: new Date() });

      const b = await service.update(existing.id, { deleted: false });

      expect(b.deletedAt).toBeNull();
    });

    it('does not touch deletedAt when deleted is omitted', async () => {
      const existing = await createBorrower(borrowerRepo, { deletedAt: new Date() });

      const b = await service.update(existing.id, { surname: 'Renamed' });

      expect(b.surname).toBe('Renamed');
      expect(b.deletedAt).toBeInstanceOf(Date);
    });
  });

  describe('search', () => {
    it('excludes soft-deleted borrowers', async () => {
      const active = await createBorrower(borrowerRepo, { surname: 'Tanaka' });
      await createBorrower(borrowerRepo, { surname: 'Tanaka', deletedAt: new Date() });

      const results = await service.search('Tanaka');

      expect(results.map(b => b.id)).toEqual([active.id]);
    });
  });

  describe('API serialization', () => {
    it('hides personal fields of a deleted borrower', async () => {
      const b = await createBorrower(borrowerRepo, { deletedAt: new Date(), stats: 'x' });

      const plain = instanceToPlain(await service.findOne(b.id));

      expect(plain.id).toBe(b.id);
      expect(plain.surname).toBeNull();
      expect(plain.katakana).toBeNull();
      expect(plain.frenchSurname).toBeNull();
      expect(plain.stats).toBe('x');
      expect(plain.deletedAt).toBeDefined();
    });

    it('hides a deleted borrower nested in a loan', async () => {
      const b = await createBorrower(borrowerRepo, { deletedAt: new Date() });
      const plain = instanceToPlain({ loans: [{ borrower: await borrowerRepo.findOneByOrFail({ id: b.id }) }] });

      expect(plain.loans[0].borrower.surname).toBeNull();
    });

    it('keeps data of active borrowers', async () => {
      const b = await createBorrower(borrowerRepo);

      const plain = instanceToPlain(await service.findOne(b.id));

      expect(plain.surname).toBe(b.surname);
      expect(plain.katakana).toBe(b.katakana);
    });

    it('does not affect the export rows', async () => {
      const b = await createBorrower(borrowerRepo, { deletedAt: new Date() });

      const rows = await service.getExportRows();

      expect(rows[0].Surname).toBe(b.surname);
    });
  });

  describe('getExportRows', () => {
    it('includes a "Deleted At" column with Yes/No', async () => {
      const active = await createBorrower(borrowerRepo);
      const deleted = await createBorrower(borrowerRepo, { deletedAt: new Date() });

      const rows = await service.getExportRows();

      expect(rows).toEqual([
        {
          ID: active.id,
          Surname: active.surname,
          'French surname': active.frenchSurname,
          Katakana: active.katakana,
          'Deleted At': 'No',
        },
        {
          ID: deleted.id,
          Surname: deleted.surname,
          'French surname': deleted.frenchSurname,
          Katakana: deleted.katakana,
          'Deleted At': 'Yes',
        },
      ]);
    });
  });
});
