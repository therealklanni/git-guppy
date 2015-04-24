#!/usr/bin/env node

require('shelljs/global');
var realpath = __dirname;
var gitRoot = exec('git rev-parse --show-toplevel').output.slice(0, -1);
var hooksDir = gitRoot + '/.git/hooks/';
var gitHooks = require('./../lib/hook-collector');
var justInstalledHook = process.argv[2];

var code = 0;

if (justInstalledHook) {
  gitHooks.push(justInstalledHook);
}

// If that's the first time installing, just 
if (gitHooks.length == 0) {
  console.log("Thanks for installing git-guppy! Install any of the hooks available now!");
  console.log("npm install --save git-guppy-pre-commit git-guppy-pre-commit git-guppy-post-commit ...");
  console.log("Go to https://github.com/therealklanni/git-guppy for a complete list!");
  console.log("");
  exit(code);
  // TODO: Provide a full list here to the user with pointers to the git docs http://git-scm.com/docs/githooks
}

// At least one is installed, so let's install it then
gitHooks.forEach(function (hook) {
  var hookDest = hooksDir + hook;

  try {
    if (test('-f', hookDest)) {
      mv(hookDest, hookDest + '.old');
    }

    cp(realpath + "/hookfile", hookDest);

    if (test('-f', hookDest)) {
      echo(hook + ' installed successfully at ' + hookDest);

    } else {
      code = 1;
    }
  } catch (Exception) {
    console.log("FATAL error while trying to install hook: %s", Exception);
  }
});

exit(0);
