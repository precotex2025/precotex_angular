import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";

import { GlobalVariable } from 'src/app/VarGlobals';
import { EventosService } from 'src/app/services/eventos.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements OnInit {

  displayedColumns: string[] = [
    'ID',
    'NumeroOp',
    'Cliente_desc',
    'Empleado',
    'NombreCompleto',
    'TemCli_nomb',
    'cantidad',
    'fechaDespacho',
    'fechaEmision',
    'cod_cliente',
    'cod_temcli',
    'Ruta'
  ]

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataForExcel = [];
  empleadoSeleccionado: number | null = null;

  listaEmpleados: any[] = [];

  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;


  constructor(
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private eventosService: EventosService,
    private datePipe: DatePipe,
    private exceljsService: ExceljsService,
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    //this.numeroOP='4512466204'
    // this.onListaOPContratos()
    this.cargarEmpleados();
  }

  onListaOPContratos(): void {
console.log('1. Entró a onListaOPContratos');
  // =========================================================
  // VALIDACIÓN: SI INGRESÓ UNA FECHA, DEBE COMPLETAR EL RANGO
  // =========================================================

  if (
    (this.fechaDesde && !this.fechaHasta) ||
    (!this.fechaDesde && this.fechaHasta)
  ) {
    this.matSnackBar.open(
      'Debe seleccionar el rango completo de fechas.',
      'Cerrar',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500
      }
    );

    return;
  }


  // =========================================================
  // VALIDACIÓN: FECHA HASTA NO PUEDE SER MENOR
  // =========================================================

  if (
    this.fechaDesde &&
    this.fechaHasta &&
    this.fechaHasta < this.fechaDesde
  ) {
    this.matSnackBar.open(
      'La fecha Hasta no puede ser menor que la fecha Desde.',
      'Cerrar',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500
      }
    );

    return;
  }


  // =========================================================
  // VALIDACIÓN: DEBE EXISTIR POR LO MENOS UN FILTRO
  // =========================================================

  if (
    !this.empleadoSeleccionado &&
    !this.fechaDesde &&
    !this.fechaHasta
  ) {
    this.matSnackBar.open(
      'Debe seleccionar un empleado o un rango de fechas.',
      'Cerrar',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500
      }
    );

    return;
  }


  // =========================================================
  // FORMATEAR FECHAS
  // =========================================================

  const desde = this.fechaDesde
    ? this.datePipe.transform(this.fechaDesde, 'yyyy-MM-dd')
    : '';

  const hasta = this.fechaHasta
    ? this.datePipe.transform(this.fechaHasta, 'yyyy-MM-dd')
    : '';

  console.log('2. Parámetros');
  console.log('Empleado:', this.empleadoSeleccionado);
  console.log('Desde:', desde);
  console.log('Hasta:', hasta);
  // =========================================================
  // REALIZAR CONSULTA
  // =========================================================

  this.spinnerService.show();

  this.eventosService.listaOPContratos(
    this.empleadoSeleccionado,
    desde,
    hasta
  )
  .subscribe({

    next: (result: any[]) => {

            console.log('4. Respuesta API:', result);


      if (result && result.length > 0) {

        this.dataSource = new MatTableDataSource<any>(result);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      } else {

        this.dataSource.data = [];

        this.matSnackBar.open(
          'No se encontraron registros.',
          'Cerrar',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000
          }
        );
      }

      this.spinnerService.hide();
    },


    error: (err: HttpErrorResponse) => {

      this.spinnerService.hide();

      this.dataSource.data = [];

      this.matSnackBar.open(
        err.message,
        'Cerrar',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2500
        }
      );

    }

  });

}

  onExportarRegistro() {
    this.dataForExcel = [];
    if (this.dataSource.filteredData.length > 0) {
      let dataReporte: any[] = [];

      this.dataSource.filteredData.forEach((row: any) => {
        let data: any = {};

        data.ID = row.ID
        data.NumeroOp = row.NumeroOp;
        data.Cliente_desc = row.Cliente_desc;
        data.Empleado = row.Empleado;
        data.NombreCompleto = row.NombreCompleto;
        data.TemCli_nomb = row.TemCli_nomb;
        data.cantidad = row.cantidad;
        data.fechaDespacho = row.fechaDespacho;
        data.fechaEmision = row.fechaEmision;
        data.cod_cliente = row.cod_cliente;
        data.cod_temcli = row.cod_temcli;
        data.Ruta = row.Ruta;

        dataReporte.push(data);
      });

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'Consulta PO Gestion',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);

    } else {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  limpiarValor() {
    // this.numeroOP = '';
    this.dataSource.data = [];
  }

  limpiarFechas(): void {
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.dataSource.data = [];
    // this.onListaOPContratos();
  }

  limpiarEmpleado(): void {
    this.empleadoSeleccionado = null;
    this.dataSource.data = [];
  }

  cargarEmpleados(): void {

    this.eventosService.listaEmpleados()
      .subscribe({
        next: (result: any) => {

          this.listaEmpleados = result;

        },
        error: (err: HttpErrorResponse) => {

          this.matSnackBar.open(
            err.message,
            'Cerrar',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500
            }
          );

        }
      });
  }
}
