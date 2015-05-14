var webpack = require("webpack");

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    libraryTarget: "var",
    library: "Montage",
  	filename: './dist/montage.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader?stage=0'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
}