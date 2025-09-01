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
import { ExceljsInspeccionService } from 'src/app/services/exceljsInspeccion.service';

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

@Component({
  selector: 'app-reportes-inspeccion-prenda',
  templateUrl: './reportes-inspeccion-prenda.component.html',
  styleUrls: ['./reportes-inspeccion-prenda.component.scss']
})
export class ReportesInspeccionPrendaComponent implements OnInit {



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
    'Fecha',
    'Sec',
    'Usuario',
    'Modulo',
    'Tip_Trabajador',
    'Cod_Trabajador',
    'Nombre',
    'Cliente',
    'Nombre_Cliente',
    'TEMPORADA',
    'Estilo_Cliente',
    'NP',
    'Inspeccionado',
    'Cod_Pres',
    'Color',
    'DEFECTO',
    'Cantidad',
    'LINEA'
  ]
  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();


  dataResumida = [];
  dataSeguimiento = [];


  dataForExcel = [];
  dataForExcel2 = [];
  dataForExcel3 = [];

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
    private exceljsSeguiService: ExceljsService,
    private exceljsService: ExceljsInspeccionService) { this.dataSource = new MatTableDataSource(); }

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
    console.log(this.dataResumida[0])

    this.dataForExcel = [];
    this.dataForExcel2 = [];
    if (this.dataSource.data.length == 0) {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {

      this.dataSource.data.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let newArray = [];
      // this.dataResumida.map(function (elm) {
      //   var keys = Object.keys(elm);
      //   let newObj = {};
      //   keys.map(element => {
      //     var resultado = element
      //     if (resultado = 'NP') {
      //       Object.assign(newObj, { ['NP']: elm['NP'] });
      //     }
      //     if (resultado = 'Estilo_Cliente') {
      //       Object.assign(newObj, { ['ESTILO CLIENTE']: elm['Estilo_Cliente'] });
      //     }
      //     if (resultado = 'Modulo') {
      //       Object.assign(newObj, { ['Modulo']: elm['Modulo'] });
      //     }
      //     if (resultado = 'AREA_COMPOSTURA') {
      //       Object.assign(newObj, { ['01-AREA COMPOSTURA']: elm['AREA_COMPOSTURA'] });
      //     }
      //     if (resultado = 'AREA_SEGUNDA') {
      //       Object.assign(newObj, { ['02-AREA SEGUNDA']: elm['AREA_SEGUNDA'] });
      //     }
      //     if (resultado = 'AREA_ZURCIDO') {
      //       Object.assign(newObj, { ['03-AREA ZURCIDO']: elm['AREA_ZURCIDO'] });
      //     }
      //     if (resultado = 'AREA_DESMANCHE') {
      //       Object.assign(newObj, { ['04-AREA DESMANCHE']: elm['AREA DESMANCHE'] });
      //     }
      //     if (resultado = 'AREA_ESTAMPADO_Y_BORDADO') {
      //       Object.assign(newObj, { ['05-AREA ESTAMPADO Y BORDADO']: elm['AREA_ESTAMPADO_Y_BORDADO'] });
      //     }
      //   });
      //   newArray.push(newObj);

      // });

      // console.log(newArray);

      this.dataResumida.forEach((row: any) => {
        console.log(row);
        this.dataForExcel2.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE DE INSPECCIÓN DE PRENDA',
        data: this.dataForExcel,
        headers: Object.keys(this.dataSource.data[0])
      }

      // var array = Object.keys(this.dataResumida[0]);
      // var cabeceras1 = [];
      // var cabeceras = [];
      // array.forEach(element => {
      //   if (element == 'NP') {
      //     cabeceras1.push(element);
      //   }
      //   if (element == 'Estilo_Cliente') {
      //     cabeceras1.push(element);
      //   }

      //   if (element == 'Modulo') {
      //     cabeceras1.push(element);
      //   }

      //   if (element == '01-AREA COMPOSTURA') {
      //     cabeceras.push(element);
      //   }
      //   if (element == '02-AREA SEGUNDA') {
      //     cabeceras.push(element);
      //   }
      //   if (element == '03-AREA ZURCIDO') {
      //     cabeceras.push(element);
      //   }
      //   if (element == '04-AREA DESMANCHE') {
      //     cabeceras.push(element);
      //   }
      //   if (element == '05-AREA ESTAMPADO Y BORDADO') {
      //     cabeceras.push(element);
      //   }

      // });

      // cabeceras = cabeceras.sort();

      // var nuevoArray = cabeceras1.concat(cabeceras);




      let reportData2 = {
        title: 'RESUMIDO INSPECCIÓN DE PRENDA',
        data: this.dataForExcel2,
        headers:  Object.keys(this.dataResumida[0])
      }

      this.exceljsService.exportExcel(reportData, reportData2);
      //this.dataSource.data = [];

    }
  }


  exportAsXLSX(): void {

    this.excelService.exportAsExcelFile(this.dataSource.data, 'Reporte-Inspeccion-Prenda');

  }


  buscarReporteControlVehiculos() {
    this.dataSource.data = [];
    let accion = 'I';
    this.SpinnerService.show();
    this.Fecha_Auditoria = this.range.get('start')?.value
    this.Fecha_Auditoria2 = this.range.get('end')?.value
    this.SeguridadActivoFijoReporteService.verReporteInspeccionPrenda(
      accion,
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result)
          this.dataSource.data = result
          this.getReporteResumido();
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

  getReporteResumido() {
    this.dataResumida = [];
    let accion = 'R';
    this.SpinnerService.show();
    this.Fecha_Auditoria = this.range.get('start')?.value
    this.Fecha_Auditoria2 = this.range.get('end')?.value
    this.SeguridadActivoFijoReporteService.verReporteInspeccionPrenda(
      accion,
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          this.dataResumida = result
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataResumida = []
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


  getReporteSeguimiento() {
    this.dataSeguimiento = [];
    let accion = 'R';
    this.SpinnerService.show();
    this.Fecha_Auditoria = this.range.get('start')?.value
    this.Fecha_Auditoria2 = this.range.get('end')?.value

    if(this.Fecha_Auditoria != '' && this.Fecha_Auditoria2 != ''){
      this.SeguridadActivoFijoReporteService.reporteInspeccionSeguimiento(
        this.Fecha_Auditoria,
        this.Fecha_Auditoria2
        ).subscribe(
          (result: any) => {
            if (result.length > 0) {
              this.dataSeguimiento = result
              this.SpinnerService.hide();
              this.generateExcelSeguimiento();
    
            }
            else {
              this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.dataSeguimiento = []
              this.SpinnerService.hide();
            }
          },
          (err: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            })
          })
    }else{
      this.matSnackBar.open('Debe ingresar la fecha de inicio y Fecha de Fin', 'Cerrar', {
        duration: 1500,
      })
    }

    
  }


  generateExcelSeguimiento() {
    
    if (this.dataSeguimiento.length == 0) {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {
      this.dataForExcel3 = [];
      this.dataSeguimiento.forEach((row: any) => {
        this.dataForExcel3.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE SEGUIMIENTO OP',
        data: this.dataForExcel3,
        headers: Object.keys(this.dataSeguimiento[0])
      }


      this.exceljsSeguiService.exportExcel(reportData);
      //this.dataSource.data = [];

    }
  }

}

