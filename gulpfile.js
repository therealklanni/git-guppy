var gulp = require('gulp');
var verb = require('gulp-verb');

gulp.task('verb', function () {
  gulp.src(['.verbrc.md'])
    .pipe(verb({ dest: 'README.md' }))
    .pipe(gulp.dest('./'));
});
