import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
  })
  @IsObject()
  data: {
    [field: string]: any;
  };
}

export class MarketingDataResponse extends MarketingDataDto {
  @ApiProperty({
    description: 'Unique id for the data',
  })
  _id: string;
}
