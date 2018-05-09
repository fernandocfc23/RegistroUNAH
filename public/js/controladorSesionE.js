$(document).ready(function(){
	$.ajax({
		url:"/cargar-num",
		method:"POST",
		success:function(respuesta){
			if(respuesta.length==0){
				location.href = "../index.html";
			}
			else(respuesta.length==1)	
			{
				var contenido;
				contenido="Docente: "+respuesta[0].NOMBRE+ " " +respuesta[0].APELLIDO +
				" <br>Número de empleado: "+respuesta[0].NUMERO_EMPLEADO;
				$("#mensajeSesion").append(contenido);
			}
		}
	});

});