import jobPostings from './jobs.json';
import { JobPosting } from './type';
import faker from 'faker';
import _ from 'lodash';

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'UI/UX Design',
  'Operations',
  'Corporate Functions',
  'Consulting',
];

const LEVELS = ['internship', 'entry', 'experienced', 'manager'] as const;

export const createJobDb = (numOfJob: number): JobPosting[] => {
  const result = jobPostings as JobPosting[];

  Array.from({ length: numOfJob }).forEach(() => {
    result.push({
      id: faker.datatype.uuid(),
      title: faker.name.jobTitle(),
      department: _.sample(DEPARTMENTS),
      level: _.sample(LEVELS),
      descriptions: [faker.name.jobDescriptor()],
      summary: faker.name.jobDescriptor(),
      headcount: faker.datatype.number(10),
    });
  });

  return result;
};
