import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from '../chat/chat.module';
import { UserController } from './user.controller';
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
    forwardRef(() => ChatModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
