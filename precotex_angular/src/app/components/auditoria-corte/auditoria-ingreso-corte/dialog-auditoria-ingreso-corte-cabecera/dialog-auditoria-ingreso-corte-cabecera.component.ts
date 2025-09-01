import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { NgxSpinnerService }  from "ngx-spinner";
import { DatePipe } from "@angular/common";
import * as _moment from 'moment';

import { AuditoriaProcesoCorteService } from 'src/app/services/auditoria-proceso-corte.service';
import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';

//Data proveniente del padre cuando se edita
interface data {
  Id_Auditoria: number;
  Co_CodOrdPro?: string;
  Cod_OrdProv?: string;
  Cod_OrdPro?: string;
  Cod_EstCli?: string;
  Cod_Cliente?: string;
  Des_Cliente?: string;
  Cod_Present?: string;
  Des_Present?: string;
  Des_TipPre?: string;
  Cod_TemCli?: string;
  Nom_TemCli?: string;
  Codigo_Molde?: string;
  Des_Tela?: string;
  Tipo_Tela?: string;
  Color_Tela?: string;
  Encogim_molde_t?: string;
  Encogim_molde_h?: string;
  Auditor?: string;
  Turno?: string;
  Nom_Auditor?: string;
  Cod_Auditor?: string;
  Cod_Usuario?: string;
  Fecha_Ingreso?: string;
  Flg_Estado_Tizado?: string;
  Flg_Estado_Tendido?: string;
  Flg_Estado?: string;
  Fecha_Registro?: string;
}

interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

interface NumTendido {
  Id_Tendido?: number,
  Id_TendidoItem?: number,
  Alto?: number;
  Largo?: number;
  Cantidad?: number;
  nRow?: number;
}

@Component({
  selector: 'app-dialog-auditoria-ingreso-corte-cabecera',
  templateUrl: './dialog-auditoria-ingreso-corte-cabecera.component.html',
  styleUrls: ['./dialog-auditoria-ingreso-corte-cabecera.component.scss']
})

export class DialogAuditoriaIngresoCorteCabeceraComponent implements OnInit {

  Cod_Accion = ''
  Co_CodOrdPro = ''
  Cod_Cliente = ''
  Cod_TemCli = ''
  Cod_Present = ''
  Flg_Estado = '0'
  Flg_Estado_Tizado = '1'
  Flg_Estado_Tendido = '1'
  Id_Auditoria = 0
  isButtonDisabled: boolean = true;

  step = 0;
  Titulo = ''
  btnAccionModificar: boolean = false
  num_guiaMascara = [/[0-2]/, /\d/, ':', /[0-5]/, /\d/];

  //dataSendActualizar: any
  dataItemsTizado:any = []
  dataAuditoriaWithTizado:any = []
  dataAuditoriaWithTendido:any = []
  isPanelVisible: boolean = false;

  //lstOptTipoTela:any[] = [];
  lstObsCalidad:any[] = [];

  optResultado: any[] = [
    { id: "1", name: "Si"  },
    { id: "0", name: "No" }
  ];

  optTipoTendido: any[] = [
    { id: "1", name: "Tendido"  },
    { id: "2", name: "Trozado" },
    { id: "3", name: "Bloque estampado" }
  ];

  dataTurno: any[] = [
    { Turno: "1", Des_Turno: "MAÑANA"},
    { Turno: "2", Des_Turno: "NOCHE"},
  ];
  		
  listar_operacionAuditor:   Auditor[] = [];
  filtroOperacionAuditor:    Observable<Auditor[]> | undefined;

  dataItemsNumTendido = []
  dataItemsWithPasos: any

  displayedColumns: string[] = ['Tipo_Tela','Color_Tela'];
  displayedColumns2: string[] = ['Id','Largo','Alto','Cantidad','Acciones'];

  dataSource!: MatTableDataSource<data>;
  dataTendidoSource: MatTableDataSource<NumTendido>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  columnsToDisplay2: string[] = this.displayedColumns2.slice();

