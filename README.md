# Chat application tutorial
## Introduction
Repo for a chat application tutorial
TODO: explain HTTP, JS, Node.js, NPM, express, socket.io

For the back-end we're going to use [Express](https://expressjs.com/) & [Socket.io](https://socket.io/)

Explain that we will not be making an end-all chat application, but a rather quick tour through some of the possibilities, for re-use. Entice readers to improvise and improve/expand.

## Getting started with a simple chat application
Create a project folder in a place to your liking.
Open terminal and run `npm init` to initialize NPM and follow the instructions, this will create a **package.json** file, that will contain a little information about our project and it's dependencies. From now on when we install a dependency by running `npm install` it gets added to the node_modules folder.

### Setting up a web server
First we're going to install [express](https://expressjs.com/) to make sure express is installed every time we install our project later on, we're going to use `npm install --save express`, the `--save` flag makes sure our dependencies are saved to our **package.json** file, and will serve as instructions for later installations.

Our **package.json** should now contain the following:

``` javascript
"dependencies": {
    "express": "^4.15.3"
}
```
Now in our **package.json** file we've set our main file to be **index.js**, now we need to create it as this is the file that we will run to start our project. Next we're going write the following javascript:

``` javascript
const app = require('express')();
const http = require('http').Server(app);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

```
First we've declared a constant (`const`) named 'app' and *required* (i.e. included) express and made sure it's initialized.
Then we've declared a constant named 'http' to require the built-in node.js http server and pass it the express app.
Next app will handle all *get* requests that start with "/" and the following function will handle the callbacks,
in this case we're only using the response (`res`) argument and sending back a string of HTML.
Finally the http server is instructed to listen on port 3000.

Now we're heading back to our terminal and we're going to run `node index.js`, this will instruct Node.js to execute our **index.js**.
Now you should see `listening on *:3000` in your terminal. Now open your browser and visit [localhost:3000](http://localhost:3000), where you will now see a title saying "**Hello World**".

### Serving files
Right now we're only sending a single line of HTML back to the visitor, to write all our HTML in the **index.js** file would be rather cumbersome. Instead we're going to create an HTML file called **index.html** and send that back to the visitor. first the create the file and fill it with some basic HTML templating.

**💡 Tip: Depending on what editor you're using an [Emmet](https://emmet.io/) might be available as plugin/package. [Emmet](https://emmet.io/) is a tool that will help you write HTML more efficient.**

Let's just make sure your HTML file looks something like this:
``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Chat tutorial</title>
</head>
<body>
  <div class="chat">
    <ol id="messages" class="chat__messages"></ol>
    <form id="form" action="" class="chat__form">
      <input id="message" autocomplete="off" class="chat__form__input" />
      <button class="chat__form__button chat__form__button--send">Send</button>
    </form>
  </div>
</body>
</html>
```
**💡 Tip: The classes used here a based on the [BEM](http://getbem.com/) methodology, which might help you with writing more reusable and component based CSS.**

Next we make sure that the file gets sent to the visitor by changing our previous

`res.send('<h1>Hello world</h1>');`

in our **index.js**, to

`res.sendFile(__dirname + '/index.html');`

The `__dirname` here is a so called *global* supplied by Node.js that supplies us with the directory of the current module that's being run (our chat-tutorial in this case). Further this instructs the server to send a file from that folder named **index.html**.

Next we're going to need to restart our application to have it pickup these changes, you can do so by pressing `ctrl`+`c` to end the current process in your terminal. Next we're going to run `node index.js` again.

### Live communication

A chat wouldn't be much of a chat if we weren't able to communicate in (close to) realtime, for this we'll be using websockets, to make our lives easier we're going to call upon [socket.io](https://socket.io/) to handle that for us, first we'll install it by running:

`npm install --save socket.io`

Next we'll have to make sure our server knows to use socket.io, add the following to **index.js**:
``` javascript
const io = require('socket.io')(http);
```
``` javascript
io.on('connection', function(socket){
  console.log('a user connected');
});
```

Now that the server knows to use sockets, the front-end should too, include the following just above the body tag of our **index.html**:
``` html
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();
</script>
```
**💡 Tip: We're using "const" here in the browser, whilst node.js supports ["const"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/const) and ["let"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/let),browsers support can be non-existent, depending on what browsers you want to support you can change these declaration keywords to the older ["var"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/var), I would advise you to read the links to these keywords to gain a better understanding of what they do.**


Whilst it might seem to you that '/socket.io/socket.io.js' does not exist, it does. Socket.io injects a link to the file that is located in the socket.io module in our node_modules folder.

Now restart the server and load the page, you'll see `a user has connected` in the terminal every time you open the page. Every socket that's emits events, one of those is "disconnect", lets add it in to the mix and watch what happens when you open and close the page now (after an other restart).
Add the following code in the correct position:
``` javascript
socket.on('disconnect', function(){
  console.log('user disconnected');
});
```

The great thing about socket.io is that it's event based and that we can add our own events to it, by emitting them and listening to them from either the front-end or back-end.

We will replace our previous `const socket = io();` with a bit more encapsulated code by wrapping it in a self executing function, next we will be using [querySelector](https://developer.mozilla.org/docs/Web/API/Document/querySelector) to select the form and the message field. To send the message we will add an [event listener](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener) to capture the "submit" event and [prevent](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) it from doing it what it does by default (ie. following the action, in this case posting to the current page). Once it we have that we'll emit an event to our socket named "chat message" and pass our [input value](https://developer.mozilla.org/docs/Web/API/HTMLInputElement) to it.

``` javascript
(function(){
  const socket = io();
  const form = document.querySelector('.chat__form');
  const message = form.querySelector('.chat__form__input');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    socket.emit('chat message', message.value);
    message.value = '';
  });
})();
```

The back-end will need to know what to listen for and how to react to it, we'll make the server listen to our "chat message" by adding the following, which will log the messages we're sending to the front-end to our terminal. Go ahead and try that.
``` javascript
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
```

Next, we'll want to make sure everyone of our visitors gets the actual message, as such we will replace the logging with an emitting of the message to all connected sockets. That is, if the message contains more than 0 characters that are not whitespace, [trim()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim) will take care of the whitespace for us.
``` javascript
  const msgLength = msg.trim().length;
  if(msgLength > 0) {
    io.emit('chat message', msg);
  }
