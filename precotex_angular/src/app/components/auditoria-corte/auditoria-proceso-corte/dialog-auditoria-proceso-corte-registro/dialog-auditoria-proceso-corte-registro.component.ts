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
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';

interface data {
  Id_Auditoria: number;
  Co_CodOrdPro: string;
  Cod_OrdProv: string;
  Cod_OrdPro: string;
  Cod_EstCli: string;
  Cod_Cliente: string;
  Des_Cliente: string;
  Cod_Present: string;
  Des_Present: string;
  Des_TipPre: string;
  Cod_TemCli: string;
  Nom_TemCli: string;
  Des_Tela: string;
  Encogim_molde_t: number;
  Encogim_molde_h: number;
  Prendas_Prog: number;
  Prendas_Real: number;
  Cod_Auditor: string;
  Nom_Auditor: string;
  Cod_Usuario: string;
  Fecha_Auditoria: string;
  Cod_Maquina: string;
  Par_Velolidad: number;
  Par_Succion: number;
  Par_DistanciaAfilado: number;
  Val_PuntoAnclaje: string;
  Lote: number;
  Muestra: number;
  Turno: string;
  Observacion: string;
  Obs_Defectos: string;
  Flg_Estado_Corte: string;
  Flg_Estado: string;
  Fecha_Registro: string;
  Flg_Estado_Name: string;
}

interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

interface Defecto {
  Id_AuditoriaDefecto?: number,
  id_Auditoria?: number,
  Cod_CompEst?: string;
  Cod_PzaEst?: string;
  Cod_Motivo?: string;
  Tipo?: string;
  Cantidad?: number;
  Des_CompEst?: string;
  Des_PzaEst?: string;
  Des_Motivo?: string;
  nRow?: number;
}

@Component({
  selector: 'app-dialog-auditoria-proceso-corte-registro',
  templateUrl: './dialog-auditoria-proceso-corte-registro.component.html',
  styleUrls: ['./dialog-auditoria-proceso-corte-registro.component.scss']
})
export class DialogAuditoriaProcesoCorteRegistroComponent implements OnInit {

  //Cod_Accion = '';
  Id_Auditoria = 0;
  Co_CodOrdPro = '';
  Flg_Estado = '0';
  Flg_Estado_Corte = '1'
  isButtonDisabled: boolean = true;

  step = 0;
  Titulo = '';
  btnAccionModificar: boolean = false;
  num_guiaMascara = [/[0-2]/, /\d/, ':', /[0-5]/, /\d/];

  dataComplemetos:any = [];
  dataComponentes:any = [];
  dataPiezas:any = [];
  dataDefectos:any = [];
  //isPanelVisible: boolean = false;
  lstObsCalidad:any[] = [];

  lstDefectos: Defecto[] = [];

  optAnclaje: any[] = [
    { id: "1", name: "Si"  },
    { id: "0", name: "No" }
  ];

  optMaquina: any[] = [
    { id: "1", name: "Q80" },
    { id: "2", name: "Q50" },
    { id: "3", name: "Manual" }
  ];

  dataTurno: any[] = [
    { Turno: "1", Des_Turno: "MAÑANA"},
    { Turno: "2", Des_Turno: "NOCHE"},
  ];

  listar_operacionAuditor:   Auditor[] = [];
  filtroOperacionAuditor:    Observable<Auditor[]> | undefined;

  displayedColumns: string[] = ['Tipo_Tela','Color_Tela'];
  displayedColumns2: string[] = ['Des_CompEst','Des_PzaEst','Des_Motivo','Cantidad','Tipo','Acciones'];
  
  dataSource!: MatTableDataSource<data>;
  dataDefectoSource: MatTableDataSource<Defecto>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  columnsToDisplay2: string[] = this.displayedColumns2.slice();

  formulario = this.formBuilder.group({
    sOCorte: ['', Validators.required],
    sPartida:[{value:'', disabled: true}],
    sOp: [{value:'', disabled: true}],
    sCliente: [{value:'', disabled: true}],
    sEstilo: [{value:'', disabled: true}],
    sTemporada: [{value:'', disabled: true}],
    sColor: [{value:'', disabled: true}],
    sTipoPrenda: [{value:'', disabled: true}],
    //sTipoTela: [''],
    sFechaAuditoria: [{value:'', disabled: true}],
    sNomAuditor: ['', Validators.required],
    sEncogLargo: [{value:'', disabled: true}],
    sEncogAncho: [{value:'', disabled: true}],
    sCodigoMolde: [{value:'', disabled: true}],
    sPrendasProg: [{value: 0, disabled: true}],
    sPrendasReal: [{value: 0, disabled: true}],
    sCodAuditor: ['', Validators.required],
    sCodMaquina: [''],
    sParVelolidad: [0],
    sParSuccion: [0],
    sParDistanciaAfilado: [0],
    sValPuntoAnclaje: [''],
    sLote: [0],
    sMuestra: [0],
    sTurno: ['', Validators.required],
    sObservacion: [''],
    sObs_Defectos: [''],
    sFlgEstadoCorte: [''],
    sFlgEstado: [''],
    sCodCompEst: [''],
    sDesCompEst: [''],
    sDesTela: [{value: '', disabled: true}],
    sCodPzaEst: [''],
    sDesPzaEst: [''],
    sCodMotivo: [''],
    sDesMotivo: [{value: '', disabled: true}],
    sCantidad: [0],
    sTipo: ['']
  });

