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
    
    var db= firebase.database();
    var refAlumno= db.ref().child("AlumnoEsc/");
    var refCalif= db.ref().child("CalificacionEsc")
    var refModulo = db.ref().child("ModuloEsc")
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var user = firebase.auth().currentUser;
            if(user != null){
                var email_id = user.email;
                
                var dataSet = [];//array para guardar los valores de los campos inputs del form
                var table = $('#tablacalif').DataTable({
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
                        
                        refCalif.on("child_added",function(calificacion){
                            var datosCalif= calificacion.val().Matricula;
                            if (malumno == datosCalif) {
                                var claveModCal= calificacion.val().Clave_modulo;
                                
                                refModulo.on("child_added", function(moduloo){
                                    var datosMod= moduloo.val().Clave_modulo;
                                    if (claveModCal == datosMod && calificacion) {
                                        dataSet = [moduloo.key, moduloo.child("Nombre_modulo").val(), calificacion.child("Calificacion").val()];
                                        table.rows.add([dataSet]).draw();
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
    });
})
    