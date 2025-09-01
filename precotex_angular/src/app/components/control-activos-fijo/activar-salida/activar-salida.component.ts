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
  selector: 'app-activar-salida',
  templateUrl: './activar-salida.component.html',
  styleUrls: ['./activar-salida.component.scss']
})
export class ActivarSalidaComponent implements OnInit {

  idDescripcion: number = 192;  //Laptop
  dataTipoActivos: any[];
  dataActivoFijos: any[];

  dataForExcel = [];
  displayedColumns: string[] = ['Cod_Activo', 'Descripcion', 'Nom_Marca', 'Nom_Modelo', 'Num_Serie_Equipo', 'Nom_Area', 'Nom_Responsable','Flg_Salida']
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
    this.controlActivoFijoService.getActivosFijo('3',this.idDescripcion.toString())
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
    this.controlActivoFijoService.getTipoActivos()
      .subscribe((response) => {
        this.dataTipoActivos = response;

        this.listarActivos();
      });
  }  

  onChangeSalida(event, activo: any) {

    this.controlActivoFijoService.manActivosFijo(activo.Cod_Activo_Fijo, (event.checked ? '1' : '0'))
      .subscribe((res) => {
        console.log(res)
        if(res[0].Id_Registro > 0){
          let ln_Index = this.dataActivoFijos.indexOf(activo);
          this.dataActivoFijos[ln_Index].Flg_Salida = event.checked ? '1' : '0';
          this.dataSource._updateChangeSubscription();
        } else {
          this.matSnackBar.open("Error en la actualización", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }  

}
