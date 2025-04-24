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
import { omitBy } from 'lodash';
import type { FilterQuery } from 'mongoose';

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
import type { ProductDocument } from './product.type';

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
  ): Promise<ProductResponse[]> {
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
  @ApiQuery({
    name: 'name',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'department',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description: 'Search for products by name, department, or description',
  })
  @ApiPaginatedResponse(ProductResponse)
  @Get('list')
  listProducts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
    @Query('department') department?: string,
    @Query('search') search?: string
  ): Promise<PaginatedDto<ProductResponse>> {
    return this.productService.getManyPaginated({
      page,
      limit,
      query: this.constructSearchQuery({
        name: name?.trim(),
        department: department?.trim(),
        search: search?.trim(),
      }),
    });
  }

  private constructSearchQuery(filters: {
    name?: string;
    department?: string;
    search?: string;
  }): FilterQuery<ProductDocument> {
    if (filters.search) {
      const searchTerm = filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(searchTerm, 'i');

      return {
        $or: [
          { name: { $regex: searchRegex } },
          { department: { $regex: searchRegex } },
          { descriptions: { $elemMatch: { $regex: searchRegex } } },
        ],
      };
    }

    // Sanitize the name parameter to prevent regex injection
    const sanitizedName = filters.name
      ? filters.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      : undefined;

    return omitBy(
      {
        name: sanitizedName && {
          $regex: new RegExp(sanitizedName, 'i'),
        },
        department: filters.department && {
          $eq: filters.department,
        },
      },
      (x) => !x
    );
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
    return this.productService.create(body);
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
  ): Promise<ProductResponse> {
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
