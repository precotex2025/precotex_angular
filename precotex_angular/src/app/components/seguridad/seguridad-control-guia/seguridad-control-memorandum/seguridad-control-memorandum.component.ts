import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlGuiaService } from '../../../../services/seguridad-control-guia.service';

import { MatDialog } from "@angular/material/dialog";

import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-seguridad-control-memorandum',
  templateUrl: './seguridad-control-memorandum.component.html',
  styleUrls: ['./seguridad-control-memorandum.component.scss']
})
export class SeguridadControlMemorandumComponent implements OnInit {

  nNum_Planta = GlobalVariable.num_planta;
  des_planta = ''

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    fec_registro: ['']
  })

  displayedColumns_cab: string[] = ['hora', 'de', 'para', 'nom_autorizado', 'asunto', 'modificar', 'eliminar']

  public data_det = [{
    num_memorandum: "",
    hora: "",
    de: "",
    para: "",
    nom_autorizado: "",
    asunto: ""
  }]

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private seguridadControlGuiaService: SeguridadControlGuiaService,
    public dialogo: MatDialog) { }

    ngOnInit(): void {
      this.MostrarTitulo()
      this.ListarMemorandum()
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

  ListarMemorandum() {
    this.seguridadControlGuiaService.ListarMemorandumService(this.nNum_Planta,
      this.formulario.get('fec_registro')?.value).subscribe(
        (result: any) => {
          this.data_det = result
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }  

  Adicionar(){
    GlobalVariable.Num_Memorandum = 0
  }

  Modificar(nNum_Memorandum: number) {
    GlobalVariable.Num_Memorandum = nNum_Memorandum

    // this.nNum_Memorandum = nNum_Memorandum

    // this.auditoriaLineaCosturaService.ViewAuditoriaService_Det(this.nNum_Auditoria_Activo).subscribe(
    //   (result: any) => {
    //     this.data_det = result
    //     //data_det_prueba = new MatTableDataSource(result);
    //     // dataSource = new MatTableDataSource(result);
    //     this.Visible_Detalle_Auditoria = true
    //   },
    //   (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
    //     duration: 1500,
    //   }))


  }

  Eliminar(nNum_Memorandum: number) {
 
    this.seguridadControlGuiaService.GuardarMemorandumService(
      'D',
      this.nNum_Planta, 
      nNum_Memorandum,     
      '',
      '',
      '',
      '',
      '',
      '',
      1,
      1).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })

            this.ListarMemorandum()
            
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 }))  
  }  

}
