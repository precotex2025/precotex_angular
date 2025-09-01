import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';

interface data{
  Num_Auditoria_Detalle:  number
  Cod_Motivo:             string
  Descripcion:            string
  Cantidad:               number
}

@Component({
  selector: 'app-dialog-registrar-vaporizado-defectos',
  templateUrl: './dialog-registrar-vaporizado-defectos.component.html',
  styleUrls: ['./dialog-registrar-vaporizado-defectos.component.scss']
})
export class DialogRegistrarVaporizadoDefectosComponent implements OnInit {

  Cod_Accion                = ''
  Num_Auditoria_Defecto = 0
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
    private auditoriaAcabadosService: AuditoriaAcabadosService,   
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,            
    @Inject(MAT_DIALOG_DATA) public data: data,
    private dialogRef: MatDialogRef<DialogRegistrarVaporizadoDefectosComponent>) {

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

  submit(formDirective) :void {
 
    this.Cod_Accion    = 'I'
    if(this.Titulo     != undefined){
      this.Cod_Accion  = 'U'
    }
    this.Num_Auditoria_Defecto  = 0
    this.Num_Auditoria_Detalle      = this.data.Num_Auditoria_Detalle
    this.Cod_Motivo                 = this.formulario.get('Cod_Motivo')?.value
    this.Cantidad                   = this.formulario.get('Cantidad')?.value

    this.auditoriaAcabadosService.Mant_AuditoriaModuloVaporizadoDefectosDetService(
      this.Cod_Accion,
      this.Num_Auditoria_Defecto,
      this.Num_Auditoria_Detalle,
      this.Cod_Motivo,
      this.Cantidad 
      ).subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
              console.log(result)
              //if(this.Titulo == undefined){
                formDirective.resetForm();
                this.formulario.reset();
              //}
            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            this.dialogRef.close();
            }
            else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
        )
    
  }

  BuscarMotivo(){
    this.Cod_Motivo   = this.formulario.get('Cod_Motivo')?.value
    console.log("this.Cod_Motivo")
    console.log(this.Cod_Motivo)
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
            console.log(result)
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
