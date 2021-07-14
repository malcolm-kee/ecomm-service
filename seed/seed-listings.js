const _ = require('lodash');
const agent = require('superagent');
const data = require('../build/db.json');
const { baseUrl } = require('./constants');

exports.seedListings = async function seedListings() {
  try {
    for (const listing of data.listings) {
      await agent.post(`${baseUrl}/marketplace`).type('json').send(listing);

      console.log('Seeded listing', listing.title);
    }
  } catch (err) {
    console.error(err);
  }
};
