var http = require('http'), io = require('socket.io');
var server = http.createServer(function(req, res){ 
  // Send HTML headers and message
  res.writeHead(200,{ 'Content-Type': 'text/html' }); 
  res.end('<h1>Hello</h1>');
});
server.listen(9999);

// Create a Socket.IO instance, passing it our server
var io = io.listen(server);

io.sockets.on('connection', function (socket) {
  socket.emit('idCode', { data: 'connected' });
  socket.on('googleRequest',function(data){ 
    var client = http.createClient(80, 'www.google.co.jp');
    var request = client.request('GET', '/m/directions?ttype=last&dirflg=r&hl=ja&dirflg=r&hl=ja&ri=0&saddr='+ data.from  +'&daddr=' + data.to, {});
    request.on('response', function(response){
      response.on('data', function(content){
        socket.emit('idCode', { data: content + '' });
      }); 
    }); 
    request.end();
  });
  socket.on('error',function(data){ 
    // Do nothing
    console.log('error');
  });
});
