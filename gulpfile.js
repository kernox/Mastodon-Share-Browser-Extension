var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('default',['pack']);

gulp.task('pack', function(){

	gulp.src('MastoShareFirefox/**/*')
		.pipe(zip('MastoShareFirefox.zip'))
		.pipe(gulp.dest('.'))

	gulp.src('MastoShareChrome/**/*')
		.pipe(zip('MastoShareChrome.zip'))
		.pipe(gulp.dest('.'))
});