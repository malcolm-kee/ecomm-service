import { Schema } from 'mongoose';
import { Job, JobLevelEnum } from './job.type';

export const JobSchema = new Schema<Job>(
  {
    title: String,
    department: String,
    level: {
      type: String,
      enum: JobLevelEnum,
    },
    summary: String,
    descriptions: [String],
    requirements: [String],
  },
  { timestamps: true }
);
