import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { ExceljsService } from 'src/app/services/exceljs.service';

import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';

import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';
import { DialogConfirmacion2Component} from 'src/app/components/dialogs/dialog-confirmacion2/dialog-confirmacion2.component';
import { DialogRegistarEmpaqueAcabadoComponent } from './dialog-registar-empaque-acabado/dialog-registar-empaque-acabado.component';
import { DialogDefectosEmpaqueAcabadoComponent } from './dialog-defectos-empaque-acabado/dialog-defectos-empaque-acabado.component';
import { DialogVistaEmpaqueAcabadoComponent } from './dialog-vista-empaque-acabado/dialog-vista-empaque-acabado.component';

interface data_det {
  Num_Auditoria?: number; 
  Cod_Auditor?: string; 
  Nom_Auditor?: string;
  Fecha_Auditoria?: string;
  Cod_EstCli?: string;
  Cod_TemCli?: string;
  Lote?: string;
  Estado?: string;
  Tamano_Muestra?: string;
  Tip_Trabajador_Auditor?: string;
  Observacion?: string;
  Obs_Medida?: string;
  Nro_Defectos?: number;
  Flg_Status?: string;
  Cod_Usuario?: string; 
  Nom_Cliente?: string; 
  Des_EstCli?: string; 
  Nom_TemCli?: string; 
  Cod_Defecto?: string; 
  Descripcion?: string; 
  Cantidad?: number; 
  Ops_Auditoria?: string; 
}

@Component({
  selector: 'app-auditoria-empaque-acabado',
  templateUrl: './auditoria-empaque-acabado.component.html',
  styleUrls: ['./auditoria-empaque-acabado.component.scss']
})
export class AuditoriaEmpaqueAcabadoComponent implements OnInit {

