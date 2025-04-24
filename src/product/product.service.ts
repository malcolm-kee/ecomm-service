import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type FilterQuery, PaginateModel } from 'mongoose';

import { CreateProductDto } from './product.dto';
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

  create(data: CreateProductDto) {
    return this.productModel.create(data);
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
    query = {},
  }: {
    page?: number | string;
    limit?: number | string;
    query?: FilterQuery<ProductDocument>;
  } = {}) {
    return this.productModel.paginate(query, {
      sort: {
        createdAt: -1,
      },
      limit: Number(limit),
      page: Number(page),
    });
  }

  deleteOne(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
