import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobController } from './job.controller';
import { JobSchema } from './job.schema';
import { JobService } from './job.service';
import { JOB_SCHEMA } from './job.type';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: JOB_SCHEMA,
        schema: JobSchema,
      },
    ]),
  ],
  providers: [JobService],
  controllers: [JobController],
})
export class JobModule {}