  formulario = this.formBuilder.group({
    sOCorte: ['', Validators.required],
    sPartida:[''],
    sOp: [''],
    sCliente: [''],
    sEstilo: [''],
    sTemporada: [''],
    sColor: [''],
    sTipoPrenda: [''],
    sTipoTela: [''],
    sFechaHoraIngreso: [''],
    sNomAuditor: ['', Validators.required],
    sEncogLargo: [''],
    sEncogAncho: [''],
    sCodigoMolde: [''],
    sObservacionTizado: [''],
    sCodAuditor: ['', Validators.required],
    sTurno: ['', Validators.required],
    sPeriodoReposoInicio:[''],
    sPeriodoReposoFinal:[''],
    sTiempoReposo:[''],
    sTipoTendido: ['1'],
    sObservacionTendido: [''],
    sLargo:[''],
    sAlto: [''],
    sCantidad: ['']
  });

  constructor(
    private formBuilder: FormBuilder, 
    private matSnackBar: MatSnackBar, 
    private SpinnerService: NgxSpinnerService, 
    private datepipe: DatePipe,
    private auditoriaProcesoCorteService: AuditoriaProcesoCorteService,
    public dialogRef: MatDialogRef<DialogAuditoriaIngresoCorteCabeceraComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: data
  ){
    this.dataSource = new MatTableDataSource();
    this.dataTendidoSource = new MatTableDataSource();
  }


  ngOnInit(): void { 
    console.log(this.data)
    this.formulario.controls['sFechaHoraIngreso'].disable()
    this.formulario.controls['sPartida'].disable()
    this.formulario.controls['sOp'].disable()
    this.formulario.controls['sCliente'].disable()
    this.formulario.controls['sEstilo'].disable()
    this.formulario.controls['sTemporada'].disable()
    this.formulario.controls['sColor'].disable()
    this.formulario.controls['sTipoPrenda'].disable() 
    this.formulario.controls['sEncogLargo'].disable() 
    this.formulario.controls['sEncogAncho'].disable() 
    this.formulario.controls['sCodigoMolde'].disable() 
    this.fechaHoraDefaultIngreso()
    this.obtenerInformacion()
  }

  fechaHoraDefaultIngreso(){ 
    let fechaIni = new Date();
    this.formulario.patchValue({ sFechaHoraIngreso: this.datepipe.transform(fechaIni, 'yyyy-MM-ddTHH:mm')})
  }

