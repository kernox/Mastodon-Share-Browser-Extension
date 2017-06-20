var gulp = require('gulp');
var zip = require('gulp-zip');
var watch = require('gulp-watch');

gulp.task('default',[
	'buildCommon',
	'watch'
]);

gulp.task('watch', function(){
	return watch('Common/**/*', {verbose: true})
	.pipe(gulp.dest('MastoShareFirefox'))
	.pipe(gulp.dest('MastoShareChrome'))
});

gulp.task('buildCommon', function(){
	gulp.src('Common/**/*')
	.pipe(gulp.dest('MastoShareFirefox'))
	.pipe(gulp.dest('MastoShareChrome'))
});

gulp.task('pack', function(){

	gulp.src('MastoShareFirefox/**/*')
		.pipe(zip('MastoShareFirefox.zip'))
		.pipe(gulp.dest('.'))

	gulp.src('MastoShareChrome/**/*')
		.pipe(zip('MastoShareChrome.zip'))
		.pipe(gulp.dest('.'))
});