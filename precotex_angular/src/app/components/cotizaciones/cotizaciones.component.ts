import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CotizacionesService } from 'src/app/services/cotizaciones/cotizaciones.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Console } from 'console';
import { MatSort } from '@angular/material/sort';
import { ProcesoColgadoresService } from 'src/app/services/proceso-colgadores.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { GlobalVariable } from 'src/app/VarGlobals';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { color } from 'html2canvas/dist/types/css/types/color';
import { MatCheckboxChange } from '@angular/material/checkbox';

interface Costeo {
    unidadNegocio: string;
    tipo: string;
    cliente: string;
    codigoTela: string;
    idRuta: string;
    color: string;

    materiales: {
      codigoHilo: string;
      descripcion: string;
      porcentaje: number;
      precioKg: number;
      subtotal: number;
    }[];

    procesos: {
      nombre: string;
      receta?: string;
      proceso?: string;
      factor: number;
      costoKg: number;
      ajuste?: number;
      cotizacion: number;
    }[];

    precioMateriales: number;
    precioMaterialesAjustado: number;
    merma: number;
    costoSinUtilidad: number;
    utilidadPorcentaje: number;
    utilidadValor: number;
    gastosPorcentaje: number;
    gastosValor: number;
    total: number;
    totalAjustado: number;
    precioFinalCliente: number;
    rentabilidad: number;
    //Verificamos si tiene Historial
    bTieneHistorialPrecios: number;
  }

  interface dataDetalle {
    //Pro_Cen_Cos   : number;
    //Pro_Des       : string;
    Pro_Hover     : string; 
    Pro_Factor    : number; 
    Pro_Cos_Kg    : number; 
    Pro_Tot       : number; 
    Pro_Tot_Com   : number; 
    Pro_Aju       : number; 
    Pro_Cotizacion: number; 
    Pro_Por       : number; 
    Pro_Tip       : string; 
    //Nuevos Campos
    Observacion   : string; 
    Nivel : number; 
    cod_Subtotal : number; 
    parteEntera : number; 
    parteDecimal : number; 
    isParent : boolean,
    isChild : boolean,
    tieneHijos : boolean,
    cod_ProcesoPadre : string; 
    cod_Proceso_Tex : string;  
    Cod_SubProceso : string;
      
    //Flg_Estatus   : string; 
    //Usu_Registro  : string; 
  }

  interface dataHilo {
    porcentaje    : number,	
    precio_Final  : number,	
    total         : number,
    des_hiltel    : string,	
    cod_Hilado_Estructurado: string,
  }

  interface dataCombo {
    codigo : string,
    descripcion: string
  }

  interface dataPrecio {
    corR_CARTA  : string,
    tiempo      : number,
    preC_TINTO  : number,
    preC_ACABADO: number,
    idCotizacion_Cab: number,
    idrecetalabprod: string
  }

