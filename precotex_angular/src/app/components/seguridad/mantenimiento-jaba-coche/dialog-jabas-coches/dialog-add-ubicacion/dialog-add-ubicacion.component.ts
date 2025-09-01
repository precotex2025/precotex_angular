import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { GlobalVariable } from '../../../../../VarGlobals'; //<==== this one
import { FormBuilder, FormControl, Validators, FormControlName, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { EncuestasComedorService } from 'src/app/services/comedor/encuestas-comedor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JabasCochesService } from 'src/app/services/jabas/jabas-coches.service';



interface data {
  datos: any,
  tipo: number,
}

@Component({
  selector: 'app-dialog-add-ubicacion',
  templateUrl: './dialog-add-ubicacion.component.html',
  styleUrls: ['./dialog-add-ubicacion.component.scss']
})
export class DialogAddUbicacionComponent implements OnInit {
  sCod_Usuario = GlobalVariable.vusu
  listar_cabeceras = [];
  Id_Detalle: number = 0;
  constructor(
    private dialog: MatDialogRef<DialogAddUbicacionComponent>,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private jabasCocheService: JabasCochesService,
    private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data) { }


  formulario = this.formBuilder.group({ Ubicacion: ['', Validators.required] })

  ngOnInit(): void {

  }


  guardar() {
    if (this.formulario.valid) {
      if (this.data.tipo == 1) {
        this.SpinnerService.show();
        this.jabasCocheService.ManteJabasCoches(
          'T',
          '',
          '',
          this.formulario.get('Ubicacion').value,
          '',
          '',
          '',
          '',
          '',
          GlobalVariable.vusu,
          '',
          '',
          '',
          '',
          '',          
          '',
          ''
        ).subscribe(
          (result: any) => {
            this.SpinnerService.hide();
            if (result[0].Respuesta == 'OK') {
              this.matSnackBar.open('Se realizo el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.dialog.close();
            } else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            })
          })
      }
    } else {
      this.matSnackBar.open('Debe ingresar los campos obligatorios.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }

  }

}
