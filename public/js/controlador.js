$(document).ready(function(){
	$('#datetimepicker1').datetimepicker();
	$('#datetimepicker2').datetimepicker();
	cargarCiudad();
	cargarCarrera();
});

$("#btnMostrarA").click(function () {
	$("#estudiante").fadeIn(100);
	$("#empleado").hide();
})

$("#btnMostrarE").click(function () {
	$("#estudiante").hide();
	$("#empleado").fadeIn(100);
	cargarFacultad();
})

function cargarCarrera(){
	$.ajax({
		url:"/cargar-carreras",
		method:"POST",
		success:function(respuesta){
			var contenido="<label for='carrera'>Carrera</label><select id='carrera' class='form-control'><option selected>Seleccionar...</option>";
			for (var i = 0; i < respuesta.length; i++) {
             	contenido= contenido +"<option value='"+respuesta[i].CODIGO_CARRERA +"'>"+respuesta[i].NOMBRE_CARRERA +"</option>"
			};
			contenido = contenido + "</select>";
			$("#carreras").html(contenido);
		}
	});
}

function cargarFacultad(){
	$.ajax({
		url:"/cargar-facultades",
		method:"POST",
		success:function(respuesta){
			var contenido="<label for='facultad'>Facultad</label><select id='facultad' class='form-control'><option selected>Seleccionar...</option>";
			for (var i = 0; i < respuesta.length; i++) {
             	contenido= contenido +"<option value='"+respuesta[i].CODIGO_FACULTAD +"'>"+respuesta[i].NOMBRE_FACULTAD +"</option>"
			};
			contenido = contenido + "</select>";
			$("#facultades").html(contenido);
		}
	});
}

function cargarCiudad(){
		$.ajax({
		url:"/cargar-ciudades",
		method:"POST",
		success:function(respuesta){
			var contenido="<label for='ciudad'>Ciudad</label><select id='ciudad' class='form-control'><option selected>Seleccionar...</option>";
			for (var i = 0; i < respuesta.length; i++) {
             	contenido= contenido +"<option value='"+respuesta[i].CODIGO_CIUDAD +"'>"+respuesta[i].CIUDAD +"</option>"
			};
			contenido = contenido + "</select>";
			$("#ciudades").append(contenido);
		}
	});
}

function cargarRequisitos(){
	var a="";
	$("select option:selected").each(function() {
		a = $(this).val();
    });
    var parametros = "codigoCarrera="+a;
    $.ajax({
		url:"/cargar-asignaturas",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			var contenido="<label for='requisito'>Requisito</label><select id='requisito' class='form-control'>";
            contenido= contenido +"<option value='0'>NINGUNO</option>"
			for (var i = 0; i < respuesta.length; i++) {
             	contenido= contenido +"<option value='"+respuesta[i].CODIGO_ASIGNATURA +"'>"+respuesta[i].NOMBRE_ASIGNATURA +"</option>"
			};
			contenido = contenido + "</select>";
			$("#requisitos").html(contenido);
		}
	});

}

function cargarAsignaturas(){
	var a="";
	$("select option:selected").each(function() {
		a = $(this).val();
    });
    var parametros = "codigoCarrera="+a;
    $.ajax({
		url:"/cargar-asignaturas",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			var contenido="<label for='asignatura'>Asignatura</label><select id='asignatura' class='form-control'><option selected>Seleccionar...</option>";
			for (var i = 0; i < respuesta.length; i++) {
             	contenido= contenido +"<option value='"+respuesta[i].CODIGO_ASIGNATURA +"'>"+respuesta[i].NOMBRE_ASIGNATURA +"</option>"
			};
			contenido = contenido + "</select>";
			$("#asignaturas").html(contenido);
		}
	});
}

function cargarDocentes(){
	var a="";
	$("select option:selected").each(function() {
		a = $(this).val();
    });
    var parametros = "codigoCarrera="+a;
    $.ajax({
		url:"/cargar-docentes",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			var contenido="<label for='asignatura'>Docente</label><select id='docente' class='form-control'><option selected>Seleccionar...</option>";
			for (var i = 0; i < respuesta.length; i++) {
             	contenido= contenido +"<option value='"+respuesta[i].CODIGO_EMPLEADO +"'>"+respuesta[i].NOMBRE +" "+respuesta[i].APELLIDO+"</option>"
			};
			contenido = contenido + "</select>";
			$("#docentes").html(contenido);
		}
	});
	cargarAula();

}

function cargarAula(){
	$.ajax({
		url:"/cargar-aulas",
		method:"POST",
		success:function(respuesta){
			var contenido="<label for='aula'>Aula</label><select id='aula' class='form-control'><option selected>Seleccionar...</option>";
			for (var i = 0; i < respuesta.length; i++) {
             	contenido= contenido +"<option value='"+respuesta[i].CODIGO_AULA +"'>"+respuesta[i].ALIAS_EDIFICIO+"-"+respuesta[i].NUMERO_AULA +"</option>"
			};
			contenido = contenido + "</select>";
			$("#aulas").html(contenido);
		}
	});
}


$("#tipoEmpleado").change(function () {
    $("select option:selected").each(function() {
      var tipoEmp= $(this).text();
      if(tipoEmp=="Administrador"){
      	$("#facultad").prop( "disabled", true );
      	$("#facultad").val('10');
      }
      if(tipoEmp=="Docente" || tipoEmp=="Jefe de carrera")
      {
      	$("#facultad").prop( "disabled", false );
      }
    });
});

$("#carreras").change(function () {
	$("#div1").fadeIn(100);
	$("#div2").fadeIn(100);
	cargarRequisitos();
	cargarAsignaturas();
	cargarDocentes();
});

