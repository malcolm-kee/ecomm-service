import bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

import { UserDocument, type UserModelMethods } from './user.type';

export const UserSchema = new mongoose.Schema<
  UserDocument,
  mongoose.Model<UserDocument>,
  UserModelMethods
>({
  name: String,
  email: {
    type: String,
    index: {
      unique: true,
    },
  },
  password: String,
  avatar: String,
});

UserSchema.plugin(paginate);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err: unknown) {
    if (err && err instanceof Error) {
      next(err);
    } else {
      next(new Error('Unknown error'));
    }
  }
});

UserSchema.methods.validatePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Since this is demo app, we use low number of salt rounds
// to make the password hashing fast.
// In real app, you should use 10 or more.
const SALT_ROUNDS = 2;
