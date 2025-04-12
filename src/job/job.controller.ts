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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  ApiPaginatedResponse,
  Pagination,
} from '../shared/pagination.decorator';
import { PaginatedDto } from '../shared/pagination.dto';
import { JobDto, JobResponse, UpdateJobDto } from './job.dto';
import { JobService } from './job.service';

@ApiTags('job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ApiOperation({
    summary: 'Get list of available jobs',
    operationId: 'getJobs',
  })
  @ApiOkResponse({
    type: JobResponse,
    isArray: true,
  })
  @Pagination()
  @Get()
  async getJobs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('delay') delay?: number
  ) {
    if (delay) {
      await new Promise((f) => setTimeout(f, Number(delay)));
    }

    return this.jobService.getMany({
      page,
      limit,
    });
  }

  @ApiOperation({
    summary: 'List available jobs with pagination',
    operationId: 'listJobs',
  })
  @Pagination()
  @ApiPaginatedResponse(JobResponse)
  @Get('list')
  listJobs(
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<PaginatedDto<JobResponse>> {
    return this.jobService.getManyPaginated({
      page,
      limit,
    });
  }

  @ApiOperation({
    summary: 'Get details of one job',
    operationId: 'getJob',
  })
  @ApiOkResponse({
    type: JobResponse,
  })
  @Get(':id')
  getJob(@Param('id') id: string) {
    return this.jobService.getOne(id);
  }

  @ApiOperation({
    summary: 'Create a job',
    operationId: 'createJob',
  })
  @ApiOkResponse({
    type: JobResponse,
  })
  @Post()
  createJob(@Body() body: JobDto) {
    return this.jobService.create(body);
  }

  @ApiOperation({
    summary: 'Update a job',
    operationId: 'updateJob',
  })
  @ApiOkResponse({
    type: JobResponse,
  })
  @Patch(':id')
  updateJob(@Param('id') id: string, @Body() body: UpdateJobDto) {
    return this.jobService.updateOne(id, body);
  }

  @ApiOperation({
    summary: 'Delete a job',
    operationId: 'deleteJob',
  })
  @ApiOkResponse({
    type: JobResponse,
  })
  @Delete(':id')
  deleteJob(@Param('id') id: string) {
    return this.jobService.deleteOne(id);
  }
}
