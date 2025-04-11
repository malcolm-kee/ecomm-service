import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, PickType } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth';
import { WithGuard } from '../shared/with-guard.decorator';
import {
  ChatMessageResponseDto,
  ChatRoomDto,
  ChatRoomResponseDto,
  MessageDto,
} from './chat.dto';
import { ChatService } from './chat.service';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({
    summary: 'Get all rooms that have been joined by logged-in user',
    operationId: 'listJoinedChatRooms',
  })
  @ApiResponse({
    status: 200,
    type: PickType(ChatRoomResponseDto, [
      '_id',
      'roomType',
      'updatedAt',
      'createdAt',
    ]),
    isArray: true,
  })
  @WithGuard()
  @Get()
  getJoinRooms(@Request() req: AuthenticatedRequest) {
    return this.chatService.getRoomsForUser(req.user.userId);
  }

  @ApiOperation({
    summary: 'Get the global chat room that all user will be added to.',
    operationId: 'getGlobalChatRoom',
  })
  @ApiResponse({
    status: 200,
    type: ChatRoomResponseDto,
  })
  @Get('room')
  getGlobalRoom() {
    return this.chatService.getGlobalRoom();
  }

  @ApiOperation({
    summary: 'Get a chat room with a specific id.',
    operationId: 'getChatRoom',
  })
  @ApiResponse({
    status: 200,
    type: ChatRoomResponseDto,
  })
  @Get('room/:id')
  getRoom(@Param('id') id: string) {
    return this.chatService.getOneRoom(id);
  }

  @ApiOperation({
    summary: 'Create a chat room',
    operationId: 'createChatRoom',
  })
  @ApiResponse({
    status: 201,
    type: ChatRoomResponseDto,
  })
  @WithGuard()
  @Post('room')
  addRoom(@Body() body: ChatRoomDto, @Request() req: AuthenticatedRequest) {
    const participantUserIds = body.participantUserIds.includes(req.user.userId)
      ? body.participantUserIds
      : body.participantUserIds.concat(req.user.userId);
    return this.chatService.createRoom({
      ...body,
      participantUserIds,
    });
  }

  @ApiOperation({
    summary: 'Join a chat room',
    operationId: 'jobChatRoom',
  })
  @ApiResponse({
    status: 200,
    type: ChatRoomResponseDto,
  })
  @WithGuard()
  @HttpCode(200)
  @Post('room/:roomId/join')
  joinRoom(
    @Param('roomId') roomId: string,
    @Request() req: AuthenticatedRequest
  ) {
    return this.chatService.addParticipant(roomId, req.user.userId);
  }

  @ApiOperation({
    summary: 'Send a chat message',
    operationId: 'sendChatMessage',
  })
  @ApiResponse({
    status: 201,
    type: ChatMessageResponseDto,
  })
  @WithGuard()
  @Post('room/:roomId/msg')
  sendMessage(
    @Param('roomId') roomId: string,
    @Body() body: MessageDto,
    @Request() req: AuthenticatedRequest
  ) {
    return this.chatService.addMessage(roomId, {
      content: body.content,
      senderId: req.user.userId,
    });
  }

  @ApiOperation({
    summary: 'Update a chat message',
    operationId: 'updateChatMessage',
  })
  @ApiResponse({
    status: 200,
    type: ChatMessageResponseDto,
  })
  @WithGuard()
  @Put('room/:roomId/msg/:msgId')
  updateMessage(
    @Param('roomId') roomId: string,
    @Param('msgId') msgId: string,
    @Body() body: MessageDto,
    @Request() req: AuthenticatedRequest
  ) {
    return this.chatService.updateMessage(roomId, {
      id: msgId,
      content: body.content,
      senderId: req.user.userId,
    });
  }
}
