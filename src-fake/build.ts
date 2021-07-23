require('dotenv').config();

import { once } from 'events';
import fs from 'fs';
import markdownIt from 'markdown-it';
import mkdirp from 'mkdirp';
import path from 'path';
import rimraf from 'rimraf';
import {
  imageOutputFolder,
  numOfJobs,
  numOfListings,
  numOfUsers,
  outputFolder,
  publicPath,
} from './constants';
import { createCommentDb } from './create-comment-db';
import { createJobDb } from './create-job-db';
import { createMarketplaceListingDb } from './create-marketplace-listing-db';
import { createProductDb } from './create-product-db';
import { createUserDb } from './create-user-db';
import { encodeImageToBlurHash, ImageProcessor } from './image-processor';
import { processBannerImages } from './process-banner-images';
import {
  DbBanner,
  DbComment,
  DbProduct,
  DbUser,
  JobPosting,
  MarketingplaceListing,
} from './type';

const fsys = fs.promises;

function clean() {
  return new Promise(function (fulfill, reject) {
    rimraf(outputFolder, function afterRimraf(rimrafErr) {
      if (rimrafErr) {
        console.error('rimraf error');
        return reject(rimrafErr);
      }
      mkdirp(outputFolder)
        .then(fulfill)
        .catch((mkdirErr) => {
          console.error('create build folder error');
          reject(mkdirErr);
        });
    });
  });
}

async function setupPublicFolder() {
  await mkdirp(publicPath);
  await mkdirp(imageOutputFolder);
}

async function buildDb({
  products,
  banners,
  users,
  comments,
  jobs,
  listings,
}: {
  products: DbProduct[];
  banners: DbBanner[];
  users: DbUser[];
  comments: DbComment[];
  jobs: JobPosting[];
  listings: MarketingplaceListing[];
}) {
  return fsys.writeFile(
    path.resolve(outputFolder, 'db.json'),
    JSON.stringify({
      banners,
      comments,
      users,
      products,
      jobs,
      listings,
      chats: [],
    }),
    'utf8'
  );
}

async function generateHomePage() {
  const fileContent = await fsys.readFile(
    path.resolve(__dirname, '..', 'README.md'),
    {
      encoding: 'utf-8',
    }
  );

  const parsedMd = markdownIt({
    html: true,
  }).render(fileContent);

  await fsys.writeFile(
    path.resolve(publicPath, 'index.html'),
    `<!DOCTYPE html>
  <html>
    <head>
      <title>ecomm-service</title>
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css" ></link>
      <style>
        .markdown-body {
          max-width: 70ch;
          margin: 0 auto;
        }
      </style>
    </head>
    <body>
      <div class="markdown-body">
      ${parsedMd}
      </div>
    </body>
  </html>`,
    {
      encoding: 'utf-8',
    }
  );
}

async function build() {
  try {
    const imageProcessor = new ImageProcessor(15);

    await clean();
    await setupPublicFolder();
    const [products, users, banners, listings] = await Promise.all([
      createProductDb(imageProcessor),
      createUserDb(numOfUsers),
      processBannerImages(imageProcessor),
      createMarketplaceListingDb(numOfListings),
      generateHomePage(),
    ]);
    const comments = createCommentDb(products, users);

    if (!imageProcessor.isEmpty) {
      console.log(`Waiting image generations...`);
      imageProcessor.logProgress();
      await once(imageProcessor, 'done');
      console.log(`Image generation done`);
    }

    const finalProducts = await Promise.all(
      products.map(async (p) => {
        const blurhash =
          p.smallImagePath && (await encodeImageToBlurHash(p.smallImagePath));
        return {
          blurhash,
          id: p.id,
          name: p.name,
          descriptions: p.descriptions,
          department: p.department,
          price: p.price,
          image: p.image,
          related: p.related,
          images: p.images,
        };
      })
    );

    await buildDb({
      banners,
      products: finalProducts,
      users,
      comments,
      jobs: createJobDb(numOfJobs),
      listings,
    });
  } catch (err) {
    console.error(err);
  }
}

build();
