# Chat application tutorial
## Introduction

In this tutorial we'll try to create a simple chat application that will allow you to expand it and serve as an inspiration for other things you could do with these techniques. The techniques you'll see here have inspired me to now only use it on the web but on things like an Arduino or a Raspberry Pi as well.
For instance, I've used a combination of these techniques to control multiple Arduino's from a web server on a Raspberry Pi to create a control room for an escape room.
This has allowed me to create an escape room that requires virtually no input during the room's playtime, whilst giving us better insight in to what user have or havent done.

This tutorial will rely heavily on [NodeJS](https://nodejs.org) and it's package manager NPM.
For the back-end we're going to use [Express](https://expressjs.com/) & [Socket.io](https://socket.io/) and for the front-end we'll be using [angular](https://angular.io/).

So you might want to read up a little on those before we get started.


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
    users: users,
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
      username: username,
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

**💡 Tip: If you're using a text editor that allows for plugins/extensions like [Atom](https://atom.io/). I'd advise you to install the relevant typescript and angular plugins, this'll make your programming a whole lot more fun.**


*Obviously our previous setup with express/socket.io is not a requirement for angular, we will just be using it as our back-end for the sake of this tutorial*

### 2.1 Setting up

First we're going to install the Angular CLI (Command Line Interface) globally (that means it'll be available from all folders in our terminal after we're done, so it won't be a dependency just for our project).
At the time of writing we need to make sure our node version is at least `6.9.x or higher` and our npm version is at least `3.x.x or higher`.

**💡 Tip: You can check your node version by typing `node -v` in your terminal, the same goes for npm `npm -v`.**

**💡 Tip: If you're on a Mac and you'd like to update your node or npm or need to switch to an older or newer version in case of breaking updates or outdated projects take a look at [nvm](https://github.com/creationix/nvm) (despite the acronym that's not "never mind", it's Node version manager😉).**

Now let's install the Angular CLI by running `npm install -g @angular/cli` in our terminal, the `-g` means that it'll be installed globally so that you can use it from anywhere from then on. Go back to your "chat-tutorial" folder and run `ng new front-end --style scss`. This will create a new folder in our "chat-tutorial" folder named "front-end" containing the basic setup of our angular project using `scss` for CSS. Neat!

If you're unfamiliar with [SCSS (or Sass): it's an extension of the CSS language](http://sass-lang.com/), the allows for the usage of includes, functions, variables, and a whole bunch of other helpful things that get compiled to standard CSS so that it'll work in all your favorite browsers!

Now move to our new folder in the terminal. If you'll now run `ng serve`, and visit the url (localhost:4200) you'll see a little page with some links to angular related content. When you're running `ng serve` it will automatically update the resources you change in the front-end project. As somewhat usual, the builtin server starts serving from `src/index.html` in there you'll see a tag named `app-root`, this refers to the component defined you'll find the `app` folder and the HTML it outputs can be found in the `app/app.component.html` file. For now empty that file.

Personally I like giving any page I'm working on a little bit of basic styling. If think you'll like that as well, add some to the `styles.scss`.
Here's what I've added:
``` scss
*,*::before,*::after {
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
```

**💡 Tip: declaring ["box-sizing: border-box;"](https://developer.mozilla.org/docs/Web/CSS/box-sizing) for all elements can make CSS a lot nicer to work with, it'll make sure that paddings are not added to any dimensions but rather subtracted, allowing for much easier styling, give it a try!**

### 2.2 Creating the messages view

Next we're going to create a component to view the chat messages. We'll do so by running `ng g component messages-view` (wherein g is short for generate).
This will now have generated a folder named `messages-view` in which the basics of our message-view component have been scaffolded for us. The newly generated component will have a selector of `app-messages-view`. We'll add that as a custom element to our `app.component.html`. We'll also include a wrapping element with a class.
``` html
<div class="app-message-container">
  <app-message-view></app-message-view>
</div>
```
If all went well the browser will now show "messages-view works!"
Quickly give our `app.component.scss` some styles and continue on.

``` scss
.app-message-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
```


#### 2.2.1 Programming

Now we're going to get going on some TypeScript, keep in mind that TypeScript is quite different from the JavaScript you've seen thus far. It's no big deal if you can't grasp it immediately, just take your time. Those who've done programming in other class based and/or typed languages, might be more comfortable, but JavaScript is still it's own cup of tea.

Somethings you might notice are `import`s and an `@Component` annotation.
The former tells the component class what we're importing and makes the variables available to the scope of the specific TypeScript file. The latter is an annotation, which contains information that angular will pickup to do some binding and linking.

For now we'll want an Array of the messages we'll be displaying, we'll start out with a dummy set to get going.

In our `MessageViewComponent` (`message-view.component.ts`) class we'll add a private data member called messages, which we'll instantiate as an empty Array of objects. In JavaScript however, almost all types of variables are instances of Object, and as such typing would have little to no effect, but we'll handle that later. It's common to declare data members in the beginning of the class (before the constructor).

``` javascript
private messages = new Array<Object>();
```

Next we'll need some means of setting and getting the messages, we'll do this with something similar to getters and setters in other languages (though JavaScript is not as strict still). We'll add these functions bellow our constructor and bellow the `ngOnInit` (or similar if the class implements an other variant).

``` javascript
addMessage(message: Object): void {
  this.messages.push(message);
}
```

What we have here are is a method to add messages to the messages Array. As you can see the variables in this are typed and as such will only take variables of the provided types. (TypeScript will also enforce this regardless.)

*Sadly TypeScript does not support method overloading*

Now whilst that might seem fine initially, I think that just any regular old object might be a bit too lenient. If only we'd have a way to enforce what our object looks like. Sure we can all agree that a all messages should contain an actual message and maybe a timestamp. Next we could create classes for user messages or system messages, that have different fields.

By running `ng g interface Message` we'll create an interface called Message, interfaces only run on compile time in angular, which means that it's not going to be part of the final code whereas classes will be. Interfaces are specific to TypeScript in this regard, whilst classes come form the latest JavaScript versions. Interfaces are way to make sure we as developers keep track of what we're doing.

An interface will allow us to define what a given class should at least implement. For us that would look like this.

``` javascript
export interface Message extends Object {
    message: String;
    timestamp: Number;
}
```

What we've done here is defined that a Message is an extension of an Object and that any Message should at least have a message and a timestamp.

Next we'll create two [classes](https://angular.io/api/core/Class), UserMessage and SystemMessage. Angular CLI can do that for us as well. `ng g class UserMessage SystemMessage` will create both of those for us. Next we'll use edit that too look like this:

``` javascript
import { Message } from "./message";

export class SystemMessage implements Message {
  message: String;
  timestamp: Number;

  constructor(message: String, timestamp: Number = Date.now()) {
    this.message = message;
    this.timestamp = timestamp;
  }

}
```

First we'll need to import the Message interface to make sure that our class knows what we're going on about. Next we'll say that our SystemMessage is an implementation of our Message interface. We'll add a constructor to the class (a function that gets called when you instantiate a class), in which we'll pass the message and for now set the timestamp automatically. We've also added the timestamp with a default value of `Date.now()`.

We'll do the same for our UserMessage, but we'll add the username in there as well.
``` javascript
import { Message } from "./message";

export class UserMessage implements Message {
  message: String;
  timestamp: Number;
  username: String;

  constructor(username: String, message: String, timestamp: Number = Date.now()) {
    this.message = message;
    this.timestamp = timestamp;
    this.username = username;
  }
}
```

You might have noticed that our Message classes don't use private. This is since they should implement Message, in TypeScript, interfaces don't check private members on implementations sadly. So for now this would return an error. This may change in the future.

Now we know what our messages will look like, we'll head back to our `message-view.component.ts` file. We'll import the `Message` interface.
``` javascript
import { Message } from "../message";
```
So that our message-view component class will know what it is, and we'll change the reference to Object to Message, so that our Array will only take Message(s) and our addMessage method will do the same. One other thing we'll do for now is import the `SystemMessage` class and add an initial message to our `ngOnInit()` which get's called on initialization of the component.

``` javascript
ngOnInit() {
  this.addMessage(new SystemMessage("Welcome to the chat"));
}
```

#### 2.2.2 Templating

Angular comes with its own (templating engine)[https://angular.io/guide/template-syntax], which will allow for a lot of things that come built-in but also allow us to extends it with custom [directives](https://angular.io/api/core/Directive) or [pipes](https://angular.io/api/core/Pipe). For now however we'll use the built-ins.

We'll start with an ordered list containing messages on which we'll do a [for loop](https://angular.io/api/common/NgFor), where we'll loop over all the messages and for the iteration of the loop assign them to `message`.

Next we're going to give system messages a separate CSS class by using a (ternary operator)[https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Conditional_Operator] in an [ngClass directive](https://angular.io/api/common/NgClass), to check if the [constructor](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes/constructor) of the message is 'SystemMessage'.

As we know our messages may or may not have an username, by default if the username is not defined, it won't show in angular, the containing element will still render however. For our use case this is something which we don't want.
To manage this we'll use the [ngIf directive](https://angular.io/api/common/NgIf) which will only render the element if the passed condition resolves to a (truthy)[https://developer.mozilla.org/docs/Glossary/Truthy] value.

Next we'll use the angular's interpolation (`{{ ... }}`) to show the values of our message in the template.

``` html
<ol class="message-list">
  <li class="message" *ngFor="let message of messages;" [ngClass]="{'message--system': (message.constructor.name === 'SystemMessage')}">
    <time class="message__timestamp">{{message.timestamp}}</time>
    <span *ngIf="message.username" class="message__author">{{message.username}}</span>
    <span class="message__content">{{message.message}}</span>
  </li>
</ol>
```

If you now look at the component after it's rendered, you'll see a list with a single welcome message. One thing you might notice is that the timestamp isn't quite human readable. Luckily angular comes with a (builtin pipe)[https://angular.io/api/core/Pipe], that will allow us to convert this value on the fly on the template side. To convert our timestamp to a readable date we'll use the (Date pipe)[https://angular.io/api/common/DatePipe].

``` html
<time class="message__timestamp">{{message.timestamp | date:'mediumTime'}}</time>
```

That's more like it!

Now apply some styling from our `message-view.component.scss`. If you'd just like to continue, here's what I've used:
``` scss
:host {
  flex-grow: 0;
  height: 100%;
  overflow: auto;
}

.message-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-direction: column;
}

.message {
  display: flex;
  flex-flow: wrap;
  width: 100%;
  padding: 1rem 0.75rem;
  &--system {
    background-color: #f8f8f8;
    color: #ccc;
  }
  &__timestamp {
    color: #ccc;
    margin-right: 0.5rem;
  }
  &__author {
    font-weight: bold;
    margin-right: 0.5rem;
  }
  &__content {
  }
}
```

### 2.3 Getting the messages from the socket server

Now sure it'd be nice if we'd be able to actually show message that we're sent to the back-end (as done in the first part of this tutorial).
Now we could create this connection to get and post the messages again and again for every component (the view and in the next step the message-writer).
But these kinds of shared functionality are better of in (services)[https://angular.io/guide/architecture#service].

Let's create one! We can do so by running `ng g service chat` from the terminal.
To be able to share it with all the components add it to the providers in `app.module.ts`.

``` javascript
import { ChatService } from './chat.service';
```

``` javascript
providers: [ChatService],
```

We'll start by defining at what url the socket server is running, to do so in a way that easily allows us to switch to the production url if we ever go live with the chat we'll use the environment variables that come with angular. Open `environments/environment.ts` and `environments/environment.prod.ts` and add a `socketServer` property and set it to the respective url (localhost:3000 by default for this tutorial).

We'll also need to know about socket.io in this service, as well as about all our different message implementations. Finally we'll need to import `BehaviorSubject` from rxjs to allow us to act when and only when something changes in that specific variable.

``` javascript
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'
import * as io from 'socket.io-client';
import { Message } from './message';
import { UserMessage } from './user-message';
import { SystemMessage } from './system-message';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
```

**💡 Tip: If you get a message that any of these packages are undefined install them using
npm, additionaly you might be required to restart your `ng serve` to load the new dependencies.**


Next we'll define the variable in our service:

``` javascript
private socketUrl:String = environment.socketServer;
private socket:any = null;
private messageSubject:BehaviorSubject<Message> = new BehaviorSubject<Message>(
  new SystemMessage("Welcome to the chat")
);
```

Notice that we've set socket to be of type "any", this will allow it to be anything. Since we can't know right now what type socket will be and we'll only use it once and we know what we're doing we can allow this for once. Do not use "any" just if something doesn't take, use typing consistently, this will make it easier to maintain your code in a larger code base.

Next we'll initialize our socket variable in the constructor and add some listeners to the sockets for getting the messages. And we'll add a [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) for the messages for convenience sake.



``` javascript
constructor() {
  this.socket = io(this.socketUrl);

  this.socket.on('new user', (input) => {
    const message = new SystemMessage(input.body);
    this.messageSubject.next(message);
  });

  this.socket.on('chat message', (input) => {
    const message = new UserMessage(input.username, input.body);
    this.messageSubject.next(message);
  });

}

get messages() {
  return this.messageSubject;
}
```

Now we'll hook it up to our message-view component.
Import the ChatService, and remove this SystemMessage import, since we won't be using that anymore. We'll be injecting the chatService in to our constructor and subscribe to the messages. Next every time a message comes in we'll add it to the array in our messages-view component.

``` javascript
constructor(private chatService: ChatService): void {
  (chatService.messages).subscribe(
    message => {
      this.messages.push(message);
    }
  );
}

ngOnInit() {
}
```

If you'd like you can now try to send messages from our part one and they'll show up in your new angular version, since they share the back-end.

### 2.4 Posting messages

Create a new component from the terminal, this one we'll name "message-writer" (`ng g component message-writer`). And add it to the `app.component.html`.

``` html
<div class="app-message-container">
  <app-message-view></app-message-view>
  <app-message-writer></app-message-writer>
</div>
```

#### 2.4.1 Connecting the service

Open ChatService and add a method that will allow you to send a message.

``` javascript
sendMessage(messageBody: String): void {
  this.socket.emit('chat message', messageBody);
}
```

Next we'll define in our MessageWriterComponent that we will have a string of message and a string of placeholder. The message we will bind to the HTML we'll create in a bit.

``` javascript
private message:String = "";
private placeholder:String = "Type your message..."
```

We'll also need to use the ChatService and to do so we'll inject it in our controller. Don't forget to import the ChatService.

``` javascript
constructor(private chatService: ChatService) {
}
```

Now we'll add a method to submit the message from the template.
We'll want to make sure we're not sending empty messages so we'll want to check for the length of the messages. We also don't want to the user to keeps sending the same message over and over by pressing enter repeatedly. So, we'll build in some checks to the method.

``` javascript
submitMessage(): void {
  if(this.message.length > 0) {
    this.chatService.sendMessage(this.message);
  }
  this.message = "";
}
```

First we've check if the message length is more then 0, if so, we'll send it to the chatService to handle the actual sending. Then we'll reset the message to be empty.

We also might want a way to check if the user can can send it that we could use in the front-end for indication purposes. So let's add a method that does just that.

``` javascript
canSend(): Boolean {
  return (this.message.length > 0);
}
```

Hmm, didn't we just write that check before? Go back to our submitMessage and change the check to use the canSend method. Now we'll be able to update the check in one place if we ever decide to change our requirements.  

#### 2.4.2 Templating

Open `message-writer.component.html`. And create a div, that contains a form with an attribute of (autocomplete set to off)[https://developer.mozilla.org/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion]. And add an input with a name of "message" and a button in the form.

``` html
<div class="message-writer">b
  <form class="message-writer__form" autocomplete="off">
    <input name="message" type="text" class="message-writer__message" />
    <button class="message-writer__submit">Submit</button>
  </form>
</div>
```

But hold, if we'd try to send it now, it'd do a post to the current page which results in a hard refresh. Let's add some angular directives. Let's make sure that the form calls our submitMessage method on submit, by using `(ngSubmit)` and passing our method to it. Next we'll want to make sure that the message in the template gets bound to the message in our `message-writer.component.ts`. We can do this binding it using the [ngModel directive](https://angular.io/api/forms/NgModel).

Next we'll want to add a little class change to our submit button if we can actually use it to send our message. To do so we'll use the [ngClass directive](https://angular.io/api/common/NgClass) and use our `canSend` method to switch the classes.

One final thing we want to do is set some native attributes to the input and button elements. But only of they exist or return a value. So instead of interpolation we'll use binding with square brackets "[]". This will make sure the properties get bound to variables in our components.

``` html
<div class="message-writer">
  <form class="message-writer__form" autocomplete="off" (ngSubmit)="submitMessage()">
    <input name="message" type="text" [(ngModel)]="message" [placeholder]="placeholder" class="message-writer__message" />
    <button class="message-writer__submit" [disabled]="!canSend()" [ngClass]="{'message-writer__submit--active': canSend()}">Submit</button>
  </form>
</div>
```

You might think what's that exclamation mark down there? It's there on purpose to invert the boolean value that `canSend()` returns. So instead of creating a new method for `isDisabled` or doing a check to see if `canSend() === false`, we simple invert what `canSend` returns. So that the button is only disabled if `canSend` is *not* true.

Now let's submit our message. Oh, wait. It still refreshes the page... How can this be?
We're using angular directive that should handle this stuff for us. Or are we?

Angular comes with a couple of built-in modules, but not all of those modules are always included in your own code, to keep the size of your files down.
So to use the [FormsModule](https://angular.io/api/forms/FormsModule) which does in fact do all of that for us. We'll have to add it to our module descriptor in `app.module.ts`.

``` javascript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { MessageViewComponent } from './message-view/message-view.component';
import { ChatService } from './chat.service';
import { MessageWriterComponent } from './message-writer/message-writer.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageViewComponent,
    MessageWriterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


## 3 We're done!

Right now you should have a working chat application that notifies you when an other user enters the chat and allows you to send messages to each other!

### 3.1 Closing remarks

I hope this tutorial has allow you to gain some insight in to the workings of NodeJS and Angular.
Whilst this tutorial has only touched the surface on these subjects I hope it has peaked your interest and will serve as an inspiration of all the things you could potentially do with these technologies.

### 3.2 Things you could try to add

- In the first part of the tutorial we've made it possible to keep track of the users, similar to how the messages work, you should now be able to show what users are online and allow them to change their name.

- Try to add the messages from the current user to the view instantly and show that it's in progress of sending it to the others if the connection is slow. You could then opt to show the server timestamp or the client side timestamp as we do currently.

- Add indicators to show a user is typing

- Add a message length limit and show the user how many characters they have left
