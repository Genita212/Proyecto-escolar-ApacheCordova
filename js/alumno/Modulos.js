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
    
    var firebasee= firebase.database();
    var refAlumno= firebasee.ref("AlumnoEsc/");
    var refAsignar= firebasee.ref("AsignarGEsc/");
    var refModulo2Prof= firebasee.ref("Mod2ProfAsignEsc/");
    var refProfesor= firebasee.ref("ProfesorEsc/");
    var refModulo = firebasee.ref("ModuloEsc")
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var user = firebase.auth().currentUser;
            if(user != null){
                var email_id = user.email;
                
                var dataSet = [];//array para guardar los valores de los campos inputs del form
                var table = $('#tablamod').DataTable({
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
                
                refAlumno.on("child_added",function(data){
                    var datosAlumno= data.val().CorreoElectronico;
                    if (email_id == datosAlumno) {
                        var malumno= data.val().Matricula;
                        
                        refAsignar.on("child_added", function(asignarG){
                            var datosGA= asignarG.val().Matricula;
                            if (malumno == datosGA) {
                                var anioGA= asignarG.val().Año_Escolar;
                                var grupoGA= asignarG.val().Grupo_Letra;
                                
                                refModulo2Prof.on("child_added", function(modpro){
                                    var datosModPro= modpro.val().Clave_modulo;
                                    var anioModPro= modpro.val().Año_Escolar;
                                    var grupoModPro= modpro.val().Grupo_Letra;
                                    if (anioGA == anioModPro && grupoGA == grupoModPro) {
                                      var ce = modpro.val().NumEmpleado;
                    
                                      refProfesor.on("child_added", function(profesor){
                                        var prof = profesor.val().NumEmpleado;
                                        if (ce == prof) {
                                                  
                                                refModulo.on("child_added", function(modulo){
                                                    var datosMod= modulo.val().Clave_modulo;
                                                    if (datosModPro == datosMod  && profesor && data) {
                                                        dataSet = [modulo.key, modulo.child("Nombre_modulo").val(), 
                                                        profesor.child("Nombre").val() + profesor.child("Apellidos").val()];
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
                })
            }
        } else {
            email.value="";
            passw.value="";
        }
    })
})