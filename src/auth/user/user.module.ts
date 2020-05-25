import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from 'chat/chat.module';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { USER_SCHEMA_NAME } from './user.type';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: USER_SCHEMA_NAME,
        schema: UserSchema,
      },
    ]),
    ChatModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
