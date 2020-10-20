import { Schema } from 'mongoose';
import { Product, ProductComment } from './product.type';

export const ProductCommentSchema = new Schema<ProductComment>(
  {
    userName: String,
    content: String,
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ProductSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    descriptions: [String],
    image: String,
    department: String,
    price: String,
    related: [String],
    blurhash: String,
    images: {
      standard: String,
      webp: String,
      thumbStandard: String,
      thumbWebp: String,
      blur: String,
      thumbBlur: String,
    },
    comments: [ProductCommentSchema],
  },
  {
    timestamps: true,
  }
);
