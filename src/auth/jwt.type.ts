import { Request } from 'express';

export type JwtPayload = {
  userId: string;
  email: string;
  name: string;
};

export type AuthenticatedRequest = Request & {
  user: JwtPayload;
};
