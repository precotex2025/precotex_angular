import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelect } from '@angular/material/select';

interface data{
  Num_Placa:    string
  Cod_Vehiculo: string
}

interface Conductor {
  Nombres: string;
  Cod_Conductor: string;

}

@Component({
  selector: 'app-dialog-vehiculo-registrar-vehiculo',
  templateUrl: './dialog-vehiculo-registrar-vehiculo.component.html',
  styleUrls: ['./dialog-vehiculo-registrar-vehiculo.component.scss']
})
export class DialogVehiculoRegistrarVehiculoComponent implements OnInit {
  
  listar_operacionConductor: Conductor[] = [];

  Des_Vehiculo      = ''
  Num_Placa         = ''
  Cod_Accion        = ''
  Cod_Barras        = ''
  Flg_Activo        = ''
  Cod_Conductor     = ''
  Num_Soat          = ''
  Fec_Fin_Soat      = ''
  Num_Tarjeta_Prop  = ''
  Tmp_Carga         = ''
  Tmp_Descarga      = ''
  Cod_Vehiculo      = ''
  Titulo            = ''
  

  
  /*myControl = new FormControl();
  fec_registro = new FormControl(new Date())*/

  formulario = this.formBuilder.group({
    Vehiculo:       [''],
    Placa:          [''],
    codBarras:      [''],
    soat:           [''],
    tarjetaProp:    [''],
    tCarga:         [''],
    Fec_Fin_Lic:    [''],
    tDescarga:      [''],
    conductor:      [''],
  }) 

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, private seguridadControlVehiculoService: SeguridadControlVehiculoService
    , @Inject(MAT_DIALOG_DATA) public data: data
  ) {

    this.formulario = formBuilder.group({
      Vehiculo:       ['', Validators.required],
      Placa:          ['', Validators.required],
      codBarras:      ['', Validators.required],
      soat:           ['', Validators.required],
      tarjetaProp:    ['', Validators.required],
      tCarga:         ['', Validators.required],
      Fec_Fin_Lic:    ['', Validators.required],
      tDescarga:      ['', Validators.required],
      conductor:      ['', Validators.required],
    });
  }
  ngOnInit(): void {
   this.CargarOperacionConductor()
   this.Titulo        = this.data.Num_Placa
   this.Num_Placa     = this.data.Num_Placa
   this.Cod_Vehiculo  = this.data.Cod_Vehiculo
   if(this.Titulo != undefined){
      this.CompletarDatosModificarRegistro()
   }
   else{
     this.formulario.controls['tCarga'].setValue('00')
     this.formulario.controls['tDescarga'].setValue('00')
   }




  }

  CompletarDatosModificarRegistro(){
    this.Cod_Accion = 'L'
    this.seguridadControlVehiculoService.mantenimientoVehiculoService(
      this.Cod_Accion,
      this.Des_Vehiculo,
      this.Num_Placa,
      this.Cod_Barras,
      this.Flg_Activo,
      this.Num_Soat,
      this.Fec_Fin_Soat,
      this.Num_Tarjeta_Prop,
      this.Tmp_Carga,
      this.Tmp_Descarga,
      this.Cod_Conductor,
      this.Cod_Vehiculo
      ).subscribe(
      (result: any) => {
          console.log(result)

          this.formulario.controls['Vehiculo'].setValue(result[0].Des_Vehiculo)
          this.formulario.controls['Placa'].setValue(result[0].Num_Placa)
          this.formulario.controls['codBarras'].setValue(result[0].Cod_Barras)
          this.formulario.controls['soat'].setValue(result[0].Num_Soat)
          this.formulario.controls['tarjetaProp'].setValue(result[0].Num_Tarjeta_Prop)
          this.formulario.controls['tCarga'].setValue(result[0].Tmp_Carga)
          this.formulario.controls['tDescarga'].setValue(result[0].Tmp_Descarga)
          this.formulario.controls['conductor'].setValue(result[0].Cod_Conductor)
          this.formulario.get('Fec_Fin_Lic').setValue(result[0].Fec_Fin_Soat['date'])
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    )
  }

  submit(formDirective) :void {
    console.log(this.Cod_Vehiculo)
    if (this.formulario.valid) {
      this.Cod_Accion   = 'I'
      if(this.Titulo != undefined){
        this.Cod_Accion = 'U'
      }

    this.Des_Vehiculo     = this.formulario.get('Vehiculo')?.value
    this.Num_Placa        = this.formulario.get('Placa')?.value
    this.Cod_Barras       = this.formulario.get('codBarras')?.value
    this.Flg_Activo       = 'S'
    this.Num_Soat         = this.formulario.get('soat')?.value
    this.Fec_Fin_Soat     = this.formulario.get('Fec_Fin_Lic')?.value
    this.Num_Tarjeta_Prop = this.formulario.get('tarjetaProp')?.value
    this.Tmp_Carga        = this.formulario.get('tCarga')?.value
    this.Tmp_Descarga     = this.formulario.get('tDescarga')?.value
    this.Cod_Conductor    = this.formulario.get('conductor')?.value
      this.seguridadControlVehiculoService.mantenimientoVehiculoService(
      this.Cod_Accion,
      this.Des_Vehiculo,
      this.Num_Placa,
      this.Cod_Barras,
      this.Flg_Activo,
      this.Num_Soat,
      this.Fec_Fin_Soat,
      this.Num_Tarjeta_Prop,
      this.Tmp_Carga,
      this.Tmp_Descarga,
      this.Cod_Conductor,
      this.Cod_Vehiculo
      ).subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
              console.log(result)
              if(this.Titulo == undefined){
                this.limpiar()
                formDirective.resetForm();
                this.formulario.reset();
              }
              

            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
              
            }
            else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
        )
    }
    else {
      this.matSnackBar.open('Rellene todos los campos!!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
    
  }


  limpiar(){

    this.formulario.controls['Vehiculo'].setValue('')
    this.formulario.controls['Placa'].setValue('')
    this.formulario.controls['codBarras'].setValue('')
    this.formulario.controls['soat'].setValue('')
    this.formulario.controls['Fec_Fin_Lic'].setValue('')
    this.formulario.controls['tarjetaProp'].setValue('')
    this.formulario.controls['tCarga'].setValue('')
    this.formulario.controls['tDescarga'].setValue('')
    this.formulario.controls['conductor'].setValue('')
   
    
  }

  CargarOperacionConductor(){
  
    this.Cod_Accion       = 'C'
    this.Des_Vehiculo     = ''
    this.Num_Placa        = ''
    this.Cod_Barras       = ''
    this.Flg_Activo       = ''
    this.Num_Soat         = ''
    this.Fec_Fin_Soat     = ''
    this.Num_Tarjeta_Prop = ''
    this.Tmp_Carga        = ''
    this.Tmp_Descarga     = ''
    this.Cod_Conductor    = ''
    this.seguridadControlVehiculoService.mantenimientoVehiculoService(
      this.Cod_Accion,
      this.Des_Vehiculo,
      this.Num_Placa,
      this.Cod_Barras,
      this.Flg_Activo,
      this.Num_Soat,
      this.Fec_Fin_Soat,
      this.Num_Tarjeta_Prop,
      this.Tmp_Carga,
      this.Tmp_Descarga,
      this.Cod_Conductor,
      this.Cod_Vehiculo
      ).subscribe(
      (result: any) => {
        this.listar_operacionConductor = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  
  
  }


}
