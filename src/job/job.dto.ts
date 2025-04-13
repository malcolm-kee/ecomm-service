import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { DocumentDto } from '../constants';
import { Job, JobLevel, JobLevelEnum } from './job.type';

export class JobDto implements Job {
  @ApiProperty({
    description: 'Title of the job',
    example: 'Product Owner',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Department the job is assigned to',
    example: 'Product Management',
  })
  @IsString()
  department: string;

  @ApiProperty({
    enum: JobLevelEnum,
  })
  @IsIn(JobLevelEnum)
  @IsString()
  level: JobLevel;

  @ApiProperty({
    example:
      'The job requires next-gen vision and on-the-ground can do mindset.',
  })
  @IsString()
  summary: string;

  @IsString({
    each: true,
  })
  @IsOptional()
  descriptions?: string[];

  @IsString({
    each: true,
  })
  @IsOptional()
  requirements?: string[];

  @IsNumber()
  @Min(1)
  @IsInt()
  headcount: number;
}

export class UpdateJobDto extends PartialType(JobDto) {}

export class JobResponseDto extends JobDto implements DocumentDto {
  @ApiProperty({
    description: 'Unique id for the job',
  })
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export class CreateJobApplicationDto {
  jobId: string;
  @ApiProperty({
    example: 'https://www.linkedin.com/in/leehsienloong/',
  })
  linkedinUrl: string;
}

export class JobApplicationDto {
  job: JobResponseDto;
  @ApiProperty({
    example: 'https://www.linkedin.com/in/leehsienloong/',
  })
  linkedinUrl: string;
}
