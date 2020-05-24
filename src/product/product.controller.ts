import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateProductDto,
  ProductResponse,
  UpdateProductDto,
} from './product.dto';
import { ProductService } from './product.service';

@ApiTags('product')
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
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    type: ProductResponse,
    isArray: true,
  })
  @Get()
  getProducts(
    @Query('before') before?: string,
    @Query('limit') limit?: number
  ) {
    return this.productService.getMany({
      before,
      limit,
    });
  }

  @ApiOperation({
    description: 'Create a product',
  })
  @ApiResponse({
    status: 201,
    type: ProductResponse,
  })
  @Post()
  createProduct(@Body() body: CreateProductDto) {
    return this.productService.create(body);
  }

  @ApiOperation({
    description: 'Update a product',
  })
  @ApiResponse({
    status: 200,
    type: ProductResponse,
    description: 'Product is updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No product found with the specified id',
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
  @ApiResponse({
    status: 200,
    type: ProductResponse,
    description: 'Product is deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No product found with the specified id',
  })
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const deletedProduct = this.productService.deleteOne(id);

    if (!deletedProduct) {
      throw new NotFoundException();
    }

    return deletedProduct;
  }
}
