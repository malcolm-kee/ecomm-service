import { Schema } from 'mongoose';
import {
  ItemAvailabilityEnum,
  ItemConditionEnum,
  MarketplaceCart,
  MarketplaceListing,
  MARKETPLACE_LISTING_SCHEMA,
} from './marketplace.type';

export const MarketplaceListingSchema = new Schema<MarketplaceListing>(
  {
    title: String,
    price: Number,
    category: String,
    condition: {
      type: String,
      enum: ItemConditionEnum,
    },
    description: String,
    availability: {
      type: String,
      enum: ItemAvailabilityEnum,
    },
    imageUrl: String,
    numOfStock: Number,
  },
  { timestamps: true }
);

export const MarketplaceCartItemSchema = new Schema(
  {
    listing: { type: Schema.Types.ObjectId, ref: MARKETPLACE_LISTING_SCHEMA },
    quantity: Number,
  },
  {
    timestamps: true,
  }
);

export const MarketplaceCartSchema = new Schema<MarketplaceCart>(
  {
    ownerUserId: Schema.Types.ObjectId,
    items: [MarketplaceCartItemSchema],
  },

  {
    timestamps: true,
  }
);
