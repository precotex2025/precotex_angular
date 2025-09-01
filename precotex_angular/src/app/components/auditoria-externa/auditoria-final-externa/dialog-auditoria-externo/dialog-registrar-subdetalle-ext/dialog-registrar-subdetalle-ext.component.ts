import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';


interface data{
  Num_Auditoria_Detalle:  number
  Cod_Motivo:             string
  Descripcion:            string
  Cantidad:               number
}

@Component({
  selector: 'app-dialog-registrar-subdetalle-ext',
  templateUrl: './dialog-registrar-subdetalle-ext.component.html',
  styleUrls: ['./dialog-registrar-subdetalle-ext.component.scss']
})
export class DialogRegistrarSubdetalleExtComponent implements OnInit {

 
  
  // nuevas variables
  Cod_Accion                = ''
  Num_Auditoria_Sub_Detalle = 0
  Num_Auditoria_Detalle     = this.data.Num_Auditoria_Detalle
  Cod_Motivo                = ''
  Cantidad                  = 0
  Cod_Usuario               = ''
  Cod_Auditor               = ''
  Nom_Auditor               = ''
  Cod_OrdPro                = ''
  Can_Lote                  = 0
  Titulo                    = ''

  myControl = new FormControl();
  Fecha = new FormControl(new Date())

  formulario = this.formBuilder.group({
    Cod_Motivo:    [''],
    Descripcion:   [''],
    Cantidad:      [''],
  }) 

  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
              @Inject(MAT_DIALOG_DATA) public data: data) 
  {

    this.formulario = formBuilder.group({
      Cod_Motivo:    ['', Validators.required],
      Descripcion:   ['', Validators.required],
      Cantidad:      ['', Validators.required],

    });

  }

  ngOnInit(): void {

  this.formulario.controls['Descripcion'].disable()
  this.Titulo     = this.data.Cod_Motivo
   if(this.Titulo  != undefined){
      this.formulario.controls['Cod_Motivo'].setValue(this.data.Cod_Motivo)
      this.formulario.controls['Descripcion'].setValue(this.data.Descripcion)
      this.formulario.controls['Cantidad'].setValue(this.data.Cantidad)
      this.formulario.controls['Cod_Motivo'].disable()
      this.formulario.controls['Descripcion'].disable()
   }
   
  }



/* --------------- REGISTRAR CABECERA ------------------------------------------ */

  submit(formDirective) :void {
 
    this.Cod_Accion    = 'I'
    if(this.Titulo     != undefined){
      this.Cod_Accion  = 'U'
    }
    this.Num_Auditoria_Sub_Detalle  = 0
    this.Num_Auditoria_Detalle      = this.data.Num_Auditoria_Detalle
    this.Cod_Motivo                 = this.formulario.get('Cod_Motivo')?.value
    this.Cantidad                   = this.formulario.get('Cantidad')?.value
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaSubDetalleService(
      this.Cod_Accion,
      this.Num_Auditoria_Sub_Detalle,
      this.Num_Auditoria_Detalle,
      this.Cod_Motivo,
      this.Cantidad 
      ).subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
              console.log(result)
              //if(this.Titulo == undefined){
                //this.limpiar()
                formDirective.resetForm();
                this.formulario.reset();
              //}
            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
              
            }
            else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
        )
    
  }

/* --------------- LIMPIAR INPUTS ------------------------------------------ */
  limpiar(){

    /*this.formulario.controls['Vehiculo'].setValue('')
    this.formulario.controls['Placa'].setValue('')
    this.formulario.controls['codBarras'].setValue('')
    this.formulario.controls['soat'].setValue('')
    this.formulario.controls['Fec_Fin_Lic'].setValue('')
    this.formulario.controls['tarjetaProp'].setValue('')
    this.formulario.controls['tCarga'].setValue('')
    this.formulario.controls['tDescarga'].setValue('')
    this.formulario.controls['conductor'].setValue('')*/
   
    
  }


  BuscarMotivo(){
    this.Cod_Motivo   = this.formulario.get('Cod_Motivo')?.value
    if(this.Cod_Motivo.length > 0 ){
        if( this.Cod_Motivo.length == 3){
        this.Cod_Accion   = 'B'
        this.Cod_Auditor  = ''
        this.Nom_Auditor  = ''
        this.Cod_OrdPro   = ''
        this.Can_Lote     = 0
        this.Cod_Motivo   = this.formulario.get('Cod_Motivo')?.value
        this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
          this.Cod_Accion,
          this.Cod_Auditor,
          this.Nom_Auditor,
          this.Cod_OrdPro,
          this.Can_Lote,
          this.Cod_Motivo
          ).subscribe(
          (result: any) => {
            if(result.length > 0){
            this.formulario.controls['Cod_Motivo'].setValue(result[0].Cod_Motivo)
            this.formulario.controls['Descripcion'].setValue(result[0].Descripcion)
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      }else{
        this.formulario.controls['Descripcion'].setValue('')
      }
    }
  } 

}
