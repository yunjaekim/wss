var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var server = new WebSocketServer({ port: 8075 });

server.on('connection', function (socket) {
  socket.on('message', function (message) {
    console.log(message + ' Received');

    if (message === 'CodingDefined') {
      socket.send('CodingDefined Blog!!!');
    }
  });

  socket.on('close', function (msg, disconnect) {
    console.log(msg + ' ' + disconnect);
  });
});