const _ = require('lodash');
const agent = require('superagent');
const data = require('../build/db.json');
const { baseUrl } = require('./constants');

exports.seedProducts = async function seedProducts() {
  try {
    const idMap = new Map();

    for (const product of data.products) {
      const res = await agent
        .post(`${baseUrl}/product`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(
          _.assign(_.omit(product, ['id', 'related']), {
            related: [],
          })
        )
        .then(res => res.body);

      idMap.set(product.id, res._id);
    }

    for (const product of data.products) {
      const productId = idMap.get(product.id);
      const relatedProductsId = product.related.map(id => idMap.get(id));

      await agent
        .put(`${baseUrl}/product/${productId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          related: relatedProductsId,
        });
    }
  } catch (err) {
    console.error(err);
  }
};
