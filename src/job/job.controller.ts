import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobDto, JobResponse, UpdateJobDto } from './job.dto';
import { JobService } from './job.service';

@ApiTags('job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ApiOperation({
    summary: 'Get list of available jobs',
  })
  @ApiResponse({
    status: 200,
    type: JobResponse,
    isArray: true,
  })
  @Get()
  getJobs() {
    return this.jobService.getMany();
  }

  @ApiOperation({
    summary: 'Get details of one job',
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
