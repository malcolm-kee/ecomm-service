import { Document } from 'mongoose';

export const USER_SCHEMA_NAME = 'User';

export type UserData = {
  name: string;
  email: string;
  password: string;
  avatar: string;
  _id: string;
};

export type UserPublicDetails = Pick<UserData, 'name' | 'avatar'> & {
  _id: string;
};

export type UserDocument = UserData & Document<string, unknown, UserData>;
