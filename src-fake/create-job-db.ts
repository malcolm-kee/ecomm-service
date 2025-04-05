import { faker } from '@faker-js/faker';
import _ from 'lodash';
import jobPostings from './jobs.json';
import { JobPosting } from './type';

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
      id: faker.string.uuid(),
      title: faker.person.jobTitle(),
      department: _.sample(DEPARTMENTS),
      level: _.sample(LEVELS),
      descriptions: [faker.person.jobDescriptor()],
      summary: faker.person.jobDescriptor(),
      headcount: faker.number.int({ min: 1, max: 10 }),
      requirements: [faker.company.buzzPhrase(), faker.company.buzzPhrase()],
    });
  });

  return result;
};