//   interface Proceso {
//   proceso: string;
//   factor: number;
//   costoKg: number;
//   totalTeorico: number;
//   totalComercial: number;
//   ajuste: number;
//   cotizacion: number;
// }

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss']
})
export class CotizacionesComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('dialogObservacion') dialogObservacion!: TemplateRef<any>;
  @ViewChild('dialogListaPrecios') dialogListaPrecios!: TemplateRef<any>;
  observacion: string = '';

  dialogRef!: MatDialogRef<any>;

  maskCodigo: (string | RegExp)[] = [
    /[A-Z]/, // Primera letra mayúscula
    /[A-Z]/, // Segunda letra mayúscula
    /\d/,    // Primer número
    /\d/,    // Segundo número
    /\d/,    // Tercer número
    /\d/,    // Cuarto número
    /\d/,    // Quinto número
    /\d/     // Sexto número
  ];  
  
  unidadNegocio = '';
  tipo = '';
  cliente = '';
  codigoTela = '';
  descripcionTela = '';
  //rutaSeleccionada = '';
  codigoRutaTela = '';
  RutaXCodTela: {codigo: string, nombre: string}[] = [];
  RutaXCodTelaDetalle = [];
  codigoColor = '';
  descripcionColor = '';
  centroCosto: {codigo: number, nombre: string}[] = [];

  bMuestraMenuFlotante: boolean = false;
  dataClientes    : any[] = [];
  ClientesFiltrada: any[] = [];
  ColoresFiltrada: any[] = [];
  planos          : any[] = [];
  planosBackup : any[] = [];
  dataRecetas     : any[] = [];
  sUsuario        = GlobalVariable.vusu;

  dataDetalles: dataDetalle[] = [];
  isAjusteBloqueado   = true;
  dialogAbierto       = false;
  bBuscarTela         = false;
  bValidaHistorial    = false;
  dialogPrecio        = false;
  
  filaSeleccionada: any = null;

  global_Tiempo       : number = 0;
  global_PrecioTinto  : number = 0;
  global_SDC          : string = ""; 
  global_CodReceta    : string = "";
  global_Observacion  : string = "";
  global_idCotizacion_Cab : number = 0;

  constructor(
    private SpinnerService      : NgxSpinnerService         ,
    private service             : CotizacionesService       ,
    private serviceColgadores   : ProcesoColgadoresService  ,
    private toastr              : ToastrService             ,
    private formBuilder         : FormBuilder               ,
    private matSnackBar         : MatSnackBar               ,
    private dialog              : MatDialog                 ,
  ){}

  //dataSource: MatTableDataSource<Proceso> = new MatTableDataSource();

  dataSource = new MatTableDataSource<any>();
  dataSourceFooter = new MatTableDataSource<any>();

  // dataSource_VT = new MatTableDataSource<any>();
  // dataSourceFooter_VT = new MatTableDataSource<any>();

  // dataSource_Servicio = new MatTableDataSource<any>();
  // dataSourceFooter_Servicio = new MatTableDataSource<any>();  

  // dataSource_VT_Estampado = new MatTableDataSource<any>();
  // dataSourceFooter_VT_Estampado = new MatTableDataSource<any>();  

  // dataSource_VT_Servicio = new MatTableDataSource<any>();
  // dataSourceFooter_VT_Servicio = new MatTableDataSource<any>();  

  unidadesNegocio : dataCombo[] =[]; // ['Textil', 'Confección', 'Exportación'];
  tipoUnidadesNegocio : dataCombo[] =[];
  intensidad: dataCombo[] =[];
  listaCodigoColor: dataCombo[] = [];

  /*
  tipos = [
    { value: '01', descripcion: 'REGULAR' },
    { value: '02', descripcion: 'URGENTE' },
    { value: '03', descripcion: 'MUESTRA' }
  ];
  clientes = ['Cliente A', 'Cliente B', 'Cliente C'];
  codigosTela = ['TELA001', 'TELA002', 'TELA003'];
  rutas = ['Ruta 1', 'Ruta 2', 'Ruta 3'];
  */
  expandedRows: Set<string> = new Set(); // usamos el pro_Hover como clave

  isDisabledBtnSave   = false; 
  isDisabledBtnEdit   = false;
  isDisabledBtnDelete = false;
  isDisabledBtnFind   = false;

  displayedColumns: string[] = [
    'hover',
    'descripcion',
    'factor',
    'cosKg',
    'total',
    'totalComercial',
    'ajuste',
    'cotizacion'
  ];

  displayedColumnsFooter: string[] = [
    'hover',
    'descripcion',
    'factor',
    'cosKg',
    'total',
    'totalComercial',
    'ajuste',
    'cotizacion'
  ];

  displayedColumns_SV_Estampado: string[] = [
    'hover',
    'descripcion',
    'factor',
    'cosKg',
    'totalComercial',    
    'total',
    'ajuste',
    'cotizacion'
  ];

  displayedColumns_Hilo: string[] = [
    'Cod_Hilado_Estructurado' ,
    'des_hiltel'              ,
    'Porcentaje'              ,
    'Precio_Final'            ,
    'Total'
  ];  
  dataSource_Hilos: MatTableDataSource<dataHilo> = new MatTableDataSource();

  displayedColumns_Precio: string[] = [
      'opcion'        , 
      'corR_CARTA'    ,
      'tiempo'        ,
      'preC_TINTO'    ,
      //'preC_ACABADO'  ,
      'idrecetalabprod',  
  ];
  dataSource_Precios: MatTableDataSource<dataPrecio> = new MatTableDataSource();


  formulario = this.formBuilder.group({
    unidadNegocio   :[''],
    tipo            :[''],
    cliente         :[''],
    codigoTela      :[''],
    descripcionTela :[''],
    codigoRutaTela  :[''],
    codigoColor     :[''],
    descripcionColor:[''],
    filtro          :[''],
    intensidad      :[''],
    color           :[''],
    //ctrl_receta     :[''],
    filtroColores   :[''],
    ctrl_historial  :[false]
  });  

  formulario_Precio = this.formBuilder.group({
    ctrl_receta: ['']
  });

  //procesos: Proceso[] = [];

  ngOnInit(): void {



    // this.getRutaXCodTela('JE003177');
    // this.getRutaXCodTelaDetalle('JE003177', '01');
    //this.getListaCentroCosto();
    this.loadUnidadNeg();
    this.LoadClientes(null);
    this.loadRecetas();//PORQUE LAS RECETAS SON UNICAS NO DEPENDEN DE NADIE


    this.formulario.get('codigoColor')?.valueChanges.subscribe((valor: any) => {
      if (valor && valor.length === 5) {
        this.validaCodigoColor();
      }
    });     
  }

  toggleExpand(row: any) {
    if (row.isParent) {
      if (this.expandedRows.has(row.pro_Hover)) {
        this.expandedRows.delete(row.pro_Hover); // colapsar
      } else {
        this.expandedRows.add(row.pro_Hover); // expandir
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////////

  buscarDescripcionTela() {
    //console.log('HOLAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    //const sCodTela = this.formulario.get('codigoTela')?.value! || '';

    this.bBuscarTela = true;

    let articleNumber = this.formulario.get('codigoTela')?.value;

    if (!articleNumber || articleNumber.trim() === '') {
      this.matSnackBar.open("¡Importante ingresar Codigo Articulo!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }
    
    articleNumber = articleNumber.toUpperCase(); // Asegura letras en mayúscula
    const letras = articleNumber.substring(0, 2);
    const numeros = articleNumber.substring(2).replace(/\D/g, ''); // Solo dígitos

    // Validar letras
    if (!/^[A-Z]{2}$/.test(letras)) {
      console.warn('Las primeras 2 posiciones deben ser letras mayúsculas');
      return;
    }

    // Completar con ceros si faltan dígitos
    const numerosCompletos = numeros.padStart(6, '0');
    const nuevoValor = letras + numerosCompletos;
    
    // Asignar el valor corregido al control
    this.formulario.get('codigoTela')?.setValue(nuevoValor);
    articleNumber = nuevoValor;    

    if (articleNumber) { 
      console.log('Codigo Tela:', articleNumber);
      this.service.getListaTelas(articleNumber).subscribe({
        next: (response: any) => {
          if (response.success){
            if (response.totalElements > 0){
              this.descripcionTela = response.elements[0].des_Tela;
              this.formulario.get('descripcionTela')?.setValue(response.elements[0].des_Tela); 
              console.log('------', this.descripcionTela);
              if (this.descripcionTela != null || this.descripcionTela != ''){
                this.getRutaXCodTela(articleNumber);
              }
            }
          }
        },
        error: (error: any) => {
          this.toastr.error(error.message, 'Cerrar', {
            timeOut: 2500
          });
          this.SpinnerService.hide();
        }
      });
      
    } 
  }

  mostrarRutaDetalle(): void {

    //BLOQUE DE VALIDACION
    //this.dataSource.data = [];
    this.onValidaExistenciaHistorialxColor();

  }




  getRutaXCodTela(Cod_Tela: string): void {
    this.SpinnerService.show();
    this.service.getRutaXCodTela(Cod_Tela).subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            this.RutaXCodTela = response.elements.map((r: any) => ({
              codigo: r.cod_Ruta,
              nombre: r.descripcion
            }));
          }
          this.bBuscarTela = false;
        }
        this.SpinnerService.hide();
      },
      error: (error: any) => {
        this.toastr.error(error.message, 'Cerrar', {
          timeOut: 2500
        });
        this.SpinnerService.hide();
      }
    });
  }


  // getRutaXCodTelaDetalle(Cod_Tela: string, Cod_Ruta: string): void {
  //   this.SpinnerService.show();
  //   this.service.getRutaXCodTelaDetalle(Cod_Tela, Cod_Ruta).subscribe({
  //     next: (response: any) => {
  //       if(response.success){
  //         if (response.totalElements > 0){
  //           console.log('DETALLE RUTAS: --', response.elements);
  //           this.RutaXCodTelaDetalle = response.elements;
  //           this.dataSource.data = response.elements;
  //           this.dataSource.sort = this.sort;
  //         }
  //       }
  //       this.SpinnerService.hide();
  //     },
  //     error: (error: any) => {
  //       this.toastr.error(error.message, 'Cerrar', {
  //         timeOut: 2500
  //       });
  //       this.SpinnerService.hide();
  //     }
  //   });
  // }


  recalcular(row: any) {

    //Actualiza el Campos pro_Cotizacion con el nuevo Valor
    if (row.pro_Aju == null || row.pro_Aju === 0) {
      row.pro_Cotizacion = row.pro_Tot;
    } else {
      row.pro_Cotizacion = row.pro_Aju;
    }    

    const sumaColCotizacion = this.planos
      .filter(fila => fila.nivel === 1)
      .reduce((acum, fila) => acum + (fila.pro_Cotizacion || 0), 0);   
      
    this.planos.forEach(fila => {
      if (fila.cod_Subtotal === 1 && fila.nivel === 3) {
        fila.pro_Cotizacion = sumaColCotizacion;   // asignamos la suma calculada
      }
    });  
    
    //Obtener Datos de la Fila Utilidad y Total US$
    const fila_Utilidad = this.planos.find(f => f.nivel === 3 && f.cod_Subtotal === 2);
    const utilidad = fila_Utilidad ? fila_Utilidad.pro_Cos_Kg : 0;
    
    //FILA(UTILIDAD) y setea Valor - COLUMNA COTIZACIÓN
    const _Valor_UtiProCotizacion: number = parseFloat(Number((sumaColCotizacion * utilidad)/100).toFixed(2));
    this.planos.forEach(fila => {
      if (fila.cod_Subtotal === 2 && fila.nivel === 3) {
        fila.pro_Cotizacion = _Valor_UtiProCotizacion;
      }
    });    
    
    const _Valor_TotalUSProCotizacion = parseFloat(Number(sumaColCotizacion + _Valor_UtiProCotizacion).toFixed(2));

    //FILA(TOTAL US$)  (SUM(PRECIO KG) + SUM(UTILIDAD)) -  COLUMNA COTIZACIÓN
    this.planos.forEach(fila => {
      if (fila.cod_Subtotal === 3 && fila.nivel === 3) {
        fila.pro_Cotizacion = _Valor_TotalUSProCotizacion;
      }
    });    
    
    //FILA (PRECIO FINAL CLIENTE) - COLUMNA COTIZACIÓN
    this.planos.forEach(fila => {
      if (fila.cod_Subtotal === 4 && fila.nivel === 3) {
        fila.pro_Cotizacion = _Valor_TotalUSProCotizacion;
      }
    });       
    
 
  }

  recalcularUtilidad(row: any) {

    const utilidad: number = Number(row.pro_Cos_Kg);

    //OBTIENE VALORES DE LA FILA PRECIO KG. DE MATERIALES
    const fila_PrecioKG       = this.planos.find(f => f.nivel === 3 && f.cod_Subtotal === 1);
    const valorProTot         = fila_PrecioKG ? fila_PrecioKG.pro_Tot         : 0;
    const valorProTotCom      = fila_PrecioKG ? fila_PrecioKG.pro_Tot_Com     : 0;
    const valorpro_Cotizacion = fila_PrecioKG ? fila_PrecioKG.pro_Cotizacion  : 0;    

    /****************************************************/
    /************ CALCULO FILA DE UTILIDAD **************/
    /****************************************************/
    //CALCULA LOS VALORES
    const _Valor_UtiProTot: number = parseFloat(Number((valorProTot * utilidad)/100).toFixed(2));
    const _Valor_UtiProTotCom: number = parseFloat(Number((valorProTotCom * utilidad)/100).toFixed(2));
    const _Valor_UtiProCotizacion: number = parseFloat(((valorpro_Cotizacion * utilidad)/100).toFixed(2));

    //SETEA LOS VALORES OBTENIDOS
    this.planos.forEach(fila => {
      if (fila.cod_Subtotal === 2 && fila.nivel === 3) {
        fila.pro_Tot = _Valor_UtiProTot;
      }
    });   
    this.planos.forEach(fila => {
      if (fila.cod_Subtotal === 2 && fila.nivel === 3) {
        fila.pro_Tot_Com = _Valor_UtiProTotCom;
      }
    });   
    this.planos.forEach(fila => {
      if (fila.cod_Subtotal === 2 && fila.nivel === 3) {
        fila.pro_Cotizacion = _Valor_UtiProCotizacion;
      }
    });   

    /*****************************************************/
    /************ CALCULO FILA DE TOTAL US$ **************/
    /*****************************************************/  
    //CALCULA LOS VALORES  
    const _Valor_TotalUSProTot: number = parseFloat(Number(valorProTot + _Valor_UtiProTot).toFixed(2));
    const _Valor_TotalUSProTotCom: number = parseFloat(Number(valorProTotCom + _Valor_UtiProTotCom).toFixed(2));
    const _Valor_TotalUSProCotizacion: number = parseFloat(Number(valorpro_Cotizacion + _Valor_UtiProCotizacion).toFixed(2));

    //SETEA LOS VALORES OBTENIDOS
    this.planos.forEach(fila => {
      if (fila.cod_Subtotal === 3 && fila.nivel === 3) {
        fila.pro_Tot = _Valor_TotalUSProTot;
      }
    });     
    this.planos.forEach(fila => {
      if (fila.cod_Subtotal === 3 && fila.nivel === 3) {
        fila.pro_Tot_Com = _Valor_TotalUSProTotCom;
      }
    }); 
    this.planos.forEach(fila => {
      if (fila.cod_Subtotal === 3 && fila.nivel === 3) {
        fila.pro_Cotizacion = _Valor_TotalUSProCotizacion;
      }
    });     

    //Elmismo valor calculado se debe de mostrar al mismo PRECIO VALOR DEL CLIENTE
    this.planos.forEach(fila => {
      if (fila.cod_Subtotal === 4 && fila.nivel === 3) {
        fila.pro_Cotizacion = _Valor_TotalUSProCotizacion;
      }
    });  

  }

  recalcularPrecioFinal(row: any) {
    console.log('recalcula precio');
    
    const fila_PrecioKG = this.planos.find(f => f.nivel === 3 && f.cod_Subtotal === 1);
    const valorProTotCom = fila_PrecioKG ? fila_PrecioKG.pro_Tot_Com : 0;
    const ValorPrecioFinalCliente: number = Number(row.pro_Cotizacion);
    const ValorRentabilidad: number = parseFloat(Number((ValorPrecioFinalCliente - valorProTotCom)/ValorPrecioFinalCliente).toFixed(2))

    console.log('ValorRentabilidad', ValorRentabilidad);
    //return;
    //SETEAMOS EL VALOR  DE LA RENTABILIDAD
    this.planos.forEach(fila => {
      if (fila.cod_Subtotal === 5 && fila.nivel === 3) {
        fila.pro_Por = parseFloat(Number(ValorRentabilidad * 100).toFixed(2));
      }
    });      

  }

  getListaCentroCosto(): void {
    this.service.getListaCentroCosto().subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            this.centroCosto = response.elements.map((c: any) => ({
              codigo: c.cen_Cos_Cod,
              nombre: c.cen_Cos_Des
            }));
          }
        }
      },
      error: (error: any) => {}
    });
  }

  getListarProcesosExportacion(Pro_Cen_Cos: number, Tipo: string, Cod_Cliente_Tex: string, Cod_Tela: string, Cod_Ruta: string, Cod_Color: string, precio: number, tiempo: number, IdCotizacion_Cab: number): void {
    //limpia
    this.planos = []
    this.planosBackup = [];
    
    this.SpinnerService.show();
    this.service.getListarProcesosExportacion(Pro_Cen_Cos, Tipo, Cod_Cliente_Tex, Cod_Tela, Cod_Ruta, Cod_Color, precio, tiempo, IdCotizacion_Cab).subscribe({
      next: (response: any) => {
        if (response.success && response.totalElements > 0) {
          //const planos = response.elements;
          this.planos = response.elements;
          this.planosBackup = JSON.parse(JSON.stringify(response.elements));

          console.log('Datos de planos :::::::::::: ', this.planos);
          const planosConFlags = this.planos.map((p: any) => {
            if (!p.pro_Hover.includes('.')) {
              p.isParent = true;
              p.isChild = false;
              p.tieneHijos = this.planos.some(x => x.pro_Hover.startsWith(p.pro_Hover + '.'));
            } else {
              p.isChild = true;
              p.isParent = false;
              p.padreKey = p.pro_Hover.split('.')[0];
            }
            return p;
          });

          if(Pro_Cen_Cos === 1){
            console.log('marca 1');
            this.dataSource.data = [];
            this.dataSource.data = planosConFlags;
            this.dataSource.sort = this.sort;
            console.log('marca 1 - FIN');
          }
          // else if(Pro_Cen_Cos === 2){
          //   console.log('marca 2');
          //   this.dataSource_VT.data = [];
          //   this.dataSource_VT.data = planosConFlags;
          //   this.dataSource_VT.sort = this.sort;          
          // }else if(Pro_Cen_Cos === 3){
          //   console.log('marca 3');
          //   this.dataSource_Servicio.data = [];
          //   this.dataSource_Servicio.data = planosConFlags;
          //   this.dataSource_Servicio.sort = this.sort;
          // }else if(Pro_Cen_Cos === 4){
          //   console.log('marca 4');
          //   this.dataSource_VT_Estampado.data = [];
          //   this.dataSource_VT_Estampado.data = planosConFlags;
          //   this.dataSource_VT_Estampado.sort = this.sort;
          // }else if(Pro_Cen_Cos === 5){
          //   console.log('marca 5');
          //   this.dataSource_VT_Servicio.data = [];
          //   this.dataSource_VT_Servicio.data = planosConFlags;
          //   this.dataSource_VT_Servicio.sort = this.sort;
          // }

          //Existe Cotizacion
          if (planosConFlags[0].existeCotizacion === '1'){
              //Columna Ajuste Bloqueado
              this.isAjusteBloqueado = true;

              this.isDisabledBtnSave    = false;
              this.isDisabledBtnEdit    = true;
              this.isDisabledBtnDelete  = true;
          }else{
              //Columna Ajuste Bloqueado
              this.isAjusteBloqueado = false;

              this.isDisabledBtnSave    = true;
              this.isDisabledBtnEdit    = false;
              this.isDisabledBtnDelete  = false;
          }      
          
          //Busca color solo si no tiene regitros de historial
          //if (response.elements[0].existeCotizacion == "0"){
          //  this.onBuscaPreciosxColor(Cod_Color);    
          //}

          //Habilita botoneria
          this.bMuestraMenuFlotante = true;
          
        }
        this.SpinnerService.hide();
      },
      error: (error: any) => {
        this.toastr.error(error.message, 'Cerrar', { timeOut: 2500 });
        this.SpinnerService.hide();
      }
    });
  }  

  chgUnidadNegocio(){
    this.reiniciaControles();
    this.unidadNegocio = this.formulario.get('unidadNegocio')?.value! || '';
    this.loadTipoUnidadesNegocio(Number(this.unidadNegocio));
    
    //COMENTADO POR EL MOMENTO DESPUES SE REGULARIZA POR HMEDINA
    //this.getLoadIntensidad(Number(this.unidadNegocio));
  }

  getLoadIntensidad(Id_Unidad_NegocioKey: number){
    this.intensidad = [];
    this.service.getListaIntensidad(Id_Unidad_NegocioKey).subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            this.intensidad = response.elements;
          }
        }
      },
      error: (error: any) => {}
    });
  }

  chgTipo(){
    const sRuta = this.formulario.get('codigoRutaTela')?.value! || '';

    if (sRuta) {
      const _tipo       = this.formulario.get('tipo')?.value || '';
      const _cliente    = this.formulario.get('cliente')?.value || '';
      const _tela       = this.formulario.get('codigoTela')?.value || '';
      const _ruta       = this.formulario.get('codigoRutaTela')?.value || '';
      const _color      = this.formulario.get('codigoColor')?.value || '';

      //return;
      //deshabilitado porque solo debe de mostrar los procesos cuando se clickea el boton de buscar
      //this.getListarProcesosExportacion(Number(this.unidadNegocio), _tipo, _cliente, _tela, _ruta, _color);          
    } 

  }

  reiniciaControles(){
    this.codigoRutaTela = '';
    this.formulario.get('tipo')?.setValue(''); 
    this.formulario.get('cliente')?.setValue(''); 
    this.formulario.get('filtro')?.setValue('');
    this.formulario.get('codigoTela')?.setValue(''); 
    this.formulario.get('descripcionTela')?.setValue(''); 
    this.formulario.get('codigoRutaTela')?.setValue(''); 
    this.formulario.get('codigoColor')?.setValue(''); 
    this.formulario.get('color')?.setValue(''); 
    this.formulario.get('ctrl_historial')?.setValue(false);
    //DesHabilita botoneria
    this.bMuestraMenuFlotante = false;
    this.isDisabledBtnFind    = false;

    this.formulario.get('filtro')?.setValue(''); 
    this.formulario.get('filtroColores')?.setValue(''); 
    
    this.RutaXCodTela = [];
    this.ColoresFiltrada = [];
  }

  usarClientes(codigoCliente: string) {

    this.ClientesFiltrada = this.dataClientes.filter(item =>
      item.cod_Cliente_Tex.toLowerCase().includes(codigoCliente)
    );

    // Busca si hay coincidencia exacta (opcional)
    const clienteExacto = this.dataClientes.find(item =>
      item.cod_Cliente_Tex.toLowerCase() === codigoCliente
    );

    // Asigna el valor al mat-select si encuentra coincidencia
    if (clienteExacto) {
      this.formulario.get('ctrol_cliente')?.setValue(clienteExacto.cod_Cliente_Tex);
    }    

  }  

  LoadClientes(codigoCliente: string){
    this.dataClientes = [];
    this.SpinnerService.show();
    this.serviceColgadores.getObtieneInformacionClienteColgador().subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              this.dataClientes = response.elements;
              this.SpinnerService.hide();

              if (codigoCliente && codigoCliente.trim() !== ''){
                this.usarClientes(codigoCliente);
              }
          }
          else{
            this.SpinnerService.hide();
          };
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });   
  }  

  filtrarClientes() {
    //this.tipoFallaFiltrada = [];
    const filtroTexto = this.formulario.get('filtro')?.value?.toLowerCase();
    this.ClientesFiltrada = this.dataClientes.filter(item =>
      item.nom_Cliente.toLowerCase().includes(filtroTexto) ||
      item.abr_Cliente.toLowerCase().includes(filtroTexto)
    );
  }    

  filtrarColores() {
    const filtroTexto = this.formulario.get('filtroColores')?.value?.toLowerCase();
    this.ColoresFiltrada = this.listaCodigoColor.filter(item =>
      item.codigo.toLowerCase().includes(filtroTexto) ||
      item.descripcion.toLowerCase().includes(filtroTexto)      
    );
  }

  validaCodigoColor() {
    const sCodColor = this.formulario.get('color')?.value! || '';

    if (!sCodColor || sCodColor.trim() === ''){
      this.matSnackBar.open("¡Ingrese codigo de color...!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
    return;
    }  
    
    //Ejecuta cuando es longitud 5
    if (sCodColor && sCodColor.length === 6) {
      this.SpinnerService.show();
      this.service.getValidaColorExiste(sCodColor).subscribe({
        next: (response: any) => {
          if (response.success) {
            if (response.totalElements == 0) {

              this.toastr.info(response.message, '', {
                timeOut: 2500,
              });                 

              this.formulario.get('codigoColor')?.setValue('');  

            }else{
              console.log('Resultado color', response)
              this.formulario.get('descripcionColor')?.setValue(response.elements[0].descripcion); 
            }
          }
          this.SpinnerService.hide();
        },
        error: (error: any) => {
          this.SpinnerService.hide();
          console.log(error.error.message, 'Cerrar', {
            timeout: 2500
          })
        }
      });      
    }
    else {
      //this.formulario.get('codigoColor')?.setValue(''); 
    }

  }  

  loadHilo(sCodTela: string){
    this.SpinnerService.show();
    this.service.getListaHiladoxTela(sCodTela).subscribe({
      next: (response: any) => {
        if(response.success){
          if (response.totalElements > 0){
            this.dataSource_Hilos.data = response.elements;
            this.SpinnerService.hide();
          }
          else{
            this.dataSource_Hilos.data = [];            
            this.SpinnerService.hide();
          };
        }else{
          this.dataSource_Hilos.data = [];
        }
      },
      error: (error: any) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
          timeout: 2500
        })
      }
    });      
  }

  loadTipoUnidadesNegocio(Id_Unidad_NegocioKey: Number) {
    this.tipoUnidadesNegocio = [];
    this.SpinnerService.show();
    this.service.getListaUnidadNegocioTipo(Number(Id_Unidad_NegocioKey)).subscribe({
      next: (response: any) => {
        if(response.success){
          if (response.totalElements > 0){
            this.tipoUnidadesNegocio = response.elements;
            this.SpinnerService.hide();
          }
          else{
            this.tipoUnidadesNegocio = [];            
            this.SpinnerService.hide();
          };
        }else{
          this.tipoUnidadesNegocio = [];
        }
      },
      error: (error: any) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
          timeout: 2500
        })
      }
    });    
  }

  loadUnidadNeg(){
    this.unidadesNegocio = [];   
    this.SpinnerService.show();
    this.service.getListaUnidadNegocio().subscribe({
      next: (response: any) => {
        if(response.success){
          if (response.totalElements > 0){
            this.unidadesNegocio = response.elements;
            this.SpinnerService.hide();
          }
          else{
            this.unidadesNegocio = [];            
            this.SpinnerService.hide();
          };
        }else{
          this.unidadesNegocio = [];
        }
      },
      error: (error: any) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
          timeout: 2500
        })
      }
    });       
  }

  loadListaCodigoColor(Cod_Cliente: string) {
    this.listaCodigoColor = [];
    this.SpinnerService.show();
    this.service.getListaColoresXCliente(Cod_Cliente).subscribe({
      next: (response: any) => {
        if(response.success){
          if (response.totalElements > 0){
            this.listaCodigoColor = response.elements;
            console.log('Lista de colores', this.listaCodigoColor);
            this.SpinnerService.hide();
          }
          else{
            this.listaCodigoColor = [];            
            this.SpinnerService.hide();
          };
        }else{
          this.listaCodigoColor = [];
        }
      },
      error: (error: any) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
          timeout: 2500
        })
      }
    });    
  }  

  onGuardar(){
    //Bloque 1 --> Validaciones
    Swal.fire({
      title: '¿Desea registrar ajustes de cotización?, Confirme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {

        const _UndNego  = this.formulario.get('unidadNegocio')?.value   || 0;
        const _tipo     = this.formulario.get('tipo')?.value            || '';
        const _cliente  = this.formulario.get('cliente')?.value         || '';
        const _tela     = this.formulario.get('codigoTela')?.value      || '';
        const _ruta     = this.formulario.get('codigoRutaTela')?.value  || '';
        const _color    = this.formulario.get('color')?.value     || '';        
        
        //PASO 1 - OBTENEMOS EL DETALLE
        if (Number(this.unidadNegocio) === 1){
            this.dataDetalles = this.dataSource.data.map(item => this.mapToDetalle(item));
            console.log('SERVICIO PRIMERA CARGA', this.dataDetalles);
        }
        /*
        else if(Number(this.unidadNegocio) === 2){
          console.log('VENTA DE TELA',this.dataSource);
            this.dataDetalles = this.dataSource_VT.data.map(item => this.mapToDetalle(item));
        }else if(Number(this.unidadNegocio) === 3){
          console.log('SERVICIO',this.dataSource);
            this.dataDetalles = this.dataSource_Servicio.data.map(item => this.mapToDetalle(item));          
        }else if(Number(this.unidadNegocio) === 3){
          console.log('ESTAMPADO',this.dataSource);
            this.dataDetalles = this.dataSource_VT_Estampado.data.map(item => this.mapToDetalle(item));             
        }else if(Number(this.unidadNegocio) === 3){
          console.log('ESTAMPADO SERVICIO',this.dataSource);
            this.dataDetalles = this.dataSource_VT_Servicio.data.map(item => this.mapToDetalle(item));             
        }
        */

        //PASO 2 - OBTENEMOS LA CABECERA
        let data: any = {
            "idCotizacion_Cab": 0,
            "pro_Id"          : 0,
            "cen_Cos_Cod"     : Number(_UndNego),
            "cod_Tipo"        : _tipo,
            "cod_Cliente_Tex" : _cliente,
            "cod_Tela"        : _tela,
            "cod_Ruta"        : _ruta,
            "cod_Color"       : _color,
            "cod_RecetaAcabado" : this.global_CodReceta,
            "tiempo_Referencia" : Number(this.global_Tiempo),
            "precio_Referencia" : Number(this.global_PrecioTinto),
            "sDC_Referencia"    : this.global_SDC,
            "flg_Estatus"     : "A",
            "usu_Registro"    : this.sUsuario,
            "accion"          : "I",
            "detalles"        : this.dataDetalles
        };

        console.log('Data registro', data);
        //return;

        this.SpinnerService.show();
        this.service.postProcesoCotizacion(data).subscribe({
          next: (response: any)=> {
              if(response.success){
                if (response.codeResult == 200){
                  this.toastr.success(response.message, '', {
                    timeOut: 2500,
                  });

                  //Aqui limpia todo el contenido para una nueva consulta 
                  this.chgUnidadNegocio();
                }else if(response.codeResult == 201){
                  this.toastr.info(response.message, '', {
                    timeOut: 2500,
                  });
                }
                this.SpinnerService.hide();
              }else{
                this.toastr.error(response.message, 'Cerrar', {
                  timeOut: 2500,
                });
                this.SpinnerService.hide();
              }            
          },
          error: (error) => {
            this.SpinnerService.hide();
            this.toastr.error(error.message, 'Cerrar', {
            timeOut: 2500,
            });
          }          
        });

      };
    });
  }

  onEditar(){
    this.isAjusteBloqueado = false;
    this.isDisabledBtnSave = true;
    this.isDisabledBtnEdit = false;
  }

  onEliminar(){

  }

  onBuscar() {
    this.mostrarRutaDetalle();
  }

  guardarObservacion(row: any){
    //console.log('observacion', data);
    //data.row.observacion = data.observacion;
    this.global_Observacion = row.observacion;
    console.log('guardarObservacion', row);
    this.dialog.closeAll(); ;

  } 

  abrirDialog(row: any) {

  console.log('abtrir dialog', row);
  const proAjuActual = Number(row.pro_Aju);
  const proAjuBackup = this.planosBackup.filter(p => p.cod_Proceso_Tex == row.cod_Proceso_Tex).map(p => p.pro_Aju);


  console.log('proAjuActual', proAjuActual);
  console.log('proAjuActual', proAjuBackup);    

  //Solo se ejecuta cuando es diferente
  if (proAjuBackup !== undefined && proAjuActual !== Number(proAjuBackup)) {

    // Limpia la observación del row (pero el backup mantiene la original)
    row.observacion = '';    

    //if (row.pro_Aju != null && row.pro_Aju !== '' && row.pro_Aju !== 0) {
      if (!this.dialogAbierto) {
        this.dialogAbierto = true;
        const ref = this.dialog.open(this.dialogObservacion, {
          width: '600px',
          data: { observacion: row.observacion ?? '', row }
        }); 
        // Cuando se cierra el diálogo, resetea la bandera
        ref.afterClosed().subscribe(() => {
          this.dialogAbierto = false;

          if (this.global_Observacion && this.global_Observacion.trim() !== '') {
            // Actualiza la fila
            row.observacion = this.global_Observacion;

            // Actualiza también el backup
            const backupItem = this.planosBackup.find(
              p => p.cod_Proceso_Tex === row.cod_Proceso_Tex
            );
            if (backupItem) {
              console.log('Actualizando backup con observacion:', this.global_Observacion);
              backupItem.observacion = this.global_Observacion;
              backupItem.pro_Aju = proAjuActual;
            }
          }  
          
        });         
      //}
    }    

  }

  //console.log('proAjuActual', proAjuActual);
  //console.log('proAjuActual', proAjuBackup);
}

