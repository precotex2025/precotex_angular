import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CotizacionesService } from 'src/app/services/cotizaciones/cotizaciones.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { ProcesoColgadoresService } from 'src/app/services/proceso-colgadores.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { GlobalVariable } from 'src/app/VarGlobals';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { COTIZACIONES_FIELDS } from 'src/app/shared/constants/cotizaciones-fields';
import { ComboItem, VersionPrecio, RutaTela, CentroCosto, BorradorCotizacion, FiltrosBusqueda, ClienteComboItem } from 'src/app/models/cotizaciones';

import {
  ProcesoExportacionItem, RecetaAntipillingItem, PrecioXColorItem, HiladoTelaItem,
  ProcesoCotizacionDetalle, ProcesoCotizacionRequest,
  ListaPrecioXColorRequest, ListarProcesosExportacionRequest, ObtenerNuevoCorrelativoVersionRequest,
  UnidadNegocioItem, UnidadNegocioTipoItem, ClienteColgadorItem, TelaItem, RutaTelaRawItem,
  CorrelativoVersionItem, CentroCostoRawItem,
  ListaCabecerasCotizacionRequest, ListaDetalleCotizacionXFiltrosRequest,
  ListaDetalleCotizacionXVersionRequest, CabeceraCotizacionItem
} from 'src/app/interfaces/cotizaciones';
import { ServiceResponse, ServiceResponseList } from 'src/app/interfaces/shared';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss']
})

