require('dotenv').config();
const agent = require('superagent');
const { baseUrl } = require('./constants');
const { createUsers } = require('./create-users');
const { initChat } = require('./init-chat');
const { seedComments } = require('./seed-comments');
const { seedJobs } = require('./seed-jobs');
const { seedMarketing } = require('./seed-marketing');
const { seedProducts } = require('./seed-products');

const waitUntil = (callback, { timeout = 3000, retries = 3 } = {}) =>
  new Promise((fulfill, reject) => {
    let retryCount = 0;

    const retry = (error) => {
      if (retryCount < retries) {
        retryCount++;
        setTimeout(runCode, timeout);
      } else {
        reject(error);
      }
    };

    const runCode = () => {
      try {
        Promise.resolve(callback()).then(fulfill).catch(retry);
      } catch (err) {
        retry(err);
      }
    };

    runCode();
  });

(async function seedData() {
  try {
    await waitUntil(() =>
      agent.get(`${baseUrl}/docs`).then((res) => {
        if (!res.ok) {
          throw new Error(`Response not ok`);
        }
      })
    );

    const rootToken = await initChat();

    const [productIdMap] = await Promise.all([
      seedProducts(),
      createUsers(),
      seedJobs(),
      seedMarketing(),
    ]);

    await seedComments(productIdMap);

    const newRoom = await agent
      .post(`${baseUrl}/chat/room`)
      .type('json')
      .set('Authorization', `Bearer ${rootToken}`)
      .send({
        roomType: 'group',
        participantUserIds: [],
        messages: [],
      })
      .then((res) => res.body);

    const anotherUser = {
      name: 'Malcolm',
      email: 'malcolm@github.com',
      password: 'password',
      avatar: '',
    };

    await createUsers({
      userData: [anotherUser],
    });

    const newUser = await agent
      .post(`${baseUrl}/login`)
      .type('json')
      .send({
        username: anotherUser.email,
        password: anotherUser.password,
      })
      .then((res) => res.body);

    const result = await agent
      .post(`${baseUrl}/chat/room/${newRoom._id}/join`)
      .type('json')
      .set('Authorization', `Bearer ${newUser.access_token}`)
      .then((res) => res.body);

    console.log({ newRoom, result });
  } catch (fatalError) {
    console.error(fatalError);
  }
})();
