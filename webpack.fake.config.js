const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackSourceMapSupport = require('webpack-source-map-support');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: path.resolve(__dirname, 'src-fake', 'build'),
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist-fake'),
    filename: 'build.js',
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /(.js|.ts)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'src-fake', 'tsconfig.json'),
            },
          },
        ],
      },
    ],
  },
  devtool: 'source-map',
  externals: [nodeExternals()],
  node: {
    __dirname: false,
  },
  plugins: [new WebpackSourceMapSupport()],
};
