import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsIn, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { DocumentDto } from '../constants';
import {
  ItemAvailability,
  ItemAvailabilityEnum,
  ItemCondition,
  ItemConditionEnum,
  MarketplaceListing,
  MarketplaceCartItem,
} from './marketplace.type';

export class MarketplaceListingDto implements MarketplaceListing {
  @ApiProperty({
    description: 'Title for the listing',
    example: 'Tiffany Teapot (2019)',
  })
  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    enum: ItemConditionEnum,
  })
  @IsIn(ItemConditionEnum)
  condition: ItemCondition;

  @ApiProperty({
    description: 'Description for the listing',
    example: 'Luxurious Tiffany teapot designed by Cha Wakanda',
  })
  @IsString()
  description: string;

  @ApiProperty({
    enum: ItemAvailabilityEnum,
  })
  @IsIn(ItemAvailabilityEnum)
  availability: ItemAvailability;

  @ApiProperty({
    description: 'Image for the listing',
    example:
      'https://images.unsplash.com/photo-1594995846645-d58328c3ffa4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=543&h=384&q=80',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description:
      'Num of available stock. Only applicable if availability is in-stock',
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  numOfStock?: number;
}

export class UpdateMarketplaceListingDto extends PartialType(
  MarketplaceListingDto
) {}

export class MarketplaceListingResponse
  extends MarketplaceListingDto
  implements DocumentDto
{
  @ApiProperty({
    description: 'Unique id for the listing',
  })
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export class AddMarketplaceCartItemDto {
  listingId: string;
  quantity: number;
}

export class MarketplaceCartItemDto implements MarketplaceCartItem {
  @ApiProperty({
    type: MarketplaceListingDto,
  })
  listing: MarketplaceListingDto;
  @ApiProperty({
    example: 2,
  })
  quantity: number;
}
