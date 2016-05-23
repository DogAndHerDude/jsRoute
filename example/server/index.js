'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = http.createServer(app);

var config = {
  port: process.env.PORT || 9000,
  ip: process.env.IP || '0.0.0.0',
  root: path.normalize(__dirname + '/..')
};

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(config.root));

app.route('/*')
  .get(function(req, res) {
    console.log(req.url);
    res.sendFile(path.resolve(config.root + '/index.html'));
  });

app.exampleServer = server.listen(config.port, config.ip, function() {
  console.log('Express server listening on %d, in %s mode', config.port, 'example');
});

exports = module.exports = app;
