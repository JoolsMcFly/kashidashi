import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../../entities';
import { TestDbModule, TestEntitiesModule, clearTables } from '../../test/test-db.helper';

jest.setTimeout(30000);

describe('AuthService (integration)', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let dataSource: DataSource;
  let userRepo: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDbModule,
        TestEntitiesModule,
        JwtModule.register({ secret: 'test-secret' }),
      ],
      providers: [AuthService, UsersService],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    dataSource = module.get(DataSource);
    userRepo = module.get(getRepositoryToken(User));
  });

  beforeEach(async () => {
    await clearTables(dataSource);
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      const user = await usersService.create({
        email: 'alice@test.com',
        password: 'secret123',
        firstname: 'Alice',
        surname: 'Smith',
        locationId: null,
      });

      const result = await authService.validateUser('alice@test.com', 'secret123');

      expect(result).toEqual({
        userId: user.id,
        email: 'alice@test.com',
        roles: ['ROLE_USER'],
        firstname: 'Alice',
        surname: 'Smith',
        locationId: null,
      });
    });

    it('should return null when user not found', async () => {
      const result = await authService.validateUser('nobody@test.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      await usersService.create({
        email: 'bob@test.com',
        password: 'correct',
      });

      const result = await authService.validateUser('bob@test.com', 'wrong');
      expect(result).toBeNull();
    });

    it('should convert PHP $2y$ hash to $2b$ for bcrypt compatibility', async () => {
      // Create a user, then manually overwrite the hash with a $2y$ variant
      const user = await usersService.create({
        email: 'php@test.com',
        password: 'mypassword',
      });

      // Take the stored $2b$ hash and replace prefix with $2y$ to simulate a PHP hash
      const storedHash = (await userRepo.findOneBy({ id: user.id }))!.password;
      const phpHash = storedHash.replace(/^\$2b\$/, '$2y$');
      await userRepo.update(user.id, { password: phpHash });

      // Should still validate because the service normalises $2y$ → $2b$
      const result = await authService.validateUser('php@test.com', 'mypassword');
      expect(result).not.toBeNull();
      expect(result!.email).toBe('php@test.com');
    });
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      const user = {
        userId: 1,
        email: 'user@test.com',
        roles: ['ROLE_USER'],
        firstname: 'John',
        surname: 'Doe',
        locationId: 2,
      };

      const result = await authService.login(user);

      expect(result.access_token).toBeDefined();
      expect(typeof result.access_token).toBe('string');
      expect(result.user).toEqual({
        id: 1,
        email: 'user@test.com',
        roles: ['ROLE_USER'],
        firstname: 'John',
        surname: 'Doe',
        locationId: 2,
      });
    });

    it('should sign JWT with correct payload', async () => {
      const user = {
        userId: 42,
        email: 'jwt@test.com',
        roles: ['ROLE_ADMIN'],
        firstname: 'Jane',
        surname: 'Doe',
        locationId: null,
      };

      const result = await authService.login(user);
      const decoded = jwtService.verify(result.access_token);

      expect(decoded.sub).toBe(42);
      expect(decoded.email).toBe('jwt@test.com');
      expect(decoded.roles).toEqual(['ROLE_ADMIN']);
    });
  });
});
