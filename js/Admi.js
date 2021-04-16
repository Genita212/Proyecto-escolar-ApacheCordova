function cambioA(){
  $('#tablaAdmi').on('click', function(){
    $('#content').attr('src', 'tablaAdmi.html');
  });
}

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

  
  var firebaseRef= firebase.database();
  var ref= firebaseRef.ref("AdministradorEsc/")

  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      // User is signed in.
      document.getElementById("user_div").style.display ="block"
      document.getElementById("tablilla").style.display = "block"
      document.getElementById("informacion").style.display = "block"
      document.getElementById("content").style.display ="none"
      document.getElementById("login_div").style.display = "none";

      var user = firebase.auth().currentUser;

      if(user != null){
        var email_id = user.email;
        var uid = user.uid;
        //////condicione que si el ususario es igual al de la autenticacion, me mostrara la informacion
        ref.on("child_added",function(data){
          var datos= data.val();
          if (email_id== datos.CorreoElectronico) {
            document.getElementById("active").innerHTML = datos.Nombre+" "+datos.Apellidos;
            document.getElementById("NumEmpAdmi").innerHTML = datos.NumEmpleado;
            document.getElementById("NombreAdmi").innerHTML = datos.Nombre+" "+datos.Apellidos;
            document.getElementById("CorreoAdmi").innerHTML = datos.CorreoElectronico;
            document.getElementById("estAdmo").innerHTML = "Estimad@ "+datos.Nombre+":";
          }
        })
      }
    } else {
      // No user is signed in.
      document.getElementById("user_div").style.display = "none";
      document.getElementById("tablilla").style.display = "none"
      document.getElementById("informacion").style.display = "none"
      document.getElementById("content").style.display ="none";
      document.getElementById("login_div").style.display = "block";

      email.value="";
      passw.value="";
    }
  });

  $("#btnIngresar").on("click", function(){
    var email = document.getElementById("email");
    var password = document.getElementById("passw");
    ref.on("value", function(snapshot){
      snapshot.forEach(function(element){
        var t= element.val();
        if(t.CorreoElectronico==email.value){
          firebase.auth().signInWithEmailAndPassword(email.value, password.value)
          .then((user) => {
            var uid= firebase.auth().currentUser.uid;
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
          });
        }
      })
    })
  });

  $("#btnsalir").on("click", function(){
    var email = document.getElementById("email");
    var password = document.getElementById("passw"); 
    firebase.auth().signOut()
  });
});

function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function cambio(){
	$('#alumno').on('click', function(){
		$('#content').attr('src', 'admi/alumnos.html');
    document.getElementById("tablilla").style.display = "none"
    document.getElementById("informacion").style.display = "none"
    document.getElementById("content").style.display ="block";
	});

	$('#profesor').on('click', function(){
		$('#content').attr('src', 'admi/profesor.html');
    document.getElementById("tablilla").style.display = "none"
    document.getElementById("informacion").style.display = "none"
    document.getElementById("content").style.display ="block";
	});

	$('#grupo').on('click', function(){		
		$('#content').attr('src', 'admi/grupo.html');
    document.getElementById("tablilla").style.display = "none"
    document.getElementById("informacion").style.display = "none"
    document.getElementById("content").style.display ="block";
	});

	$('#modulo').on('click', function(){
		$('#content').attr('src', 'admi/modulo.html');
    document.getElementById("tablilla").style.display = "none"
    document.getElementById("informacion").style.display = "none"
    document.getElementById("content").style.display ="block";
	});

  $('#admin').on('click', function(){
    $('#content').attr('src', 'admi/admiMenu.html');
    document.getElementById("tablilla").style.display = "none"
    document.getElementById("informacion").style.display = "none"
    document.getElementById("content").style.display ="block";
  });
}