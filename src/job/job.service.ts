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
    page = 1,
    limit = 10,
  }: {
    page?: number;
    before?: string;
    limit?: number | string;
  } = {}) {
    const limitValue = Number(limit);

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
          skip: limitValue * Math.max(page - 1, 0),
          limit: limitValue,
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
