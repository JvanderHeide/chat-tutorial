# Chat application tutorial
## Introduction
Repo for a chat application tutorial
TODO: explain HTTP, JS, Node.js, NPM, express, socket.io

For the back-end we're going to use [Express](https://expressjs.com/) & [Socket.io](https://socket.io/)

Explain that we will not be making an end-all chat application, but a rather quick tour through some of the possibilities, for re-use. Entice readers to improvise and improve/expand.

http://cssreference.io/
http://codepen.io/

~~Explain other uses; e.g. I've used the websockets to create a control interface for an escape room.~~

## 1.0 Getting started with a simple chat application
First make sure you have [NodeJS](https://nodejs.org) installed, in most cases it's best to download the LTS version (long term support).
Then, create a project folder named "chat-tutorial" in a place to your liking and create another folder in there named "back-end".
Open terminal and [navigate to the "back-end" folder](https://computers.tutsplus.com/tutorials/navigating-the-terminal-a-gentle-introduction--mac-3855) and run `npm init` to initialize NPM (node package manager) and follow the instructions, this will create a **package.json** file, that will contain a little information about our project and it's dependencies. From now on when we install a dependency by running `npm install` it gets added to the node_modules folder.

### 1.1 Setting up a web server
First we're going to install [express](https://expressjs.com/) to make sure express is installed every time we install our project later on, we're going to use `npm install --save express`, the `--save` flag makes sure our dependencies are saved to our **package.json** file, and will serve as instructions for later installations.

Our **package.json** should now contain the following:

``` json
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

### 1.2 Serving files
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

``` javascript
res.send('<h1>Hello world</h1>');
```

in our **index.js**, to
``` javascript
res.sendFile(__dirname + '/index.html');
```

The `__dirname` here is a so called *global* supplied by Node.js that supplies us with the directory of the current module that's being run (our chat-tutorial in this case). Further this instructs the server to send a file from that folder named **index.html**.

Next we're going to need to restart our application to have it pickup these changes, you can do so by pressing `ctrl`+`c` to end the current process in your terminal. Next we're going to run `node index.js` again.

### 1.3 Live communication

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

Next, we'll want to make sure everyone of our visitors gets the actual message, as such we will replace the logging with an emitting of the message to all connected sockets. That is, if the message contains more than 0 characters that are not whitespace, [trim()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim) will take care of the whitespace for us. We'll add a [timestamp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) to the message as well so that we can use this additional data to display the time when the message was received by the server. You could also pass other types of information in this way by sending back an [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) instead of the [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String).
``` javascript
  const msgLength = msg.trim().length;
  const timestamp = Date.now();
  if(msgLength > 0) {
    io.emit('chat message', {
      body: msg,
      timestamp: timestamp
    });
  }
```

Now that we're emitting the chat message to all connected sockets, those need to listen for it and react to it as well. To do so well add a listener to it and handle it by [creating](https://developer.mozilla.org/docs/Web/API/Document/createElement) a new [list item element](https://developer.mozilla.org/docs/Web/HTML/Element/li) and [adding the respective classes](https://developer.mozilla.org/docs/Web/API/Element/classList), setting the [text content](https://developer.mozilla.org/docs/Web/API/Node/textContent) and [adding](https://developer.mozilla.org/docs/Web/API/Node/appendChild) it to our [list](https://developer.mozilla.org/docs/Web/HTML/Element/ol) of messages. Finally we will make sure that on every new message, our messages list [scrolls](https://developer.mozilla.org/docs/Web/API/Element/scrollTop) to show the last one.
``` javascript
const messages = document.querySelector('.chat__messages');
```
``` javascript
socket.on('chat message', function(message){
  const newMessage = document.createElement('li');
  newMessage.classList.add('chat__messages__message');
  newMessage.innerHTML = message.body;
  messages.append(newMessage);
  messages.scrollTop = messages.scrollHeight;
});
```

Restart your server and reload the page to see your chat working!  

Now we're going to add some other kind of message; we're going to notify others if someone joins our chat. We're going to "broadcast" an emission, that gets sent to everyone but the current socket:
``` javascript
socket.broadcast.emit('new user', {
  body: 'A new user has joined the chat',
  timestamp: Date.now()
});
```

On the front-end we will listen for the "new user" emission and act accordingly, now what we might want to do is pretty much copy the code from our other message and add the system specific class:
``` javascript
socket.on('new user', function(message){
  let newMessage = document.createElement('li');
  newMessage.classList.add('chat__messages__message', 'chat__messages__message--system');
  newMessage.textContent = message.body;
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
  newMessage.textContent = message.body;
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

One other thing that we're going to add is a time indication as data attribute that we will position with CSS. Add the following function before our messageHandler function.

``` javascript
function resolveTimestamp(timestamp) {
  const d = new Date(timestamp);
  let minutes = d.getMinutes();
  let seconds = d.getSeconds();
  minutes = minutes < 10 ? '0'+minutes : minutes;
  seconds = seconds < 10 ? '0'+seconds : seconds;
  return d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear() + "  " + d.getHours() + ":" + minutes + ":" + seconds;
}
```

To add it to the message add the following just above the `message.appendChild(newMessage)` in our messageHandler:
``` javascript
newMessage.setAttribute('data-timestamp', resolveTimestamp(message.timestamp));
```

### 1.4 Keeping track of users
One more thing well do for now (which we'll expand upon in the front-end/second/angular part of this tutorial) is add a means to keep track of who's in the chat and give them a name. To do so we'll add an array outside of the sockets to store our users. This array only gets instantiated on starting the web server so it's shared between all future requests.  

``` javascript
const users = [];
```

Next we'll use a couple functions to help us keep track of the users.
``` javascript
function registerUser(name, id) {
  users.push({
    id: id,
    name: name
  });
}
```
This function will allow us to push an [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) containing an id and a name, to the users array.
We'll want to keep the id a relative secret so we'll only use it internally to get a reference to the user in the array.

``` javascript
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
```

This function uses [Array.prototype.find()]https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/find] to return the user in the array that matches the id. Next we'll want to be able to deregisterUsers when they leave.

``` javascript
function deregisterUser(id) {
  var user = getUserById(id);
  var userName = user.name;
  if(user) {
    var userIndex = users.indexOf(user);
    users.splice(userIndex, 1);
  }
  return userName;
}
```

This function takes an idea and finds the referenced user in the users array, next it [splices](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) the user from the array, using the [delete operator](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/delete) would've worked as well but that wouldn't reset length of the array, and thus give a somewhat crooked representation of the user list.

To update everyone of the state of the users, we'll emit the list to all who are connected whenever something changes.

``` javascript
function emitUserList(socket) {
  socket.broadcast.emit('user list', {
    body: users,
    timestamp: Date.now()
  });
}
```

Finally we'll finish this part of the back-end by using these functions to changing our socket connection to look like this:
``` javascript
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
```

Can you see what we're doing here and how we could use this later on?

We could use this to add the username to our messages in the front-end like so:

``` javascript
function messageHandler(message, system) {
  system = (system === true);
  const newMessage = document.createElement('li');
  const nameElement = document.createElement('strong');
  newMessage.classList.add('chat__messages__message');
  if(system) {
    newMessage.classList.add('chat__messages__message--system');
  } else {
    nameElement.textContent = message.username;
    newMessage.innerHTML = nameElement.outerHTML+": ";
  }
  newMessage.innerHTML += message.body;
  newMessage.setAttribute('data-timestamp', resolveTimestamp(message.timestamp));
  messages.appendChild(newMessage);
  messages.scrollTop = messages.scrollHeight;
}
```

Now the messageHandler function adds a "strong" element to the chat message containing the username we've sent with it.
We'll expand on the usage of user list in the second part of the tutorial. 

### 1.5 Adding some style

Finally we'll add some styles, I've created some simple styles for you to use, feel free to create your own, you can place this in `<style></style>` tags just above the closing "head" tag:
``` css
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
```

**💡 Tip: declaring ["box-sizing: border-box;"](https://developer.mozilla.org/docs/Web/CSS/box-sizing) for all elements can make CSS a lot nicer to work with, it'll make sure that paddings are not added to any dimensions but rather subtracted, allowing for much easier styling, give it a try!**

**💡 Tip: declare your font and type related styling on the html selector, that was you can rely on [rem units](https://developer.mozilla.org/docs/Web/CSS/font-size#Rems) throughout your CSS and even scale sizes all at once by adding a [media query](https://developer.mozilla.org/docs/Web/CSS/Media_Queries/Using_media_queries) to your html selector.**

Now if you were to open your ports for access from another computer (be careful!) or run this on a Node.JS server (perhaps on a Raspberry Pi or something similar) you'll have a chat application that you and others can use! By now you might've thought of some other applications for these techniques. One of those applications I found was to use the socket communication back and forth to control Arduino's from a Raspberry (or just the i/o pins on the Raspberry) (using [Johnny-Five.io](http://johnny-five.io/)) from a web interface. Think of all the possibilities!

## 2.0 Taking it up a notch, (re)creating the front-end in [angular](https://angular.io/)

For this second part we will be creating a new front-end for our chat application. We'll be using angular. The current version of angular uses Microsoft's [TypeScript](https://www.typescriptlang.org/) which is a superset of JavaScript that introduces typing and annotations to JavaScript as well as adding support for the latest features of JavaScript as well as future functionality (those that are yet to land in browsers) by supporting the new syntax and compiling that to JS that current browsers do support. In regards to typing: where as normal JavaScript would allow you to define a variable like `let example = true;` (a boolean) and later overwrite that by `example = 1` (a number), TypeScript will prevent you from doing this and forces you write cleaner and more maintainable code if you adhere to its standard. I would suggest reading up a little on the [fundamentals of angular](https://angular.io/guide/architecture) before we continue. One of the key take aways there will be:

> You write Angular applications by composing **HTML templates with Angularized markup**, writing component **classes to manage those templates**, adding **application logic in services**, and **boxing components and services in modules**. - [angular.io](https://angular.io/guide/architecture)

Luckily angular has a CLI (command line interface) which will help us by creating a lot of the code we need to get started for us! Let's get going.

*Obviously our previous setup with express/socket.io is not a requirement for angular, we will just be using it as our back-end for the sake of this tutorial*

### Setting up

First we're going to install the Angular CLI (Command Line Interface) globally (that means it'll be available from all folders in our terminal after we're done, so it won't be a dependency just for our project).
At the time of writing we need to make sure our node version is at least `6.9.x or higher` and our npm version is at least `3.x.x or higher`.

**💡 Tip: You can check your node version by typing `node -v` in your terminal, the same goes for npm `npm -v`.**

**💡 Tip: If you're on a Mac and you'd like to update your node or npm or need to switch to an older or newer version in case of breaking updates or outdated projects take a look at [nvm](https://github.com/creationix/nvm) (despite the acronym that's not "never mind", it's Node version manager😉).**

Now let's install the Angular CLI by running `npm install -g @angular/cli` in our terminal, the `-g` means that it'll be installed globally so that you can use it from anywhere from then on. Go back to your "chat-tutorial" folder and run `ng new front-end --style scss`. This will create a new folder in our "chat-tutorial" folder named "front-end" containing the basic setup of our angular project using `scss` for CSS. Neat!

Now move to our new folder in the terminal. If you'll now run `ng serve`, and visit the url (localhost:4200) you'll see a little page with some links to angular related content. When you're running `ng serve` it will automatically update the resources you change in the front-end project. As somewhat usual, the builtin server starts serving from `src/index.html` in there you'll see a tag named `app-root`, this refers to the component defined you'll find the `app` folder and the HTML it outputs can be found in the `app/app.component.html` file. For now empty that file.

### Creating our first component, the message view

Next we're going to create a component to view the chat messages. We'll do so by running `ng g component message-view` (wherein g is short for generate).
This will now have created a folder named `message-view` in which the basics of our message-view component have been scaffolded for us. The newly generated component will have a selector of `app-messages-view`. We'll add that as a custom element to our `app.component.html`. If all went well the browser will now show "message-view works!"



Angular CLI
- Install typescript plugin for atom (tip/hint)
- Components
- socket services
- styles
- further expansions

https://angular.io/api/animations/stagger

TODO:
- add further stuff to backend?
- author names, store an array of users and uuids in memory
- show list of current users, ask users for name and register uuid
- match user/uuid to session? (  var sid = req.sessionID;)
- in memory storage?

































~
