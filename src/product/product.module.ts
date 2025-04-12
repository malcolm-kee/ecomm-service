import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductController } from './product.controller';
import { ProductSchema } from './product.schema';
import { ProductService } from './product.service';
import { PRODUCT_SCHEMA } from './product.type';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PRODUCT_SCHEMA,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
