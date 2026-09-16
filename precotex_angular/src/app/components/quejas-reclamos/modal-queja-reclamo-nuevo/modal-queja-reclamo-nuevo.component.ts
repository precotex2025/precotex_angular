import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
import { forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

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
  @ViewChild('inputPartida') inputPartida!: ElementRef;

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
  
  displayedColumns: string[] = []; // columnas activas
  displayedColumnsPartida: string[] = [
    // 'id'        ,
    'partida'   ,
    'cliente'   ,
     'tela'      ,
     'color'     ,
       'unidad'  ,
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

  displayedColumnsCliente: string[] = [
    'cliente'   ,
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
  sCodTrabajador = GlobalVariable.vcodtra;

  codArea: string = ""; //01 - Comercial; 02 - Calidad

  //Botones
  flgBtnAgregar : boolean = false;
  flgBtnguardar : boolean = false;
  flgBtnLimpiar : boolean = false;
  flgBtnEnviar  : boolean = true;


  constructor(
     public  dialogRef      : MatDialogRef<ModalQuejaReclamoNuevoComponent>,
     private registroQuejasReclamosService: RegistroQuejasReclamosService  ,
     private formBuilder    : FormBuilder     ,
     private matSnackBar    : MatSnackBar     ,
     private dialog         : MatDialog       ,
     private toastr         : ToastrService   ,
     private SpinnerService      : NgxSpinnerService,
     @Inject(MAT_DIALOG_DATA) public data: data                   ,

  ) { }

  ngOnInit(): void {

    console.log('mis datos', this.data.Datos)

    this.formulario.get('clientePartida')?.disable();
    this.formulario.get('unidadNegocio')?.disable();

    //Validar.
    if (this.data.Tipo == "E"){
      this.formulario.get('tipoRegistro')?.disable();
      if(this.data.Datos.tipo == "ESTILO"){
        this.formulario.get('tipoRegistro')?.setValue('ESTILO_CLIENTE');
        this.displayedColumns = [...this.displayedColumnsEstilo];
      }else if(this.data.Datos.tipo == "CLIENTE"){
        this.formulario.get('tipoRegistro')?.setValue('CLIENTE');
        this.displayedColumns = [...this.displayedColumnsCliente];
      }else{
        this.formulario.get('tipoRegistro')?.setValue('PARTIDA');
        this.displayedColumns = [...this.displayedColumnsPartida];
      }
      
      //filtro
      var values = {
        Id: this.data.Datos.id,
        NroCaso: this.data.Datos.nroCaso
      };


      forkJoin({
        reclamos: this.registroQuejasReclamosService.obtenerDetReclamos(values)
      }).subscribe({
        next: ({ reclamos }) => {

            if(this.data.Datos.tipo == "ESTILO"){
              reclamos.elements.forEach(element => {
                const reclamoReg = this.construirReclamoEstilo(element);
                this.reclamos.push(reclamoReg);
              });
            }else if(this.data.Datos.tipo == "C"){
              reclamos.elements.forEach(element => {
                const reclamoReg = this.construirReclamoCliente(element);
                this.reclamos.push(reclamoReg);
              });
            }else {
              reclamos.elements.forEach(element => {
                const reclamoReg = this.construirReclamoPartida(element);
                this.reclamos.push(reclamoReg);
              });
            }

            this.dataSource.data = [...this.reclamos];

            
          //this.dataSource.data = reclamos.elements;
          //this.reclamos = reclamos.elements;
          //console.log('reclamos Inicial', this.reclamos);
        },
        error: (err) => {
          console.error('Error al obtener datos:', err);
        }        
      });
    } else {
      console.log('nuevo');
      this.tipoSeleccionado = this.formulario.get('tipoRegistro')?.value;
      this.actualizarColumnas()
      this.formulario.get('tipoRegistro')?.valueChanges.subscribe(() => { this.actualizarColumnas(); });
    }
    console.log('this.sCodTrabajador', this.sCodTrabajador);
    this.onObtieneUsuarioArea(this.sCodTrabajador);
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
          unidadNegocio: '',
          areaResponsable: '',
          usuarioResponsable: '',
          motivo: '',
          observacion: ''
        });

        this.filtroMotivoCtrl.setValue('');

        //Datos del escaneo de partida ya no son validos
        this.cadenaCodOrdtra = '';
        this.arrayArticulos = [];
        this._glb_Cliente = '';
        this._glb_id_area = 0;
        this._glb_descripcion_area = '';
        this._glb_id_Usuario = '';
        this._glb_Usuario = '';
        this._glb_id_motivo = '';
        this._glb_motivo = '';
      }
    });
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
      this.formulario.patchValue({ temporada: null, estilo: null });
      this._glb_temporada = '';
      this._glb_estilo = '';
    } else if (valor === 'ESTILO_CLIENTE') {
      this.formulario.patchValue({ partida: null, unidadNegocio: null });
    } else if (valor === 'CLIENTE') {
      this.formulario.patchValue({ partida: null, unidadNegocio: null, temporada: null, estilo: null });
      this._glb_temporada = '';
      this._glb_estilo = '';
    }
    this.actualizarColumnas();
  }

  actualizarColumnas() { 
    const tipo = this.formulario.get('tipoRegistro')?.value; 
    
    if (tipo === 'PARTIDA') {
      console.log('entro a partida');
      this.displayedColumns = [...this.displayedColumnsPartida];
    } else if (tipo === 'ESTILO_CLIENTE') {
      this.displayedColumns = [...this.displayedColumnsEstilo];
    } else if (tipo === 'CLIENTE') {
      this.displayedColumns = [...this.displayedColumnsCliente];
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

              const sCodCliente = result[0].cod_Cliente_Tex;

              //Validar que la partida sea del mismo cliente que el detalle ya agregado
              if (this.reclamos.length > 0 && this.reclamos[0].cod_Cliente_Tex !== String(sCodCliente)) {
                this.alertaClienteDistinto(String(result[0].nom_Cliente), this.reclamos[0].cliente);
                this.formulario.get('partida')?.setValue('');
                return;
              }

              //Agregamos la lista obtenida a nuestro array
              this.arrayArticulos.push(...result);

              const sArticulos: any[] = [];
              result.forEach(element => {
                let codArticulo = String(element.cod_Tela).substring(0, 8);
                sArticulos.push(codArticulo);
              });
              //Une los articulos en una sola linea separado por coma(,)
              const articulosConcatenados = sArticulos.join(",");
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
   

    //VALIDACION     - 00
    if (tipo === 'PARTIDA') {

      if (sCliente == '' || sNroPartida == '' || sUnidadNegocio == ''){
        this.matSnackBar.open("Seleccione datos validos para el tipo partida.", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });
        return;
      }

      if (this.reclamos.length > 0 && this.reclamos[0].cod_Cliente_Tex !== sCliente) {
        const nombreNuevoCliente = this.clientes.find(c => c.cod_Cliente_Tex === sCliente)?.nom_Cliente || sCliente;
        this.alertaClienteDistinto(nombreNuevoCliente, this.reclamos[0].cliente);
        return;
      }

    } else if (tipo === 'ESTILO_CLIENTE') {

      if (sClienteEst == '' || sTemporada == '' || sEstilo == ''){
        this.alertaAdvertencia('Seleccione datos válidos para el tipo estilo (cliente, temporada y estilo propio).');
        return;
      }

      if (this.reclamos.length > 0 && this.reclamos[0].cod_Cliente_Tex !== sClienteEst) {
        const nombreNuevoCliente = this.clientes.find(c => c.cod_Cliente_Tex === sClienteEst)?.nom_Cliente || sClienteEst;
        this.alertaClienteDistinto(nombreNuevoCliente, this.reclamos[0].cliente);
        return;
      }

      const yaExisteTemporada = this.reclamos.some(item => item.Cod_TemCli === sTemporada);
      if (yaExisteTemporada) {
        this.alertaAdvertencia(`Ya existe un detalle registrado para la temporada <b>${this._glb_temporada}</b>.<br><br>No se puede repetir la misma temporada en el mismo caso.`);
        return;
      }

    } else if (tipo === 'CLIENTE') {

      if (sClienteEst == '') {
        this.alertaAdvertencia('Seleccione un cliente para el tipo cliente.');
        return;
      }

      if (this.reclamos.length > 0 && this.reclamos[0].cod_Cliente_Tex !== sClienteEst) {
        const nombreNuevoCliente = this.clientes.find(c => c.cod_Cliente_Tex === sClienteEst)?.nom_Cliente || sClienteEst;
        this.alertaClienteDistinto(nombreNuevoCliente, this.reclamos[0].cliente);
        return;
      }

      const sMotivoActual = this.formulario.get('motivo')?.value || '';
      if (sMotivoActual !== '' && this.reclamos.some(item => item.cod_Motivo === sMotivoActual)) {
        const nombreMotivo = this.motivos.find(m => m.cod_Motivo === sMotivoActual)?.descripcion || sMotivoActual;
        this.alertaAdvertencia(`Ya existe un detalle registrado con el motivo <b>${nombreMotivo}</b>.<br><br>No se puede repetir el mismo motivo en el mismo caso.`);
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

    // 1. Validar que sea el mismo cliente el cual se esta agregando.
    let clienteActual = '';
    if (tipo === 'PARTIDA') { 
      clienteActual = sCliente; 
    } else if (tipo === 'ESTILO_CLIENTE') { 
      clienteActual = sClienteEst; 
    }    
    // const codClienteExis = this.reclamos[0][0]?.cod_Cliente_Tex;
    // if (codClienteExis !== clienteActual) { 
    //     this.matSnackBar.open(`El cliente del detalle no coincide con el cliente del caso.`, 'Cerrar', {
    //       horizontalPosition: 'center',
    //       verticalPosition: 'top',
    //       duration: 1500,
    //     });      
    //     return; 
    // }   

    //2. Validar cada código contra la grilla actual 
    for (const codTela of codigosTela) { 
        const yaExiste = this.reclamos.some(item => item.cod_Tela === codTela); 
        if (yaExiste) {
            this.alertaAdvertencia(`El código de tela <b>${codTela}</b> ya existe en el detalle.<br><br>No se puede repetir la misma tela en el mismo caso.`);
            return; // corta el proceso si encuentra duplicado
            }
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

    //Unidad de Negocio
    const sDesUnidadNegocio = this.unidadNegocio.find(u => u.cod_Unidad_Negocio === sUnidadNegocio)?.des_Unidad_Negocio || '';


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
          cod_Ordtra: sNroPartida,
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
          des_Unidad_Negocio  : sDesUnidadNegocio,
          cod_Cliente_Tex     : sCliente,
          cod_Motivo          : motivo,
          idArea              : Number(area),
          idResponsable       : Number(userAsignado),
          archivoAdjunto      : null,
          tipoQueja           : 'P'
        };
        this.reclamos.push(reclamoReg);
      });
    } else if (tipo === 'CLIENTE') {

        //Tipo CLIENTE: no hay partida, unidad de negocio, temporada ni estilo -> se envian vacios/0 (nunca null)
        const reclamoReg: ReclamoCliente = {
          id: 0,
          cliente: this._glb_Cliente,
          cod_Ordtra: '',
          unidadNegocio   : '',

          Cod_TemCli: '',
          temporada: '',
          Cod_EstCli: '',
          estilo: '',

          tipoRegistro: this._glb_Usuario,
          estadoSolicitud : 'Abierto',

          responsable     : sDesArea,
          motivoRegistro  : sDesMotivo,
          usuarioRegistro : this.sCod_Usuario,
          observacion     : sObservacion,

          cadenaCodOrdtra : '',
          cod_Tela        : '',
          des_Tela        : '',
          cod_Color       : '',
          des_Color       : '',
          num_Secuencia   : 0,
          cod_Unidad_Negocio  : '0',
          des_Unidad_Negocio  : '',
          cod_Cliente_Tex     : sClienteEst,
          cod_Motivo          : motivo,
          idArea              : Number(area),
          idResponsable       : Number(userAsignado),
          archivoAdjunto      : null,
          tipoQueja           : 'C'
        };
        this.reclamos.push(reclamoReg);

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
          des_Unidad_Negocio  : sDesUnidadNegocio,
          cod_Cliente_Tex     : sClienteEst,
          cod_Motivo          : motivo,
          idArea              : Number(area),
          idResponsable       : Number(userAsignado),
          archivoAdjunto      : null,
          tipoQueja           : 'E'
        };
        this.reclamos.push(reclamoReg);
    }

    console.log('this.reclamos agregar', this.reclamos);
    if (this.data.Tipo == "E"){
      this.dataSource.data = [...this.reclamos[0]];
    }else{
      this.dataSource.data = [...this.reclamos];
    }

    this.actualizarEstadoTipoRegistro();

    if (tipo === 'PARTIDA') {
      setTimeout(() => this.inputPartida?.nativeElement.focus(), 0);
    }
  }

  private codigoTipoQueja(tipo: string): string {
    if (tipo === 'PARTIDA') return 'P';
    if (tipo === 'ESTILO_CLIENTE') return 'E';
    if (tipo === 'CLIENTE') return 'C';
    return '';
  }

  private mensajeExito(mensaje: string, alCerrar?: () => void): void {
    Swal.fire({
      icon: 'success',
      title: '¡Listo!',
      text: mensaje,
      confirmButtonColor: '#2e7d32',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      if (alCerrar) {
        alCerrar();
      }
    });
  }

  private mensajeError(mensaje: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Ocurrió un problema',
      text: mensaje,
      confirmButtonColor: '#c62828',
      confirmButtonText: 'Entendido'
    });
  }

  private alertaAdvertencia(mensaje: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      html: mensaje,
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Entendido'
    });
  }

  private alertaClienteDistinto(clienteNuevo: string, clienteExistente: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Cliente diferente',
      html: `Esta partida pertenece a <b>${clienteNuevo}</b>, pero este caso ya tiene detalles del cliente <b>${clienteExistente}</b>.<br><br>No se pueden mezclar partidas de distintos clientes en el mismo caso.`,
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Entendido'
    });
  }

  private actualizarEstadoTipoRegistro(): void {
    if (this.data.Tipo == "E") {
      return;
    }
    if (this.reclamos.length > 0) {
      this.formulario.get('tipoRegistro')?.disable();
    } else {
      this.formulario.get('tipoRegistro')?.enable();
    }
  }

  claseEstado(estado: string): string {
    const valor = String(estado || '').toLowerCase();
    if (valor.includes('abiert')) return 'estado-abierto';
    if (valor.includes('proceso') || valor.includes('pendient')) return 'estado-proceso';
    if (valor.includes('cerrad') || valor.includes('resuelt') || valor.includes('finaliz')) return 'estado-cerrado';
    if (valor.includes('rechaz') || valor.includes('anulad')) return 'estado-rechazado';
    return 'estado-default';
  }

  iconoEstado(estado: string): string {
    const valor = String(estado || '').toLowerCase();
    if (valor.includes('abiert')) return 'lock_open';
    if (valor.includes('proceso') || valor.includes('pendient')) return 'hourglass_top';
    if (valor.includes('cerrad') || valor.includes('resuelt') || valor.includes('finaliz')) return 'check_circle';
    if (valor.includes('rechaz') || valor.includes('anulad')) return 'cancel';
    return 'radio_button_checked';
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
            formData.append('tipoQueja', this.codigoTipoQueja(this.tipoSeleccionado));
            this.reclamos.forEach((reclamo, index) => {


              formData.append(`reclamos[${index}][id]`, reclamo.id ?? 0);
              formData.append(`reclamos[${index}][nroCaso]`, reclamo.nroCaso);
              formData.append(`reclamos[${index}][cliente]`, reclamo.cliente || '');
              //formData.append(`reclamos[${index}][tipoRegistro]`, reclamo.tipoRegistro);
              formData.append(`reclamos[${index}][tipoRegistro]`, reclamo.tipoRegistro  || '');
              formData.append(`reclamos[${index}][unidadNegocio]`, reclamo.unidadNegocio || '');
              formData.append(`reclamos[${index}][tipoQueja]`, reclamo.tipoQueja || '');
              formData.append(`reclamos[${index}][usuarioRegistro]`, reclamo.usuarioRegistro  || '');
              //formData.append(`reclamos[${index}][responsable]`, reclamo.responsable || '');
              formData.append(`reclamos[${index}][responsable]`, reclamo.responsable || '');
              formData.append(`reclamos[${index}][motivoRegistro]`, reclamo.motivoRegistro || '');
              formData.append(`reclamos[${index}][estadoSolicitud]`, reclamo.estadoSolicitud || 'Abierto');
              formData.append(`reclamos[${index}][observacion]`, reclamo.observacion || '');
              formData.append(`reclamos[${index}][archivoAdjunto]`, reclamo.archivoAdjunto || '');
              
              /*if (reclamo.archivoAdjunto) {
                formData.append(`reclamos[${index}][archivoAdjunto]`, this.nuevoReclamo.archivoAdjunto);
              }*/

              //CAMPOS NUEVOS
              formData.append(`reclamos[${index}][cod_Cliente_Tex]`, reclamo.cod_Cliente_Tex || '');
              formData.append(`reclamos[${index}][cod_Ordtra]`     , reclamo.cod_Ordtra || '');
              formData.append(`reclamos[${index}][cod_Tela]`       , reclamo.cod_Tela || '');
              formData.append(`reclamos[${index}][cod_Color]`      , reclamo.cod_Color || '');
              formData.append(`reclamos[${index}][cod_Unidad_Negocio]`, reclamo.cod_Unidad_Negocio || 0);
              formData.append(`reclamos[${index}][cod_Motivo]`        , reclamo.cod_Motivo || '');
              formData.append(`reclamos[${index}][idArea]`        , String(reclamo.idArea ?? 0));
              formData.append(`reclamos[${index}][idResponsable]`        , String(reclamo.idResponsable ?? 0));
              //Nuevos Campos
              formData.append(`reclamos[${index}][Cod_TemCli]`        , reclamo.Cod_TemCli || '');
              formData.append(`reclamos[${index}][Cod_EstCli]`        , reclamo.Cod_EstCli || '');
              
              //Falta Pasar el Area y responsable asignarle el valor.

            });
            this.registroQuejasReclamosService.enviarReclamo(formData).subscribe({
              next: () => {
                this.reclamos = [];
                this.mensajeExito('El caso / reclamo se generó correctamente.', () => this.dialogRef.close());
              },
              error: (err) => {
                console.error('Error al guardar el reclamo:', err);
                this.mensajeError('Ocurrió un problema al guardar el caso. Intenta nuevamente.');
              }
            });

         }
      });    

  }

  eliminarReclamo(row: any){
      const sCodTela: string = String(row.cod_Tela);
      this.reclamos = this.reclamos.filter(item => item.cod_Tela !== sCodTela);
      this.dataSource.data = [...this.reclamos]; // refresca la grilla
      this.actualizarEstadoTipoRegistro();
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

    //LIMPIA FILTROS DE BUSQUEDA (CLIENTE Y MOTIVO)
    this.filtroClienteCtrl.setValue('');
    this.filtroMotivoCtrl.setValue('');
  }

  limpiarTodo(){
    this.limpiar();

    //REINICIA LA GRILLA Y ARTICULOS SELECCIONADOS
    this.reclamos = [];
    this.dataSource.data = [];
    this.arrayArticulos = [];

    //REINICIA EL TIPO DE REGISTRO AL VALOR INICIAL
    this.formulario.get('tipoRegistro')?.setValue('PARTIDA');

    //RE-HABILITA EL TIPO DE REGISTRO (por si quedó bloqueado)
    this.actualizarEstadoTipoRegistro();
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

  onObtieneUsuarioArea(sCodTrabajador: string){

    this.registroQuejasReclamosService.ObtieneUsuarioArea(sCodTrabajador).subscribe({
      next: (response) => {
        if(response.success){
            if (response.totalElements > 0) {

                const area =  response.elements[0]?.cod_Area;
                console.log('area x', area);
                //console.log('estado x', this.data.Datos.cod_Estado);

                if (this.data.Tipo == "E"){
              
                  //if (area.trim() === '01' && this.data.Datos.cod_Estado.trim() === '01') {
                  if ((area.trim() === '01' || area.trim() === '02') && this.data.Datos.cod_Estado.trim() === '01') {
                    console.log('Marca 100');
                    this.flgBtnAgregar = true;
                    this.flgBtnguardar = true;
                    this.flgBtnLimpiar = true;
                    //this.flgBtnEnviar = true;
                  }

                  if ((area.trim() === '01' || area.trim() === '02') && this.data.Datos.cod_Estado.trim() >= '02') {
                    console.log('Marca 101');
                    this.flgBtnAgregar = true;
                    this.flgBtnguardar = true;
                    this.flgBtnLimpiar = true;
                    this.flgBtnEnviar = false;
                  }
                } else {
                  console.log('marca 300');
                  this.flgBtnEnviar = false;
                }

                // console.log('onObtieneUsuarioArea', response);
                // this.codArea = response.elements[0]?.cod_Area;
                // console.log('onObtieneUsuarioArea', this.codArea );
                // this.flgBotones();
            }
            else {
              this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
        }

      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
      }
    });    

  }

construirReclamoPartida(element: any): ReclamoCliente {
  return {
    id: Number(element.id),
    cliente: String(element.cliente),
    cod_Ordtra: String(element.cod_Ordtra),
    unidadNegocio: String(element.unidadNegocio),
    Cod_TemCli: String(element.cod_TemCli),
    Cod_EstCli: String(element.cod_EstCli),
    tipoRegistro: String(element.tipoRegistro),
    estadoSolicitud: String(element.estadoSolicitud),
    responsable: String(element.responsable),
    motivoRegistro: String(element.motivoRegistro),
    usuarioRegistro: String(element.usuarioRegistro),
    observacion: String(element.observacion),
    cadenaCodOrdtra: String(element.cadenaCodOrdtra),
    cod_Tela: String(element.cod_Tela),
    des_Tela: String(element.des_Tela),
    cod_Color: String(element.cod_Color),
    des_Color: String(element.des_Color),
    num_Secuencia: Number(element.num_Secuencia),
    cod_Unidad_Negocio: String(element.cod_Unidad_Negocio),
    des_Unidad_Negocio: String(element.des_Unidad_Negocio),
    cod_Cliente_Tex: String(element.cod_Cliente_Tex), 
    cod_Motivo: String(element.cod_Motivo),
    idArea: Number(element.idArea),
    idResponsable: Number(element.idResponsable),
    archivoAdjunto: element.archivoAdjunto
  };
}

construirReclamoEstilo(element: any): ReclamoCliente {
  return {
    id: Number(element.id),
    cliente: String(element.cliente),
    cod_Ordtra: String(element.cod_Ordtra),
    unidadNegocio: String(element.unidadNegocio),
    Cod_TemCli: String(element.cod_TemCli),
    temporada: String(element.temporada),
    Cod_EstCli: String(element.cod_EstCli),
    estilo: String(element.estilo),
    tipoRegistro: String(element.tipoRegistro),
    estadoSolicitud: String(element.estadoSolicitud),
    responsable: String(element.responsable),
    motivoRegistro: String(element.motivoRegistro),
    usuarioRegistro: String(element.usuarioRegistro),
    observacion: String(element.observacion),
    cadenaCodOrdtra: String(element.cadenaCodOrdtra),
    cod_Tela: String(element.cod_Tela),
    des_Tela: String(element.des_Tela),
    cod_Color: String(element.cod_Color),
    des_Color: String(element.des_Color),
    num_Secuencia: Number(element.num_Secuencia),
    cod_Unidad_Negocio: '',
    des_Unidad_Negocio: String(element.des_Unidad_Negocio),
    cod_Cliente_Tex: String(element.cod_Cliente_Tex),
    cod_Motivo: String(element.cod_Motivo),
    idArea: Number(element.idArea),
    idResponsable: Number(element.idResponsable),
    archivoAdjunto: element.archivoAdjunto,

  };
}

construirReclamoCliente(element: any): ReclamoCliente {
  return {
    id: Number(element.id),
    cliente: String(element.cliente),
    cod_Ordtra: '',
    unidadNegocio: '',
    Cod_TemCli: '',
    temporada: '',
    Cod_EstCli: '',
    estilo: '',
    tipoRegistro: String(element.tipoRegistro),
    estadoSolicitud: String(element.estadoSolicitud),
    responsable: String(element.responsable),
    motivoRegistro: String(element.motivoRegistro),
    usuarioRegistro: String(element.usuarioRegistro),
    observacion: String(element.observacion),
    cadenaCodOrdtra: '',
    cod_Tela: '',
    des_Tela: '',
    cod_Color: '',
    des_Color: '',
    num_Secuencia: 0,
    cod_Unidad_Negocio: '',
    des_Unidad_Negocio: '',
    cod_Cliente_Tex: String(element.cod_Cliente_Tex),
    cod_Motivo: String(element.cod_Motivo),
    idArea: Number(element.idArea),
    idResponsable: Number(element.idResponsable),
    archivoAdjunto: element.archivoAdjunto,
    tipoQueja: 'S'
  };
}

avanzaEstadoReclamo(sTipo: string, id: Number){
  this.SpinnerService.show();
  this.registroQuejasReclamosService.AvanzaEstadoReclamo(String(sTipo), Number(id)).subscribe({
    next: (response: any) => {
          this.SpinnerService.hide();
          if(response.success){
            if (response.codeResult == 200){
              this.mensajeExito(response.message || 'El caso se actualizó correctamente.', () => this.dialogRef.close());
            }else if(response.codeResult == 201){
              this.toastr.info(response.message, '', {
                timeOut: 2500,
              });
            }
          }else{
            this.mensajeError(response.message || 'No se pudo actualizar el caso.');
          }
    },
    error: (err) => {
      this.SpinnerService.hide();
      console.error('Error al intentar cambiar de estado:', err);
      this.mensajeError('Ocurrió un problema al actualizar el caso. Intenta nuevamente.');
    }
  });
}

enviarComercial(){
  console.log('Id', this.data.Datos.id);
  const id = this.data.Datos.id;

  Swal.fire({
    //title: '¿Desea cerrar el caso y continuar con el informe?, Confirme',
    title: '¿Desea cerrar las modificaciones y marcar el caso como listo para el siguiente proceso?, Confirme',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {   

    if (result.isConfirmed) {
      this.avanzaEstadoReclamo("01", id);
    }
      
  });

}



}
