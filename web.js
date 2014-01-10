var express = require('express'),
  path = require('path'),
  http = require('http');

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.static(__dirname + '/public'));
});

//router
app.get('/', function (req, res) {
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
  res.sendfile(__dirname + '/public/category_discovery_bb.html');
});

//app.get('/wines', function(req, res) {
//    res.send([{name:'wine1'}, {name:'wine2'}]);
//});
////http://localhost:8080/wines/1
//app.get('/wines/:id', function(req, res) {
//    res.send({id:req.params.id, name: "The Name", description: "description"});
//});

var port = process.env.PORT || 8090;
app.listen(port, function() {
  console.log("Listening on " + port);
});
console.log("Listening on port " + port);
