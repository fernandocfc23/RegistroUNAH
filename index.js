var express = require("express");
var app = express();
var mysql = require("mysql");
var fs = require("fs");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(express.static("public"));
app.use(cookieParser());

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

var conexion = mysql.createConnection({
	user:"root",
	host:"localhost",
	password:"",
	database:"registro"
});

app.post("/agregar-alumno", function(peticion, respuesta){
	conexion.query(
		"INSERT INTO alumno(numeroCuenta, nombreAlumno, contrasena, idcarrera) "+
		"VALUES (?,?,?,?)", 
		[
			peticion.body.numeroCuenta,
			peticion.body.nombreAlumno,
			peticion.body.contrasenaAlumno,
			peticion.body.carreraAlumno,
		],
		function(error, resultado){		
				respuesta.send("Alumno agregado");	

		});
});


app.get("/historial",function(peticion, respuesta){
	conexion.query("SELECT * FROM HISTORIAL", function(error, informacion, campos){
		respuesta.send(informacion);
	});
});

app.post("/comprobar-alumno",function(peticion, respuesta){
	conexion.query(
			"SELECT * FROM ALUMNO "+
			"WHERE (NUMEROCUENTA = ?) AND (CONTRASENA = ?) ",
			[
					peticion.body.numeroCuenta,
					peticion.body.contrasenaAlumno,
			],
			function(err, filas, campos){
				if (err) throw err;
				respuesta.send(filas);
			}
		);
});


app.listen(3000);