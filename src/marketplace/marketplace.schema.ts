import { Schema } from 'mongoose';
import {
  ItemAvailabilityEnum,
  ItemConditionEnum,
  MarketplaceListing,
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
  },
  { timestamps: true }
);