$("#tipoEmpleado").change(function () {
    $("select option:selected").each(function() {
      var tipoEmp= $(this).text();
      if(tipoEmp=="Administrador"){
      	$("#facultad").prop( "disabled", true );
      	$("#facultad").val('10');
      }
      if(tipoEmp=="Docente" || tipoEmp=="Jefe de carrera")
      {
      	$("#facultad").prop( "disabled", false );
      }
    });
});


$("#btnAgregarA").click(function () {
	var parametros =
	"nombre=" +$("#nombre").val()+ "&"+
	"apellido=" +$("#apellido").val()+ "&"+
	"identificacion=" +$("#identificacion").val()+ "&"+
	"tipoIdentificacion=" +$("#tipoIdentificacion").val()+ "&"+
	"genero=" +$("#genero").val()+ "&"+
	"ciudad=" +$("#ciudad").val()+ "&"+
	"correo=" +$("#correo").val()+ "&"+
	"direccion=" +$("#direccion").val()+ "&"+
	"numeroTelefono=" +$("#numeroTelefono").val()+ "&"+
	"numeroCuenta=" +$("#numeroCuenta").val()+ "&"+
	"carrera=" +$("#carrera").val()+ "&"+
	"fechaNacimiento=" +$("#fechaNacimiento").val()+ "&"+
	"contraseñaAlumno=" +$("#contraseñaAlumno").val();
	$.ajax({
		url:"/agregar-alumno",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			alert("Alumno agregado exitosamente");
			location.href="../agregar.html";
		}	
	});		
});

$("#btnAgregarE").click(function () {
	var parametros =
	"nombre=" +$("#nombre").val()+ "&"+
	"apellido=" +$("#apellido").val()+ "&"+
	"identificacion=" +$("#identificacion").val()+ "&"+
	"tipoIdentificacion=" +$("#tipoIdentificacion").val()+ "&"+
	"genero=" +$("#genero").val()+ "&"+
	"ciudad=" +$("#ciudad").val()+ "&"+
	"correo=" +$("#correo").val()+ "&"+
	"direccion=" +$("#direccion").val()+ "&"+
	"numeroTelefono=" +$("#numeroTelefono").val()+ "&"+
	"fechaNacimiento=" +$("#fechaNacimiento").val()+ "&"+
	"numeroEmpleado=" +$("#numeroEmpleado").val()+ "&"+
	"tipoEmpleado=" +$("#tipoEmpleado").val()+ "&"+
	"facultad=" +$("#facultad").val()+ "&"+
	"sueldoBase=" +$("#sueldoBase").val()+ "&"+
	"contraseñaEmpleado=" +$("#contraseñaEmpleado").val();
	$.ajax({
		url:"/agregar-empleado",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			alert("Empleado agregado exitosamente");
			location.href="../agregar.html";
		}	
	});		
});


$("#btnIngresarA").click(function(){	
	var parametros =
	"numeroCuenta=" +$("#numeroCuenta").val()+ "&"+
	"contrasenaAlumno=" +$("#contrasenaAlumno").val();
	$.ajax({
		url:"/comprobar-alumno",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			if(respuesta.length==1)	
			{
		    	location.href = "../pregrado.html";
			}
		}
	});

});

$("#btnIngresarE").click(function(){	
	var parametros =
	"numeroEmpleado=" +$("#numeroEmpleado").val()+ "&"+
	"contrasena=" +$("#contrasena").val();
	$.ajax({
		url:"/comprobar-empleado",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			if(respuesta.length==1)	
			{
		    	location.href = "../paneldoc.html";
			}
		}
	});

});


$("#btnIngresarAdmin").click(function(){	
	var parametros =
	"numeroEmpleado=" +$("#numeroAdministrador").val()+ "&"+
	"contrasena=" +$("#contraseñaAdministrador").val();
	$.ajax({
		url:"/comprobar-empleado",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			if(respuesta.length==1 && respuesta[0].CODIGO_TIPO_EMPLEADO==3)	
			{
		    	window.location.href = "paneladmin.html";
			}
		}
	});	
});

$("#btnAgregarAsignatura").click(function(){	
	var parametros =
	"nombreAsignatura=" +$("#nombreAsignatura").val()+ "&"+
	"cantidadUV=" +$("#cantidadUV").val()+ "&"+
	"dias=" +$("#dias").val()+ "&"+
	"carrera=" +$("#carrera").val()+ "&"+
	"requisito=" +$("#requisito").val();
		$.ajax({
		url:"/agregar-asignatura",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			alert("Asignatura agregada exitosamente");
			location.href="../asignaturas.html";
		}
	});

});

$("#btnAgregarPeriodo").click(function(){	
	var parametros =
	"nombrePeriodo=" +$("#nombrePeriodo").val()+ "&"+
	"fechaInicio=" +$("#fechaInicio").val()+ "&"+
	"fechaFin=" +$("#fechaFin").val();
		$.ajax({
		url:"/agregar-periodo",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			alert("Período agregado exitosamente");
			location.href="../periodo.html";
		}
	});

});

$("#btnAgregarSeccion").click(function () {
	var parametros =
	"carrera=" +$("#carreras").val()+ "&"+
	"asignatura=" +$("#asignatura").val()+ "&"+
	"docente=" +$("#docente").val()+ "&"+
	"horaInicio=" +$("#horaInicio").val()+ "&"+
	"horaFin=" +$("#horaFin").val()+ "&"+
	"aula=" +$("#aula").val()+ "&"+
	"cantidadCupos=" +$("#cantidadCupos").val();
	$.ajax({
		url:"/agregar-seccion",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			alert("Sección agregada exitosamente");
			location.href="../secciones.html";
		}	
	});		
});
