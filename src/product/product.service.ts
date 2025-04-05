import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductDocument,
  PRODUCT_SCHEMA,
  Product,
  ProductComment,
} from './product.type';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(PRODUCT_SCHEMA)
    private readonly productModel: Model<ProductDocument>
  ) {}

  create(product: Product) {
    return this.productModel.create(product);
  }

  getOne(id: string) {
    return this.productModel.findById(id).exec();
  }

  updateOne(id: string, changes: Partial<Product>) {
    return this.productModel
      .findByIdAndUpdate(id, changes, { new: true })
      .exec();
  }

  addComment(id: string, comment: ProductComment) {
    return this.productModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            comments: comment,
          },
        },
        { new: true }
      )
      .exec();
  }

  getMany({
    before,
    limit = 10,
  }: {
    before?: string;
    limit?: number | string;
  } = {}) {
    return this.productModel
      .find(
        before
          ? {
              createdAt: {
                $lt: before,
              },
            }
          : {},
        {},
        {
          sort: {
            createdAt: -1,
          },
          limit: Number(limit),
        }
      )
      .exec();
  }

  deleteOne(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
