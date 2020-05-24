const agent = require('superagent');
const data = require('../build/db.json');
const { baseUrl } = require('./constants');

exports.seedMarketing = async function seedMarketing() {
  try {
    for (const banner of data.banners) {
      await agent
        .post(`${baseUrl}/marketing`)
        .type('json')
        .send({ type: 'banner', data: banner });
    }
  } catch (err) {
    console.error(err);
  }
};
