const agent = require('superagent');
const data = require('../build/db.json');
const { baseUrl } = require('./constants');

exports.seedUsers = async function seedUsers() {
  const users = [];
  try {
    for (const user of data.users) {
      await agent
        .post(`${baseUrl}/register`)
        .type('json')
        .send(user);

      users.push(user);
    }
  } catch (err) {
    console.error(err);
  }

  return users;
};
