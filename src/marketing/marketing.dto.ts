import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

import { DataModel } from './marketing.type';

export class MarketingDataDto implements DataModel {
  @ApiProperty({
    description: 'Type of the data',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Data',
    type: 'object',
    properties: {},
  })
  @IsObject()
  data: {
    [field: string]: unknown;
  };
}

export class MarketingDataResponse extends MarketingDataDto {
  @ApiProperty({
    description: 'Unique id for the data',
  })
  _id: string;
}
