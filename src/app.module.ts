import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as path from 'path';
import { PUBLIC_PATH } from './constants';
import { FileModule } from './file/file.module';
import { JobModule } from './job/job.module';
import { MarketingModule } from './marketing/marketing.module';
import { ProductModule } from './product/product.module';

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
        const db = await MongoMemoryServer.create();
        return {
          uri: await db.getUri(),
        };
      },
    }),
    ProductModule,
    JobModule,
    MarketingModule,
    FileModule,
  ],
})
export class AppModule {}
