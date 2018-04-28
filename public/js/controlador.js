function guardarRegistro(){
	var parametros = 
	"numeroCuenta=" +$("#numeroCuenta").val()+ "&"+
	"nombreAlumno=" +$("#nombreAlumno").val()+ "&"+
	"contrasenaAlumno=" +$("#contrasenaAlumno").val()+ "&"+
	"carreraAlumno=" +$("#carreraAlumno").val();
	$.ajax({
		url:"/agregar-alumno",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			console.log("El servidor responde con esto: ");
			console.log(respuesta);
		}
	});
}

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
				var contenido;
				contenido="<span>error</span>"
				$("#mensaje").append(contenido);
			}
			if(respuesta.length==1)	
			{
		    	location.href = "../pregrado.html";
			}
		}
	});

});
