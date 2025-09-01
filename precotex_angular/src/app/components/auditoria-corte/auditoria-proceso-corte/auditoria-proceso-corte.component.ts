import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";

import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaProcesoCorteService } from 'src/app/services/auditoria-proceso-corte.service';
import { ExceljsProdProArtesService } from 'src/app/services/exceljsProdProdArtes.service';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';

import { DialogAuditoriaProcesoCorteRegistroComponent } from './dialog-auditoria-proceso-corte-registro/dialog-auditoria-proceso-corte-registro.component';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';
import { DialogConfirmacion2Component} from 'src/app/components/dialogs/dialog-confirmacion2/dialog-confirmacion2.component';

interface data_det {
  Id_Auditoria?: number;
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
  Des_Tela?: string;
  Encogim_molde_t?: number;
  Encogim_molde_h?: number;
  Cod_Auditor?: string;
  Nom_Auditor?: string;
  Cod_Usuario?: string;
  Cod_Maquina?: string;
  Par_Velolidad?: number;
  Par_Succion?: number;
  Par_DistanciaAfilado?: number;
  Val_PuntoAnclaje?: string;
  Turno?: string;
  Des_Turno?: string;
  Fecha_Auditoria?: string;
  Flg_Estado?: string;
  Fecha_Registro?: string;
  Flg_Estado_Name?: string;
  Obs_Defectos?: string;
  Lote?: number;
  Muestra?: number;
  Codigo_Molde?: string;
  Obs_Ate?: string;
  Tip_corte?: string;
  Observacion?: string;
  Des_CompEst?: string;
  Des_PzaEst?: string;
  Des_Motivo?: string;
  Cantidad?: number;
  Tipo?: string;
}

@Component({
  selector: 'app-auditoria-proceso-corte',
  templateUrl: './auditoria-proceso-corte.component.html',
  styleUrls: ['./auditoria-proceso-corte.component.scss']
})
export class AuditoriaProcesoCorteComponent implements OnInit {

  //Cod_Accion = ''
  Cod_OrdPro=''
  dataForExcel:Array<any> = [];
  ll_soloVer: boolean = false;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  formulario = this.formBuilder.group({
    sOCorte:      ['']
  })

  dataSource: MatTableDataSource<data_det>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns_cab: string[] = [
    'Id_Auditoria',
    'Co_CodOrdPro',
    'Cod_OrdProv',
    'Des_Cliente',
    'Cod_EstCli',
    'Nom_TemCli',
    'Des_Present',
    'Des_TipPre',
    'Des_Tela',
    'Flg_Estado_Name',
    'Nom_Auditor',
    'Acciones'
  ];

