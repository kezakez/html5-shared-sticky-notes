var express = require('express');
var app     = express.createServer();
var io			= require('socket.io').listen(app);

io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.set('log level', 1);                    // reduce logging
io.set('transports', [                     // enable all transports (optional if you want flashsocket)
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

app.configure(function () {
  app.use(express.static(__dirname + '/public'));
});
app.set("view options", { layout: false }) 

app.listen(8080);

app.get('/', function (req, res) {
 res.render('index.html');
});

//var allnotedata = [];

io.sockets.on('connection', function (socket) {
	// send all note data we have
  //socket.emit('allnotedata', allnotedata);
  
  // send updates to other clients
  socket.on('notedata', function (data) {
  	console.log(data);
  	socket.broadcast.emit('notedata', data);
  });
});
