import path from 'path';

export const isDev = process.env.IS_DEV === 'true';

export const outputFolder = path.resolve(__dirname, '..', 'build');
export const publicPath = path.resolve(outputFolder, 'public');

export const publicSrcPath = path.resolve(__dirname, '..', 'public');

export const imageOutputFolder = path.join(publicPath, 'images');
export const numOfUsers = isDev ? 5 : 100;
export const numOfProducts = isDev ? 2 : 50;
const APP_NAME = process.env.HEROKU_APP_NAME;
const PORT = process.env.PORT || 3000;
const app_baseurl = APP_NAME
  ? `https://${APP_NAME}.herokuapp.com/static`
  : `http://localhost:${PORT}/static`;
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
