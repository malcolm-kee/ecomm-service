const _ = require('lodash');
const agent = require('superagent');
const data = require('../build/db.json');
const { baseUrl } = require('./constants');

exports.seedJobs = async function seedJobs() {
  try {
    for (const job of data.jobs) {
      await agent
        .post(`${baseUrl}/job`)
        .type('json')
        .send(_.omit(job, ['id']));
    }
  } catch (err) {
    console.error(err);
  }
};
