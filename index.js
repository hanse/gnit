var express = require('express');
var bodyParser = require('body-parser');
var auth = require('http-auth');
var git = require('./lib/gnit');
var config = require('./config.json');
var app = module.exports = express();

app.disable('x-powered-by');
app.set('port', process.env.PORT || 8123);
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(bodyParser());
app.use(auth.connect(auth.basic({
  realm: 'gnit',
}, function(username, password, fn) {
  fn(username === config.login.username && password === config.login.password);
})))
app.use(express.static(__dirname + '/public'));
app.locals.pretty = true;

/**
 * Sanitize repo names
 */

var sanitize = function(str) {
  return str.replace(/[^\w-]/gi, '');
};

/**
 * Render the react app
 */

app.get('/', function(req, res) {
  res.render('index');
})

/**
 * Create a new repo
 */

app.post('/api/repos', function(req, res) {
  git.createRepo(config.path + '/' + sanitize(req.body.name), function(err, repo) {
    if (err) return res.send(400, err);
    return res.json(repo);
  });
});

/**
 * List all the git repos
 */

app.get('/api/repos', function(req, res) {
  git.listRepos(config.path, function(err, repos) {
    if (err) return res.json(err);
    return res.json(repos);
  });
});

/**
 * Serve the API
 */

app.listen(app.get('port'), function() {
  console.log('Gnit listening on %d', app.get('port'));
});