```

Now that we're emitting the chat message to all connected sockets, those need to listen for it and react to it as well. To do so well add a listener to it and handle it by [creating](https://developer.mozilla.org/docs/Web/API/Document/createElement) a new [list item element](https://developer.mozilla.org/docs/Web/HTML/Element/li) and [adding the respective classes](https://developer.mozilla.org/docs/Web/API/Element/classList), setting the [text content](https://developer.mozilla.org/docs/Web/API/Node/textContent) and [adding](https://developer.mozilla.org/docs/Web/API/Node/appendChild) it to our [list](https://developer.mozilla.org/docs/Web/HTML/Element/ol) of messages. Finally we will make sure that on every new message, our messages list [scrolls](https://developer.mozilla.org/docs/Web/API/Element/scrollTop) to show the last one.
``` javascript
const messages = document.querySelector('.chat__messages');
```
``` javascript
socket.on('chat message', function(msg){
  const newMessage = document.createElement('li');
  newMessage.classList.add('chat__messages__message');
  newMessage.innerHTML = msg;
  messages.append(newMessage);
  messages.scrollTop = messages.scrollHeight;
});
```

Restart your server and reload the page to see your chat working!  

Now we're going to add some other kind of message; we're going to notify others if someone joins our chat. We're going to "broadcast" an emission, that gets sent to everyone but the current socket:
``` javascript
socket.broadcast.emit('new user', 'A new user has joined the chat');
```

On the front-end we will listen for the "new user" emission and act accordingly, now what we might want to do is pretty much copy the code from our other message and add the system specific class:
``` javascript
socket.on('new user', function(msg){
  let newMessage = document.createElement('li');
  newMessage.classList.add('chat__messages__message', 'chat__messages__message--system');
  newMessage.textContent = msg;
  messages.appendChild(newMessage);
  messages.scrollTop = messages.scrollHeight;
});
```

Now, for two messages this seems workable, but we'll be much better off in the end by keeping it [**DRY**](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).
We could do so by changing our message handling to create a single function to pass our messages to. We'll name it "messageHandler" and pass it two variables, the first, the message is required, but we want the second to be a boolean indicating wether or not it is a system message. Since we don't need it to be required, well check if it's explicitly set to "true" otherwise it'll default to false by checking [strict equality](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness).

``` javascript
function messageHandler(message, system) {
  system = (system === true);
  const newMessage = document.createElement('li');
  newMessage.classList.add('chat__messages__message');
  if(system) {
    newMessage.classList.add('chat__messages__message--system');
  }
  newMessage.textContent = message;
  messages.appendChild(newMessage);
  messages.scrollTop = messages.scrollHeight;
}

