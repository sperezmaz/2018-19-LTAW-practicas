var http = require('http');
var url = require('url');
var fs = require('fs');
var link = [];
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
            "js":      "application/javascript",
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

  //-- Leer las cookies
  var cookie = req.headers.cookie;
  console.log("Cookie: " + cookie)

  var compra = q.pathname.includes("Compra");

  if(!cookie){
      var ingresado = false;
  }else{
      if(cookie.includes('carro') == true && cookie.includes('user') == true){
          var ingresado = true;
      }else{
          var ingresado = false;
      }
  }

  //-- Obtener el fichero. Si es "/" se toma index.html
  //-- Poner el "." delante para que sean un fichero del directorio actual
  var filename = ""

  if (q.pathname == "/"){
    filename += "/index.html"
  }else if (q.pathname.includes("Compra") && ingresado) {
    producto = q.pathname.split("/Compra-");
    producto = producto[1].split(".html");
    producto = producto[0];
    restoproductos = cookie.split(";");
    restoproductos = restoproductos[1].split("=");
    restoproductos = restoproductos[1];

    if (!restoproductos){
      res.setHeader('Set-Cookie', 'carro=' + producto)
    }else{
      res.setHeader('Set-Cookie', 'carro=' + restoproductos + '&' + producto)
    }

    filename += "/" + producto + ".html"

  }else if (q.pathname.includes("Compra") && (ingresado == false) || (q.pathname == "/myform") && (ingresado == false)) {
    filename += "/aviso.html"
  }else if (q.pathname == "/myform") {
    if (req.method === 'POST') {
        // Handle post info...
       productos_carro = cookie.split("carro=")
       productos_carro = productos_carro[1].split("&")
       var content = `
       <!DOCTYPE html>
       <html lang="es" dir="ltr">
         <head>
           <meta charset="utf-8"></meta>
           <title>Tienda_Tecnológica</title>
           <link rel="stylesheet" href="css/micss.css">
         </head>

         <body>
           <div class="header">
             <header>
               <h1>TIENDA DE TECNOLOGÍA</h1>
             </header>
           </div>

           <ul class="tabla_navegacion">
              <li><a href="index.html">Portada</a></li>
           </ul>
           <h2>CARRITO</h2>
           <p>PRODUCTOS:</p>
           <ul style="list-style-type: disc; padding-left: 100px;">`
       for (i=0;i<productos_carro.length;i++){
         content += `<li>` + productos_carro[i] + `</li>`

       }

        req.on('data', chunk => {
            //-- Leer los datos (convertir el buffer a cadena)
            data = chunk.toString();
            data = data.split("&")
            //-- Añadir los datos a la respuesta
            content += `</ul>
            <br><p>DATOS USUARIO:</p>
            <ul style="list-style-type: disc; padding-left: 100px;">`
            for (i=0;i<data.length;i++){
              content += `<li>` + data[i] + `</li>`

            }
            content += `</ul>
              </body>
            </html>`;

            //-- Mostrar los datos en la consola del servidor
            console.log("Datos recibidos: " + data)
            res.statusCode = 200;
         });

         req.on('end', ()=> {
           //-- Generar el mensaje de respuesta
           res.setHeader('Content-Type', 'text/html')
           res.write(content);
           res.end();
         })
         return
    }
  }else if (q.pathname == "/bienvenido.html") {
    res.setHeader('Set-Cookie', ['user=comprador1', 'carro=']);
    filename += "/bienvenido.html"
  }else if (q.pathname == "/search"){
    var body = [];
    req.on('data', function(chunk) {
      body.push(chunk);
    });
    req.on('end', function() {
      body = Buffer.concat(body).toString();
      fs.readFile("sugerencias.json",function(error,data){
        data = JSON.parse(data)
        data = JSON.stringify(data);
        res.setHeader('Content-Type','application/json');
        res.write(data);
        res.end();
      });
    });
    return
  }else if (q.pathname == "/url") {
    if (req.method === 'POST') {
        // Handle post info...

        var content = `
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="utf-8">
            <title>FORM 1</title>
          </head>
          <body>
            <p>Recibido: `

        req.on('data', chunk => {
            //-- Leer los datos (convertir el buffer a cadena)
            data = chunk.toString();

            //-- Añadir los datos a la respuesta
            content += data;
            link = data.split("=");

            //-- Fin del mensaje. Enlace al formulario
            content += `
                </p>
                <a href="/` + link[1] + `.html">` + link[1] + `</a>
              </body>
            </html>`

            //-- Mostrar los datos en la consola del servidor
            console.log("Datos recibidos: " + data)
            res.statusCode = 200;
         });

         req.on('end', ()=> {
           //-- Generar el mensaje de respuesta
           res.setHeader('Content-Type', 'text/html')
           res.write(content);
           res.end();
         })
         return
    }
  }else {
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
