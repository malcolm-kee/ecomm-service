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
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { omitBy } from 'lodash';
import type { FilterQuery } from 'mongoose';

import {
  ApiPaginatedResponse,
  Pagination,
} from '../shared/pagination.decorator';
import { PaginatedDto } from '../shared/pagination.dto';
import { WithValidation } from '../shared/with-validation.decorator';
import { JobDto, JobResponseDto, UpdateJobDto } from './job.dto';
import { JobService } from './job.service';
import { type JobDocument, type JobLevel, JobLevelEnum } from './job.type';

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
  @ApiQuery({
    name: 'title',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'level',
    required: false,
    type: 'string',
    enum: JobLevelEnum,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description:
      'Search for jobs by title, level, department, summary, or description',
  })
  @ApiPaginatedResponse(JobResponseDto)
  @Get('list')
  listJobs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('title') title?: string,
    @Query('level') level?: JobLevel,
    @Query('search') search?: string
  ): Promise<PaginatedDto<JobResponseDto>> {
    return this.jobService.getManyPaginated({
      page,
      limit,
      query: this.constructSearchQuery({
        title: title?.trim(),
        level: level?.trim() as JobLevel,
        search: search?.trim(),
      }),
    });
  }

  private constructSearchQuery(filters: {
    title?: string;
    level?: JobLevel;
    search?: string;
  }): FilterQuery<JobDocument> {
    if (filters.search) {
      const searchTerm = filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(searchTerm, 'i');

      return {
        $or: [
          { title: { $regex: searchRegex } },
          { level: { $regex: searchRegex } },
          { department: { $regex: searchRegex } },
          { summary: { $regex: searchRegex } },
          { descriptions: { $elemMatch: { $regex: searchRegex } } },
          { requirements: { $elemMatch: { $regex: searchRegex } } },
        ],
      };
    }

    const sanitizedTitle = filters.title
      ? filters.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      : undefined;

    return omitBy(
      {
        title: sanitizedTitle && {
          $regex: new RegExp(sanitizedTitle, 'i'),
        },
        level: filters.level && {
          $eq: filters.level,
        },
      },
      (x) => !x
    );
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
