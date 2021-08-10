import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './jwt.type';

export const User = createParamDecorator(
  (userProperty: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return userProperty
      ? (request.user as JwtPayload)[userProperty]
      : request.user;
  }
);
