import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlGuiaService } from '../../../../services/seguridad-control-guia.service';

import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
 
@Component({
  selector: 'app-seguridad-control-guia-historial',
  templateUrl: './seguridad-control-guia-historial.component.html',
  styleUrls: ['./seguridad-control-guia-historial.component.scss']
})
export class SeguridadControlGuiaHistorialComponent implements OnInit {

  nNum_Planta = GlobalVariable.num_planta;
  des_planta = ''

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    fec_registro: [''],
    guia: ['']
  })

  displayedColumns_cab: string[] = ['hora', 'tipo', 'num_guia', 'proveedor', 'num_peso', 'detalle']

  public data_det = [{
    hora: "",
    tipo: "",
    num_guia: "",
    proveedor: ""
  }] 
 
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private seguridadControlGuiaService: SeguridadControlGuiaService) { }

  ngOnInit(): void {
    this.MostrarTitulo()
  }
 
  MostrarTitulo() {
    if (GlobalVariable.num_planta == 1) {
      this.des_planta = 'Santa Maria'
    } else if (GlobalVariable.num_planta == 2) {
      this.des_planta = 'Santa Cecilia'
    } else if (GlobalVariable.num_planta == 3) {
      this.des_planta = 'Huachipa Sede I'
    } else if (GlobalVariable.num_planta == 4) {
      this.des_planta = 'Huachipa Sede II'
    } else if (GlobalVariable.num_planta == 5) {
      this.des_planta = 'Independencia'
    } else if (GlobalVariable.num_planta == 14) {
      this.des_planta = 'Independencia II'
    } else if (GlobalVariable.num_planta == 13) {
      this.des_planta = 'Santa Rosa'
    } else if (GlobalVariable.num_planta == 15) {
      this.des_planta = 'Faraday'
    } else if (GlobalVariable.num_planta == 17) {
      this.des_planta = 'Huachipa Sede III'
    } else {
      this.des_planta = ''
    }
  }
 
  ListarHistorial() {
    this.seguridadControlGuiaService.ListarHistoritalService(this.nNum_Planta,
      this.formulario.get('fec_registro')?.value, this.formulario.get('guia')?.value).subscribe(
        (result: any) => {
          this.data_det = result
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }

  EliminarRegistro(sNum_Guia: string, sCod_Proveedor: string) {
    this.seguridadControlGuiaService.EliminarRegistroService(
      this.nNum_Planta,
      sNum_Guia,
      sCod_Proveedor).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

            this.ListarHistorial()
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

}
 