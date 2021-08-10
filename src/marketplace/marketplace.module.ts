import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketplaceController } from './marketplace.controller';
import {
  MarketplaceCartSchema,
  MarketplaceListingSchema,
} from './marketplace.schema';
import { MarketplaceService } from './marketplace.service';
import {
  MARKETPLACE_CART_SCHEMA,
  MARKETPLACE_LISTING_SCHEMA,
} from './marketplace.type';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MARKETPLACE_LISTING_SCHEMA,
        schema: MarketplaceListingSchema,
      },
      {
        name: MARKETPLACE_CART_SCHEMA,
        schema: MarketplaceCartSchema,
      },
    ]),
  ],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
})
export class MarketplaceModule {}
