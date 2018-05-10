$(document).ready(function(){
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
});

$("#btnMostrarA").click(function () {
	$("#estudiante").fadeIn(100);
	$("#empleado").hide();
	cargarCarrera();
})

$("#btnMostrarE").click(function () {
	$("#estudiante").hide();
	$("#empleado").fadeIn(100);
	cargarFacultad();
})

function cargarFacultad(){
	$.ajax({
		url:"/cargar-facultades",
		method:"POST",
		success:function(respuesta){
			var contenido="<label for='facultad'>Facultad</label><select id='facultad' class='form-control'><option selected>Seleccionar...</option>";
			for (var i = 0; i < respuesta.length; i++) {
             	contenido= contenido +"<option value='"+respuesta[i].CODIGO_FACULTADO +"'>"+respuesta[i].NOMBRE_FACULTAD +"</option>"
			};
			contenido = contenido + "</select>";
			$("#facultades").html(contenido);
		}
	});
}

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
	"contraseñaAlumno=" +$("#contraseñaAlumno").val();+
	$.ajax({
		url:"/agregar-alumno",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			alert("Persona agregada exitosamente");
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
			if(respuesta.length==0)	
			{
			}
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
			if(respuesta.length==0)	
			{
				var contenido;
				contenido="<span>error</span>"
				$("#mensaje").append(contenido);
			}
			if(respuesta.length==1)	
			{
		    	location.href = "../paneldoc.html";
			}
		}
	});

});

