var express = require("express");
var app = express();

app.use(express.static("public"));

app.get("/procesar", function(peticion, respuesta){
	respuesta.send("Esta es la pagina ingresar");
});

app.listen(3000);