validarObservacion(row: any, event: FocusEvent) {
  if (row.pro_Aju == null || row.pro_Aju === '' || row.pro_Aju === 0) {
    row.observacion = '';   
    return;
  }

  const proAjuActual = Number(row.pro_Aju);
  const proAjuBackup = this.planosBackup.filter(p => p.cod_Proceso_Tex == row.cod_Proceso_Tex).map(p => p.pro_Aju);

  console.log('proAjuActual', proAjuActual);
  console.log('proAjuActual', proAjuBackup);  

  if (proAjuBackup !== undefined && proAjuActual !== Number(proAjuBackup)) {

    // Limpia la observación del row (pero el backup mantiene la original)
    row.observacion = '';

    console.log('entro aquí');
    //if (!row.observacion || row.observacion.trim() === '') {
      console.log('entro aquí observacion');
      if (!this.dialogAbierto) {
        this.dialogAbierto = true;
        // Evita que el foco se pierda y abre el diálogo
        (event.target as HTMLInputElement).focus();
        const ref = this.dialog.open(this.dialogObservacion, {
          width: '600px',
          data: { observacion: row.observacion ?? '', row }
        });        

        // Cuando se cierra el diálogo, resetea la bandera
        ref.afterClosed().subscribe(()=>{
          this.dialogAbierto = false;

          if (this.global_Observacion && this.global_Observacion.trim() !== '') {
            // Actualiza la fila
            row.observacion = this.global_Observacion;

            // Actualiza también el backup
            const backupItem = this.planosBackup.find(
              p => p.cod_Proceso_Tex === row.cod_Proceso_Tex
            );
            if (backupItem) {
              console.log('Actualizando backup con observacion:', this.global_Observacion);
              backupItem.observacion = this.global_Observacion;
              backupItem.pro_Aju = proAjuActual;
            }
          }          



        });        
      }
    //}

  }

  // Si el ajuste es distinto al Total Comercial
  /*
  if (row.pro_Aju != row.pro_Tot_Com) {
    if (!row.observacion || row.observacion.trim() === '') {
      if (!this.dialogAbierto) {
        this.dialogAbierto = true;
        // Evita que el foco se pierda y abre el diálogo
        (event.target as HTMLInputElement).focus();
        const ref = this.dialog.open(this.dialogObservacion, {
          width: '600px',
          data: { observacion: row.observacion ?? '', row }
        });        

        // Cuando se cierra el diálogo, resetea la bandera
        ref.afterClosed().subscribe(() => {
          this.dialogAbierto = false;
        });        
      }
    }
  }  
    */
}

