import { Document, Types } from 'mongoose';

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
  imageUrl?: string;
  numOfStock?: number;
};

export type MarketplaceListingDocument = MarketplaceListing & Document;

export const MARKETPLACE_LISTING_SCHEMA = 'MarketplaceListing';

export interface MarketplaceCartItem {
  listing: MarketplaceListing;
  quantity: number;
}
export interface MarketplaceCart {
  ownerUserId: string;
  items: Array<MarketplaceCartItem>;
}

export type MarketplaceCartDocument = Omit<MarketplaceCart, 'items'> &
  Document & {
    items: Types.Array<
      {
        listing: string;
        quantity: number;
      } & Document
    >;
  };

export const MARKETPLACE_CART_SCHEMA = 'MarketplaceCart';
