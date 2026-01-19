import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegistroQuejasReclamosService } from 'src/app/services/quejas-reclamos.service';
import { MotivoReclamo, ReclamoCliente, UnidadNegocio2, UsuarioResponsable } from '../quejas-reclamos.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalSeleccionPartidaQrComponent } from '../modal-seleccion-partida-qr/modal-seleccion-partida-qr.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data {
  Tipo  : String,
  Titulo: string;
  Datos : any   ;
}



@Component({
  selector: 'app-modal-queja-reclamo-nuevo',
  templateUrl: './modal-queja-reclamo-nuevo.component.html',
  styleUrls: ['./modal-queja-reclamo-nuevo.component.scss']
})
export class ModalQuejaReclamoNuevoComponent implements OnInit {
  formulario = this.formBuilder.group({
    tipoRegistro  : ['PARTIDA'],
    partida: [''],
    cliente: [''],
    unidadNegocio: [''],

    clientePartida: [''],
    temporada: [''],
    estilo:[''],

    areaResponsable: [''],
    usuarioResponsable: [''],
    motivo: [''],
    observacion: [''],

    filtroMotivoCtrl: [''],
  })   
  

  displayedColumns: string[] = [
    // 'id'        ,
    'partida'   , 
    'cliente'   ,
       'unidad'  ,
     'tela'      , 
     'color'     ,
     'area'      , 
    'responsable' , 
 
    'motivo'  ,
    'estado'  ,
    'observacion',
    'archivo',
    'acciones'
  ];  

  displayedColumnsEstilo: string[] = [
    'cliente'   ,
    'temporada',
    'estilo',
    'area'      , 
    'responsable' , 
    'motivo'  ,
    'estado'  ,
    'observacion',
    'archivo',
    'acciones'
  ];  

  dataSource: MatTableDataSource<ReclamoCliente> = new MatTableDataSource();  

  unidadNegocio: UnidadNegocio2[] = [];
  temporadas  : Array<any> = [];
  estilos  : Array<any> = [];
  areas: UsuarioResponsable[] = [];
  usuarios: Array<any> = [];
  usuariosFilter: any[] = [];

  clientes  : Array<any> = [];
  filtroClienteCtrl         = new FormControl('');
  clienteFiltrados          : any[] = []; 

  motivos           : Array<any> = [];
  filtroMotivoCtrl         = new FormControl('');
  motivosFiltrados  : any[] = []; 

  arrayArticulos: any[] = [];
  reclamos: any[] = [];

  cadenaCodOrdtra: string = '';

  //Variables de Recuperación
  _glb_Cliente: string = '';
  _glb_id_area: number = 0;
  _glb_descripcion_area: string = '';
  _glb_id_Usuario: string = '';
  _glb_Usuario: string = '';
  _glb_id_motivo: string = '';
  _glb_motivo: string = '';

  _glb_temporada: string = '';
  _glb_estilo: string = '';
  _glb_file: HTMLInputElement = null;
 
  //variables Globales
  sCod_Usuario = GlobalVariable.vusu;

  constructor(
     public  dialogRef      : MatDialogRef<ModalQuejaReclamoNuevoComponent>,
     private registroQuejasReclamosService: RegistroQuejasReclamosService  ,
     private formBuilder    : FormBuilder     ,
     private matSnackBar    : MatSnackBar     ,
     private dialog         : MatDialog       ,
     private toastr         : ToastrService   ,
     @Inject(MAT_DIALOG_DATA) public data: data                   ,
  ) { }

