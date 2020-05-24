import fs from 'fs';
import mkdirp from 'mkdirp';
import markdownIt from 'markdown-it';
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

const fsys = fs.promises;

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

async function buildDb({
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
  return fsys.writeFile(
    path.resolve(outputFolder, 'db.json'),
    JSON.stringify({
      banners,
      comments,
      users,
      products,
      jobs,
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
    const [products, users, banners] = await Promise.all([
      createProductDb(imageProcessor),
      createUserDb(numOfUsers),
      processBannerImages(imageProcessor),
      generateHomePage(),
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