  columnsToDisplay: string[] = this.displayedColumns_cab.slice();

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private datepipe: DatePipe,
    private spinnerService: NgxSpinnerService,
    private auditoriaProcesoCorteService: AuditoriaProcesoCorteService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    private exceljsService:ExceljsProdProArtesService)
    {
      this.dataSource = new MatTableDataSource();
    }

  ngOnInit(): void {
    this.validarCRUDUsuario(201);
    this.onListarAuditoriaCorte();
  }

  onListarAuditoriaCorte(){
    this.spinnerService.show();
    //this.Cod_Accion = 'L'
    this.auditoriaProcesoCorteService.MantenimientoAuditoriaProcesoCorte('L', 0, this.formulario.get('sOCorte')?.value, '', this.datepipe.transform(this.range.get('start')?.value, 'yyyy-MM-ddTHH:mm:ss'), this.datepipe.transform(this.range.get('end')?.value, 'yyyy-MM-ddTHH:mm:ss'), '', 0, 0, 0, '', 0, 0, '', '', '', '', '')
      .subscribe((res: any) => {
        //console.log(res);
        this.spinnerService.hide();
        if (res.length > 0) {
          //this.dataSource.data = res;

          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        } else {
          this.dataSource.data = [];
          this.matSnackBar.open('No se encontraron registros.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
    }, ((err: HttpErrorResponse) => {
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      this.dataSource.data = [];
      this.spinnerService.hide();
    }))
  }

  onAgregarRegistro(){
    let dialogRef = this.dialog.open(DialogAuditoriaProcesoCorteRegistroComponent, {
      disableClose: true,
      maxWidth: "1150px", //-'60vw',
      maxHeight: "690px", //-'70vh',
      height: '100%',
      width: '100%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onListarAuditoriaCorte()
    })
  }

  onEditarRegistro(data_det: data_det){
    let dialogRef = this.dialog.open(DialogAuditoriaProcesoCorteRegistroComponent, {
        disableClose: true,
        maxWidth: "1150px", //-'60vw',
        maxHeight: "690px", //-'70vh',
        height: '100%',
        width: '100%',
        data: data_det
      });
    
    dialogRef.afterClosed().subscribe(result => {
      this.onListarAuditoriaCorte()
    })
  }

  onEliminarRegistro(data_det: data_det){

    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.spinnerService.show();

        this.auditoriaProcesoCorteService.MantenimientoAuditoriaProcesoCorte('D', data_det.Id_Auditoria, this.formulario.get('sOCorte')?.value, '', this.datepipe.transform(this.range.get('start')?.value, 'yyyy-MM-ddTHH:mm:ss'), this.datepipe.transform(this.range.get('end')?.value, 'yyyy-MM-ddTHH:mm:ss'), '', 0, 0, 0, '', 0, 0, '', '', '', '', '')
          .subscribe((result: any) => {
            if (result.length > 0) {
              if(result[0].Respuesta == "OK"){
                this.onListarAuditoriaCorte();
                this.spinnerService.hide();
              } else{
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                this.spinnerService.hide();
              }
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }));
      }
    });
  }

  onEnviarRegistro(data_det: data_det){

    let Fecha = new Date();
    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Desea enviar la auditoria " + data_det.Id_Auditoria + " a Auditoria Final?" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.spinnerService.show();

        this.auditoriaProcesoCorteService.MantenimientoAuditoriaProcesoCorte('E', data_det.Id_Auditoria, data_det.Co_CodOrdPro, data_det.Cod_Auditor, this.datepipe.transform(Fecha, 'yyyy-MM-ddTHH:mm:ss'), this.datepipe.transform(Fecha, 'yyyy-MM-ddTHH:mm:ss'), '', 0, 0, 0, '', 0, 0, '', '', '', '1', '0')
          .subscribe((result: any) => {
            if (result.length > 0) {
              this.spinnerService.hide();

              if(result[0].Respuesta == "OK"){
                this.matSnackBar.open("Registro satisfactorio en Auditoria Corte - Final ...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              } else{
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })                
              }
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }));

      }
    });

  }

  onReprocesarRegistro(data_det: data_det){
    let Fecha = new Date();
    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Desea reprocesar la auditoria " + data_det.Id_Auditoria + "?" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.spinnerService.show();

        this.auditoriaProcesoCorteService.MantenimientoAuditoriaProcesoCorte('I', data_det.Id_Auditoria, data_det.Co_CodOrdPro, data_det.Cod_Auditor, this.datepipe.transform(Fecha, 'yyyy-MM-ddTHH:mm:ss'), this.datepipe.transform(Fecha, 'yyyy-MM-ddTHH:mm:ss'), data_det.Cod_Maquina, data_det.Par_Velolidad, data_det.Par_Succion, data_det.Par_DistanciaAfilado, data_det.Val_PuntoAnclaje, data_det.Lote, data_det.Muestra, '', '', '', '1', '0')
          .subscribe((result: any) => {
            if (result.length > 0) {
              if(result[0].Respuesta == "OK"){
                this.onListarAuditoriaCorte();
                this.spinnerService.hide();
              } else{
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                this.spinnerService.hide();
              }
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }));

      }
    });
  }

  onGenerarReporteAuditoria(){

    this.spinnerService.show();
    this.auditoriaProcesoCorteService.MantenimientoAuditoriaProcesoCorte('X', 0, this.formulario.get('sOCorte')?.value, '', this.datepipe.transform(this.range.get('start')?.value, 'yyyy-MM-ddTHH:mm:ss'), this.datepipe.transform(this.range.get('end')?.value, 'yyyy-MM-ddTHH:mm:ss'), '', 0, 0, 0, '', 0, 0, '', '', '', '', '')
      .subscribe((res: any) => {
        //console.log(res);
        this.spinnerService.hide();
        this.dataForExcel = [];

        if (res.length > 0) {
          let dataX: data_det[] = res;
          let dataReporte: data_det[] = [];
          
          dataX.forEach((row: any) => {
            let data: data_det = {};
    
            data.Id_Auditoria = row.Id_Auditoria;
            data.Fecha_Auditoria = this.datepipe.transform(row.Fecha_Auditoria.date, 'dd-MM-yyyy'); //row.Fecha_Auditoria.date;
            data.Turno = row.Des_Turno;
            data.Cod_OrdProv = row.Cod_OrdProv;
            data.Co_CodOrdPro = row.Co_CodOrdPro;
            data.Cod_OrdPro = row.Cod_OrdPro;
            data.Des_Cliente = row.Des_Cliente;
            data.Cod_EstCli = row.Cod_EstCli;
            data.Nom_TemCli = row.Nom_TemCli;
            data.Codigo_Molde = row.Codigo_Molde;
            data.Des_Present = row.Des_Present;
            data.Des_TipPre = row.Des_TipPre;
            data.Des_Tela = row.Des_Tela;
            data.Obs_Ate = row.Obs_Ate;
            data.Flg_Estado_Name = row.Flg_Estado_Name;
            data.Tip_corte = row.Tip_corte;
            data.Par_Velolidad = row.Par_Velolidad;
            data.Par_Succion = row.Par_Succion;
            data.Par_DistanciaAfilado = row.Par_DistanciaAfilado;
            data.Val_PuntoAnclaje = row.Val_PuntoAnclaje;
            data.Observacion = row.Observacion;
            data.Lote = row.Lote;
            data.Muestra = row.Muestra;
            data.Des_CompEst = row.Des_CompEst;
            data.Des_PzaEst = row.Des_PzaEst;
            data.Des_Motivo = row.Des_Motivo;
            data.Cantidad = row.Cantidad;
            data.Tipo = row.Tipo;
            data.Obs_Defectos = row.Obs_Defectos;
            data.Nom_Auditor = row.Nom_Auditor;
            dataReporte.push(data)
    
            //this.dataForExcel.push(Object.values(row))
          })
    
          dataReporte.forEach((row: any) => {
            this.dataForExcel.push(Object.values(row))
          })
    
          let reportData = {
            title: 'REPORTE AUDITORIA CORTE - PROCESO',
            data: this.dataForExcel,
            //headers: Object.keys(this.dataSource.data[0])
            headers: Object.keys(dataReporte[0])
          }
    
          this.exceljsService.exportExcel(reportData);
          //this.dataSource.data = [];

        } else {
          this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
    }, ((err: HttpErrorResponse) => {
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      this.spinnerService.hide();
    }));

  }

  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    let fecha = new Date()
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;

        if(crud.length > 0){
          this.ll_soloVer = crud[0].Flg_Consultar == 1 ? true : false;
        }

        //this.onListarAuditoriaCorte();  
      });
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

}