onLimpiarFiltros(){
  this.reiniciaControles();
}

onChangeCliente(){
  const _cliente = this.formulario.get('cliente')?.value || '';
  this.loadListaCodigoColor(_cliente);
}

onChangeColor(){
  this.isDisabledBtnFind = true;
  //this.dataSource.data = [];
  // const _CodColor = this.formulario.get('color')?.value || '';
  // this.onBuscaPreciosxColor(_CodColor);

  //AQUI DEBE LLAMAR AL LISTAR 
  //this.onBuscar();
  
  //this.onValidaExistenciaHistorialxColor();


}

onBuscaPreciosxColor(Tipo_Busqueda: string, Pro_Cen_Cos: number, Tipo: string, Cod_Cliente_Tex: string, Cod_Tela: string, Cod_Ruta: string, Cod_Color: string){
  this.dataSource_Precios = null;
  this.SpinnerService.show();
  this.service.getListaPrecioXColor(Tipo_Busqueda, Pro_Cen_Cos, Tipo, Cod_Cliente_Tex, Cod_Tela, Cod_Ruta, Cod_Color).subscribe({
    next: (response: any) => {
      if(response.success){
        console.log(':::::::::::::RESULTADO DE PRECIO', response);
        //Variables generales
        //const _tipo     = this.formulario.get('tipo')?.value ||    '';
        //const _cliente  = this.formulario.get('cliente')?.value || '';
        //const _tela     = this.formulario.get('codigoTela')?.value || '';
        //const _ruta     = this.formulario.get('codigoRutaTela')?.value || '';
        //const _color    = this.formulario.get('color')?.value! || '';        
        
        //this.codigoRutaTela     = _ruta;
        this.codigoRutaTela     = Cod_Ruta;

        //solo muestra informacion cuando tiene mas de un registro, si es uno solo no muestra nada
        if (response.totalElements > 1){

          console.log(':::::::::::::TIENE MAS DE UN PRECIO');

          this.dataSource_Precios = response.elements;       
          //Carga Recetas
          //this.loadRecetas();
          
          //Abre el dialog
          this.global_CodReceta = '';
          this.formulario_Precio.get('ctrl_receta').setValue('');
          this.dialogRef = this.dialog.open(this.dialogListaPrecios, {
            width: '600px'
          });        

          this.dialogRef.afterClosed().subscribe(() => {

            //console.log('Dialogo cerrado');

            //Lista de procesos de exportacion
            if(!this.dialogPrecio){
              this.getListarProcesosExportacion(Number(this.unidadNegocio), Tipo, Cod_Cliente_Tex, Cod_Tela, Cod_Ruta, Cod_Color, Number(this.global_PrecioTinto), Number(this.global_Tiempo), Number(this.global_idCotizacion_Cab)); 
            }

          });        
          
          
          this.SpinnerService.hide();
        }
        else if (response.totalElements === 1){

          console.log(':::::::::::::TIENE UN PRECIO');
          console.log('this.datos', response.elements[0]);
          //Bloque de variables
          this.global_PrecioTinto = Number(response.elements[0].preC_TINTO);
          this.global_Tiempo      = Number(response.elements[0].tiempo);     
          this.global_SDC         = String(response.elements[0].corR_CARTA);    
          this.global_idCotizacion_Cab = Number(response.elements[0].idcotizacioN_CAB);
          console.log('unidadNegocio', Number(this.unidadNegocio));
          //metOdo de nuscar informacion de procesos
          this.getListarProcesosExportacion(Number(this.unidadNegocio), Tipo, Cod_Cliente_Tex, Cod_Tela, Cod_Ruta, Cod_Color, Number(this.global_PrecioTinto), Number(this.global_Tiempo), Number(this.global_idCotizacion_Cab));
     
          //this.dataSource_Precios = null;            
          //this.SpinnerService.hide();

        }else if (response.totalElements === 0){
          console.log(':::::::::::::NO TIENE PRECIOS');
          //Bloque de variables
          this.global_PrecioTinto = 0;
          this.global_Tiempo      = 0;    
          this.global_SDC         = "";  
          this.global_idCotizacion_Cab = 0;    

          //metOdo de nuscar informacion de procesos
          this.getListarProcesosExportacion(Number(this.unidadNegocio), Tipo, Cod_Cliente_Tex, Cod_Tela, Cod_Ruta, Cod_Color, Number(this.global_PrecioTinto), Number(this.global_Tiempo), Number(this.global_idCotizacion_Cab));

          //this.dataSource_Precios = null;            
          //this.SpinnerService.hide();          
        }
      }else{
        this.dataSource_Precios = null;
      }
    },
    error: (error: any) => {
      this.SpinnerService.hide();
      console.log(error.error.message, 'Cerrar', {
        timeout: 2500
      })
    }
  });  
}



