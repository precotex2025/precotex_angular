import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { NgxSpinnerService }  from "ngx-spinner";
import { GlobalVariable } from 'src/app/VarGlobals';
import { DatePipe } from "@angular/common";

import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { ProduccionArtesInspeccionService } from 'src/app/services/produccion-artes-inspeccion.service';
import { throws } from 'assert';

interface Proceso {
  id: string;
  name: string;
  idItem: number;
  //items: any;
}

//Data proveniente del padre cuando se edita
interface data {
  Id_ProcesoArtes: number;
  Cod_OrdPro: string;
  Cod_EstPro: string;
  Cod_Version: string;
  Co_CodOrdPro: string;
  Cod_EstCli: string;
  Des_Cliente: string;
  Cod_Cliente: string;
  Cod_Present: string;
  Num_Hoja_Correlativo: string;
  Num_Maquina: string;
  Tip_Proceso: number;
  Id_Maquina: number;
  Id_Horno: number;
  Horno: string;
  Tiempo_Velocidad: string;
  Tiempo: string;
  Velocidad: string;
  Presion:string;
  Temperatura: string;
  Operario: string;
  Supervisor: string;
  Prendas_Can: number;
  Piezas_Can: number;
  Prendas_Pri: number;
  Prendas_Def: number;
  Prendas_Rec: number;
  Prendas_Seg: number;
  Prendas_Esp: number;
  Total_Prendas_Aud: number;
  Flg_Aprobacion: string;
  Flg_Estado_Inspec_Calidad: boolean;
  Flg_Estado_Superv_Produccion: boolean;
  Observacion: string;
  Tipo_Prenda: string;
  Habilitadas: number;
  Cod_Usuario: string;
  Flg_Estado: string;
  Fecha_Inicio: string;
  Fecha_Fin: string;
  Fecha_Registro: string;
  Fecha_Registro_Hoja: string;
  IdNivelAutorizacion: number;
}

interface Supervisor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

interface Operario {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

interface Observacion {
  Id_Item?: number;
  Des_FamItem?: string;
  Id_FamItem?: string;
  Tipo?: string;
  Des_Motivo?: string;
  Tipo_dato?: string;
  Observacion?: string;
  Flg_Estado?: string;
}

interface Motivo{
  Cod_Motivo: string;
  Descripcion: string;
  Cod_Area_CC: string;
  Cod_Abr: string;  
}

interface Defectos{
  Id_Defecto?: number;
  Id_ProcesoArtes?: number;
  Tipo_Defecto?: string;
  Cod_Motivo?: string;
  Cantidad?: number;
  Des_Motivo?: string;
}

interface Parametros{
  Id_Parametro?: number;
  Id_Padre?: number;
  Des_Parametro?: string;
  Flg_Activo?: boolean;
  Flg_Tiempo?: boolean;
  Flg_Temperatura?: boolean;
  Flg_Velocidad: boolean;
  Flg_Presion?: boolean;
  Flg_Horno?: boolean;
}

interface Lavado{
  Id_item?: number;
  NRow?: number;
  Id_Observaciones?: number;
  Observacion?: string;  //-> Tiempo
  Flg_Estado?: string;
}

interface Operarios{
  Id_Operario?: number;
  Id_ProcesoArtes?: number;
  Cod_Operario?: string;
  Nom_Operario?: string;
  Tipo_Operario?: string;
  Des_Puesto?: string;
}

@Component({
  selector: 'app-dialog-produccion-inspeccion-crear',
  templateUrl: './dialog-produccion-inspeccion-crear.component.html',
  styleUrls: ['./dialog-produccion-inspeccion-crear.component.scss']
})

export class DialogProduccionInspeccionCrearComponent implements OnInit {

  Cod_Accion = ''
  Cod_OrdPro = ''
  Cod_EstPro = ''
  Cod_Version = ''
  Co_CodOrdPro = ''
  IdProcesoArtes = 0
  dataItemsProceso = []
  grdProcesosVisible: boolean = false
  lstOperacionColor:any = [];
  dataTrabajador: Array<any> = []
  ItemsAQL: Array<any> = []
  Titulo = ''
  btnAccionModificar: boolean = false
  optSupervicionVisible: boolean = false
  Num_Hoja_Inspeccion: number = 0
  dataItemsWithOpciones: any
  dataSendActualizar: any
  dataCabProceso:Array<any> = []
  totalPrimeras:number = 0
  totalDefectos:number = 0
  totalRecupadas:number = 0
  totalSegundas:number = 0
  totalEspeciales:number = 0
  Flg_Estado = '1'

  ItemsProceso: Proceso[] = [];
  lstOC:any = [];

  lstOptResultado: any[] = [
    { cod: "1", name: "Aprobado"  },
    { cod: "0", name: "Rechazado" }
  ];

  lstOptTipoPrenda: any[] = [
    { id: "1", name: "Prenda" },
    { id: "2", name: "Pieza" },
    { id: "3", name: "Bloque" }
  ];

  listar_itemsDefectosFull:     Motivo[] = [];

  listar_ParametrosFull:  Parametros[] = [];
  listar_Procesos:        Parametros[] = [];
  listar_Maquinas:        Parametros[] = [];
  listar_Hornos:          Parametros[] = [];

  listar_Defectos:      Defectos[] = [];
  listar_Segundas:      Defectos[] = [];
  listar_Especiales:    Defectos[] = [];
  listar_Lavado:        Lavado[] = [];
  listar_Operario:      Operarios[] = [];

  listar_itemsDefectosEstampados:     Motivo[] = [];
  filtroDefectosEstampados:           Observable<Motivo[]> | undefined;

  listar_itemsDefectosLavado:     Motivo[] = [];
  filtroDefectosLavado:           Observable<Motivo[]> | undefined;

  listar_itemsDefectosBordado:     Motivo[] = [];
  filtroDefectosBordado:           Observable<Motivo[]> | undefined;

  listar_itemsDefectosRecuperada:     Motivo[] = [];
  filtroDefectosRecuperada:           Observable<Motivo[]> | undefined;

  listar_itemsDefectosEspeciales:     Motivo[] = [];
  filtroDefectosEspeciales:           Observable<Motivo[]> | undefined;

  listar_operacionSupervisor:   Supervisor[] = [];
  filtroOperacionSupervisor:    Observable<Supervisor[]> | undefined;

  listar_operacionOperario:     Operario[] = [];
  filtroOperacionOperario:      Observable<Operario[]> | undefined;

  listar_operacionTendedor:     Operario[] = [];
  filtroOperacionTendedor:      Observable<Operario[]> | undefined;

  dataTipoOperario: any[] = [
    { Tipo_Operario: "1", Des_Puesto: "SUPERVISOR"},
    { Tipo_Operario: "2", Des_Puesto: "OPERARIO"},
    { Tipo_Operario: "3", Des_Puesto: "TENDEDOR"},
    { Tipo_Operario: "4", Des_Puesto: "MAQUINISTA"}
  ];

  dataDefectoSource: MatTableDataSource<Defectos>;
  displayedColumns: string[] = ['Des_Motivo','Cantidad','Acciones'];
  columnsToDisplay: string[] = this.displayedColumns.slice();

  dataLavadoSource: MatTableDataSource<Lavado>;
  displayedColumns2: string[] = ['nRow','Tiempo','Estado','Acciones'];
  columnsToDisplay2: string[] = this.displayedColumns2.slice();

  dataOperarioSource: MatTableDataSource<Operarios>;
  displayedColumns3: string[] = ['Des_Puesto','Nom_Operario','Acciones'];
  columnsToDisplay3: string[] = this.displayedColumns3.slice();

  dataSegundasSource: MatTableDataSource<Defectos>;
  displayedColumns4: string[] = ['Des_Motivo','Cantidad','Acciones'];
  columnsToDisplay4: string[] = this.displayedColumns4.slice();


  dataEspecialesSource: MatTableDataSource<Defectos>;
  displayedColumns5: string[] = ['Des_Motivo','Cantidad','Acciones'];
  columnsToDisplay5: string[] = this.displayedColumns5.slice();


  num_guiaMascara = [/[0-2]/, /\d/, ':', /[0-5]/, /\d/, ':', /[0-5]/, /\d/];

