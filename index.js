'use strict';

var _ = require('lodash');
var execSync = require('exec-sync');

var hookArgs = process.env.HOOK_ARGS ? process.env.HOOK_ARGS.split('\u263a') : []

function run(cmd) {
  return _.compact(execSync(cmd).split('\n'));
}

var getArgs = {
  'pre-commit': function () {
    return run('git diff --cached --name-only --diff-filter=ACM');
  },
  'commit-msg': function () { return hookArgs[0]; },
  'applypatch-msg': function () { return hookArgs[0]; },
  'pre-applypatch': function () { return hookArgs[0]; },
  'post-checkout': function () { return hookArgs[0]; },
  'post-commit': function () { return hookArgs[0]; }
}

module.exports = function (gulp) {
  return {
    stream: function (name) {
      return gulp.src(this.src(name));
    },
    src: function (name, fn) {
      var args = getArgs[name]();

      if (fn && typeof fn === 'function') {
        return fn.bind(fn, args);
      }

      return args;
    }
  };

};
