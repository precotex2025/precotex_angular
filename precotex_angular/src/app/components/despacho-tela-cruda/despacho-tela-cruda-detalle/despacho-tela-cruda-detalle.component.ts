import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { GlobalVariable } from '../../../VarGlobals'; //<==== this one
import { DespachoTelaCrudaService } from '../../../services/despacho-tela-cruda.service';

 
@Component({
  selector: 'app-despacho-tela-cruda-detalle',
  templateUrl: './despacho-tela-cruda-detalle.component.html',
  styleUrls: ['./despacho-tela-cruda-detalle.component.scss']
})
export class DespachoTelaCrudaDetalleComponent implements OnInit { 

  sCod_OrdTra = GlobalVariable.cod_ordtra;
  nNum_Movstk_Activo = GlobalVariable.num_movdespacho;
  sCodigo_Barras = '';
  sAccion = '';

  @ViewChild('myinputAdd') inputAdd!: ElementRef;
  @ViewChild('myinputDel') inputDel!: ElementRef;

  //* Declaramos formulario para obtener los controles */
  form = this.formBuilder.group({
    partida: [''],
    bulto_añadir: [''],
    bulto_eliminar: ['']
  })

  displayedColumns_cab: string[] = ['secuencia', 'tela', 'peso', 'bultos']

  public data_det = [{
    secuencia: "",
    tela: "",
    peso: "", 
    bultos: ""
  }] 

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private despachoTelaCrudaService: DespachoTelaCrudaService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'partida': new FormControl(''),
      'bulto_añadir': new FormControl(''),
      'bulto_eliminar': new FormControl(''),
    });
    this.VerDetalleMovimiento();
    
    this.form.patchValue({ partida: this.sCod_OrdTra })
  }

  Regresar() {
  }

  // applyEnter(event: any) {
  //   //this.sCodigo_Barras = event.target.value;   
  //   this.AñadirBulto(event.target.value)
  // }
  applyEnterPartida(event: any) {
    //this.sCodigo_Barras = event.target.value;   
    this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"
  }

  applyEnterAdd(event: any) {
    //this.sCodigo_Barras = event.target.value;   
    this.AnadirBulto()
  }

  applyEnterDel(event: any) {
    //this.sCodigo_Barras = event.target.value;   
    this.EliminarBulto()
  }

  AnadirBulto() {

    this.sAccion = 'I';
    this.sCod_OrdTra = this.form.get('partida')?.value
    this.sCodigo_Barras = this.form.get('bulto_añadir')?.value

    if (this.sCod_OrdTra.length < 5) {
      this.ReproducirError();
      this.matSnackBar.open("Partida Longitud Incorrecta", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else if (this.sCodigo_Barras.length >= 5) {

      if (this.nNum_Movstk_Activo.length == 0) {
        //creamos el movimiento
        this.GenerarMovimiento();
      }

      else if (this.nNum_Movstk_Activo.length > 4) {
        //insertamos el detalle
        this.LecturarBulto(this.sAccion);
      }

    }
    else if (this.sCodigo_Barras.length > 2) {
      this.ReproducirError();
      this.matSnackBar.open("Rollo Longitud Incorrecta", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"

  }

  EliminarBulto() {
    this.sAccion = 'D';
    this.sCodigo_Barras = this.form.get('bulto_eliminar')?.value

    if (this.sCodigo_Barras.length >= 5) {

      if (this.nNum_Movstk_Activo.length == 0) {
        this.ReproducirError();
        this.matSnackBar.open("Movimiento vacio", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }

      if (this.nNum_Movstk_Activo.length > 4) {
        //insertamos el detalle
        this.LecturarBulto(this.sAccion);
      }

    }
    else if (this.sCodigo_Barras.length > 2) {
      this.ReproducirError();
      this.matSnackBar.open("Rollo Longitud Incorrecta", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    this.inputDel.nativeElement.focus() // hace focus sobre "myInput"

  }

  ReproducirError() {
    const audio = new Audio('assets/error.mp3');
    audio.play();
  }
 
  ReproducirOk() {
    const audio = new Audio('assets/aceptado.mp3');
    audio.play();
  } 

  GenerarMovimiento() {
    this.nNum_Movstk_Activo = '';

    this.despachoTelaCrudaService.GenerarMovimiento(this.sCod_OrdTra, this.sCodigo_Barras).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK') {
          this.nNum_Movstk_Activo = result[0].Num_Movstk

          this.LecturarBulto(this.sAccion);
        }
        else {
          this.ReproducirError();
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.ReproducirError();
        this.matSnackBar.open(err.message, 'Cerrar', {
          horizontalPosition: 'center', verticalPosition: 'top', duration: 1500
        })
      })
  } 

  LecturarBulto(Accion: string) {
    this.despachoTelaCrudaService.LecturarBulto(Accion, 'T7', this.nNum_Movstk_Activo, this.sCodigo_Barras).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK') {
          this.ReproducirOk;
          this.form.patchValue({ bulto_añadir: '' });
          this.form.patchValue({ bulto_eliminar: '' });
          this.VerDetalleMovimiento();
        }
        else {
          this.ReproducirError();
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.ReproducirError();
        this.matSnackBar.open(err.message, 'Cerrar', {
          horizontalPosition: 'center', verticalPosition: 'top', duration: 1500
        })
      })
  }

  VerDetalleMovimiento() {
    this.despachoTelaCrudaService.MovimientoDespachoService(this.nNum_Movstk_Activo).subscribe(
      (result: any) => {
        this.data_det = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        horizontalPosition: 'center', verticalPosition: 'top', duration: 1500
      }))
  }
}
