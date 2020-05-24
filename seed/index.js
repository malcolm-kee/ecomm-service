const agent = require('superagent');
const { baseUrl } = require('./constants');
const { seedComments } = require('./seed-comments');
const { seedJobs } = require('./seed-jobs');
const { seedMarketing } = require('./seed-marketing');
const { seedProducts } = require('./seed-products');
const { seedUsers } = require('./seed-users');

const waitUntil = (callback, { timeout = 3000, retries = 3 } = {}) =>
  new Promise((fulfill, reject) => {
    let retryCount = 0;

    const retry = error => {
      if (retryCount < retries) {
        retryCount++;
        setTimeout(runCode, timeout);
      } else {
        reject(error);
      }
    };

    const runCode = () => {
      try {
        Promise.resolve(callback())
          .then(fulfill)
          .catch(retry);
      } catch (err) {
        retry(err);
      }
    };

    runCode();
  });

(async function seedData() {
  await waitUntil(() =>
    agent.get(`${baseUrl}/api`).then(res => {
      if (!res.ok) {
        throw new Error(`Response not ok`);
      }
    })
  );

  const [productIdMap] = await Promise.all([
    seedProducts(),
    seedUsers(),
    seedJobs(),
    seedMarketing(),
  ]);

  await seedComments(productIdMap);
})();
