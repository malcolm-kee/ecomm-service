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
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  ApiPaginatedResponse,
  Pagination,
} from '../shared/pagination.decorator';
import { PaginatedDto } from '../shared/pagination.dto';
import { WithValidation } from '../shared/with-validation.decorator';
import {
  CreateProductDto,
  ProductCommentDto,
  ProductResponse,
  UpdateProductDto,
} from './product.dto';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Get list of available products',
    operationId: 'getProducts',
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
  @ApiOkResponse({
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
    summary: 'List available products with pagination',
    operationId: 'listProducts',
  })
  @Pagination()
  @ApiPaginatedResponse(ProductResponse)
  @Get('list')
  listProducts(
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<PaginatedDto<ProductResponse>> {
    return this.productService.getManyPaginated({
      page,
      limit,
    });
  }

  @ApiOperation({
    summary: 'Get details of one product',
    operationId: 'getProduct',
  })
  @Get(':id')
  getOneProduct(@Param('id') id: string): Promise<ProductResponse> {
    return this.productService.getOne(id);
  }

  @ApiOperation({
    summary: 'Create a product',
    operationId: 'createProduct',
  })
  @WithValidation()
  @Post()
  createProduct(@Body() body: CreateProductDto): Promise<ProductResponse> {
    return this.productService.create({
      comments: [],
      ...body,
    });
  }

  @ApiOperation({
    summary: 'Update a product',
    operationId: 'updateProduct',
  })
  @ApiNotFoundResponse({
    description: 'No product found with the specified id',
  })
  @WithValidation()
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
  @ApiNotFoundResponse({
    description: 'No product found with the specified id',
  })
  @WithValidation()
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
  @ApiOkResponse({
    type: ProductResponse,
    description: 'Product is deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'No product found with the specified id',
  })
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const deletedProduct = await this.productService.deleteOne(id);

    if (!deletedProduct) {
      throw new NotFoundException();
    }

    return deletedProduct;
  }
}
