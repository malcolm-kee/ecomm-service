import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { User } from './user/user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async createUser(user: User) {
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
      const { password, ...result } = user.toObject();
      return result;
    }

    return null;
  }

  async login(user: User & { _id: string }) {
    const payload = {
      name: user.name,
      email: user.email,
      sub: user._id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
