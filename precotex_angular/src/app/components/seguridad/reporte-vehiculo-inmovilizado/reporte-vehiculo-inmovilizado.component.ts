import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { DatePipe } from "@angular/common";
import * as _moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { EventosService } from 'src/app/services/eventos.service';
import { ExceljsService } from 'src/app/services/exceljs.service';

@Component({
  selector: 'app-reporte-vehiculo-inmovilizado',
  templateUrl: './reporte-vehiculo-inmovilizado.component.html',
  styleUrls: ['./reporte-vehiculo-inmovilizado.component.scss']
})
export class ReporteVehiculoInmovilizadoComponent implements OnInit {

  dataPlanta: any[];
  dataForExcel = [];
  displayedColumns: string[] = ['Hr_Incidencia', 'Num_Placa', 'Conductor', 'Des_Planta', 'Fec_Ingreso', 'Operacion', 'Hr_Limite','Minutos']
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  planta: number = 1;
  fecha = new Date();

  constructor(
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private datePipe: DatePipe,
    private exceljsService: ExceljsService,
    private eventosService: EventosService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService    
  ) {
    this.dataSource = new MatTableDataSource();
    this.range.controls['start'].setValue(new Date(this.fecha.getFullYear(), this.fecha.getMonth(), this.fecha.getDate()));
    this.range.controls['end'].setValue(new Date(this.fecha.getFullYear(), this.fecha.getMonth(), this.fecha.getDate()));
  }

  ngOnInit(): void {
    this.listarPlantas();
  }

  listarVehiculoInmovilizado(){
    this.spinnerService.show();
    this.seguridadControlVehiculoService.listarVehiculoInmovilizado(this.planta, this.datePipe.transform(this.range.get('start')?.value, 'yyyy-MM-ddTHH:mm:ss'), this.datePipe.transform(this.range.get('end')?.value, 'yyyy-MM-ddTHH:mm:ss'))
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.dataSource = new MatTableDataSource(result);
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

  onExportarRegistro(){
    this.dataForExcel = [];
    if(this.dataSource.filteredData.length > 0){
      let dataReporte: any[] = [];

      this.dataSource.filteredData.forEach((row: any) => {
        let data: any = {};

        data.FechaIncidencia = this.datePipe.transform(row.Hr_Incidencia, 'yyyy-MM-dd HH:mm:ss');  //row.Hr_Incidencia;
        data.Placa = row.Num_Placa;
        data.Conductor = row.Conductor;
        data.Planta = row.Des_Planta;
        data.FechaIngreso = this.datePipe.transform(row.Fec_Ingreso, 'yyyy-MM-dd HH:mm:ss');  //row.Fec_Ingreso;
        data.Operacion = row.Operacion;
        data.HoraLimite = this.datePipe.transform(row.Hr_Limite, 'yyyy-MM-dd HH:mm:ss');  //row.Hr_Limite;
        data.Minutos = row.Minutos;
        
        dataReporte.push(data);
      });      

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REGISTRO DE INCIDENCIAS VEHICULOS INMOVILIZADOS',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);

    } else{
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }    
  }

  listarPlantas(){
    let plantas: any[];
    this.dataPlanta = [{Id_Planta: 0, des_planta: 'TODAS', num_planta: "00"}]

    this.eventosService.listaPlantaEventos()
      .subscribe((response) => {
        plantas = response;
        this.dataPlanta = this.dataPlanta.concat(plantas);

        this.listarVehiculoInmovilizado()
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }  

}
