import { Sharp } from 'sharp';
import { Types } from 'mongoose';

export interface ImageData {
  sharp: Sharp;
  width: number;
  height: number;
  format: string;
  blur: boolean;
  buffer: Buffer | null;
}

export interface Product {
  id: number;
  name: string;
  descriptions: string[];
  image: string;
  department: string;
  price: string;
}

export interface ProcessedProduct extends Product {
  related: number[];
  imgs: {
    size: string;
    img: ImageData;
  }[];
}

export interface User {
  id: Types.ObjectId;
  name: string;
  email: string;
  joinedDate: number;
  avatar: string;
  password: string;
}

export interface Comment {
  productId: number;
  userName: string;
  content: string;
  createdOn: number;
  rating: number;
}

export interface GenerateImageOption {
  width: number;
  height: number;
  format: 'jpg' | 'webp';
  blur?: boolean;
  fit?: 'contain' | 'cover';
  position?: 'top' | 'center';
}

export interface ImageInfo {
  images: ImageData[];
}

export interface BannerInfo {
  [key: string]: string;
}

export interface ProductImageInfo {
  [imageType: string]: string;
}

export interface JobPosting {
  id: number;
  title: string;
  department: string;
  level: 'internship' | 'entry' | 'experienced' | 'manager';
  summary: string;
  descriptions: string[];
  requirements: string[];
}

export interface ProductDto extends Product {
  related: number[];
  images: ProductImageInfo | null;
  smallImagePath: string | null;
}

export const ItemConditionEnum = [
  'new',
  'used_like-new',
  'used_good',
  'used_fair',
] as const;

export type ItemCondition = typeof ItemConditionEnum[number];

export const ItemAvailabilityEnum = ['in-stock', 'single-item'] as const;

export type ItemAvailability = typeof ItemAvailabilityEnum[number];

export interface MarketingplaceListing {
  title: string;
  price: number;
  category?: string;
  condition: ItemCondition;
  description: string;
  availability: ItemAvailability;
  numOfStock?: number;
}

export type DbProduct = Omit<ProductDto, 'smallImagePath'> & {
  blurhash: string;
};
export type DbBanner = BannerInfo;
export type DbUser = User;
export type DbComment = Comment;
