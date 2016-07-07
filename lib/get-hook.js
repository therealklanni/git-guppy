'use strict';

var _ = require('lodash');
var execSync = require('shelljs').exec;
var stripBom = require('strip-bom');
var map = require('map-stream');
var fs = require('fs');
var hookArgs = process.env.HOOK_ARGS ? process.env.HOOK_ARGS.split('\u263a') : [];

function isDirectory(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    }

    throw e;
  }
}

// git hooks set the GIT_DIR environment variable to the path of the '.git' folder, so remove it
// if the folder doesn't exist in the current directory (allow git tools to find it themselves)
if (process.env.GIT_DIR && !isDirectory(process.env.GIT_DIR)) {
  delete process.env.GIT_DIR;

  // hooks may also set GIT_INDEX_FILE to '.git/index', if we aren't in the directory where '.git'
  // lives, having this set will break commands that access the index.
  if (process.env.GIT_INDEX_FILE) {
    delete process.env.GIT_INDEX_FILE;
  }
}

function getIndexed() {
  return _.compact(execSync('git diff --cached --name-only --diff-filter=ACM', {
    silent: true
  }).output.split('\n'));
}

function streamFromIndexed(gulp, options) {
  return gulp.src(getIndexed(), options)
    .pipe(map(function (file, cb) {
      var hash = execSync('git ls-files -s ' + file.path, {
        silent: true
      }).output.split(' ')[1];

      if (!hash || !hash.length) {
        // untracked file, use working copy
        return void cb(null, file);
      }

      var contents = execSync('git cat-file blob ' + hash, {
        silent: true
      }).output;

      file.contents = new Buffer(stripBom(contents));

      cb(null, file);
    }));
}

var hooks = [
  {
    name: 'applypatch-msg',
    src: hookArgs[0],
    stream: function (gulp, options) {
      return gulp.src(this.src, options);
    }
  },
  {
    name: 'commit-msg',
    src: hookArgs[0],
    stream: function (gulp, options) {
      return gulp.src(this.src, options);
    }
  },
  {
    name: 'post-applypatch'
  },
  {
    name: 'post-checkout',
    extra: hookArgs
  },
  {
    name: 'post-commit'
  },
  {
    name: 'post-merge',
    extra: hookArgs[0]
  },
  {
    // streamable(stdio)
    name: 'post-receive'
  },
  {
    // streamable(stdio)
    name: 'post-rewrite',
    extra: hookArgs
  },
  {
    name: 'post-update',
    extra: hookArgs
  },
  {
    name: 'pre-applypatch',
    get src () {
      return getIndexed();
    },
    stream: streamFromIndexed
  },
  {
    name: 'pre-auto-gc'
  },
  {
    name: 'pre-commit',
    get src () {
      return getIndexed();
    },
    stream: streamFromIndexed
  },
  {
    // streamable(stdio)
    name: 'pre-push',
    extra: hookArgs
  },
  {
    // streamable(stdio)
    name: 'pre-receive'
  },
  {
    name: 'pre-rebase',
    extra: hookArgs
  },
  {
    name: 'prepare-commit-msg',
    src: hookArgs[0],
    extra: hookArgs.slice(1),
    stream: function (gulp, options) {
      return gulp.src(this.src, options);
    }
  },
  {
    name: 'update',
    extra: hookArgs
  }
];

function getHookObj(name) {
  var hook = _.findWhere(hooks, { name: name });

  if (!hook) {
    throw new Error('Invalid hook name: ' + name);
  }

  return _.defaults(hook, { src: null });
}

module.exports = getHookObj;
