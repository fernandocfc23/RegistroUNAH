$(document).ready(function(){
	$('#tablaHistorial').DataTable( {
	    ajax: {
	        url: '/historial',
	        dataSrc: ''
	    },
    "columns": [
        { "data": "codigoHistorial" },
        { "data": "codigoAlumno" },
        { "data": "codigoSeccion" },
        { "data": "codigoPeriodo" },
        { "data": "promedio" }    ]
	} );
});


