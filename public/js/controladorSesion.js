$(document).ready(function(){
	$.ajax({
		url:"/cargar-id",
		method:"POST",
		success:function(respuesta){
			if(respuesta.length==0){
				location.href = "../index.html";
			}
			else(respuesta.length==1)	
			{
				var contenido;
				contenido="Alumno: "+respuesta[0].NOMBRE+ " " +respuesta[0].APELLIDO +
				" <br>Número de cuenta: "+respuesta[0].NUMERO_CUENTA;
				$("#mensajeSesion").append(contenido);
			}
		}
	});

});

$("#btnSalir").click(function(){	
	$.ajax({
		url:"/logout",
		method:"POST",
		success:function(respuesta){
			location.href = "../index.html";
		}
	});
});

