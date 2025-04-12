import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from '../constants';
import { JwtPayload } from './jwt.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_SECRET),
    });
  }

  validate(payload: {
    name: string;
    sub: string;
    email: string;
    avatar: string;
  }): Promise<JwtPayload> {
    return Promise.resolve({
      name: payload.name,
      userId: payload.sub,
      email: payload.email,
      avatar: payload.avatar,
    });
  }
}
