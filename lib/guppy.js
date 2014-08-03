var _ = require('lodash');
var exec = require('child_process').exec;
var gutil = require('gulp-util');
var lazypipe = require('lazypipe');
var gitHooks = require('./git-hooks');
var exposeTasks = _.partialRight(_.pick, gitHooks);

function createPipe() {
  return lazypipe().pipe(gutil.noop);
}

var hooks = _.zipObject(gitHooks, _.map(gitHooks, createPipe))

module.exports.hooks = hooks;

module.exports.stream = function (name) {
  var _pipe = {
    pipe: function () {
      var hook = hooks[name];
      hooks[name] = hook.pipe.apply(hook, [].slice.call(arguments));
      return _pipe;
    }
  };
  return _pipe;
};

module.exports.init = function (gulp) {
  gulp.task('applypatch-msg', function () {});

  gulp.task('commit-msg', function () {});

  gulp.task('post-applypatch', function () {});

  gulp.task('post-checkout', function () {});

  gulp.task('post-commit', function () {});

  gulp.task('post-merge', function () {});

  gulp.task('post-receive', function () {});

  gulp.task('post-rewrite', function () {});

  gulp.task('post-update', function () {});

  gulp.task('pre-applypatch', function () {});

  gulp.task('pre-auto-gc', function () {});

  gulp.task('pre-commit', function (cb) {
    exec('git diff --cached --name-only --diff-filter=ACM', function (err, stdout, stderr) {
      gulp.src(_.compact(stdout.split('\n')))
        .pipe(hooks['pre-commit']())
        // pipe in an error handler here
        .on('end', cb);
    });
  });

  gulp.task('pre-push', function () {});

  gulp.task('pre-rebase', function () {});

  gulp.task('pre-receive', function () {});

  gulp.task('prepare-commit-msg', function () {});

  gulp.task('update', function () {});

  module.exports.tasks = exposeTasks(gulp.task('guppy').tasks);
};
