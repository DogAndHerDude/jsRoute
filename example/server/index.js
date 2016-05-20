'use strict';

var express = require('express');
var path = require('path');
var app = express();

app.route('/*')
  .get(function(req, res) {
    console.log(req.url);
    res.sendFile(path.resolve(__dirname, '../index.html'));
  });

module.exports = app;
