import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from "@angular/common";
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { ExceljsService } from 'src/app/services/exceljs.service';

import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';

import { DialogProgramacionAuditoriaMotivoComponent } from './dialog-programacion-auditoria-motivo/dialog-programacion-auditoria-motivo.component';
import { DialogProgramacionAuditoriaReprogamaComponent } from './dialog-programacion-auditoria-reprogama/dialog-programacion-auditoria-reprogama.component';

interface data_det{
  Id_Auditoria?: number;
  Id_Auditoria_Op?: number;
  Fecha_Auditoria?: string;
  Fecha_Programacion?: string;
  Id_Motivo?: string;
  Cod_OrdPro?: string;
  Cod_Present?: string;
  Des_Present?: string;
  Cod_EstPro?: string;
  Cod_TemCli?: string;
  Cod_Version?: string;
  Cod_Auditor?: string;
  Cod_Cliente?: string;
  Nom_Cliente?: string;
  Cod_EstCli?: string;
  Nom_TemCli?: string;
  Flg_Estado?: string;
  Des_Estado?: string;
  Flg_Estado_2?: string;
  Des_Estado_2?: string;
  Nom_Auditor?: string;
  Id_Reprogramacion?: number;
  Fecha_Registro?: string;
  Fec_Auditoria?: string;
  Fec_Programacion?: string;
  Des_Motivo?: string;
  Cod_Usuario?: string;
  Fec_Empaque?: string;
  Est_Auditoria?: string;
  Est_Empaque?: string;
  Accion?: string;
}

@Component({
  selector: 'app-programacion-auditoria-seguimiento',
  templateUrl: './programacion-auditoria-seguimiento.component.html',
  styleUrls: ['./programacion-auditoria-seguimiento.component.scss']
})
export class ProgramacionAuditoriaSeguimientoComponent implements OnInit {

