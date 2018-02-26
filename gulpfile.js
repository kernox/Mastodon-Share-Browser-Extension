var gulp = require('gulp');
var zip = require('gulp-zip');
var watch = require('gulp-watch');
var preprocess = require('gulp-preprocess');
var fs = require('fs');

gulp.task('default',[
	'build',
	'watch'
]);

gulp.task('watch', function(){

	//watch(['src/**/*.html'], {verbose: true})
	//.pipe(preprocess({context: {ENV: 'chrome'}}))
	//.pipe(gulp.dest('build/chrome'))

	//watch(['src/**/*'])
	//.pipe(preprocess({context: {ENV: 'firefox'}}))
	//.pipe(gulp.dest('build/firefox'))
});

gulp.task('build', function(){

	gulp.src(['src/**/*.html', 'src/**/*.js', 'src/**/*.css', 'src/**/*.json', '!src/manifest.json'])
	.pipe(preprocess({context: {ENV: 'chrome'}}))
	.pipe(gulp.dest('build/chrome'))

	gulp.src(['src/**/*.html', 'src/**/*.js', 'src/**/*.css', 'src/**/*.json', '!src/manifest.json'])
	.pipe(preprocess({context: {ENV: 'firefox'}}))
	.pipe(gulp.dest('build/firefox'))

	gulp.src(['src/**/*.png'])
	.pipe(gulp.dest('build/chrome'))
	.pipe(gulp.dest('build/firefox'))

	buildManifest('chrome');
	//buildManifest('firefox');

});

gulp.task('pack', function(){

	gulp.src('build/firefox/**/*')
		.pipe(zip('firefox.zip'))
		.pipe(gulp.dest('build'))

	gulp.src('build/chrome/**/*')
		.pipe(zip('chrome.zip'))
		.pipe(gulp.dest('build'))
});

var buildManifest = function(browser){
	var json = {};

	json.manifest_version = 2;

	if(browser == 'firefox'){
		json.applications = {
			gecko: {
				id: "{09b14d46-21c3-4a7d-b244-e756f497935b}",
				strict_min_version: "52.0"
			}
		}
	}

	json.name = "Mastodon Share";
	json.description = "A share button for Mastodon Instances";
	json.version = "0.4"

	if(browser == 'firefox') {
		json.options_ui = {
			page: "options.html"
		}
	}

	json.browser_action = {
		default_icon : "assets/images/icon.png",
		default_popup: "popup.html"
	}

	json.content_scripts = [
		{
			matches : ["https://twitter.com/*"],
      		js: [
        		"assets/scripts/functions.js",
        		"assets/scripts/twitter.js"
      		]
		}
	];

	json.background = {
    	scripts: [
      "assets/scripts/interceptor.js",
      "assets/scripts/menu.js",
      "assets/scripts/functions.js"
    	]
  	};

  	json.permissions = [
		"contextMenus",
		"cookies",
		"<all_urls>",
		"tabs",
		"activeTab",
		"storage"
	];

	json.icons= {
		"16": "assets/images/icon16.png",
		"32": "assets/images/icon32.png",
		"64": "assets/images/icon64.png"
	};

	var dump = JSON.stringify(json);

	fs.writeFileSync('build/'+ browser +'/manifest.json', dump);
}