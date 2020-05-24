import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Product, ProductImages, ProductComment } from './product.type';

export class ProductCommentDto implements ProductComment {
  userName: string;
  content: string;
  rating: number;
}

export class CreateProductDto implements Product {
  @ApiProperty({
    description: 'Product name',
    example: 'Awesome Mousetrap',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  descriptions: string[];

  image: string;

  department: string;

  @ApiProperty({
    description: 'Unit price of the product',
    example: '20.99',
  })
  price: string;

  @IsMongoId({
    each: true,
  })
  related: string[];

  images: ProductImages;

  comments: ProductCommentDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductResponse extends CreateProductDto {
  @ApiProperty({
    description: 'Unique id for the product',
  })
  _id: string;
}
