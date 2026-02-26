import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BooksService } from './books.service';
import { Book, Loan, Borrower, Location } from '../../entities';
import { TestDbModule, TestEntitiesModule, clearTables } from '../../test/test-db.helper';
import {
  createLocation,
  createBook,
  createBorrower,
  createLoan,
  resetCounter,
} from '../../test/seed.helper';

describe('BooksService (integration)', () => {
  let service: BooksService;
  let dataSource: DataSource;
  let bookRepo: Repository<Book>;
  let loanRepo: Repository<Loan>;
  let borrowerRepo: Repository<Borrower>;
  let locationRepo: Repository<Location>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDbModule, TestEntitiesModule],
      providers: [BooksService],
    }).compile();

    service = module.get(BooksService);
    dataSource = module.get(DataSource);
    bookRepo = module.get(getRepositoryToken(Book));
    loanRepo = module.get(getRepositoryToken(Loan));
    borrowerRepo = module.get(getRepositoryToken(Borrower));
    locationRepo = module.get(getRepositoryToken(Location));
  });

  beforeEach(async () => {
    resetCounter();
    await clearTables(dataSource);
  });

  describe('upsertByCode', () => {
    it('should create a new book when code does not exist', async () => {
      const location = await createLocation(locationRepo);

      const result = await service.upsertByCode({
        code: 101,
        title: 'New Book',
        locationId: location.id,
      });

      expect(result.isNew).toBe(true);
      expect(result.book.id).toBeDefined();
      expect(result.book.code).toBe(101);
      expect(result.book.title).toBe('New Book');
    });

    it('should update existing book and preserve ID', async () => {
      const location = await createLocation(locationRepo);
      const book = await createBook(bookRepo, {
        code: 101,
        title: 'Old Title',
        locationId: location.id,
      });

      const result = await service.upsertByCode({
        code: 101,
        title: 'New Title',
        locationId: location.id,
      });

      expect(result.isNew).toBe(false);
      expect(result.book.id).toBe(book.id);
      expect(result.book.title).toBe('New Title');
    });
  });

  describe('findOne', () => {
    it('should return book with relations', async () => {
      const location = await createLocation(locationRepo);
      const book = await createBook(bookRepo, { locationId: location.id });

      const result = await service.findOne(book.id);

      expect(result.id).toBe(book.id);
      expect(result.location).toBeDefined();
      expect(result.location!.id).toBe(location.id);
      expect(result.loans).toBeDefined();
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      await expect(service.findOne(9999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCode', () => {
    it('should return book by code with relations', async () => {
      const location = await createLocation(locationRepo);
      const book = await createBook(bookRepo, { code: 42, locationId: location.id });

      const result = await service.findByCode(42);

      expect(result.id).toBe(book.id);
      expect(result.location).toBeDefined();
    });

    it('should throw NotFoundException when code not found', async () => {
      await expect(service.findByCode(9999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCurrentLoan', () => {
    it('should return the active loan from real data', async () => {
      const location = await createLocation(locationRepo);
      const book = await createBook(bookRepo, { locationId: location.id });
      const borrower = await createBorrower(borrowerRepo);

      await createLoan(loanRepo, {
        bookId: book.id,
        borrowerId: borrower.id,
        stoppedAt: null,
      });

      const result = await service.getCurrentLoan(book.id);

      expect(result).not.toBeNull();
      expect(result!.borrower).toBeDefined();
      expect(result!.borrower.id).toBe(borrower.id);
    });

    it('should return null when all loans are returned', async () => {
      const location = await createLocation(locationRepo);
      const book = await createBook(bookRepo, { locationId: location.id });
      const borrower = await createBorrower(borrowerRepo);

      await createLoan(loanRepo, {
        bookId: book.id,
        borrowerId: borrower.id,
        stoppedAt: new Date(),
      });

      const result = await service.getCurrentLoan(book.id);

      expect(result).toBeNull();
    });

    it('should throw NotFoundException when book not found', async () => {
      await expect(service.getCurrentLoan(9999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchByCode', () => {
    it('should match by code and exclude deleted books', async () => {
      const location = await createLocation(locationRepo);
      await createBook(bookRepo, { code: 42, locationId: location.id, deleted: 0 });
      await createBook(bookRepo, { code: 42, locationId: location.id, deleted: 1 });

      const results = await service.searchByCode('42');

      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(42);
      expect(results[0].location).toBeDefined();
    });

    it('should limit results to 10', async () => {
      const location = await createLocation(locationRepo);
      for (let i = 0; i < 12; i++) {
        await createBook(bookRepo, { code: 7, locationId: location.id, deleted: 0 });
      }

      const results = await service.searchByCode('7');

      expect(results).toHaveLength(10);
    });
  });

  describe('findAll', () => {
    it('should exclude deleted books and load location', async () => {
      const location = await createLocation(locationRepo);
      await createBook(bookRepo, { locationId: location.id, deleted: 0 });
      await createBook(bookRepo, { locationId: location.id, deleted: 0 });
      await createBook(bookRepo, { locationId: location.id, deleted: 1 });

      const results = await service.findAll();

      expect(results).toHaveLength(2);
      expect(results[0].location).toBeDefined();
    });
  });

  describe('getStats', () => {
    it('should return total and onLoan counts from real data', async () => {
      const location = await createLocation(locationRepo);
      const book1 = await createBook(bookRepo, { locationId: location.id, deleted: 0 });
      const book2 = await createBook(bookRepo, { locationId: location.id, deleted: 0 });
      await createBook(bookRepo, { locationId: location.id, deleted: 0 });
      await createBook(bookRepo, { locationId: location.id, deleted: 1 });
      const borrower = await createBorrower(borrowerRepo);

      // book1 has an active loan
      await createLoan(loanRepo, {
        bookId: book1.id,
        borrowerId: borrower.id,
        stoppedAt: null,
      });
      // book2 has a returned loan — should NOT count as on loan
      await createLoan(loanRepo, {
        bookId: book2.id,
        borrowerId: borrower.id,
        stoppedAt: new Date(),
      });

      const stats = await service.getStats();

      expect(stats.total).toBe(3); // 3 non-deleted
      expect(stats.onLoan).toBeGreaterThanOrEqual(1);
    });
  });
});
