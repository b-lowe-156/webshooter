var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, './src/main.js')
    ],
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './build',
    inline: true
  },
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'build'),
    publicPath: '/assets/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ],
   }
}