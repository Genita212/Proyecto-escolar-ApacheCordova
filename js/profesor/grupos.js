function cambioA(){
  $('#tablagrupo').on('click', function(){
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

  /*borre lo que es modificar y eliminar, pues estos no los necesitamos ya que
    los profesores solo pueden ver sin modificar mas que la parte de 
    calificaciones.*/

 /*mandas a llamar la base y las tablas como tu lo hiciste, solo mandamos a
 llamar dos que son las que relacionan al profesor con sus grupos y sus modulos*/ 
  var db = firebase.database(); 
  var refProfesor= db.ref().child("ProfesorEsc");
  var refModPro= db.ref().child("Mod2ProfAsignEsc");

/*se comienza con autentificar alprofesor que inicio sesion. Si existe un
  usuario activo quiero obtener de ese usuario su email con el que inicia
  sesion*/
  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      //Usuario inicia sesion
      var user = firebase.auth().currentUser;
      if(user != null){
        //Este email es el que inicio sesion
        var email_id= user.email;

        var dataSet = [];//array para guardar los valores de los campos inputs del form
        var table = $('#tablagrupo').DataTable({
                        pageLength : 5,
                        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
                        data: dataSet,
                        columnDefs: [
                          {
                            targets: [0], 
                            visible: false, //ocultamos la columna de ID que es la [0]                        
                          },
     //borre lo que tenias de modificar y eliminar ya que no lo vamos a utilizar
                        ]    
                    });
/*Aqui comence a llamar a las tablas, para el loginprofesor siempre comenzaremos
  con la tabla de profesor ya que de ahi obtengo el email.

  Si el email que inicio sesion es igual al email que esta en la base me mostrara
  unicamente los datos del profesor activo*/
        refProfesor.on("child_added",  function(profesor){
          //este email es el que se encuentra en la base
          var emailProf= profesor.val().CorreoElectronico;
          //esta es la condicion de que si los email son iguales me muestre la información
          if (email_id == emailProf) {
            /*Este numero de empleado es de la tabla profesor*/
            var nEmpProf= profesor.val().NumEmpleado;

            //Aqui se manda a llamar la tabla Mod2ProfAsigEsc
            refModPro.on("child_added", function(modpro){
              //Este numero de empleado es de la tabla Mod2ProfAsignEsc
              var nEmpModPro= modpro.val().NumEmpleado;
              /*Se igualan los numeros de empleado ya que este es el que une
                a las dos tablas*/
              if (nEmpProf == nEmpModPro) {
                //Se obtienen lo que necesito que son los grupos, y se muestran asi como lo haces en tu codigo
                dataSet = [modpro.key, modpro.child("Año_Escolar").val(), modpro.child("Grupo_Letra").val()];
                table.rows.add([dataSet]).draw();

                /*Pruebalo y funciona.
                  Incluso busca asi como las demas tablas hechas en admi,
                  segun yo no marca lo que me decias, tu dime.

                  Lo que tienes que hacer es encontrar la celda de la tabla
                  que las relaciona, su foreign key por decirlo asi.

                  Basate en la que hicieron ellos, pero segun yo eso es lo
                  que querias, si no es eso, te eh fallado u.u

                  Buena suerte!! jaja XD
                */
              }
            })
          }
        });
      }
    }else{
      //Cuando el usuario no inicia sesion
      email.value="";
      passw.value="";
    }
  })
});