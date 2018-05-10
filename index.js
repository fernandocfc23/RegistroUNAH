var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use(express.static("public"));
app.use(cookieParser());

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

var conexion = mysql.createConnection({
	user:"root",
	host:"localhost",
	password:"",
	database:"DB_UNAH"
});

app.post("/agregar-alumno", function(peticion, respuesta){
	conexion.query(
		"INSERT INTO TBL_PERSONAS(CODIGO_PERSONA, GENERO, CODIGO_TIPO_IDENTIFICACION, CODIGO_CIUDAD, "+
		"NOMBRE, APELLIDO, FECHA_NACIMIENTO, IDENTIFICACION, DIRECCION, TELEFONO, CORREO_ELECTRONICO) "+
		"VALUES (null,?,?,?,?,?,sysdate(),?,?,?,?)", 
		[
			peticion.body.genero,
			peticion.body.tipoIdentificacion,
			peticion.body.ciudad,
			peticion.body.nombre,
			peticion.body.apellido,
			peticion.body.identificacion,
			peticion.body.direccion,
			peticion.body.numeroTelefono,
			peticion.body.correo,
		],
		function(error, resultado){
			if (resultado.affectedRows==1){
				conexion.query(
					"INSERT INTO TBL_ALUMNOS(CODIGO_ALUMNO, NUMERO_CUENTA, CONTRASEÑA, CODIGO_CARRERA)"+
					"VALUES (?,?,?,?)", 
					[
					resultado.insertId,
					peticion.body.numeroCuenta,
					peticion.body.contraseñaAlumno,
					peticion.body.carrera,
					],
				);
			}
			
		});
});


app.get("/historial",function(peticion, respuesta){
	conexion.query("SELECT B.CODIGO_ASIGNATURA, B.NOMBRE_ASIGNATURA, B.CANTIDAD_UNIDADES_VALORATIVAS,"+ 
					"C.HORA_INICIO, E.NOMBRE_PERIODO, D.PROMEDIO "+
					"FROM TBL_ALUMNOS A, tbl_asignaturas B, tbl_seccion C, tbl_historial D, tbl_periodos E "+
					"WHERE A.CODIGO_ALUMNO = D.CODIGO_ALUMNO AND "+
					"B.CODIGO_ASIGNATURA=C.CODIGO_ASIGNATURA AND "+
					"C.CODIGO_SECCION=D.CODIGO_SECCION AND "+
					"C.CODIGO_PERIODO=E.CODIGO_PERIODO AND "+
					"(A.CODIGO_ALUMNO=?)", 
					[
						peticion.cookies.codigoAlumno,
					],
					function(err, informacion, campos){
						if (err) throw err;
						respuesta.send(informacion);
	});
});

app.post("/cargar-ciudades",function(peticion, respuesta){
	conexion.query("SELECT * FROM TBL_CIUDAD",	
					[
					],
					function(err, informacion, campos){
						if (err) throw err;
						respuesta.send(informacion);
	});
});

app.post("/cargar-facultades",function(peticion, respuesta){
	conexion.query("SELECT * FROM TBL_FACULTADES",	
					[
					],
					function(err, informacion, campos){
						if (err) throw err;
						respuesta.send(informacion);
	});
});

app.post("/cargar-carreras",function(peticion, respuesta){
	conexion.query("SELECT * FROM TBL_CARRERA WHERE CODIGO_PRINCIPAL=1",	
					[
					],
					function(err, informacion, campos){
						if (err) throw err;
						respuesta.send(informacion);
	});
});

app.post("/comprobar-alumno",function(peticion, respuesta){
	conexion.query(
			"SELECT * FROM TBL_ALUMNOS "+
			"WHERE (NUMERO_CUENTA = ?) AND (CONTRASEÑA = ?) ",
			[
					peticion.body.numeroCuenta,
					peticion.body.contrasenaAlumno,
			],
			function(err, filas, campos){
				if (err) throw err;
				if(filas.length == 1)
					respuesta.cookie("codigoAlumno",filas[0].CODIGO_ALUMNO,{ maxAge: 900000, httpOnly: true });
				respuesta.send(filas);
			}
	);
});

app.post("/comprobar-empleado",function(peticion, respuesta){
	conexion.query(
			"SELECT * FROM TBL_EMPLEADOS "+
			"WHERE (NUMERO_EMPLEADO = ?) AND (CONTRASEÑA = ?) ",
			[
					peticion.body.numeroEmpleado,
					peticion.body.contrasena,
			],
			function(err, filas, campos){
				if (err) throw err;
				if(filas.length == 1)
					respuesta.cookie("codigoEmpleado",filas[0].NUMERO_EMPLEADO,{ maxAge: 900000, httpOnly: true });
				respuesta.send(filas);
			}
	);
});


app.post("/cargar-id",function(peticion, respuesta){
	conexion.query("SELECT * FROM TBL_ALUMNOS A, TBL_PERSONAS B WHERE A.CODIGO_ALUMNO=B.CODIGO_PERSONA AND (A.CODIGO_ALUMNO = ?)",
		[
			peticion.cookies.codigoAlumno,
		],
		function(err, filas, campos){
			if (err) throw err;
			respuesta.send(filas);
		}
	);
});

app.post("/cargar-num",function(peticion, respuesta){
	conexion.query("SELECT * FROM TBL_EMPLEADOS A, TBL_PERSONAS B WHERE A.CODIGO_EMPLEADO=B.CODIGO_PERSONA AND (A.NUMERO_EMPLEADO = ?)",
		[
			peticion.cookies.codigoEmpleado,
		],
		function(err, filas, campos){
			if (err) throw err;
			respuesta.send(filas);
		}
	);
});

app.post("/logout", function(peticion, respuesta){
		respuesta.clearCookie("codigoAlumno");
		respuesta.redirect('index.html');
});

app.listen(3000);