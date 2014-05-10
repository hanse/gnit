var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var async = require('async');
var isGitRepo = require('is-git-repo');
var config = require('../config.json');

/**
 * Prepend a path to `str`.
 * Used when `map()`-ing the result from `fs.readdir`.
 */

var prependPath = function(prefix) {
  return function(str) {
    return path.resolve(prefix) + '/' + str;
  };
};

/**
 * Add `filename` and `git` to `fs.Stats`.
 */

var gitStat = function(file, fn) {
  return fs.stat(file, function(err, stats) {
    if (err) return fn(err);
    isGitRepo(file, function(git) {
      stats.filename = file;
      stats.git = git;
      return fn(null, stats);
    });
  });
};

module.exports = {

  /**
   * Create a repo if it doesn't already exist
   */

  createRepo: function(repo, fn) {
    fs.exists(repo, function(exists) {
      if (exists) return fn({error: 'repo already exists'});
      fs.mkdir(repo, 0755, function(err) {
        if (err) return fn(err);
        exec('cd '+repo+' && git init --bare', function(err, stdout, stderr) {
          if (err) return fn(err);
          fn(null, {
            path: repo,
            name: path.basename(repo)
          });
        });
      });
    });
  },

  /**
   * List all git repos in `dir`
   */

  listRepos: function(dir, fn) {
    fs.readdir(dir, function(err, files) {
      if (err) return fn(err);
      async.map(files.map(prependPath(dir)), gitStat, function(err, results) {
        fn(err, results.filter(function(result) {
          return result.git;
        }).map(function(result) {
          var name = path.basename(result.filename);
          return {
            path: result.filename,
            name: name,
            url: config.user + '@' + config.host + ':' + name
          };
        }));
      });
    });
  },
};
