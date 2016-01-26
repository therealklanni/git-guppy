'use strict';

require('shelljs/global');
var path = require('path');
var gup = require('guppy-cli');
var async = require('async');

function rootApplicationPath() {
  return exec('git rev-parse --show-toplevel', { silent: true }).output;
}

var pkg = require(path.join(rootApplicationPath(), 'package.json'));

if (pkg['guppy-hooks']) {
  async.each(pkg['guppy-hooks'], function (hook, next) {
    gup.install(hook, null, next);
  });
}
