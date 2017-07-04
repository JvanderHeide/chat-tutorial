# Chat application tutorial
## Introduction
Repo for a chat application tutorial
TODO: explain HTTP, JS, Node.js, NPM, express, socket.io

For the back-end we're going to use [Express](https://expressjs.com/) & [Socket.io](https://socket.io/)

## Getting started
Create a project folder in a place to your liking.
Open terminal and run `npm init` to initialize NPM and follow the instructions, this will create a **package.json** file, that will contain a little information about our project and it's dependencies.

## Setting up a web server
First we're going to install [express](https://expressjs.com/) to make sure express is installed every time we install our project later on, we're going to use `npm install --save express`, the `--save` flag makes sure our dependencies are saved to our **package.json** file.
Our **package.json** should now contain the following:

``` javascript
"dependencies": {
    "express": "^4.15.3"
}
```
Now in our **package.json** file we've set our main file to be **index.js**, now we need to create it as this is the file that we will run to start our project.

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
First we've declared a constant (`const`) named 'app' and *required* express and made sure it's initialized.
Then we've declared a constant named 'http' to require the built-in node.js http server and pass it the express app.
Next app will handle all *get* requests that start with "/" and the following function will handle the callbacks,
in this case we're only using the response (`res`) argument and sending back a string of HTML.
Finally the http server is instructed to listen on port 3000.

Now we're heading back to our terminal and we're going to run `node index.js`, this will instruct Node.js to execute our **index.js**.
Now you should see `listening on *:3000` in your terminal. Now open your browser and visit [localhost:3000](http://localhost:3000), where you will now see a title saying "**Hello World**".
