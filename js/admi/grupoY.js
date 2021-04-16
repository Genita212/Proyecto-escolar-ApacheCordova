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
    var appYear= app.ref("YearEsc/");
    var appGrupo= app.ref("GrupoEsc/");
    $(".ingresarYear").on('click',function(){
        appYear.push({
            Año_Escolar: $(".year").val(),
        });
        $(".year").val('');
        alert("Ingresado correctamente a tabla Año");
    });
});


//datos de la base
$(document).ready(function () {
  
    //Muestra, Edita y borra
    $.crearfilas = function (dato, ss) {
        var datoscontenido = "<td> " + dato.Año_Escolar+"</td>";
        datoscontenido += "<td class='acciones'> <input type='image' title='Actualizar' src='../img/actualizado.png' widht='30' height='30' class='btn-modificar' id='" + ss.key + "'></td>";
        datoscontenido += "<td> <input type='image' title='Actualizar' src='../img/borrar.png' widht='30' height='30' class='btn-eliminar' id='" + ss.key + "'></td>";
        
        return datoscontenido;
    }

    
    var database = firebase.database();
    var ref = database.ref("YearEsc");
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
        elementocambio[0].innerHTML = datos.Año_Escolar;
    });

    // busca el boton de actualizar
    $('body').on('click', '#contenidotabla tr td .btn-modificar', function () {
        identicador = $(this).attr("id");
        fila = $(this).closest("tr");
        $("#captura").css("display", "inline");
        $("#actualiza").css("display", "inline");
        $("#idactualiza").val(identicador);
        $("#year").val(fila.find('td:eq(0)').text());
    });


    $("#actualiza").click(function () {
        var ref = database.ref("YearEsc/").child($("#idactualiza").val());
        ref.update({
            Año_Escolar: $("#year").val()
        })
        .then(function () {
            alert("se actualizaron los datos correctamente");
            $("#captura").css("display", "none");
            $("#actualiza").css("display", "none");
            $("#year").val("");
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
        $("#year").val(fila.find('td:eq(0)').text());
        $("#year").prop('disabled', true);
    });

    $("#eliminar").click(function () {
        var ref = database.ref("YearEsc/").child($("#idactualiza").val());
        ref.remove()
            .then(function () {
                eliminacion.remove();
                alert("se eliminaron los datos correctamente");
                $("#captura").css("display", "none");
                $("#eliminar").css("display", "none");
                $("#year").val("");
                $("#year").prop('disabled', false);
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
        $("#grupo").val("");
        $("#grupo").prop('disabled', false);
    });
});