import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '../auth';
import { WithGuard } from '../shared/with-guard.decorator';
import { CreateJobApplicationDto, JobApplicationDto } from './job.dto';
import { JobService } from './job.service';

@ApiTags('job')
@Controller('job-application')
export class JobApplicationController {
  constructor(private readonly jobService: JobService) {}

  @ApiOperation({
    summary: 'List job applications',
    operationId: 'listJobApplications',
  })
  @ApiQuery({
    name: 'jobId',
    type: 'string',
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: JobApplicationDto,
    isArray: true,
  })
  @WithGuard()
  @Get()
  listJobApplications(
    @Query('jobId') jobId: string,
    @User('userId') userId: string
  ) {
    return this.jobService.getJobApplications(
      Object.assign(
        {
          applicantUserId: userId,
        },
        jobId
          ? {
              job: jobId,
            }
          : {}
      )
    );
  }

  @ApiOperation({
    summary: 'Create a job application',
    operationId: 'createJobApplication',
  })
  @ApiResponse({
    status: 201,
    type: JobApplicationDto,
  })
  @WithGuard()
  @Post('')
  createJobApplication(
    @Body() body: CreateJobApplicationDto,
    @User('userId') userId: string
  ) {
    return this.jobService.createJobApplication(body, userId);
  }

  @ApiOperation({
    summary: 'Delete job application',
    operationId: 'deleteJobApplication',
  })
  @ApiResponse({
    status: 200,
    type: JobApplicationDto,
  })
  @WithGuard()
  @Delete(':id')
  deleteJobApplication(
    @Param('id') id: string,
    @User('userId') userId: string
  ) {
    return this.jobService.deleteJobApplication(id, userId);
  }
}