export class CotizacionesComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('dialogAjuste') dialogAjuste!: TemplateRef<any>;
  observacion: string = '';

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
  descripcionTela = '';
  codigoRutaTela = '';
  RutaXCodTela: RutaTela[] = [];
  RutaXCodTelaDetalle = [];
  centroCosto: CentroCosto[] = [];
  bMuestraMenuFlotante: boolean = false;
  dataClientes    : ClienteComboItem[] = [];
  planos          : ProcesoExportacionItem[] = [];
  planosBackup : ProcesoExportacionItem[] = [];
  dataRecetas     : RecetaAntipillingItem[] = [];
  sUsuario        = GlobalVariable.vusu;
  dataDetalles: ProcesoCotizacionDetalle[] = [];
  isAjusteBloqueado   = true;
  bBuscarTela         = false;
  // --- Historial: sin control en UI, se envía siempre en false ---
  bValidaHistorial    = false;

  filaSeleccionada: any = null;
  global_Tiempo       : number = 0;
  global_PrecioTinto  : number = 0;
  global_SDC          : string = "";
  global_CodReceta    : string = "";
  global_idCotizacion_Cab : number = 0;

  // Precio elegido en el combo "Precio / SDC" (se puebla al elegir Color, ver onChangeColor/onChangePrecio)
  precioSeleccionado: any = null;

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
  unidadesNegocio : ComboItem[] =[]; // ['Textil', 'Confección', 'Exportación'];
  tipoUnidadesNegocio : ComboItem[] =[];
  intensidad: ComboItem[] =[];
  listaCodigoColor: ComboItem[] = [];
  expandedRows: Set<string> = new Set(); // usamos el pro_Hover como clave
  habilitadoBtnGuardar   = false;
  isDisabledBtnEdit   = false;
  isDisabledBtnDelete = false;
  isDisabledBtnFind   = false;

  // --- Estado de presentación (rediseño UX) ---
  seccionTotalmenteColapsada = false;
  modoResumen = false;
  densidad: 'compacta' | 'comoda' = 'compacta';

  get panelCriteriosAbierto(): boolean {
    return !this.seccionTotalmenteColapsada && !this.modoResumen;
  }

  // Tabla de solo lectura + modal de edición
  filaEnEdicion: any = null;
  tipoEdicion: 'utilidad' | 'ajuste' | 'cotizacion' | null = null;
  datosGeneralesAbierto = true;

  // --- Panel de Historial: alimentado por getListarProcesosExportacion (ver onBuscar) ---
  historialVersiones: VersionPrecio[] = [];
  historialPineado = true;
  versionSeleccionada: VersionPrecio | null = null;
  busquedaRealizada = false;   // controla la visibilidad del panel tras el primer Buscar

  // Borrador en curso: sobrevive a la navegación entre versiones (conserva ajustes escritos).
  // onBuscar lo crea automáticamente cuando no hay cotizaciones para los filtros
  // (ver crearBorradorNuevo). Se destruye tras guardar (ver reiniciaControles). Uno solo a la vez.
  borrador: BorradorCotizacion | null = null;
  borradorActivo = false;   // true = la grilla está mostrando el borrador

  // Filtros de la última búsqueda, para poder re-disparar getListarProcesosExportacion
  // cuando el usuario elige otra card del historial sin volver a leer el formulario.
  private ultimaBusqueda: FiltrosBusqueda | null = null;

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
  dataSource_Hilos: MatTableDataSource<HiladoTelaItem> = new MatTableDataSource();

  displayedColumns_Precio: string[] = [
      'opcion'        ,
      'corR_CARTA'    ,
      'tiempo'        ,
      'preC_TINTO'    ,
      //'preC_ACABADO'  ,
      'idrecetalabprod',
  ];
  // Lista de precios por color (array crudo del backend, ver onBuscaPreciosxColor)
  dataSource_Precios: PrecioXColorItem[] | null = null;


  formulario = this.formBuilder.group({
    unidadNegocio   :[''],
    tipo            :[''],
    cliente         :[''],
    codigoTela      :[''],
    descripcionTela :[''],
    codigoRutaTela  :[''],
    intensidad      :[''],
    color           :['']
  });

  formulario_Precio = this.formBuilder.group({
    ctrl_receta: ['']
  });

  COTIZACIONES_FIELDS = COTIZACIONES_FIELDS;

  //INICIALIZACION DE COMPONENTE
  ngOnInit(): void {
    this.loadUnidadNeg();
    this.LoadClientes();
    this.loadRecetas();
  }

  ///////////////////////////////////////////////////////////////////////////
  //                          UNIDAD DE NEGOCIO                             //
  ///////////////////////////////////////////////////////////////////////////

  /* --- Cargar Unidad de Negocio --- */
  loadUnidadNeg(){
    this.unidadesNegocio = [];
    this.SpinnerService.show();

    this.service.getListaUnidadNegocio()
      .pipe( finalize(() => {
        this.SpinnerService.hide()
        }) 
      )
      .subscribe({
        next: (response: ServiceResponseList<UnidadNegocioItem>) => {
          this.unidadesNegocio = response.success ? (response.elements ?? []) : [];
        },
        error: (error: any) => {
          const errorMessage = error?.error?.message || 'Error al cargar unidades de negocio';
          this.matSnackBar.open(errorMessage, 'Cerrar', { duration: 2500 });
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

    this.service.getListaUnidadNegocioTipo(Number(Id_Unidad_NegocioKey))
      .pipe( finalize(() => {
          this.SpinnerService.hide()
        }) 
      )
      .subscribe({
        next: (response: ServiceResponseList<UnidadNegocioTipoItem>) => {
          this.tipoUnidadesNegocio = response.success ? (response.elements ?? []) : [];
        },
        error: (error: any) => {
          const errorMessage = error?.error?.message || 'Error al cargar tipo de unidades de negocio';
          this.matSnackBar.open(errorMessage, 'Cerrar', { duration: 2500 });
        }
    });
  }

  ///////////////////////////////////////////////////////////////////////////
  //                               CLIENTE                                  //
  ///////////////////////////////////////////////////////////////////////////

  /* --- Cargar Clientes --- */
  LoadClientes(){
    this.dataClientes = [];
    this.SpinnerService.show();

    this.serviceColgadores.getObtieneInformacionClienteColgador()
      .pipe( finalize(() => {
        this.SpinnerService.hide();
      }))
      .subscribe({
        next: (response: any) => {
          const data = response as ServiceResponseList<ClienteColgadorItem>;
          const elementos = data.success ? (data.elements ?? []) : [];
          // "label" es el texto que muestra el <ng-select> (bindLabel="label")
          this.dataClientes = elementos.map(c => ({
                ...c,
                label: c.abr_Cliente + ' - ' + c.nom_Cliente
              }));
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'Error al cargar clientes';
          this.matSnackBar.open(errorMessage, 'Cerrar', { duration: 2500 });
        }
    });
  }

  /* --- Evento change clientes: recarga los colores del nuevo cliente y limpia todo lo que
     dependía del cliente anterior (color elegido, lista de colores y precio/SDC), para que
     no se pueda buscar ni guardar con un color que ya no pertenece al cliente vigente. --- */
  onChangeCliente(){
    this.formulario.get('color')?.setValue('');
    this.listaCodigoColor = [];
    this.limpiarSeleccionPrecio();

    const _cliente = this.formulario.get('cliente')?.value || '';

    if (_cliente === null || _cliente === undefined || _cliente === '') {
      return;
    }

    this.loadColoresXCliente(_cliente);
  }

  /* --- Lista Colores Por Clientes --- */
  loadColoresXCliente(Cod_Cliente: string) {
    this.listaCodigoColor = [];
    this.SpinnerService.show();

    this.service.getListaColoresXCliente(Cod_Cliente)
    .pipe( finalize(() => {
      this.SpinnerService.hide();
    }))
    .subscribe({
      next: (response: ServiceResponseList<ComboItem>) => {
        this.listaCodigoColor = response.success ? (response.elements ?? []) : [];
      },
      error: (error: any) => {
        const errorMessage = error?.error?.message || 'Error al cargar colores por cliente';
        this.matSnackBar.open(errorMessage, 'Cerrar', { duration: 2500 });
      }
    });
  }

  ///////////////////////////////////////////////////////////////////////////
  //                        RECETAS ANTIPILLING                             //
  ///////////////////////////////////////////////////////////////////////////

  /* --- Cargar Recetas Antipilling --- */
  loadRecetas(){
    this.dataRecetas = [];
    this.SpinnerService.show();

    this.service.getListaRecetasAntipilling()
    .pipe( finalize(() => {
      this.SpinnerService.hide();
    }))
    .subscribe({
      next: (response: ServiceResponseList<RecetaAntipillingItem>) => {
        if(response.success && response.elements?.length){
          this.dataRecetas = response.elements;
        }
        else{
          this.dataSource_Hilos.data = [];
        }
      },
      error: (error: any) => {
        const errorMessage = error?.error?.message || 'Error al cargar recetas antipilling';
        this.matSnackBar.open(errorMessage, 'Cerrar', { duration: 2500 });
      }
    });
  }

  ///////////////////////////////////////////////////////////////////////////
  //                                 COLOR                                  //
  ///////////////////////////////////////////////////////////////////////////

  /** Limpia el precio/SDC elegido en el combo Precio/SDC. Se usa al cambiar Color (ver
   *  onChangeColor) y al cambiar/limpiar Cliente (ver onChangeCliente), porque un cliente
   *  o color distinto invalida el precio que estaba seleccionado. */
  private limpiarSeleccionPrecio(): void {
    this.precioSeleccionado = null;
    this.dataSource_Precios = null;
    this.global_PrecioTinto = 0;
    this.global_Tiempo      = 0;
    this.global_SDC         = "";
    this.global_idCotizacion_Cab = 0;
  }

  /* --- Cambio de Color: solo trae la lista de precios por color para el combo Precio/SDC.
     No toca la tabla de costeo; eso lo dispara únicamente onBuscar. --- */
  onChangeColor(){
    this.limpiarSeleccionPrecio();

    const _color = this.formulario.get('color')?.value || '';
    if (!_color) { return; }

    const _unidad    = Number(this.unidadNegocio);
    const _tipo      = this.formulario.get('tipo')?.value || '';
    const _cliente   = this.formulario.get('cliente')?.value || '';
    const _tela      = this.formulario.get('codigoTela')?.value || '';
    const _ruta      = this.formulario.get('codigoRutaTela')?.value || '';
    const bHistorial = this.bValidaHistorial ? "1" : "0";

    this.onBuscaPreciosxColor(String(bHistorial), _unidad, _tipo, _cliente, _tela, _ruta, _color);
  }

  /* --- Selección de precio en el combo Precio/SDC --- */
  onChangePrecio(p: PrecioXColorItem){
    this.precioSeleccionado = p;
    this.global_PrecioTinto      = Number(p.preC_TINTO);
    this.global_Tiempo           = Number(p.tiempo);
    this.global_SDC              = String(p.corR_CARTA);
    this.global_idCotizacion_Cab = Number(p.idcotizacioN_CAB);
  }

  /** Trae la lista de precios por color (catálogo). No dispara getListarProcesosExportacion. */
  onBuscaPreciosxColor(Tipo_Busqueda: string, Pro_Cen_Cos: number, Tipo: string, Cod_Cliente_Tex: string, Cod_Tela: string, Cod_Ruta: string, Cod_Color: string){
    this.dataSource_Precios = null;
    this.SpinnerService.show();

    const request: ListaPrecioXColorRequest = {
      Tipo_Busqueda, Pro_Cen_Cos, Tipo, Cod_Cliente_Tex, Cod_Tela, Cod_Ruta, Cod_Color
    };

    this.service.getListaPrecioXColor(request)
    .pipe( finalize(() => {
      this.SpinnerService.hide()
     }))
    .subscribe({
      next: (response: ServiceResponseList<PrecioXColorItem>) => {
        if(response.success){
          const elementos = response.elements ?? [];
          this.dataSource_Precios = elementos;
          // El historial de versiones ya no se arma aquí: lo alimenta
          // getListaCabecerasCotizacion con el num_Version real de BD
          // (ver cargarHistorialCotizaciones). Este método solo llena el combo Precio/SDC.

          // Con un solo resultado, se autoselecciona para no obligar a abrir el combo.
          if (elementos.length === 1){
            this.onChangePrecio(elementos[0]);
          }
        }else{
          this.dataSource_Precios = null;
        }
      },
      error: (error: any) => {
        const errorMessage = error?.error?.message || 'Error al cargar recetas antipilling';
        this.matSnackBar.open(errorMessage, 'Cerrar', { duration: 2500 });
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
      this.service.getListaTelas(articleNumber)
      .pipe( finalize(() => { 
        this.SpinnerService.hide()
       }))
      .subscribe({
        next: (response: ServiceResponseList<TelaItem>) => {
          if (response.success && response.elements?.length){
            this.descripcionTela = response.elements[0].des_Tela;
            this.formulario.get('descripcionTela')?.setValue(response.elements[0].des_Tela);
            if (this.descripcionTela != null || this.descripcionTela != ''){
              this.getRutaXCodTela(articleNumber);
            }
          }
          else {
            // Tela NO encontrada
            this.descripcionTela = '';
            this.formulario.get('descripcionTela')?.setValue('');
            document.getElementById('codigoTela')?.focus();
            this.bBuscarTela = false;
          }
        },
        error: (error: any) => {
          const errorMessage = error?.error?.message || 'Error al cargar descripción de tela';
          this.matSnackBar.open(errorMessage, 'Cerrar', { duration: 2500 });
        }
      });

    }
  }

  /* --- Buscar Ruta por Código de Tela --- */
  getRutaXCodTela(Cod_Tela: string): void {
    this.SpinnerService.show();

    this.service.getRutaXCodTela(Cod_Tela)
    .pipe( finalize(() => { 
      this.SpinnerService.hide()
     }))
    .subscribe({
      next: (response: ServiceResponseList<RutaTelaRawItem>) => {
        if(response.success && response.elements?.length){
          this.RutaXCodTela = response.elements.map(r => ({
            codigo: r.cod_Ruta,
            nombre: r.descripcion
          }));
        }
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
        const errorMessage = error?.error?.message || 'Error al cargar rutas por código de tela';
        this.matSnackBar.open(errorMessage, 'Cerrar', { duration: 2500 });
      }
    });
  }

  /* --- Limpiar Seccion de Filtros --- */
  onLimpiarFiltros(){
    this.reiniciaControles();
  }

  /* --- Expandir/Contraer Seccion de Filtros Entera --- */
  toggleSeccionColapsada() {
    this.seccionTotalmenteColapsada = !this.seccionTotalmenteColapsada;
  }

  /* --- Alternar Modo Resumen (Switch ON/OFF) --- */
  toggleModoResumen() {
    this.modoResumen = !this.modoResumen;
    if (this.seccionTotalmenteColapsada) {
      this.seccionTotalmenteColapsada = false;
    }
  }

  /* --- Legacy toggle for fallback --- */
  toggleCriterios() {
    this.toggleSeccionColapsada();
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

  /* --- Buscar Cotización: primero carga el historial de cabeceras con los siete criterios
     (getListaCabecerasCotizacion). Si hay cabeceras, autoselecciona la más reciente y trae su
     detalle por cabecera+versión; si no hay ninguna, arma la grilla desde cero con los filtros
     y activa el borrador. Ver cargarHistorialCotizaciones al final del archivo. --- */
  onBuscar() {
    const _unidad  = Number(this.unidadNegocio);
    const _tipo    = this.formulario.get('tipo')?.value || '';
    const _cliente = this.formulario.get('cliente')?.value || '';
    const _tela    = this.formulario.get('codigoTela')?.value || '';
    const _ruta    = this.formulario.get('codigoRutaTela')?.value || '';
    const _color   = this.formulario.get('color')?.value || '';

    if (!_unidad || !_tipo || !_cliente || !_tela || !_ruta || !_color) {
      this.MostrarAdvertencia(
        'Criterios incompletos',
        `Complete ${COTIZACIONES_FIELDS.UNIDAD_NEGOCIO.label}, ${COTIZACIONES_FIELDS.TIPO_UNIDAD.label}, ${COTIZACIONES_FIELDS.CLIENTE.label}, ${COTIZACIONES_FIELDS.TELA.label}, ${COTIZACIONES_FIELDS.RUTA.label} y ${COTIZACIONES_FIELDS.COLOR.label} antes de buscar.`
      );
      return;
    }

    this.codigoRutaTela = _ruta;

    // Filtros de esta búsqueda: seleccionarVersion()/seleccionarBorrador()/nuevaCotizacionUI() los reutilizan.
    const filtrosNuevos: FiltrosBusqueda = {
      unidad: _unidad,
      tipo: _tipo,
      cliente: _cliente,
      tela: _tela,
      ruta: _ruta,
      color: _color,
      sdcReferencia: String(this.global_SDC ?? '')
    };

    // El borrador solo se descarta si cambian los criterios: así una versión nueva a medio
    // escribir sobrevive a un Buscar sobre los mismos filtros (ver mismosCriterios).
    if (!this.mismosCriterios(this.ultimaBusqueda, filtrosNuevos)) {
      this.borrador = null;
    }

    this.ultimaBusqueda = filtrosNuevos;

    this.busquedaRealizada = true;
    this.historialPineado = true;
    this.borradorActivo = false;
    this.versionSeleccionada = null;

    // Paso 1: el historial manda. Él decide si se carga el detalle de una versión
    // existente (API por cabecera+versión) o la grilla desde cero (API por filtros).
    this.cargarHistorialCotizaciones();

    this.modoResumen = true;
    this.seccionTotalmenteColapsada = false;
  }

  /* --- Crea un borrador nuevo pidiendo correlativo/versión al backend y lo preselecciona.
     Se usa desde el botón manual "Nueva Cotización" (ver nuevaCotizacionUI), donde no hay
     planos ya cargados para reutilizar. Cuando el borrador se activa automáticamente tras
     una búsqueda sin cotización existente, ver el bloque dedicado en getListarProcesosExportacion,
     que reutiliza los planos recién cargados en vez de volver a pedirlos. --- */
  private crearBorradorNuevo() {
    const f = this.ultimaBusqueda;
    if (!f) { return; }

    const request: ObtenerNuevoCorrelativoVersionRequest = {
      Id_Unidad_NegocioKey: f.unidad,
      Cod_Tipo_Orden_tinto: f.tipo,
      Cod_Cliente_Tex: f.cliente,
      Cod_Tela: f.tela,
      Cod_Ruta: f.ruta,
      Cod_Color: f.color
    };

    this.SpinnerService.show();
    this.service.getObtenerNuevoCorrelativoVersion(request).subscribe({
      next: (response: ServiceResponseList<CorrelativoVersionItem>) => {
        const e = response?.elements?.[0];
        this.borrador = {
          planos: [], planosBackup: [], recetaCod: '',
          correlativo: String(e?.correlativo ?? ''),
          version: Number(e?.version) || 1,
          baseIdCotizacionCab: 0
        };
        this.global_CodReceta = '';
        this.formulario_Precio.get('ctrl_receta').setValue('');

        this.seleccionarBorrador();
      },
      error: (error: any) => {
        this.SpinnerService.hide();
        this.toastr.error(error.message, 'Cerrar', { timeOut: 2500 });
      }
    });
  }

  getListarProcesosExportacion(Pro_Cen_Cos: number, Tipo: string, Cod_Cliente_Tex: string, Cod_Tela: string, Cod_Ruta: string, Cod_Color: string, precio: number, tiempo: number, IdCotizacion_Cab: number): void {
    //limpia
    this.planos = []
    this.planosBackup = [];

    this.SpinnerService.show();

    const request: ListarProcesosExportacionRequest = {
      Pro_Cen_Cos, Tipo, Cod_Cliente_Tex, Cod_Tela, Cod_Ruta, Cod_Color, precio, tiempo, IdCotizacion_Cab
    };

    this.service.getListarProcesosExportacion(request).subscribe({
      next: (response: ServiceResponseList<ProcesoExportacionItem>) => {
        if (response.success && response.elements?.length) {
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
            this.dataSource.data = [];
            this.dataSource.data = planosConFlags;
            this.dataSource.sort = this.sort;
          }

          //Existe Cotizacion
          if (planosConFlags[0].existeCotizacion === '1'){
              //Columna Ajuste Bloqueado
              this.isAjusteBloqueado = true;

              this.habilitadoBtnGuardar    = false;
              this.isDisabledBtnEdit    = true;
              this.isDisabledBtnDelete  = true;
          }else{
              //Columna Ajuste Bloqueado
              this.isAjusteBloqueado = false;

              this.habilitadoBtnGuardar    = true;
              this.isDisabledBtnEdit    = false;
              this.isDisabledBtnDelete  = false;

              // No existe cotización para estos filtros: activa el borrador con los planos
              // recién cargados (no hace falta volver a pedirlos) y pide su correlativo/versión.
              this.activarBorradorConPlanosActuales(Pro_Cen_Cos, Tipo, Cod_Cliente_Tex, Cod_Tela, Cod_Ruta, Cod_Color);
          }

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

  /* --- Activa el borrador cuando getListarProcesosExportacion informa que no existe
     cotización para estos filtros. Reutiliza los planos que esa misma llamada acaba de
     cargar (no vuelve a pedirlos) y solo consulta correlativo/versión al backend. Si el
     borrador ya existía (p.ej. el usuario lo reseleccionó desde el panel), no vuelve a
     pedir correlativo. --- */
  private activarBorradorConPlanosActuales(Pro_Cen_Cos: number, Tipo: string, Cod_Cliente_Tex: string, Cod_Tela: string, Cod_Ruta: string, Cod_Color: string): void {
    this.borradorActivo = true;
    this.versionSeleccionada = null;

    if (this.borrador) { return; }

    this.borrador = {
      planos: JSON.parse(JSON.stringify(this.planos)),
      planosBackup: JSON.parse(JSON.stringify(this.planosBackup)),
      recetaCod: this.global_CodReceta,
      correlativo: '',
      version: 0,
      baseIdCotizacionCab: 0
    };

    const request: ObtenerNuevoCorrelativoVersionRequest = {
      Id_Unidad_NegocioKey: Pro_Cen_Cos,
      Cod_Tipo_Orden_tinto: Tipo,
      Cod_Cliente_Tex,
      Cod_Tela,
      Cod_Ruta,
      Cod_Color
    };

    this.service.getObtenerNuevoCorrelativoVersion(request).subscribe({
      next: (response: ServiceResponseList<CorrelativoVersionItem>) => {
        const e = response?.elements?.[0];
        if (this.borrador) {
          this.borrador.correlativo = String(e?.correlativo ?? '');
          this.borrador.version = Number(e?.version) || 1;
        }
      },
      error: (error: any) => {
        this.toastr.error(error.message, 'Cerrar', { timeOut: 2500 });
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
      .replace(/[̀-ͯ]/g, ''); // rango Unicode de marcas diacríticas combinantes

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
      width: '520px',
      maxWidth: '95vw',
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

  // Activa una versión guardada: la selecciona en el panel y carga su grilla de costeo.
  seleccionarVersion(v: VersionPrecio) {
    // Si veníamos del borrador, se guarda snapshot antes de abandonarlo (conserva ajustes).
    if (this.borradorActivo) { this.snapshotBorrador(); }
    this.borradorActivo = false;
    this.versionSeleccionada = v;

    this.global_idCotizacion_Cab = v.id;
    this.global_PrecioTinto      = v.precioReferencia;

    // La receta puede cambiar entre versiones: se restaura la de esta versión.
    this.global_CodReceta = v.receta;
    this.formulario_Precio.get('ctrl_receta')?.setValue(v.receta);

    // El detalle de una versión guardada se pide por cabecera + versión, sin filtros.
    this.cargarDetalleXVersion(v);
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

    this.crearBorradorNuevo();
  }

  /* --- Activa el borrador: restaura desde memoria si ya tiene snapshot, o pide la grilla
     desde cero con los filtros (getListaDetalleCotizacionXFiltros). No se envía cabecera ni
     versión porque el borrador aún no existe en BD. */
  seleccionarBorrador() {
    if (!this.borrador) { return; }

    this.borradorActivo      = true;
    this.versionSeleccionada = null;

    this.global_idCotizacion_Cab = 0;

    if (this.borrador.planos.length) {
      this.restaurarBorrador();
      return;
    }

    this.cargarDetalleXFiltros();
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
    this.habilitadoBtnGuardar    = true;
    this.isDisabledBtnEdit    = false;
    this.isDisabledBtnDelete  = false;
    this.bMuestraMenuFlotante = true;
  }

  get resumenCriterios(): { label: string, value: string, icon: string }[] {
    const v = this.formulario.getRawValue();
    const chips: { label: string, value: string, icon: string }[] = [];

    if (!this.formulario.get('unidadNegocio')?.disabled) {
      const undNeg = this.unidadesNegocio.find(u => String(u.codigo) === String(v.unidadNegocio));
      chips.push({
        label: COTIZACIONES_FIELDS.UNIDAD_NEGOCIO.label,
        value: undNeg ? undNeg.descripcion : (v.unidadNegocio || '—'),
        icon: COTIZACIONES_FIELDS.UNIDAD_NEGOCIO.icon
      });
    }

    if (!this.formulario.get('tipo')?.disabled) {
      const tipo = this.tipoUnidadesNegocio.find(t => String(t.codigo) === String(v.tipo));
      chips.push({
        label: COTIZACIONES_FIELDS.TIPO_UNIDAD.label,
        value: tipo ? tipo.descripcion : (v.tipo || '—'),
        icon: COTIZACIONES_FIELDS.TIPO_UNIDAD.icon
      });
    }

    if (!this.formulario.get('cliente')?.disabled) {
      const cliente = this.dataClientes.find(c => String(c.cod_Cliente_Tex) === String(v.cliente));
      chips.push({
        label: COTIZACIONES_FIELDS.CLIENTE.label,
        value: cliente ? (cliente.label || cliente.nom_Cliente || cliente.abr_Cliente) : (v.cliente || '—'),
        icon: COTIZACIONES_FIELDS.CLIENTE.icon
      });
    }

    if (!this.formulario.get('codigoTela')?.disabled) {
      chips.push({
        label: COTIZACIONES_FIELDS.TELA.label,
        value: v.codigoTela ? String(v.codigoTela) : '—',
        icon: COTIZACIONES_FIELDS.TELA.icon
      });
    }

    // Campos deshabilitados (como descripcionTela) se excluyen del resumen compacto
    if (!this.formulario.get('descripcionTela')?.disabled) {
      chips.push({
        label: COTIZACIONES_FIELDS.DESCRIPCION_TELA.label,
        value: v.descripcionTela ? String(v.descripcionTela) : '—',
        icon: COTIZACIONES_FIELDS.DESCRIPCION_TELA.icon
      });
    }

    if (!this.formulario.get('codigoRutaTela')?.disabled) {
      const ruta = this.RutaXCodTela.find(r => String(r.codigo) === String(v.codigoRutaTela));
      chips.push({
        label: COTIZACIONES_FIELDS.RUTA.label,
        value: ruta ? (ruta.nombre || String(ruta.codigo)) : (v.codigoRutaTela || '—'),
        icon: COTIZACIONES_FIELDS.RUTA.icon
      });
    }

    if (!this.formulario.get('color')?.disabled) {
      const color = this.listaCodigoColor.find(c => String(c.codigo) === String(v.color));
      chips.push({
        label: COTIZACIONES_FIELDS.COLOR.label,
        value: color ? (color.descripcion || String(color.codigo)) : (v.color || '—'),
        icon: COTIZACIONES_FIELDS.COLOR.icon
      });
    }

    const precio = this.precioSeleccionado;
    chips.push({
      label: 'Precio / SDC',
      value: precio ? `${precio.corR_CARTA} — ${precio.preC_TINTO}` : '—',
      icon: 'payments'
    });

    return chips;
  }

  ///////////////////////////////////////////////////////////////////////////

  recalcular(row: any) {

    //Actualiza el Campos pro_Cotizacion con el nuevo Valor.
    //El ajuste ADICIONA sobre el Total de la fila, no lo reemplaza: así la sección
    //conserva su propio valor y el de sus subsecciones.
    row.pro_Cotizacion = parseFloat(
      (Number(row.pro_Tot || 0) + Number(row.pro_Aju || 0)).toFixed(2)
    );

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

    this.habilitadoBtnGuardar = true;
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

    this.habilitadoBtnGuardar = true;
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

    this.habilitadoBtnGuardar = true;
  }

  getListaCentroCosto(): void {
    this.service.getListaCentroCosto().subscribe({
      next: (response: ServiceResponseList<CentroCostoRawItem>) => {
        if(response.success && response.elements?.length){
          this.centroCosto = response.elements.map(c => ({
            codigo: c.cen_Cos_Cod,
            nombre: c.cen_Cos_Des
          }));
        }
      },
      error: (error: any) => {}
    });
  }

  getLoadIntensidad(Id_Unidad_NegocioKey: number){
    this.intensidad = [];
    this.service.getListaIntensidad(Id_Unidad_NegocioKey).subscribe({
      next: (response: ServiceResponseList<ComboItem>) => {
        if(response.success && response.elements?.length){
          this.intensidad = response.elements;
        }
      },
      error: (error: any) => {}
    });
  }

  reiniciaControles(){
    this.codigoRutaTela = '';
    this.formulario.get('tipo')?.setValue('');
    this.formulario.get('cliente')?.setValue('');
    this.formulario.get('codigoTela')?.setValue('');
    this.formulario.get('descripcionTela')?.setValue('');
    this.formulario.get('descripcionTela')?.disable();
    this.formulario.get('codigoRutaTela')?.setValue('');
    this.formulario.get('color')?.setValue('');
    //DesHabilita botoneria
    this.bMuestraMenuFlotante = false;
    this.isDisabledBtnFind    = false;
    this.modoResumen = false;
    this.seccionTotalmenteColapsada = false;

    this.RutaXCodTela = [];
    this.listaCodigoColor = [];

    //Limpia panel de Cotizaciones
    this.historialVersiones   = [];
    this.versionSeleccionada  = null;
    this.busquedaRealizada    = false;
    this.borrador             = null;
    this.borradorActivo       = false;
    this.ultimaBusqueda       = null;
    this.limpiarSeleccionPrecio();
  }

  loadHilo(sCodTela: string){
    this.SpinnerService.show();
    this.service.getListaHiladoxTela(sCodTela).subscribe({
      next: (response: ServiceResponseList<HiladoTelaItem>) => {
        this.dataSource_Hilos.data = (response.success && response.elements) ? response.elements : [];
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

  /* --- Guardado único: toda cotización guardada es inmutable, así que cualquier movimiento
  /* --- Guardado de cotización:
     - Si es una versión existente (esModificacionCotizacion): actualiza con accion 'U' e idCotizacion_Cab de la versión seleccionada.
     - Si es una nueva versión o borrador: registra con accion 'I' e idCotizacion_Cab = 0. --- */
  onGuardar(){
    const esModif = this.esModificacionCotizacion;
    const versionAGuardar = esModif
      ? (this.versionSeleccionada?.numVersion ?? 1)
      : (this.borrador?.version ?? 1);

    const confirmTitle = esModif
      ? `¿Desea actualizar la Versión ${versionAGuardar} de esta cotización?`
      : (versionAGuardar > 1
        ? `¿Registrar la Versión ${versionAGuardar} de esta cotización?`
        : '¿Desea registrar esta cotización?');

    const confirmText = esModif
      ? 'Se guardarán los cambios sobre la versión seleccionada.'
      : (versionAGuardar > 1
        ? 'Se registrará una nueva versión conservando el historial previo.'
        : 'Se guardará la cotización inicial en el sistema.');

    Swal.fire({
      title: confirmTitle,
      text: confirmText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        const _UndNego  = this.formulario.get('unidadNegocio')?.value   || 0;
        const _tipo     = this.formulario.get('tipo')?.value            || '';
        const _cliente  = this.formulario.get('cliente')?.value         || '';
        const _tela     = this.formulario.get('codigoTela')?.value      || '';
        const _ruta     = this.formulario.get('codigoRutaTela')?.value  || '';
        const _color    = this.formulario.get('color')?.value           || '';

        // PASO 1 - OBTENEMOS EL DETALLE
        if (Number(this.unidadNegocio) === 1){
            this.dataDetalles = this.dataSource.data.map(item => this.mapToDetalle(item));
        }

        // PASO 2 - DETERMINACIÓN DE ACCIÓN Y DATOS DE CABECERA
        const accion: 'I' | 'U' = esModif ? 'U' : 'I';
        const idCotizacionCab = esModif
          ? (this.global_idCotizacion_Cab || this.versionSeleccionada?.id || 0)
          : 0;
        const correlativo = esModif
          ? (this.versionSeleccionada?.raw?.correlativo || this.global_SDC || (this.borrador?.correlativo ?? ''))
          : (this.borrador?.correlativo ?? '');
        const version = versionAGuardar;

        // PASO 3 - OBTENEMOS LA CABECERA
        const data: ProcesoCotizacionRequest = {
            idCotizacion_Cab: idCotizacionCab,
            pro_Id          : 0,
            cen_Cos_Cod     : Number(_UndNego),
            cod_Tipo        : _tipo,
            cod_Cliente_Tex : _cliente,
            cod_Tela        : _tela,
            cod_Ruta        : _ruta,
            cod_Color       : _color,
            cod_RecetaAcabado : this.global_CodReceta,
            tiempo_Referencia : Number(this.global_Tiempo),
            precio_Referencia : Number(this.global_PrecioTinto),
            sDC_Referencia    : this.global_SDC,
            correlativo     : correlativo,
            version         : version,
            flg_Estatus     : "A",
            usu_Registro    : this.sUsuario,
            accion          : accion,
            detalles        : this.dataDetalles
        };

        console.log('Data registro', data);

        this.SpinnerService.show();
        this.service.postProcesoCotizacion(data)
        .pipe(finalize(() => {
          this.SpinnerService.hide();
        }))
        .subscribe({
          next: (response: ServiceResponse<null>)=> {
              if(response.success){
                Swal.fire({
                  icon: 'success',
                  title: '¡Operación Exitosa!',
                  text: response.message || (esModif ? 'La versión se actualizó correctamente.' : 'La cotización se guardó correctamente.'),
                  timer: 2500,
                  showConfirmButton: false
                });

                // Recarga el historial para refrescar datos y tarjetas
                if (this.ultimaBusqueda) {
                  this.borrador = null;
                  this.borradorActivo = false;
                  this.cargarHistorialCotizaciones();
                } else {
                  this.chgUnidadNegocio();
                }
              }else{
                Swal.fire({
                  icon: 'error',
                  title: 'Error al registrar',
                  text: response.message || 'Ocurrió un error en el servidor.'
                });
              }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error de comunicación',
              text: error?.message || 'No se pudo completar la operación.'
            });
          }
        });

      };
    });
  }

  /** Modificar una card del panel. Sin argumento = la card de borrador, que sí es editable.
   *  Con VersionPrecio = una cotización ya guardada: es inmutable, así que modificarla
   *  significa derivar una versión nueva a partir de ella (ver onCrearNuevaVersion). */
  onEditar(v?: VersionPrecio){
    if (v) {
      this.onCrearNuevaVersion(v);
      return;
    }

    if (this.borrador && !this.borradorActivo) {
      this.seleccionarBorrador();
    }
    this.isAjusteBloqueado = false;
    this.habilitadoBtnGuardar = true;
    this.isDisabledBtnEdit = false;
  }

  /** Eliminar una card del panel.
   *  - Sin argumento = descarta el borrador local.
   *  - Con VersionPrecio = elimina la versión en BD mediante postProcesoCotizacion con accion 'D'. */
  onEliminar(v?: VersionPrecio){
    Swal.fire({
      title: '¿Eliminar esta cotización?',
      text: v ? `Se eliminará la ${v.titulo}. Esta acción no se puede deshacer.` : 'Se descartará el borrador sin guardar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) { return; }

      if (v) {
        const _UndNego  = this.formulario.get('unidadNegocio')?.value   || 0;
        const _tipo     = this.formulario.get('tipo')?.value            || '';
        const _cliente  = this.formulario.get('cliente')?.value         || '';
        const _tela     = this.formulario.get('codigoTela')?.value      || '';
        const _ruta     = this.formulario.get('codigoRutaTela')?.value  || '';
        const _color    = this.formulario.get('color')?.value           || '';

        const data: ProcesoCotizacionRequest = {
          idCotizacion_Cab: v.id,
          pro_Id          : 0,
          cen_Cos_Cod     : Number(_UndNego),
          cod_Tipo        : _tipo,
          cod_Cliente_Tex : _cliente,
          cod_Tela        : _tela,
          cod_Ruta        : _ruta,
          cod_Color       : _color,
          cod_RecetaAcabado : v.receta || this.global_CodReceta || '',
          tiempo_Referencia : Number(this.global_Tiempo) || 0,
          precio_Referencia : Number(v.precioReferencia) || Number(this.global_PrecioTinto) || 0,
          sDC_Referencia    : this.global_SDC || '',
          correlativo     : v.raw?.correlativo || this.global_SDC || '',
          version         : v.numVersion,
          flg_Estatus     : 'I',
          usu_Registro    : this.sUsuario,
          accion          : 'D',
          detalles        : []
        };

        this.SpinnerService.show();
        this.service.postProcesoCotizacion(data)
          .pipe(finalize(() => { this.SpinnerService.hide(); }))
          .subscribe({
            next: (response: ServiceResponse<null>) => {
              if (response.success) {
                Swal.fire({
                  icon: 'success',
                  title: '¡Operación Exitosa!',
                  text: response.message || `${v.titulo} eliminada correctamente.`,
                  timer: 2000,
                  showConfirmButton: false
                });

                if (this.versionSeleccionada?.id === v.id) {
                  this.versionSeleccionada = null;
                  this.global_idCotizacion_Cab = 0;
                  this.dataSource.data = [];
                  this.bMuestraMenuFlotante = false;
                }

                if (this.ultimaBusqueda) {
                  this.cargarHistorialCotizaciones();
                }
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al eliminar',
                  text: response.message || 'No se pudo eliminar la cotización.'
                });
              }
            },
            error: (error: any) => {
              Swal.fire({
                icon: 'error',
                title: 'Error de comunicación',
                text: error?.message || 'No se pudo completar la eliminación.'
              });
            }
          });

        return;
      }

      // Borrador: solo vive en memoria, se descarta directamente
      this.borrador = null;
      this.borradorActivo = false;
      this.dataSource.data = [];
      this.bMuestraMenuFlotante = false;
    });
  }


onRecetaChange(event: any) {
  console.log('Receta seleccionada:', event.value);
  // Capturamos
  this.global_CodReceta = event.value || '';
}

private mapToDetalle(item: any): ProcesoCotizacionDetalle {
  return {
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
    };
  }

  /* --- Cancelar / Descartar cambios actuales --- */
  onCancelar(): void {
    if (this.borradorActivo && this.historialVersiones.length) {
      this.seleccionarVersion(this.historialVersiones[0]);
    } else {
      this.reiniciaControles();
    }
  }

  /* --- Indica si la vista actual corresponde a una cotización ya existente en BD --- */
  get esModificacionCotizacion(): boolean {
    return !this.borradorActivo && (this.global_idCotizacion_Cab > 0 || (this.versionSeleccionada != null && this.versionSeleccionada.id > 0));
  }

  /* --- Crear una nueva versión a partir de una cotización existente. La grilla de la versión
     base se clona como punto de partida, pero el número de versión lo asigna el backend
     (getObtenerNuevoCorrelativoVersion), nunca un cálculo en cliente. --- */
  onCrearNuevaVersion(v?: VersionPrecio): void {
    const versionBase = v || this.versionSeleccionada;
    if (!versionBase && !this.historialVersiones.length) {
      Swal.fire('Atención', 'No hay una cotización base para crear una nueva versión.', 'info');
      return;
    }

    const f = this.ultimaBusqueda;
    if (!f) {
      this.toastr.info('Primero realiza una búsqueda', '', { timeOut: 2000 });
      return;
    }

    const base = versionBase || this.historialVersiones[0];

    this.borrador = {
      planos: JSON.parse(JSON.stringify(this.dataSource.data?.length ? this.dataSource.data : this.planos)),
      planosBackup: JSON.parse(JSON.stringify(this.planosBackup)),
      recetaCod: this.global_CodReceta || base.receta || '',
      // Correlativo y número de versión los asigna getObtenerNuevoCorrelativoVersion.
      correlativo: '',
      version: 0,
      baseIdCotizacionCab: base.id
    };

    this.borradorActivo = true;
    this.versionSeleccionada = null;
    this.global_idCotizacion_Cab = 0;
    this.isAjusteBloqueado = false;
    this.habilitadoBtnGuardar = true;
    this.isDisabledBtnEdit = false;

    const request: ObtenerNuevoCorrelativoVersionRequest = {
      Id_Unidad_NegocioKey: f.unidad,
      Cod_Tipo_Orden_tinto: f.tipo,
      Cod_Cliente_Tex: f.cliente,
      Cod_Tela: f.tela,
      Cod_Ruta: f.ruta,
      Cod_Color: f.color
    };

    this.service.getObtenerNuevoCorrelativoVersion(request).subscribe({
      next: (response: ServiceResponseList<CorrelativoVersionItem>) => {
        const e = response?.elements?.[0];
        if (!this.borrador) { return; }

        this.borrador.correlativo = String(e?.correlativo ?? this.borrador.correlativo);
        this.borrador.version     = Number(e?.version) || ((base.numVersion || 1) + 1);

        Swal.fire({
          icon: 'info',
          title: `Borrador: Versión ${this.borrador.version}`,
          text: `Se ha preparado la Versión ${this.borrador.version} a partir del correlativo ${this.borrador.correlativo}. Realice los ajustes necesarios y presione Guardar.`,
          confirmButtonText: 'Entendido'
        });
      },
      error: (error: any) => {
        this.toastr.error(error.message, 'Cerrar', { timeOut: 2500 });
      }
    });
  }

  /* ================================================================================
     VERSIONADO DE COTIZACIONES — 3 APIs nuevas
     Los métodos de CotizacionesService todavía no existen: se crean aparte con
     exactamente estos nombres (getListaCabecerasCotizacion,
     getListaDetalleCotizacionXFiltros, getListaDetalleCotizacionXVersion).
     ================================================================================ */

  /** Los siete criterios que amarran una cotización, tomados de la última búsqueda.
   *  Los comparten la API de cabeceras y la de detalle por filtros. */
  private construirFiltrosRequest(): ListaCabecerasCotizacionRequest | null {
    const f = this.ultimaBusqueda;
    if (!f) { return null; }

    return {
      Id_Unidad_NegocioKey: f.unidad,
      Cod_Tipo_Orden_tinto: f.tipo,
      Cod_Cliente_Tex     : f.cliente,
      Cod_Tela            : f.tela,
      Cod_Ruta            : f.ruta,
      Cod_Color           : f.color,
      SDC_Referencia      : f.sdcReferencia
    };
  }

  /** Compara los criterios de dos búsquedas. Si son iguales, el borrador en curso se
   *  conserva al volver a buscar; si difieren, se descarta (ver onBuscar). */
  private mismosCriterios(a: FiltrosBusqueda | null, b: FiltrosBusqueda): boolean {
    if (!a) { return false; }
    return a.unidad === b.unidad
        && a.tipo === b.tipo
        && a.cliente === b.cliente
        && a.tela === b.tela
        && a.ruta === b.ruta
        && a.color === b.color
        && a.sdcReferencia === b.sdcReferencia;
  }

  /** API 1 — Historial de versiones: select a la cabecera de cotizaciones por los siete
   *  criterios. Con elementos, autoselecciona la versión más reciente y carga su detalle;
   *  sin elementos, arma la grilla desde cero con los filtros. */
  private cargarHistorialCotizaciones(): void {
    const request = this.construirFiltrosRequest();
    if (!request) { return; }

    this.SpinnerService.show();

    this.service.getListaCabecerasCotizacion(request)
    .subscribe({
      next: (response: ServiceResponseList<CabeceraCotizacionItem>) => {
        // elements puede llegar null cuando el backend responde success con
        // "No existe información": se normaliza a arreglo vacío.
        const elementos = (response.success && response.elements) ? response.elements : [];

        // Más reciente primero: el backend puede devolver en cualquier orden.
        const ordenados = [...elementos].sort((a, b) => Number(b.num_Version) - Number(a.num_Version));

        this.historialVersiones = ordenados.map((c, idx) => this.mapCabeceraAVersion(c, idx));

        // El spinner no se apaga aquí: las dos ramas encadenan otra petición que lo
        // reutiliza y lo apaga en su propio finalize.
        if (this.historialVersiones.length) {
          this.seleccionarVersion(this.historialVersiones[0]);
        } else {
          // Sin cabeceras: es la primera cotización para estos criterios.
          this.cargarDetalleXFiltros();
        }
      },
      error: (error: any) => {
        this.SpinnerService.hide();
        this.historialVersiones = [];
        this.toastr.error(error.message, 'Cerrar', { timeOut: 2500 });
      }
    });
  }

  /** Traduce una fila de cabecera a la card del panel de historial. */
  private mapCabeceraAVersion(c: CabeceraCotizacionItem, idx: number): VersionPrecio {
    const numVersion = Number(c.num_Version) || 1;
    const anulada    = String(c.flg_Estatus ?? '').toUpperCase() !== 'A';

    return {
      id               : Number(c.idCotizacion_Cab) || 0,
      titulo           : `Versión ${numVersion}`,
      numVersion       : numVersion,
      precioReferencia : Number(c.precio_Referencia) || 0,
      receta           : String(c.idrecetalabprod ?? ''),
      estado           : anulada ? 'Anulada' : (idx === 0 ? 'Vigente' : 'Histórica'),
      usuario          : String(c.usu_Registro ?? ''),
      fecha            : String(c.fec_Registro ?? ''),
      reciente         : idx === 0,
      raw              : c
    };
  }

  /** API 2 — Grilla desde cero: no hay ninguna cabecera para estos criterios, así que el
   *  detalle se arma solo con los filtros. Deja la grilla editable y activa el borrador. */
  private cargarDetalleXFiltros(): void {
    const f = this.ultimaBusqueda;
    // Puede venir encadenado desde cargarHistorialCotizaciones, que dejó el spinner
    // encendido para esta llamada: si no hay filtros hay que apagarlo aquí.
    if (!f) { this.SpinnerService.hide(); return; }

    // Precio y tiempo sí son insumo del cálculo del costeo, no un filtro: se toman de la
    // carta elegida en el combo Precio/SDC (ver onChangePrecio). El resto son los criterios
    // de amarre de la última búsqueda, SDC_Referencia incluido: se toma de ultimaBusqueda y
    // no de global_SDC para que sea el mismo valor con el que se consultó el historial.
    const request: ListaDetalleCotizacionXFiltrosRequest = {
      Id_Unidad_NegocioKey: f.unidad,
      Cod_Tipo_Orden_tinto: f.tipo,
      Cod_Cliente_Tex     : f.cliente,
      Cod_Tela            : f.tela,
      Cod_Ruta            : f.ruta,
      Cod_Color           : f.color,
      Precio_Referencia   : Number(this.global_PrecioTinto) || 0,
      Tiempo_Referencia   : Number(this.global_Tiempo) || 0,
      SDC_Referencia      : f.sdcReferencia
    };

    this.planos = [];
    this.planosBackup = [];
    this.SpinnerService.show();

    this.service.getListaDetalleCotizacionXFiltros(request)
    .pipe(finalize(() => { this.SpinnerService.hide(); }))
    .subscribe({
      next: (response: ServiceResponseList<ProcesoExportacionItem>) => {
        const elementos = (response.success && response.elements) ? response.elements : [];

        if (!elementos.length) {
          this.dataSource.data = [];
          this.bMuestraMenuFlotante = false;
          return;
        }

        this.volcarPlanosEnGrilla(elementos, false);
        this.activarBorradorConPlanosActuales(f.unidad, f.tipo, f.cliente, f.tela, f.ruta, f.color);
      },
      error: (error: any) => {
        this.dataSource.data = [];
        this.bMuestraMenuFlotante = false;
        this.toastr.error(error.message, 'Cerrar', { timeOut: 2500 });
      }
    });
  }

  /** API 3 — Detalle de una versión guardada. Solo viajan cabecera y número de versión:
   *  la cabecera ya identifica la cotización. Grilla en solo lectura. */
  private cargarDetalleXVersion(v: VersionPrecio): void {
    const request: ListaDetalleCotizacionXVersionRequest = {
      IdCotizacion_Cab: v.id,
      Num_Version     : v.numVersion
    };

    this.planos = [];
    this.planosBackup = [];
    this.SpinnerService.show();

    this.service.getListaDetalleCotizacionXVersion(request)
    .pipe(finalize(() => { this.SpinnerService.hide(); }))
    .subscribe({
      next: (response: ServiceResponseList<ProcesoExportacionItem>) => {
        const elementos = (response.success && response.elements) ? response.elements : [];

        if (!elementos.length) {
          this.dataSource.data = [];
          this.bMuestraMenuFlotante = false;
          return;
        }

        this.volcarPlanosEnGrilla(elementos, false);
      },
      error: (error: any) => {
        this.dataSource.data = [];
        this.bMuestraMenuFlotante = false;
        this.toastr.error(error.message, 'Cerrar', { timeOut: 2500 });
      }
    });
  }

  /** Marca la jerarquía padre/hijo de los procesos y los publica en la grilla.
   *  soloLectura = true bloquea la columna Ajuste y el guardado. */
  private volcarPlanosEnGrilla(elementos: ProcesoExportacionItem[], soloLectura: boolean): void {
    this.planos       = this.marcarJerarquiaPlanos(elementos);
    this.planosBackup = JSON.parse(JSON.stringify(elementos));

    this.dataSource.data = this.planos;
    this.dataSource.sort = this.sort;

    this.isAjusteBloqueado    = soloLectura;
    this.habilitadoBtnGuardar = !soloLectura;
    this.isDisabledBtnEdit    = false;
    this.isDisabledBtnDelete  = false;
    this.bMuestraMenuFlotante = true;
  }

  /** isParent/isChild/tieneHijos/childCount/padreKey no vienen del backend: se derivan de
   *  pro_Hover ('1' padre, '1.2' hijo). Misma lógica que usaba getListarProcesosExportacion. */
  private marcarJerarquiaPlanos(elementos: ProcesoExportacionItem[]): ProcesoExportacionItem[] {
    return elementos.map((p: ProcesoExportacionItem) => {
      if (!p.pro_Hover.includes('.')) {
        p.isParent   = true;
        p.isChild    = false;
        p.tieneHijos = elementos.some(x => x.pro_Hover.startsWith(p.pro_Hover + '.'));
        p.childCount = elementos.filter(x => x.pro_Hover.startsWith(p.pro_Hover + '.')).length;
      } else {
        p.isChild  = true;
        p.isParent = false;
        p.padreKey = p.pro_Hover.split('.')[0];
      }
      return p;
    });
  }

  /** Guarda el ajuste desde el modal de edición. Absorbe lo que antes hacía el segundo
   *  diálogo de observación (ya eliminado): sincroniza el valor y su motivo contra
   *  planosBackup, que es la copia que se usa para comparar y para armar el guardado.
   *  Sin ajuste no hay motivo que registrar, así que la observación se limpia. */
  guardarAjuste(row: any): void {
    const ajuste = Number(row.pro_Aju || 0);

    if (!ajuste) {
      row.observacion = '';
    }

    const backupItem = this.planosBackup.find(
      p => p.cod_Proceso_Tex === row.cod_Proceso_Tex
    );
    if (backupItem) {
      backupItem.pro_Aju     = ajuste;
      backupItem.observacion = row.observacion;
    }

    this.habilitadoBtnGuardar = true;

    if (this.dialogRefAjuste) {
      this.dialogRefAjuste.close();
    }
  }
}
