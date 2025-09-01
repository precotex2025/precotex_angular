import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import * as _moment from 'moment';

import { ControlActivoFijoService } from 'src/app/services/control-activo-fijo.service';

@Component({
  selector: 'app-validar-salida',
  templateUrl: './validar-salida.component.html',
  styleUrls: ['./validar-salida.component.scss']
})
export class ValidarSalidaComponent implements OnInit {

  codActivoFijo: string = "";

  displayedColumns: string[] = ['Cod_Activo', 'Descripcion', 'Nom_Marca', 'Nom_Modelo', 'Num_Serie_Equipo', 'Nom_Area', 'Nom_Responsable','Flg_Salida']
  dataSource: MatTableDataSource<any>;

  constructor(
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private controlActivoFijoService: ControlActivoFijoService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
  }

  onBuscarActivo(){
    if (this.codActivoFijo.length >= 7){
      this.spinnerService.show();
      this.controlActivoFijoService.valActivosFijo(this.codActivoFijo)
        .subscribe((result: any) => {
          if (result.length > 0) {
            this.dataSource = new MatTableDataSource(result);
            this.spinnerService.hide();
          }else{
            this.dataSource.data = [];
            this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.spinnerService.hide();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      );

    }

  }

  limpiarValor() {
    this.codActivoFijo = '';
    this.dataSource.data = [];
  }


}
