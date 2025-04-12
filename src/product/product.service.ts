import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import {
  PRODUCT_SCHEMA,
  Product,
  ProductComment,
  ProductDocument,
} from './product.type';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(PRODUCT_SCHEMA)
    private readonly productModel: PaginateModel<ProductDocument>
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

  getManyPaginated({
    page = 1,
    limit = 10,
  }: {
    page?: number | string;
    limit?: number | string;
  } = {}) {
    return this.productModel.paginate(
      {},
      {
        sort: {
          createdAt: -1,
        },
        limit: Number(limit),
        page: Number(page),
      }
    );
  }

  deleteOne(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
