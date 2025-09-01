import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { AuditoriaPrendaService } from 'src/app/services/modular/auditoria-prenda.service';


interface data_det {
  Fecha: string;
  Secuencia: string;
  Codigo_Inspector: string;
  Nombre_Inspector: string;
  Cliente: string;
  OP: string;
  Estilo_Cliente: string;
  Cod_Color: string;
  Color: string;
  Total_Prendas: string;
  Total_Muestras_Auditadas: string;
  Codigo_Defecto: string;
  Descripcion_Defecto: string;
  Cantidad_Defecto: string;
  Estado: string;
  Usuario: string;
  Codigo_Auditor: string;
  Nombre_Auditor: string;
  TotalRetoque: number;
}
@Component({
  selector: 'app-modular-reporte-inspeccion',
  templateUrl: './modular-reporte-inspeccion.component.html',
  styleUrls: ['./modular-reporte-inspeccion.component.scss']
})
export class ModularReporteInspeccionComponent implements OnInit {

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
    'NP',
    'Color',
    'Temporada',
    'Grupo_Textil',
    'Estilo_Cliente',
    'Total',
    'Total_Inspeccionado',
    'Inspeccion_Deribado',
    'Estampado_En_Proceso',
    'Compostura_En_Proceso',
    'Desmanche_En_Proceso',
    'Retoque_En_Proceso',
    'Zurcido_En_Proceso',
    'Segundas_En_Proceso',
    'Rechazado',
    'Auditoria_Modulo',
    'Auditoria_Salida',
    'Rechazado_Modulo',
    'Rechazado_Salida',
    'Transito',
    'Total2'
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
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private auditoriaService: AuditoriaPrendaService,
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
        title: 'REPORTE DE INSPECCIÓN DE PRENDA',
        data: this.dataForExcel,
        headers: Object.keys(this.dataSource.data[0])
      }

      this.exceljsService.exportExcel(reportData);
      //this.dataSource.data = [];

    }
  }


  exportAsXLSX(): void {

    this.excelService.exportAsExcelFile(this.dataSource.data, 'Reporte-Inspeccion-Prenda');

  }


  buscarReporteControlVehiculos() {
    this.dataSource.data = [];  
    this.SpinnerService.show();
    this.Fecha_Auditoria = this.range.get('start')?.value
    this.Fecha_Auditoria2 = this.range.get('end')?.value
    this.auditoriaService.verReporteInspeccionPrenda(
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
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    })

  }

}

