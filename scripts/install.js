#!/usr/bin/env node

require('shelljs/global');
var realpath = __dirname;
var gitRoot = exec('git rev-parse --show-toplevel').output.slice(0, -1);
var hooksDir = gitRoot + '/.git/hooks/';
var gitHooks = require('../lib/git-hooks');
var code = 0;

gitHooks.forEach(function (hook) {
  var hookDest = hooksDir + hook;

  if (test('-f', hookDest)) {
    mv(hookDest, hookDest + '.old');
  }

  cp(realpath + "/hookfile", hookDest);

  if (test('-f', hookDest)) {
    echo(hook + ' installed successfully');
  } else {
    code = 1;
  }
});

exit(code);
