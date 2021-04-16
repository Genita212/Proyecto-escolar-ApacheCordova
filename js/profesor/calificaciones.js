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
     
    //var filaEliminada; //para capturara la fila eliminada
    var filaEditada; //para capturara la fila editada o actualizada
    
    //creamos constantes para los iconos editar y borrar    
    const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
    //const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';
    
    var database = firebase.database();
    var ref = database.ref("ProfesorEsc/");
    var ref1 = database.ref("Mod2ProfAsignEsc/");
    var ref2 = database.ref("ModuloEsc/");
    var ref3 = database.ref("AsignarGEsc/");
    var ref4 = database.ref("AlumnoEsc/");
    var ref5= database.ref("CalificacionEsc/");
    
    
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            //Usuario inicia sesion
            var user = firebase.auth().currentUser;
            if(user != null){
                //Este email es el que inicio sesion
                var email_id= user.email;

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
                        {
                            targets: -1,
                            defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>"+iconoEditar+"</button></div></div>"
                        }
                    ]	   
                });
                
                
                ref.on("child_added",  function(profesor){
                  var emailProf= profesor.val().CorreoElectronico;     
                  if (email_id == emailProf) {
                    var nEmpProf= profesor.val().NumEmpleado;
                             
                    ref1.on("child_added", function(modpro){             
                      var nEmpModPro= modpro.val().NumEmpleado;            
                      if (nEmpProf == nEmpModPro) {
                        var aniomodpro= modpro.val().Año_Escolar;
                        var grupomodpro= modpro.val().Grupo_Letra;
                        var clavModul = modpro.val().Clave_modulo;
                               
                        ref3.on("child_added", function(asignargrupo){
                          var aniogrup= asignargrupo.val().Año_Escolar;
                          var grupogrup= asignargrupo.val().Grupo_Letra;
                          if (aniomodpro==aniogrup && grupomodpro==grupogrup) {
                            var asig = asignargrupo.val().Matricula;
                                  
                            ref4.on("child_added", function(alumno){
                              var matricul = alumno.val().Matricula;
                              if (asig == matricul) {
                                ref2.on("child_added", function(modulo){
                                  var datosmodulo= modulo.val().Clave_modulo;
                                  if (clavModul==datosmodulo && alumno && modpro) {
                                    dataSet = [modulo.key, 
                                                alumno.child("Matricula").val(),
                                                alumno.child("Nombre").val() +" " + alumno.child("Apellidos").val(),
                                                modpro.child("Año_Escolar").val() + modpro.child("Grupo_Letra").val(),
                                                modulo.child("Nombre_modulo").val()];
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

                $('form').submit(function(e){
                    e.preventDefault();
                    let id = $.trim($('#id').val()); 
                    let matricula= $.trim($('#matricula').val());
                    let nombreApp= $.trim($('#nombre').val());
                    let grupo= $.trim($('#grupo').val());
                    let modulo=$.trim($('#modulo').val());
                    $("form").trigger("reset");
                    $('#modalAltaEdicion').modal('hide');
                })

                $("#tablacalif").on("click", ".btnEditar", function() {    
                    filaEditada = table.row($(this).parents('tr'));           
                    let fila = $('#tablacalif').dataTable().fnGetData($(this).closest('tr'));
                    let id = fila[0];
                    let matricula = $(this).closest('tr').find('td:eq(0)').text(); 
                    let nombreApp = $(this).closest('tr').find('td:eq(1)').text();
                    let grupo = $(this).closest('tr').find('td:eq(2)').text();
                    let modulo = $(this).closest('tr').find('td:eq(3)').text();         
                    $('#id').val(id);        
                    $('#matricula').val(matricula);
                    $('#nombre').val(nombreApp);
                    $('#grupo').val(grupo);
                    $('#modulo').val(modulo);                
                    $('#modalAltaEdicion').modal('show');

                    $("#matricula").prop('disabled', true);
                    $('#nombre').prop('disabled', true);
                    $('#grupo').prop('disabled', true);
                    $('#modulo').prop('disabled', true);
                });

                $('#actualiza').on('click',function(){
                    var matri= document.getElementById("matricula");
                    var modul= document.getElementById("modulo");
                    var calificacion= document.getElementById("calif");

                    ref2.on("child_added", function(modulo){
                        var nMod= modulo.val().Nombre_modulo;
                        if (nMod == modul.value) {
                            var cMod= modulo.val().Clave_modulo;
                            var ref5 = database.ref("CalificacionEsc/").child($("#id").val());
                            ref5.update({
                                Matricula: matri.value,
                                Clave_modulo: cMod,
                                Calificacion: calificacion.value 
                            })
                        }
                    })
                })
            }
        }
    })
})




