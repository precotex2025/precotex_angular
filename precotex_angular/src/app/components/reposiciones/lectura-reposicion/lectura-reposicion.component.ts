import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { ReposicionesService } from 'src/app/services/reposiciones/reposiciones.service';
import { GlobalVariable } from 'src/app/VarGlobals';

export interface PeriodicElement {
  Fec_Permiso: string;
  Nom_Trabajador: string;
  Inicio: string;
  Inicio_Lectura: string;
  Tipo_Lectura: string;
  Sede: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

];

@Component({
  selector: 'app-lectura-reposicion',
  templateUrl: './lectura-reposicion.component.html',
  styleUrls: ['./lectura-reposicion.component.scss']
})
export class LecturaReposicionComponent implements OnInit {

  Num_Solicitud: any = '';
  Tipo: any = '';
  Conductor: any = '';
  dataReposiciones: Array<any> = [];
  dataChoferes: Array<any> = [];
  constructor(private reposicionesService: ReposicionesService, private matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getChoferes();
  }


  keyupSolicitud(event) {

  }

  changeSolicitud() {
    if (this.Num_Solicitud.length == 8) {
      this.Tipo = '';
      this.Conductor = '';
      this.reposicionesService.getReposiciones('T', this.Num_Solicitud, '', '').subscribe(
        (result: any) => {
          console.log(result);
          if (result != false && result.length > 0) {
            this.dataReposiciones = result;
          } else {
            this.matSnackBar.open('El numero de solicitud no existe, o aún no se encuentra aprobada.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          }
        },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
        })
    }
  }

  getChoferes() {
    this.reposicionesService.listaChoferesService().subscribe(
      (result: any) => {
        console.log(result);
        this.dataChoferes = result;
      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      })
  }

  limpiarValor() {
    console.log('borrar');
    this.Num_Solicitud = '';
    this.dataReposiciones = [];
  }

  validarTipo() {

  }

  registrarSeguridad() {
    console.log(this.Tipo);
    console.log(this.Conductor);
    if (this.Num_Solicitud != '' && this.Tipo != '') {
      if(this.Tipo == 'S' || this.Tipo == 'SD'){
        if(this.Conductor != ''){
          console.log('con conductor')
          this.reposicionesService.saveLecturaReposiciones(this.Tipo, this.Num_Solicitud, GlobalVariable.vusu, this.Conductor).subscribe(
            (result: any) => {
              console.log(result);
              if (result[0]['status'] == 1) {
                this.matSnackBar.open('Se actualizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
                this.changeSolicitud();
              } else {
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
              }
            },
            (err: HttpErrorResponse) => {
              this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
            })
        }else{
          this.matSnackBar.open('Debes ingresar el Chofer.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
        }
      }else{
        console.log('tipo diferente a S')
        this.reposicionesService.saveLecturaReposiciones(this.Tipo, this.Num_Solicitud, GlobalVariable.vusu, this.Conductor).subscribe(
          (result: any) => {
            console.log(result);
            if (result[0]['status'] == 1) {
              this.matSnackBar.open('Se actualizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
              this.changeSolicitud();
            } else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          })
      }
      
    } else {
      this.matSnackBar.open('Debes ingresar el N° de Solicitud y el Tipo.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
    }

  }
}
