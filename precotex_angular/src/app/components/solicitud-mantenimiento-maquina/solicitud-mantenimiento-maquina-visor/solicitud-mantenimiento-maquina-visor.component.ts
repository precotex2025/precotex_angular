
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SolicitudMantenimientoService } from 'src/app/services/SolicitudMantenimiento/solicitud-mantenimiento.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogSolicitudMntoInformeComponent } from '../dialog-solicitud-mnto-informe/dialog-solicitud-mnto-informe.component';
import { GlobalVariable } from 'src/app/VarGlobals';
import { MemorandumGralService } from 'src/app/services/Memorandum/memorandum-gral.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistroManteMaquinasTejService } from 'src/app/services/registro-mante-maquinas-tej.service';
import { ToastrService } from 'ngx-toastr';

//Para el Excel 
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


interface data_visor{
  cod_Solicitud: number,
  cod_Area: string,
  cod_Maquina: string,
  observacion: string,
  paro_Maquina: string,
  prioridad: string,
  fec_Registro: string,
  hora_Reporte: string,
  hora_Inicio: string,
  t1_Tiempo_Espera_Min: string,
  t2_Tiempo_Interv_Min: string,

  usu_Registro: string,
  cod_Usuario_Tecnico: string,
  ruta_Fotografia: string,
  cod_Estado_Mant: string,
  nombre_Estado: string,
}

export interface SolicitudMantenimiento {
  area: string;
  maquina: string;
  observacion: string;
  paroMaquina: boolean;
  prioridad: string;
  fecha: string;
  hora: string;
  tiempoTranscurrido: string;
  supervisor: string;
  estado: string;
}

@Component({
  selector: 'app-solicitud-mantenimiento-maquina-visor',
  templateUrl: './solicitud-mantenimiento-maquina-visor.component.html',
  styleUrls: ['./solicitud-mantenimiento-maquina-visor.component.scss']
})
export class SolicitudMantenimientoMaquinaVisorComponent implements OnInit, AfterViewInit, OnDestroy {

  // Paleta de colores (mismo estilo del reporte "DIR. DE HILO")
  private readonly COLOR_HEADER_BANNER = 'FF1A5F63';   // Banner título (teal oscuro)
  private readonly COLOR_HEADER_TABLA  = 'FF1A5F63';   // Fila de encabezados de tabla
  private readonly COLOR_TEXTO_BLANCO  = 'FFFFFFFF';
  private readonly COLOR_FILA_PAR      = 'FFF2F6F6';   // Zebra striping
  private readonly COLOR_FILA_IMPAR    = 'FFFFFFFF';
  private readonly COLOR_PARO_SI       = 'FFF8D7DA';   // Rojo suave -> paro de máquina
  private readonly COLOR_PARO_SI_TXT   = 'FF842029';
  private readonly COLOR_BORDE         = 'FFD9D9D9';  

  private URL_IMAGE = 'https://gestion.precotex.com:444/ubicaciones/api/TxRetiroRepuestos/getImagenDesdeBackEnd?imageId='
  

  //RUTA -> SolicitudMantenimientoMaquinaVisor
  // Setter: la tabla vive bajo *ngIf (solo escritorio), el sort aparece/desaparece con ella
  @ViewChild(MatSort) set sort(value: MatSort) {
    if (value) { this.dataSource.sort = value; }
  }
  @ViewChild('visorFoto') visorFoto!: TemplateRef<any>;

  constructor(
    public solicitudService   : SolicitudMantenimientoService,
    private serviceMemorandum : MemorandumGralService,
    private SpinnerService : NgxSpinnerService,
    private exceljsService : ExceljsService   ,
    public dialog         : MatDialog        ,
    private matSnackBar    : MatSnackBar      ,
    private registromantemaquinastej: RegistroManteMaquinasTejService   ,
    private toastr      : ToastrService ,
    private breakpointObserver: BreakpointObserver,
    private host: ElementRef,
  ) { }

