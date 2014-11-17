/**
 * @module lib/InstalledHooksCollector
 */

var path = require("path");

var PKG_JSON_PATH = path.dirname(require.main.filename) + "/../../../package.json";
console.log("Trying to inspect the package.json at '%s' to find git-guppy hooks", PKG_JSON_PATH);
var APP_PKG_JSON = require(PKG_JSON_PATH);

var GUPPY_MODULE_TOKEN = "git-guppy-";

var all = [];

/**
 * Collect all the installed git-guppy libraries.
 */
function collectInstalledHookNames(dependencies) {
  // Collect in the given dependencies object
  var hooks = Object.keys(dependencies).
    filter(function(key) {
      return key.indexOf(GUPPY_MODULE_TOKEN) == 0;
    }).
    map(function(key) {
      var namedRegex = require('named-regexp').named;
      var re = namedRegex(/git-guppy-(:<hook>[^\/]+)-hook/);
      var matched = matched = re.exec(key);
      return matched.capture("hook");
    });

  // Concat the collecte keys and account for any repetition, if any
  hooks.forEach(function(hook) {
    if (all.indexOf(hook) < 0) {
      all.push(hook);
    }
  });
}

// Collect from the devDependencies
if (APP_PKG_JSON.devDependencies) {
  collectInstalledHookNames(APP_PKG_JSON.devDependencies);
}

// Collect from the dependencies
if (APP_PKG_JSON.dependencies) {
  collectInstalledHookNames(APP_PKG_JSON.dependencies);
}

console.log("All collected hooks are '%s'", all);
module.exports = all;
