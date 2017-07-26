$(function () {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username = 'none';

  var socket = io();

  let ctx = document.getElementById("can").getContext("2d");
  
  let snakeGame = new SnakeGame(ctx, 40);

  // Sends a chat message
  function sendMessage() {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }


  // Adds the visual chat message to the message list
  function addChatMessage(data, options) {
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var $messageDiv = $('<li class="message"/>')
      .append($messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement(el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput(input) {
    return $('<div/>').text(input).text();
  }


  // Keyboard events

  $window.keydown(function (event) {
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      sendMessage();
    }

    keyCode = event.which - 37;

    if (keyCode >= 0 && keyCode <= 3) {
      socket.emit('keydown', {
        key: keyCode
      });
    }

  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  socket.on('start game',function(data){
    let snakes = data.body;
    for(let i in snakes){
      snakeGame.addSnake(snakes[i].body,snakes[i].direction);
    }
    snakeGame.start();
  });

  socket.on('step game',function(data){
    snakeGame.step(data.body);
  });

  socket.on('to master',function(data){
    snakeGame.toMaster();
  })

});