loadRecetas(){
    this.SpinnerService.show();
    this.service.getListaRecetasAntipilling().subscribe({
      next: (response: any) => {
        if(response.success){
          if (response.totalElements > 0){
            this.dataRecetas = response.elements;
            this.SpinnerService.hide();
          }
          else{
            this.dataSource_Hilos.data = [];            
            this.SpinnerService.hide();
          };
        }else{
          this.dataSource_Hilos.data = [];
        }
      },
      error: (error: any) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
          timeout: 2500
        })
      }
    });      
  }

seleccionarFila(row: any) {
  this.filaSeleccionada = row;
  console.log('seleccionada', this.filaSeleccionada);

  this.global_Tiempo      = Number(row.tiempo)    ;
  this.global_PrecioTinto = Number(row.preC_TINTO);
  this.global_SDC         = String(row.corR_CARTA);     
  this.global_idCotizacion_Cab = Number(row.idcotizacioN_CAB); 
}  


onSeleccionarPrecio(){
  // const _receta     = this.formulario.get('ctrl_receta')?.value || '';
  // console.log('Receta seleccionada', _receta);
  // this.global_CodReceta = _receta;

    console.log('global_Tiempo', this.global_Tiempo);
    console.log('global_PrecioTinto', this.global_PrecioTinto);  

    if (this.dialogRef) {
      this.dialogPrecio = false;
      this.dialogRef.close();
    }  
}

