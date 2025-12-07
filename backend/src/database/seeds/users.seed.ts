import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities';

@Injectable()
export class UsersSeed {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async run(): Promise<void> {
    // Check if admin already exists
    const adminExists = await this.usersRepository.findOne({
      where: { email: 'admin@kashidashi.local' },
    });

    if (!adminExists) {
      const adminPasswordHash = await bcrypt.hash('admin123', 13);
      const admin = this.usersRepository.create({
        email: 'admin@kashidashi.local',
        password: adminPasswordHash,
        firstname: 'Admin',
        surname: 'User',
        roles: 'ROLE_ADMIN',
        locationId: null,
      });
      await this.usersRepository.save(admin);
      console.log('✓ Created admin user (email: admin@kashidashi.local, password: admin123)');
    } else {
      console.log('- Admin user already exists, skipping...');
    }

    // Check if regular user already exists
    const userExists = await this.usersRepository.findOne({
      where: { email: 'user@kashidashi.local' },
    });

    if (!userExists) {
      const userPasswordHash = await bcrypt.hash('user123', 13);
      const user = this.usersRepository.create({
        email: 'user@kashidashi.local',
        password: userPasswordHash,
        firstname: 'Regular',
        surname: 'User',
        roles: 'ROLE_USER',
        locationId: null, // Will need to be updated manually or via migration
      });
      await this.usersRepository.save(user);
      console.log('✓ Created regular user (email: user@kashidashi.local, password: user123)');
      console.log('  Note: Regular user has no location set. Update via admin panel.');
    } else {
      console.log('- Regular user already exists, skipping...');
    }
  }
}
