const agent = require('superagent');
const data = require('../build/db.json');
const { baseUrl } = require('./constants');

exports.seedComments = async function seedComments(productIdMap) {
  console.log('Seeding comments...');
  try {
    for (const comment of data.comments) {
      const productId = productIdMap.get(comment.productId);
      if (productId) {
        await agent
          .post(`${baseUrl}/product/comment/${productId}`)
          .type('json')
          .send({
            userName: comment.userName,
            content: comment.content,
            rating: comment.rating,
          });
      }
    }
  } catch (err) {
    console.error(err);
  }
  console.log('Done seeding comments.');
};
