import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';

import { CreateUserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { UserData } from '../user/user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async createUser(user: CreateUserDto) {
    const currentUser = await this.userService.findOne(user.email);
    if (currentUser) {
      throw new ConflictException({
        message: ['Email already used.'],
      });
    }

    return this.userService.create(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if (user && user.password === password) {
      return omit(user.toObject(), ['password']);
    }

    return null;
  }

  login(user: UserData & { _id: string }) {
    const payload = {
      name: user.name,
      email: user.email,
      sub: user._id,
      avatar: user.avatar,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
