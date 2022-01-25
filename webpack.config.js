const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

/* global __dirname */

module.exports = {
  mode: 'production',
  target: 'web',
  entry: {
    index: path.resolve(__dirname, 'ts-build/renderer/index.js'),
  },
  module: {
    rules: [
      {
        test: /\.css$/iu,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'ts-build/renderer'),
    filename: '[name].wp.js',
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: 'single',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/renderer/index.html',
      filename: 'index.html',
      title: 'Notes',
      inject: 'body',
      meta: {
        viewport: 'initial-scale=1, width=device-width',
      },
    }),
  ],
};
