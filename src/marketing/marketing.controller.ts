import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarketingDataDto, MarketingDataResponse } from './marketing.dto';
import { MarketingService } from './marketing.service';

@ApiTags('marketing')
@Controller('marketing')
export class MarketingController {
  constructor(private readonly service: MarketingService) {}

  @ApiResponse({
    status: 200,
    type: MarketingDataResponse,
    isArray: true,
  })
  @Get('type/:type')
  getDataByType(@Param('type') type: string) {
    return this.service.getDataByType(type);
  }

  @ApiResponse({
    status: 201,
    type: MarketingDataResponse,
  })
  @Post()
  createData(@Body() body: MarketingDataDto) {
    return this.service.createData(body);
  }

  @ApiResponse({
    status: 200,
    type: MarketingDataResponse,
  })
  @ApiResponse({
    status: 404,
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

  @ApiResponse({
    status: 200,
    type: MarketingDataResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No data with the specified id exists.',
  })
  @Delete('record/:id')
  async removeData(@Param('id') id: string) {
    const deletedData = this.service.deleteOneData(id);

    if (!deletedData) {
      throw new NotFoundException();
    }

    return deletedData;
  }
}
