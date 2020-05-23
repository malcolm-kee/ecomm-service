import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument, PRODUCT_SCHEMA, Product } from './product.type';

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

  getMany({
    before,
    limit = 10,
  }: {
    before?: string;
    limit?: number;
  } = {}) {
    return this.productModel
      .find({
        createdOn: {
          $lte: before,
        },
      })
      .limit(limit)
      .sort('-createdOn')
      .exec();
  }

  deleteOne(id: string) {
    return this.productModel.findByIdAndRemove(id).exec();
  }
}
