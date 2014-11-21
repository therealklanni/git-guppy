var gulp = require('gulp');
var verb = require('gulp-verb');
var guppy = require('./lib/guppy');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var gulpFilter = require('gulp-filter');
var mocha = require('gulp-mocha');

gulp.task('verb', function () {
  gulp.src('.verbrc.md')
    .pipe(verb({ dest: 'README.md' }))
    .pipe(gulp.dest('./'));
});

gulp.task('unit', function () {
  return gulp.src('test/guppy.tests.js', { read: false })
    .pipe(mocha({ reporter: 'nyan' }));
});

guppy.stream('pre-commit')
  .pipe(gulpFilter, ['*.js'])
  .pipe(jshint)
  .pipe(jshint.reporter, stylish)
  .pipe(jshint.reporter, 'fail');

guppy.init(gulp);
