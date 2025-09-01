import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { SeguridadActivoFijoReporteService } from 'src/app/services/seguridad-activo-fijo-reporte.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ExceljsInspeccionService } from 'src/app/services/exceljsInspeccion.service';
/*
interface data_det {
  Fecha: string;
  Sec: string;
  Usuario: string;
  Modulo: string;
  Tip_Trabajador: string;
  Cod_Trabajador: string;
  Nombre: string;
  Cliente: string;
  Nombre_Cliente: string;
  TEMPORADA: string;
  Estilo_Cliente: string;
  NP: string;
  Inspeccionado: string;
  Cod_Pres: string;
  Color: string;
  DEFECTO: string;
  Cantidad: string;
  LINEA: string;
}
*/
interface data_det {
  Fecha_Registro: string;
  Secuencia: string;
  Modulo: string;
  Cod_Inspector: string;
  Inspector: string;
  Cliente: string;
  Estilo: string;
  OP: string;
  Color: string;
  Cantidad: number;
  Tamano_Muestra: number;
  Codigo_Defecto: string;
  Descripcion_Defecto: string;
  Cantidad_Defecto: number;
  Estado: string;
  Cod_Auditor: string;
  Auditor: string;
  Usuario_Auditor: string;
}

interface Modulo {
  Cod_Modulo: string;
  Des_Modulo: string;
}

@Component({
  selector: 'app-modular-reporte-auditoria-proceso-inspeccion',
  templateUrl: './modular-reporte-auditoria-proceso-inspeccion.component.html',
  styleUrls: ['./modular-reporte-auditoria-proceso-inspeccion.component.scss']
})
export class ModularReportesAuditoriaProcesoInspeccionComponent implements OnInit {


  listar_modulos:  Modulo[] = []
  fIni = ""
  fFin = ""

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    sModulo: ['']
  })



  displayedColumns: string[] = [
    'Fecha_Registro',
    'Secuencia',
    'Modulo',
    'Cod_Inspector',
    'Inspector',
    'Cliente',
    'Estilo',
    'OP',
    'Color',
    'Cantidad',
    'Tamano_Muestra',
    'Codigo_Defecto',
    'Descripcion_Defecto',
    'Cantidad_Defecto',
    'Estado',
    'Cod_Auditor',
    'Auditor',
    'Usuario_Auditor'
  ]
  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();


  dataResumida = [];
  dataSeguimiento = [];


  dataForExcel = [];

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SeguridadActivoFijoReporteService: SeguridadActivoFijoReporteService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private exceljsSeguiService: ExceljsService,
    private exceljsService: ExceljsInspeccionService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    //this.CargarModulos()
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


  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

  generateExcel() {

    this.dataForExcel = [];
    if (this.dataSource.data.length == 0) {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {

      this.dataSource.data.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE DE AUDITORIA PROCESO EN INSPECCION',
        data: this.dataForExcel,
        headers: Object.keys(this.dataSource.data[0])
      }
      this.exceljsSeguiService.exportExcel(reportData);

    }
  }


  buscarReporteModularAuditoriaProceso() {
    this.dataSource.data = [];
    let accion = 'R'
    let  Cod_Modulo = ''
    this.fIni = this.range.get('start')?.value
    this.fFin = this.range.get('end')?.value
    this.SpinnerService.show();

    console.log(accion,
      Cod_Modulo,
      this.fIni,
      this.fFin)

    this.SeguridadActivoFijoReporteService.CF_Modular_Reporte_Auditoria_Proceso(
      accion,
      Cod_Modulo,
      this.fIni,
      this.fFin
    ).subscribe(
      (result: any) => {
        /*console.log('data servidorrrrrrrrrrrrrrrrrrrrrr')
        console.log(result)
        this.SpinnerService.hide();*/
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
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })

  }



  CargarModulos(){
    let accion = 'M';
    this.SpinnerService.show();
    this.SeguridadActivoFijoReporteService.verModularReporteInspeccionDefectosPrenda(
      accion,'','','').subscribe(
      (result: any) => {
        this.listar_modulos = result
        this.SpinnerService.hide();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

}

