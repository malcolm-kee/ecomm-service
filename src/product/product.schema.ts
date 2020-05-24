import { Schema } from 'mongoose';
import { Product } from './product.type';

export const ProductSchema = new Schema<Product>(
  {
    name: String,
    description: [String],
    image: String,
    department: String,
    price: String,
    related: [String],
    images: {
      standard: String,
      webp: String,
      thumbStandard: String,
      thumbWebp: String,
      blur: String,
      thumbBlur: String,
    },
    comments: [
      {
        userName: String,
        content: String,
        rating: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
