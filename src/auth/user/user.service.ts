import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { omit } from 'lodash';
import { User, UserDocument, USER_SCHEMA_NAME } from './user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_SCHEMA_NAME)
    private readonly userModel: Model<UserDocument>
  ) {}

  async create(userData: User) {
    const user = new this.userModel(userData);
    await user.save();

    return omit(userData, ['password']);
  }

  findOne(email: string) {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }
}
