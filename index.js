const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  console.log('a user connected');
  socket.broadcast.emit('new user', 'A new user has joined the chat');

  socket.on('chat message', function(msg){
    const msgLength = msg.trim().length;
    if(msgLength > 0) {
      io.emit('chat message', msg);
    }
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