socket.on('chat message', function(msg){
  messageHandler(msg);
});

socket.on('new user', function(msg){
  messageHandler(msg, true);
});
```

One other thing that we're going to add is a timestamp as data attribute that we will position with CSS. Add the following function before our messageHandler function.

``` javascript
function getTimeStamp() {
  const d = new Date();
  let minutes = d.getMinutes();
  let seconds = d.getSeconds();
  minutes = minutes < 10 ? '0'+minutes : minutes;
  seconds = seconds < 10 ? '0'+seconds : seconds;
  return d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear() + "  " + d.getHours() + ":" + minutes + ":" + seconds;
}
```

To add it to the message add the following just above the `message.appendChild(newMessage)` in our messageHandler:
``` javascript
newMessage.setAttribute('data-timestamp', getTimeStamp());
```
### Some styling

Finally we'll add some styles, I've created some simple styles for you to use, feel free to create your own:
``` css
<style>
  *, *:before, *:after {
    box-sizing: border-box;
  }
  html {
    font-family: sans-serif;
    font-size: 16px;
    line-height: 1.35;
  }
  body {
    margin: 0;
  }
  input, button {
    font-size: inherit;
    line-height: inherit;
  }
  .chat {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .chat__messages {
    flex: 1;
    list-style: none;
    margin: 0;
    overflow: auto;
    padding: 0;
  }
  .chat__messages__message {
    padding: 4px 10px;
  }
  .chat__messages__message:before {
    color: #a0a0a0;
    content: attr(data-timestamp);
    font-size: 0.8rem;
    margin-right: 10px;
  }
  .chat__messages__message:nth-child(even) {
    background-color: #f3f3f3;
  }
  .chat__messages__message--system {
    color: #a0a0a0;
    font-size: 0.8rem;
  }
  .chat__form {
    background-color: #f3f3f3;
    border-top: 1px solid #ccc;
    display: flex;
    margin-top: auto;
    padding: 10px 10px;
  }
  .chat__form__input {
    -webkit-appearance: none;
    background-color: #fff;
    border: 1px solid #333;
    color: #111;
    display: block;
    padding: 10px;
    width: 100%;
  }
  .chat__form__button {
    -webkit-appearance: none;
    background-color: #ccc;
    border: 1px solid #333;
    color: #111;
    display: block;
    margin-left: 10px;
    padding: 10px 20px;
  }
  .chat__form__button--send {
    background-color: rgb(5, 153, 82);
    border-color: rgb(4, 79, 43);
    color: white;
  }
</style>
```
**💡 Tip: declaring ["box-sizing: border-box;"](https://developer.mozilla.org/docs/Web/CSS/box-sizing) for all elements can make CSS a lot nicer to work with, it'll make sure that paddings are not added to any dimensions but rather subtracted, allowing for much easier styling, give it a try!**

**💡 Tip: declare your font and type related styling on the html selector, that was you can rely on [rem units](https://developer.mozilla.org/docs/Web/CSS/font-size#Rems) throughout your CSS and even scale sizes all at once by adding a [media query](https://developer.mozilla.org/docs/Web/CSS/Media_Queries/Using_media_queries) to your html selector.**

## Taking it up a notch, (re)creating the front-end in [angular](https://angular.io/)

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


































~
