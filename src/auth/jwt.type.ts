import { Request } from 'express';

export type JwtPayload = {
  userId: string;
  email: string;
  name: string;
  avatar: string;
};

export type AuthenticatedRequest = Request & {
  user: JwtPayload;
};
