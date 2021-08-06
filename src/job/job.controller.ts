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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from '../shared/pagination.decorator';
import { JobDto, JobResponse, UpdateJobDto } from './job.dto';
import { JobService } from './job.service';

@ApiTags('job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ApiOperation({
    summary: 'Get list of available jobs',
    operationId: 'listJobs',
  })
  @ApiResponse({
    status: 200,
    type: JobResponse,
    isArray: true,
  })
  @Pagination()
  @Get()
  async getJobs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query() query?: any
  ) {
    const delay = query.delay;

    if (delay) {
      await new Promise((f) => setTimeout(f, delay));
    }

    return this.jobService.getMany({
      page,
      limit,
    });
  }

  @ApiOperation({
    summary: 'Get details of one job',
    operationId: 'getJob',
  })
  @ApiResponse({
    status: 200,
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
  @ApiResponse({
    status: 200,
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
  @ApiResponse({
    status: 200,
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
  @ApiResponse({
    status: 200,
    type: JobResponse,
  })
  @Delete(':id')
  deleteJob(@Param('id') id: string) {
    return this.jobService.deleteOne(id);
  }
}
