import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { DocumentDto } from '../constants';
import { Product, ProductComment, ProductImages } from './product.type';

export class ProductCommentDto implements ProductComment {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  rating: number;
}

export class CreateProductDto implements Omit<Product, 'comments'> {
  @ApiProperty({
    description: 'Product name',
    example: 'Awesome Mousetrap',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  descriptions: string[];

  @ApiProperty()
  image: string;

  @ApiProperty()
  department: string;

  @ApiProperty()
  blurhash: string;

  @ApiProperty({
    description: 'Unit price of the product',
    example: '20.99',
  })
  price: string;

  @ApiProperty({
    required: false,
    type: 'string',
    description: '_id of related products',
  })
  @IsMongoId({
    each: true,
  })
  related: string[] = [];

  images: ProductImages;

  @ApiProperty({
    isArray: true,
    type: ProductCommentDto,
    required: false,
  })
  comments: ProductCommentDto[] = [];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductResponse extends CreateProductDto implements DocumentDto {
  @ApiProperty({
    description: 'Unique id for the product',
  })
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}
