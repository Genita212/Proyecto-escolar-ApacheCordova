function cambioP(){
  $('#profe').on('click', function(){
    $('#content').attr('src', 'tablaProfesor.html');
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
    $(".ingresarProfesor").on('click',function(){
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
        var appProfesor= app.ref("ProfesorEsc/");
        var timeStamp= new Date().getTime();
        var prof='PRF_'+ timeStamp;

        appProfesor.push({
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
  })
});


/*
		SE USA PARA ASIGNACION DE GRUPOS

////////////muestra informacion en las opciones de asiganr grupo
  $.crearselectYear = function (datoY) {
        var datoscontenido = "<option> " + datoY.Año_Escolar+"</option>";
        return datoscontenido;
  }
  var database = firebase.database();
  var ref = database.ref("YearEsc/");
  ref.on('child_added', function (snapshot) {
    var year = snapshot.val();
    var agregarcontenido = document.createElement("option");
    agregarcontenido.innerHTML = $.crearselectYear(year, snapshot);
    document.getElementById("contenidoyear").appendChild(agregarcontenido);
  });


  $.crearselectGroup = function (datoG) {
        var datoscontenidoG = "<option> " + datoG.Grupo_Letra+"</option>";
        return datoscontenidoG;
  }
  var refG = database.ref("GrupoEsc/");
  refG.on('child_added', function (snapshotG) {
    var grupoG = snapshotG.val();
    var agregarcontenidoG = document.createElement("option");
    agregarcontenidoG.innerHTML = $.crearselectGroup(grupoG, snapshotG);
    document.getElementById("contenidogrupo").appendChild(agregarcontenidoG);
  });*/

