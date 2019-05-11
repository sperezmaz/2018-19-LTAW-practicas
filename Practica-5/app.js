function main() {
  console.log("Hola!!!!-------------")
  var person = "Electron";
  //-- Crear el websocket
  const io = require('socket.io-client');
  const socket = io('http://localhost:3000');

  //-- Obtener los elementos de interfaz:

  //-- Boton de envio de mensaje
  var send = document.getElementById('send')

  //-- Parrafo para mostrar mensajes recibidos
  var display = document.getElementById('display')

  //-- Caja con el mensaje a enviar
  var msg = document.getElementById("msg")
  var msgs = "";
  //-- Cuando se aprieta el botón de enviar...
  send.onclick = () => {

    //-- Enviar el mensaje, con el evento "new_message"
    socket.emit('new_message', person + ": " + msg.value);
    msg.value = "";

    //-- Lo notificamos en la consola del navegador
    console.log("Mensaje emitido")
  }
  //-- Cuando se reciba un mensaje del servidor se muestra
  //-- en el párrafo
  socket.on('new_message', msg => {
    msgs = msgs + "</br>" + msg
    display.innerHTML = msgs;
  });

}
