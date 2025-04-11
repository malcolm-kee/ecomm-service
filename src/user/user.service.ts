import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { omit } from 'lodash';
import { PaginateModel } from 'mongoose';
import { ChatService } from '../chat/chat.service';
import {
  USER_SCHEMA_NAME,
  UserData,
  UserDocument,
  UserPublicDetails,
} from './user.type';

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

  findOne(email: string) {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
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
  }: {
    page?: number | string;
    limit?: number | string;
  } = {}) {
    return this.userModel.paginate(
      {},
      {
        select: userModelSelect,
        sort: {
          createdAt: -1,
        },
        limit: Number(limit),
        page: Number(page),
      }
    );
  }
}

const userModelSelect = '-password';
