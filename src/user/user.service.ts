import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { omit } from 'lodash';
import { type FilterQuery, PaginateModel } from 'mongoose';

import { ChatService } from '../chat/chat.service';
import {
  USER_SCHEMA_NAME,
  UserData,
  UserDocument,
  UserPublicDetails,
} from './user.type';

/**
 * UserService encapsulates the logic working with User model.
 *
 * - Use the `valdiateCredentials` method if you want to check if the provided email/password is correct.
 */
@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_SCHEMA_NAME)
    private readonly userModel: PaginateModel<UserDocument>,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService
  ) {}

  async create(userData: Omit<UserData, '_id'>) {
    const user = new this.userModel(userData);
    const savedUser = await user.save();

    await this.chatService.addParticipantToGlobalRoom(savedUser._id);

    return omit(savedUser.toJSON(), ['password']);
  }

  async getIsEmailUsed(email: string): Promise<boolean> {
    const userWithEmail = await this.userModel.exists({ email });

    return !!userWithEmail;
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.userModel
      .findOne({
        email,
      })
      .exec();

    if (user) {
      const validUser = await user.validatePassword(password);

      if (validUser) {
        return omit(user.toJSON(), ['password']);
      }
    }

    return null;
  }

  getOne(id: string) {
    return this.userModel.findById(id).select(userModelSelect).exec();
  }

  updateOne(id: string, changes: Partial<UserData>) {
    return this.userModel
      .findByIdAndUpdate(id, changes, { new: true })
      .select(userModelSelect)
      .exec();
  }

  deleteOne(id: string) {
    return this.userModel.findByIdAndDelete(id).select(userModelSelect).exec();
  }

  async getPublicDetails(id: string): Promise<UserPublicDetails> {
    const user = await this.userModel.findById(id).exec();
    Logger.log({ user });
    return (
      user && {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      }
    );
  }

  getManyPaginated({
    page = 1,
    limit = 10,
    query = {},
  }: {
    query?: FilterQuery<UserDocument>;
    page?: number | string;
    limit?: number | string;
  } = {}) {
    return this.userModel.paginate(query, {
      select: userModelSelect,
      sort: {
        createdAt: -1,
      },
      limit: Number(limit),
      page: Number(page),
    });
  }
}

const userModelSelect = '-password';
