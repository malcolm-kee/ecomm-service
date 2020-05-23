import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import rimraf from 'rimraf';
import {
  imageOutputFolder,
  numOfUsers,
  outputFolder,
  publicPath,
} from './constants';
import { createCommentDb } from './create-comment-db';
import { createProductDb } from './create-product-db';
import { createUserDb } from './create-user-db';
import { ImageProcessor } from './image-processor';
import jobPostings from './jobs.json';
import { processBannerImages } from './process-banner-images';
import { DbBanner, DbComment, DbProduct, DbUser, JobPosting } from './type';

function clean() {
  return new Promise(function(fulfill, reject) {
    rimraf(outputFolder, function afterRimraf(rimrafErr) {
      if (rimrafErr) {
        console.error('rimraf error');
        return reject(rimrafErr);
      }
      mkdirp(outputFolder)
        .then(fulfill)
        .catch(mkdirErr => {
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

function buildDb({
  products,
  banners,
  users,
  comments,
  jobs,
}: {
  products: DbProduct[];
  banners: DbBanner[];
  users: DbUser[];
  comments: DbComment[];
  jobs: JobPosting[];
}) {
  return new Promise(function(fulfill, reject) {
    fs.writeFile(
      path.resolve(outputFolder, 'db.json'),
      JSON.stringify({
        banners,
        comments,
        users,
        products,
        jobs,
        chats: [],
      }),
      'utf8',
      function afterBuildDb(err) {
        if (err) {
          console.error('Error build db');
          console.error(err);
          return reject(err);
        }

        console.log('Success build db');
        fulfill();
      }
    );
  });
}

async function build() {
  try {
    const imageProcessor = new ImageProcessor(15);

    await clean();
    await setupPublicFolder();
    const [products, users, banners] = await Promise.all([
      createProductDb(imageProcessor),
      createUserDb(numOfUsers),
      processBannerImages(imageProcessor),
    ]);
    const comments = createCommentDb(products, users);

    await buildDb({
      banners,
      products,
      users,
      comments,
      jobs: jobPostings as JobPosting[],
    });

    if (!imageProcessor.isEmpty) {
      console.log(`Waiting image generations...`);
      imageProcessor.logProgress();
      imageProcessor.on('done', () => {
        console.log(`Image generation done`);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

build();
