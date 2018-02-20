const autoprefixer = require('autoprefixer')

module.exports = {
  entry: './src/index.js',
  resolve: {
    extensions: ['.js', '.css', '.pug']
  },
  output: {
    filename: 'flygit.js',
    path: __dirname
  },
  module: {
    rules: [{
        test: /\.pug$/,
        use: ['pug-loader']
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.(ico|svg|png|jpg|gif)$/,
        use: ['arraybuffer-loader'],
      },
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [autoprefixer({
                grid: true
              })]
            }
          }
        }]
      }
    ]
  }
}