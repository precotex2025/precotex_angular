import { Component, OnInit, AfterViewInit, inject,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { SeguridadControlVehiculoService} from 'src/app/services/seguridad-control-vehiculo.service';
import { startWith, map,debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
interface data_det {
  Fecha:      string,
  Num_Placa:  string,
  Conductor:  string,
  Operacion:  string,
  Sede:       string,
  Partio_De:  string,
  Llego_A:    string,
  Ingreso:    string,
  Salida:     string,
	

}

@Component({
  selector: 'app-seguridad-control-vehiculo-reporte',
  templateUrl: './seguridad-control-vehiculo-reporte.component.html',
  styleUrls: ['./seguridad-control-vehiculo-reporte.component.scss']
})

export class SeguridadControlVehiculoReporteComponent implements OnInit {

  public data_det = [{
    Fecha:      '',
    Num_Placa:  '',
    Conductor:  '',
    Operacion:  '',
    Sede:       '',
    Partio_De:  '',
    Llego_A:    '',
    Ingreso:    '',
    Salida:     ''
  }]

 
  Fecha_Auditoria   =   ""
  Fecha_Auditoria2  =   ""

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({

  })  


  
  displayedColumns: string[] = ['Fecha', 'Num_Placa', 'Conductor', 'Operacion', 'Sede', 'Partio_De', 'Llego_A', 'Ingreso','Salida']
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
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private excelService:ExcelService,
    private exceljsService:ExceljsService) {  this.dataSource = new MatTableDataSource();}

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
    this.dataForExcel = [];
    console.log(this.dataSource.data)
    if(this.dataSource.data.length == 0){
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else{

    this.dataSource.data.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row)) 
    })

    let reportData = {
      title: 'REPORTE CONTROL VEHICULOS',
      data: this.dataForExcel,
      headers: Object.keys(this.dataSource.data[0])
    }

    this.exceljsService.exportExcel(reportData);
  }
  }


  exportAsXLSX():void {
   
    this.excelService.exportAsExcelFile(this.dataSource.data, 'Reporte-Control_Vehiculos');

  }

 
  buscarReporteControlVehiculos(){

    this.SpinnerService.show();
    this.Fecha_Auditoria    = this.range.get('start')?.value
    this.Fecha_Auditoria2   = this.range.get('end')?.value
    this.seguridadControlVehiculoService.verReporteControlVehiculos(
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

