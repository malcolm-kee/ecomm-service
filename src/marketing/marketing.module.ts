import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketingController } from './marketing.controller';
import { MarketingModelSchema } from './marketing.schema';
import { MarketingService } from './marketing.service';
import { MARKETING_DATA_MODEL_SCHEMA } from './marketing.type';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MARKETING_DATA_MODEL_SCHEMA,
        schema: MarketingModelSchema,
      },
    ]),
  ],
  providers: [MarketingService],
  controllers: [MarketingController],
})
export class MarketingModule {}