  /*ItemsAQL: any[] = [
    {cod:'1', lote:'26 - 50',muestra:8, permitido:0},
    {cod:'2', lote:'51 - 90',muestra:13, permitido:0},
    {cod:'3', lote:'91 - 150',muestra:20, permitido:1},
    {cod:'4', lote:'151 - 280',muestra:32, permitido:2},
    {cod:'5', lote:'281 - 500',muestra:50, permitido:3},
    {cod:'6', lote:'501 - 1200',muestra:80, permitido:5},
    {cod:'7', lote:'1201 - 3200',muestra:125, permitido:7}
  ]*/

  formulario = this.formBuilder.group({
    sOP: ['', Validators.required],
    sEstilo: [''],
    sCliente: [''],
    sCod_Cliente: [''],
    sColor: ['', Validators.required],
    sTipoPrenda: ['1'],
    sPrendasCant: [0],
    sPiezasCant: [''],
    sOC: [''],
    sOperario: [''],
    sCodOperario: [''],
    sTipoOperario: [''],
    sTendedor:[''],
    sSupervisor: [''],
    sNumMaquina: [''],
    sProceso: [''],
    sIdMaquina: [''],
    sIdHorno: [''],
    sHorno: [''],
    sTiempo: [''],
    sVelocidad: [''],
    sPresion: [''],
    sTemperatura: [''],
    sPrendasPri: [''],
    sPrendasDef:[''],
    sPrendasRec:[''],
    sPrendasSeg: [''],
    sPrendasEsp: [''],
    sTotalPrenAud: [''],
    sFlgAprobacion: ['1'],
    sFechaHoraIngreso: [''],
    sObservacion: [''],
    flgInspeCalidad: [0],
    flgSuperProd: [0],
    sCodDefectoEstampado: [''],
    sCodDefectoLavado: [''],
    sCodDefectoMatching: [''],
    sCodDefectoBordado: [''],
    sCodDefectoRecuperada: [''],
    sCodDefectoEspeciales: [''],
    sHabilitadas:[0],
    sCodMotivo:[''],
    sDesMotivo:[{value:'', disabled: true}],
    sCantidad:[0],
    sCodMotivo2:[''],
    sDesMotivo2:[{value:'', disabled: true}],
    sCantidad2:[0],
    sCodMotivo3:[''],
    sDesMotivo3:[{value:'', disabled: true}],
    sCantidad3:[0],
    sCiclo:[''],
    sEstado:[''],
    sFechaInicio:[''],
    sFechaFin:['']
  });
  
  flgTiempo: boolean = false;
  flgVelocidad: boolean = false;
  flgTemperatura: boolean = false;
  flgPresion: boolean = false;
  flgHorno: boolean = false;

  constructor(
    private formBuilder: FormBuilder, 
    private matSnackBar: MatSnackBar, 
    private SpinnerService: NgxSpinnerService, 
    private datepipe: DatePipe,
    private produccionArtesInspeccionService: ProduccionArtesInspeccionService,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    public dialog_: MatDialogRef<DialogProduccionInspeccionCrearComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: data,
  ){
    this.dataDefectoSource = new MatTableDataSource();
    this.dataLavadoSource = new MatTableDataSource();
    this.dataOperarioSource = new MatTableDataSource();
    this.dataSegundasSource = new MatTableDataSource();
    this.dataEspecialesSource = new MatTableDataSource();
  }

  ngOnInit(): void { 
    this.formulario.controls['sFechaHoraIngreso'].disable()
    this.formulario.controls['sTotalPrenAud'].disable()
    this.formulario.controls['sCliente'].disable()
    this.formulario.controls['sEstilo'].disable()
    this.formulario.controls['sHabilitadas'].disable()
    this.formulario.controls['sPrendasPri'].disable()
    this.formulario.controls['sPrendasDef'].disable()
    this.formulario.controls['sPrendasRec'].disable()
    this.formulario.controls['sPrendasSeg'].disable()
    this.formulario.controls['sPrendasEsp'].disable()
    this.fechaHoraDefaultIngreso()
    this.obtenerInformacion()
  }

