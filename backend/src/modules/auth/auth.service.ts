import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    // Convert $2y$ (PHP) to $2b$ (Node.js) for Symfony compatibility
    const normalizedHash = user.password.replace(/^\$2y\$/, '$2b$');
    const isPasswordValid = await bcrypt.compare(password, normalizedHash);
    if (!isPasswordValid) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      roles: user.roles,
      firstname: user.firstname,
      surname: user.surname,
      locationId: user.locationId,
    };
  }

  async login(user: any) {
    const payload = {
      sub: user.userId,
      email: user.email,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.userId,
        email: user.email,
        roles: user.roles,
        firstname: user.firstname,
        surname: user.surname,
        locationId: user.locationId,
      },
    };
  }
}
