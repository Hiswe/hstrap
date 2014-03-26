'use strict';

var lr      = require('tiny-lr')();
var git     = require('gulp-git');
var gulp    = require('gulp');
var wait    = require('gulp-wait'); // Wait for not having error when files are deleted
var bump    = require('gulp-bump');
var gutil   = require('gulp-util');
var clean   = require('gulp-clean');
var stylus  = require('gulp-stylus');
var notify  = require('gulp-notify');
var semver  = require('semver');
var replace = require('gulp-replace');
var plumber = require('gulp-plumber');
var express = require('express');

// Conf var
var version = require('./package.json').version;

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

var stylusConf = {
  paths: ['lib/hstrap'],
  urlFunc: ['embedurl'],
  use: ['nib'],
  import: ['nib']
};

// Plumber error callback
var onError = function onError(err) {
  gutil.beep();
  console.log(err);
};

// Version number and stuff
gulp.task('version-patch', function(cb) {
  version = semver.inc(version, 'patch');
  cb();
});
gulp.task('version-minor', function(cb) {
  version = semver.inc(version, 'minor');
  cb();
});
gulp.task('version-major', function(cb) {
  version = semver.inc(version, 'major');
  cb();
});

gulp.task('html-version', function(){
  gulp.src('./index.html', {base: './'})
    .pipe(replace(/v(\d*\.\d*\.\d*)/, 'v'+version))
    .pipe(gulp.dest('./'));
});

gulp.task('bump', function() {
  gulp.src(jsonFiles).pipe(bump({version: version})).pipe(gulp.dest('./'));
});

gulp.task('patch', ['version-patch', 'html-version', 'bump']);
gulp.task('minor', ['version-minor', 'html-version', 'bump']);
gulp.task('major', ['version-major', 'html-version', 'bump']);

// Tag
gulp.task('tag', function () {
  var v = 'v' + version;
  var message = 'Release ' + v;

  console.log(gutil.colors.red('TODO'));
  console.log('git push origin master --tags');
  console.log('npm publish');

  return gulp.src('./')
    .pipe(git.commit(message))
    .pipe(git.tag(v, message))
    .pipe(gulp.dest('./'));
})

// Build the lib
gulp.task('clean-css', function() {
  gulp.src('dist/css/', {read: false}).pipe(clean({force: true}));
});

gulp.task('clean-ghpage-css', function() {
  gulp.src('dist/example.css', {read: false}).pipe(clean({force: true}));
});

gulp.task('lib', ['clean-css'], function() {
  gulp.src(paths, {base: './lib/hstrap/'})
    .pipe(wait(10))
    .pipe(plumber({errorHandler: onError}))
    .pipe(stylus(stylusConf))
    .pipe(gulp.dest('dist/css'))
    .pipe(require('gulp-livereload')(lr))
    .pipe(notify({title: 'HSTRAP', message: 'build CSS', onLast: true}));
});

gulp.task('example', ['clean-ghpage-css'], function() {
  gulp.src('./dist/example.styl')
    .pipe(wait(10))
    .pipe(plumber({errorHandler: onError}))
    .pipe(stylus(stylusConf))
    .pipe(gulp.dest('dist'))
    .pipe(require('gulp-livereload')(lr))
    .pipe(notify({title: 'HSTRAP', message: 'build Gh-page CSS', onLast: true}));
});

// Copy font
gulp.task('clean-font', function() {
  gulp.src('dist/font/', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('font', ['clean-font'], function() {
  gulp.src('components/HisoFont/font/**', {base: './components/HisoFont/'})
    .pipe(wait(10))
    .pipe(gulp.dest('dist'));
});

// Watch
gulp.task('watch', function() {
  gulp.watch(['./lib/hstrap/**/*.styl', './lib/hstrap/MEDIA/*.svg'], ['lib']);
  gulp.watch(['./dist/example.styl'], ['example']);
});

// Whole build
gulp.task('build',['font', 'example', 'lib', 'html-version']);

// Server
var startExpress = function startExpress() {
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(__dirname));
  app.listen(4000);
};

gulp.task('express', function(cb){
  startExpress();
  lr.listen(35729);
  cb();
});

gulp.task('server', ['express', 'watch']);

// Light doc
gulp.task('default', function() {
  console.log(gutil.colors.red('html-version'), '', 'update version number in html');
  console.log(gutil.colors.red('font'), '        ', 'Copy fonts to the right folder');
  console.log(gutil.colors.red('lib'), '         ', 'Compile the lib');
  console.log(gutil.colors.red('example'), '     ', 'Build example css');
  console.log(gutil.colors.red('watch'), '       ', 'Watch stylus');
  console.log(gutil.colors.red('major'), '       ', 'tag as major version');
  console.log(gutil.colors.red('minor'), '       ', 'tag as minor version');
  console.log(gutil.colors.red('patch'), '       ', 'tag as patch version');
  console.log(gutil.colors.red('tag'), '         ', 'commit and tag in git');
  console.log(gutil.colors.red('server'), '      ', 'launch server and watch file');
});
