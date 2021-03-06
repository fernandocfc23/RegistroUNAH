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
    	if(peticion.cookies.codigoTipoEmpleado){
		    if (peticion.cookies.codigoTipoEmpleado==3){
		            publicAdmin(peticion,respuesta,next);
		    }
    	}
        else if (peticion.cookies.codigoAlumno){
            publicAlumno(peticion,respuesta,next);
        }
        else
            return next();
    }
);

function verificarAutenticacionAdmin(peticion, respuesta, next){
	if(peticion.cookies.codigoTipoEmpleado==3)
		return next();
	else
	    respuesta.send("<center><h2>Para ingresar a esta página debes iniciar sesión</h2><br><img src='img/error.jpg'></center>");
}

function verificarAutenticacion(peticion, respuesta, next){
	if(peticion.cookies.codigoAlumno)
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

app.post("/agregar-periodo", function(peticion, respuesta){
	conexion.query(
		"INSERT INTO TBL_PERIODOS(CODIGO_PERIODO, NOMBRE_PERIODO, FECHA_INICIO, FECHA_FIN, ACTIVO) "+
		"VALUES (null,?,?,?,?)", 
		[
			peticion.body.nombrePeriodo,
			peticion.body.fechaInicio,
			peticion.body.fechaFin,
			"1",
		],
		function(error, resultado){
			if (resultado.affectedRows==1){
				conexion.query(
					"UPDATE TBL_PERIODOS SET ACTIVO = 0 WHERE (CODIGO_PERIODO!= ?);", 
					[
					resultado.insertId,
					],
					function(errorSelect, informacion, campos){
						respuesta.send(informacion);		
					}
				);
			}
			
		});
});

app.post("/agregar-seccion", function(peticion, respuesta){
		conexion.query(
		"SELECT CODIGO_PERIODO FROM TBL_PERIODOS WHERE ACTIVO=1", 
		[],
		function(error, resultado){
			if (resultado.length==1){
			conexion.query(
				"INSERT INTO TBL_SECCION(CODIGO_SECCION, CODIGO_PERIODO, CODIGO_ASIGNATURA, HORA_INICIO, "+
				 "HORA_FIN, CANTIDAD_CUPOS, CODIGO_AULA, CODIGO_EMPLEADO) "+
				"VALUES (null,?,?,?,?,?,?,?)", 
					[
						resultado[0].CODIGO_PERIODO,
						peticion.body.asignatura,
						peticion.body.horaInicio,
						peticion.body.horaFin,
						peticion.body.cantidadCupos,
						peticion.body.aula, 
						peticion.body.docente,
					],
					function(errorSelect, informacion, campos){
						if(errorSelect) throw errorSelect;
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

app.get("/forma",function(peticion, respuesta){
	conexion.query("SELECT E.NOMBRE_ASIGNATURA, A.HORA_INICIO, A.HORA_FIN, C.ALIAS_EDIFICIO, D.NUMERO_AULA " +
					"FROM TBL_SECCION A, TBL_MATRICULA B, TBL_EDIFICIOS C, TBL_AULAS D, TBL_ASIGNATURAS E, TBL_ALUMNOS F "+
					"WHERE E.CODIGO_ASIGNATURA=A.CODIGO_ASIGNATURA AND B.CODIGO_SECCION=A.CODIGO_SECCION AND "+
					"A.CODIGO_AULA=D.CODIGO_AULA AND D.CODIGO_EDIFICIO=C.CODIGO_EDIFICIO AND B.CODIGO_ALUMNO=F.CODIGO_ALUMNO AND F.CODIGO_ALUMNO=? ", 
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

app.post("/cargar-asignaturas",function(peticion, respuesta){
	conexion.query("SELECT * FROM TBL_ASIGNATURAS WHERE CODIGO_CARRERA=?",	
					[
						peticion.body.codigoCarrera,
					],
					function(err, informacion, campos){
						if (err) throw err;
						respuesta.send(informacion);
	});
});

app.post("/cargar-docentes",function(peticion, respuesta){
	conexion.query("SELECT A.CODIGO_EMPLEADO, B.NOMBRE,B.APELLIDO FROM TBL_EMPLEADOS A, TBL_PERSONAS B, TBL_CARRERA C, TBL_FACULTADES D "+
					"WHERE A.CODIGO_EMPLEADO=B.CODIGO_PERSONA AND A.CODIGO_FACULTAD=D.CODIGO_FACULTAD AND "+
					"C.CODIGO_FACULTAD=D.CODIGO_FACULTAD AND CODIGO_CARRERA=?",	
					[
						peticion.body.codigoCarrera,
					],
					function(err, informacion, campos){
						if (err) throw err;
						respuesta.send(informacion);
	});
});

app.post("/cargar-aulas",function(peticion, respuesta){
	conexion.query("SELECT A.CODIGO_AULA, A.NUMERO_AULA, B.ALIAS_EDIFICIO FROM TBL_AULAS A, TBL_EDIFICIOS B " +
					"WHERE A.CODIGO_EDIFICIO=B.CODIGO_EDIFICIO",	
					[],
					function(err, informacion, campos){
						if (err) throw err;
						respuesta.send(informacion);
	});
});

app.post("/cargar-secciones",function(peticion, respuesta){
	conexion.query("SELECT * FROM TBL_SECCION WHERE CODIGO_ASIGNATURA=?",	
					[
						peticion.body.codigoAsignatura,
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

app.post("/matricular-clase", function(peticion, respuesta){
			conexion.query(
				"INSERT INTO TBL_MATRICULA(CODIGO_ALUMNO, CODIGO_SECCION, FECHA_MATRICULA) "+
				"VALUES (?,?,sysdate())", 
					[
						peticion.cookies.codigoAlumno,
						peticion.body.codigoSeccion,
					],
					function(errorSelect, informacion, campos){
						if(errorSelect) throw errorSelect;
						respuesta.send(informacion);		
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
app.get("/agregar.html", verificarAutenticacionAdmin,  function(peticion, respuesta){});
app.get("/paneladmin.html", verificarAutenticacionAdmin,  function(peticion, respuesta){});
app.get("/asignaturas.html", verificarAutenticacionAdmin,  function(peticion, respuesta){});
app.get("/periodo.html", verificarAutenticacionAdmin,  function(peticion, respuesta){});
app.get("/secciones.html", verificarAutenticacionAdmin,  function(peticion, respuesta){});


app.listen(3000);