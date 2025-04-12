import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as path from 'path';

import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { PUBLIC_PATH } from './constants';
import { FileModule } from './file/file.module';
import { JobModule } from './job/job.module';
import { MarketingModule } from './marketing/marketing.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { MovieModule } from './movie/movie.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', PUBLIC_PATH),
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const db = await MongoMemoryServer.create({
          instance: {
            dbName: 'ecomm-service',
            port: 37813,
            storageEngine: 'wiredTiger',
          },
        });
        return {
          uri: db.getUri(),
        };
      },
    }),
    ProductModule,
    JobModule,
    MarketingModule,
    FileModule,
    AuthModule,
    ChatModule,
    MarketplaceModule,
    MovieModule,
    UserModule,
  ],
})
export class AppModule {}
