import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User, Location } from '../../entities';
import { TestDbModule, TestEntitiesModule, clearTables } from '../../test/test-db.helper';
import { createLocation, resetCounter } from '../../test/seed.helper';

jest.setTimeout(30000);

describe('UsersService (integration)', () => {
  let service: UsersService;
  let dataSource: DataSource;
  let userRepo: Repository<User>;
  let locationRepo: Repository<Location>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDbModule, TestEntitiesModule],
      providers: [UsersService],
    }).compile();

    service = module.get(UsersService);
    dataSource = module.get(DataSource);
    userRepo = module.get(getRepositoryToken(User));
    locationRepo = module.get(getRepositoryToken(Location));
  });

  beforeEach(async () => {
    resetCounter();
    await clearTables(dataSource);
  });

  describe('create', () => {
    it('should persist user with hashed password', async () => {
      const user = await service.create({
        email: 'alice@test.com',
        password: 'secret123',
        firstname: 'Alice',
        surname: 'Smith',
      });

      expect(user.id).toBeDefined();
      expect(user.email).toBe('alice@test.com');
      expect(user.password).not.toBe('secret123');
      expect(await bcrypt.compare('secret123', user.password)).toBe(true);
    });

    it('should throw ConflictException on duplicate email', async () => {
      await service.create({
        email: 'dup@test.com',
        password: 'secret123',
      });

      await expect(
        service.create({ email: 'dup@test.com', password: 'other456' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should assign default ROLE_USER when no roles provided', async () => {
      const user = await service.create({
        email: 'noroles@test.com',
        password: 'secret123',
      });

      expect(user.roles).toEqual(['ROLE_USER']);
    });

    it('should use provided roles', async () => {
      const user = await service.create({
        email: 'admin@test.com',
        password: 'secret123',
        roles: ['ROLE_ADMIN'],
      });

      expect(user.roles).toEqual(['ROLE_ADMIN']);
    });
  });

  describe('update', () => {
    it('should update user fields', async () => {
      const user = await service.create({
        email: 'before@test.com',
        password: 'secret123',
        firstname: 'Before',
      });

      const updated = await service.update(user.id, {
        firstname: 'After',
      });

      expect(updated.firstname).toBe('After');
    });

    it('should hash password when provided', async () => {
      const user = await service.create({
        email: 'pw@test.com',
        password: 'original',
      });

      await service.update(user.id, { password: 'newpassword' });

      const reloaded = await userRepo.findOneBy({ id: user.id });
      expect(await bcrypt.compare('newpassword', reloaded!.password)).toBe(true);
    });

    it('should skip password hashing when password is empty string', async () => {
      const user = await service.create({
        email: 'nopw@test.com',
        password: 'original',
      });
      const originalHash = (await userRepo.findOneBy({ id: user.id }))!.password;

      await service.update(user.id, { password: '' });

      const reloaded = await userRepo.findOneBy({ id: user.id });
      expect(reloaded!.password).toBe(originalHash);
    });

    it('should throw ConflictException on email conflict', async () => {
      await service.create({ email: 'taken@test.com', password: 'secret123' });
      const user = await service.create({ email: 'mine@test.com', password: 'secret123' });

      await expect(
        service.update(user.id, { email: 'taken@test.com' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      await service.create({ email: 'find@test.com', password: 'secret123' });

      const found = await service.findByEmail('find@test.com');

      expect(found).not.toBeNull();
      expect(found!.email).toBe('find@test.com');
    });

    it('should return null when not found', async () => {
      const found = await service.findByEmail('missing@test.com');
      expect(found).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return user with location relation', async () => {
      const location = await createLocation(locationRepo);
      const user = await service.create({
        email: 'loc@test.com',
        password: 'secret123',
        locationId: location.id,
      });

      const found = await service.findOne(user.id);

      expect(found.id).toBe(user.id);
      expect(found.location).toBeDefined();
      expect(found.location!.id).toBe(location.id);
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      await expect(service.findOne(9999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      await service.create({ email: 'a@test.com', password: 'secret123' });
      await service.create({ email: 'b@test.com', password: 'secret123' });

      const users = await service.findAll();

      expect(users).toHaveLength(2);
    });
  });

  describe('remove', () => {
    it('should delete the user', async () => {
      const user = await service.create({ email: 'del@test.com', password: 'secret123' });

      await service.remove(user.id);

      await expect(service.findOne(user.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      await expect(service.remove(9999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('should hash and save new password', async () => {
      const user = await service.create({
        email: 'reset@test.com',
        password: 'oldpassword',
      });

      await service.resetPassword(user.id, 'newpassword');

      const reloaded = await userRepo.findOneBy({ id: user.id });
      expect(await bcrypt.compare('newpassword', reloaded!.password)).toBe(true);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      await expect(service.resetPassword(9999, 'pass')).rejects.toThrow(NotFoundException);
    });
  });
});
