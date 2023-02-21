import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateJobApplicationDto } from './job.dto';
import {
  Job,
  JobApplicationDocument,
  JobDocument,
  JOB_APPLICATION_SCHEMA,
  JOB_SCHEMA,
} from './job.type';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(JOB_SCHEMA) private jobModel: Model<JobDocument>,
    @InjectModel(JOB_APPLICATION_SCHEMA)
    private jobApplicationModel: Model<JobApplicationDocument>
  ) {}

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

  async createJobApplication(data: CreateJobApplicationDto, userId: string) {
    const createdApplication = await this.jobApplicationModel.create({
      job: data.jobId,
      linkedinUrl: data.linkedinUrl,
      applicantUserId: userId,
    });

    return (await createdApplication.populate('job')).save();
  }

  getJobApplications(filter: { job?: string; applicantUserId: string }) {
    return this.jobApplicationModel.find(filter).populate('job').exec();
  }

  deleteJobApplication(applicationId: string, userId: string) {
    return this.jobApplicationModel
      .findOneAndRemove({
        _id: applicationId,
        applicantUserId: userId,
      })
      .exec();
  }
}
