# Contributing to git-guppy

Since v1.1.0 git-guppy now uses [semantic-release](https://github.com/semantic-release/semantic-release) for publishing to npm. Because of this, all contributions *must* follow the commit message convention of semantic-release ([found here](https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md)).
Please make sure you follow these conventions so that your contributions can be easily merged and published accordingly. If you don't follow the conventions, I may reject your pull-request (at worst), or squash your commits with my own message (at best), which may mean you won't be "credited" (in the git history) for your contributions.

No matter what, I will of course credit every contributor where credit is due, but you're also welcome to update the package.json file to add yourself as a contributor, or add yourself to the README as a contributor if you would like to be recognized for your contributions. In other words as far as having your name displayed somewhere officially, I leave that decision up to you. :smile:

## Style Guide

Currently, your code will be automatically linted before you can commit (dogfooding win). However, I plan to update the code to ES2015 using Babel in the future, and at that time I will likely also change the code style (to something that fits better with ES2015). Just make sure you don't bypass the linting or modify the linter settings in any way, please.
