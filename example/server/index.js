'use strict';

var bodyParser = require('body-parser');
var morgan = require('morgan')
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = http.createServer(app);

var config = {
  port: 9000,
  ip: process.env.IP || '0.0.0.0',
  root: path.normalize(__dirname + '/..')
};

app.set('appPath', config.root);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(app.get('appPath')));

app.route('/:url(api|auth|components|app|bower_components|assets)/*')
 .get(function(req, res) {
   console.log('tis an error');
 });

app.route('/*')
  .get(function(req, res) {
    res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
  });

app.exampleServer = server.listen(config.port, config.ip, function() {
  console.log('Express server listening on %d, in %s mode', config.port, 'example');
});

exports = module.exports = app;
