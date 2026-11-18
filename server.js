var express = require('express');
var http    = require('http');
var app     = express();
var server  = http.createServer(app);
var io      = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

server.listen(8080);

app.get('/', function (req, res) {
 res.sendFile(__dirname + '/public/index.html');
});

//var allnotedata = [];

io.on('connection', function (socket) {
	// send all note data we have
  //socket.emit('allnotedata', allnotedata);
  
  // send updates to other clients
  socket.on('notedata', function (data) {
  	console.log(data);
  	socket.broadcast.emit('notedata', data);
  });
});
