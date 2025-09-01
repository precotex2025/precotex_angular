import { Component, OnInit, AfterViewInit, inject,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { startWith, map,debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { IngresoRolloTejidoService } from 'src/app/services/ingreso-rollo-tejido.service';

import { GlobalVariable } from 'src/app/VarGlobals';
import { Router } from '@angular/router';
import { DialogCrearTrabajadorComponent } from './dialog-crear-trabajador/dialog-crear-trabajador.component';
import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';



interface data_det {
  RH_des_area: string,
  Nombre_Trabajador: string,
  Tipo: string
}

@Component({
  selector: 'app-form-trabajadores-permisos',
  templateUrl: './form-trabajadores-permisos.component.html',
  styleUrls: ['./form-trabajadores-permisos.component.scss']
})
export class FormTrabajadoresPermisosComponent implements OnInit {

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({

  })


  displayedColumns: string[] = [
    'RH_des_area',
    'Nombre_Trabajador',
    'Tipo',
    'acciones',
  ];
  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();




  dataForExcel = [];

  empPerformance = [
    { ID: 10011, NAME: "A", DEPARTMENT: "Sales", MONTH: "Jan", YEAR: 2020, SALES: 132412, CHANGE: 12, LEADS: 35 },
    { ID: 10012, NAME: "A", DEPARTMENT: "Sales", MONTH: "Feb", YEAR: 2020, SALES: 232324, CHANGE: 2, LEADS: 443 },
    { ID: 10013, NAME: "A", DEPARTMENT: "Sales", MONTH: "Mar", YEAR: 2020, SALES: 542234, CHANGE: 45, LEADS: 345 },
    { ID: 10014, NAME: "A", DEPARTMENT: "Sales", MONTH: "Apr", YEAR: 2020, SALES: 223335, CHANGE: 32, LEADS: 234 },
    { ID: 10015, NAME: "A", DEPARTMENT: "Sales", MONTH: "May", YEAR: 2020, SALES: 455535, CHANGE: 21, LEADS: 12 },
  ];

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SeguridadActivoFijoReporteService:RegistroPermisosService,
    public dialog: MatDialog,
    private _router: Router,
    private SpinnerService: NgxSpinnerService,
    private excelService:ExcelService,
    private exceljsService:ExceljsService) {  this.dataSource = new MatTableDataSource(); }

    @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.listadoTrabajadoresPermisos();
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

  EliminarRegistro(data) {
    console.log(data)
   
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.SeguridadActivoFijoReporteService.eliminarAreaUsuarioPermiso(
          data.Cod_Trabajador,
          data.RH_Cod_Area,
          data.Cod_Empresa
        ).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              console.log(result);
              this.SpinnerService.hide();
              this.matSnackBar.open("Se elimino correctamente el registro..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.listadoTrabajadoresPermisos();
            }
            else {
              this.matSnackBar.open("Ha ocurrido un error al eliminar el registro..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              //this.dataSource.data = []
              this.SpinnerService.hide();
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))
       
      }

    })
  }
  OpenDialogConfirmacion(data){

  }

  OpenDeleteConfirmacion(data){

  }


  exportAsXLSX():void {

    this.excelService.exportAsExcelFile(this.dataSource.data, 'Reporte-Control_Vehiculos');

  }



  listadoTrabajadoresPermisos() {
    this.dataSource.data = [];
    this.SpinnerService.show();

    var Cod_Empresa = '';
    if (GlobalVariable.empresa == '03') {
      Cod_Empresa = '07';
    }else{
      Cod_Empresa = GlobalVariable.empresa;
    }
    this.SeguridadActivoFijoReporteService.Rh_Muestra_Trabajadores_Jefe_Web(
     'P',
     GlobalVariable.vcodtra,
     GlobalVariable.vtiptra,
     Cod_Empresa
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result)
          this.dataSource.data = result
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

  }

  openDialogTipos() {
    let dialogRef = this.dialog.open(DialogCrearTrabajadorComponent, {
      disableClose: false,
      minHeight: '400px',
      //minWidth: '600px',
      panelClass: 'my-class',
      maxWidth: '95%',
      data: { eltipo: this.formulario.get('tipos')?.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listadoTrabajadoresPermisos();
      if (result == 'false') {
        //this.CargarOperacionConductor()
        //this.MostrarCabeceraVehiculo()
      }

    })
  }

}