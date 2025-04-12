import { Schema } from 'mongoose';

import { USER_SCHEMA_NAME } from '../user/user.type';
import { ChatMessage, ChatRoom, ChatRoomTypes } from './chat.type';

export const ChatMessageSchema = new Schema<ChatMessage>(
  {
    content: String,
    senderId: Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

export const ChatRoomSchema = new Schema<ChatRoom>(
  {
    roomType: {
      type: String,
      enum: ChatRoomTypes,
    },
    participantUserIds: [
      { type: Schema.Types.ObjectId, ref: USER_SCHEMA_NAME },
    ],
    messages: [ChatMessageSchema],
  },
  {
    timestamps: true,
  }
);
