import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  })
  @ApiResponse({
    status: 200,
    type: MarketplaceListingResponse,
    isArray: true,
  })
  @Get()
  getListings() {
    return this.listingService.getMany();
  }

  @ApiOperation({
    summary: 'Get details of one listing',
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
