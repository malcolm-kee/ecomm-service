import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatRoomSchema } from './chat.schema';
import { ChatService } from './chat.service';
import { CHATROOM_SCHEMA } from './chat.type';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CHATROOM_SCHEMA,
        schema: ChatRoomSchema,
      },
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
