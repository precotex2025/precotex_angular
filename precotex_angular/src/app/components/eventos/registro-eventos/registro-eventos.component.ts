import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
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
import { DialogConfirmacion2Component} from 'src/app/components/dialogs/dialog-confirmacion2/dialog-confirmacion2.component';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'

import { GlobalVariable } from 'src/app/VarGlobals';
import { EventosService } from 'src/app/services/eventos.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { DialogRegistroComponent } from './dialog-registro/dialog-registro.component';

interface Detalle {
  Id_DetalleEvento?: number;
  Id_Evento?: number;
  Des_Entrega?: string;
  Flg_Dependiente?: number;
  Flg_Activo?: number;
  Sede?: string;
}

interface Evento {
  Accion?: string;
  Id_Evento?: number;
  Id_TipoEvento?: number;
  Des_Evento?: string;
  Fec_Evento?: Date;
  Lugar?: string;
  Flg_Estado?: string;
  Fltr_Sexo?: string;
  Fltr_Tipo?: string;
  Fltr_Sede?: number;
  Fltr_Padre?: number;
  Fltr_Onomastico?: number;
  Fltr_Dependiente?: number;
  Fltr_TopeEdad?: number;
  Fltr_Ingreso?: Date;
  Fec_Cierre?: Date;
  Flg_Activo?: number;
  Fec_Registro?: Date;
  Usu_Registro?: string;
  Des_TipoEvento?: string;
  Personal?: string;
  Sede?: string;
  Detalle: Detalle[];
}

@Component({
  selector: 'app-registro-eventos',
  templateUrl: './registro-eventos.component.html',
  styleUrls: ['./registro-eventos.component.scss']
})
export class RegistroEventosComponent implements OnInit {

