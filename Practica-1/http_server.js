var http = require('http');
var url = require('url');
var fs = require('fs');
var tipos = {
            "html":    "text/html",
            "css":		 "text/css",
            "png":     "image/png",
            "jpg":     "image/jpg",
            "mp3":     "audio/mpeg",
            "wma":     "audio/wma",
            "mp4":     "video/mp4",
            "webm":    "video/webm",
            "ogg":     "video/ogg",
            "js":      "text/javascript",
            "txt":     "text/plain",
        };
console.log("Arrancando servidor...")

//-- Configurar y lanzar el servidor. Por cada peticion recibida
//-- se imprime un mensaje en la consola
http.createServer((req, res) => {
  console.log("---> Peticion recibida")
  console.log("Recurso solicitado (URL): " + req.url)
  var q = url.parse(req.url, true);
  console.log("URL parseada: ")
  console.log("Host: " + q.host)
  console.log("pathname:" + q.pathname)

  //-- Obtener el fichero. Si es "/" se toma index.html
  //-- Poner el "." delante para que sean un fichero del directorio actual

  var filename = ""

  if (q.pathname == "/")
    filename += "/index.html"
  else {
    filename = q.pathname
  }

  //-- Obtener el tipo de fichero segun la extension
  var tipo = filename.split(".")[1]

  //-- Obtener el nombre del fichero a partir del recurso solicitado
  //-- Se añade un . delante
  filename = "." + filename

  console.log("Filename: " + filename)
  console.log("Tipo: " + tipo)

  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
    var mime = tipos[tipo];

    if (!mime){
      var mime = "text/html"
    }
    res.writeHead(200, {'Content-Type': mime});
    res.write(data);
    res.end();
  });

}).listen(8888);