  buscarEstiloClientexOP(){

    this.formulario.controls['sCliente'].setValue('')
    this.formulario.controls['sEstilo'].setValue('')
    this.formulario.controls['sOC'].setValue('')
    this.formulario.controls['sHabilitadas'].setValue(0)
    this.Cod_OrdPro = this.formulario.get('sOP')?.value
    if(this.Cod_OrdPro.length == 5){
    this.Cod_Accion   = 'E'
    this.Cod_OrdPro
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','','','','','','','','','','',
      0,0,0,0,0,0,0,0,'','','','','',0,'','',
      this.IdProcesoArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          this.formulario.controls['sCliente'].setValue(result[0].Des_Cliente)
          this.formulario.controls['sCod_Cliente'].setValue(result[0].Cod_Cliente)
          this.formulario.controls['sEstilo'].setValue(result[0].Cod_EstCli)
          this.Cod_EstPro = result[0].Cod_EstPro
          this.Cod_Version = result[0].Cod_Version
          this.CargarOperacionColor()
          this.CargarListaOC()
          //console.log(result);
          this.grdProcesosVisible = false
          this.SpinnerService.hide();
        }else{
          this.matSnackBar.open('La OP no existe...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          this.lstOC = []
          this.lstOperacionColor = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }else{
      this.grdProcesosVisible = false;
      this.lstOC = []
      this.lstOperacionColor = []
      this.formulario.controls['sOC'].setValue('')
    }
  }

  CargarOperacionColor() {
    this.produccionArtesInspeccionService.SM_Presentaciones_OrdPro(this.Cod_OrdPro).subscribe(
      (result: any) => {
        //console.log(result)
        this.lstOperacionColor = result
        this.changeDataGrilla()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  changeRadio(event, Id, valor) {
    console.log(event, Id, valor)
  }

  fechaHoraDefaultIngreso(){ 
    let fechaIni = new Date();
    this.formulario.patchValue({ sFechaHoraIngreso: this.datepipe.transform(fechaIni, 'yyyy-MM-ddTHH:mm')})
  }

  obtenerInformacion(){
    this.Cod_Accion   = 'N'
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','','','','','','','','','','',
      0,0,0,0,0,0,0,0,'','','','','',0,'','',
      this.IdProcesoArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          //console.log(result);
          this.dataTrabajador = result;
          this.definirTitulo();
          this.CargarOperacionSupervisor();
          this.CargarOperacionOperario();
          this.obtenerDefectosFull();
          this.obtenerDefectos();
          this.obtenerOperarios();
          this.obtenerParametrosFull();
          //this.obtenerInformacionAQL()
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  obtenerInformacionAQL(){
    this.Cod_Accion   = 'M'
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','','','','','','','','','','',
      0,0,0,0,0,0,0,0,'','','','','',0,'','',
      this.IdProcesoArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          //console.log(result);
          this.ItemsAQL = result
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  obtenerDefectosFull(){
    this.Cod_Accion   = 'B'
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','','','','','','','','','','',
      0,0,0,0,0,0,0,0,'','','','','',0,'','',
      this.IdProcesoArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          this.listar_itemsDefectosFull = result
          this.cetgorizarDefectos()
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  obtenerDefectos(){
    this.Cod_Accion   = 'D'
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','','','','','','','','','','',
      0,0,0,0,0,0,0,0,'','','','','',0,'','',
      this.IdProcesoArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          this.listar_Defectos = result.filter(d => d.Tipo_Defecto == '1')
          this.dataDefectoSource = new MatTableDataSource(this.listar_Defectos);

          this.listar_Segundas = result.filter(d => d.Tipo_Defecto == '2')
          this.dataSegundasSource = new MatTableDataSource(this.listar_Segundas);

          this.listar_Especiales = result.filter(d => d.Tipo_Defecto == '3')
          this.dataEspecialesSource = new MatTableDataSource(this.listar_Especiales);

          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  obtenerOperarios(){
    this.Cod_Accion   = 'A'
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','','','','','','','','','','',
      0,0,0,0,0,0,0,0,'','','','','',0,'','',
      this.IdProcesoArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          this.listar_Operario = result
          this.dataOperarioSource = new MatTableDataSource(this.listar_Operario);  
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }));

  }

  obtenerParametrosFull(){
    this.Cod_Accion   = 'P'
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','','','','','','','','','','',
      0,0,0,0,0,0,0,0,'','','','','',0,'','',
      this.IdProcesoArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          //console.log("listar_ParametrosFull");
          //console.log(result);
          this.listar_ParametrosFull = result
          this.listar_Procesos = this.listar_ParametrosFull.filter(d => d.Flg_Activo == true && d.Id_Padre == 0)
          this.listar_Hornos = this.listar_ParametrosFull.filter(d => d.Flg_Activo == true && d.Id_Padre == 5)  // 5: Hornos
          this.getMaquinasProceso();
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  getMaquinasProceso(){
    let sProceso = this.formulario.get('sProceso').value
    let parametro: Parametros[];
    parametro = this.listar_ParametrosFull.filter(d => d.Id_Parametro == sProceso);
    console.log(parametro)
    this.listar_Maquinas = this.listar_ParametrosFull.filter(d => d.Flg_Activo == true && d.Id_Padre == sProceso);

    this.flgTiempo = String(parametro[0].Flg_Tiempo) == "1" ? true : false;
    this.flgVelocidad= String(parametro[0].Flg_Velocidad) == "1" ? true : false;
    this.flgTemperatura = String(parametro[0].Flg_Temperatura) == "1" ? true : false;
    this.flgPresion = String(parametro[0].Flg_Presion) == "1" ? true : false;
    this.flgHorno = String(parametro[0].Flg_Horno) == "1" ? true : false;

    if(!this.flgTiempo) this.formulario.controls['sTiempo'].setValue('');
    if(!this.flgVelocidad) this.formulario.controls['sVelocidad'].setValue('');
    if(!this.flgTemperatura) this.formulario.controls['sTemperatura'].setValue('');
    if(!this.flgPresion) this.formulario.controls['sPresion'].setValue('');
    if(!this.flgHorno) this.formulario.controls['sIdHorno'].setValue('0');
  }

  cetgorizarDefectos(){

    let nombresFiltroEstampado: string[] = ['EST', 'PLA'];
    let nombresFiltroLavado: string[] = ['LAV', 'LVP'];
    let nombresFiltroBordado: string[] = ['BOR'];
    this.listar_itemsDefectosEstampados = this.filtrarCategoriaMotivos(nombresFiltroEstampado)
    this.listar_itemsDefectosLavado = this.filtrarCategoriaMotivos(nombresFiltroLavado)
    this.listar_itemsDefectosBordado = this.filtrarCategoriaMotivos(nombresFiltroBordado)
    this.RecargarDefectosEstampados()
    this.RecargarDefectosLavado()
    this.RecargarDefectosBordado()
    this.RecargarDefectosRecuperada()

  }

  filtrarCategoriaMotivos(fieldFilter: any) {
    return this.listar_itemsDefectosFull.filter(item => fieldFilter.includes(item['Cod_Area_CC']));
  }

  RecargarDefectosEstampados(){
    this.filtroDefectosEstampados = this.formulario.controls['sCodDefectoEstampado'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterDefectosEstampados(option) : this.listar_itemsDefectosEstampados.slice())),
    );
  }
  private _filterDefectosEstampados(value: string): Motivo[] {
    const filterValue = value.toLowerCase();
    return this.listar_itemsDefectosEstampados.filter(option => String(option.Cod_Motivo).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Descripcion.toLowerCase().indexOf(filterValue ) > -1);
  }

  RecargarDefectosLavado(){
    this.filtroDefectosLavado = this.formulario.controls['sCodDefectoLavado'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterDefectosLavado(option) : this.listar_itemsDefectosLavado.slice())),
    );
  }
  private _filterDefectosLavado(value: string): Motivo[] {
    const filterValue = value.toLowerCase();
    return this.listar_itemsDefectosLavado.filter(option => String(option.Cod_Motivo).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Descripcion.toLowerCase().indexOf(filterValue ) > -1);
  }

  RecargarDefectosBordado(){
    this.filtroDefectosBordado = this.formulario.controls['sCodDefectoBordado'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterDefectosBordado(option) : this.listar_itemsDefectosBordado.slice())),
    );
  }
  private _filterDefectosBordado(value: string): Motivo[] {
    const filterValue = value.toLowerCase();
    return this.listar_itemsDefectosBordado.filter(option => String(option.Cod_Motivo).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Descripcion.toLowerCase().indexOf(filterValue ) > -1);
  }

