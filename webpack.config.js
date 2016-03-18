var webpack = require("webpack");

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    libraryTarget: "umd",
    library: "Montage",
  	filename: './dist/montage.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /(bower_components|node_modules)/,
      query: {
        plugins: ['transform-runtime'],
        presets: ['es2015']
      }
    },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
}