  buscarxOCorte(){

    this.Co_CodOrdPro = this.formulario.get('sOCorte')?.value
    if(this.Co_CodOrdPro.length == 5){
      this.Cod_Accion   = 'O'
      this.SpinnerService.show();

      this.auditoriaProcesoCorteService.MantenimientoAuditoriaCorteComplemento(this.Cod_Accion, this.Co_CodOrdPro, '','', this.Id_Auditoria)
        .subscribe((result: any) => {
          if(result.length > 0){
            this.dataSource = result;

            this.formulario.controls['sPartida'].setValue(result[0].Cod_OrdProv);
            this.formulario.controls['sOp'].setValue(result[0].Cod_OrdPro);
            this.formulario.controls['sCliente'].setValue(result[0].Cliente);
            this.formulario.controls['sEstilo'].setValue(result[0].Estilo_Cliente);
            this.formulario.controls['sTemporada'].setValue(result[0].Temporada);
            this.formulario.controls['sColor'].setValue(result[0].Presentacion);
            this.formulario.controls['sTipoPrenda'].setValue(result[0].Tipo_Prenda);
            this.formulario.controls['sCodigoMolde'].setValue(result[0].Codigo_Molde);
            this.formulario.controls['sEncogLargo'].setValue(result[0].PORC_ENCOGIM_MOLDE_H);
            this.formulario.controls['sEncogAncho'].setValue(result[0].PORC_ENCOGIM_MOLDE_T);

            this.Cod_Cliente = result[0].Cod_Cliente;
            this.Cod_TemCli = result[0].Cod_TemCli;
            this.Cod_Present= result[0].Cod_Present;  

            this.auditoriaProcesoCorteService.MantenimientoAuditoriaIngresoCorteObsCalidad(this.Co_CodOrdPro)
              .subscribe((res: any) => {
                this.lstObsCalidad = res;
                console.log(this.lstObsCalidad)
              });

            this.changeDataTizado();
            this.changeDataTendido();
            this.isPanelVisible = true;
          }else{
            this.matSnackBar.open('La O/CORTE no existe...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            this.isPanelVisible = false
          }
          this.SpinnerService.hide()
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }else{
    }
  }

  
  obtenerInformacion(){
    this.definirTitulo()
    this.CargarOperacionAuditor()
  }
 
 
  definirTitulo(){
    console.log("definirTitulo")
    console.log(this.data)
    if(this.data.Id_Auditoria == undefined){//Boton nuevo pulsado
      this.Titulo  = 'Registro Auditoria Corte'
    }else{
      
      this.Titulo    = 'Modificar Auditoria Corte ' + this.data.Id_Auditoria
      this.formulario.controls['sOCorte'].disable()
      this.Co_CodOrdPro = this.data.Co_CodOrdPro
      this.Cod_Cliente = this.data.Cod_Cliente
      this.Cod_TemCli = this.data.Cod_TemCli
      this.Cod_Present = this.data.Cod_Present
      this.Flg_Estado_Tizado = this.data.Flg_Estado_Tizado
      this.Flg_Estado_Tendido = this.data.Flg_Estado_Tendido
      this.Flg_Estado = this.data.Flg_Estado
      this.Id_Auditoria = this.data.Id_Auditoria

      this.isButtonDisabled = this.data.Flg_Estado == '0' ? false : true;
      this.btnAccionModificar = true;
      this.formulario.patchValue({
        sOCorte: this.data.Co_CodOrdPro,
        sTipoTela: this.data.Des_Tela,
        sNomAuditor: this.data.Nom_Auditor,
        sCodAuditor: this.data.Cod_Auditor,
        sTurno: this.data.Turno,
        sFechaHoraIngreso: this.datepipe.transform(this.data.Fecha_Ingreso['date'], 'yyyy-MM-ddTHH:mm')
     });
     this.buscarxOCorte()
    }
  }

  ModificarHoja(){

    this.Cod_Accion   = 'U'
    let Fecha_Ingreso = this.formulario.get('sFechaHoraIngreso').value
    let Flg_Estado_Tizado_Actual = this.Flg_Estado_Tizado
    let Flg_Estado_Tendido_Actual = this.Flg_Estado_Tendido
    let Flg_Estado_Inicial = this.Flg_Estado

    let fIni = this.formulario.get('sPeriodoReposoInicio').value
    let fFin = this.formulario.get('sPeriodoReposoFinal').value

    let FechHoraInicio = _moment(fIni).isValid() ? _moment(fIni.valueOf()).format() : ''; //new Date(fIni)
    let FechHoraFinal = _moment(fFin).isValid() ? _moment(fFin.valueOf()).format() : '';  //new Date(fFin)
    let TiempoReposoMesa = this.formulario.get('sTiempoReposo').value
    let TipoTendido = this.formulario.get('sTipoTendido').value
    let ObservacionTendido = this.formulario.get('sObservacionTendido').value   

    this.SpinnerService.show();
    this.auditoriaProcesoCorteService.MantenimientoAuditoriaIngresoCorte(this.Cod_Accion, this.Id_Auditoria, this.Co_CodOrdPro, this.formulario.get('sCodAuditor')?.value, this.formulario.get('sTurno')?.value, Flg_Estado_Tizado_Actual, Flg_Estado_Tendido_Actual, Flg_Estado_Inicial, Fecha_Ingreso, Fecha_Ingreso)
      .subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK'){
          this.dataAuditoriaWithTizado = {'IdAuditoria': this.Id_Auditoria, 'Accion':'G','dataTizado':this.dataItemsTizado}

          this.dataAuditoriaWithTendido = {
            'IdAuditoria': this.Id_Auditoria, 
            'Accion':'G',
            'FechaHoraInicio': FechHoraInicio, 
            'FechaHoraFinal': FechHoraFinal,
            'TiempoReposoMesa': TiempoReposoMesa,
            'TipoTendido': TipoTendido,
            'ObservacionTendido': ObservacionTendido,
            'dataNumTendidos':this.dataItemsNumTendido
          }

          this.enviarDataAuditoriaWithTizado()
          //this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  RegistrarHoja() {
    if (this.formulario.valid) {
      this.Cod_Accion   = 'I'
      let Fecha_Ingreso = this.formulario.get('sFechaHoraIngreso').value
      let Flg_Estado_Tizado_Inicial = this.Flg_Estado_Tizado
      let Flg_Estado_Tendido_Inicial = this.Flg_Estado_Tendido
      let Flg_Estado_Inicial = this.Flg_Estado

      let fIni = this.formulario.get('sPeriodoReposoInicio').value
      let fFin = this.formulario.get('sPeriodoReposoFinal').value

      let FechHoraInicio = _moment(fIni).isValid() ? _moment(fIni.valueOf()).format() : ''; //new Date(fIni)
      let FechHoraFinal = _moment(fFin).isValid() ? _moment(fFin.valueOf()).format() : '';  //new Date(fFin)
      let TiempoReposoMesa = this.formulario.get('sTiempoReposo').value
      let TipoTendido = this.formulario.get('sTipoTendido').value
      let ObservacionTendido = this.formulario.get('sObservacionTendido').value
      
      this.SpinnerService.show();
      this.auditoriaProcesoCorteService.MantenimientoAuditoriaIngresoCorte(this.Cod_Accion, this.Id_Auditoria, this.Co_CodOrdPro, this.formulario.get('sCodAuditor')?.value, this.formulario.get('sTurno')?.value, Flg_Estado_Tizado_Inicial, Flg_Estado_Tendido_Inicial, Flg_Estado_Inicial, Fecha_Ingreso, Fecha_Ingreso)
        .subscribe(
        (result: any) => {
          //console.log(result)
          if (result[0].Respuesta == 'OK'){
            this.dataAuditoriaWithTizado = {'IdAuditoria': result[0].Id_Auditoria, 'Accion':'G','dataTizado':this.dataItemsTizado}

            this.dataAuditoriaWithTendido = {
              'IdAuditoria': result[0].Id_Auditoria, 
              'Accion':'G',
              'FechaHoraInicio': FechHoraInicio, 
              'FechaHoraFinal': FechHoraFinal,
              'TiempoReposoMesa': TiempoReposoMesa,
              'TipoTendido': TipoTendido,
              'ObservacionTendido': ObservacionTendido,
              'dataNumTendidos':this.dataItemsNumTendido}
            
            this.enviarDataAuditoriaWithTizado()
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

  CargarOperacionAuditor(){
    this.Cod_Accion   = 'A'
    this.SpinnerService.show();
    this.auditoriaProcesoCorteService.MantenimientoAuditoriaCorteComplemento(this.Cod_Accion, this.Co_CodOrdPro, '','', this.Id_Auditoria)
      .subscribe((result: any) => {
        if(result.length > 0){
          this.listar_operacionAuditor = result
          this.RecargarOperacionAuditor()
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  RecargarOperacionAuditor(){
    this.filtroOperacionAuditor = this.formulario.controls['sNomAuditor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionAuditor(option) : this.listar_operacionAuditor.slice())),
    );
  }

  private _filterOperacionAuditor(value: string): Auditor[] {
    const filterValue = value.toLowerCase();
    return this.listar_operacionAuditor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }

  changeDataTizado(){
    console.log("changeDataTizado")
    this.Cod_Accion   = 'T'
      this.SpinnerService.show();

      this.auditoriaProcesoCorteService.MantenimientoAuditoriaCorteComplemento(this.Cod_Accion, this.Co_CodOrdPro, '','', this.Id_Auditoria)
        .subscribe((result: any) => {
          if(result.length > 0){
            this.dataItemsTizado = result;
            let datoObs = this.dataItemsTizado[12].Resultado
            this.formulario.controls['sObservacionTizado'].setValue(datoObs)
          }
          this.SpinnerService.hide()
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  changeRadio(event, id, valor) {
    if (event.value == '1') {
      this.dataItemsTizado.forEach(element => {
        if (element.IdItem == id) {       
          if (valor == 'resultado') {
            element.Resultado = '1';
          }
        }
      });

    } else {
      this.dataItemsTizado.forEach(element => {
        if (element.IdItem == id) {
          if (valor == 'resultado') {
            element.Resultado = '0';
          }
        }
      });
    }
  }

  changeCheck(event, id, valor) {
    if (event.checked) {
      this.dataItemsTizado.forEach(element => {
        if (element.IdItem == id) {
          ////estamp, bordad, sublim, result
          if (valor == 'resultado') {
            element.Resultado = '1';
          }
        }
      });
    } else {

      this.dataItemsTizado.forEach(element => {
        if (element.IdItem == id) {
          if (valor == 'resultado') {
            element.Resultado = '0';
          }
        }
      });
    }
  }

  changeObservacionTizado(event){
    this.dataItemsTizado.forEach(element => {
      if (element.IdItem == 13) {
          element.Resultado = event.target.value;
      }
    });
  }

  addNumTendido(){

    let sAlto = this.formulario.get('sAlto').value
    let sLargo = this.formulario.get('sLargo').value
    let sCantidad = this.formulario.get('sCantidad').value
    let sRow = this.dataItemsNumTendido.length + 1;
    if(sAlto!='' && sLargo!='' && sCantidad!=''){
      this.addUniqueTendidoObject(this.dataItemsNumTendido, {
        Id_Tendido: 0,
        Alto: sAlto,
        Largo: sLargo,
        Cantidad: sCantidad,
        nRow: sRow
      })
      this.formulario.controls['sLargo'].setValue('') 
      this.formulario.controls['sAlto'].setValue('') 
      this.formulario.controls['sCantidad'].setValue('')
    }else{
      this.matSnackBar.open('Ingrese datos de tendido', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
  }

  addUniqueTendidoObject(arr: NumTendido[], obj: NumTendido): NumTendido[] {
    //console.log(obj)
    if (!arr.some(item => (item.Alto === obj.Alto && item.Largo === obj.Largo && item.Cantidad === obj.Cantidad))) {
      arr.push(obj);

      if(this.Id_Auditoria === 0){
        this.dataTendidoSource = new MatTableDataSource(arr);
      }else{
        this.Cod_Accion = 'G'
        this.SpinnerService.show();
        this.auditoriaProcesoCorteService.MantenimientoAuditoriaIngresoCorteComplementoTendidoItem(
            this.Cod_Accion,
            this.Id_Auditoria,
            obj.Largo,
            obj.Alto,
            obj.Cantidad,
            obj.Id_Tendido
        ).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              obj.Id_Tendido=result[0].Id_Tendido
              obj.Id_TendidoItem=result[0].Id_TendidoItem
              this.SpinnerService.hide();
              this.dataTendidoSource = new MatTableDataSource(arr);
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.SpinnerService.hide();
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      }
    }
    return arr;
  }

  supItemNumTendido(elemento){
    console.log("elemento")
    console.log(elemento)
    //console.log(this.Id_Auditoria)
    if(this.Id_Auditoria === 0){
      const indice = this.dataItemsNumTendido.findIndex(item => item === elemento)
      this.dataItemsNumTendido.splice(indice, 1)
      this.dataTendidoSource = new MatTableDataSource(this.dataItemsNumTendido);
    }else{
      let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'true') {

          this.Cod_Accion = 'D'
          this.SpinnerService.show();
          this.auditoriaProcesoCorteService.MantenimientoAuditoriaIngresoCorteComplementoTendidoItem(
            this.Cod_Accion,
            this.Id_Auditoria,
            elemento.Largo,
            elemento.Alto,
            elemento.Cantidad,
            elemento.Id_TendidoItem
          ).subscribe(
            (result: any) => {
              console.log(result)
              if (result[0].Respuesta == 'OK') {

                const indice = this.dataItemsNumTendido.findIndex(item => item === elemento)
                this.dataItemsNumTendido.splice(indice, 1)
                this.dataTendidoSource = new MatTableDataSource(this.dataItemsNumTendido);
                this.SpinnerService.hide();
              }
              else {
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                this.SpinnerService.hide();
              }
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
          
        }
      })
    }

  }

  changeDataTendido(){

    this.Cod_Accion   = 'E'
      this.SpinnerService.show();

      this.auditoriaProcesoCorteService.MantenimientoAuditoriaCorteComplemento(this.Cod_Accion, this.Co_CodOrdPro, '', '', this.Id_Auditoria)
        .subscribe((result: any) => {
          //console.log(result)
          if(result.length > 0){
            //this.dataItemsTendido = result;
            if(result[0].NumTendidos > 0){
              this.dataTendidoSource = result;
              this.dataItemsNumTendido = result;
            }

            this.formulario.patchValue({
              sPeriodoReposoInicio: result[0].FechaHoraInicio != null ? this.datepipe.transform(result[0].FechaHoraInicio['date'], 'yyyy-MM-ddTHH:mm'):'',
              sPeriodoReposoFinal: result[0].FechaHoraFinal != null  ? this.datepipe.transform(result[0].FechaHoraFinal['date'], 'yyyy-MM-ddTHH:mm'):'',
              sTiempoReposo: result[0].TiempoReposoMesa,
              sTipoTendido: result[0].TipoTendido,
              sObservacionTendido: result[0].Observacion
            });

          }
          this.SpinnerService.hide()
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  enviarDataAuditoriaWithTizado() {
    this.auditoriaProcesoCorteService.MantenimientoAuditoriaIngresoCorteComplementoTizado(
      this.dataAuditoriaWithTizado
    ).subscribe(
      (result: any) => {
        if (result.msg == 'OK') {
          this.dataAuditoriaWithTizado = [];
          this.enviarDataAuditoriaWithTendido()
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      
  }

  enviarDataAuditoriaWithTendido(){
    this.auditoriaProcesoCorteService.MantenimientoAuditoriaIngresoCorteComplementoTendido(
      this.dataAuditoriaWithTendido
    ).subscribe(
      (result: any) => {
        //console.log(result)
        if (result[0].Respuesta == 'OK') {
          this.dataAuditoriaWithTendido = [];
          this.SpinnerService.hide();
          this.dialogRef.close();
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  changeAprobacion(event, accion) {
    switch (accion) {
      case "TIZ":
        if (event.checked) {
          this.Flg_Estado_Tizado = '1'
        }else{
          this.Flg_Estado_Tizado = '0'
        }
        break;
      default:
      case "TEN":
        if (event.checked) {
          this.Flg_Estado_Tendido = '1'
        }else{
          this.Flg_Estado_Tendido = '0'
        }
        break;
    }

  }

  FinalizarHoja(){
    if(this.Flg_Estado_Tizado == '1' && this.Flg_Estado_Tendido == '1')
      this.Flg_Estado = '1';
    else
      this.Flg_Estado = '2';

    this.ModificarHoja();
  }

  onSeleccionarAuditor(Cod_Auditor: string, Tip_Trabajador: string){
    this.formulario.controls['sCodAuditor'].setValue(Tip_Trabajador + '-' +Cod_Auditor)
  }

  validaTiempoReposo(event){
    let hora = event.target.value;

    console.log(hora)
  }

  
  //Acordion

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  //-

}