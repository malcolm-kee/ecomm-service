import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'shared/pagination.decorator';

import { User } from '../auth';
import { WithGuard } from '../shared/with-guard.decorator';
import {
  AddMarketplaceCartItemDto,
  MarketplaceCartItemDto,
  MarketplaceListingDto,
  MarketplaceListingResponse,
  UpdateMarketplaceListingDto,
} from './marketplace.dto';
import { MarketplaceService } from './marketplace.service';

@ApiTags('marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly listingService: MarketplaceService) {}

  @ApiOperation({
    summary: 'Get all listings in marketplace',
    operationId: 'listListings',
  })
  @ApiOkResponse({
    type: MarketplaceListingResponse,
    isArray: true,
  })
  @Pagination()
  @Get()
  getListings(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.listingService.getMany({
      page,
      limit,
    });
  }

  @ApiOperation({
    summary: 'Get details of one listing',
    operationId: 'getListing',
  })
  @ApiOkResponse({
    type: MarketplaceListingResponse,
  })
  @Get(':id')
  getListingDetails(@Param('id') id: string) {
    return this.listingService.getOne(id);
  }

  @ApiOperation({
    summary: 'Create a listing',
    operationId: 'createListing',
  })
  @ApiResponse({
    status: 201,
    type: MarketplaceListingResponse,
  })
  @Post()
  createListing(@Body() body: MarketplaceListingDto) {
    return this.listingService.create(body);
  }

  @ApiOperation({
    summary: 'Update a listing',
    operationId: 'updateListing',
  })
  @ApiOkResponse({
    type: MarketplaceListingResponse,
  })
  @Patch(':id')
  updateListing(
    @Param('id') id: string,
    @Body() body: UpdateMarketplaceListingDto
  ) {
    return this.listingService.updateOne(id, body);
  }

  @ApiOperation({
    summary: 'Delete a listing',
    operationId: 'deleteListing',
  })
  @ApiOkResponse({
    type: MarketplaceListingResponse,
  })
  @Delete(':id')
  deleteListing(@Param('id') id: string) {
    return this.listingService.deleteOne(id);
  }

  @ApiOperation({
    summary: 'Get items in cart',
    operationId: 'listCartItems',
  })
  @ApiOkResponse({
    type: MarketplaceCartItemDto,
    isArray: true,
  })
  @WithGuard()
  @Get('cart/items')
  listCartItems(@User('userId') userId: string) {
    return this.listingService.getCartItems(userId);
  }

  @ApiOperation({
    summary: 'Add listing to cart',
    operationId: 'addCartItem',
  })
  @WithGuard()
  @Post('cart/items')
  addItemToCart(
    @Body() body: AddMarketplaceCartItemDto,
    @User('userId') userId: string
  ) {
    return this.listingService.addCartItem(body, userId);
  }

  @ApiOperation({
    summary: 'Remove item from cart',
    operationId: 'removeCartItem',
  })
  @WithGuard()
  @Delete('cart/items/:listingId')
  removeItemFromCart(
    @Param('listingId') listingId: string,
    @User('userId') userId: string
  ) {
    return this.listingService.removeCartItem(listingId, userId);
  }
}
