var gulp = require('gulp');
var to5 = require('gulp-babel');
var mocha = require('gulp-mocha');
var webpack = require('gulp-webpack');


gulp.task('build', function () {
	return gulp.src('src/**/*.js')
		.pipe(to5({stage: 1, optional: 'runtime'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('test', function () {
	require("babel/register")({
		stage: 1, optional: 'runtime'
	});

	return gulp.src('tests/**/*test.js')
		.pipe(mocha({reporter: 'nyan'}));
});

gulp.task('webpack', function () {
	var webpackConfig = Object.create(require('./webpack.config'));

	return gulp.src('src/')
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest('./'));
});