  dataForExcel = [];
  dataReporteAuditoria: any[] = [];
  displayedColumns: string[] = ['Num_Auditoria','Fecha_Auditoria','Nom_Cliente','Cod_EstCli','Cod_TemCli','Lote','Tamano_Muestra','Observacion','Flg_Status','Acciones']
  dataSource: MatTableDataSource<data_det>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  formulario = this.formBuilder.group({
    Cod_EstCli: [''],
    CodAuditor: [''] 
  })

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    public dialog: MatDialog,
    private exceljsService: ExceljsService,
    private spinnerService: NgxSpinnerService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.onListarCabeceraEmpaqueAcabados();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };

  }

  onListarCabeceraEmpaqueAcabados(){
    
    this.auditoriaAcabadosService.Mant_AuditoriaModuloEmpaqueAcabado('L', 0, '', this.range.get('start')?.value, this.range.get('end').value, this.formulario.get('Cod_EstCli').value, '', '', '', '', '', '')
      .subscribe((result: any) => {
        if (result.length > 0) {
     
          this.dataSource.data = result;
          this.spinnerService.hide();
          //this.formulario.controls['CodAuditor'].setValue('');

        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }));

  }

  onInsertarAuditoria(){
    let codAuditor: string = GlobalVariable.vtiptra.trim().concat("-").concat(GlobalVariable.vcodtra.trim())
    let data_det: data_det = {Num_Auditoria: 0, Cod_Auditor: codAuditor, Nom_Auditor: "", Fecha_Auditoria: "", Cod_EstCli: "", Cod_TemCli: "", Lote: "", Tamano_Muestra: "", Tip_Trabajador_Auditor: "", Observacion: "", Obs_Medida: "", Nro_Defectos: 0, Flg_Status: '1', Cod_Usuario: "", Nom_Cliente: ""} ;

    let dialogRef = this.dialog.open(DialogRegistarEmpaqueAcabadoComponent, {
      disableClose: true,
      width: "1250px",
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onListarCabeceraEmpaqueAcabados();
    });


  }

  onGenerarReporteAuditoria(){
    this.spinnerService.show();
    this.auditoriaAcabadosService.Mant_AuditoriaModuloEmpaqueAcabado('X', 0, '', this.range.get('start')?.value, this.range.get('end').value, this.formulario.get('Cod_EstCli').value, '', '', '', '', '', '')
      .subscribe((result: any) => {
        if (result.length > 0) {

          this.dataReporteAuditoria = result;
          this.spinnerService.hide();
     
          this.generateExcel();

        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataReporteAuditoria = []
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }));

  }

  generateExcel(){
    this.dataForExcel = [];
    if(this.dataReporteAuditoria.length > 0){
      let dataReporte: data_det[] = [];
      let cantidadDefecto: number = 0;
      let totalMuestra: number = 0;
      
      this.dataReporteAuditoria.forEach((row: data_det) => {
        let data: data_det = {};

        data.Fecha_Auditoria = row.Fecha_Auditoria;
        data.Num_Auditoria = row.Num_Auditoria;
        data.Nom_Auditor = row.Nom_Auditor;
        data.Nom_Cliente = row.Nom_Cliente;
        data.Cod_EstCli = row.Cod_EstCli;
        data.Cod_TemCli = row.Cod_TemCli;
        data.Nom_TemCli = row.Nom_TemCli;
        data.Lote = row.Lote;
        data.Tamano_Muestra = row.Tamano_Muestra;
        data.Ops_Auditoria = row.Ops_Auditoria;
        data.Estado = row.Estado;
        data.Cod_Defecto = row.Cod_Defecto;
        data.Descripcion = row.Descripcion;
        data.Cantidad = row.Cantidad;
        data.Observacion = row.Observacion;

        cantidadDefecto += parseInt(row.Cantidad.toString());
        totalMuestra += parseInt(row.Tamano_Muestra.toString());

        dataReporte.push(data);
      });
      
      let rowTotales: any = {
        Fecha_Auditoria: "",
        Num_Auditoria: 0,
        Nom_Auditor: "",
        Nom_Cliente: "TOTALES",
        Cod_EstCli: "",
        Cod_TemCli: "",
        Nom_TemCli: "",
        Lote: "",
        Tamano_Muestra: totalMuestra,
        Ops_Auditoria: "",
        Estado: "",
        Cod_Defecto: "",
        Descripcion: "",
        Nro_Defectos: cantidadDefecto,
        Observacion: ""
      }

      dataReporte.push(rowTotales)

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE DE EMPAQUE DE ACABADO',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);

    } else{
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }

  }

  onEditarAuditoria(data_det: data_det){
    data_det.Cod_Auditor = data_det.Tip_Trabajador_Auditor.concat("-").concat(data_det.Cod_Auditor);

    let dialogRef = this.dialog.open(DialogRegistarEmpaqueAcabadoComponent, {
      disableClose: true,
      width: "1250px",
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onListarCabeceraEmpaqueAcabados();
    });
  }

  onEliminarAuditoria(data_det: data_det){
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.spinnerService.show();

        this.auditoriaAcabadosService.Mant_AuditoriaModuloEmpaqueAcabado('D', data_det.Num_Auditoria, '', this.range.get('start')?.value, this.range.get('end').value, '', '', '', '', '', '', '')
          .subscribe((result: any) => {
            if (result.length > 0) {
              this.onListarCabeceraEmpaqueAcabados();
              this.spinnerService.hide();
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }));

      }
    });

  }

  onDuplicarAuditoria(data_det: data_det){
    let Fecha = new Date();
    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Desea reprocesar la auditoria " + data_det.Num_Auditoria + "?" } });
//    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.spinnerService.show();

        this.auditoriaAcabadosService.Mant_AuditoriaModuloEmpaqueAcabado(
            'I', 
            0, 
            data_det.Tip_Trabajador_Auditor.concat("-").concat(data_det.Cod_Auditor), 
            Fecha.toDateString(), 
            Fecha.toDateString(), 
            data_det.Cod_EstCli,
            data_det.Cod_TemCli,
            data_det.Lote,
            data_det.Tamano_Muestra,
            data_det.Observacion,
            data_det.Obs_Medida,
            '0')
          .subscribe((result: any) => {
            if (result.length > 0) {
              this.onListarCabeceraEmpaqueAcabados();
              this.spinnerService.hide();
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }));

      }
    });

  }

  onDefectosAuditoria(data_det: data_det){
    let dialogRef = this.dialog.open(DialogDefectosEmpaqueAcabadoComponent, {
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '98vw',
      maxHeight: '98vh',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {

        this.onListarCabeceraEmpaqueAcabados();
  
    });
  }

  onVistaPreviaAuditoria(data_det: data_det){

    let dialogRef = this.dialog.open(DialogVistaEmpaqueAcabadoComponent, {
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '95vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

  clearEstilo(){
    this.formulario.patchValue({Cod_EstCli: ''});
  }


}
