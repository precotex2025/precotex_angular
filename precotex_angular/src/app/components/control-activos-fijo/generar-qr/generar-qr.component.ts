import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import * as _moment from 'moment';

import { ControlActivoFijoService } from 'src/app/services/control-activo-fijo.service';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.component.html',
  styleUrls: ['./generar-qr.component.scss']
})
export class GenerarQrComponent implements OnInit {

  idDescripcion: number = 226;  //Laptop
  dataTipoActivos: any[];
  dataActivoFijos: any[];

  dataForExcel = [];
  displayedColumns: string[] = ['Des_Planta','Cod_Activo', 'Descripcion', 'Nom_Marca', 'Nom_Modelo', 'Num_Serie_Equipo', 'Nom_Area', 'Nom_Responsable']
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private controlActivoFijoService: ControlActivoFijoService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.listarTipoActivos();
  }

  listarActivos(){
    this.spinnerService.show();
    this.controlActivoFijoService.getActivosFijo('8',this.idDescripcion.toString())
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.dataActivoFijos = result;
          this.dataSource = new MatTableDataSource(this.dataActivoFijos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.spinnerService.hide();
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = [];
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }

  listarTipoActivos(){
    this.controlActivoFijoService.getTipoActivos('8')
      .subscribe((response) => {
        this.dataTipoActivos = response;

        this.listarActivos();
      });
  }  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }  

  onExportarRegistro(){

  }
}
