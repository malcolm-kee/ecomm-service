const agent = require('superagent');
const data = require('../build/db.json');
const { baseUrl } = require('./constants');

exports.createUsers = async function createUsers({
  userData = data.users,
} = {}) {
  const users = [];

  for (const user of userData) {
    try {
      await agent
        .post(`${baseUrl}/register`)
        .type('json')
        .send(user);

      users.push(user);
    } catch (err) {
      console.error(err);
    }
  }

  return users;
};
