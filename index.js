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

var publicAdmin = express.static("public-admin");
var publicAlumno = express.static("public-alumno");

app.use(
    function(peticion,respuesta,next){
        if (peticion.cookies.codigoTipoEmpleado==3){
            publicAdmin(peticion,respuesta,next);
        }
        else if (peticion.cookies.codigoAlumno){
            publicAlumno(peticion,respuesta,next);
        }
        else
            return next();
    }
);

function verificarAutenticacion(peticion, respuesta, next){
	if(peticion.cookies.codigoTipoEmpleado==3)
		return next();
	else
	    respuesta.send("<center><h2>Para ingresar a esta página debes iniciar sesión</h2><br><img src='img/error.jpg'></center>");
}

app.post("/agregar-alumno", function(peticion, respuesta){
	conexion.query(
		"INSERT INTO TBL_PERSONAS(CODIGO_PERSONA, GENERO, CODIGO_TIPO_IDENTIFICACION, CODIGO_CIUDAD, "+
		"NOMBRE, APELLIDO, FECHA_NACIMIENTO, IDENTIFICACION, DIRECCION, TELEFONO, CORREO_ELECTRONICO) "+
		"VALUES (null,?,?,?,?,?,?,?,?,?,?)", 
		[
			peticion.body.genero,
			peticion.body.tipoIdentificacion,
			peticion.body.ciudad,
			peticion.body.nombre,
			peticion.body.apellido,
			peticion.body.fechaNacimiento,
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
					function(errorSelect, informacion, campos){
						if (errorSelect) throw errorSelect;
						respuesta.send(informacion);		
					}
				);
			}
			
		});
});

app.post("/agregar-empleado", function(peticion, respuesta){
	conexion.query(
		"INSERT INTO TBL_PERSONAS(CODIGO_PERSONA, GENERO, CODIGO_TIPO_IDENTIFICACION, CODIGO_CIUDAD, "+
		"NOMBRE, APELLIDO, FECHA_NACIMIENTO, IDENTIFICACION, DIRECCION, TELEFONO, CORREO_ELECTRONICO) "+
		"VALUES (null,?,?,?,?,?,?,?,?,?,?)", 
		[
			peticion.body.genero,
			peticion.body.tipoIdentificacion,
			peticion.body.ciudad,
			peticion.body.nombre,
			peticion.body.apellido,
			peticion.body.fechaNacimiento,
			peticion.body.identificacion,
			peticion.body.direccion,
			peticion.body.numeroTelefono,
			peticion.body.correo,
		],
		function(error, resultado){
			if (resultado.affectedRows==1){
				conexion.query(
					"INSERT INTO TBL_EMPLEADOS(CODIGO_EMPLEADO, CODIGO_TIPO_EMPLEADO, NUMERO_EMPLEADO, CONTRASEÑA, SUELDO_BASE, CODIGO_FACULTAD)"+
					"VALUES (?,?,?,?,?,?)", 
					[
					resultado.insertId,
					peticion.body.tipoEmpleado,
					peticion.body.numeroEmpleado,
					peticion.body.contraseñaEmpleado,
					peticion.body.sueldoBase,
					peticion.body.facultad,
					],
					function(errorSelect, informacion, campos){
						if (errorSelect) throw errorSelect;
						respuesta.send(informacion);		
					}
				);
			}
			
		});
});

app.post("/agregar-asignatura", function(peticion, respuesta){
	conexion.query(
		"INSERT INTO TBL_ASIGNATURAS(CODIGO_ASIGNATURA, CODIGO_CARRERA, NOMBRE_ASIGNATURA, CANTIDAD_UNIDADES_VALORATIVAS, DIAS) "+
		"VALUES (null,?,?,?,?)", 
		[
			peticion.body.carrera,
			peticion.body.nombreAsignatura,
			peticion.body.cantidadUV,
			peticion.body.dias,
		],
		function(error, resultado){
			if (resultado.affectedRows==1 && peticion.body.requisito >0){
				conexion.query(
					"INSERT INTO TBL_REQUISITOS(CODIGO_ASIGNATURA, CODIGO_ASIGNATURA_REQUISITO, CODIGO_CARRERA)"+
					"VALUES (?,?,?)", 
					[
					resultado.insertId,
					peticion.body.requisito,
					peticion.body.carrera,
					],
					function(errorSelect, informacion, campos){
						respuesta.send(informacion);		
					}
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
	conexion.query("SELECT * FROM TBL_FACULTADES WHERE CODIGO_FACULTAD > 0",	
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

app.post("/cargar-requisitos",function(peticion, respuesta){
	conexion.query("SELECT * FROM TBL_ASIGNATURAS WHERE CODIGO_CARRERA=?",	
					[
						peticion.body.codigoCarrera,
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
					respuesta.cookie("codigoTipoEmpleado",filas[0].CODIGO_TIPO_EMPLEADO,{ maxAge: 900000, httpOnly: true });
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
		respuesta.clearCookie("codigoTipoEmpleado");
		respuesta.redirect('index.html');
});

app.get("/historial.html", verificarAutenticacion,  function(peticion, respuesta){});
app.get("/matricula.html", verificarAutenticacion,  function(peticion, respuesta){});
app.get("/pregrado.html", verificarAutenticacion,  function(peticion, respuesta){});
app.get("/agregar.html", verificarAutenticacion,  function(peticion, respuesta){});
app.get("/paneladmin.html", verificarAutenticacion,  function(peticion, respuesta){});
app.get("/asignaturas.html", verificarAutenticacion,  function(peticion, respuesta){});

app.listen(3000);