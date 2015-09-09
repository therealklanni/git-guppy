'use strict';

require('shelljs/global');
var gup = require('guppy-cli');
var async = require('async');
var pack = require(rootApplicationPath() + '/package.json');

if (pack['guppy-hooks']) {
  async.each(pack['guppy-hooks'], function (hook, next) {
    gup.install(hook, null, next);
  });
}

function rootApplicationPath() {
  return exec('git rev-parse --show-toplevel', { silent: true })
    .output.slice(0, -1);
}
