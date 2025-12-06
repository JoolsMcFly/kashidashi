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

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return {
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      firstname: user.firstname,
      lastname: user.lastname,
      locationId: user.locationId,
    };
  }

  async login(user: any) {
    const payload = {
      sub: user.userId,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.userId,
        username: user.username,
        isAdmin: user.isAdmin,
        firstname: user.firstname,
        lastname: user.lastname,
        locationId: user.locationId,
      },
    };
  }
}