  RecargarDefectosRecuperada(){
    this.filtroDefectosRecuperada = this.formulario.controls['sCodDefectoRecuperada'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterDefectosRecuperada(option) : this.listar_itemsDefectosFull.slice())),
    );
  }
  private _filterDefectosRecuperada(value: string): Motivo[] {
    const filterValue = value.toLowerCase();
    return this.listar_itemsDefectosFull.filter(option => String(option.Cod_Motivo).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Descripcion.toLowerCase().indexOf(filterValue ) > -1);
  }

 
  RegistrarHoja() {
    if (this.formulario.valid) {
      this.Cod_Accion   = 'I'
      let Co_CodOrdPro = this.formulario.get('sOC').value
      let Cod_EstCli = this.formulario.get('sEstilo').value
      let Cod_Cliente = this.formulario.get('sCod_Cliente').value
      let Cod_Present = this.formulario.get('sColor').value

      let sNumMaquina = this.formulario.get('sNumMaquina').value
      let sProceso = this.formulario.get('sProceso').value
      let sIdMaquina = this.formulario.get('sIdMaquina').value
      let sIdHorno = this.formulario.get('sIdHorno').value
      let sHorno = this.formulario.get('sHorno').value
      let sTiempo = this.formulario.get('sTiempo').value
      let sVelocidad = this.formulario.get('sVelocidad').value
      let sPresion = this.formulario.get('sPresion').value
      let sTemperatura = this.formulario.get('sTemperatura').value
      let sTendedor = this.formulario.get('sTendedor').value
      let sSupervisor = this.formulario.get('sSupervisor').value
      let sPrendasCant = this.formulario.get('sPrendasCant').value
      let sPiezasCant = this.formulario.get('sPiezasCant').value
      let sPrendasPri = this.formulario.get('sPrendasPri').value
      let sPrendasDef = this.formulario.get('sPrendasDef').value
      let sPrendasRec = this.formulario.get('sPrendasRec').value
      let sPrendasSeg = this.formulario.get('sPrendasSeg').value
      let sPrendasEsp = this.formulario.get('sPrendasEsp').value
      let sTotalPrenAud = this.formulario.get('sTotalPrenAud').value
      let sFlgAprobacion = this.formulario.get('sFlgAprobacion').value
      let flgInspeCalidad = this.formulario.get('flgInspeCalidad').value
      let flgSuperProd = this.formulario.get('flgSuperProd').value
      let sObservacion = this.formulario.get('sObservacion').value
      let sFechaInicio = this.formulario.get('sFechaInicio').value
      let sFechaFin = this.formulario.get('sFechaFin').value

      let sTipoPrenda = this.formulario.get('sTipoPrenda').value
      let sHabilitadas = this.formulario.get('sHabilitadas').value

      let defectos: Defectos[]
      defectos = this.listar_Defectos.concat(this.listar_Segundas).concat(this.listar_Especiales);

      /*
      console.log(
        'Cod_Accion: ',this.Cod_Accion,
        'Cod_OrdPro: ',this.Cod_OrdPro,
        'Cod_EstPro: ',this.Cod_EstPro,
        'Cod_Version: ',this.Cod_Version,
        'Co_CodOrdPro: ',Co_CodOrdPro,
        'sEstilo: ',Cod_EstCli,
        'sCliente: ',Cod_Cliente,
        'Cod_Present: ',Cod_Present,
        'sNumMaquina: ',sNumMaquina,
        'sHorno: ',sHorno,
        'sTiempo: ',sTiempo,
        'sPresion: ',sPresion,
        'sTemperatura: ',sTemperatura,
        'sOperario: ',sOperario,
        'sSupervisor: ',sSupervisor,
        'sPrendasCant: ',sPrendasCant,
        'sPiezasCant: ',sPiezasCant,
        'sPrendasPri: ',sPrendasPri,
        'sPrendasDef: ',sPrendasDef,
        'sPrendasRec: ',sPrendasRec,
        'sPrendasSeg: ',sPrendasSeg,
        'sPrendasEsp: ',sPrendasEsp,
        'sTotalPrenAud: ',sTotalPrenAud,
        'sFlgAprobacion: ',sFlgAprobacion,
        'flgInspeCalidad: ',flgInspeCalidad,
        'flgSuperProd: ',flgSuperProd,
        'sObservacion: ',sObservacion,

        'sTipoPrenda: ', sTipoPrenda,
        'sHabilitadas: ', sHabilitadas,

        'IdProcesoArtes', this.IdProcesoArtes,
        'Opciones', this.dataItemsProceso
      )
      */
      this.SpinnerService.show();
      this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
        this.Cod_Accion,
        this.Cod_OrdPro,
        this.Cod_EstPro,
        this.Cod_Version,
        Co_CodOrdPro,
        Cod_EstCli,
        Cod_Cliente,
        Cod_Present,
        sIdMaquina,
        sIdHorno,
        sVelocidad,
        sTiempo,
        sPresion,
        sTemperatura,
        sTendedor,
        sSupervisor,
        sPrendasCant,
        sPiezasCant,
        sPrendasPri,
        sPrendasDef,
        sPrendasRec,
        sPrendasSeg,
        sPrendasEsp,
        sTotalPrenAud,
        sFlgAprobacion,
        flgInspeCalidad,
        flgSuperProd,
        sObservacion,
        sTipoPrenda,
        sHabilitadas,
        _moment(sFechaInicio).isValid() ? _moment(sFechaInicio.valueOf()).format() : '',
        _moment(sFechaFin).isValid() ? _moment(sFechaFin.valueOf()).format() : '',
        this.IdProcesoArtes
        ).subscribe(
        (result: any) => {
        if (result[0].Respuesta == 'OK'){
          //console.log(result)
          this.Num_Hoja_Inspeccion = result[0].Num_Hoja_Inspeccion
          this.dataItemsWithOpciones= {'Idhoja':this.Num_Hoja_Inspeccion, 'Accion':'I','Opciones':this.dataItemsProceso,'Defectos':defectos, 'Operarios':this.listar_Operario}
          this.enviarItemsProceso()
          this.SpinnerService.hide();
          //this.dialog_.close();
        }else{
          this.SpinnerService.hide();
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))


    }else{
      this.matSnackBar.open('Ingrese la informacion requerida...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
  }

  enviarItemsProceso() {
    //console.log(this.dataItemsWithOpciones)
    //this.dialog_.close();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionOpciones(
      this.dataItemsWithOpciones
    ).subscribe(
      (result: any) => {
        console.log(result)
        if (result.msg == 'OK') {
          this.dataItemsWithOpciones = [];
          this.SpinnerService.hide();
          this.dialog_.close();
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  definirTitulo(){
    this.Titulo    = this.data.Num_Hoja_Correlativo
    this.formulario.controls['sTotalPrenAud'].disable()
    //console.log(this.Titulo)
    if(this.Titulo == undefined){//Boton nuevo pulsado
      this.Titulo  = this.dataTrabajador[0].NumHoja
    }else{
     //console.log(this.data) 
     this.Cod_OrdPro = this.data.Cod_OrdPro
     this.Cod_EstPro = this.data.Cod_EstPro
     this.Cod_Version = this.data.Cod_Version
     this.IdProcesoArtes = this.data.Id_ProcesoArtes
     this.btnAccionModificar = true
     this.CargarOperacionColor()
     this.CargarListaOC()
     this.formulario.patchValue({
        sOP: this.data.Cod_OrdPro,
        sCod_Cliente: this.data.Cod_Cliente,
        sCliente: this.data.Des_Cliente,
        sEstilo: this.data.Cod_EstCli,
        sOC: this.data.Co_CodOrdPro,
        sColor: this.data.Cod_Present,
        sPrendasCant: this.data.Prendas_Can,
        sPiezasCant: this.data.Piezas_Can,
        sTendedor: this.data.Operario,
        sSupervisor: this.data.Supervisor,
        sNumMaquina: this.data.Num_Maquina,
        sProceso: this.data.Tip_Proceso,
        sIdMaquina: this.data.Id_Maquina,
        sIdHorno: this.data.Id_Horno,
        sHorno: this.data.Horno,
        sTiempo: this.data.Tiempo,
        sVelocidad: this.data.Velocidad,
        sPresion: this.data.Presion,
        sTemperatura: this.data.Temperatura,
        sPrendasPri: this.data.Prendas_Pri,
        sPrendasDef: this.data.Prendas_Def,
        sPrendasRec: this.data.Prendas_Rec,
        sPrendasSeg: this.data.Prendas_Seg,
        sPrendasEsp: this.data.Prendas_Esp,
        sTotalPrenAud: this.data.Total_Prendas_Aud,
        sFlgAprobacion: this.data.Flg_Aprobacion,
        sObservacion: this.data.Observacion,
        sTipoPrenda: this.data.Tipo_Prenda,
        sHabilitadas: this.data.Habilitadas,
        flgInspeCalidad: this.data.Flg_Estado_Inspec_Calidad,
        flgSuperProd: this.data.Flg_Estado_Superv_Produccion,
        sFechaHoraIngreso: this.datepipe.transform(this.data.Fecha_Registro_Hoja['date'], 'yyyy-MM-ddTHH:mm'),
        sFechaInicio: this.datepipe.transform(this.data.Fecha_Inicio['date'], 'yyyy-MM-ddTHH:mm'),
        sFechaFin: this.datepipe.transform(this.data.Fecha_Fin['date'], 'yyyy-MM-ddTHH:mm')
      });
        
    this.formulario.controls['sOP'].disable()
    this.formulario.controls['sEstilo'].disable()
    this.formulario.controls['sCliente'].disable()
    this.optSupervicionVisible = (this.data.IdNivelAutorizacion == 1) ? true:false
    this.btnAccionModificar = true

    this.totalRecupadas = this.data.Prendas_Rec;
    this.totalPrimeras = this.data.Prendas_Pri;
    this.totalSegundas = this.data.Prendas_Seg;
    this.totalEspeciales = this.data.Prendas_Esp;
    this.totalDefectos = this.data.Prendas_Def;
    //console.log('editando')
    //this.changeDataGrilla()

    }
  }

  changeDataGrilla() {
    //console.log(event)
    //console.log(this.Cod_Accion)
    this.Cod_OrdPro = this.formulario.get('sOP')?.value
    //if (event != undefined) {
      //var oc = event.target.value;
      //if (oc.length == 5) {  
      if (this.Cod_OrdPro.length >= 5) {   
        this.Cod_Accion   = 'C'
        this.SpinnerService.show();
        this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
          this.Cod_Accion,
          this.Cod_OrdPro,
          this.Cod_EstPro,
          this.Cod_Version,
          '','','','','','','','','','','','',
          0,0,0,0,0,0,0,0,'','','','','',0,'','',
          this.IdProcesoArtes
          ).subscribe(
          (result: any) => {
            if(result.length > 0){
            this.dataItemsProceso = result;
            this.ItemsProceso = [];
            this.getEncabezadoProcesos();

            this.listar_Lavado = this.dataItemsProceso.filter(d => d.Id_FamItem == 'LV' && d.Tipo_dato == 'X')
            this.dataLavadoSource = new MatTableDataSource(this.listar_Lavado);  
            this.SpinnerService.hide();
          }else{
            this.matSnackBar.open('No se tienen items de opciones...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

      } else {
        this.grdProcesosVisible = false;
      }
    //}
  }

  getEncabezadoProcesos(){

    this.dataItemsProceso.forEach(element => {
      if (element.Id_FamItem == 'ES') {
        this.ItemsProceso = this.addUniqueObject(this.ItemsProceso, {id: element.Id_FamItem.trim(), name: element.Des_FamItem.trim(), idItem: element.Id_Item})
      }
      if (element.Id_FamItem == 'LV') {
        this.ItemsProceso = this.addUniqueObject(this.ItemsProceso, {id: element.Id_FamItem.trim(), name: element.Des_FamItem.trim(),idItem: element.Id_Item})
      }
      if (element.Id_FamItem == 'MT') {
        this.ItemsProceso = this.addUniqueObject(this.ItemsProceso, {id: element.Id_FamItem.trim(), name: element.Des_FamItem.trim(),idItem: element.Id_Item})
      }
      if (element.Id_FamItem == 'BD') {
        this.ItemsProceso = this.addUniqueObject(this.ItemsProceso, {id: element.Id_FamItem.trim(), name: element.Des_FamItem.trim(),idItem: element.Id_Item})
      }
      if (element.Id_FamItem == 'RE') {
        this.ItemsProceso = this.addUniqueObject(this.ItemsProceso, {id: element.Id_FamItem.trim(), name: element.Des_FamItem.trim(),idItem: element.Id_Item})
      }
      if (element.Id_FamItem == 'SC') {
        this.ItemsProceso = this.addUniqueObject(this.ItemsProceso, {id: element.Id_FamItem.trim(), name: element.Des_FamItem.trim(),idItem: element.Id_Item})
      }
      
    });
    this.grdProcesosVisible = true;
    
  }

  addUniqueObject(arr: Proceso[], obj: Proceso): Proceso[] {
    if (!arr.some(item => item.id === obj.id)) {
      arr.push(obj);
    }
    return arr;
  }

  calculaTotales(){
    // PRIMERAS
    let totalPrimerasSum = 0;
    let sHabilitadasTotal = this.formulario.get('sPrendasCant').value;

    this.listar_Defectos.forEach(element => {
      let valor = isNaN(parseInt(element.Cantidad.toString(), 10)) ? 0 : parseInt(element.Cantidad.toString(), 10);
      totalPrimerasSum = totalPrimerasSum + valor;
    });

    this.totalPrimeras = sHabilitadasTotal - totalPrimerasSum
    this.totalDefectos = totalPrimerasSum
    
    this.formulario.controls['sPrendasPri'].setValue(this.totalPrimeras);
    this.formulario.controls['sPrendasDef'].setValue(this.totalDefectos);

    // SEGUNDAS
    let totalSegundasSum = 0
    this.listar_Segundas.forEach(element => {
      let valor = isNaN(parseInt(element.Cantidad.toString(), 10)) ? 0 : parseInt(element.Cantidad.toString(), 10);
      totalSegundasSum = totalSegundasSum + valor;
    });

    this.totalSegundas = totalSegundasSum;
    this.formulario.controls['sPrendasSeg'].setValue(this.totalSegundas);

    // ESPECIALES
    let totalEspecialesSum = 0
    this.listar_Especiales.forEach(element => {
      let valor = isNaN(parseInt(element.Cantidad.toString(), 10)) ? 0 : parseInt(element.Cantidad.toString(), 10);
      totalEspecialesSum = totalEspecialesSum + valor;
    });

    this.totalEspeciales = totalEspecialesSum
    this.formulario.controls['sPrendasEsp'].setValue(this.totalEspeciales)

    // TOTALES
    this.totalRecupadas = this.totalDefectos - (this.totalSegundas + this.totalEspeciales);
    this.formulario.controls['sPrendasRec'].setValue(this.totalRecupadas);
  }

  changeInfoObserv(event, param){
    /*************crear nuevo campo defecto***********/
    this.dataItemsProceso.forEach(element => {
      if (element.Id_Item == param.Id_Item && element.Des_Motivo == param.Des_Motivo) {
          element.Observacion = event.target.value;
      }
    });
    //console.log(this.dataItemsProceso)
    /*************calculo de primeras***********/
    //this.totalPrimeras = 0
    /*
    let totalPrimerasSum = 0
    let sHabilitadasTotal = this.formulario.get('sPrendasCant').value
    this.dataItemsProceso.forEach(element => {
      if(element.Tipo_dato == 'T' && (element.Id_FamItem == 'ES' || element.Id_FamItem == 'BD' || element.Id_FamItem == 'LV')){
        //console.log('valor: ',element.Observacion)
        if(element.Des_Motivo!='Tiempo/Ciclos'){ //omitir calculo de este registro
          console.log(element)
          let valor = isNaN(parseInt(element.Observacion, 10)) ? 0 : parseInt(element.Observacion, 10);
          totalPrimerasSum += valor
        }
      }      
    });
    this.totalPrimeras = sHabilitadasTotal - totalPrimerasSum
    this.totalDefectos = totalPrimerasSum
    //console.log(this.totalPrimeras)
    this.formulario.controls['sPrendasPri'].setValue(this.totalPrimeras)
    this.formulario.controls['sPrendasDef'].setValue(this.totalDefectos)
    */
    /*************calculo de segundas***********/
    let totalSegundasSum = 0
    this.dataItemsProceso.forEach(element => {
      if(element.Tipo_dato == 'T' && (element.Id_FamItem == 'RE')){
        //console.log('valor: ',element.Observacion)
        let valor = isNaN(parseInt(element.Observacion, 10)) ? 0 : parseInt(element.Observacion, 10);
        totalSegundasSum += valor
      }      
    });
    this.totalSegundas = totalSegundasSum
    this.formulario.controls['sPrendasSeg'].setValue(this.totalSegundas)

    /*************calculo de segundas***********/
    let totalEspecialesSum = 0
    this.dataItemsProceso.forEach(element => {
      if(element.Tipo_dato == 'T' && (element.Id_FamItem == 'SC')){
        //console.log('valor: ',element.Observacion)
        let valor = isNaN(parseInt(element.Observacion, 10)) ? 0 : parseInt(element.Observacion, 10);
        totalEspecialesSum += valor
      }      
    });
    this.totalEspeciales = totalEspecialesSum
    this.formulario.controls['sPrendasEsp'].setValue(this.totalEspeciales)

    /*************calculo de segundas***********/
    this.totalRecupadas = this.totalDefectos - (this.totalSegundas + this.totalEspeciales)
    this.formulario.controls['sPrendasRec'].setValue(this.totalRecupadas)

  }

  ModificarHoja(){

    this.Cod_Accion = 'U'
    let Co_CodOrdPro = this.formulario.get('sOC').value
    let Cod_EstCli = this.formulario.get('sEstilo').value
    let Cod_Cliente = this.formulario.get('sCliente').value
    let Cod_Present = this.formulario.get('sColor').value

    let sNumMaquina = this.formulario.get('sNumMaquina').value
    let sProceso = this.formulario.get('sProceso').value
    let sIdMaquina = this.formulario.get('sIdMaquina').value
    let sIdHorno = this.formulario.get('sIdHorno').value
    let sHorno = this.formulario.get('sHorno').value
    let sTiempo = this.formulario.get('sTiempo').value
    let sVelocidad = this.formulario.get('sVelocidad').value
    let sPresion = this.formulario.get('sPresion').value
    let sTemperatura = this.formulario.get('sTemperatura').value
    let sTendedor = this.formulario.get('sTendedor').value
    let sSupervisor = this.formulario.get('sSupervisor').value
    let sPrendasCant = this.formulario.get('sPrendasCant').value
    let sPiezasCant = this.formulario.get('sPiezasCant').value
    let sPrendasPri = this.formulario.get('sPrendasPri').value
    let sPrendasDef = this.formulario.get('sPrendasDef').value
    let sPrendasRec = this.formulario.get('sPrendasRec').value
    let sPrendasSeg = this.formulario.get('sPrendasSeg').value
    let sPrendasEsp = this.formulario.get('sPrendasEsp').value
    let sTotalPrenAud = this.formulario.get('sTotalPrenAud').value
    let sFlgAprobacion = this.formulario.get('sFlgAprobacion').value
    let flgInspeCalidad = this.formulario.get('flgInspeCalidad').value
    let flgSuperProd = this.formulario.get('flgSuperProd').value
    let sObservacion = this.formulario.get('sObservacion').value
    //let sFechaInicio = this.formulario.get('sFechaInicio').value
    //let sFechaFin = this.formulario.get('sFechaFin').value
    let sFechaInicio = _moment(this.formulario.get('sFechaInicio').value).isValid() ? _moment(this.formulario.get('sFechaInicio').value.valueOf()).format() : ''; //new Date(fIni)
    let sFechaFin = _moment(this.formulario.get('sFechaFin').value).isValid() ? _moment(this.formulario.get('sFechaFin').value.valueOf()).format() : '';  //new Date(fFin)
    

    let sTipoPrenda = this.formulario.get('sTipoPrenda').value
    let sHabilitadas = this.formulario.get('sHabilitadas').value
     
    let defectos: Defectos[]
    defectos = this.listar_Defectos.concat(this.listar_Segundas).concat(this.listar_Especiales);

    this.dataSendActualizar = {
      'Accion':this.Cod_Accion,
      'Cod_OrdPro':this.Cod_OrdPro,
      'Cod_EstPro':this.Cod_EstPro,
      'Cod_Version':this.Cod_Version,
      'Co_CodOrdPro':Co_CodOrdPro,
      'Cod_EstCli': Cod_EstCli,
      'Cod_Cliente': Cod_Cliente,
      'Cod_Present': Cod_Present,
      'sIdMaquina': sIdMaquina,
      'sIdHorno': sIdHorno,
      'sVelocidad': sVelocidad,
      'sTiempo': sTiempo,
      'sPresion': sPresion,
      'sTemperatura': sTemperatura,
      'sOperario': sTendedor,
      'sSupervisor': sSupervisor,
      'sPrendasCant': sPrendasCant,
      'sPiezasCant': sPiezasCant,
      'sPrendasPri': sPrendasPri,
      'sPrendasDef': sPrendasDef,
      'sPrendasRec': sPrendasRec,
      'sPrendasSeg': sPrendasSeg,
      'sPrendasEsp': sPrendasEsp,
      'sTotalPrenAud': sTotalPrenAud,
      'sFlgAprobacion': sFlgAprobacion,
      'flgInspeCalidad': flgInspeCalidad,
      'flgSuperProd': flgSuperProd,
      'sObservacion': sObservacion,
      'sTipoPrenda': sTipoPrenda,
      'sHabilitadas': sHabilitadas,
      'sFechaInicio': sFechaInicio,
      'sFechaFin': sFechaFin,
      'Cod_Usuario': GlobalVariable.vusu,
      'IdProcesoArtes':this.IdProcesoArtes,
      'Opciones':this.dataItemsProceso,
      'Defectos':defectos,
      'Operarios':this.listar_Operario
    }
    //console.log(this.dataSendActualizar)
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionActualizarWithOpciones(
      this.dataSendActualizar
    ).subscribe(
      (result: any) => {
        console.log(result)
        if (result[0].Respuesta == 'OK'){
          this.dataSendActualizar = [];
          this.SpinnerService.hide();
          this.dialog_.close();
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

    

  }

  CargarListaOC() {
    this.Cod_Accion   = 'O'
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','','','','','','','','','','',
      0,0,0,0,0,0,0,0,'','','','','',0,'','',
      this.IdProcesoArtes
      ).subscribe(
      (result: any) => {
        console.log(result)
        if(result.length > 0){
          this.lstOC = result
          
          if(this.lstOC.length == 1)
            this.formulario.controls['sOC'].setValue(this.lstOC[0].Co_CodOrdPro);

          this.SpinnerService.hide();
        }else{
          this.lstOC = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  CargarOperacionSupervisor(){
    this.Cod_Accion   = 'S'
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','','','','','','','','','','',
      0,0,0,0,0,0,0,0,'','','','','',0,'','',
      this.IdProcesoArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          //console.log(result);
          this.listar_operacionSupervisor = result
          this.RecargarOperacionSupervisor()
          //this.dataTrabajador = result
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  RecargarOperacionSupervisor(){
    this.filtroOperacionSupervisor = this.formulario.controls['sSupervisor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionSupervisor(option) : this.listar_operacionSupervisor.slice())),
    );
  }

  private _filterOperacionSupervisor(value: string): Supervisor[] {
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_operacionSupervisor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }

  CambiarValorCodSupervisor(Cod_Auditor: string, Tip_Trabajador: string){
    //this.formulario.controls['CodSupervisor'].setValue(Tip_Trabajador + '-' + Cod_Auditor)
  }

  CargarOperacionOperario(){
    this.Cod_Accion   = 'T'
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','','','','','','','','','','',
      0,0,0,0,0,0,0,0,'','','','','',0,'','',
      this.IdProcesoArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          //console.log(result);
          this.listar_operacionOperario = result
          this.RecargarOperacionOperario()
          this.RecargarOperacionTendedor()
          //this.dataTrabajador = result
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }


  RecargarOperacionTendedor(){
    this.filtroOperacionTendedor = this.formulario.controls['sTendedor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionTendedor(option) : this.listar_operacionTendedor.slice())),
    );
  }

  private _filterOperacionTendedor(value: string): Operario[] {
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_operacionOperario.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }


  CambiarValorCodTendedor(Cod_Auditor: string, Tip_Trabajador: string){
    //this.formulario.controls['CodAuditor'].setValue(Tip_Trabajador + '-' +Cod_Auditor)
  }

  RecargarOperacionOperario(){
    this.filtroOperacionOperario = this.formulario.controls['sOperario'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionOperario(option) : this.listar_operacionOperario.slice())),
    );
  }

  private _filterOperacionOperario(value: string): Operario[] {
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_operacionOperario.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }


  CambiarValorCodOperario(Cod_Auditor: string, Tip_Trabajador: string){
    this.formulario.controls['sCodOperario'].setValue(Tip_Trabajador + '-' +Cod_Auditor)
    //this.formulario.controls['CodAuditor'].setValue(option.Tip_Trabajador.concat("-").concat(option.Cod_Auditor));
  }


  changeCheck(event, param) {
    console.log(this.dataItemsProceso)
    if (event.checked) {

      this.dataItemsProceso.forEach(element => {

        if (element.Id_Item == param.Id_Item && element.Des_Motivo == param.Des_Motivo) {
            element.Observacion = '1';
        }

      });

    } else {

      this.dataItemsProceso.forEach(element => {

        if (element.Id_Item == param.Id_Item && element.Des_Motivo == param.Des_Motivo) {
            element.Observacion = '0';
        }

      });

    }
    console.log(this.dataItemsProceso)

  }
  

  addMotivoEstampado(bloque){
    let codigo_motivo = this.formulario.get('sCodDefectoEstampado').value
    if(codigo_motivo!=''){
      this.addUniqueDefectoObject(this.dataItemsProceso, {
        Id_Item: bloque.idItem, 
        Des_FamItem: bloque.name.trim(),
        Id_FamItem: bloque.id,
        Tipo: "T",
        Des_Motivo: codigo_motivo.trim(),
        Tipo_dato: "T",
        Observacion: '',
        Flg_Estado: ''
      })
      this.formulario.controls['sCodDefectoEstampado'].setValue('')      
      /*let dato = {
        Id_Item: bloque.idItem,
        Des_FamItem: bloque.name,
        Id_FamItem: bloque.id,
        Tipo: "T",
        Cod_Motivo: codigo_motivo,
        Tipo_dato: "T",
        Observacion: '',
      }*/
      /*console.log(dato)
      this.dataItemsProceso.push(dato)
      console.log(this.dataItemsProceso)*/
    }else{
      this.matSnackBar.open('Ingrese un codigo de defecto en ' + bloque.name, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
    
  }

  addMotivoLavado(bloque){
    let codigo_motivo = this.formulario.get('sCodDefectoLavado').value
    if(codigo_motivo!=''){
      this.addUniqueDefectoObject(this.dataItemsProceso, {
        Id_Item: bloque.idItem, 
        Des_FamItem: bloque.name.trim(),
        Id_FamItem: bloque.id,
        Tipo: "T",
        Des_Motivo: codigo_motivo.trim(),
        Tipo_dato: "T",
        Observacion: '',
        Flg_Estado: ''
      })
      this.formulario.controls['sCodDefectoLavado'].setValue('') 
    }else{
      this.matSnackBar.open('Ingrese un codigo de defecto en ' + bloque.name, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
  }

  addMotivoMatching(bloque){
    let codigo_motivo = this.formulario.get('sCodDefectoMatching').value
    if(codigo_motivo!=''){
      this.addUniqueDefectoObject(this.dataItemsProceso, {
        Id_Item: bloque.idItem, 
        Des_FamItem: bloque.name.trim(),
        Id_FamItem: bloque.id,
        Tipo: "T",
        Des_Motivo: codigo_motivo.trim(),
        Tipo_dato: "T",
        Observacion: '',
        Flg_Estado: ''
      })
      this.formulario.controls['sCodDefectoMatching'].setValue('') 
    }else{
      this.matSnackBar.open('Ingrese un codigo de defecto en ' + bloque.name, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
  }

  addMotivoBordado(bloque){
    let codigo_motivo = this.formulario.get('sCodDefectoBordado').value
    if(codigo_motivo!=''){
      this.addUniqueDefectoObject(this.dataItemsProceso, {
        Id_Item: bloque.idItem, 
        Des_FamItem: bloque.name.trim(),
        Id_FamItem: bloque.id,
        Tipo: "T",
        Des_Motivo: codigo_motivo.trim(),
        Tipo_dato: "T",
        Observacion: '',
        Flg_Estado: ''
      })
      this.formulario.controls['sCodDefectoBordado'].setValue('') 
    }else{
      this.matSnackBar.open('Ingrese un codigo de defecto en ' + bloque.name, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
  }

  addMotivoRecuperada(bloque){
    //console.log(bloque)
    let codigo_motivo = this.formulario.get('sCodDefectoRecuperada').value
    if(codigo_motivo!=''){
      this.addUniqueDefectoObject(this.dataItemsProceso, {
        Id_Item: bloque.idItem, 
        Des_FamItem: bloque.name.trim(),
        Id_FamItem: bloque.id,
        Tipo: "T",
        Des_Motivo: codigo_motivo.trim(),
        Tipo_dato: "T",
        Observacion: '',
        Flg_Estado: ''
      })
      this.formulario.controls['sCodDefectoRecuperada'].setValue('') 
    }else{
      this.matSnackBar.open('Ingrese un codigo de defecto en ' + bloque.name, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
  }

  addMotivoEspeciales(bloque){
    //console.log(bloque)
    let codigo_motivo = this.formulario.get('sCodDefectoEspeciales').value
    if(codigo_motivo!=''){
      this.addUniqueDefectoObject(this.dataItemsProceso, {
        Id_Item: bloque.idItem, 
        Des_FamItem: bloque.name.trim(),
        Id_FamItem: bloque.id,
        Tipo: "T",
        Des_Motivo: codigo_motivo.trim(),
        Tipo_dato: "T",
        Observacion: '',
        Flg_Estado: ''
      })
      this.formulario.controls['sCodDefectoEspeciales'].setValue('') 
    }else{
      this.matSnackBar.open('Ingrese un codigo de defecto en ' + bloque.name, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
  }

  addUniqueDefectoObject(arr: Observacion[], obj: Observacion): Observacion[] {
    if (!arr.some(item => (item.Des_Motivo === obj.Des_Motivo && item.Id_Item === obj.Id_Item))) {
      arr.push(obj);
    }
    return arr;
  }

  supItemMotivo(elemento){
    if(elemento.Tipo_dato == 'T' && (elemento.Id_FamItem == 'ES' || elemento.Id_FamItem == 'BD' || elemento.Id_FamItem == 'LV')){
      const indice = this.dataItemsProceso.findIndex(item => item === elemento)
      this.dataItemsProceso.splice(indice, 1)
      this.totalPrimeras = this.totalPrimeras + parseInt(elemento.Observacion, 10)
      this.totalDefectos = this.totalDefectos - parseInt(elemento.Observacion, 10)
      //console.log(this.totalPrimeras)
      this.formulario.controls['sPrendasPri'].setValue(this.totalPrimeras)
      this.formulario.controls['sPrendasDef'].setValue(this.totalDefectos)
    }

    if(elemento.Tipo_dato == 'X' && elemento.Id_FamItem == 'LV'){
      const indice1 = this.dataItemsProceso.findIndex(item => item === elemento)
      this.dataItemsProceso.splice(indice1, 1)

      const indice = this.listar_Lavado.findIndex(item => item === elemento)
      this.listar_Lavado.splice(indice, 1)
      this.dataLavadoSource = new MatTableDataSource(this.listar_Lavado);  

    }


    if(elemento.Tipo_dato == 'T' && (elemento.Id_FamItem == 'RE')){
      //console.log('valor: ',element.Observacion)
      const indice = this.dataItemsProceso.findIndex(item => item === elemento)
      this.dataItemsProceso.splice(indice, 1)
      this.totalSegundas = this.totalSegundas - parseInt(elemento.Observacion, 10)
      this.formulario.controls['sPrendasSeg'].setValue(this.totalSegundas)
    } 
    
    if(elemento.Tipo_dato == 'T' && (elemento.Id_FamItem == 'SC')){
      //console.log('valor: ',element.Observacion)
      const indice = this.dataItemsProceso.findIndex(item => item === elemento)
      this.dataItemsProceso.splice(indice, 1)
      this.totalEspeciales = this.totalEspeciales - parseInt(elemento.Observacion, 10)
      this.formulario.controls['sPrendasEsp'].setValue(this.totalEspeciales)
    } 

    this.totalRecupadas = this.totalDefectos - (this.totalSegundas + this.totalEspeciales)
    this.formulario.controls['sPrendasRec'].setValue(this.totalRecupadas)  

    
  }

  monitoreaCantidad(){
    //console.log(this.formulario.get('sPrendasCant').value)
    //console.log(this.formulario.get('sPiezasCant').value)
    /*let total = 0//(this.formulario.get('sPrendasCant').value !='' && this.formulario.get('sPiezasCant').value !='') ? this.formulario.get('sPrendasCant').value : this.formulario.get('sPiezasCant').value
    if((this.formulario.get('sPrendasCant').value != null ||  this.formulario.get('sPrendasCant').value != '') && (this.formulario.get('sPiezasCant').value != null ||  this.formulario.get('sPiezasCant').value != '')){
      total=this.formulario.get('sPrendasCant').value
    }
    if((this.formulario.get('sPrendasCant').value != null ||  this.formulario.get('sPrendasCant').value != '') && (this.formulario.get('sPiezasCant').value == null ||  this.formulario.get('sPiezasCant').value == '')){
      total=this.formulario.get('sPrendasCant').value
    }
    if((this.formulario.get('sPrendasCant').value == null ||  this.formulario.get('sPrendasCant').value == '') && (this.formulario.get('sPiezasCant').value != null ||  this.formulario.get('sPiezasCant').value != '')){
      total=this.formulario.get('sPiezasCant').value
    }*/
    let total = this.formulario.get('sPrendasCant').value
    this.formulario.controls['sTotalPrenAud'].setValue(total)
    //console.log(this.totalPrimeras)
    this.totalPrimeras = total
    this.totalDefectos = 0
    this.formulario.controls['sPrendasPri'].setValue(this.totalPrimeras)
    this.formulario.controls['sPrendasDef'].setValue(this.totalDefectos)
  }

  getCantidadHabilitadas(){
    this.Cod_Accion   = 'H'
    let Cod_Present = this.formulario.get('sColor').value
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','',Cod_Present,'','','','','','','','',
      0,0,0,0,0,0,0,0,'','','','','',0,'','',
      this.IdProcesoArtes
      ).subscribe(
      (result: any) => {
        console.log(result)
        if(result.length > 0){
          //this.lstOC = result
          this.formulario.controls['sHabilitadas'].setValue(result[0].Habilitadas)
          this.SpinnerService.hide();
        }else{
          //this.lstOC = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  onBuscarMotivo(tipo: string){
    let codMotivo = tipo == '1' ? this.formulario.get('sCodMotivo')?.value : tipo == '2' ? this.formulario.get('sCodMotivo2')?.value : this.formulario.get('sCodMotivo3')?.value;
    if(codMotivo.length > 0 ){
      if(codMotivo.length <= 3){
        this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento('B', '', '', '', 0, codMotivo)
          .subscribe((result: any) => {
            if(result.length > 0){
              switch (tipo){
                case '1':
                  this.formulario.controls['sCodMotivo'].setValue(result[0].Cod_Motivo);
                  this.formulario.controls['sDesMotivo'].setValue(result[0].Descripcion);
                  break;
                case '2':
                  this.formulario.controls['sCodMotivo2'].setValue(result[0].Cod_Motivo);
                  this.formulario.controls['sDesMotivo2'].setValue(result[0].Descripcion);
                  break;
                case '3':
                  this.formulario.controls['sCodMotivo3'].setValue(result[0].Cod_Motivo);
                  this.formulario.controls['sDesMotivo3'].setValue(result[0].Descripcion);
                  break;
              } 
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        );
      } else {
        this.formulario.controls['sDesMotivo'].setValue('');
        this.formulario.controls['sDesMotivo2'].setValue('');
        this.formulario.controls['sDesMotivo3'].setValue('');
      }
    }
  } 

  onRegistrarOperario(){
    let operario: Operarios = {};
    let nomOperario = this.formulario.get('sOperario').value;
    let tipOperario = this.formulario.get('sTipoOperario').value;

    if(nomOperario!='' && tipOperario!=''){
      let desPuesto = this.dataTipoOperario.filter(d => d.Tipo_Operario == tipOperario)

      operario.Id_Operario = 0;
      operario.Id_ProcesoArtes = this.IdProcesoArtes;
      operario.Cod_Operario = this.formulario.get('sCodOperario').value;
      operario.Nom_Operario = this.formulario.get('sOperario').value;
      operario.Tipo_Operario = this.formulario.get('sTipoOperario').value;
      operario.Des_Puesto = desPuesto[0].Des_Puesto;
 
      this.listar_Operario.push(operario);
      this.dataOperarioSource = new MatTableDataSource(this.listar_Operario);

      this.formulario.controls['sOperario'].setValue('');
      this.formulario.controls['sTipoOperario'].setValue('');
    }

  }

  onRegistrarDefecto(){
    let defecto: Defectos = {};
    let codMotivo = this.formulario.get('sCodMotivo').value;
    let desMotivo = this.formulario.get('sDesMotivo').value;
    let cantidad = this.formulario.get('sCantidad').value;

    if(codMotivo!='' && desMotivo!='' && cantidad!=0){
      defecto.Id_Defecto = 0;
      defecto.Id_ProcesoArtes = this.IdProcesoArtes;
      defecto.Tipo_Defecto = '1';  // Primeras
      defecto.Cod_Motivo = codMotivo;
      defecto.Des_Motivo = this.formulario.get('sDesMotivo').value;
      defecto.Cantidad = cantidad;
 
      this.listar_Defectos.push(defecto);
      this.dataDefectoSource = new MatTableDataSource(this.listar_Defectos);  
    
      this.formulario.controls['sCodMotivo'].setValue('');
      this.formulario.controls['sCantidad'].setValue(0);
      this.formulario.controls['sDesMotivo'].setValue('');

      this.calculaTotales();
    }
  }

  onRegistrarDefecto2(){
    let defecto: Defectos = {};
    let codMotivo = this.formulario.get('sCodMotivo2').value;
    let desMotivo = this.formulario.get('sDesMotivo2').value;
    let cantidad = this.formulario.get('sCantidad2').value;

    if(codMotivo!='' && desMotivo!='' && cantidad!=0){
      defecto.Id_Defecto = 0;
      defecto.Id_ProcesoArtes = this.IdProcesoArtes;
      defecto.Tipo_Defecto = '2';  // Segundas
      defecto.Cod_Motivo = codMotivo;
      defecto.Des_Motivo = this.formulario.get('sDesMotivo2').value;
      defecto.Cantidad = cantidad;
 
      this.listar_Segundas.push(defecto);
      this.dataSegundasSource = new MatTableDataSource(this.listar_Segundas);
    
      this.formulario.controls['sCodMotivo2'].setValue('');
      this.formulario.controls['sCantidad2'].setValue(0);
      this.formulario.controls['sDesMotivo2'].setValue('');

      this.calculaTotales();
    }
  }

  onRegistrarDefecto3(){
    let defecto: Defectos = {};
    let codMotivo = this.formulario.get('sCodMotivo3').value;
    let desMotivo = this.formulario.get('sDesMotivo3').value;
    let cantidad = this.formulario.get('sCantidad3').value;

    if(codMotivo!='' && desMotivo!='' && cantidad!=0){
      defecto.Id_Defecto = 0;
      defecto.Id_ProcesoArtes = this.IdProcesoArtes;
      defecto.Tipo_Defecto = '3';  // Especiales
      defecto.Cod_Motivo = codMotivo;
      defecto.Des_Motivo = this.formulario.get('sDesMotivo3').value;
      defecto.Cantidad = cantidad;
 
      this.listar_Especiales.push(defecto);
      this.dataEspecialesSource = new MatTableDataSource(this.listar_Especiales);
    
      this.formulario.controls['sCodMotivo3'].setValue('');
      this.formulario.controls['sCantidad3'].setValue(0);
      this.formulario.controls['sDesMotivo3'].setValue('');

      this.calculaTotales();
    }
  }


  onRegistrarLavado(){
    let lavado = {
      'Bloque': 1,
      'Des_FamItem': '',
      'Des_Motivo': '',
      'Flg_Estado': this.Flg_Estado,
      'Des_Estado': this.Flg_Estado  == '1' ? 'APROBADO' : 'RECHAZADO',
      'Id_FamItem': 'LV',
      'Id_Item': '2',
      'Id_Observaciones': 0,
      'NRow': this.listar_Lavado.length + 1,
      'Observacion': this.formulario.get('sCiclo').value,
      'Tipo': 'X',
      'Tipo_dato': 'X'
    };

    let sCiclo = this.formulario.get('sCiclo').value;

    if(sCiclo!=''){
      this.listar_Lavado.push(lavado);
      this.dataItemsProceso.push(lavado);
      this.dataLavadoSource = new MatTableDataSource(this.listar_Lavado);  
   
      this.formulario.controls['sCiclo'].setValue('');
    }

  }

  changeAprobacion(event) {
    if (event.checked) {
      this.Flg_Estado = '1'
    }else{
      this.Flg_Estado = '0'
    }

  }

  onEliminarDefecto(tipo: string, defecto: Defectos){
    if(defecto.Id_Defecto == 0){
      this.quitarItemDefecto(tipo, defecto);
      this.calculaTotales()
    } else {
      let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'true') {
          this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionDefectos('D',
            this.IdProcesoArtes,
            defecto.Id_Defecto,
            defecto.Tipo_Defecto,
            defecto.Cod_Motivo,
            defecto.Cantidad
          ).subscribe((res) => {
            console.log(res)
            if (res[0].Respuesta == 'OK') {
              this.quitarItemDefecto(tipo, defecto);
              this.calculaTotales();  
              this.SpinnerService.hide();
            }
            else {
              this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.SpinnerService.hide();
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
         );  
        }
      });

    }

  }

  quitarItemDefecto(tipo: string, defecto: Defectos){
    switch (tipo){
      case '1':
        const indice = this.listar_Defectos.findIndex(item => item === defecto);
        this.listar_Defectos.splice(indice, 1)
        this.dataDefectoSource = new MatTableDataSource(this.listar_Defectos);
        break;
      case '2':
        const indice2 = this.listar_Segundas.findIndex(item => item === defecto);
        this.listar_Segundas.splice(indice2, 1)
        this.dataSegundasSource = new MatTableDataSource(this.listar_Segundas);
        break;
      case '3':
        const indice3 = this.listar_Especiales.findIndex(item => item === defecto);
        this.listar_Especiales.splice(indice3, 1)
        this.dataEspecialesSource = new MatTableDataSource(this.listar_Especiales);
        break;
    }
  }


  onEliminarOperario(operario: Operarios){
    if(operario.Id_Operario == 0){
      const indice = this.listar_Operario.findIndex(item => item === operario)
      this.listar_Operario.splice(indice, 1)
      this.dataOperarioSource = new MatTableDataSource(this.listar_Operario);

    } else {
      let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'true') {
          this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionOperarios('D',
            this.IdProcesoArtes,
            operario.Tipo_Operario,
            operario.Id_Operario,
            operario.Cod_Operario
          ).subscribe((res) => {
            console.log(res)
            if (res[0].Respuesta == 'OK') {

              const indice = this.listar_Operario.findIndex(item => item === operario)
              this.listar_Operario.splice(indice, 1)
              this.dataOperarioSource = new MatTableDataSource(this.listar_Operario);
              this.SpinnerService.hide();
            }
            else {
              this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.SpinnerService.hide();
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
         );  
        }
      });

    }

  }

  selectTipoPrenda(){
    if(this.formulario.get('sTipoPrenda').value == '1')
      this.formulario.controls['sOC'].setValue('');
  }

}

 