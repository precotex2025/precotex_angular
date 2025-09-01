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
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { AuditoriaProcesoCorteService } from 'src/app/services/auditoria-proceso-corte.service';
import { ExceljsProdProArtesService } from 'src/app/services/exceljsProdProdArtes.service';

import { DialogAuditoriaIngresoCorteCabeceraComponent } from './dialog-auditoria-ingreso-corte-cabecera/dialog-auditoria-ingreso-corte-cabecera.component';
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
  Turno?: string;
  Des_Turno?: string;
  Cod_Usuario?: string;
  Fecha_Ingreso?: string;
  Flg_Estado_Tizado?: string;
  Flg_Estado_Tendido?: string;
  Flg_Estado?: string;
  Fecha_Registro?: string;
  Flg_Estado_Name?: string;
}

@Component({
  selector: 'app-auditoria-ingreso-corte',
  templateUrl: './auditoria-ingreso-corte.component.html',
  styleUrls: ['./auditoria-ingreso-corte.component.scss']
})
export class AuditoriaIngresoCorteComponent implements OnInit {

  Cod_Accion = ''
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
  //@ViewChild(MatPaginator) paginator!: MatPaginator;
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
    'Cod_Usuario',
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
    private exceljsService:ExceljsProdProArtesService
   ) { 
    this.dataSource = new MatTableDataSource();
   }


  ngOnInit(): void {
    this.validarCRUDUsuario(188);
    this.buscarAuditoriaCorte()
  }

  /*ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
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

  }*/

  buscarAuditoriaCorte(){
    this.spinnerService.show();
    this.Cod_Accion = 'L'
    this.auditoriaProcesoCorteService.MantenimientoAuditoriaIngresoCorte(this.Cod_Accion, 0, this.formulario.get('sOCorte')?.value, '', '', '', '', '', this.range.get('start')?.value, this.range.get('end')?.value)
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

  openDialog(){
    let dialogRef = this.dialog.open(DialogAuditoriaIngresoCorteCabeceraComponent, {
      disableClose: true,
      maxWidth: "1150px", //-'60vw',
      maxHeight: "670px", //-'70vh',
      height: '100%',
      width: '100%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.buscarAuditoriaCorte()
    })
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

  editarHoja(data_det: data_det){
    //console.log('datos para editar')
    //console.log(data_det);
    let dialogRef = this.dialog.open(DialogAuditoriaIngresoCorteCabeceraComponent, {
      disableClose: true,
      maxWidth: "1150px", //-'60vw',
      maxHeight: "670px", //-'70vh',
      height: '100%',
      width: '100%',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.buscarAuditoriaCorte()
    })
  }

  eliminarHoja(data_det: data_det){
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.spinnerService.show();

        this.auditoriaProcesoCorteService.MantenimientoAuditoriaIngresoCorte('D', data_det.Id_Auditoria, '', '', '', '', '', '', this.range.get('start')?.value, this.range.get('end')?.value)
          .subscribe((result: any) => {
            if (result.length > 0) {
              if(result[0].Respuesta == "OK"){
                this.buscarAuditoriaCorte();
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

  reprocesarHoja(data_det: data_det){
    let Fecha = new Date();
    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Desea reprocesar la auditoria " + data_det.Id_Auditoria + "?" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.spinnerService.show();

        this.auditoriaProcesoCorteService.MantenimientoAuditoriaIngresoCorte('I', data_det.Id_Auditoria, data_det.Co_CodOrdPro, data_det.Cod_Auditor, data_det.Turno, data_det.Flg_Estado_Tizado, data_det.Flg_Estado_Tendido, '0', Fecha.toDateString(), Fecha.toDateString())
          .subscribe((result: any) => {
            if (result.length > 0) {
              if(result[0].Respuesta == "OK"){
                this.buscarAuditoriaCorte();
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

  enviarHoja(data_det: data_det){
    let Fecha = new Date();
    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Desea enviar la auditoria " + data_det.Id_Auditoria + " a Proceso?" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.spinnerService.show();

        this.auditoriaProcesoCorteService.MantenimientoAuditoriaIngresoCorte('E', data_det.Id_Auditoria, data_det.Co_CodOrdPro, data_det.Cod_Auditor, data_det.Turno, data_det.Flg_Estado_Tizado, data_det.Flg_Estado_Tendido, '0', Fecha.toDateString(), Fecha.toDateString())
          .subscribe((result: any) => {
            if (result.length > 0) {
              this.spinnerService.hide();

              if(result[0].Respuesta == "OK"){
                this.matSnackBar.open("Registro satisfactorio en Auditoria Corte - Proceso ...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
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
        data.Fecha_Ingreso = this.datepipe.transform(row.Fecha_Ingreso.date, 'dd-MM-yyyy'); //row.Fecha_Ingreso.date;
        data.Turno = row.Des_Turno;
        data.Co_CodOrdPro = row.Co_CodOrdPro;
        data.Cod_OrdProv = row.Cod_OrdProv;
        data.Des_Cliente = row.Des_Cliente;
        data.Cod_EstCli = row.Cod_EstCli;
        data.Nom_TemCli = row.Nom_TemCli;
        data.Des_Present = row.Des_Present;
        data.Des_TipPre = row.Des_TipPre;
        data.Des_Tela = row.Des_Tela;
        data.Flg_Estado_Name = row.Flg_Estado_Name;
        data.Nom_Auditor = row.Nom_Auditor;

        dataReporte.push(data)

        //this.dataForExcel.push(Object.values(row))
      })

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE AUDITORIA CORTE - INGRESO',
        data: this.dataForExcel,
        //headers: Object.keys(this.dataSource.data[0])
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);
      //this.dataSource.data = [];
    }

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

}