  constructor(
    private formBuilder: FormBuilder, 
    private matSnackBar: MatSnackBar, 
    private SpinnerService: NgxSpinnerService, 
    private datepipe: DatePipe,
    private auditoriaProcesoCorteService: AuditoriaProcesoCorteService,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    public dialogRef: MatDialogRef<DialogAuditoriaProcesoCorteRegistroComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: data
  ) {
    this.dataSource = new MatTableDataSource();
    this.dataDefectoSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.obtenerInformacion()
  }

  obtenerInformacion(){
    this.definirTitulo()
    this.CargarOperacionAuditor()
  }

  definirTitulo(){
    if(this.data.Id_Auditoria == undefined){//Boton nuevo pulsado
      let fechaIni = new Date();
      
      this.Titulo  = 'Registro Auditoria Corte - Proceso'
      this.formulario.patchValue({ sFechaAuditoria: this.datepipe.transform(fechaIni, 'yyyy-MM-ddTHH:mm:ss')})
    }else{
      console.log(this.data)
      this.Titulo    = 'Modificar Auditoria Corte - Proceso ' + this.data.Id_Auditoria
      this.formulario.controls['sOCorte'].disable()
      this.Co_CodOrdPro = this.data.Co_CodOrdPro;
      this.Flg_Estado = this.data.Flg_Estado;
      this.Flg_Estado_Corte = this.data.Flg_Estado_Corte;
      this.Id_Auditoria = this.data.Id_Auditoria;

      this.isButtonDisabled = this.data.Flg_Estado == '0' ? false : true;
      this.btnAccionModificar = true;
      this.formulario.patchValue({
        sOCorte: this.data.Co_CodOrdPro,
        sNomAuditor: this.data.Nom_Auditor,
        sCodAuditor: this.data.Cod_Auditor,
        sFechaAuditoria: this.datepipe.transform(this.data.Fecha_Auditoria['date'], 'yyyy-MM-ddTHH:mm:ss'),
        sCodMaquina: this.data.Cod_Maquina,
        sParVelolidad: this.data.Par_Velolidad,
        sParSuccion: this.data.Par_Succion,
        sParDistanciaAfilado: this.data.Par_DistanciaAfilado,
        sValPuntoAnclaje: this.data.Val_PuntoAnclaje,
        sLote: this.data.Lote,
        sMuestra: this.data.Muestra,
        sTurno: this.data.Turno,
        sObservacion: this.data.Observacion,
        sObs_Defectos: this.data.Obs_Defectos,
        sFlgEstadoCorte: this.data.Flg_Estado_Corte
     });
     this.buscarxOCorte()

    }
  }