onRecetaChange(event: any) {
  console.log('Receta seleccionada:', event.value);
  // Capturamos
  this.global_CodReceta = event.value || '';
}

onValidaExistenciaHistorialxColor(){

    const _unidad     = Number(this.unidadNegocio);
    const _tipo       = this.formulario.get('tipo')?.value || '';
    const _cliente    = this.formulario.get('cliente')?.value || '';
    const _tela       = this.formulario.get('codigoTela')?.value || '';
    const _ruta       = this.formulario.get('codigoRutaTela')?.value || '';
    const _color      = this.formulario.get('color')?.value || '';
    const _receta     = this.global_CodReceta || '';

    const bHistorial =  this.bValidaHistorial?"1":"0";


    this.onBuscaPreciosxColor(String(bHistorial), _unidad, _tipo, _cliente, _tela, _ruta, _color);
    return;

    this.SpinnerService.show();
    this.service.getValidaExistenciaHistorialxColor(_unidad, _tipo, _cliente, _tela, _ruta, _color, _receta).subscribe({
      next: (response: any) => {
        if(response.success){
          if (response.totalElements > 0){
            //Aqui habilita el semaforo
            this.bValidaHistorial = true;    

            console.log('MARCA CON HISTORIAL', response.elements);

            //metOdo de nuscar informacion de procesos desde la tabla de historial
            //this.getListarProcesosExportacion(_unidad, _tipo, _cliente, _tela, _ruta, _color, 0, 0);     
 
            //this.SpinnerService.hide();
          }
          else{
            this.dataSource_Hilos.data = [];     

            console.log('MARCA SIN HISTORIAL');
            
            //MUESTRA PRECIOS DE LA BD SI ES QUE NO EXISTE HISTORIAL
            //this.onBuscaPreciosxColor(_color);

            //this.SpinnerService.hide();
          };
        }else{
          this.dataSource_Hilos.data = [];
        }
      },
      error: (error: any) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
          timeout: 2500
        })
      }
    });       
  
}

