const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    mode: 'development',
    target: 'web',
    entry: {
      index: './dist/renderer/index.js',
    },
    output: {
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
        filename: 'renderer/index.html',
        inject: 'body',
      }),
    ],
  },
];
