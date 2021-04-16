function cambiom(){
    $('#modulo').on('click', function(){
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
  
    var filaEditada; //para capturara la fila editada o actualizada

    //creamos constantes para los iconos editar y borrar    
    const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
  

    var db = firebase.database();
    var coleccionArchivos = db.ref().child("AlumnoEsc");
    var ref = db.ref().child("YearEsc/");
    var refG = db.ref().child("GrupoEsc/");
    var refGas= db.ref("AsignarGEsc/");
    
     
    var dataSet = [];//array para guardar los valores de los campos inputs del form
    var table = $('#tablasig').DataTable({
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

            $.crearselectYear = function (datoY) {
                var datoscontenido = "<option> " + datoY.Año_Escolar+"</option>";
                return datoscontenido;
              }
            
               $.crearselectGroup = function (datoG) {
                var datoscontenidoG = "<option> " + datoG.Grupo_Letra+"</option>";
                return datoscontenidoG;
              }
              
              ref.on('child_added', function (snapshot) {
                var year = snapshot.val();
                var agregarcontenido = document.createElement("option");
                agregarcontenido.innerHTML = $.crearselectYear(year, snapshot);
                document.getElementById("anio").appendChild(agregarcontenido);
              });
              
              refG.on('child_added', function (snapshotG) {
                var grupoG = snapshotG.val();
                var agregarcontenidoG = document.createElement("option");
                agregarcontenidoG.innerHTML = $.crearselectGroup(grupoG, snapshotG);
                document.getElementById("grupoo").appendChild(agregarcontenidoG);
              });
            

    coleccionArchivos.on("child_added", datos => {        
        dataSet = [datos.key, datos.child("Matricula").val(), datos.child("Nombre").val(), datos.child("Apellidos").val()];
        table.rows.add([dataSet]).draw();
    });
    coleccionArchivos.on('child_changed', datos => {           
        dataSet = [datos.key, datos.child("Matricula").val(), datos.child("Nombre").val(), datos.child("Apellidos").val()];
        table.row(filaEditada).data(dataSet).draw();
    });
    
  


    //Botones
    $("#actualiza").click(function(){
        var matricula= document.getElementById("codigo");
        var anio= document.getElementById("anio");
        var grupo= document.getElementById("grupoo");
        refGas.push({
            Matricula: matricula.value,
            Año_Escolar: anio.value,
            Grupo_Letra: grupo.value
        });
    })

 
    $("#tablasig").on("click", ".btnEditar", function() {    
        filaEditada = table.row($(this).parents('tr'));           
        let fila = $('#tablasig').dataTable().fnGetData($(this).closest('tr'));               
        let id = fila[0];
        console.log(id);
		let codigo = $(this).closest('tr').find('td:eq(0)').text(); 
        let nombre = $(this).closest('tr').find('td:eq(1)').text();   
        let apellidos = $(this).closest('tr').find('td:eq(2)').text();         
        $('#id').val(id);        
        $('#codigo').val(codigo);
        $('#nombre').val(nombre);                
        $('#apellidos').val(apellidos);                
        $('#modalAltaEdicion').modal('show');
        
	});  

    
