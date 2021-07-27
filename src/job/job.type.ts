import { Document } from 'mongoose';

export const JobLevelEnum = [
  'internship',
  'entry',
  'experienced',
  'manager',
] as const;

export type JobLevel = typeof JobLevelEnum[number];

export type Job = {
  title: string;
  department: string;
  level: JobLevel;
  summary: string;
  descriptions?: string[];
  requirements?: string[];
  headcount: number;
};

export type JobDocument = Job & Document;

export const JOB_SCHEMA = 'Job';
