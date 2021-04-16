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
    $(".ingresarAlumno").on('click',function(){
      var app=firebase.database();
      var appAltagrupo= app.ref("GrupoAsignadoEsc/");
      var matricula= document.getElementById("matricula");
      var curp= document.getElementById("curp");
      var nombre= document.getElementById("nombre");
      var apellidos= document.getElementById("apellidos");
      var email= document.getElementById("correo");
      var password=document.getElementById("passw");
      var tipouser=document.getElementById("tipouser");

      firebase.auth().createUserWithEmailAndPassword(email.value,password.value)
      .then((user)=>{
        console.log("Exito");
        var appAlumno= app.ref("AlumnoEsc/");

        appAlumno.push({
          uId: firebase.auth().currentUser.uid,
          Matricula: matricula.value,
          CURP: curp.value,
          Nombre: nombre.value,
          Apellidos: apellidos.value,
          CorreoElectronico: correo.value,
          TipoUsuario: tipouser.value 
        })
        alert("Subido con exito");
        matricula.value=' ';
        curp.value=' ';
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