  ngOnInit(): void {

    this.formulario.get('clientePartida')?.disable();
    this.formulario.get('unidadNegocio')?.disable();

    this.onLoadCliente();
    this.onLoadUnidadNegocio();
    this.onLoadAreaResponsable();
    this.onLoadUsuarioResponsable();
    this.onLoadMotivos();

    // Escucha los cambios del input de búsqueda
    this.filtroClienteCtrl.valueChanges.subscribe(valor => {
      this.filtrarClientes(valor);
    });       

    // Escucha los cambios del input de búsqueda
    this.filtroMotivoCtrl.valueChanges.subscribe(valor => {
      this.filtrarMotivos(valor);
    });    
    
    // Aqui el set para el formulario de Nuevo Caso
    this.formulario.get('partida')?.valueChanges.subscribe(valor => {
      if (!valor || valor.length < 5) {
        this.formulario.patchValue({
          clientePartida: '',
          unidadNegocio: ''
        });

      }
    });
        
    console.log('data', this.data.Tipo);
  }

  onMotivoSeleccionado(event: any){

    const valor = String(event.value); 
    const descripcion = String(event.source.triggerValue);    

    this._glb_id_motivo = valor;
    this._glb_motivo = descripcion;

  }

  onAreaSeleccionado(event: any){

    const valor = Number(event.value); 
    const descripcion = String(event.source.triggerValue);

    this._glb_id_area = valor;
    this._glb_descripcion_area = descripcion;

    this.usuariosFilter = this.usuarios.filter((tipo: any) =>
      tipo.acronimo === 'US' && tipo.idArea === valor
    );    

  }

  onUsuarioSeleccionado(event: any){

    const valor = String(event.value); 
    const descripcion = String(event.source.triggerValue);    

    this._glb_id_Usuario = valor;
    this._glb_Usuario = descripcion;    

  }

  onLoadUsuarioResponsable(){
    this.registroQuejasReclamosService.obtenerEstados().subscribe({
      next: (response) => {
        this.usuarios = response.elements.filter((tipo: any) => tipo.acronimo === 'US');
        console.log('usuarios', this.usuarios);
      },
      error: (err) => {
        console.error('Error al obtener Estados', err);
      }
    });
    
  }

  onLoadAreaResponsable(){

    this.registroQuejasReclamosService.obtenerUsuarioResponsable().subscribe({
      next: (response) => {
        this.areas = response.elements;
      },
      error: (err) => {
        console.error('Error al obtenerUsuarioResponsable', err);
      }
    });    

  }

  onLoadMotivos(){

    this.registroQuejasReclamosService.obtenerMotivoReclamo().subscribe({
      next: (response) => {
        this.motivos    = response.elements;
        console.log('this.motivos', this.motivos);
      },
      error: (err) => {
        console.error('Error al obtener motivoReclamo', err);
      }
    });

  }

  filtrarMotivos(valor: string) {
    const filtro = valor.toLowerCase();
    this.motivosFiltrados = this.motivos.filter(motivo =>
      motivo.descripcion.toLowerCase().includes(filtro)
    );
  }    

  onLoadCliente(){
    this.clientes = [];
    this.registroQuejasReclamosService.obtenerClientes().subscribe({
      next: (response) => {
        if (response.elements.length > 0)
          this.clientes = response.elements;
          console.log('onLoadCliente:', response); 
      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
      }
    });  
  }

  filtrarClientes(valor: string) {
    const filtro = valor.toLowerCase();
    this.clienteFiltrados = this.clientes.filter(usuario =>
      usuario.nom_Cliente.toLowerCase().includes(filtro)
    );
  }   

  onLoadUnidadNegocio(){
    this.registroQuejasReclamosService.ListaUnidadNegocio().subscribe({
      next: (response) => {
        this.unidadNegocio = response.elements;
        console.log('Unidad Negocio ', this.unidadNegocio);
      },
      error: (err) => {
        console.error('Error al obtener Unidad Negocio', err);
      }
    });
  }

  onLoadTemporada(Cod_Cliente: string){
      this.temporadas = [];
      this.registroQuejasReclamosService.getObtieneTemporada(Cod_Cliente).subscribe(
        (result: any) => {
          if (result.totalElements > 0) {
            this.temporadas = result.elements;
          }
          else {
            this.estilos = [];
            console.log('No existen registros..!!');
            //this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
      })); 
  }  

