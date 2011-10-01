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
  socket.emit('idCode', { data: 'onmessage' });
  socket.on('googleRequest',function(data){ 
    var client = http.createClient(80, 'www.google.co.jp');
    //var request = client.request('GET', '/m/directions?dirflg=r&hl=ja&saddr=&daddr=&date=20110923&time=1632&ttype=last', {});
    var request = client.request('GET', '/m/directions?time=1632&ttype=last&date=20111023&dirflg=r&hl=ja&saddr=渋谷駅（東京）&daddr=横浜駅（神奈川）', {});
    var content = '';
    request.on('response', function(response){
      response.on('data', function(chunk){
        content = chunk;
        socket.emit('idCode', { data: content + ''});
        socket.emit('idCode', { data: data.code});
      }); 
    }); 
    request.end();
  });
});
