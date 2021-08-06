import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'shared/pagination.decorator';
import {
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
  @ApiResponse({
    status: 200,
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
  @ApiResponse({
    status: 200,
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
  @ApiResponse({
    status: 200,
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
  @ApiResponse({
    status: 200,
    type: MarketplaceListingResponse,
  })
  @Delete(':id')
  deleteListing(@Param('id') id: string) {
    return this.listingService.deleteOne(id);
  }
}
