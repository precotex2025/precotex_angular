import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalVariable } from '../../../../../VarGlobals'; //<==== this one
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlGuiaService } from '../../../../../services/seguridad-control-guia.service';

import * as _moment from 'moment';

import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

interface Listar_Personal_Autoriza {
  nom_autoriza: string;
}

@Component({
  selector: 'app-seguridad-control-memorandum-detalle',
  templateUrl: './seguridad-control-memorandum-detalle.component.html',
  styleUrls: ['./seguridad-control-memorandum-detalle.component.scss']
})
export class SeguridadControlMemorandumDetalleComponent implements OnInit {

  listar_personal_autoriza: Listar_Personal_Autoriza[] = [];
  sCod_Accion             = 'I'
  nNum_Memorandum         = GlobalVariable.Num_Memorandum
  nNum_Planta             = GlobalVariable.num_planta
  des_planta              = ''

  texto_libre             = ''
  dni_emisor              = ''
  nom_emisor              = ''

  dni_recptor             = ''
  nom_receptor            = ''


  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    num_memorandum: [''],
    fec_registro: [''],
    dni_emisor: [''],
    nom_emisor: [''],
    dni_receptor: [''],
    nom_receptor: [''],
    asunto: [''],
    nom_autoriza: [''],
    glosa: [''],
    num_cantidad: [0],
    num_peso: [0]
  })
  
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private seguridadControlGuiaService: SeguridadControlGuiaService,
    private router: Router) { }

  ngOnInit(): void {
    this.MostrarTitulo()
    this.ListaPersonalAutoriza()

    if (this.nNum_Memorandum != 0) {
        this.sCod_Accion = "U"
        this.MostrarDatosMemorandum()

    } 
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

  Guardar(){
    this.seguridadControlGuiaService.GuardarMemorandumService(
      this.sCod_Accion,
      this.nNum_Planta, 
      this.nNum_Memorandum,     
      this.formulario.get('fec_registro')?.value,
      this.formulario.get('dni_emisor')?.value,
      this.formulario.get('dni_receptor')?.value,
      this.formulario.get('asunto')?.value,
      this.formulario.get('nom_autoriza')?.value,
      this.formulario.get('glosa')?.value,
      this.formulario.get('num_cantidad')?.value,
      this.formulario.get('num_peso')?.value).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })

            this.router.navigate(['/SeguridadControlMemorandum']);
            
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 }))    
  }  

  BuscarNomTrabajador(sTipo: string) {
    if (sTipo == 'E') {
      this.texto_libre = this.formulario.get('dni_emisor')?.value
    } else {
      this.texto_libre = this.formulario.get('dni_receptor')?.value
    }
 
    if (this.texto_libre == null) {

    }else if (sTipo == 'E' && (this.texto_libre.length < 8 || this.texto_libre.length > 10)) {
      this.nom_emisor = ''
    }else if (sTipo == 'R' && (this.texto_libre.length < 8 || this.texto_libre.length > 10)) {
      this.nom_receptor = ''
    } else {

      this.seguridadControlGuiaService.BuscarNomTrabajadorService(this.texto_libre).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {

            if (sTipo == 'E') {
              this.formulario.patchValue({ nom_emisor: result[0].Nombres })
              this.nom_emisor = result[0].Nombres
            } else {
              this.formulario.patchValue({ nom_receptor: result[0].Nombres })
              this.nom_receptor = result[0].Nombres
            }

          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })

            if (sTipo == 'E'){
              this.nom_receptor = ''
            }

            if (sTipo == 'R'){
              this.nom_receptor = ''
            }  
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 }))
    }
  }  

  ListaPersonalAutoriza() {
    this.seguridadControlGuiaService.ListarPersonalAutoriza().subscribe(
      (result: any) => {
        //console.log(result)
        this.listar_personal_autoriza = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  MostrarDatosMemorandum() {
    this.seguridadControlGuiaService.MostrarDatosMemorandumService(this.nNum_Memorandum).subscribe(
        (result: any) => {

          if (result[0].Respuesta == 'OK') {
            
            this.formulario.patchValue({ num_memorandum: result[0].num_memorandum })
            this.formulario.patchValue({ fec_registro: result[0].fec_registro })
            this.formulario.patchValue({ dni_emisor: result[0].dni_emisor })
            this.formulario.patchValue({ nom_emisor: result[0].nom_emisor })
            this.formulario.patchValue({ dni_receptor: result[0].dni_receptor })
            this.formulario.patchValue({ nom_receptor: result[0].nom_receptor })
            this.formulario.patchValue({ asunto: result[0].asunto })
            this.formulario.patchValue({ nom_autoriza: result[0].nom_autoriza })
            this.formulario.patchValue({ glosa: result[0].glosa })
            this.formulario.patchValue({ num_cantidad: result[0].num_cantidad })
            this.formulario.patchValue({ num_peso: result[0].num_peso })

            this.nom_emisor      = result[0].nom_emisor
            this.nom_receptor    = result[0].nom_receptor

            //this.formulario.patchValue({ fec_registro: _moment(result[0].fec_registro).format('YYYY-MM-DDTHH:mm:ss') })

          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500, })
          }

        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }

}
