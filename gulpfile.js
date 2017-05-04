var gulp = require('gulp');

gulp.task('default',['copy']);

gulp.task('copy', function(){
	gulp.src('MastoShareChrome/*.html').pipe(gulp.dest('./MastoShareFirefox'));
	gulp.src('MastoShareChrome/assets/locales/*.json').pipe(gulp.dest('./MastoShareFirefox/assets/locales'));
});