import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JOB_SCHEMA, JobDocument, Job } from './job.type';
import { Model } from 'mongoose';

@Injectable()
export class JobService {
  constructor(@InjectModel(JOB_SCHEMA) private jobModel: Model<JobDocument>) {}

  create(job: Job) {
    return this.jobModel.create(job);
  }

  getOne(id: string) {
    return this.jobModel.findById(id).exec();
  }

  getMany({
    before,
    limit = 10,
  }: {
    before?: string;
    limit?: number | string;
  } = {}) {
    return this.jobModel
      .find(
        before
          ? {
              createdAt: {
                $lt: before,
              },
            }
          : {},
        {},
        {
          sort: {
            createdAt: -1,
          },
          limit: Number(limit),
        }
      )
      .exec();
  }

  updateOne(id: string, changes: Partial<Job>) {
    return this.jobModel.findByIdAndUpdate(id, changes, { new: true }).exec();
  }

  deleteOne(id: string) {
    return this.jobModel.findByIdAndRemove(id).exec();
  }
}
