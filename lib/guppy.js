var _ = require('lodash');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var lazypipe = require('lazypipe');
var gitHooks = require('./git-hooks');

function createPipe() {
  return lazypipe().pipe(gutil.noop).pipe(gutil.noop);
}

function exitHandler(cb) {
  return function () {
    var exitCode = 0;
    var error;

    if (cb.error) {
      exitCode = cb.exitCode || 1;
      error = new PluginError('git-guppy', cb.error);
    }

    cb(error);

    process.nextTick(function () {
      process.exit(exitCode);
    });
  }
}



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

};
