const agent = require('superagent');
const { baseUrl } = require('./constants');
const { createUsers } = require('./create-users');

exports.initChat = async function initChat() {
  console.log(`Initing chat...`);

  const rootUser = {
    name: 'root',
    email: 'root@root.com',
    password: 'password',
    avatar: '',
  };

  const createdRootUsers = await createUsers({
    userData: [rootUser],
  });

  console.log({ createdRootUsers });

  const loginResult = await agent
    .post(`${baseUrl}/login`)
    .type('json')
    .send({
      username: rootUser.email,
      password: rootUser.password,
    })
    .then(res => res.body);

  await agent
    .post(`${baseUrl}/chat/room`)
    .type('json')
    .set('Authorization', `Bearer ${loginResult.access_token}`)
    .send({
      roomType: 'global',
      participantUserIds: [],
      messages: [],
    });

  console.log(`Done initing chat.`);

  return loginResult.access_token;
};
