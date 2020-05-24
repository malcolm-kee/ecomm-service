const agent = require('superagent');
const { seedMarketing } = require('./seed-marketing');
const { seedProducts } = require('./seed-products');
const { seedJobs } = require('./seed-jobs');
const { baseUrl } = require('./constants');

const tryUntil = (callback, { timeout = 3000, retries = 3 } = {}) =>
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
  await tryUntil(() =>
    agent.get(`${baseUrl}/api`).then(res => {
      if (!res.ok) {
        throw new Error(`Response not ok`);
      }
    })
  );

  await Promise.all([seedProducts(), seedJobs(), seedMarketing()]);
})();
