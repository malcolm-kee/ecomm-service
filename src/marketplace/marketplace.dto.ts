import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { DocumentDto } from '../constants';
import {
  ItemAvailability,
  ItemAvailabilityEnum,
  ItemCondition,
  ItemConditionEnum,
  MarketplaceListing,
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
}

export class UpdateMarketplaceListingDto extends PartialType(
  MarketplaceListingDto
) {}

export class MarketplaceListingResponse
  extends MarketplaceListingDto
  implements DocumentDto
{
  @ApiProperty({
    description: 'Unique id for the job',
  })
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}
