import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { ExceljsKardexJabasService } from 'src/app/services/exceljs-kardex-jabas.service';
import { SeguridadControlJabaService } from 'src/app/services/seguridad-control-jaba.service';


interface data_det {
  N: string,
  Fecha_Registro: string,
  Codigo_Barra: string,
  Origen: string,
  Fecha_Registro_Java: string,
  Num_Movstk: string,
  Guia: string,
  Destino: string
}



@Component({
  selector: 'app-reporte-kardex-jabas.component',
  templateUrl: './reporte-kardex-jabas.component.html',
  styleUrls: ['./reporte-kardex-jabas.component.scss']
})
export class ReporteKardexJabasComponent implements OnInit {
  
  dataResult: any = [];
  public data_det = [{
  }]

  Fecha_Inicio = "";
  Fecha_Fin = "";
  Jaba="";

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
 
  formulario = this.formBuilder.group({
    Jaba:           ['']    
  })

  displayedColumns_cab: string[] = [   
    'N', 
    'Fecha_Registro_Java', 
    'Codigo_Barra',
    'Origen',
    'Fecha_Registro',
    'Num_Movstk',
    'Guia',
    'Destino' 
    ]

  dataSource: MatTableDataSource<data_det>;
  

  dataForExcel = [];

 
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    //private movimientoLiquidacionAviosService: MovimientoLiquidacionAviosService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private exceljsKardexJabasService: ExceljsKardexJabasService, 
    private seguridadControlJabaService: SeguridadControlJabaService) {
      this.dataSource = new MatTableDataSource();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    //this.MostrarKardexJabas(); 
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

  MostrarKardexJabas() { 

    this.SpinnerService.show(); 
    this.Fecha_Inicio     = this.range.get('start')?.value;
    this.Fecha_Fin        = this.range.get('end')?.value;
    this.Jaba             = this.formulario.get('Jaba')?.value
    this.seguridadControlJabaService.BuscarKardexJabas(this.Fecha_Inicio, this.Fecha_Fin, this.Jaba).subscribe(
      (result: any) => {
        if (result.length > 0) {   
          this.dataResult = result;
          this.dataSource.data = result;           
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
 
  }
 
  ExportarKardexJabas() {
    this.dataForExcel = [];
    if (this.dataSource.data.length == 0) {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {
  


 
      const header = ['N', 
      'Fecha Registro PL',
      'Codigo Jaba',
      'Origen',
      'Fecha Registro',
      'N° de Movimiento',
      'N° Guía de Remisión',
      'Destino'];

      let reportData = {
        title: 'REPORTE KARDEX DE JABAS',
        data: this.dataSource.data,
        headers: header
      }

      this.exceljsKardexJabasService.exportExcel(reportData);
    }
  }  
 
}

