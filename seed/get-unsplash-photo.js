require('dotenv').config();
const fetch = require('node-fetch');
const { createApi } = require('unsplash-js');
const fs = require('fs').promises;
const path = require('path');

const unsplash = createApi({
  fetch,
  accessKey: process.env.UNSPLASH_API_ACCESS_KEY,
});

(async function makeRequest() {
  const unsplashResult = await unsplash.photos.getRandom({
    query: 'product',
    count: 30,
  });

  if (unsplashResult.errors) {
    console.log(unsplashResult.errors);
    return;
  }

  const result = unsplashResult.response.map((result) => ({
    description: result.description,
    alt: result.alt_description,
    url: `${result.urls.raw}&auto=format&fit=crop&w=543&h=384&q=80`,
    colors: result.color,
  }));

  await fs.writeFile(
    path.resolve(__dirname, 'images.json'),
    JSON.stringify(result, null, 2),
    'utf-8'
  );
})();
