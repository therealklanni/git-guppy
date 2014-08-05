var gulp = require('gulp');
var verb = require('gulp-verb');
var guppy = require('./lib/guppy');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('verb', function () {
  gulp.src('.verbrc.md')
    .pipe(verb({ dest: 'README.md' }))
    .pipe(gulp.dest('./'));
});

guppy.stream('pre-commit')
  .pipe(jshint)
  .pipe(jshint.reporter, stylish)
  .pipe(jshint.reporter, 'fail');

guppy.init(gulp);
