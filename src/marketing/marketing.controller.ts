import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MarketingDataDto, MarketingDataResponse } from './marketing.dto';
import { MarketingService } from './marketing.service';

@ApiTags('marketing')
@Controller('marketing')
export class MarketingController {
  constructor(private readonly service: MarketingService) {}

  @ApiOperation({
    operationId: 'getMarketingDataByType',
    summary: 'Get marketing data by type',
  })
  @ApiOkResponse({
    type: MarketingDataResponse,
    isArray: true,
  })
  @Get('type/:type')
  getDataByType(@Param('type') type: string) {
    return this.service.getDataByType(type);
  }

  @ApiOperation({
    operationId: 'createMarketingData',
    summary: 'Create marketing data',
  })
  @ApiResponse({
    status: 201,
    type: MarketingDataResponse,
  })
  @Post()
  createData(@Body() body: MarketingDataDto) {
    return this.service.createData(body);
  }

  @ApiOperation({
    operationId: 'getMarketingDataById',
    summary: 'Get marketing data by id',
  })
  @ApiOkResponse({
    type: MarketingDataResponse,
  })
  @ApiNotFoundResponse({
    description: 'No data with the specified id exists.',
  })
  @Get('record/:id')
  async getDAtaById(@Param('id') id: string) {
    const record = await this.service.getOneData(id);

    if (!record) {
      throw new NotFoundException();
    }

    return record;
  }

  @ApiOperation({
    operationId: 'removeMarketingData',
    summary: 'Remove marketing data',
  })
  @ApiOkResponse({
    type: MarketingDataResponse,
  })
  @ApiNotFoundResponse({
    description: 'No data with the specified id exists.',
  })
  @Delete('record/:id')
  async removeData(@Param('id') id: string) {
    const deletedData = await this.service.deleteOneData(id);

    if (!deletedData) {
      throw new NotFoundException();
    }

    return deletedData;
  }
}
