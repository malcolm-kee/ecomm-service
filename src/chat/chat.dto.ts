import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

import { DocumentDto } from '../constants';
import { UserPublicDetails } from '../user/user.type';
import {
  ChatMessage,
  ChatRoom,
  ChatRoomType,
  ChatRoomTypes,
} from './chat.type';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class ChatMessageDto extends MessageDto implements ChatMessage {
  @IsString()
  @IsMongoId()
  senderId: string;
}

export class ChatMessageResponseDto
  extends ChatMessageDto
  implements DocumentDto
{
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export class ChatRoomDto implements ChatRoom {
  @ApiProperty({
    enum: ChatRoomTypes,
  })
  @IsIn(ChatRoomTypes)
  roomType: ChatRoomType;

  @IsString({
    each: true,
  })
  participantUserIds: string[];

  messages: ChatMessageDto[];
}

export class ChatParticipantDto implements UserPublicDetails {
  _id: string;
  name: string;
  avatar: string;
}

export class ChatRoomResponseDto extends ChatRoomDto implements DocumentDto {
  participants: ChatParticipantDto[];
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}
