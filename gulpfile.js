var gulp = require('gulp');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
var webpack = require('gulp-webpack');


gulp.task('build', function () {
	return gulp.src('src/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('dist'));
});

gulp.task('test', function () {
	require('babel-core/register');

	return gulp.src('tests/**/*_test.js', { read: false })
		.pipe(mocha());
});

gulp.task('webpack', function () {
	var webpackConfig = Object.create(require('./webpack.config'));

	return gulp.src('src/')
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest('./'));
});
