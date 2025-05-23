import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { User } from './type';

function createUserProfile(): User {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    id: new Types.ObjectId(),
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }),
    joinedDate: faker.date.past().getTime(),
    avatar: faker.image.avatar(),
    password: faker.internet.password({ length: 10 }),
  };
}

export function createUserDb(userCount: number) {
  const users: User[] = [
    {
      id: new Types.ObjectId(),
      name: 'Test User',
      email: 'test@shopit.com',
      joinedDate: faker.date.past().getTime(),
      avatar: faker.image.avatar(),
      password: '12345678',
    },
  ];
  for (let index = 0; index < userCount; index++) {
    users.push(createUserProfile());
  }
  return users;
}
