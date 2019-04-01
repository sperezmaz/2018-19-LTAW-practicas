var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usuarios = 0;
var respuesta = "";
//--Servir la pagina principal
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  console.log("Página principal: /")
});

//-- Servir el cliente javascript
app.get('/chat-client.js', function(req, res){
  res.sendFile(__dirname + '/chat-client.js');
  console.log("Fichero js solicituado")
});

//-- Lanzar el servidor
http.listen(3000, function(){
  console.log('listening on *:3000');
});


//-- Evento: Nueva conexion recibida
//-- Un nuevo cliente se ha conectado!
io.on('connection', function(socket){
  console.log('--> Usuario conectado!');

  usuarios = usuarios + 1;

  socket.emit('new_message', "<p> Servidor: Bienvenido amigo! :)</p>");
  io.emit('new_message', "<p> Servidor: Se ha conectado el usuario" + usuarios + "</p>");

  //-- Detectar si el usuario se ha desconectado
  socket.on('disconnect', function(){
    console.log('--> Usuario Desconectado');
    usuarios = usuarios - 1;
    io.emit('new_message', "<p> Servidor: Un miembro ha abandonado :( </p>");
  });
  io.emit('new_message', "<h2> MENSAJES: </h2>");


  //-- Detectar si se ha recibido un mensaje del cliente
  socket.on('new_message', msg => {

    if (msg == '/help'){
      console.log("El usuario ha seleccionado: /help")

      respuesta = "<h4>COMANDOS SOPORTADOS:</h4>" +
      "<ul>" +
      "<li>/help</li>" +
      "<li>/list</li>" +
      "<li>/hello</li>" +
      "<li>/date</li>" +
      "</ul>"

      //-- Emitir un mensaje a todos los clientes conectados
      io.emit('new_message', respuesta);

    }else if(msg == '/list'){
      console.log("El usuario ha seleccionado /list")

      respuesta = "<p>Servidor: Número de usuarios conectados--> " + usuarios +
                  "</p>";

      //-- Emitir un mensaje a todos los clientes conectados
      io.emit('new_message', respuesta);

    }else if(msg == '/hello'){
      console.log("El usuario ha seleccionado /hello")

      respuesta = "<p>Servidor: Hola amigo 	(´◔ ω◔`) ノシ </p>"
      io.emit('new_message', respuesta);

    }else if(msg == '/date'){
      console.log("El usuario ha seleccionado /date")

      var d = new Date();
      respuesta = "<p> Servidor: Fecha--> " + d.getDate() + '/' + d.getMonth() +
        '/' + d.getFullYear() + " - " + d.getHours() + ':' + d.getMinutes()	+
        ':' + d.getSeconds() + "</p>";

      //-- Emitir un mensaje a todos los clientes conectados
      io.emit('new_message', respuesta);

    }else{
      //-- Notificarlo en la consola del servidor
      console.log("Mensaje recibido: " + msg)

      //-- Emitir un mensaje a todos los clientes conectados
      io.emit('new_message', msg);
    }
  })
});
