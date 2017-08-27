var gulp = require('gulp');
var zip = require('gulp-zip');
var watch = require('gulp-watch');

gulp.task('default',[
	'build',
	'watch'
]);

gulp.task('watch', function(){
	watch('src/all/**/*')
	.pipe(gulp.dest('build/firefox'))
	.pipe(gulp.dest('build/chrome'))

	watch('src/firefox/**/*')
	.pipe(gulp.dest('build/firefox'))

	watch('src/chrome/**/*')
	.pipe(gulp.dest('build/chrome'))
});

gulp.task('build', function(){
	gulp.src('src/all/**/*')
	.pipe(gulp.dest('build/firefox'))
	.pipe(gulp.dest('build/chrome'))

	gulp.src('src/firefox/**/*')
	.pipe(gulp.dest('build/firefox'))

	gulp.src('src/chrome/**/*')
	.pipe(gulp.dest('build/chrome'))
});

gulp.task('pack', function(){

	gulp.src('MastoShareFirefox/**/*')
		.pipe(zip('MastoShareFirefox.zip'))
		.pipe(gulp.dest('.'))

	gulp.src('MastoShareChrome/**/*')
		.pipe(zip('MastoShareChrome.zip'))
		.pipe(gulp.dest('.'))
});