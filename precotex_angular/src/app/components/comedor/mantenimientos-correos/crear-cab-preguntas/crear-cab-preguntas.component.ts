import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { FormBuilder, FormControl, Validators, FormControlName, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { EncuestasComedorService } from 'src/app/services/comedor/encuestas-comedor.service';
import { NgxSpinnerService } from 'ngx-spinner';



interface data {
  datos: any,
  tipo: number,
}

@Component({
  selector: 'app-crear-cab-preguntas',
  templateUrl: './crear-cab-preguntas.component.html',
  styleUrls: ['./crear-cab-preguntas.component.scss']
})
export class CrearCabPreguntasComponent implements OnInit {

  sCod_Usuario = GlobalVariable.vusu
  listar_cabeceras = [];
  Id_Cabecera:number = 0;
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private comedorService: EncuestasComedorService,
    private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data) { }


  formulario = this.formBuilder.group({ Titulo: ['' , Validators.required ], Tipo_Servicio: ['', Validators.required], })

  ngOnInit(): void {
    console.log(this.data);
    if(this.data.tipo == 2){
      this.formulario.patchValue({
        Titulo: this.data.datos.Titulo,
        Tipo_Servicio: this.data.datos.Tipo_Servicio
      });

      this.Id_Cabecera = this.data.datos.Id_Cabecera;
    }
    console.log(this.Id_Cabecera);
  }


  guardar() {
    if(this.formulario.valid){
      if(this.data.tipo == 1){
        this.SpinnerService.show();
        this.comedorService.obtenerPreguntaCabComedor(
          'I',
          '',
          this.formulario.get('Tipo_Servicio').value,
          this.formulario.get('Titulo').value,
          '',
          ''
        ).subscribe(
          (result: any) => {
            this.SpinnerService.hide();
            if (result[0].Respuesta == 'OK') {
              this.matSnackBar.open('Se realizo el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.dialog.closeAll();
            }else{
              this.matSnackBar.open('Ha ocurrido un error al realizar el registro!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
            })
          })
      }else{
        this.SpinnerService.show();
        this.comedorService.obtenerPreguntaCabComedor(
          'U',
          this.Id_Cabecera,
          this.formulario.get('Tipo_Servicio').value,
          this.formulario.get('Titulo').value,
          '',
          ''
        ).subscribe(
          (result: any) => {
            this.SpinnerService.hide();
            if (result[0].Respuesta == 'OK') {
              this.matSnackBar.open('Se actualizo el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.dialog.closeAll();
            }else{
              this.matSnackBar.open('Ha ocurrido un error al actualizar el registro!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
            })
          })
      }
      
    }else{
      this.matSnackBar.open('Debe ingresar los campos obligatorios.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    
  }


}

