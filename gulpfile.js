var gulp    = require('gulp');
var wait    = require('gulp-wait'); // Wait for not having error when files are deleted
var gutil   = require('gulp-util');
var clean   = require('gulp-clean');
var stylus  = require('gulp-stylus');
var notify  = require('gulp-notify');
var replace = require('gulp-replace');
var plumber = require('gulp-plumber');

// Conf var
var version = require('./package.json').version

var paths = [
  'lib/hstrap/index.styl',
  'lib/hstrap/buttons.styl',
  'lib/hstrap/forms/index.styl',
  'lib/hstrap/forms/default.styl',
  'lib/hstrap/layout.styl',
  'lib/hstrap/links.styl',
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

// Replace version number in html file
gulp.task('html-version', function() {
  gulp.src('./index.html', {base: './'})
    .pipe(replace(/v(\d*\.\d*\.\d*)/, 'v'+version))
    .pipe(gulp.dest('./'));
});

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
    .pipe(notify({title: 'HSTRAP', message: 'build CSS', onLast: true}));
});

gulp.task('example', ['clean-ghpage-css'], function() {
  gulp.src('./dist/example.styl')
    .pipe(wait(10))
    .pipe(plumber({errorHandler: onError}))
    .pipe(stylus(stylusConf))
    .pipe(gulp.dest('dist'))
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
  gulp.watch(['./lib/hstrap/*.styl','./lib/hstrap/**/*.styl'], ['lib']);
  gulp.watch(['./dist/example.styl'], ['example']);
});

// Whole build
gulp.task('build',['font', 'example', 'lib', 'html-version']);

// Light doc
gulp.task('default', function() {
  console.log(gutil.colors.red('html-version'), '', 'update version number in html');
  console.log(gutil.colors.red('font'), '        ', 'Copy fonts to the right folder');
  console.log(gutil.colors.red('lib'), '         ', 'Compile the lib');
  console.log(gutil.colors.red('example'), '     ', 'Build example css');
  console.log(gutil.colors.red('watch'), '       ', 'Watch stylus');
});
