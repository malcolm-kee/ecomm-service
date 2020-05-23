const { seedProducts } = require('./seed-products');

(async function seedData() {
  await seedProducts();
})();
