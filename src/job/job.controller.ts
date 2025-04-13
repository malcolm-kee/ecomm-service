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
import { WithValidation } from '../shared/with-validation.decorator';
import { JobDto, JobResponseDto, UpdateJobDto } from './job.dto';
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
    type: JobResponseDto,
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
  @ApiPaginatedResponse(JobResponseDto)
  @Get('list')
  listJobs(
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<PaginatedDto<JobResponseDto>> {
    return this.jobService.getManyPaginated({
      page,
      limit,
    });
  }

  @ApiOperation({
    summary: 'Get details of one job',
    operationId: 'getJob',
  })
  @Get(':id')
  getJob(@Param('id') id: string): Promise<JobResponseDto> {
    return this.jobService.getOne(id);
  }

  @ApiOperation({
    summary: 'Create a job',
    operationId: 'createJob',
  })
  @WithValidation()
  @Post()
  createJob(@Body() body: JobDto): Promise<JobResponseDto> {
    return this.jobService.create(body);
  }

  @ApiOperation({
    summary: 'Update a job',
    operationId: 'updateJob',
  })
  @WithValidation()
  @Patch(':id')
  updateJob(
    @Param('id') id: string,
    @Body() body: UpdateJobDto
  ): Promise<JobResponseDto> {
    return this.jobService.updateOne(id, body);
  }

  @ApiOperation({
    summary: 'Delete a job',
    operationId: 'deleteJob',
  })
  @Delete(':id')
  deleteJob(@Param('id') id: string): Promise<JobResponseDto> {
    return this.jobService.deleteOne(id);
  }
}
