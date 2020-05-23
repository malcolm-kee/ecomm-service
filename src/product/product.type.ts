import { Document } from 'mongoose';

export type ProductImages = {
  standard: string;
  webp: string;
  thumbStandard: string;
  thumbWebp: string;
  blur: string;
  thumbBlur: string;
};

export type Product = {
  name: string;
  descriptions: string[];
  image: string;
  department: string;
  price: string;
  related: string[];
  images: ProductImages | null;
};

export type ProductDocument = Product & Document;

export const PRODUCT_SCHEMA = 'Product';
