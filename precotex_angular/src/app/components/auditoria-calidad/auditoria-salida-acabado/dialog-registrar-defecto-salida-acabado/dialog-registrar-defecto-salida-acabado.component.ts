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
  Num_Auditoria_Defecto:  number;
  Num_Auditoria: number;
  Cod_Defecto: string;
  Descripcion: string;
  Cantidad: number;
  Tipo: string;
}

@Component({
  selector: 'app-dialog-registrar-defecto-salida-acabado',
  templateUrl: './dialog-registrar-defecto-salida-acabado.component.html',
  styleUrls: ['./dialog-registrar-defecto-salida-acabado.component.scss']
})
export class DialogRegistrarDefectoSalidaAcabadoComponent implements OnInit {

  Titulo: string = '';
  Num_Auditoria_Defecto: number;

  formulario = this.formBuilder.group({
    Cod_Defecto: ['', Validators.required],
    Descripcion: [''],
    Cantidad: [0, Validators.required],
    Tipo: ['1', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, 
    private auditoriaAcabadosService: AuditoriaAcabadosService,   
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,            
    @Inject(MAT_DIALOG_DATA) public data: data,
    private dialogRef: MatDialogRef<DialogRegistrarDefectoSalidaAcabadoComponent>
  ) { }

  ngOnInit(): void {
    this.formulario.controls['Descripcion'].disable()
    this.Titulo = this.data.Cod_Defecto;
    this.Num_Auditoria_Defecto = this.data.Num_Auditoria_Defecto;

    this.formulario.reset();
    this.formulario.patchValue({
      Cod_Defecto: this.data.Cod_Defecto,
      Descripcion: this.data.Descripcion,
      Cantidad: this.data.Cantidad,
      Tipo: this.data.Tipo.toString()
    });

  }

  onGrabarDefecto(formDirective): void{

    this.auditoriaAcabadosService.Mant_AuditoriaModuloSalidaAcabadoDefecto(
      this.Num_Auditoria_Defecto == 0 ? "I" : "U",
      this.data.Num_Auditoria_Defecto, 
      this.data.Num_Auditoria,
      this.formulario.get('Cod_Defecto')?.value,
      this.formulario.get('Cantidad')?.value,
      this.formulario.get('Tipo')?.value
    ).subscribe((result: any) => {
        console.log(result)
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
     }));
  }

  onBuscarMotivo(){
    let codDefecto = this.formulario.get('Cod_Defecto')?.value

    if(codDefecto.length > 0 ){
        if(codDefecto.length == 3){
        this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento("B", "", "", "", 0, codDefecto)
          .subscribe((result: any) => {
            console.log(result)
            if(result.length > 0){
            this.formulario.controls['Cod_Defecto'].setValue(result[0].Cod_Motivo)
            this.formulario.controls['Descripcion'].setValue(result[0].Descripcion)
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      }else{
        this.formulario.controls['Descripcion'].setValue('')
      }
    }
  }

  onCambiarTipo(value){
    //this.Tip_Auditoria = value;
    //this.formulario.controls['Tip_Auditoria'].setValue(this.Tip_Auditoria);
  }

}
