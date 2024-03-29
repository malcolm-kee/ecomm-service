import path from 'path';

export const isDev = process.env.IS_DEV === 'true';

export const outputFolder = path.resolve(__dirname, '..', 'build');
export const publicPath = path.resolve(outputFolder, 'public');

export const publicSrcPath = path.resolve(__dirname, '..', 'public');

export const imageOutputFolder = path.join(publicPath, 'images');
export const numOfUsers = isDev ? 5 : 100;
export const numOfProducts = isDev ? 2 : 50;
export const numOfListings = 30;
export const numOfJobs = isDev ? 2 : 100;
const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME;
const FLY_APP_NAME = process.env.FLY_APP_NAME;
const PORT = process.env.PORT || 3000;
const app_baseurl = HEROKU_APP_NAME
  ? `https://${HEROKU_APP_NAME}.herokuapp.com`
  : FLY_APP_NAME
  ? `https://${FLY_APP_NAME}.fly.dev`
  : `http://localhost:${PORT}`;
export const imagePublicPath = `${app_baseurl}/images/`;

Object.entries({
  isDev,
  outputFolder,
  publicPath,
  publicSrcPath,
  imageOutputFolder,
  numOfUsers,
  numOfProducts,
  imagePublicPath,
}).forEach(([key, value]) => console.info(`${key}: ${value}`));