  sCod_Trabajador = GlobalVariable.vcodtra;
  sTip_Trabajador = GlobalVariable.vtiptra;

  sCod_Usuario = "";
  sNom_Usuario = "";
  sCod_Planta  = "";
  sCod_Espe    = "";

  intervalId: any;

  // Vista móvil (lista de cards en vez de tabla)
  esMovil = false;
  limiteMovil = 30;
  private readonly PASO_MOVIL = 30;
  private subs = new Subscription();

  // Cards de totales por estado
  readonly estadosDef = [
    { cod: '01', nombre: 'Reportado', clase: 'estado-reportado' },
    { cod: '02', nombre: 'En Atención', clase: 'estado-atencion' },
    { cod: '03', nombre: 'Pendiente', clase: 'estado-pendiente' },
    { cod: '04', nombre: 'Cerrado', clase: 'estado-cerrado' },
    { cod: '05', nombre: 'Rechazado', clase: 'estado-rechazado' },
  ];
  resumenEstados: { cod: string, nombre: string, clase: string, total: number }[] = [];
  estadoSeleccionado: string | null = null;   // null = Todos
  cargado = false;   // true tras la primera respuesta del servicio (evita mostrar "vacío" mientras carga)

  get mensajeVacio(): string {
    if (this.estadoSeleccionado === null) {
      return 'No hay solicitudes registradas en este momento.';
    }
    const e = this.estadosDef.find(x => x.cod === this.estadoSeleccionado);
    return `No hay solicitudes en estado "${e ? e.nombre : ''}".`;
  }

  ngOnInit(): void {

    this.subs.add(
      this.breakpointObserver.observe('(max-width: 768px)').subscribe(r => {
        this.esMovil = r.matches;
        this.limiteMovil = this.PASO_MOVIL;
      })
    );

    // La carga principal no depende de las demás: se lanza primero y sin esperar.
    this.ObtenerDatosVisor(true);
    this.getInfoUsuarios()  ;
    this.mostrarTejedor()   ;
    this.ObtieneSedeByUser();

    //Refrescar cada 60 segundos (silencioso, sin spinner)
    this.intervalId = setInterval(() => {
      this.ObtenerDatosVisor(false);
    }, 60000);

  }

  // Alto del área de tabla/panel: desde debajo de las cards hasta el borde inferior de la ventana (5px de margen)
  alturaTabla = 400;
  private readonly MARGEN_INFERIOR = 5;

  ngAfterViewInit(): void {
    setTimeout(() => this.ajustarAltura());
  }

  @HostListener('window:resize')
  ajustarAltura(): void {
    const cards = (this.host.nativeElement as HTMLElement).querySelector(this.esMovil ? '.rango-fechas' : '.cards-estado');
    if (!cards) { return; }
    const margenCards = this.esMovil ? 8 : 16;   // margin-bottom de cada bloque
    const alto = window.innerHeight - cards.getBoundingClientRect().bottom - margenCards - this.MARGEN_INFERIOR;
    this.alturaTabla = Math.max(alto, 240);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.subs.unsubscribe();
  }

  trackBySolicitud(_: number, item: any) {
    return item.cod_Solicitud;
  }

  seleccionarEstado(cod: string | null) {
    this.estadoSeleccionado = (cod === this.estadoSeleccionado) ? null : cod;
    this.limiteMovil = this.PASO_MOVIL;
    this.aplicarFiltroEstado();
  }

  verMasMovil() {
    this.limiteMovil += this.PASO_MOVIL;
  }

  private aplicarFiltroEstado() {
    this.dataSource.data = this.estadoSeleccionado
      ? this.solicitudesLst.filter((x: any) => x.cod_Estado_Mant === this.estadoSeleccionado)
      : this.solicitudesLst;
  }

  private calcularResumen() {
    const conteo: { [k: string]: number } = {};
    this.solicitudesLst.forEach((x: any) => {
      conteo[x.cod_Estado_Mant] = (conteo[x.cod_Estado_Mant] || 0) + 1;
    });
    this.resumenEstados = this.estadosDef.map(e => ({ ...e, total: conteo[e.cod] || 0 }));
  }

