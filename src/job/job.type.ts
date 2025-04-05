import { Document } from 'mongoose';

export const JobLevelEnum = [
  'internship',
  'entry',
  'experienced',
  'manager',
] as const;

export type JobLevel = (typeof JobLevelEnum)[number];

export type Job = {
  title: string;
  department: string;
  level: JobLevel;
  summary: string;
  descriptions?: string[];
  requirements?: string[];
  headcount: number;
};

export type JobDocument = Job & Document<string, unknown, Job>;

export const JOB_SCHEMA = 'Job';

export interface JobApplication {
  applicantUserId: string;
  job: Job;
  linkedinUrl: string;
}

export type JobApplicationDocument = {
  applicantUserId: string;
  job: string;
  linkedinUrl: string;
} & Document<string, unknown, JobApplication>;

export const JOB_APPLICATION_SCHEMA = 'JobApplication';
