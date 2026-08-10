import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { COTIZACIONES_FIELDS } from 'src/app/shared/constants/cotizaciones-fields';

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

  // Item del panel de Historial, construido a partir de cada elemento de getListaPrecioXColor.
  interface VersionPrecio {
    id            : number;   // idcotizacioN_CAB
    titulo        : string;   // 'Opción 1', 'Opción 2', ... (correlativo local)
    sdc           : string;   // corR_CARTA
    precioTinto   : number;   // preC_TINTO
    precioAcabado : number;   // preC_ACABADO
    tiempo        : number;   // tiempo
    receta        : string;   // idrecetalabprod
    reciente      : boolean;  // true solo en el primer elemento
    raw           : any;      // elemento crudo, por si se necesita otro campo

    // --- Fase 2: pendientes de que el backend agregue estos campos a getListaPrecioXColor ---
    usuario?: string;  // usu_Registro
    fecha?  : string;  // fec_Registro
    estado? : 'Vigente' | 'Aprobada' | 'Borrador';  // estado
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
  @ViewChild('dialogAjuste') dialogAjuste!: TemplateRef<any>;
  observacion: string = '';

  dialogRef!: MatDialogRef<any>;
  dialogRefAjuste!: MatDialogRef<any>;

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
  // --- Historial: sin control en UI, se envía siempre en false ---
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

  dataSource = new MatTableDataSource<any>();
  dataSourceFooter = new MatTableDataSource<any>();
  unidadesNegocio : dataCombo[] =[]; // ['Textil', 'Confección', 'Exportación'];
  tipoUnidadesNegocio : dataCombo[] =[];
  intensidad: dataCombo[] =[];
  listaCodigoColor: dataCombo[] = [];
  expandedRows: Set<string> = new Set(); // usamos el pro_Hover como clave
  isDisabledBtnSave   = false;
  isDisabledBtnEdit   = false;
  isDisabledBtnDelete = false;
  isDisabledBtnFind   = false;

  // --- Estado de presentación (rediseño UX) ---
  panelCriteriosAbierto = true;
  densidad: 'compacta' | 'comoda' = 'compacta';

  // Tabla de solo lectura + modal de edición
  filaEnEdicion: any = null;
  tipoEdicion: 'utilidad' | 'ajuste' | 'cotizacion' | null = null;
  datosGeneralesAbierto = true;

  // --- Panel de Historial: alimentado por getListaPrecioXColor (ver onBuscaPreciosxColor) ---
  historialVersiones: VersionPrecio[] = [];
  historialPineado = true;
  versionSeleccionada: VersionPrecio | null = null;
  busquedaRealizada = false;   // controla la visibilidad del panel tras el primer Buscar

  // Borrador en curso: sobrevive a la navegación entre cotizaciones (conserva ajustes escritos).
  // Se destruye solo al pulsar Buscar o tras guardar (ver reiniciaControles). Uno solo a la vez.
  borrador: { planos: any[], planosBackup: any[], recetaCod: string } | null = null;
  borradorActivo = false;   // true = la grilla está mostrando el borrador

  // Filtros de la última búsqueda, para poder re-disparar getListarProcesosExportacion
  // cuando el usuario elige otra card del historial sin volver a leer el formulario.
  private ultimaBusqueda: {
    unidad: number; tipo: string; cliente: string;
    tela: string; ruta: string; color: string;
  } | null = null;

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
    filtroColores   :['']
  });

  formulario_Precio = this.formBuilder.group({
    ctrl_receta: ['']
  });

  //procesos: Proceso[] = [];














  COTIZACIONES_FIELDS = COTIZACIONES_FIELDS;

  //INICIALIZACION DE COMPONENTE
  ngOnInit(): void {
    this.loadUnidadNeg();
    this.LoadClientes(null);
    this.loadRecetas();//PORQUE LAS RECETAS SON UNICAS NO DEPENDEN DE NADIE

    this.formulario.get('codigoColor')?.valueChanges.subscribe((valor: any) => {
      if (valor && valor.length === 5) {
        this.validaCodigoColor();
      }
    });     
  }

  /* --- Cargar Unidad de Negocio --- */
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
        }
        else {
          this.unidadesNegocio = [];
          this.SpinnerService.hide();
        }
      },
      error: (error: any) => {
        this.SpinnerService.hide();
        const errorMessage = error?.error?.message || 'Error al cargar unidades de negocio';
        console.log(errorMessage, 'Cerrar', { timeout: 2500 });
      }
    });       
  }

  /* --- Cargar Clientes --- */
  LoadClientes(codigoCliente: string){
    this.dataClientes = [];
    this.SpinnerService.show();

    this.serviceColgadores.getObtieneInformacionClienteColgador().subscribe({
      next: (response: any) => {
        if(response.success){
          if (response.totalElements > 0){
              // "label" es el texto que muestra el <ng-select> (bindLabel="label")
              this.dataClientes = response.elements.map((c: any) => ({
                ...c,
                label: c.abr_Cliente + ' - ' + c.nom_Cliente
              }));
              this.SpinnerService.hide();

              if (codigoCliente && codigoCliente.trim() !== ''){
                this.usarClientes(codigoCliente);
              }
          }
          else{
            this.dataClientes = [];
            this.SpinnerService.hide();
          };
        }
        else {
          this.dataClientes = [];
          this.SpinnerService.hide();
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        const errorMessage = error?.error?.message || 'Error al cargar clientes';
        console.log(errorMessage, 'Cerrar', { timeout: 2500 });
      }
    });   
  } 

  /* --- Usar Clientes --- */
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

  /* --- Cargar Recetas Antipilling --- */
  loadRecetas(){
    this.dataRecetas = [];
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
        }
        else{
          this.dataSource_Hilos.data = [];
          this.SpinnerService.hide();
        }
      },
      error: (error: any) => {
        this.SpinnerService.hide();
        const errorMessage = error?.error?.message || 'Error al cargar recetas antipilling';
        console.log(errorMessage, 'Cerrar', { timeout: 2500 });
      }
    });      
  }

  /* --- Cargar Colores --- */
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

            }
            else{
              this.formulario.get('descripcionColor')?.setValue(response.elements[0].descripcion); 
            }
          }
          this.SpinnerService.hide();
        },
        error: (error: any) => {
          this.SpinnerService.hide();
          const errorMessage = error?.error?.message || 'Error al cargar colores';
          console.log(errorMessage, 'Cerrar', { timeout: 2500 });
        }
      });      
    }
    else {
      //this.formulario.get('codigoColor')?.setValue(''); 
    }

  }  

  /* --- Evento change clientes --- */
  onChangeCliente(){
    const _cliente = this.formulario.get('cliente')?.value || '';

    if (_cliente === null || _cliente === undefined || _cliente === '') {
      return;
    }

    this.loadListaCodigoColor(_cliente);
  }
  
  /* --- Lista Colores Por Clientes --- */
  loadListaCodigoColor(Cod_Cliente: string) {
    this.listaCodigoColor = [];
    this.SpinnerService.show();

    this.service.getListaColoresXCliente(Cod_Cliente).subscribe({
      next: (response: any) => {
        if(response.success){
          if (response.totalElements > 0){
            this.listaCodigoColor = response.elements;
            this.SpinnerService.hide();
          }
          else{
            this.listaCodigoColor = [];            
            this.SpinnerService.hide();
          };
        }else{
          this.listaCodigoColor = [];
          this.SpinnerService.hide();
        }
      },
      error: (error: any) => {
        this.SpinnerService.hide();
        const errorMessage = error?.error?.message || 'Error al cargar colores por cliente';
        console.log(errorMessage, 'Cerrar', { timeout: 2500 });
      }
    });    
  }  

  /* --- Buscar Tela --- */
  buscarDescripcionTela(event?: KeyboardEvent) {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.bBuscarTela) {
      return;
    }

    this.bBuscarTela = true;

    let articleNumber = this.formulario.get('codigoTela')?.value;

    if (!articleNumber || articleNumber.trim() === '') {
      //this.MostrarAdvertencia('¡Importante!', '¡Importante ingresar Codigo Articulo!', 1500);
      this.bBuscarTela = false;
      return;
    }
    
    articleNumber = articleNumber.toUpperCase(); // Asegura letras en mayúscula
    const letras = articleNumber.substring(0, 2);
    const numeros = articleNumber.substring(2).replace(/\D/g, ''); // Solo dígitos

    // Validar letras
    if (!/^[A-Z]{2}$/.test(letras)) {
      this.MostrarAdvertencia('¡Importante!', 'Las primeras 2 posiciones deben ser letras mayúsculas', 1500);
      this.bBuscarTela = false;
      return;
    }

    // Completar con ceros si faltan dígitos
    const numerosCompletos = numeros.padStart(6, '0');
    const nuevoValor = letras + numerosCompletos;
    
    // Asignar el valor corregido al control
    this.formulario.get('codigoTela')?.setValue(nuevoValor);
    articleNumber = nuevoValor;    

    if (articleNumber) { 
      this.SpinnerService.show();
      this.service.getListaTelas(articleNumber).subscribe({
        next: (response: any) => {
          if (response.success){
            if (response.totalElements > 0){
              this.descripcionTela = response.elements[0].des_Tela;
              this.formulario.get('descripcionTela')?.setValue(response.elements[0].des_Tela); 
              if (this.descripcionTela != null || this.descripcionTela != ''){
                this.getRutaXCodTela(articleNumber);
              }
              this.SpinnerService.hide();
            }
            else {
              // Tela NO encontrada
              this.descripcionTela = '';
              this.formulario.get('descripcionTela')?.setValue('');
              document.getElementById('codigoTela')?.focus();
              this.bBuscarTela = false;
              this.SpinnerService.hide();
            }
          }
          else {
            this.descripcionTela = '';
            this.formulario.get('descripcionTela')?.setValue('');
            document.getElementById('codigoTela')?.focus();
            this.bBuscarTela = false;
            this.SpinnerService.hide();
          }
        },
        error: (error: any) => {
          this.toastr.error(error.message, 'Cerrar', {
            timeOut: 2500
          });
          this.SpinnerService.hide();
          const errorMessage = error?.error?.message || 'Error al cargar descripción de tela';
          console.log(errorMessage, 'Cerrar', { timeout: 2500 });
        }
      });
      
    } 
  }

  /* --- Buscar Ruta por Código de Tela --- */
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
        }
        this.SpinnerService.hide();
        // Pasar foco al siguiente campo
        setTimeout(() => {
          document.getElementById('codigoRutaTela')?.focus();
          setTimeout(() => {
            this.bBuscarTela = false;
          }, 0);
        });
      },
      error: (error: any) => {
        this.bBuscarTela = false;
        this.toastr.error(error.message, 'Cerrar', {
          timeOut: 2500
        });
        this.SpinnerService.hide();
        const errorMessage = error?.error?.message || 'Error al cargar rutas por código de tela';
        console.log(errorMessage, 'Cerrar', { timeout: 2500 });
      }
    });
  }

  /* --- Evento de Change Unidad de Negocio --- */
  chgUnidadNegocio(){
    this.reiniciaControles();
    this.unidadNegocio = this.formulario.get('unidadNegocio')?.value! || '';
    this.loadTipoUnidadesNegocio(Number(this.unidadNegocio));
  }

  /* --- Cargar Tipo Unidad de Negocio --- */
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
          this.SpinnerService.hide();
        }
      },
      error: (error: any) => {
        this.SpinnerService.hide();
        const errorMessage = error?.error?.message || 'Error al cargar tipo de unidades de negocio';
        console.log(errorMessage, 'Cerrar', { timeout: 2500 });
      }
    });    
  }

  /* --- Limpiar Seccion de Filtros --- */
  onLimpiarFiltros(){
    this.reiniciaControles();
  }

  /* --- Expandir/Contraer Seccion de Filtros --- */
  toggleCriterios() {
    this.panelCriteriosAbierto = !this.panelCriteriosAbierto;
  }

  // --- Panel de Historial (UI estática) ---
  /** Alterna la visibilidad del panel de Historial. Anclado = visible. */
  toggleHistorialPin() {
    this.historialPineado = !this.historialPineado;
  }

  /** El anclaje solo tiene sentido cuando hay procesos cargados. */
  get puedeAnclarHistorial(): boolean {
    return !!this.dataSource.data?.length;
  }

  /* --- Buscar Cotización --- */
  onBuscar() {
    this.mostrarRutaDetalle();
    this.panelCriteriosAbierto = false; // colapsa criterios y deja toda la altura a la tabla
  }

  mostrarRutaDetalle(): void {
    //BLOQUE DE VALIDACION
    //this.dataSource.data = [];
    this.onValidaExistenciaHistorialxColor();
  }

  onValidaExistenciaHistorialxColor(){
    const _unidad     = Number(this.unidadNegocio);
    const _tipo       = this.formulario.get('tipo')?.value || '';
    const _cliente    = this.formulario.get('cliente')?.value || '';
    const _tela       = this.formulario.get('codigoTela')?.value || '';
    const _ruta       = this.formulario.get('codigoRutaTela')?.value || '';
    const _color      = this.formulario.get('color')?.value || '';
    const bHistorial =  this.bValidaHistorial?"1":"0";

    this.onBuscaPreciosxColor(String(bHistorial), _unidad, _tipo, _cliente, _tela, _ruta, _color);
    return;

    // this.SpinnerService.show();
    // this.service.getValidaExistenciaHistorialxColor(_unidad, _tipo, _cliente, _tela, _ruta, _color, _receta).subscribe({
    //   next: (response: any) => {
    //     if(response.success){
    //       if (response.totalElements > 0){
    //         //Aqui habilita el semaforo
    //         this.bValidaHistorial = true;    

    //         console.log('MARCA CON HISTORIAL', response.elements);

    //         //metOdo de nuscar informacion de procesos desde la tabla de historial
    //         //this.getListarProcesosExportacion(_unidad, _tipo, _cliente, _tela, _ruta, _color, 0, 0);     
 
    //         //this.SpinnerService.hide();
    //       }
    //       else{
    //         this.dataSource_Hilos.data = [];     

    //         console.log('MARCA SIN HISTORIAL');
            
    //         //MUESTRA PRECIOS DE LA BD SI ES QUE NO EXISTE HISTORIAL
    //         //this.onBuscaPreciosxColor(_color);

    //         //this.SpinnerService.hide();
    //       };
    //     }else{
    //       this.dataSource_Hilos.data = [];
    //     }
    //   },
    //   error: (error: any) => {
    //     this.SpinnerService.hide();
    //     console.log(error.error.message, 'Cerrar', {
    //       timeout: 2500
    //     })
    //   }
    // });       
  
  }

  onBuscaPreciosxColor(Tipo_Busqueda: string, Pro_Cen_Cos: number, Tipo: string, Cod_Cliente_Tex: string, Cod_Tela: string, Cod_Ruta: string, Cod_Color: string){
    this.dataSource_Precios = null;
    this.SpinnerService.show();
    this.service.getListaPrecioXColor(Tipo_Busqueda, Pro_Cen_Cos, Tipo, Cod_Cliente_Tex, Cod_Tela, Cod_Ruta, Cod_Color).subscribe({
      next: (response: any) => {
        if(response.success){
          console.log(':::::::::::::RESULTADO DE PRECIO', response);

          this.codigoRutaTela = Cod_Ruta;

          // Filtros de esta búsqueda: seleccionarVersion() los reutiliza al cambiar de card.
          this.ultimaBusqueda = {
            unidad: Number(this.unidadNegocio),
            tipo: Tipo,
            cliente: Cod_Cliente_Tex,
            tela: Cod_Tela,
            ruta: Cod_Ruta,
            color: Cod_Color
          };

          // Mantenemos dataSource_Precios por compatibilidad con el modal (inerte, no se abre).
          this.dataSource_Precios = response.elements;

          this.global_CodReceta = '';
          this.formulario_Precio.get('ctrl_receta').setValue('');

          this.historialVersiones = this.mapPreciosAVersiones(response.elements);
          this.busquedaRealizada = true;
          this.historialPineado = true;
          this.borrador = null;
          this.borradorActivo = false;

          if (this.historialVersiones.length > 0){
            // Autoselecciona la primera opción; internamente ya dispara getListarProcesosExportacion.
            this.seleccionarVersion(this.historialVersiones[0]);
          } else {
            console.log(':::::::::::::NO TIENE PRECIOS');
            this.versionSeleccionada = null;
            this.global_PrecioTinto = 0;
            this.global_Tiempo      = 0;
            this.global_SDC         = "";
            this.global_idCotizacion_Cab = 0;

            this.getListarProcesosExportacion(Number(this.unidadNegocio), Tipo, Cod_Cliente_Tex, Cod_Tela, Cod_Ruta, Cod_Color, this.global_PrecioTinto, this.global_Tiempo, this.global_idCotizacion_Cab);
          }
        }else{
          this.dataSource_Precios = null;
          this.historialVersiones = [];
          this.versionSeleccionada = null;
          this.busquedaRealizada = true;
          this.borrador = null;
          this.borradorActivo = false;
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

  // Mapea la respuesta cruda de getListaPrecioXColor a las cards del panel de Historial.
  private mapPreciosAVersiones(elements: any[]): VersionPrecio[] {
    return (elements ?? []).map((e, i) => ({
      id            : Number(e.idcotizacioN_CAB) || 0,
      titulo        : `Opción ${i + 1}`,
      sdc           : String(e.corR_CARTA ?? ''),
      precioTinto   : Number(e.preC_TINTO) || 0,
      precioAcabado : Number(e.preC_ACABADO) || 0,
      tiempo        : Number(e.tiempo) || 0,
      receta        : String(e.idrecetalabprod ?? ''),
      reciente      : i === 0,
      raw           : e,
      // Fase 2 — hoy llegan undefined, la card los omite con *ngIf
      usuario : e.usu_Registro,
      fecha   : e.fec_Registro,
      estado  : e.estado
    }));
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
              p.childCount = this.planos.filter(x => x.pro_Hover.startsWith(p.pro_Hover + '.')).length;
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

        } else {
          this.dataSource.data = [];
          this.bMuestraMenuFlotante = false;
        }
        this.SpinnerService.hide();
      },
      error: (error: any) => {
        this.toastr.error(error.message, 'Cerrar', { timeOut: 2500 });
        this.SpinnerService.hide();
      }
    });
  }

  /********************** SWAL ALERT MOSTRAR CARGANDO ********************************* */
  private MostrarCargando(titulo: string = 'Cargando...', texto: string = 'Por favor espere.') {
    Swal.fire({
        title: titulo,
        text: texto,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        background: '#fff',
        didOpen: () => {
            Swal.showLoading();
        }
    });
  }
  
  /********************** SWAL ALERT CERRAR CARGANDO ********************************* */
  private CerrarCargando() {
    Swal.close();
  }

  /********************** SWAL ALERT MOSTRAR ERROR ********************************* */
  private MostrarError(titulo: string = 'Error', texto: string = 'Ocurrió un error inesperado.', timer: number = 0 ): void {
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: texto,
      confirmButtonText: 'Aceptar',
      timer: timer > 0 ? timer : undefined,
      timerProgressBar: timer > 0
    });
  }

  /********************** SWAL ALERT MOSTRAR ÉXITO ********************************* */
  private MostrarExito(titulo: string = 'Operación exitosa', texto: string = 'La operación se realizó correctamente.', timer: number = 2000 ): void {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: texto,
      confirmButtonText: 'Aceptar',
      timer: timer > 0 ? timer : undefined,
      timerProgressBar: timer > 0
    });
  }

  /********************** SWAL ALERT MOSTRAR ADVERTENCIA ********************************* */
  private MostrarAdvertencia(titulo: string = 'Advertencia', texto: string = 'Revise la información ingresada.', timer: number = 0 ): void {
    Swal.fire({
      icon: 'warning',
      title: titulo,
      text: texto,
      confirmButtonText: 'Aceptar',

      timer: timer > 0 ? timer : undefined,
      timerProgressBar: timer > 0,

      customClass: {
        popup: 'cot-swal-popup',
        title: 'cot-swal-title',
        htmlContainer: 'cot-swal-text',
        confirmButton: 'cot-swal-confirm'
      }
    });

  }

  /********************** SWAL ALERT MOSTRAR INFORMACIÓN ********************************* */
  private MostrarInformacion(titulo: string = 'Información', texto: string = '', timer: number = 0 ): void {
    Swal.fire({
      icon: 'info',
      title: titulo,
      text: texto,
      confirmButtonText: 'Aceptar',
      timer: timer > 0 ? timer : undefined,
      timerProgressBar: timer > 0
    });
  }







