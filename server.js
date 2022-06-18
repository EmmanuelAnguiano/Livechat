// server.js
'use strict'
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const session = require('express-session');


let sessionMiddleware = session({
    secret: 'keyUltraSecret',
    resave: true,
    saveUninitialized: true
});

io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next)
});

app.use(sessionMiddleware);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');

let routes = require('./app/routes');
app.use('/', routes)

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.get('/cerrar', function(req){
    req.session.destroy();
});

app.listen(3030, (req, res) => {
    console.log('Escuchando por el puerto 3030');
})