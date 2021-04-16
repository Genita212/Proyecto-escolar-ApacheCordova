function cambioA(){
  $('#tablaAdmi').on('click', function(){
    $('#content').attr('src', 'tablaAdmi.html');
  });
}

//datos de la base
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

$(document).ready(function () {
///////////////////Agrega datos alumno
  $(function(){
    $(".ingresarAdministrador").on('click',function(){
      var app=firebase.database();
      var numEmpleado= document.getElementById("numEmpleado");
      var nombre= document.getElementById("nombre");
      var apellidos= document.getElementById("apellidos");
      var email= document.getElementById("correo");
      var password=document.getElementById("passw");
      var tipouser=document.getElementById("tipouser");

      firebase.auth().createUserWithEmailAndPassword(email.value,password.value)
      .then((user)=>{
        console.log("Exito");
        var appAdmi= app.ref("AdministradorEsc/");
        
        appAdmi.push({
          uId: firebase.auth().currentUser.uid,
          NumEmpleado: numEmpleado.value,
          Nombre: nombre.value,
          Apellidos: apellidos.value,
          CorreoElectronico: firebase.auth().currentUser.email,
          TipoUsuario: tipouser.value 
        })
        alert("Subido con exito");
        numEmpleado.value=' ';
        nombre.value=' ';
        apellidos.value=' ';
        email.value=' ';
        password.value=' ';
      })
      .catch((error)=>{
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        alert("Error al subir información")
      })
    })


    //////////////Edicion de datos almacenados en la database

    $.crearfilasAdmin = function (dato, ss) {
        var datoscontenido = "<td> " + dato.NumEmpleado+"</td>";
        datoscontenido += "<td> " + dato.Nombre+"</td>";
        datoscontenido += "<td> " + dato.Apellidos+"</td>";
        datoscontenido += "<td> " + dato.CorreoElectronico+"</td>";
        datoscontenido += "<td class='acciones'> <input type='image' title='Actualizar' src='../img/actualizado.png' widht='30' height='30' class='btn-modificar' id='" + ss.key + "'></td>";
        datoscontenido += "<td> <input type='image' title='Actualizar' src='../img/borrar.png' widht='30' height='30' class='btn-eliminar' id='" + ss.key + "'></td>";
        return datoscontenido;
    }

    var database = firebase.database();
    var ref = database.ref("AdministradorEsc");
    ref.on('child_added', function (snapshot) {
        var datos = snapshot.val();
        var agregarcontenido = document.createElement("tr");
        agregarcontenido.setAttribute("id", "f" + snapshot.key);
        agregarcontenido.innerHTML = $.crearfilasAdmin(datos, snapshot);
        document.getElementById("contenidotabla").appendChild(agregarcontenido);
    });

    ref.on("child_changed", function (snapshot) {
        var datos = snapshot.val();
        var identificador = "#contenidotabla #f" + snapshot.key + " td";
        var elementocambio = $('body').find(identificador);
        elementocambio[0].innerHTML = datos.NumEmpleado;
        elementocambio[1].innerHTML = datos.Nombre;
        elementocambio[2].innerHTML = datos.Apellidos;
        elementocambio[3].innerHTML = datos.CorreoElectronico

    });

    // busca el boton de actualizar
    $('body').on('click', '#contenidotabla tr td .btn-modificar', function () {
        identicador = $(this).attr("id");
        fila = $(this).closest("tr");
        $("#captura").css("display", "inline");
        $("#actualiza").css("display", "inline");
        $("#idactualiza").val(identicador);
        $("#cadmi").val(fila.find('td:eq(0)').text());
        $("#nombre").val(fila.find('td:eq(1)').text());
        $("#apellidos").val(fila.find('td:eq(2)').text());
        $("#correo").val(fila.find('td:eq(3)').text());
    });


    $("#actualiza").click(function () {
        var ref = database.ref("AdministradorEsc/").child($("#idactualiza").val());
        ref.update({
            Clave_modulo: $("#cadmi").val(),
            Nombre_modulo: $("#nombre").val(),
            Clave_modulo: $("#apellidos").val(),
            Nombre_modulo: $("#correo").val()
        })
        .then(function () {
            alert("se actualizaron los datos correctamente");
            $("#captura").css("display", "none");
            $("#actualiza").css("display", "none");
            $("#cadmi").val("");
            $("#nombre").val("");
            $("#apellidos").val("");
            $("#correo").val("");
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
        $("#cadmi").val(fila.find('td:eq(0)').text());
        $("#nombre").val(fila.find('td:eq(1)').text());
        $("#apellidos").val(fila.find('td:eq(2)').text());
        $("#correo").val(fila.find('td:eq(3)').text());
        $("#cadmi").prop('disabled', true);
        $("#nombre").prop('disabled', true);
        $("#apellidos").prop('disabled', true);
        $("#correo").prop('disabled', true);
    });

    $("#eliminar").click(function () {
        var ref = database.ref("AdmniEsc/").child($("#idactualiza").val());
        ref.remove()
            .then(function () {
                eliminacion.remove();
                alert("se eliminaron los datos correctamente");
                $("#captura").css("display", "none");
                $("#eliminar").css("display", "none");
                $("#cadmi").val("");
                $("#nombre").val("");
                $("#apellidos").val("");
                $("#correo").val("");
                $("#cadmi").prop('disabled', false);
                $("#nombre").prop('disabled', false);
                $("#apellidos").prop('disabled', false);
                $("#correo").prop('disabled', false);
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
        $("#cadmi").val("");
        $("#nombre").val("");
        $("#apellidos").val("");
        $("#correo").val("");
        $("#cmodulo").prop('disabled', false);
        $("#moduloo").prop('disabled', false);
        $("#cmodulo").prop('disabled', false);
        $("#moduloo").prop('disabled', false);
    });
  })
});