const gulp = require('gulp');
const watch = require('gulp-watch');
const preprocess = require('gulp-preprocess');
const zip = require('gulp-zip');


function build(cb) {
	console.log('> Construction of browsers extensions');

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

	console.log('> Construction done ! Look at build folder');

	cb();
}

function livewatch(cb) {
	console.log('> Livewatch autoreload on !')
	watch(['src/**/*'], {verbose: true})
	.pipe(preprocess({context: {ENV: 'chrome'}}))
	.pipe(gulp.dest('build/chrome'))

	watch(['src/**/*'])
	.pipe(preprocess({context: {ENV: 'firefox'}}))
	.pipe(gulp.dest('build/firefox'))

	cb();
}

function pack(cb) {
	console.log('> Building zip packages');

	gulp.src('build/firefox/**/*')
		.pipe(zip('firefox.zip'))
		.pipe(gulp.dest('build'))

	gulp.src('build/chrome/**/*')
		.pipe(zip('chrome.zip'))
		.pipe(gulp.dest('build'))

	console.log('> Packages builded ! Look at build folder');
	cb();
}
  
exports.default = gulp.parallel(build, livewatch)
exports.watch = livewatch;
exports.build = build;
exports.pack = pack;