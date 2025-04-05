import { Document } from 'mongoose';

export type ChatMessage = {
  content: string;
  senderId: string;
};

export type ChatMessageDoc = ChatMessage &
  Document<string, unknown, ChatMessage>;

export const ChatRoomTypes = ['global', '1-to-1', 'group'] as const;

export type ChatRoomType = (typeof ChatRoomTypes)[number];

export type ChatRoom = {
  roomType: ChatRoomType;
  messages: ChatMessage[];
  participantUserIds: string[];
};

export type ChatRoomDocument = ChatRoom & Document<string, unknown, ChatRoom>;

export const CHATROOM_SCHEMA = 'ChatRoom';

export type MessagePayload =
  | {
      type: 'System';
      message: string;
    }
  | {
      type: 'User';
      message: string;
      data: ChatMessage;
    };