//#Region EVENTOS DEL FORMULARIO

  toggleExpand(row: any) {
    if (row.isParent) {
      if (this.expandedRows.has(row.pro_Hover)) {
        this.expandedRows.delete(row.pro_Hover); // colapsar
      } else {
        this.expandedRows.add(row.pro_Hover); // expandir
      }
    }
  }

//#endregion


  

  private static readonly ICONOS_SECCION: { claves: string[]; icono: string }[] = [
    { claves: ['MATERIA', 'HILADO', 'ALGODON', 'INSUMO'], icono: 'inventory_2' },
    { claves: ['TEJID', 'TEJEDURIA', 'URDID'], icono: 'precision_manufacturing' },
    { claves: ['TENID', 'TINTOR'], icono: 'color_lens' },
    { claves: ['PREPARA', 'DESCRUD', 'BLANQUE'], icono: 'science' },
    { claves: ['ACABAD', 'RAMA', 'COMPACT', 'PERCHA', 'ANTIPILLING', 'ABRIDORA'], icono: 'auto_fix_high' },
  ];

  // Icono por sección: mapea el nombre del proceso (pro_Des) a un icono Material.
  // No viene del backend, así que se infiere por palabra clave; sin coincidencia usa un icono genérico.
  iconoSeccion(row: any): string {
    const nombre = (row.pro_Des || '')
      .toUpperCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');

    for (const grupo of CotizacionesComponent.ICONOS_SECCION) {
      if (grupo.claves.some(clave => nombre.includes(clave))) {
        return grupo.icono;
      }
    }
    return 'layers';
  }

  // --- Estado de presentación (rediseño UX) ---

  

  onDensidadChange(valor: 'compacta' | 'comoda') {
    this.densidad = valor;
  }

  abrirEdicion(row: any, tipo: 'utilidad' | 'ajuste' | 'cotizacion') {
    if (tipo === 'ajuste' && (!row.pro_Tot_Com || row.pro_Tot_Com === 0)) {
      return; // misma condición que antes bloqueaba el input embebido
    }
    this.filaEnEdicion = row;
    this.tipoEdicion = tipo;
    this.datosGeneralesAbierto = true;
    this.dialogRefAjuste = this.dialog.open(this.dialogAjuste, {
      width: '460px',
      maxWidth: '92vw',
      autoFocus: false,
      panelClass: 'cot-modal-panel',
      data: { row, tipo }
    });
    this.dialogRefAjuste.afterClosed().subscribe(() => {
      this.filaEnEdicion = null;
      this.tipoEdicion = null;
    });
  }

  cerrarEdicion() {
    if (this.dialogRefAjuste) {
      this.dialogRefAjuste.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.filaEnEdicion) {
      this.cerrarEdicion();
    }
  }

  






  seleccionarVersion(v: VersionPrecio) {
    // Si veníamos del borrador, se guarda snapshot antes de abandonarlo (conserva ajustes).
    if (this.borradorActivo) { this.snapshotBorrador(); }
    this.borradorActivo = false;
    this.versionSeleccionada = v;

    this.global_PrecioTinto      = v.precioTinto;
    this.global_Tiempo           = v.tiempo;
    this.global_SDC              = v.sdc;
    this.global_idCotizacion_Cab = v.id;

    const f = this.ultimaBusqueda;
    if (!f) { return; }

    this.getListarProcesosExportacion(
      f.unidad, f.tipo, f.cliente, f.tela, f.ruta, f.color,
      this.global_PrecioTinto, this.global_Tiempo, this.global_idCotizacion_Cab
    );
  }

  /* --- Nueva Cotización: crea el borrador si no existe, o reselecciona el existente ---
     Solo puede existir un borrador a la vez; el botón nunca crea un segundo. */
  nuevaCotizacionUI() {
    if (this.borrador) {
      this.seleccionarBorrador();
      return;
    }

    const f = this.ultimaBusqueda;
    if (!f) {
      this.toastr.info('Primero realiza una búsqueda', '', { timeOut: 2000 });
      return;
    }

    this.borrador = { planos: [], planosBackup: [], recetaCod: '' };
    this.global_CodReceta = '';
    this.formulario_Precio.get('ctrl_receta').setValue('');

    this.seleccionarBorrador();
  }

  /* --- Activa el borrador: restaura desde memoria si ya tiene snapshot, o lo pide al backend ---
     con precio/tiempo/IdCotizacion_Cab en cero. El backend responde existeCotizacion = '0',
     lo que desbloquea la columna Ajuste y habilita Guardar (ver getListarProcesosExportacion). */
  seleccionarBorrador() {
    if (!this.borrador) { return; }

    this.borradorActivo      = true;
    this.versionSeleccionada = null;

    this.global_PrecioTinto = 0;
    this.global_Tiempo      = 0;
    this.global_SDC         = '';
    this.global_idCotizacion_Cab = 0;

    if (this.borrador.planos.length) {
      this.restaurarBorrador();
      return;
    }

    const f = this.ultimaBusqueda;
    if (!f) { return; }
    this.getListarProcesosExportacion(f.unidad, f.tipo, f.cliente, f.tela, f.ruta, f.color, 0, 0, 0);
  }

  private snapshotBorrador() {
    if (!this.borrador) { return; }
    this.borrador.planos       = JSON.parse(JSON.stringify(this.dataSource.data));
    this.borrador.planosBackup = JSON.parse(JSON.stringify(this.planosBackup));
    this.borrador.recetaCod    = this.global_CodReceta;
  }

  private restaurarBorrador() {
    this.planos       = JSON.parse(JSON.stringify(this.borrador!.planos));
    this.planosBackup = JSON.parse(JSON.stringify(this.borrador!.planosBackup));
    this.dataSource.data = this.planos;
    this.dataSource.sort = this.sort;

    this.global_CodReceta = this.borrador!.recetaCod;
    this.formulario_Precio.get('ctrl_receta').setValue(this.borrador!.recetaCod);

    // Mismo estado que deja getListarProcesosExportacion con existeCotizacion = '0'.
    this.isAjusteBloqueado    = false;
    this.isDisabledBtnSave    = true;
    this.isDisabledBtnEdit    = false;
    this.isDisabledBtnDelete  = false;
    this.bMuestraMenuFlotante = true;
  }

  get resumenCriterios(): { label: string, value: string, icon: string }[] {
    const v = this.formulario.value;
    const chips: { label: string, value: string, icon: string }[] = [];

    const undNeg = this.unidadesNegocio.find(u => u.codigo === v.unidadNegocio);
    if (undNeg) chips.push({ label: COTIZACIONES_FIELDS.UNIDAD_NEGOCIO.label, value: undNeg.descripcion, icon: COTIZACIONES_FIELDS.UNIDAD_NEGOCIO.icon });

    const tipo = this.tipoUnidadesNegocio.find(t => t.codigo === v.tipo);
    if (tipo) chips.push({ label: COTIZACIONES_FIELDS.TIPO_UNIDAD.label, value: tipo.descripcion, icon: COTIZACIONES_FIELDS.TIPO_UNIDAD.icon });

    const cliente = this.dataClientes.find(c => c.cod_Cliente_Tex === v.cliente);
    if (cliente) chips.push({ label: COTIZACIONES_FIELDS.CLIENTE.label, value: cliente.abr_Cliente, icon: COTIZACIONES_FIELDS.CLIENTE.icon });

    if (v.codigoTela) chips.push({ label: COTIZACIONES_FIELDS.TELA.label, value: v.codigoTela, icon: COTIZACIONES_FIELDS.TELA.icon });
    
    if (v.descripcionTela) chips.push({ label: COTIZACIONES_FIELDS.DESCRIPCION_TELA.label, value: v.descripcionTela, icon: COTIZACIONES_FIELDS.DESCRIPCION_TELA.icon });

    const ruta = this.RutaXCodTela.find(r => r.codigo === v.codigoRutaTela);
    if (ruta) chips.push({ label: COTIZACIONES_FIELDS.RUTA.label, value: ruta.nombre, icon: COTIZACIONES_FIELDS.RUTA.icon });

    const color = this.listaCodigoColor.find(c => c.codigo === v.color);
    if (color) chips.push({ label: COTIZACIONES_FIELDS.COLOR.label, value: color.descripcion, icon: COTIZACIONES_FIELDS.COLOR.icon });

    return chips;
  }

  ///////////////////////////////////////////////////////////////////////////

  







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

  reiniciaControles(){
    this.codigoRutaTela = '';
    this.formulario.get('tipo')?.setValue(''); 
    this.formulario.get('cliente')?.setValue(''); 
    this.formulario.get('filtro')?.setValue('');
    this.formulario.get('codigoTela')?.setValue(''); 
    this.formulario.get('descripcionTela')?.setValue(''); 
    this.formulario.get('descripcionTela')?.disable();
    this.formulario.get('codigoRutaTela')?.setValue(''); 
    this.formulario.get('codigoColor')?.setValue(''); 
    this.formulario.get('color')?.setValue('');
    //DesHabilita botoneria
    this.bMuestraMenuFlotante = false;
    this.isDisabledBtnFind    = false;
    this.panelCriteriosAbierto = true; // vuelve a mostrar el formulario completo

    this.formulario.get('filtro')?.setValue(''); 
    this.formulario.get('filtroColores')?.setValue(''); 
    
    this.RutaXCodTela = [];
    this.ColoresFiltrada = [];

    //Limpia panel de Cotizaciones
    this.historialVersiones   = [];
    this.versionSeleccionada  = null;
    this.busquedaRealizada    = false;
    this.borrador             = null;
    this.borradorActivo       = false;
    this.ultimaBusqueda       = null;
    this.dataSource_Precios   = null;
  }

   

  

  // NOTA: filtrarClientes()/filtrarColores() y los controles filtro/filtroColores
  // quedaron sin uso en el template tras migrar Cliente/Color a <ng-select>, que
  // filtra por su cuenta. Se dejan declarados para no tocar el payload del form.
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





onChangeColor(){
  this.isDisabledBtnFind = true;
  //this.dataSource.data = [];
  // const _CodColor = this.formulario.get('color')?.value || '';
  // this.onBuscaPreciosxColor(_CodColor);

  //AQUI DEBE LLAMAR AL LISTAR 
  //this.onBuscar();
  
  //this.onValidaExistenciaHistorialxColor();


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



onCancelarPrecio(){
  if (this.dialogRef) {
    this.dialogPrecio = true;
    this.dialogRef.close();
  }
}

//onChangeColor(){
  //this.validaCodigoColor();
//}

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
