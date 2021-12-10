module.exports = {
  mode: 'production',
  entry: {
    index: './dist/index.js',
  },
  output: {
    filename: '[name].wp.js',
  },
};
