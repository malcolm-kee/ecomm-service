import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserPublicDetails } from 'auth';
import { UserService } from 'auth/user/user.service';
import { Model, Types } from 'mongoose';
import { DocumentDto } from '../constants';
import {
  ChatMessage,
  ChatMessageDoc,
  ChatRoom,
  ChatRoomDocument,
  CHATROOM_SCHEMA,
} from './chat.type';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(CHATROOM_SCHEMA)
    private readonly chatRoomSchema: Model<ChatRoomDocument>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  createRoom(room: ChatRoom) {
    return this.chatRoomSchema.create(room).then((r) => this.populateUser(r));
  }

  getOneRoom(roomId: string) {
    return this.chatRoomSchema
      .findById(roomId)
      .then((r) => this.populateUser(r));
  }

  getGlobalRoom() {
    return this.chatRoomSchema
      .findOne({
        roomType: 'global',
      })
      .then((r) => this.populateUser(r));
  }

  getRoomsForUser(userId: string) {
    return this.chatRoomSchema
      .find(
        {
          participantUserIds: userId,
        },
        {},
        {
          sort: {
            updatedAt: -1,
          },
        }
      )
      .then((rooms) =>
        rooms.map((room: ChatRoomDocument & DocumentDto) => ({
          _id: room._id,
          roomType: room.roomType,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
        }))
      );
  }

  private async populateUser(
    room: ChatRoomDocument
  ): Promise<ChatRoom & { participants: UserPublicDetails[] }> {
    if (!room) {
      throw new NotFoundException();
    }

    const doc = room.toJSON();

    return {
      ...doc,
      participants: await Promise.all(
        room.participantUserIds.map((userId) =>
          this.userService.getPublicDetails(userId)
        )
      ),
    };
  }

  addParticipant(roomId: string, userId: string) {
    return this.chatRoomSchema
      .findByIdAndUpdate(
        roomId,
        {
          $addToSet: {
            participantUserIds: userId,
          },
        },
        {
          new: true,
        }
      )
      .exec();
  }

  addParticipantToGlobalRoom(userId: string) {
    return this.chatRoomSchema
      .findOneAndUpdate(
        {
          roomType: 'global',
        },
        {
          $push: {
            participantUserIds: userId,
          },
        },
        {
          new: true,
        }
      )
      .exec();
  }

  addMessage(roomId: string, message: ChatMessage) {
    return this.chatRoomSchema
      .findByIdAndUpdate(
        roomId,
        {
          $push: {
            messages: message,
          },
        },
        {
          new: true,
        }
      )
      .then((r) => r && r.messages[r.messages.length - 1]);
  }

  async updateMessage(roomId: string, msg: ChatMessage & { id: string }) {
    await this.chatRoomSchema
      .updateOne(
        {
          _id: roomId,
          messages: {
            $elemMatch: {
              _id: msg.id,
              senderId: msg.senderId,
            },
          },
        },
        {
          $set: {
            'messages.$.content': msg.content,
          },
        }
      )
      .then((res) => {
        if (res.matchedCount !== 1 && res.modifiedCount !== 1) {
          throw new NotFoundException();
        }
      });

    const chatRoom = await this.chatRoomSchema.findById(roomId);

    return (chatRoom.messages as Types.DocumentArray<ChatMessageDoc>).id(
      msg.id
    );
  }
}
