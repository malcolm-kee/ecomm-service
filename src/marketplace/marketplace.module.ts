import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceListingSchema } from './marketplace.schema';
import { MarketplaceService } from './marketplace.service';
import { MARKETPLACE_LISTING_SCHEMA } from './marketplace.type';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MARKETPLACE_LISTING_SCHEMA,
        schema: MarketplaceListingSchema,
      },
    ]),
  ],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
})
export class MarketplaceModule {}
