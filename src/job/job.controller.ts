import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobDto, JobResponse } from './job.dto';
import { JobService } from './job.service';

@ApiTags('job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ApiResponse({
    status: 200,
    type: JobResponse,
    isArray: true,
  })
  @Get()
  getJobs() {
    return this.jobService.getMany();
  }

  @ApiResponse({
    status: 200,
    type: JobResponse,
  })
  @Get(':id')
  getJob(@Param('id') id: string) {
    return this.jobService.getOne(id);
  }

  @ApiResponse({
    status: 200,
    type: JobResponse,
  })
  @Post()
  createJob(@Body() body: JobDto) {
    return this.jobService.create(body);
  }
}
