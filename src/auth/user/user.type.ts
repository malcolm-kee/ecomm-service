import { Document } from 'mongoose';

export const USER_SCHEMA_NAME = 'User';

export type User = {
  name: string;
  email: string;
  password: string;
  avatar: string;
};

export type UserDocument = User & Document;
