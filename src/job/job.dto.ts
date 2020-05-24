import { ApiProperty } from '@nestjs/swagger';
import { Job, JobLevel, JobLevelEnum } from './job.type';

export class JobDto implements Job {
  @ApiProperty({
    description: 'Title of the job',
    examples: ['Product Owner', 'Software Engineer'],
  })
  title: string;
  department: string;

  @ApiProperty({
    enum: JobLevelEnum,
  })
  level: JobLevel;
  summary: string;
  descriptions: string[];
  requirements: string[];
}

export class JobResponse extends JobDto {
  @ApiProperty({
    description: 'Unique id for the job',
  })
  _id: string;
}
