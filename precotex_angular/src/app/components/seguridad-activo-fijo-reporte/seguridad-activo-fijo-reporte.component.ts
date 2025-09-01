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
import { IngresoRolloTejidoService } from 'src/app/services/ingreso-rollo-tejido.service';

interface data_det {
  Empresa: string;
  Sede: string;
  Piso: string;
  Area: string;
  Centro_Costo: string;
  Responsable: string;
  Cod_Usuario: string;
  ClaseActivo: string;
  Cod_Activo: string;
  Descripcion: string;
  Marca: string;
  Modelo: string;
  Serie: string;
  Color: string;
  Medida: string;
  Serie_Motor: string;
  Serie_Chasis: string;
  Placa: string;
  Tipo_Combustible: string;
  Tipo_Caja: string;
  Cantidad_Asiento: string;
  Cantidad_Eje: string;
  Ano_Fabricacion: string;
  Uso_Desuso: string;
  Observacion: string;
  fec_registro: string;
}

@Component({
  selector: 'app-seguridad-activo-fijo-reporte',
  templateUrl: './seguridad-activo-fijo-reporte.component.html',
  styleUrls: ['./seguridad-activo-fijo-reporte.component.scss']
})
export class SeguridadActivoFijoReporteComponent implements OnInit {

  public data_det = [{
    Empresa: '',
    Sede: '',
    Piso: '',
    Area: '',
    Centro_Costo: '',
    Responsable: '',
    Cod_Usuario: '',
    ClaseActivo: '',
    Cod_Activo: '',
    Descripcion: '',
    Marca: '',
    Modelo: '',
    Serie: '',
    Color: '',
    Medida: '',
    Serie_Motor: '',
    Serie_Chasis: '',
    Placa: '',
    Tipo_Combustible: '',
    Tipo_Caja: '',
    Cantidad_Asiento: '',
    Cantidad_Eje: '',
    Ano_Fabricacion: '',
    Uso_Desuso: '',
    Observacion: '',
    fec_registro: ''
  }]


  Fecha_Auditoria = ""
  Fecha_Auditoria2 = ""

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({

  })



  displayedColumns: string[] = [
    'Empresa',
    'Sede',
    'Piso',
    'Area',
    'Centro_Costo',
    'Responsable',
    'Cod_Usuario',
    'ClaseActivo',
    'Cod_Activo',
    'Descripcion',
    'Marca',
    'Modelo',
    'Serie',
    'Color',
    'Medida',
    'Serie_Motor',
    'Serie_Chasis',
    'Placa',
    'Tipo_Combustible',
    'Tipo_Caja',
    'Cantidad_Asiento',
    'Cantidad_Eje',
    'Ano_Fabricacion',
    'Uso_Desuso',
    'Observacion',
    'fec_registro',
  ]
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
    private SeguridadActivoFijoReporteService: SeguridadActivoFijoReporteService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private exceljsService: ExceljsService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {


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
    console.log(this.dataSource.data)

    this.dataForExcel = [];
    if (this.dataSource.data.length == 0) {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {

      this.dataSource.data.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE TOMA INVENTARIO ACTIVOS',
        data: this.dataForExcel,
        headers: Object.keys(this.dataSource.data[0])
      }

      this.exceljsService.exportExcel(reportData);
      //this.dataSource.data = [];

    }
  }


  exportAsXLSX(): void {

    this.excelService.exportAsExcelFile(this.dataSource.data, 'Reporte-Control_Vehiculos');

  }


  buscarReporteControlVehiculos() {
    this.dataSource.data = [];

    this.SpinnerService.show();
    this.Fecha_Auditoria = this.range.get('start')?.value
    this.Fecha_Auditoria2 = this.range.get('end')?.value
    this.SeguridadActivoFijoReporteService.verReporteActivoFijo(
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2
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

}

