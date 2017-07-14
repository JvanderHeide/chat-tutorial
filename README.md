# Chat application tutorial
## Introduction
Repo for a chat application tutorial
TODO: explain HTTP, JS, Node.js, NPM, express, socket.io

For the back-end we're going to use [Express](https://expressjs.com/) & [Socket.io](https://socket.io/)

## Getting started
Create a project folder in a place to your liking.
Open terminal and run `npm init` to initialize NPM and follow the instructions, this will create a **package.json** file, that will contain a little information about our project and it's dependencies.

## Setting up a web server
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

## Serving files
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
  <ul id="messages" class="messages"></ul>
  <form action="" class="form">
    <input id="message" autocomplete="off" class="form__input" />
    <button class="form__button form__button--send">Send</button>
  </form>
</body>
</html>
```
**💡 Tip: The classes used here a based on the [BEM](http://getbem.com/) methodology, which might help you with writing more reusable and component based CSS.**

Next we make sure that the file gets sent to the visitor by changing our previous `res.send('<h1>Hello world</h1>');` in our **index.js** to `res.sendFile(__dirname + '/index.html');`. The `__dirname` here is a so called *global* supplied by Node.js that supplies us with the directory of the current module that's being run (our chat-tutorial in this case). Further this instructs the server to send a file from that folder named **index.html**.

Next we're going to need to restart our application to have it pickup these changes, you can do so by pressing `ctrl`+`c` to end the current process in your terminal. Next we're going to run `node index.js` again.















































~
