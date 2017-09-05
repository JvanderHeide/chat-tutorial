const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const users = [];

function registerUser(name, id) {
  users.push({
    id: id,
    name: name
  });
}

function getUserById(id) {
  return users.find(function(user, index, array){
    if(user) {
      if(user.id === id) {
        return user;
      }
    }
    return null;
  });
}

function deregisterUser(id) {
  var user = getUserById(id);
  var userName = user.name;
  if(user) {
    var userIndex = users.indexOf(user);
    users.splice(userIndex, 1);
  }
  return userName;
}

function emitUserList(socket) {
  socket.broadcast.emit('user list', {
    body: users,
    timestamp: Date.now()
  });
}

io.on('connection', function(socket){

  console.log('a user connected');

  registerUser("Anonymous", socket.id);
  emitUserList(socket);

  socket.broadcast.emit('new user', {
    body: 'A new user has joined the chat',
    timestamp: Date.now()
  });

  socket.on('user update', function(msg) {
    var currentUser = getUserById(socket.id);
    currentUser.name = msg.body;
    emitUserList(socket);
  });

  socket.on('chat message', function(msg){
    const username = getUserById(this.id).name;
    const msgLength = msg.trim().length;
    const timestamp = Date.now();
    if(msgLength > 0) {
      io.emit('chat message', {
        body: msg,
        timestamp: timestamp,
        username: username
      });
    }
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    var username = deregisterUser(socket.id);
    socket.broadcast.emit('user left', {
      body: username,
      timestamp: Date.now()
    })

    emitUserList(socket);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
