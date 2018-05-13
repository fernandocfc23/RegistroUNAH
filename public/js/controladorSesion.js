$(document).ready(function(){
	cargarAsignaturas();
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

function cargarForma(){
		$('#tablaForma').DataTable( {
	    ajax: {
	        url: '/forma',
	        dataSrc: ''
	    },
    "columns":  [
        { "data": "NOMBRE_ASIGNATURA" },
        { "data": "HORA_INICIO" },
        { "data": "HORA_FIN" },
        { "data": "ALIAS_EDIFICIO" },
        { "data": "NUMERO_AULA" } ]
	} );
}

function cargarAsignaturas(){
    var parametros = "codigoCarrera=1";
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

$("#asignaturas").change(function () {
	$("select option:selected").each(function() {
		a = $(this).val();
    });
    var parametros = "codigoAsignatura="+a;
    $.ajax({
		url:"/cargar-secciones",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			var contenido="<label for='secciones'>Secciones</label><select id='seccion' class='form-control'>";
			for (var i = 0; i < respuesta.length; i++) {
             	contenido= contenido +"<option value='"+respuesta[i].CODIGO_SECCION +"'>"+respuesta[i].HORA_INICIO +"</option>"
			};
			contenido = contenido + "</select>";
			$("#secciones").html(contenido);
		}
	});
});


$("#btnMatricular").click(function(){	
	var parametros ="codigoSeccion=" +$("#seccion").val();
		$.ajax({
		url:"/matricular-clase",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			alert("Asignatura matriculada exitosamente");
		}
	});

});

$("#btnFormaVer").click(function(){	
	cargarForma();
	$("#forma003").fadeIn(100);
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

