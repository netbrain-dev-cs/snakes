// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/static'));

// Chatroom

var numUsers = 0;

let game ={
  state:'init',
  numUsers:0,
  directions:[],
  keyIndex:{}
};

function gameProcess(){
  io.emit('step game',{body:game.directions});

  if(game.state === 'running'){
    setTimeout(gameProcess,130);
  }
}

function createSnakes(n){
  snakesData = [];
  body = [60,61];
  for(let i=0;i<n;i++){
    snakesData.push({body:body.slice(),direction:2});
    body[0]+=40;
    body[1]+=40;
  }
  return snakesData;
}

function startGame(){
  if(game.state !== 'init')return;

  let index = 0;
  let sockets = io.sockets.sockets;
  for(let key in sockets){
    game.keyIndex[key] = index;
    game.directions[index] = 2;
    index++;
  }

  let snakesData = createSnakes(index);

  io.emit('start game',{body:snakesData});

  game.state='running';
  gameProcess();
}

function clearGame(){
  game.state='init';
  game.numUsers = 0;
  game.directions = [];
  game.waitStart={};

  console.log('game reset');
}


io.on('connection', function (socket) {
  numUsers ++;
  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    if(data.indexOf('$start') >= 0){
      if(game.state === 'init'){
        startGame();
        socket.emit('to master');
      }
      return;
    }
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: 'none',
      message: data
    });
  });

  socket.on('keydown',function(data){
    if(game.state === 'running'){
      let key = data.key;
      let id = socket.id;
      let index = game.keyIndex[id];
      game.directions[index]=key;
    }
  });

  socket.on('add food',function(data){
    io.emit('add food',data);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
        --numUsers;
        if(numUsers === 0){
          clearGame();
        }
    });
});
