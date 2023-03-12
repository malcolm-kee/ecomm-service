import { faker } from '@faker-js/faker';
import { Comment, Product, User } from './type';

function getCommentCount() {
  return faker.datatype.number({ min: 0, max: 10 });
}

function pickUser(users: User[]) {
  const userIndex = faker.datatype.number({
    min: 0,
    max: users.length - 1,
    precision: 1,
  });
  return users[userIndex];
}

export function createCommentDb(products: Product[], users: User[]): Comment[] {
  return products
    .map((product) => {
      const comments: Comment[] = [];

      for (let index = 0; index < getCommentCount(); index++) {
        const user = pickUser(users);
        comments.push({
          productId: product.id,
          userName: user.name,
          content: faker.lorem.sentence(),
          createdOn: faker.date.past().getTime(),
          rating: faker.datatype.number({
            min: 1,
            max: 5,
          }),
        });
      }

      return comments;
    })
    .reduce((result, comments) => result.concat(comments), []);
}
