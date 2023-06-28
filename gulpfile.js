const gulp = require('gulp');
const watch = require('gulp-watch');
const zip = require('gulp-zip');

function build(cb) {
	console.log('> Construction of browsers extensions');

	//Common files
	gulp.src(['src/common/**/*'])
	.pipe(gulp.dest('build/chrome/'))
	.pipe(gulp.dest('build/firefox/'))

	//Chrome specifics files
	gulp.src(['src/chrome/**/*'])
	.pipe(gulp.dest('build/chrome/'))

	//Firefox specifics files
	gulp.src(['src/firefox/**/*'])
	.pipe(gulp.dest('build/firefox/'))

	console.log('> Construction done ! Look at build folder');

	cb();
}

function livewatch(cb) {
	console.log('> Livewatch autoreload on !')

	//Watch on common files
	watch(['src/common/**/*'], {verbose: true})
	.pipe(gulp.dest('build/chrome/'))
	.pipe(gulp.dest('build/firefox/'))

	//Watch on chrome files
	watch(['src/chrome/**/*'], {verbose: true})
	.pipe(gulp.dest('build/chrome/'))
	

	//Watch on firefox files
	watch(['src/firefox/**/*'], {verbose: true})
	.pipe(gulp.dest('build/firefox/'))

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