import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatService } from 'chat/chat.service';
import { omit } from 'lodash';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  UserPublicDetails,
  USER_SCHEMA_NAME,
} from './user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_SCHEMA_NAME)
    private readonly userModel: Model<UserDocument>,
    private readonly chatService: ChatService
  ) {}

  async create(userData: User) {
    const user = new this.userModel(userData);
    const savedUser = await user.save();

    await this.chatService.addParticipantToGlobalRoom(savedUser._id);

    return omit(userData, ['password']);
  }

  findOne(email: string) {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
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
}
