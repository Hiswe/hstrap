'use strict';

var lr      			= require('tiny-lr')();
var del     			= require('del');
var git     			= require('gulp-git');
var gulp    			= require('gulp');
var wait    			= require('gulp-wait');
var bump    			= require('gulp-bump');
var open    			= require('gulp-open');
var gutil   			= require('gulp-util');
var stylus  			= require('gulp-stylus');
var notify  			= require('gulp-notify');
var semver  			= require('semver');
var header  			= require('gulp-header');
var replace 			= require('gulp-replace');
var plumber 			= require('gulp-plumber');
var express 			= require('express');
var autoprefixer 	= require('gulp-autoprefixer');

/////////
// CONF
/////////
var pkg     = require('./package.json');
var version = pkg.version;

var jsonFiles = [
  './package.json',
  './bower.json'
];

var paths = [
  'lib/hstrap/index.styl',
  'lib/hstrap/buttons.styl',
  'lib/hstrap/forms/index.styl',
  'lib/hstrap/forms/default.styl',
  'lib/hstrap/layout.styl',
  'lib/hstrap/links.styl',
  'lib/hstrap/components/index.styl',
  'lib/hstrap/components/h-box.styl',
  'lib/hstrap/components/h-popover.styl',
  'lib/hstrap/components/h-scrollbox.styl'
];

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

var stylusConf = {
  paths: ['lib/hstrap'],
  url: {
    name: 'embedurl',
    paths: [__dirname + '/dist']
  }
};

// Plumber error callback
var onError = function onError(err) {
  gutil.beep();
  console.log(err);
};

/////////
// BUMP
/////////

// Version number and stuff
gulp.task('version-patch', function (cb) {
  version = semver.inc(version, 'patch');
  cb();
});
gulp.task('version-minor', function (cb) {
  version = semver.inc(version, 'minor');
  cb();
});
gulp.task('version-major', function (cb) {
  version = semver.inc(version, 'major');
  cb();
});

gulp.task('html-version', function (){
  gulp.src('./index.html', {base: './'})
    .pipe(replace(/v(\d*\.\d*\.\d*)/, 'v'+version))
    .pipe(gulp.dest('./'));
});

gulp.task('header', function () {
  gulp.src(['dist/index.css','dist/css/**/*.css'], {base: './dist'})
    .pipe(replace(/v(\d*\.\d*\.\d*)/, 'v'+version))
    .pipe(gulp.dest('dist'));
});

gulp.task('bump', function () {
  gulp.src(jsonFiles).pipe(bump({version: version})).pipe(gulp.dest('./'));
});

gulp.task('patch', ['version-patch', 'header', 'html-version', 'bump']);
gulp.task('minor', ['version-minor', 'header', 'html-version', 'bump']);
gulp.task('major', ['version-major', 'header', 'html-version', 'bump']);

// Tag
gulp.task('tag', function () {
  var v = 'v' + version;
  var message = 'Release ' + v;

  console.log(gutil.colors.red('TODO'), 'for ' + version);
  console.log(gutil.colors.red("DON'T FORGET TO UPDATE README.md"));

  console.log('git ci -am "'+message+'"');

  console.log('git tag -a '+version+' -m "'+message+'"');
  console.log('git push origin master --tags');
  console.log('npm publish');

  // return gulp.src('./')
  //   .pipe(git.commit(message, {args: '-a'}))
  //   .pipe(git.tag(v, message));
});

/////////
// ASSETS
/////////

// Build the lib
gulp.task('clean-css', function (cb) {
	del(['dist/css/'], cb);
});

gulp.task('clean-ghpage-css', function (cb) {
	del(['dist/example.css'], cb);
});

gulp.task('lib', ['clean-css'], function () {
  gulp.src(paths, {base: './lib/hstrap/'})
    .pipe(plumber({errorHandler: onError}))
    .pipe(stylus(stylusConf))
    .pipe(autoprefixer())
    .pipe(header(banner, {pkg: pkg }))
    .pipe(gulp.dest('dist/css'))
    .pipe(require('gulp-livereload')(lr))
    .pipe(notify({title: 'HSTRAP', message: 'build CSS', onLast: true}));
});

gulp.task('example', ['clean-ghpage-css'], function () {
  gulp.src('./dist/example.styl')
    .pipe(plumber({errorHandler: onError}))
    .pipe(stylus(stylusConf))
    .pipe(autoprefixer())
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('dist'))
    .pipe(require('gulp-livereload')(lr))
    .pipe(notify({title: 'HSTRAP', message: 'build Gh-page CSS', onLast: true}));
});

// Copy font
gulp.task('clean-font', function (cb) {
	del(['dist/font/'], cb);
});

gulp.task('font', ['clean-font'], function () {
  gulp.src('bower_components/hiso-font/dst/*')
    .pipe(gulp.dest('dist/font'));
});

// Whole build
gulp.task('build',['font', 'example', 'lib', 'html-version']);

/////////
// SERVER
/////////

// Watch
gulp.task('watch', function () {
  gulp.watch(['./lib/hstrap/**/*.styl', './lib/hstrap/MEDIA/*.svg'], ['lib']);
  gulp.watch(['./dist/example.styl'], ['example']);
  // gulp.watch('./index.html', './dist/*.html').on('change', function (event) {
  //   gulp.src('README.md').pipe(notify({title: 'Hstrap', message: 'reload html'}));
  //   lr.changed({body: {files: event.path}});
  // });
});

// Server
var startExpress = function startExpress() {
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(__dirname));
  app.listen(4000);
};

gulp.task('express', function (cb) {
  startExpress();
  lr.listen(35729);
  cb();
});

gulp.task('server', ['express', 'watch']);

gulp.task('start', ['server'], function () {
  gulp.src('./README.md').pipe(wait(1000)).pipe(open('', {url: "http://localhost:4000"}));
});

/////////
// DOC
/////////

gulp.task('default', function (cb) {
  var m = gutil.colors.magenta;
  var g = gutil.colors.grey;
  console.log(m('html-version'), g('..'), 'update version number in html');
  console.log(m('font'), g('..........'), 'Copy fonts to the right folder');
  console.log(m('lib'), g('...........'), 'Compile the lib');
  console.log(m('example'), g('.......'), 'Build example css');
  console.log(m('watch'), g('.........'), 'Watch stylus');
  console.log(m('major'), g('.........'), 'tag as major version');
  console.log(m('minor'), g('.........'), 'tag as minor version');
  console.log(m('patch'), g('.........'), 'tag as patch version');
  console.log(m('tag'), g('...........'), 'commit and tag in git');
  console.log(m('build'), g('.........'), 'build everything');
  console.log(m('start'), g('.........'), 'launch server and watch file');
  cb();
});
