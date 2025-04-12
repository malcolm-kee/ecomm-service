import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JobApplicationController } from './job-application.controller';
import { JobController } from './job.controller';
import { JobApplicationSchema, JobSchema } from './job.schema';
import { JobService } from './job.service';
import { JOB_APPLICATION_SCHEMA, JOB_SCHEMA } from './job.type';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: JOB_SCHEMA,
        schema: JobSchema,
      },
      {
        name: JOB_APPLICATION_SCHEMA,
        schema: JobApplicationSchema,
      },
    ]),
  ],
  providers: [JobService],
  controllers: [JobController, JobApplicationController],
})
export class JobModule {}
