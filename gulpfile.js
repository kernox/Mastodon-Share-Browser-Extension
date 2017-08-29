var gulp = require('gulp');
var zip = require('gulp-zip');
var watch = require('gulp-watch');
var preprocess = require('gulp-preprocess');

gulp.task('default',[
	'build',
	'watch'
]);

gulp.task('watch', function(){
	watch(['src/all/**/*', '!src/all/**/*.html', '!src/all/**/*.js'], {verbose: true})
	.pipe(gulp.dest('build/firefox'))
	.pipe(gulp.dest('build/chrome'))

	watch(['src/all/**/*.html', 'src/all/**/*.js'], {verbose: true})
	.pipe(preprocess({context: {ENV: 'chrome'}}))
	.pipe(gulp.dest('build/chrome'))

	watch(['src/all/**/*.html', 'src/all/**/*.js'])
	.pipe(preprocess({context: {ENV: 'firefox'}}))
	.pipe(gulp.dest('build/firefox'))

	watch('src/firefox/**/*', {verbose: true})
	.pipe(gulp.dest('build/firefox'))

	watch('src/chrome/**/*', {verbose: true})
	.pipe(gulp.dest('build/chrome'))
});

gulp.task('build', function(){
	gulp.src(['src/all/**/*', '!src/all/**/*.html', '!src/all/**/*.js'])
	.pipe(gulp.dest('build/firefox'))
	.pipe(gulp.dest('build/chrome'))

	gulp.src(['src/all/**/*.html', 'src/all/**/*.js'])
	.pipe(preprocess({context: {ENV: 'chrome'}}))
	.pipe(gulp.dest('build/chrome'))

	gulp.src(['src/all/**/*.html', 'src/all/**/*.js'])
	.pipe(preprocess({context: {ENV: 'firefox'}}))
	.pipe(gulp.dest('build/firefox'))

	gulp.src('src/firefox/**/*')
	.pipe(gulp.dest('build/firefox'))

	gulp.src('src/chrome/**/*')
	.pipe(gulp.dest('build/chrome'))
});

gulp.task('pack', function(){

	gulp.src('build/firefox/**/*')
		.pipe(zip('firefox.zip'))
		.pipe(gulp.dest('build'))

	gulp.src('build/chrome/**/*')
		.pipe(zip('chrome.zip'))
		.pipe(gulp.dest('build'))
});