onCancelarPrecio(){
  if (this.dialogRef) {
    this.dialogPrecio = true;
    this.dialogRef.close();
  }
}

//onChangeColor(){
  //this.validaCodigoColor();
//}

onHistorialChange(event: MatCheckboxChange) {
  console.log('Historial marcado:', event.checked);
  this.bValidaHistorial = event.checked;
}

private mapToDetalle(item: any): dataDetalle {
    console.log('MAPDETALLE', item);
  return {
      //Pro_Cen_Cos   : item.pro_Cen_Cos,
      //Pro_Des       : item.pro_Des,
      Pro_Hover     : item.pro_Hover,
      Pro_Factor    : item.pro_Factor,
      Pro_Cos_Kg    : item.pro_Cos_Kg,
      Pro_Tot       : item.pro_Tot,
      Pro_Tot_Com   : item.pro_Tot_Com,
      Pro_Aju       : item.pro_Aju,
      Pro_Cotizacion: item.pro_Cotizacion,
      Pro_Por       : item.pro_Por,
      Pro_Tip       : item.pro_Tip,
      //Nuevos Campos
      Observacion   : item.observacion,
      Nivel         : item.nivel,
      cod_Subtotal  : item.cod_Subtotal,
      parteEntera   : item.parteEntera,
      parteDecimal  : item.parteDecimal,
      isParent      : item.isParent,
      isChild       : item.isChild,
      tieneHijos    : item.tieneHijos,
      cod_ProcesoPadre  : item.cod_ProcesoPadre,
      cod_Proceso_Tex   : item.cod_Proceso_Tex,
      Cod_SubProceso : item.cod_SubProceso
      
      //Flg_Estatus   : 'A',
      //Usu_Registro  : this.sUsuario
    };
  }
}
