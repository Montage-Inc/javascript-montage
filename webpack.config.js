var webpack = require("webpack");
var path = require('path');

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
			include: [
				path.resolve(__dirname, 'src')
			],
			query: {
				plugins: ['transform-runtime'],
				presets: ['es2015']
			}
		}]
	},
	resolve: {
		extensions: ['', '.js']
	},
	plugins: [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({minimize: true})
	]
}
