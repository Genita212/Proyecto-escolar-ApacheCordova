function cambiom(){
  $('#modulo').on('click', function(){
    $('#content').attr('src', 'tablaModulo.html');
  });
  $('#asignProf').on('click', function(){
    $('#content').attr('src', 'AsigModul2Prof.html');
  });
  $('#ediProf').on('click', function(){
    $('#content').attr('src', 'tablaAsiModul2Prof.html');
  });


}



//datos de la base
$(document).ready(function () {
	var firebaseConfig = {
	    apiKey: "AIzaSyA_qJSiFWualjsxTQbfhtR5fdFs89R8Gbo",
	    authDomain: "sistemaescolar-4f39c.firebaseapp.com",
	    databaseURL: "https://sistemaescolar-4f39c-default-rtdb.firebaseio.com",
	    projectId: "sistemaescolar-4f39c",
	    storageBucket: "sistemaescolar-4f39c.appspot.com",
	    messagingSenderId: "462338497783",
	    appId: "1:462338497783:web:3ca124e0234e47fe6407f2"
	};
	  // Initialize Firebase
	firebase.initializeApp(firebaseConfig);

	//Agrega año y grupo a la base de datos
	$(function(){
	    var app=firebase.database();
	    var appModulo= app.ref("ModuloEsc/");
	    $(".ingresarModulo").on('click',function(){
	        appModulo.push({
	            Clave_modulo: $(".clave").val(),
	            Nombre_modulo: $(".modulo").val(),
	        });
	        $(".clave").val('');
	        $(".modulo").val('');
	        alert("Ingresado correctamente a tabla Año");
	    });
	});
  
    //Muestra, Edita y borra
    $.crearfilas = function (dato, ss) {
        var datoscontenido = "<td> " + dato.Clave_modulo+"</td>";
        datoscontenido += "<td> " + dato.Nombre_modulo+"</td>";
        datoscontenido += "<td class='acciones'> <input type='image' title='Actualizar' src='../img/actualizado.png' widht='30' height='30' class='btn-modificar' id='" + ss.key + "'></td>";
        datoscontenido += "<td> <input type='image' title='Actualizar' src='../img/borrar.png' widht='30' height='30' class='btn-eliminar' id='" + ss.key + "'></td>";
        return datoscontenido;
    }


    var database = firebase.database();
    var ref = database.ref("ModuloEsc"); 
    ref.on('child_added', function (snapshot) {
        var datos = snapshot.val();
        var agregarcontenido = document.createElement("tr");
        agregarcontenido.setAttribute("id", "f" + snapshot.key);
        agregarcontenido.innerHTML = $.crearfilas(datos, snapshot);
        document.getElementById("contenidotabla").appendChild(agregarcontenido);
    });

    ref.on("child_changed", function (snapshot) {
        var datos = snapshot.val();
        var identificador = "#contenidotabla #f" + snapshot.key + " td";
        var elementocambio = $('body').find(identificador);
        elementocambio[0].innerHTML = datos.Clave_modulo;
        elementocambio[1].innerHTML = datos.Nombre_modulo;
    });

    // busca el boton de actualizar
    $('body').on('click', '#contenidotabla tr td .btn-modificar', function () {
        identicador = $(this).attr("id");
        fila = $(this).closest("tr");
        $("#captura").css("display", "inline");
        $("#actualiza").css("display", "inline");
        $("#idactualiza").val(identicador);
        $("#cmodulo").val(fila.find('td:eq(0)').text());
        $("#moduloo").val(fila.find('td:eq(1)').text());
    });


    $("#actualiza").click(function () {
        var ref = database.ref("ModuloEsc/").child($("#idactualiza").val());
        ref.update({
            Clave_modulo: $("#cmodulo").val(),
            Nombre_modulo: $("#moduloo").val()
        })
        .then(function () {
            alert("se actualizaron los datos correctamente");
            $("#captura").css("display", "none");
            $("#actualiza").css("display", "none");
            $("#cmodulo").val("");
            $("#moduloo").val("");
        })
        .catch(function (err) {
            alert("error al actualizar " + err);
        });
    });


    //buscar el boton eliminar
    $('body').on('click', '#contenidotabla tr td .btn-eliminar', function () {
        identicador = $(this).attr("id");
        fila = $(this).closest("tr");
        eliminacion = fila;
        $("#captura").css("display", "inline");
        $("#eliminar").css("display", "inline");
        $("#idactualiza").val(identicador);
        $("#cmodulo").val(fila.find('td:eq(0)').text());
        $("#moduloo").val(fila.find('td:eq(1)').text());
        $("#cmodulo").prop('disabled', true);
        $("#moduloo").prop('disabled', true);
    });

    $("#eliminar").click(function () {
        var ref = database.ref("ModuloEsc/").child($("#idactualiza").val());
        ref.remove()
            .then(function () {
                eliminacion.remove();
                alert("se eliminaron los datos correctamente");
                $("#captura").css("display", "none");
                $("#eliminar").css("display", "none");
                $("#cmodulo").val("");
                $("#moduloo").val("");
                $("#cmodulo").prop('disabled', false);
                $("#moduloo").prop('disabled', false);
            })
            .catch(function (err) {
                alert("error al eliminar " + err);
            });
    })

    $("#cancelar").click(function () {
        $("#captura").css("display", "none");
        $("#graba").css("display", "none");
        $("#actualiza").css("display", "none");
        $("#eliminar").css("display", "none");
        $("#cmodulo").val("");
        $("#moduloo").val("");
        $("#cmodulo").prop('disabled', false);
        $("#moduloo").prop('disabled', false);
    });
});