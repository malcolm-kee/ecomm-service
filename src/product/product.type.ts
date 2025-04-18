import { Document } from 'mongoose';

export type ProductImages = {
  standard: string;
  webp: string;
  thumbStandard: string;
  thumbWebp: string;
  blur: string;
  thumbBlur: string;
};

export type ProductComment = {
  userName: string;
  content: string;
  rating: number;
};

export type Product = {
  name: string;
  descriptions: string[];
  image: string;
  department: string;
  price: string;
  blurhash: string;
  related: string[];
  images: ProductImages | null;
  comments: ProductComment[];
};

export type ProductDocument = Product &
  Document<string, unknown, Product> & {
    createdAt: string;
    updatedAt: string;
  };

export const PRODUCT_SCHEMA = 'Product';
