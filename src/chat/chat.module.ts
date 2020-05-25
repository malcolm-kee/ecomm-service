import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'auth/auth.module';
import { ChatController } from './chat.controller';
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
    forwardRef(() => AuthModule),
  ],
  providers: [ChatService],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