  dataForExcel = [];
  displayedColumns: string[] = ['Fec_Evento', 'Des_Evento', 'Lugar', 'Des_TipoEvento', 'Personal', 'Sede', 'Flg_Estado','Fec_Cierre','Acciones']
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private eventosService: EventosService,
    private datePipe: DatePipe,
    private exceljsService: ExceljsService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.listarEventos();
  }

  listarEventos(){
    let data: Evento = {
      Accion: 'L',
      Id_Evento: 0,
      Id_TipoEvento: 0,
      Des_Evento: '',
      Fec_Evento: new Date(),
      Lugar: '',
      Flg_Estado: '',
      Fltr_Sexo: '',
      Fltr_Tipo: '',
      Fltr_Sede: 0,
      Fltr_Padre: 0,
      Fltr_Onomastico: 0,
      Fltr_Dependiente: 0,
      Fltr_TopeEdad: 0,
      Fltr_Ingreso: new Date(),
      Fec_Cierre: new Date(),
      Flg_Activo: 0,
      Usu_Registro: GlobalVariable.vusu,
      Detalle: []
    }

    this.spinnerService.show();
    this.eventosService.registroEventosColaborador(data)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.spinnerService.hide();
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }

  onInsertarRegistro(){
    let evento: Evento = {Accion: 'I', Id_Evento: 0, Fec_Evento: new Date(), Flg_Estado: 'P', Fltr_Sexo: 'T', Fltr_Tipo: '00', Fltr_Sede: 0, Fltr_Padre: 0, Fltr_Onomastico: 0, Fltr_Dependiente: 0, Fltr_TopeEdad: 0, Fltr_Ingreso: new Date(), Fec_Cierre: new Date(1900,0,1,0,0,0), Flg_Activo: 1, Usu_Registro: GlobalVariable.vusu, Detalle: []};

    let dialogRef = this.dialog.open(DialogRegistroComponent, {
      disableClose: true,
      width: "1000px",
      data: evento
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        evento = result;
        //evento.Fec_Evento = new Date(_moment(evento.Fec_Evento).format())
        evento.Fec_Evento = new Date(evento.Fec_Evento + ':00');  // Agregar los segundos a la fecha
        this.registarEvento(evento);
      }
    });
  }

  onExportarRegistro(){
    this.dataForExcel = [];
    if(this.dataSource.filteredData.length > 0){
      let dataReporte: any[] = [];
      
      this.dataSource.filteredData.forEach((row: any) => {
        let data: any = {};

        data.FechaEvento = this.datePipe.transform(row.Fec_Evento, 'yyyy-MM-dd HH:mm');
        data.TipoEvento = row.Des_TipoEvento;
        data.Descripcion = row.Des_Evento;
        data.Lugar = row.Lugar;
        data.Personal = row.Personal;
        data.Sede = row.Sede;
        data.SoloPadres = row.Para_Padres;
        data.EventoHijos = row.Para_Hijos;
        data.Estado = row.Flg_Estado == 'P' ? 'PENDIENTE' : row.Flg_Estado == 'A' ? 'ACTIVO' : 'CERRADO';
        data.FechaCierre = this.datePipe.transform(row.Fec_Cierre, 'yyyy-MM-dd HH:mm');  //row.Fec_Cierre;
        data.FechaRegistro = this.datePipe.transform(row.Fec_Registro['date'], 'yyyy-MM-dd HH:mm:ss');
        dataReporte.push(data);
      });      

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REGISTRO DE EVENTOS',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);

    } else{
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }
  
  onEditarRegistro(evento: Evento){
    let data: Evento = {
      Accion: 'E',
      Id_Evento: evento.Id_Evento,
      Id_TipoEvento: 0,
      Des_Evento: '',
      Fec_Evento: new Date(),
      Lugar: '',
      Flg_Estado: '',
      Fltr_Sexo: '',
      Fltr_Tipo: '',
      Fltr_Sede: 0,
      Fltr_Padre: 0,
      Fltr_Onomastico: 0,
      Fltr_Dependiente: 0,
      Fltr_TopeEdad: 0,
      Fltr_Ingreso: new Date(),
      Fec_Cierre: new Date(),
      Flg_Activo: 0,
      Usu_Registro: GlobalVariable.vusu,
      Detalle: []
    }

    this.eventosService.registroEventosColaborador(data)
      .subscribe((result: any) => {
        if (result.length > 0) {
          evento = result[0];
          evento.Accion = 'U';
          evento.Fec_Cierre = evento.Fec_Cierre ? new Date(evento.Fec_Cierre) : new Date(1900,0,1,0,0,0);
          evento.Usu_Registro = GlobalVariable.vusu;

          let dialogRef = this.dialog.open(DialogRegistroComponent, {
            disableClose: true,
            width: "1000px",
            data: evento
          });

          dialogRef.afterClosed().subscribe(result => {
            if(result){
              evento = result;
              console.log(evento)
              console.log(evento.Fec_Evento)
              //evento.Fec_Evento = new Date(_moment(evento.Fec_Evento).format())
              evento.Fec_Evento = new Date(evento.Fec_Evento + ':00');  // Agregar los segundos a la fecha
              this.registarEvento(evento);
            }
          });
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  onAnularRegistro(idEvento: number){
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        let data: Evento = {
          Accion: 'D',
          Id_Evento: idEvento,
          Id_TipoEvento: 0,
          Des_Evento: '',
          Fec_Evento: new Date(),
          Lugar: '',
          Flg_Estado: '',
          Fltr_Sexo: '',
          Fltr_Tipo: '',
          Fltr_Sede: 0,
          Fltr_Padre: 0,
          Fltr_Onomastico: 0,
          Fltr_Dependiente: 0,
          Fltr_TopeEdad: 0,
          Fltr_Ingreso: new Date(),
          Fec_Cierre: new Date(),
          Flg_Activo: 0,
          Usu_Registro: GlobalVariable.vusu,
          Detalle: []
        }

        this.eventosService.registroEventosColaborador(data)
          .subscribe((result: any) => {
            if (result.length > 0) {
              if (result[0].Id_Registro > 0){
                this.listarEventos();
                this.matSnackBar.open('Anulación Ok', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
              } else {
                Swal.fire(result[0].Respuesta, '', 'warning')
              }
              this.listarEventos();
            }else{
              this.matSnackBar.open('Error al anular el evento!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        );
      }
    });
  }

  onCerrarRegistro(evento: Evento){
    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Desea cerrar el evento: " + evento.Des_Evento + "?" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        let data: Evento = {
          Accion: 'C',
          Id_Evento: evento.Id_Evento,
          Id_TipoEvento: 0,
          Des_Evento: '',
          Fec_Evento: new Date(),
          Lugar: '',
          Flg_Estado: '',
          Fltr_Sexo: '',
          Fltr_Tipo: '',
          Fltr_Sede: 0,
          Fltr_Padre: 0,
          Fltr_Onomastico: 0,
          Fltr_Dependiente: 0,
          Fltr_TopeEdad: 0,
          Fltr_Ingreso: new Date(),
          Fec_Cierre: new Date(),
          Flg_Activo: 0,
          Usu_Registro: GlobalVariable.vusu,
          Detalle: []
        }

        this.eventosService.registroEventosColaborador(data)
          .subscribe((result: any) => {
            if (result.length > 0) {
              if (result[0].Id_Registro > 0){
                this.listarEventos();
                Swal.fire('Eveto cerrado', '', 'warning')
              } else {
                Swal.fire(result[0].Respuesta, '', 'warning')
              }
            } else {
              this.matSnackBar.open('Error al cerrar el evento!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        );
      }
    });
  }

  registarEvento(evento: Evento){
    this.spinnerService.show();
    this.eventosService.registroEventosColaborador(evento)
      .subscribe((result: any) => {
        if (result.length > 0) {
          if (result[0].Id_Registro > 0){
            this.listarEventos();
            this.matSnackBar.open('Registro Ok', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
          } else {
            Swal.fire(result[0].Respuesta, '', 'warning')
          }
        }else{
          this.matSnackBar.open('Error en el registro del evento!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
        }
        this.spinnerService.hide();
        this.listarEventos();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}


