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

var filaEditada; //para capturara la fila editada o actualizada

//creamos constantes para los iconos editar y borrar    
const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';

var db = firebase.database();
var coleccionArchivos = db.ref().child("ProfesorEsc");
var ref = db.ref().child("YearEsc/");
var refG = db.ref().child("GrupoEsc/");
var refM = db.ref().child("ModuloEsc/");
   
     
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
                {
                    targets: -1,        
                    defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>"+iconoEditar+"</button></div></div>"
                }
            ]	   
        });
  
 
        $.crearselectYear = function (datoY) {
            var datoscontenido = "<option>" + datoY.Año_Escolar+"</option>";
            return datoscontenido;
          }
        
          $.crearselectGroup = function (datoG) {
            var datoscontenidoG = "<option>" + datoG.Grupo_Letra+"</option>";
            return datoscontenidoG;
          }
        
          $.crearselectModulo = function (datoM,ssM) {
            var datoscontenidoM = "<option id='"+ssM.Clave_modulo+"'>" +datoM.Nombre_modulo+"</option>";
            return datoscontenidoM;
          }
          
          ref.on('child_added', function (snapshot) {
            var year = snapshot.val();
            var agregarcontenido = document.createElement("option");
            agregarcontenido.innerHTML = $.crearselectYear(year);
            document.getElementById("anio").appendChild(agregarcontenido);
          });
          
          refG.on('child_added', function (snapshotG) {
            var grupoG = snapshotG.val();
            var agregarcontenidoG = document.createElement("option");
            agregarcontenidoG.innerHTML = $.crearselectGroup(grupoG);
            document.getElementById("grupoo").appendChild(agregarcontenidoG);
          });
        
          refM.on('child_added', function (snapshotM) {
            var grupoM = snapshotM.val();
            var agregarcontenidoM = document.createElement("option");
            agregarcontenidoM.innerHTML = $.crearselectModulo(grupoM, snapshotM);
            document.getElementById("modulo").appendChild(agregarcontenidoM);
          });
        


coleccionArchivos.on("child_added", datos => {        
    dataSet = [datos.key, datos.child("NumEmpleado").val(), datos.child("Nombre").val(), datos.child("Apellidos").val()];
    table.rows.add([dataSet]).draw();
});
coleccionArchivos.on('child_changed', datos => {           
    dataSet = [datos.key, datos.child("NumEmpleado").val(), datos.child("Nombre").val(), datos.child("Apellidos").val()];
    table.row(filaEditada).data(dataSet).draw();
});
      
$("#actualiza").click(function(){
    var refModpro = db.ref("Mod2ProfAsignEsc/");
    
    var numEmp= document.getElementById("codigo");
    var modulo= document.getElementById("modulo");
    var anio= document.getElementById("anio");
    var grupol= document.getElementById("grupoo");

    refM.on("child_added",function(data){
        var dato= data.val();
        var nombreModulo= dato.Nombre_modulo;
        if (nombreModulo == modulo.value){
            var claveMod= dato.Clave_modulo;

            refModpro.push({
                NumEmpleado: numEmp.value,
                Clave_modulo: claveMod,
                Año_Escolar: anio.value,
                Grupo_Letra: grupol.value
            })
        }
    })
})

//Botones
$('#btnNuevo').click(function() {
    $('#id').val('');        
    $('#codigo').val('');
    $('#anio').val('');         
    $('#grupoo').val('');
    $("form").trigger("reset");
    $('#modalAltaEdicion').modal('show');
});        

$("#tablamod").on("click", ".btnEditar", function() {    
    filaEditada = table.row($(this).parents('tr'));           
    let fila = $('#tablamod').dataTable().fnGetData($(this).closest('tr'));               
    let id = fila[0];
    console.log(id);
    let codigo = $(this).closest('tr').find('td:eq(0)').text();  
    let nombre = $(this).closest('tr').find('td:eq(1)').text();   
    let apellidos = $(this).closest('tr').find('td:eq(2)').text(); 
    let modulo = $(this).closest('tr').find('td:eq(3)').text();                               
    let anio = $(this).closest('tr').find('td:eq(4)').text();    
    let grupoo = $(this).closest('tr').find('td:eq(5)').text();             
    $('#id').val(id);        
    $('#codigo').val(codigo);
    $('#nombre').val(nombre);
    $('#apellidos').val(apellidos);
    $('#modulo').val(modulo);
    $('#anio').val(anio);                
    $('#grupoo').val(grupoo);
    $('#modalAltaEdicion').modal('show');
});  
})