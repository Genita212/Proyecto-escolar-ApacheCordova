function cambioA(){
  $("#TodosAlumnos").on("click",function(){
    $('#content').attr('src', 'tablaGralAlumno.html');
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

  $.crearmenusFilasYear = function (datoYear, ssYear) {
    var datoscontenidoYear = "<a id='" + ssYear.key + "'>" + datoYear.Año_Escolar + "</a> ";
    return datoscontenidoYear;
  }

  $.crearmenusFilasGrupo = function (datoGrupo, ssGrupo) {
    var datoscontenidoGrupo = "<a id='" + ssGrupo.key + "'>" + datoGrupo.Grupo_Letra + "</a> ";
    return datoscontenidoGrupo;
  }

    var database = firebase.database();
    var refYear = database.ref("YearEsc");
    var refGrupo = database.ref("GrupoEsc");

    refYear.on('child_added', function (snapshotYear) {
        var datosYear = snapshotYear.val();
        var agregarcontenidoYear = document.createElement("li");
        agregarcontenidoYear.setAttribute("id", "f" + snapshotYear.key);
        agregarcontenidoYear.innerHTML = $.crearmenusFilasYear(datosYear, snapshotYear);
        document.getElementById("anio").appendChild(agregarcontenidoYear);
    });

    refYear.on("child_changed", function (snapshotYear) {
        var datosYear = snapshotYear.val();
        var identificadorYear = "#anio #f" + snapshotYear.key + "a";
        var elementocambioYear = $('body').find(identificadorYear);
        elementocambioYear[0].innerHTML = datosYear.Año_Escolar;
    });

    refGrupo.on('child_added', function (snapshotGrupo) {
        var datosGrupo = snapshotGrupo.val();
        var agregarcontenidoGrupo = document.createElement("li");
        agregarcontenidoGrupo.setAttribute("id", "f" + snapshotGrupo.key);
        agregarcontenidoGrupo.innerHTML = $.crearmenusFilasGrupo(datosGrupo, snapshotGrupo);
        document.getElementById("submenu").appendChild(agregarcontenidoGrupo);
    });

    refGrupo.on("child_changed", function (snapshotGrupo) {
        var datosGrupo = snapshotGrupo.val();
        var identificadorGrupo = "#submenu #f" + snapshotYear.key + "a";
        var elementocambioGrupo = $('body').find(identificadorGrupo);
        elementocambioGrupo[0].innerHTML = datosGrupo.Grupo_Letra;
    });

});

//////muestra,edicion y eliminacion de datos

$.crearfilasAlum = function (dato, ss) {
  var datoscontenido = "<td> " + dato.Nombre+"</td>";
  datoscontenido += "<td> " + dato.Apellidos+"</td>";
  datoscontenido += "<td> " + dato.Matricula+"</td>";
  datoscontenido += "<td> " + dato.CURP+"</td>";
  datoscontenido += "<td> " + dato.CorreoElectronico+"</td>";
  datoscontenido += "<td class='acciones'> <input type='image' title='Actualizar' src='../img/actualizado.png' widht='30' height='30' class='btn-modificar' id='" + ss.key + "'></td>";
  datoscontenido += "<td> <input type='image' title='Actualizar' src='../img/borrar.png' widht='30' height='30' class='btn-eliminar' id='" + ss.key + "'></td>";
  return datoscontenido;
}

var database = firebase.database();
var ref = database.ref("AlumnoEsc");
ref.on('child_added', function (snapshot) {
  var datos = snapshot.val();
  var agregarcontenido = document.createElement("tr");
  agregarcontenido.setAttribute("id", "f" + snapshot.key);
  agregarcontenido.innerHTML = $.crearfilasAlum(datos, snapshot);
  document.getElementById("contenidotabla").appendChild(agregarcontenido);
});

ref.on("child_changed", function (snapshot) {
  var datos = snapshot.val();
  var identificador = "#contenidotabla #f" + snapshot.key + " td";
  var elementocambio = $('body').find(identificador);
  elementocambio[0].innerHTML = datos.Nombre;
  elementocambio[1].innerHTML = datos.Apellidos;
  elementocambio[2].innerHTML = datos.Matricula;
  elementocambio[3].innerHTML = datos.CURP;
  elementocambio[4].innerHTML = datos.CorreoElectronico

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