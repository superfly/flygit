module.exports = {
  entry: './src/index.js',
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: 'flygit.js',
    path: __dirname + '/dist'
  }
}