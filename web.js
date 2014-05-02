var express = require('express'),
  path = require('path'),
  http = require('http');

var app = express();

app.configure(function () {
//  app.set('port', process.env.PORT || 5000);
//  app.use(express.logger('dev'));

  /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.static(__dirname + '/public'));
});

//router
app.get('/jsonUtil', function (req, res) {
  res.sendfile(__dirname + '/public/jsonUtil.html');
});

app.get('/html2jsarray', function (req, res) {
  res.sendfile(__dirname + '/public/html2jsarray.html');
});

app.get('/dev', function (req, res) {
  res.sendfile(__dirname + '/public/category_discovery_dev.html');
});
app.get('/leftnav', function (req, res) {
  res.sendfile(__dirname + '/public/category_discovery_leftnav.html');
});

app.get('/bb', function (req, res) { //bb test
  res.sendfile(__dirname + '/public/bbb.html');
});

app.get('/underscore', function (req, res) { //bb test
  res.sendfile(__dirname + '/public/underscore.html');
});

app.get('/nativejs', function (req, res) { //bb test
  res.sendfile(__dirname + '/public/nativejs.html');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