  private ocultarAtenderSiPerfil23() {
    if (this.sCod_Espe === "23") {
      this.displayedColumns = this.displayedColumns.filter(c => c !== 'atender');
    }
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = [
    'atender'       ,
    'cod_Solicitud' , 
    'fec_Registro'  , 
    'cod_Area'      , 
    'cod_Maquina'   ,
    'tipo_tarea'    ,     //Nuevo
    'tipo_falla'    ,     //Nuevo
    'supervisor'    ,     //Nuevo
    'observacion'   , 
    'paro_Maquina'  , 
    'prioridad'     ,
    
    // 'hora_Reporte'  , 
    'hora_Inicio'   , 
    't1_Tiempo_Espera_Min_Des', 
    't2_Tiempo_Interv_Min_Des',
    't3_Tiempo_VB_Min_Des'    ,
    // 'usu_Registro', 
    //'cod_Usuario_Tecnico', 
    'des_Usuario_Tecnico' ,
    'nombre_Estado'       ,    
    'ruta_Fotografia'     , 
  ];

  exportarExcel() {
    //this.generarReporte(this.solicitudesLst, 'Reporte_Solicitud_Mantenimiento');
    this.onExportarExcel();
  }

  getInfoUsuarios(){
    this.serviceMemorandum.getUsuario(this.sCod_Trabajador, this.sTip_Trabajador).subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.sCod_Usuario = result.elements[0].cod_Usuario;
          this.sNom_Usuario = result.elements[0].nom_Usuario;
          //this.sCod_Planta  = result.elements[0].cod_Planta;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))        
  }   

  solicitudesLst: any[] = [];      // dentro del rango de fechas
  private solicitudesRaw: any[] = [];   // todo lo que trae el servicio
  private cargandoVisor = false;

  // Rango de fechas (yyyy-MM-dd, formato del input date): por defecto 1° del mes anterior -> hoy
  fechaDesde = this.fmtFecha(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
  fechaHasta = this.fmtFecha(new Date());

  private fmtFecha(d: Date): string {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${dd}`;
  }

  onCambioRango() {
    this.limiteMovil = this.PASO_MOVIL;
    this.aplicarRango();
    setTimeout(() => this.ajustarAltura());
  }

  private aplicarRango() {
    const desde = this.fechaDesde;
    const hasta = this.fechaHasta;
    this.solicitudesLst = this.solicitudesRaw.filter((x: any) => {
      // Si viene como yyyy-MM-dd[...] se toma tal cual (new Date lo leería en UTC y corre un día)
      const raw = String(x.fec_Registro ?? '');
      const f = /^\d{4}-\d{2}-\d{2}/.test(raw) ? raw.substring(0, 10) : this.fmtFecha(new Date(raw));
      return (!desde || f >= desde) && (!hasta || f <= hasta);
    });
    this.calcularResumen();
    this.aplicarFiltroEstado();
  }

  // conSpinner=false en refrescos automáticos: no tapa la pantalla cada 60 s
  ObtenerDatosVisor(conSpinner: boolean = true): void{
    if (this.cargandoVisor) { return; }   // evita llamadas superpuestas si el servicio demora
    const sCod_Usuario  : string = GlobalVariable.vusu;

    this.cargandoVisor = true;
    if (conSpinner) { this.SpinnerService.show(); }
    this.solicitudService.getObtieneInformacionSolicitudesVisor(sCod_Usuario).subscribe({
      next: (response: any) => {
        this.cargandoVisor = false;
        this.cargado = true;
        this.SpinnerService.hide();
        if(response.success && response.totalElements > 0){
          this.solicitudesRaw = response.elements
            .map((item: any) => ({
              ...item,
              paro_Maquina: item.paro_Maquina ? 'SI' : 'NO'
            }));
        }else{
          this.solicitudesRaw = [];
        }
        this.aplicarRango();
        this.ocultarAtenderSiPerfil23();
        setTimeout(() => this.ajustarAltura());
      },
      error: (error) => {
        this.cargandoVisor = false;
        this.cargado = true;
        this.SpinnerService.hide();
        this.solicitudesRaw = [];
        this.aplicarRango();
        console.log(error?.error?.message, 'Cerrar', {
          timeout: 2500
        })
      }
    });
  }

  dataForExcel = [];
  solicitudesLstExcel = [];
  onExportarExcel() {
    const sCod_Usuario  : string = GlobalVariable.vusu;

    this.dataForExcel = [];
    this.solicitudesLstExcel = [];
    this.SpinnerService.show();

    this.solicitudService.getObtieneInformacionSolicitudesVisor(sCod_Usuario).subscribe({
      next: (response: any) => {

          this.solicitudesLstExcel = response.elements;
          
          
          // this.dataForExcel = this.solicitudesLstExcel.map((item: any) => ({
          //   ['Id']          : item.cod_Solicitud,
          //   ['Area']        : item.area,
          //   ['Maquina']     : item.cod_Maquina,
          //   ['Observacion'] : item.observacion,
          //   ['Paro Maquina']: item.paro_Maquina?'SI':'NO',
          //   ['Prioridad']   : item.prioridad_Des ,
          //   ['Fecha Registro']: item.fec_Registro,
          //   ['Hora Reporte']: item.hora_Reporte,
          //   ['Hora Inicio'] : item.hora_Inicio,
          //   ['Tiempo T1 (Requerimiento)'] : item.t1_Tiempo_Espera_Min_Des,
          //   ['Tiempo T2 (Intervencion)']  : item.t2_Tiempo_Interv_Min_Des,
          //   ['Tiempo T3 (Validación)']    : item.t3_Tiempo_VB_Min_Des,
          //   ['Nombre Solicitante']  : item.supervisor,
          //   ['Nombre Tecnico']      : item.des_Usuario_Tecnico,
          //   ['Ruta_Fotografia']: item.ruta_Fotografia ? (this.URL_IMAGE + item.ruta_Fotografia) : '',
          //   ['Estado']: item.nombre_Estado
          // }));

          this.generarReporte(this.solicitudesLstExcel, 'Reporte_Solicitud_Mantenimiento');          

          /*
          const reportData = {
            title: 'REPORTE SOLICITUD DE MANTENIMIENTO MAQUINAS',
            data: this.dataForExcel,
            headers: Object.keys(this.dataForExcel[0]),
            Num_Requerimiento: 0
          };
  
          this.exceljsService.exportExcel4(reportData);
          */

        this.SpinnerService.hide();
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.error('Error al obtener datos:', error.error.message);
      }
    });
  }

  onInforme(element: SolicitudMantenimiento){

    let dialogRef = this.dialog.open(DialogSolicitudMntoInformeComponent,{
      //width:'500px',
      width: '90vw',     // 90% del ancho del viewport
      height: '90vh',    // 90% del alto del viewport
      maxWidth: '95vw',  // evita que se corte en pantallas pequeñas

      disableClose: true,
      panelClass: 'my-class',
      data: {
        Title  : "Nuevo",
        Accion : "I"    ,
        sCod_Usuario : this.sCod_Usuario,
        sNom_Usuario : this.sNom_Usuario,
        sCod_Planta  : this.sCod_Planta ,
        sCod_Espe    : this.sCod_Espe   ,
        Datos        : element
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.ObtenerDatosVisor();
    });    

  }

  mostrarTejedor() {

    //let dni_tejedor=this.formulario.get('dnitejedor')?.value;
    let Cod_Trabajador=GlobalVariable.vcodtra;
    let Tip_Trabajador=GlobalVariable.vtiptra;
    //if (dni_tejedor.length===8) {
      this.registromantemaquinastej.traerTejedorTra(Cod_Trabajador, Tip_Trabajador).subscribe(
        (result: any) => {
           if (result[0].Respuesta == 'OK') {
            this.CargarEspecialidad(String(result[0].Nro_DocIde));
           }
         },
         (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    //}
  }  

  CargarEspecialidad(dni: string) 
  {

    this.registromantemaquinastej.ListarEspecialidad(dni).subscribe(
      (result: any) => {
        this.sCod_Espe = result[0].Cod_Espe;
        this.ocultarAtenderSiPerfil23();   // la especialidad puede llegar después de la lista
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }    

  ObtieneSedeByUser(){

    // Carga de fondo: sin spinner propio para no ocultar el spinner de la carga principal
    this.registromantemaquinastej.getListaUsuarioSedeByUser().subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.sCod_Planta = response.elements[0].num_Planta;
          }
          else{
            //Deshabilita los botones
            this.toastr.warning("Usuario sin configuración de SEDE.", 'Cerrar', {
            timeOut: 2500,
             });
          }
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });
  }

  getEstadoClass(estado: string): string {
  switch (estado.trim().toLowerCase()) {
    case '01':
      return 'estado-reportado';
    case '02':
      return 'estado-atencion';
    case '03':
      return 'estado-pendiente';
    case '04':
      return 'estado-cerrado';
    case '05':
      return 'estado-rechazado';
    default:
      return '';
    }
  }

  getPrioridadClass(prioridad: string): string {
    switch (prioridad?.trim()) {
      case 'Alta':
        return 'prioridad-alta';
      case 'Media':
        return 'prioridad-media';
      case 'Baja':
        return 'prioridad-baja';
      default:
        return '';
    }
  }  

  getParoMaquinaClass(valor: number): string {
    return valor === 1 ? 'paro-activo' : 'paro-inactivo';
  }
  
  verFoto(url: string) {
    this.dialog.open(this.visorFoto, {
      data: url,
    panelClass: 'visor-dialog',
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    autoFocus: false,
    restoreFocus: false
    });
  }

  async generarReporte(solicitudesLstExcel: any[], nombreArchivo: string = 'Reporte_Mantenimiento'): Promise<void> {
 
    // 1. Mapeo de datos (igual al que ya tenías)
    const dataForExcel = solicitudesLstExcel.map((item: any) => ({
      'N° Solicitud': item.cod_Solicitud,
      'Area': item.area,
      'Maquina': item.cod_Maquina,
      'Observacion': item.observacion,
      'Paro Maquina': item.paro_Maquina ? 'SI' : 'NO',
      'Prioridad': item.prioridad_Des,
      'Fecha Registro': item.fec_Registro,
      'Hora Reporte': item.hora_Reporte,
      'Hora Inicio': item.hora_Inicio,
      'Tiempo T1 (Requerimiento)': item.t1_Tiempo_Espera_Min_Des,
      'Tiempo T2 (Intervencion)': item.t2_Tiempo_Interv_Min_Des,
      'Tiempo T3 (Validación)': item.t3_Tiempo_VB_Min_Des,
      'Nombre Solicitante': item.supervisor,
      'Nombre Tecnico': item.des_Usuario_Tecnico,
      //'Foto': item.ruta_Fotografia,
      'Estado': item.nombre_Estado
    }));
 
    const columnas = Object.keys(dataForExcel[0] ?? {});
    const totalCols = columnas.length;
 
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sistema de Mantenimiento';
    workbook.created = new Date();
 
    const sheet = workbook.addWorksheet('Reporte', {
      views: [{ state: 'frozen', ySplit: 6 }] // Congela hasta la fila de encabezados
    });
 
    // 2. Ancho de columnas
    const anchos = [14, 14, 12, 30, 12, 12, 14, 12, 12, 16, 16, 16, 20, 20, /*25,*/ 14];
    sheet.columns = columnas.map((_, i) => ({ width: anchos[i] ?? 16 }));
 
    // 3. Banner de título (fila 1-2, combinada)
    sheet.mergeCells(1, 1, 2, totalCols);
    const tituloCell = sheet.getCell(1, 1);
    tituloCell.value = 'DIR. DE MANTENIMIENTO - REPORTE DE SOLICITUDES';
    tituloCell.font = { bold: true, size: 16, color: { argb: this.COLOR_TEXTO_BLANCO } };
    tituloCell.alignment = { vertical: 'middle', horizontal: 'center' };
    tituloCell.fill = {
      type: 'pattern', pattern: 'solid',
      fgColor: { argb: this.COLOR_HEADER_BANNER }
    };
    sheet.getRow(1).height = 20;
    sheet.getRow(2).height = 20;
 
    // 4. Fila informativa: fecha de generación y rango
    const hoy = new Date();
    const fechaTexto = hoy.toLocaleDateString('es-PE');
 
    sheet.getCell(4, 1).value = 'Reporte generado el:';
    sheet.getCell(4, 1).font = { italic: true, bold: true };
    sheet.getCell(4, 2).value = fechaTexto;
    sheet.getCell(4, 2).font = { italic: true };
 
    sheet.getCell(4, 5).value = 'Total de registros:';
    sheet.getCell(4, 5).font = { italic: true, bold: true };
    sheet.getCell(4, 6).value = dataForExcel.length;
    sheet.getCell(4, 6).font = { italic: true };
 
    // 5. Encabezados de tabla (fila 6)
    const filaHeaderIdx = 6;
    const filaHeader = sheet.getRow(filaHeaderIdx);
    columnas.forEach((col, i) => {
      const cell = filaHeader.getCell(i + 1);
      cell.value = col;
      cell.font = { bold: true, color: { argb: this.COLOR_TEXTO_BLANCO } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.COLOR_HEADER_TABLA } };
      cell.border = this.bordeCelda();
    });
    filaHeader.height = 22;
 
    // 6. Filas de datos con zebra striping y resaltado de "Paro Maquina"
    dataForExcel.forEach((row: any, idx: number) => {
      const filaIdx = filaHeaderIdx + 1 + idx;
      const excelRow = sheet.getRow(filaIdx);
      const colorFondo = idx % 2 === 0 ? this.COLOR_FILA_PAR : this.COLOR_FILA_IMPAR;
 
      columnas.forEach((col, i) => {
        const cell = excelRow.getCell(i + 1);
        cell.value = row[col] ?? '';
        cell.border = this.bordeCelda();
        cell.alignment = { vertical: 'middle', horizontal: col === 'Observacion' ? 'left' : 'center', wrapText: col === 'Observacion' };
 
        const esParoSi = col === 'Paro Maquina' && row[col] === 'SI';
        cell.fill = {
          type: 'pattern', pattern: 'solid',
          fgColor: { argb: esParoSi ? this.COLOR_PARO_SI : colorFondo }
        };
        if (esParoSi) {
          cell.font = { bold: true, color: { argb: this.COLOR_PARO_SI_TXT } };
        }
      });
      excelRow.height = 18;
    });
 
    // 7. Autofiltro sobre la tabla
    sheet.autoFilter = {
      from: { row: filaHeaderIdx, column: 1 },
      to: { row: filaHeaderIdx, column: totalCols }
    };
 
    // 8. Generar y descargar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/octet-stream'
    });
    saveAs(blob, `${nombreArchivo}_${fechaTexto.replace(/\//g, '-')}.xlsx`);
  }  

  private bordeCelda(): Partial<ExcelJS.Borders> {
    const estilo: ExcelJS.BorderStyle = 'thin';
    return {
      top: { style: estilo, color: { argb: this.COLOR_BORDE } },
      left: { style: estilo, color: { argb: this.COLOR_BORDE } },
      bottom: { style: estilo, color: { argb: this.COLOR_BORDE } },
      right: { style: estilo, color: { argb: this.COLOR_BORDE } }
    };
  }  
}
