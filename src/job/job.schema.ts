import { Schema } from 'mongoose';
import { Job, JobLevelEnum, JOB_SCHEMA } from './job.type';

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
    headcount: Number,
  },
  { timestamps: true }
);

export const JobApplicationSchema = new Schema(
  {
    applicantUserId: { type: Schema.Types.ObjectId, required: true },
    job: { type: Schema.Types.ObjectId, ref: JOB_SCHEMA, required: true },
    linkedinUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
