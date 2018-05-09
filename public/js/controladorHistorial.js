$(document).ready(function(){
	$('#tablaHistorial').DataTable( {
	    ajax: {
	        url: '/historial',
	        dataSrc: ''
	    },
    "columns": [
        { "data": "CODIGO_ASIGNATURA" },
        { "data": "NOMBRE_ASIGNATURA" },
        { "data": "CANTIDAD_UNIDADES_VALORATIVAS" },
        { "data": "HORA_INICIO" },
        { "data": "NOMBRE_PERIODO" },
        { "data": "PROMEDIO" }    ]
	} );
});


