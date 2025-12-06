import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersSeed {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async run(): Promise<void> {
    // Check if admin already exists
    const adminExists = await this.usersRepository.findOne({
      where: { username: 'admin' },
    });

    if (!adminExists) {
      const adminPasswordHash = await bcrypt.hash('admin123', 10);
      const admin = this.usersRepository.create({
        username: 'admin',
        passwordHash: adminPasswordHash,
        firstname: 'Admin',
        lastname: 'User',
        isAdmin: true,
        locationId: null,
      });
      await this.usersRepository.save(admin);
      console.log('✓ Created admin user (username: admin, password: admin123)');
    } else {
      console.log('- Admin user already exists, skipping...');
    }

    // Check if regular user already exists
    const userExists = await this.usersRepository.findOne({
      where: { username: 'user' },
    });

    if (!userExists) {
      const userPasswordHash = await bcrypt.hash('user123', 10);
      const user = this.usersRepository.create({
        username: 'user',
        passwordHash: userPasswordHash,
        firstname: 'Regular',
        lastname: 'User',
        isAdmin: false,
        locationId: null, // Will need to be updated manually or via migration
      });
      await this.usersRepository.save(user);
      console.log('✓ Created regular user (username: user, password: user123)');
      console.log('  Note: Regular user has no location set. Update via admin panel.');
    } else {
      console.log('- Regular user already exists, skipping...');
    }
  }
}
