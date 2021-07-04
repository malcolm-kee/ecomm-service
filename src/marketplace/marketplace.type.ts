import { Document } from 'mongoose';

export const ItemConditionEnum = [
  'new',
  'used_like-new',
  'used_good',
  'used_fair',
] as const;

export type ItemCondition = typeof ItemConditionEnum[number];

export const ItemAvailabilityEnum = ['in-stock', 'single-item'] as const;

export type ItemAvailability = typeof ItemAvailabilityEnum[number];

export type MarketplaceListing = {
  title: string;
  price: number;
  category?: string;
  condition: ItemCondition;
  description: string;
  availability: ItemAvailability;
};

export type MarketplaceListingDocument = MarketplaceListing & Document;

export const MARKETPLACE_LISTING_SCHEMA = 'MarketplaceListing';
