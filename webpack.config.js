module.exports = {
  entry: './src/index.js',
  resolve: {
    extensions: ['.js', '.pug']
  },
  output: {
    filename: 'flygit.js',
    path: __dirname + '/dist'
  },
  module: {
    rules: [{
      test: /\.pug$/,
      use: ['pug-loader']
    }]
  }
}