const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

/* global __dirname */

module.exports = [
  {
    mode: 'development',
    target: 'web',
    entry: {
      index: './dist/renderer/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist/renderer'),
      filename: '[name].wp.js',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/renderer/index.html',
        filename: 'index.html',
        inject: 'body',
      }),
    ],
  },
];
