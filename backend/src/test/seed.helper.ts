import { Repository } from 'typeorm';
import { Location, Book, Borrower, User, Loan } from '../entities';

let counter = 0;
const next = () => ++counter;

export function resetCounter() {
  counter = 0;
}

export async function createLocation(
  repo: Repository<Location>,
  overrides: Partial<Location> = {},
): Promise<Location> {
  return repo.save(
    repo.create({
      name: `Location ${next()}`,
      ...overrides,
    }),
  );
}

export async function createBook(
  repo: Repository<Book>,
  overrides: Partial<Book> = {},
): Promise<Book> {
  return repo.save(
    repo.create({
      code: next(),
      title: `Book ${counter}`,
      deleted: 0,
      ...overrides,
    }),
  );
}

export async function createBorrower(
  repo: Repository<Borrower>,
  overrides: Partial<Borrower> = {},
): Promise<Borrower> {
  const n = next();
  return repo.save(
    repo.create({
      surname: `Surname${n}`,
      katakana: `カタカナ${n}`,
      frenchSurname: `Nom${n}`,
      ...overrides,
    }),
  );
}

export async function createUser(
  repo: Repository<User>,
  overrides: Partial<User> = {},
): Promise<User> {
  const n = next();
  return repo.save(
    repo.create({
      email: `user${n}@test.com`,
      password: `hashed_${n}`,
      roles: ['ROLE_USER'],
      ...overrides,
    }),
  );
}

export async function createLoan(
  repo: Repository<Loan>,
  overrides: Partial<Loan> = {},
): Promise<Loan> {
  return repo.save(
    repo.create({
      startedAt: new Date(),
      stoppedAt: null,
      ...overrides,
    }),
  );
}
