import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { AuthenticatedRequest, JwtPayload } from './jwt.type';

export const User = createParamDecorator(
  (userProperty: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return userProperty
      ? (request.user as JwtPayload)[userProperty]
      : request.user;
  }
);