  onLoadEstilo(Cod_Cliente: string, sTemporada: string){
      this.estilos = [];
      this.registroQuejasReclamosService.getObtieneEstilo(Cod_Cliente, sTemporada).subscribe(
        (result: any) => {
          if (result.totalElements > 0) {
            this.estilos = result.elements;
          }
          else {
            console.log('No existen registros..!!');
            //this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
      })); 
  }  

  tipoSeleccionado: string = '';

  onTipoRegistroChange(valor: string) {
    this.tipoSeleccionado = valor;
    // Opcional: resetear campos específicos
    if (valor === 'PARTIDA') {
      this.formulario.patchValue({ temporada: null, estiloCliente: null });
    } else if (valor === 'ESTILO_CLIENTE') {
      this.formulario.patchValue({ partida: null, unidadNegocio: null });
    }
    this.actualizarColumnas();
  }

  actualizarColumnas() { 
    const tipo = this.formulario.get('tipoRegistro')?.value; 
    
    if (tipo === 'PARTIDA') { 
      this.displayedColumns = [...this.displayedColumns]; 
    } else if (tipo === 'ESTILO_CLIENTE') { 
      this.displayedColumns = [...this.displayedColumnsEstilo]; 
    } 
  }  
  
  onClienteSeleccionado(event: any){
    const valor = String(event.value); 
    const descripcion = String(event.source.triggerValue);    
    
    console.log('cliente',descripcion);

    this._glb_Cliente = descripcion;

    this.onLoadTemporada(valor);
  }

  onTemporadaSeleccionado(event: any){
    const sCliente: string =  this.formulario.get('cliente')?.value;
    const valor = String(event.value);
    const descripcion = String(event.source.triggerValue);   
    
    this._glb_temporada = descripcion;

    this.onLoadEstilo(sCliente, valor);
  }   

  onEstiloSeleccionado(event: any){
    const valor = String(event.value);
    const descripcion = String(event.source.triggerValue);   
    
    this._glb_estilo = descripcion;
  }

  buscarTelasXPartida(){

    this.arrayArticulos = [];

     const sCodOrdtra = this.formulario.get('partida')?.value;
     this.registroQuejasReclamosService.buscarPorPartida(sCodOrdtra).subscribe({
      next: (data) => {
        //console.log('buscarTelasXPartida', data);
        if (data.elements.length > 0){

          const dialogRef = this.dialog.open(ModalSeleccionPartidaQrComponent, {
            width: '550px',
            data: data.elements
          });
          dialogRef.afterClosed().subscribe(result => {

            if (result){

              //Agregamos la lista obtenida a nuestro array
              this.arrayArticulos.push(...result);

              const sArticulos: any[] = [];
              result.forEach(element => {
                let codArticulo = String(element.cod_Tela).substring(0, 8);
                sArticulos.push(codArticulo);
              });
              //Une los articulos en una sola linea separado por coma(,)
              const articulosConcatenados = sArticulos.join(",");
              const sCodCliente = result[0].cod_Cliente_Tex;
              const sCodUnidadMedida = result[0].id_Unidad_NegocioKey;
              
              this.formulario.get('clientePartida')?.setValue(String(sCodCliente));
              this.formulario.get('unidadNegocio')?.setValue(String(sCodUnidadMedida));

              this.cadenaCodOrdtra = articulosConcatenados;
              this._glb_Cliente =  String(result[0].nom_Cliente);
              
              //Asigna Valores de los articuloes seleccionados
              //this.nuevoReclamo.cadenaCodOrdtra = articulosConcatenados;
              // this.nuevoReclamo.cod_Cliente_Tex = result[0].cod_Cliente_Tex;
              // this.nuevoReclamo.cliente =   String(result[0].nom_Cliente);
              // this.nuevoReclamo.cod_Unidad_Negocio = String(result[0].id_Unidad_NegocioKey);
              // this.nuevoReclamo.des_Unidad_Negocio = String(result[0].des_Unidad_NegocioKey);
              console.log('cliente', result[0].cod_Cliente_Tex);

            }
      
          });          

        }

      },
      error: (err) => {
        // this.isLoading = false;
        // this.sinResultados = true;
        console.error('Error al buscar partida:', err);
      }      
     });
  };    

