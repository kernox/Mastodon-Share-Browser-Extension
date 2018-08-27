var fs = require('fs');

var gulp = require('gulp');
var zip = require('gulp-zip');
var watch = require('gulp-watch');
var preprocess = require('gulp-preprocess');
var pp = require('preprocess');

gulp.task('default',[
	'build',
	'watch'
]);

gulp.task('watch', function(){

	watch(['src/**/*'], {verbose: true})
	.pipe(preprocess({context: {ENV: 'chrome'}}))
	.pipe(gulp.dest('build/chrome'))

	watch(['src/**/*'])
	.pipe(preprocess({context: {ENV: 'firefox'}}))
	.pipe(gulp.dest('build/firefox'))
});

gulp.task('build', function(){

	gulp.src(['src/**/*', '!src/manifest.json', '!src/**/*.png'])
	.pipe(preprocess({context: {ENV: 'chrome'}}))
	.pipe(gulp.dest('build/chrome'))

	gulp.src(['src/**/*', '!src/manifest.json', '!src/**/*.png'])
	.pipe(preprocess({context: {ENV: 'firefox'}}))
	.pipe(gulp.dest('build/firefox'))

	gulp.src(['src/manifest.json'])
	.pipe(preprocess({context: {ENV: 'chrome'}, extension: 'js'}))
	.pipe(gulp.dest('build/chrome'))

	gulp.src(['src/manifest.json'])
	.pipe(preprocess({context: {ENV: 'firefox'}, extension: 'js'}))
	.pipe(gulp.dest('build/firefox'))



	gulp.src(['src/**/*.png'])
	.pipe(gulp.dest('build/chrome'))
	.pipe(gulp.dest('build/firefox'))

});

gulp.task('pack', function(){

	gulp.src('build/firefox/**/*')
		.pipe(zip('firefox.zip'))
		.pipe(gulp.dest('build'))

	gulp.src('build/chrome/**/*')
		.pipe(zip('chrome.zip'))
		.pipe(gulp.dest('build'))
});