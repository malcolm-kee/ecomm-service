import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard, User } from 'auth';
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteJobApplication(
    @Param('id') id: string,
    @User('userId') userId: string
  ) {
    return this.jobService.deleteJobApplication(id, userId);
  }
}