  buscarxOCorte(){

    this.Co_CodOrdPro = this.formulario.get('sOCorte')?.value
    if(this.Co_CodOrdPro.length == 5){
      //this.Cod_Accion   = 'O'
      this.SpinnerService.show();

      this.auditoriaProcesoCorteService.MantenimientoAuditoriaCorteComplemento('O', this.Co_CodOrdPro, '','', this.Id_Auditoria)
        .subscribe((result: any) => {
          //console.log(result[0])
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
            this.formulario.controls['sPrendasProg'].setValue(result[0].Prendas_Prog);
            this.formulario.controls['sPrendasReal'].setValue(result[0].Prendas_Real);
            this.formulario.controls['sEncogLargo'].setValue(result[0].PORC_ENCOGIM_MOLDE_H);
            this.formulario.controls['sEncogAncho'].setValue(result[0].PORC_ENCOGIM_MOLDE_T);

            this.auditoriaProcesoCorteService.MantenimientoAuditoriaCorteComplemento('C', '', result[0].Cod_EstPro, result[0].Cod_Version, this.Id_Auditoria)
              .subscribe((res: any) => {
                this.dataComplemetos = res;
                
                let hash = {};
                this.dataComponentes = res.map(obj => ({Cod_CompEst: obj.Cod_CompEst, Des_CompEst: obj.Des_CompEst}))
                  .filter(function(current) {
                    var exists = !hash[current.Des_CompEst];
                    hash[current.Des_CompEst] = true;
                    return exists;
                  });
              });

            this.auditoriaProcesoCorteService.MantenimientoAuditoriaIngresoCorteObsCalidad(this.Co_CodOrdPro)
              .subscribe((res: any) => {
                this.lstObsCalidad = res;
              });
            
            this.auditoriaProcesoCorteService.MantenimientoAuditoriaCorteComplemento('D', '', '', '', this.Id_Auditoria)
              .subscribe((res: any) => {
                if(res.length > 0){
                  this.lstDefectos = res;
                  this.dataDefectoSource = new MatTableDataSource(this.lstDefectos);  
                }
                //console.log(this.dataComponentes)
              });

            //---this.changeDataTizado();
            //--this.changeDataTendido();
            //this.estadoFinalizar();
            //this.isPanelVisible = true;
          }else{
            this.matSnackBar.open('La O/CORTE no existe...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            //this.lstOptTipoTela = []
            //this.isPanelVisible = false
          }
          this.SpinnerService.hide()
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }else{
      //this.lstOptTipoTela = []
    }
  }

  CargarOperacionAuditor(){
    //this.Cod_Accion   = 'A'
    this.SpinnerService.show();
    this.auditoriaProcesoCorteService.MantenimientoAuditoriaCorteComplemento('A', this.Co_CodOrdPro, '','', this.Id_Auditoria)
      .subscribe((result: any) => {
        if(result.length > 0){
          this.listar_operacionAuditor = result
          this.RecargarOperacionAuditor()
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }));
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

  onSelectComponente(Cod_CompEst: string, Des_CompEst: string){
    this.dataPiezas = this.dataComplemetos.filter(d => d.Cod_CompEst == Cod_CompEst).map(obj => ({Cod_PzaEst: obj.Cod_PzaEst, Des_PzaEst: obj.Des_PzaEst, Des_Tela: obj.Des_Tela}));
    //console.log(this.dataPiezas)
    if(this.dataPiezas.length == 1){
      this.formulario.controls['sCodPzaEst'].setValue(this.dataPiezas[0].Cod_PzaEst);
      this.formulario.controls['sDesTela'].setValue(this.dataPiezas[0].Des_Tela);
      this.formulario.controls['sDesPzaEst'].setValue(this.dataPiezas[0].Des_PzaEst);
    } else {
      this.formulario.controls['sDesTela'].setValue('');
    }

    this.formulario.controls['sDesCompEst'].setValue(Des_CompEst);    
  }

  onSelectPieza(Des_Tela: string, Des_PzaEst: string){
    this.formulario.controls['sDesTela'].setValue(Des_Tela);
    this.formulario.controls['sDesPzaEst'].setValue(Des_PzaEst);
  }

  onFinalizarHoja(){
    if(this.Flg_Estado_Corte == '1') //  && this.lstDefectos.length == 0
      this.Flg_Estado = '1';
    else
      this.Flg_Estado = '2';

    this.onGuardarHoja('U');
  }

  onGuardarHoja(accion: string){
    if(this.formulario.valid){
      this.SpinnerService.show();
      this.auditoriaProcesoCorteService.MantenimientoAuditoriaProcesoCorte(accion,
        this.Id_Auditoria,
        this.formulario.get('sOCorte').value,
        this.formulario.get('sCodAuditor').value,
        this.formulario.get('sFechaAuditoria').value,
        this.formulario.get('sFechaAuditoria').value,
        this.formulario.get('sCodMaquina').value,
        this.formulario.get('sParVelolidad').value,
        this.formulario.get('sParSuccion').value,
        this.formulario.get('sParDistanciaAfilado').value,
        this.formulario.get('sValPuntoAnclaje').value,
        this.formulario.get('sLote').value,
        this.formulario.get('sMuestra').value,
        this.formulario.get('sTurno').value,
        this.formulario.get('sObservacion').value,
        this.formulario.get('sObs_Defectos').value,
        this.Flg_Estado_Corte,
        this.Flg_Estado
      ).subscribe((result) => {
        if(result[0].Respuesta == 'OK'){
          this.Id_Auditoria = result[0].Id_Auditoria;

          if(this.lstDefectos.length > 0){
            this.lstDefectos.forEach((element) => {
              console.log("grabar")
              console.log(element.Cod_Motivo)
              this.auditoriaProcesoCorteService.MantenimientoAuditoriaProcesoCorteDefecto('G',
                element.Id_AuditoriaDefecto,
                this.Id_Auditoria,
                element.Cod_CompEst,
                element.Cod_PzaEst,
                element.Cod_Motivo,
                element.Tipo,
                element.Cantidad
              ).subscribe((res) => {
                console.log(res)
              });
            });
            this.dialogRef.close();
          } else{
            this.dialogRef.close();
          }
        } else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        this.SpinnerService.hide();
      },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      );

    }
  }

  onRegistrarDefecto(){
    let defecto: Defecto = {};
    let codCompEst = this.formulario.get('sCodCompEst').value;
    let codPzaEst = this.formulario.get('sCodPzaEst').value;
    let codMotivo = this.formulario.get('sCodMotivo').value;
    let desMotivo = this.formulario.get('sDesMotivo').value;
    let cantidad = this.formulario.get('sCantidad').value;
    let tipo = this.formulario.get('sTipo').value;

    if(codCompEst!='' && codPzaEst!='' && codMotivo!='' && desMotivo!='' && cantidad!=0 && tipo!=''){
      defecto.Id_AuditoriaDefecto = 0;
      defecto.id_Auditoria = this.Id_Auditoria;
      defecto.Cod_CompEst = codCompEst;
      defecto.Des_CompEst = this.formulario.get('sDesCompEst').value;
      defecto.Cod_PzaEst = codPzaEst;
      defecto.Des_PzaEst = this.formulario.get('sDesPzaEst').value;
      defecto.Cod_Motivo = codMotivo;
      defecto.Des_Motivo = this.formulario.get('sDesMotivo').value;
      defecto.Cantidad = cantidad;
      defecto.Tipo = tipo;

      console.log(defecto)

      //if(this.Id_Auditoria == 0){
        this.lstDefectos.push(defecto);
        this.dataDefectoSource = new MatTableDataSource(this.lstDefectos);  
      //} else {

      //}

      //this.dataDefectos.push(defecto);
      //this.dataDefectoSource._updateChangeSubscription;

      this.formulario.controls['sCodCompEst'].setValue('');
      this.formulario.controls['sCodPzaEst'].setValue('');
      this.formulario.controls['sCodMotivo'].setValue('');
      this.formulario.controls['sCantidad'].setValue(0);
      this.formulario.controls['sTipo'].setValue('');
      this.formulario.controls['sDesTela'].setValue('');
      this.formulario.controls['sDesMotivo'].setValue('');

    }
  }

  onEliminarDefecto(defecto: Defecto){
    if(defecto.Id_AuditoriaDefecto == 0){
      const indice = this.lstDefectos.findIndex(item => item === defecto)
      this.lstDefectos.splice(indice, 1)
      this.dataDefectoSource = new MatTableDataSource(this.lstDefectos);
    } else {
      let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'true') {
          this.auditoriaProcesoCorteService.MantenimientoAuditoriaProcesoCorteDefecto('D',
            defecto.Id_AuditoriaDefecto,
            this.Id_Auditoria,
            defecto.Cod_CompEst,
            defecto.Cod_PzaEst,
            defecto.Cod_Motivo,
            defecto.Tipo,
            defecto.Cantidad
          ).subscribe((res) => {
            console.log(res)
            if (res[0].Respuesta == 'OK') {

              const indice = this.lstDefectos.findIndex(item => item === defecto)
              this.lstDefectos.splice(indice, 1)
              this.dataDefectoSource = new MatTableDataSource(this.lstDefectos);
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

  onSeleccionarAuditor(Cod_Auditor: string, Tip_Trabajador: string){
    this.formulario.controls['sCodAuditor'].setValue(Tip_Trabajador + '-' +Cod_Auditor)
  }

  changeAprobacion(event) {
    if (event.checked) {
      this.Flg_Estado_Corte = '1'
    }else{
      this.Flg_Estado_Corte = '0'
    }

  }

  onCompararLoteConMuestra(){
    let lote = this.formulario.get('sLote')?.value;
    this.formulario.controls['sMuestra'].setValue(0);

    if(lote != undefined){
      if(lote.toLocaleString().length > 0){
        this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento('M', '', '',  '', lote, '')
          .subscribe((result: any) => {
            if(result.length > 0){
            this.formulario.controls['sMuestra'].setValue(result[0].Tamano_Muestro);
          }else{
            this.formulario.controls['sMuestra'].setValue(0);
            this.matSnackBar.open('No hay tamaño de muestra para esa cantidad de lote...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        );
      }
    }
  }

  onBuscarMotivo(){
    let codMotivo = this.formulario.get('sCodMotivo')?.value
    if(codMotivo.length > 0 ){
      if(codMotivo.length <= 3){
        this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento('B', '', '', '', 0, codMotivo)
          .subscribe((result: any) => {
            if(result.length > 0){
            console.log(result)
            this.formulario.controls['sCodMotivo'].setValue(result[0].Cod_Motivo)
            this.formulario.controls['sDesMotivo'].setValue(result[0].Descripcion)
            console.log(result[0].Cod_Motivo)
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        );
      } else {
        this.formulario.controls['sDesMotivo'].setValue('')
      }
    }
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