  agregarDetalle(){

    const codigosTela = this.cadenaCodOrdtra.split(',').map(c => c.trim());
    const tipo = this.formulario.get('tipoRegistro')?.value;
    const sNroPartida = this.formulario.get('partida')?.value || '';
    const sCliente = this.formulario.get('clientePartida')?.value || '';    
    const sUnidadNegocio = this.formulario.get('unidadNegocio')?.value || '0';   
    const sClienteEst = this.formulario.get('cliente')?.value || '';    
    const sTemporada = this.formulario.get('temporada')?.value || '';    
    const sEstilo = this.formulario.get('estilo')?.value || '';    
    const sObservacion = this.formulario.get('observacion')?.value || '';    

    // 2. Validar cada código contra la grilla actual 
    for (const codTela of codigosTela) { 
        const yaExiste = this.reclamos.some(item => item.cod_Tela === codTela); 
        if (yaExiste) { 
            this.matSnackBar.open(`El código de tela ${codTela} ya existe en el detalle.`, 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            });            
            return; // corta el proceso si encuentra duplicado 
            } 
        }    

    //VALIDACION     - 01
    if (tipo === 'PARTIDA') {

      if (sCliente == '' || sNroPartida == '' || sUnidadNegocio == ''){
        this.matSnackBar.open("Seleccione datos validos para el tipo partida.", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });
        return;          
      }

    } else if (tipo === 'ESTILO_CLIENTE') {

      if (sClienteEst == '' || sTemporada == '' || sEstilo == ''){
        this.matSnackBar.open("Seleccione datos validos para el tipo estilo.", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });
        return;          
      }        
    }

    //VALIDACION     - 02
    const sArea = this.formulario.get('areaResponsable')?.value || '';   
    const sResponsable = this.formulario.get('usuarioResponsable')?.value || '';   
    const sMotivo = this.formulario.get('motivo')?.value || '';   

    if (sArea == ''){
      this.matSnackBar.open("Seleccione area responsable.", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;          
    }     

    if (sResponsable == ''){
      this.matSnackBar.open("Seleccione usuario responsable.", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;          
    }     
    
    if (sMotivo == ''){
      this.matSnackBar.open("Seleccione un motivo.", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;          
    }

    //Datos comunes
    //Area
    const area  = this.formulario.get('areaResponsable')?.value;
    const sDesArea = this._glb_descripcion_area;

    //Responsable
    const userAsignado = this.formulario.get('usuarioResponsable')?.value;
    const sDesUserAsignado = this._glb_Usuario;    

    //Motivo
    const motivo = this.formulario.get('motivo')?.value;
    const sDesMotivo = this._glb_motivo;    
    
    //Llena Informacion segun el tipo Elegido
    if (tipo === 'PARTIDA'){
      this.arrayArticulos.forEach(element => {

        let codTela      = String(element.cod_Tela) ;
        let desTela      = String(element.des_Tela) ;
        let codColor     = String(element.cod_Color);
        let desColor     = String(element.des_Color);
        let numSecuencia = Number(element.num_Secuencia);      

        const reclamoReg: ReclamoCliente = {
          id: 0,
          cliente: this._glb_Cliente,
          cod_Ordtra: tipo === 'PARTIDA'? sNroPartida: '',    
          unidadNegocio   : '',  

          //Estilo
          Cod_TemCli: '',
          Cod_EstCli: '',          

          tipoRegistro: sDesUserAsignado,//this.nuevoReclamo.tipoRegistro, //tmr este weon  crea variables atorrantes --> Tipo de Area no es?
          estadoSolicitud : 'Abierto',
        

          responsable     : sDesArea,//this.nuevoReclamo.responsable,
          motivoRegistro  : sDesMotivo,
          usuarioRegistro : this.sCod_Usuario,
          observacion     : sObservacion,

          //Campos Nuevos
          cadenaCodOrdtra : this.cadenaCodOrdtra,
          cod_Tela        : codTela,
          des_Tela        : desTela,
          cod_Color       : codColor,
          des_Color       : desColor,
          num_Secuencia   : numSecuencia,
          cod_Unidad_Negocio  : sUnidadNegocio,
          des_Unidad_Negocio  : "UNIDAD PRUEBA",//cuando tegresoses mostrar la descripcion da la unidad de negocio.
          cod_Cliente_Tex     : tipo === 'PARTIDA'? sCliente: sClienteEst,
          cod_Motivo          : motivo,
          idArea              : Number(area),
          idResponsable       : Number(userAsignado),
          archivoAdjunto      : null
        };      
        this.reclamos.push(reclamoReg);
      });
    } else {

        const reclamoReg: ReclamoCliente = {
          id: 0,
          cliente: this._glb_Cliente,
          cod_Ordtra: ' ',    
          unidadNegocio   : ' ', 

          //Temporada
          Cod_TemCli :  sTemporada, 
          temporada: this._glb_temporada,
          //Estilo
          Cod_EstCli: sEstilo,
          estilo: this._glb_estilo,

          tipoRegistro: this._glb_Usuario,//this.nuevoReclamo.tipoRegistro, //tmr este weon  crea variables atorrantes --> Tipo de Area no es?
          estadoSolicitud : 'Abierto',

          responsable     : sDesArea,//this.nuevoReclamo.responsable,
          motivoRegistro  : sDesMotivo,
          usuarioRegistro : this.sCod_Usuario,
          observacion     : sObservacion,

          //Campos Nuevos
          cadenaCodOrdtra : this.cadenaCodOrdtra,
          cod_Tela        : ' ',
          des_Tela        : ' ',
          cod_Color       : ' ',
          des_Color       : ' ',
          num_Secuencia   : 0,
          cod_Unidad_Negocio  : sUnidadNegocio,
          des_Unidad_Negocio  : "UNIDAD PRUEBA",//cuando tegresoses mostrar la descripcion da la unidad de negocio.
          cod_Cliente_Tex     : tipo === 'PARTIDA'? sCliente: sClienteEst,
          cod_Motivo          : motivo,
          idArea              : Number(area),
          idResponsable       : Number(userAsignado),
          archivoAdjunto      : null
        };       
        this.reclamos.push(reclamoReg);
    }

    //Limpia Cabeceras
    this.limpiar();

    console.log('this.reclamos', this.reclamos);
    this.dataSource.data = [...this.reclamos];

  }

  cerrarModal(){
    this.dialogRef.close();
  }

  guardar(){

      Swal.fire({
        title: '¿Desea generar el caso / reclamo?, Confirme',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {   
         if (result.isConfirmed) {

            const formData = new FormData();
            this.reclamos.forEach((reclamo, index) => {


              formData.append(`reclamos[${index}][id]`, reclamo.id);
              formData.append(`reclamos[${index}][nroCaso]`, reclamo.nroCaso);
              formData.append(`reclamos[${index}][cliente]`, reclamo.cliente);
              //formData.append(`reclamos[${index}][tipoRegistro]`, reclamo.tipoRegistro);
              formData.append(`reclamos[${index}][tipoRegistro]`, reclamo.tipoRegistro  || '');
              formData.append(`reclamos[${index}][unidadNegocio]`, reclamo.unidadNegocio || '');
              formData.append(`reclamos[${index}][usuarioRegistro]`, reclamo.usuarioRegistro  || '');
              //formData.append(`reclamos[${index}][responsable]`, reclamo.responsable || '');
              formData.append(`reclamos[${index}][responsable]`, reclamo.responsable || '');
              formData.append(`reclamos[${index}][motivoRegistro]`, reclamo.motivoRegistro || '');
              formData.append(`reclamos[${index}][estadoSolicitud]`, reclamo.estadoSolicitud || 'Abierto');
              formData.append(`reclamos[${index}][observacion]`, reclamo.observacion);   
              formData.append(`reclamos[${index}][archivoAdjunto]`, reclamo.archivoAdjunto);
              
              /*if (reclamo.archivoAdjunto) {
                formData.append(`reclamos[${index}][archivoAdjunto]`, this.nuevoReclamo.archivoAdjunto);
              }*/

              //CAMPOS NUEVOS
              formData.append(`reclamos[${index}][cod_Cliente_Tex]`, reclamo.cod_Cliente_Tex);
              formData.append(`reclamos[${index}][cod_Ordtra]`     , reclamo.cod_Ordtra);
              formData.append(`reclamos[${index}][cod_Tela]`       , reclamo.cod_Tela);
              formData.append(`reclamos[${index}][cod_Color]`      , reclamo.cod_Color);
              formData.append(`reclamos[${index}][cod_Unidad_Negocio]`, reclamo.cod_Unidad_Negocio || 0);
              formData.append(`reclamos[${index}][cod_Motivo]`        , reclamo.cod_Motivo);
              formData.append(`reclamos[${index}][idArea]`        , String(reclamo.idArea));
              formData.append(`reclamos[${index}][idResponsable]`        , String(reclamo.idResponsable));
              //Nuevos Campos
              formData.append(`reclamos[${index}][Cod_TemCli]`        , reclamo.Cod_TemCli);
              formData.append(`reclamos[${index}][Cod_EstCli]`        , reclamo.Cod_EstCli);
              
              //Falta Pasar el Area y responsable asignarle el valor.

            });
            this.registroQuejasReclamosService.enviarReclamo(formData).subscribe({
              next: () => {
                //alert('✅ Todos los reclamos fueron enviados correctamente.');
               this.toastr.success('Todos los reclamos fueron enviados correctamente.', '', {
                      timeOut: 2500,
                    });

                this.reclamos = []; // Limpiar lista si quieres
                this.dialogRef.close();
                //this.nuevoReclamo = {};
                //this.buscar()
                //this.ActivarFormulario = true;

              },              
            });

         }
      });    

  }

  eliminarReclamo(row: any){
      const sCodTela: string = String(row.cod_Tela);
      this.reclamos = this.reclamos.filter(item => item.cod_Tela !== sCodTela);
      this.dataSource.data = [...this.reclamos]; // refresca la grilla
  }
  
  limpiar(){
    //PARTIDA
    this.formulario.get('partida')?.setValue('');
    this.formulario.get('clientePartida')?.reset();
    this.formulario.get('unidadNegocio')?.reset();
    //ESTILO
    this.formulario.get('cliente')?.reset();
    this.formulario.get('temporada')?.reset();
    this.formulario.get('estilo')?.reset(); 
    //COMUNES
    this.formulario.get('areaResponsable')?.reset();
    this.formulario.get('usuarioResponsable')?.reset();
    this.formulario.get('motivo')?.reset();
    this.formulario.get('observacion')?.setValue('');
    //REINICIA LAS GLOBALES
    this.cadenaCodOrdtra = '';
    this._glb_Cliente = '';
    this._glb_id_area = 0;
    this._glb_descripcion_area = '';
    this._glb_id_Usuario = '';
    this._glb_Usuario = '';
    this._glb_id_motivo = '';
    this._glb_motivo = '';   
    
    this._glb_temporada = '';
    this._glb_estilo = '';
  }

  verArchivo(nombreArchivo: string) {
      this.registroQuejasReclamosService.verArchivo(nombreArchivo);
  }  

  onArchivoSeleccionado(event: Event, row: any): void {


  console.log('onArchivoSeleccionado', row);
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    console.log('input.files:', input.files);
    const archivo = input.files[0];
    console.log('archivo:', archivo);
    //.reclamos[index].archivoAdjuntoSeleccionado = archivo;
    //this.reclamos[index].archivoAdjunto = archivo;
    //this._glb_file = input;
    //this.reclamos[index].nombreArchivo = archivo.name;

    row.archivoAdjunto = archivo;
  }
  console.log('AgregarReclamo:', this.reclamos);
}


}
