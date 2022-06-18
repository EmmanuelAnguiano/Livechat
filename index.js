const express = require('express');
const app = new express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
let db = require("./db/mysql");

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const nameBot = "BotChat";

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
app.use('/', routes);


io.on('connection', (socket) => {
	console.log('Chat conectado...');
	let req = socket.request;
    let { username, userid, correo } = req.session;

	  socket.on('chat message', msg => {
	    io.emit('chat message', msg);
	  });

	  socket.on('salaActiva', function(data){
			const idSala = data.idSala,
			nombreSala = data.nombreSala;

			if(!req.session.roomName){
				socket.join(req.session.roomName);
				console.log('Bienvenido a la sala: ' + data.nombreSala);
			}else{
				socket.leave(req.session.roomName);
				socket.join(req.session.roomName);
				console.log('Cambio de sala de '+ req.session.roomName +' a: ' + data.nombreSala);
			}

			

			req.session.roomID = idSala;
			req.session.roomName = nombreSala;
			
			bottxt('cambioSala');

		});

	  socket.on('mjsNuevo', function(data){ // Función para crear el mensaje nuevo.
		
			db.query("INSERT INTO mensajes(`idsala`, `idusuario`, `mensaje`, `fecha`) VALUES(?, ?, ?, CURDATE())", [req.session.roomID, req.session.userid, data ], function(err, result){
			  if(!!err)
			  throw err;

			  console.log('Mensaje dado de alta correctamente!.');
			  console.log(req.session);
			  
			  		socket.broadcast.to(req.session.roomName).emit('mensaje', {
						usuario: req.session.username,
						mensaje: data
					});

					socket.emit('mensaje', {
						usuario: req.session.username,
						mensaje: data
					});
			});
		
	});

	  function bottxt(data){
		entroSala = 'Bienvenido a la sala ' + req.session.roomName;
		cambioSala =  'Cambiaste de sala a ' + req.session.roomName;
		sefue =  'El usuario ' + req.session.Username + 'ha salido de la sala.'

		if(data == "entroSala"){
			socket.emit('mensaje',{
				usuario: nameBot,
				mensaje: entroSala
			});
		}

		if(data == "cambioSala"){
			socket.emit('mensaje',{
				usuario: nameBot,
				mensaje: cambioSala
			});
		}

		if(data == "salioUsuario"){
			socket.emit('mensaje',{
				usuario: nameBot,
				mensaje: sefue
			});
		}
	}
});

app.get('/cerrar', function(req){
    req.session.destroy();
});

http.listen(port, () => {
  console.log(`Socket.IO funcionando en: http://localhost:${port}/`);
});
