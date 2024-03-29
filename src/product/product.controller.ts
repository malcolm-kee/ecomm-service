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
  ProductCommentDto,
} from './product.dto';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Get list of available products',
    operationId: 'listProducts',
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
    summary: 'Get details of one product',
    operationId: 'getProduct',
  })
  @ApiResponse({
    status: 200,
    type: ProductResponse,
  })
  @Get(':id')
  getOneProduct(@Param('id') id: string) {
    return this.productService.getOne(id);
  }

  @ApiOperation({
    summary: 'Create a product',
    operationId: 'createProduct',
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
    summary: 'Update a product',
    operationId: 'updateProduct',
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
    summary: 'Add comment to a product',
    operationId: 'addProductComment',
  })
  @ApiResponse({
    status: 201,
    type: ProductResponse,
    description: 'Comment is added successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No product found with the specified id',
  })
  @Post('comment/:id')
  async addProductComment(
    @Param('id') id: string,
    @Body() comment: ProductCommentDto
  ) {
    const updated = await this.productService.addComment(id, comment);

    if (!updated) {
      throw new NotFoundException();
    }

    return updated;
  }

  @ApiOperation({
    summary: 'Delete a product',
    operationId: 'deleteProduct',
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