  dataForExcel = [];
  dataReporteAuditoria: any[] = [];
  displayedColumns: string[] = ['Id_Auditoria_Op','Fec_Programacion','Nom_Cliente','Cod_EstCli','Cod_TemCli','OPs','Fec_Auditoria','Des_Estado','Fec_Empaque','Des_Estado_2','Des_Motivo','Nom_Auditor','Acciones']
  dataSource: MatTableDataSource<data_det>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formulario = this.formBuilder.group({
    Cod_Cliente: [''],
    Cod_TemCli: [''],
    Cod_EstCli: [''],
    Cod_OrdPro: [''] 
  });

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  flg_Reprogramar: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    public dialog: MatDialog,
    private datepipe: DatePipe,
    private exceljsService: ExceljsService,
    private spinnerService: NgxSpinnerService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.onListarProgramacionAuditoria();
    // 207 - Seguimiento de Auditorias
    this.validarCRUDUsuario(207);
  }
  
  onListarProgramacionAuditoria(){
    this.spinnerService.show();

    const formData = new FormData();
    formData.append('Accion', 'L');
    formData.append('Id_Auditoria_Op', '0');
    formData.append('Id_Auditoria', '0');
    formData.append('Fecha_Programacion', '');
    formData.append('Fecha_Auditoria', '');
    formData.append('Fecha_Empaque', '');
    formData.append('Cod_EstCli', this.formulario.get('Cod_EstCli')?.value);
    formData.append('Cod_OrdPro', this.formulario.get('Cod_OrdPro')?.value);
    formData.append('Cod_Present', '0');
    formData.append('Flg_Estado', '');
    formData.append('Flg_Estado_2', '');
    formData.append('Id_Motivo', '0');
    formData.append('Cod_Cliente', this.formulario.get('Cod_Cliente')?.value);
    formData.append('Cod_EstPro', '');
    formData.append('Cod_TemCli', this.formulario.get('Cod_TemCli')?.value);
    formData.append('Cod_Auditor', GlobalVariable.vtiptra.trim().concat("-").concat(GlobalVariable.vcodtra.trim()));
    formData.append('Fecha_Registro', this.range.get('start')?.value ? this.datepipe.transform(this.range.get('start')?.value, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Fecha_Registro2', this.range.get('end')?.value ? this.datepipe.transform(this.range.get('end')?.value, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    this.auditoriaAcabadosService.MantenimientoProgramacionAuditoriaOp(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          console.log(result)
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {duration: 1500,})
    );
  }

  onCalificarRegistro(data_det: data_det, accion: string){
    data_det.Flg_Estado = data_det.Flg_Estado == '0' ? '1' : data_det.Flg_Estado;
    data_det.Id_Motivo = "6";  // OTRO
    data_det.Cod_Usuario = GlobalVariable.vusu;
    data_det.Accion = accion;

    let dialogRef = this.dialog.open(DialogProgramacionAuditoriaMotivoComponent, {
      disableClose: true,
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result)
      //if (result == 'false') {
        this.onListarProgramacionAuditoria()
      //}
    });
  }

  onQuitarCalificaRegistro(data_det: data_det, accion: string){
    const formData = new FormData();
    formData.append('Accion', "U");
    formData.append('Id_Auditoria_Op', data_det.Id_Auditoria_Op.toString());
    formData.append('Id_Auditoria', data_det.Id_Auditoria.toString());
    formData.append('Fecha_Programacion', data_det.Fec_Programacion.toLocaleString());
    formData.append('Cod_EstCli', data_det.Cod_OrdPro);
    formData.append('Cod_OrdPro', data_det.Cod_OrdPro);
    formData.append('Cod_Present', data_det.Cod_Present);
    formData.append('Cod_Cliente', '');
    formData.append('Cod_EstPro', '');
    formData.append('Cod_TemCli', '');
    formData.append('Cod_Auditor', '');
    formData.append('Fecha_Registro', '');
    formData.append('Fecha_Registro2', '');
    formData.append('Cod_Usuario', data_det.Cod_Usuario);
    switch (accion) {
      case '1':  // Califica auditoria
        formData.append('Flg_Estado', '0');
        formData.append('Flg_Estado_2', '0');
        formData.append('Fecha_Auditoria', '');
        formData.append('Fecha_Empaque', '');
        formData.append('Id_Motivo', '1');
        break;
      case '2':  // Califica Empaque
        formData.append('Flg_Estado', data_det.Flg_Estado);
        formData.append('Flg_Estado_2', '0');
        formData.append('Fecha_Auditoria', data_det.Fec_Auditoria.toLocaleString());
        formData.append('Fecha_Empaque', '');
        formData.append('Id_Motivo', '1');
        break;
    }

    this.auditoriaAcabadosService.MantenimientoProgramacionAuditoriaOp(formData)
    .subscribe((res) => {
      console.log(res)
      this.onListarProgramacionAuditoria()
    });  
  }

  onReprogramarRegistro(data_det: data_det){
    let dialogRef = this.dialog.open(DialogProgramacionAuditoriaReprogamaComponent, {
      disableClose: true,
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'false') {
        this.onListarProgramacionAuditoria()
      }
    });
  }

  onGenerarReporteAuditoria(){

    this.dataForExcel = [];
    if (this.dataSource.data.length == 0) {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {
      let dataReporte: data_det[] = [];

      this.dataSource.data.forEach((row: any) => {
        let data: data_det = {};

        data.Id_Auditoria = row.Id_Auditoria;
        data.Fecha_Programacion = this.datepipe.transform(row.Fecha_Programacion.date, 'dd-MM-yyyy');
        data.Nom_Cliente = row.Nom_Cliente;
        data.Cod_EstCli = row.Cod_EstCli;
        data.Nom_TemCli = row.Nom_TemCli;
        data.Cod_OrdPro = row.OPs;
        data.Fec_Auditoria = this.datepipe.transform(row.Fec_Auditoria, 'dd-MM-yyyy hh:mm:ss');
        data.Est_Auditoria = row.Des_Estado;
        data.Fec_Empaque = this.datepipe.transform(row.Fec_Empaque, 'dd-MM-yyyy hh:mm:ss');
        data.Est_Empaque = row.Des_Empaque;
        data.Des_Motivo = row.Des_Motivo;
        data.Est_Empaque = row.Des_Estado_2;
        data.Nom_Auditor = row.Nom_Auditor;

        dataReporte.push(data)
      })

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE SEGUIMIENTO DE PROGRAMACION AUDITORIAS',
        data: this.dataForExcel,
        //headers: Object.keys(this.dataSource.data[0])
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);
      //this.dataSource.data = [];
    }



  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('');
    this.range.controls['end'].setValue('');
  }

  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;

        if(crud.length > 0){
          this.flg_Reprogramar = crud[0].Flg_Verificar == 1 ? true : false;
        } 
      }
    );
  }


}
