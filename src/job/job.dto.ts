import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { DocumentDto } from '../constants';
import { Job, JobLevel, JobLevelEnum } from './job.type';

export class JobDto implements Job {
  @ApiProperty({
    description: 'Title of the job',
    example: 'Product Owner',
  })
  @IsString()
  title: string;

  @IsString()
  department: string;

  @ApiProperty({
    enum: JobLevelEnum,
  })
  @IsIn(JobLevelEnum)
  @IsString()
  level: JobLevel;

  @IsString()
  summary: string;

  @IsString({
    each: true,
  })
  descriptions: string[];

  @IsString({
    each: true,
  })
  requirements: string[];
}

export class UpdateJobDto extends PartialType(JobDto) {}

export class JobResponse extends JobDto implements DocumentDto {
  @ApiProperty({
    description: 'Unique id for the job',
  })
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}
