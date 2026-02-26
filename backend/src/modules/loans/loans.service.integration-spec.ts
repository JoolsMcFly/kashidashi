import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { LoansService } from './loans.service';
import { Loan, Book, Borrower, Location } from '../../entities';
import { TestDbModule, TestEntitiesModule, clearTables } from '../../test/test-db.helper';
import {
  createLocation,
  createBook,
  createBorrower,
  resetCounter,
} from '../../test/seed.helper';

describe('LoansService (integration)', () => {
  let service: LoansService;
  let dataSource: DataSource;
  let bookRepo: Repository<Book>;
  let borrowerRepo: Repository<Borrower>;
  let locationRepo: Repository<Location>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDbModule, TestEntitiesModule],
      providers: [LoansService],
    }).compile();

    service = module.get(LoansService);
    dataSource = module.get(DataSource);
    bookRepo = module.get(getRepositoryToken(Book));
    borrowerRepo = module.get(getRepositoryToken(Borrower));
    locationRepo = module.get(getRepositoryToken(Location));
  });

  beforeEach(async () => {
    resetCounter();
    await clearTables(dataSource);
  });

  describe('createLoan', () => {
    it('should persist a loan with correct fields', async () => {
      const location = await createLocation(locationRepo);
      const book = await createBook(bookRepo, { locationId: location.id });
      const borrower = await createBorrower(borrowerRepo);

      const loan = await service.createLoan({
        borrowerId: borrower.id,
        bookId: book.id,
      });

      expect(loan.id).toBeDefined();
      expect(loan.bookId).toBe(book.id);
      expect(loan.borrowerId).toBe(borrower.id);
      expect(loan.stoppedAt).toBeNull();
      expect(loan.startedAt).toBeInstanceOf(Date);
    });

    it('should reject duplicate active loan for same book', async () => {
      const location = await createLocation(locationRepo);
      const book = await createBook(bookRepo, { locationId: location.id });
      const borrower = await createBorrower(borrowerRepo);

      await service.createLoan({ borrowerId: borrower.id, bookId: book.id });

      await expect(
        service.createLoan({ borrowerId: borrower.id, bookId: book.id }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow re-loan after return', async () => {
      const location = await createLocation(locationRepo);
      const book = await createBook(bookRepo, { locationId: location.id });
      const b1 = await createBorrower(borrowerRepo);
      const b2 = await createBorrower(borrowerRepo);

      const first = await service.createLoan({ borrowerId: b1.id, bookId: book.id });
      await service.returnBook(first.id);

      const second = await service.createLoan({ borrowerId: b2.id, bookId: book.id });
      expect(second.id).not.toBe(first.id);
      expect(second.stoppedAt).toBeNull();
    });

    it('should use provided startedAt date', async () => {
      const location = await createLocation(locationRepo);
      const book = await createBook(bookRepo, { locationId: location.id });
      const borrower = await createBorrower(borrowerRepo);

      const loan = await service.createLoan({
        borrowerId: borrower.id,
        bookId: book.id,
        startedAt: '2025-06-15',
      });

      expect(loan.startedAt).toEqual(new Date('2025-06-15'));
    });
  });

  describe('returnBook', () => {
    it('should set stoppedAt on the loan', async () => {
      const location = await createLocation(locationRepo);
      const book = await createBook(bookRepo, { locationId: location.id });
      const borrower = await createBorrower(borrowerRepo);

      const loan = await service.createLoan({ borrowerId: borrower.id, bookId: book.id });
      const returned = await service.returnBook(loan.id);

      expect(returned.stoppedAt).toBeInstanceOf(Date);
    });

    it('should use provided stoppedAt date', async () => {
      const location = await createLocation(locationRepo);
      const book = await createBook(bookRepo, { locationId: location.id });
      const borrower = await createBorrower(borrowerRepo);

      const loan = await service.createLoan({ borrowerId: borrower.id, bookId: book.id });
      const returned = await service.returnBook(loan.id, '2025-07-01');

      expect(returned.stoppedAt).toEqual(new Date('2025-07-01'));
    });

    it('should throw NotFoundException for non-existent loan', async () => {
      await expect(service.returnBook(9999)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when already returned', async () => {
      const location = await createLocation(locationRepo);
      const book = await createBook(bookRepo, { locationId: location.id });
      const borrower = await createBorrower(borrowerRepo);

      const loan = await service.createLoan({ borrowerId: borrower.id, bookId: book.id });
      await service.returnBook(loan.id);

      await expect(service.returnBook(loan.id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByBorrower', () => {
    it('should return loans with book/location relations ordered DESC', async () => {
      const location = await createLocation(locationRepo);
      const book1 = await createBook(bookRepo, { locationId: location.id });
      const book2 = await createBook(bookRepo, { locationId: location.id });
      const borrower = await createBorrower(borrowerRepo);

      await service.createLoan({
        borrowerId: borrower.id,
        bookId: book1.id,
        startedAt: '2025-01-01',
      });
      await service.createLoan({
        borrowerId: borrower.id,
        bookId: book2.id,
        startedAt: '2025-06-01',
      });

      const loans = await service.findByBorrower(borrower.id);

      expect(loans).toHaveLength(2);
      expect(loans[0].startedAt.getTime()).toBeGreaterThan(loans[1].startedAt.getTime());
      expect(loans[0].book).toBeDefined();
      expect(loans[0].book.location).toBeDefined();
    });
  });

  describe('findByBook', () => {
    it('should return loans with borrower relation ordered DESC', async () => {
      const location = await createLocation(locationRepo);
      const book = await createBook(bookRepo, { locationId: location.id });
      const b1 = await createBorrower(borrowerRepo);
      const b2 = await createBorrower(borrowerRepo);

      const first = await service.createLoan({
        borrowerId: b1.id,
        bookId: book.id,
        startedAt: '2025-01-01',
      });
      await service.returnBook(first.id);

      await service.createLoan({
        borrowerId: b2.id,
        bookId: book.id,
        startedAt: '2025-06-01',
      });

      const loans = await service.findByBook(book.id);

      expect(loans).toHaveLength(2);
      expect(loans[0].startedAt.getTime()).toBeGreaterThan(loans[1].startedAt.getTime());
      expect(loans[0].borrower).toBeDefined();
    });
  });

  describe('findActiveLoans', () => {
    it('should only return loans with null stoppedAt and load all relations', async () => {
      const location = await createLocation(locationRepo);
      const book1 = await createBook(bookRepo, { locationId: location.id });
      const book2 = await createBook(bookRepo, { locationId: location.id });
      const borrower = await createBorrower(borrowerRepo);

      const returned = await service.createLoan({
        borrowerId: borrower.id,
        bookId: book1.id,
      });
      await service.returnBook(returned.id);

      await service.createLoan({
        borrowerId: borrower.id,
        bookId: book2.id,
      });

      const active = await service.findActiveLoans();

      expect(active).toHaveLength(1);
      expect(active[0].bookId).toBe(book2.id);
      expect(active[0].borrower).toBeDefined();
      expect(active[0].book).toBeDefined();
      expect(active[0].book.location).toBeDefined();
    });
  });
});
