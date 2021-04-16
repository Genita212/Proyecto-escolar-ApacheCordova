function cambioA(){
  $('#tablalum').on('click', function(){
    $('#content').attr('src', 'tablagrupo.html');
  });
}

$(document).ready(function() {
    const config = {
    //AQUÍ VA TU PORPIO SDK DE FIREBASE
    apiKey: "AIzaSyA_qJSiFWualjsxTQbfhtR5fdFs89R8Gbo",
    authDomain: "sistemaescolar-4f39c.firebaseapp.com",
    databaseURL: "https://sistemaescolar-4f39c-default-rtdb.firebaseio.com",
    projectId: "sistemaescolar-4f39c",
    storageBucket: "sistemaescolar-4f39c.appspot.com",
    messagingSenderId: "462338497783",
    appId: "1:462338497783:web:3ca124e0234e47fe6407f2"
};    
firebase.initializeApp(config); //inicializamos firebase


var db = firebase.database();
var coleccionArchivos = db.ref().child("AlumnoEsc/");
    var ref= db.ref().child("ProfesorEsc/");
    var ref1= db.ref().child("Mod2ProfAsignEsc/");
    var ref2= db.ref().child("AsignarGEsc/");
    
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        //Usuario inicia sesion
        var user = firebase.auth().currentUser;
        if(user != null){
          //Este email es el que inicio sesion
          var email_id= user.email;
     
var dataSet = [];//array para guardar los valores de los campos inputs del form
var table = $('#tablalum').DataTable({
            pageLength : 5,
            lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
            data: dataSet,
            columnDefs: [
                {
                    targets: [0], 
                    visible: false, //ocultamos la columna de ID que es la [0]                        
                },
                
            ]	   
        });
        
  
        ref.on("child_added", function(profesor){
          var emailProf = profesor.val().CorreoElectronico;
          if (email_id == emailProf) {
            var nEmpProf= profesor.val().NumEmpleado;
            
            
            ref1.on("child_added", function(modpro){
            var nEmpModPro=modpro.val().NumEmpleado;
            if (nEmpProf == nEmpModPro){
              var Asignano = modpro.val().Año_Escolar;
              var grup = modpro.val().Grupo_Letra;


              ref2.on("child_added", function(asignargrupo){
                var Asignan = asignargrupo.val().Año_Escolar;
                var Asignagru = asignargrupo.val().Grupo_Letra;
                if (Asignano == Asignan && grup == Asignagru) {
                var asig = asignargrupo.val().Matricula;
                  

                  coleccionArchivos.on("child_added", function(matricula){
                    var matricul=matricula.val().Matricula;
                    if (asig == matricul){
                      dataSet = [matricula.key, matricula.child("Matricula").val(), matricula.child("Nombre").val(), matricula.child("Apellidos").val()];
                      table.rows.add([dataSet]).draw();

                    }
                  })
                }
              })

            }  

            })
          }

        })            
      }
    } else {
      // No user is signed in.
      
      email.value="";
      passw.value="";
    }
  });
});

