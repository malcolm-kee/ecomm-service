import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    description: 'Get list of available products',
  })
  @ApiQuery({
    name: 'before',
    required: false,
  })
  @Get()
  getProducts(@Query('before') before?: string) {
    return this.productService.getMany({
      before,
    });
  }

  @ApiOperation({
    description: 'Create a product',
  })
  @Post()
  createProduct(@Body() body: CreateProductDto) {
    return this.productService.create(body);
  }

  @ApiOperation({
    description: 'Update a product',
  })
  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() changes: UpdateProductDto
  ) {
    const updated = await this.productService.updateOne(id, changes);

    if (!updated) {
      throw new NotFoundException();
    }

    return updated;
  }

  @ApiOperation({
    description: 'Delete a product',
  })
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteOne(id);
  }
}
