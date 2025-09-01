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
  selector: 'app-crear-preguntas-comedor',
  templateUrl: './crear-preguntas-comedor.component.html',
  styleUrls: ['./crear-preguntas-comedor.component.scss']
})
export class CrearPreguntasComedorComponent implements OnInit {

  sCod_Usuario = GlobalVariable.vusu
  listar_cabeceras = [];
  Id_Detalle:number = 0;
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private comedorService: EncuestasComedorService,
    private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data) { }


  formulario = this.formBuilder.group({ Pregunta: ['' , Validators.required ], Id_Cabecera: ['', Validators.required], })

  ngOnInit(): void {
    console.log(this.data);
    if(this.data.tipo == 2){
      this.formulario.patchValue({
        Pregunta: this.data.datos.Pregunta,
        Id_Cabecera: this.data.datos.Id_Cabecera
      });

      this.Id_Detalle = this.data.datos.Id_Detalle;
    }
    this.CargarTipos();

    console.log(this.Id_Detalle);
  }


  guardar() {
    if(this.formulario.valid){
      if(this.data.tipo == 1){
        this.SpinnerService.show();
        this.comedorService.obtenerPreguntasComedor(
          'I',
          this.formulario.get('Id_Cabecera').value,
          '',
          this.formulario.get('Pregunta').value
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
        this.comedorService.obtenerPreguntasComedor(
          'U',
          this.formulario.get('Id_Cabecera').value,
          this.Id_Detalle,
          this.formulario.get('Pregunta').value
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

  CargarTipos() {

    this.comedorService.obtenerPreguntaCabComedor('A', '', '', '', '', '').subscribe(
      (result: any) => {
        this.listar_cabeceras = result
        console.log(this.listar_cabeceras);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

}

