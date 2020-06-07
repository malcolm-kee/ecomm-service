import faker from 'faker';
import { Types } from 'mongoose';
import { User } from './type';

function createUserProfile(): User {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  return {
    id: Types.ObjectId(),
    name: `${firstName} ${lastName}`,
    email: faker.internet.email(firstName, lastName),
    joinedDate: faker.date.past().getTime(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(10),
  };
}

export function createUserDb(userCount: number) {
  const users: User[] = [
    {
      id: Types.ObjectId(),
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
