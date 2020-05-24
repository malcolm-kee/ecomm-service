import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';
import { Job, JobLevel, JobLevelEnum } from './job.type';

export class JobDto implements Job {
  @ApiProperty({
    description: 'Title of the job',
    examples: ['Product Owner', 'Software Engineer'],
  })
  @IsString()
  title: string;

  @IsString()
  department: string;

  @ApiProperty({
    enum: JobLevelEnum,
  })
  @IsIn(JobLevelEnum as any)
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

export class JobResponse extends JobDto {
  @ApiProperty({
    description: 'Unique id for the job',
  })
  _id: string;
}