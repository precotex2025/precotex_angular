import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { FormBuilder, FormControl, Validators, FormControlName, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { NgxSpinnerService } from 'ngx-spinner';

import { MantMaestroBolsaItemService } from 'src/app/services/mant-maestro-bolsa-item.service';

interface data {
  Id: number
}

@Component({
  selector: 'app-dialog-maestro-bolsa-item',
  templateUrl: './dialog-maestro-bolsa-item.component.html',
  styleUrls: ['./dialog-maestro-bolsa-item.component.scss']
})
export class DialogMaestroBolsaItemComponent implements OnInit {

  sCod_Usuario = GlobalVariable.vusu
  listar_cabeceras = [];
  Id: number = 0;
  Id_Bolsa_Det = 0;
  Cod_Barra = "";
  Codigo: string = "";
  constructor(

    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private bolsaService: MantMaestroBolsaItemService,
    private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data) { }

  formulario = this.formBuilder.group({ Cod_Barra: ['', Validators.required], })

  ngOnInit(): void {
    this.Id = this.data.Id
  }

  Guardar() {
    if (this.formulario.valid) {
      this.Codigo = this.formulario.get('Cod_Barra')?.value;
      console.log(this.Codigo.length);
      if (this.Codigo.length == 8 ) {
        this.SpinnerService.show();
        this.bolsaService.insertarDatos_S(
          'I',
          this.Id,
          0,
          this.formulario.get('Cod_Barra').value,
          '',
          ''
        ).subscribe(
          (result: any) => {
            this.SpinnerService.hide();
            if (result[0].Respuesta == 'OK') {
              this.matSnackBar.open('Se realizo el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.dialog.closeAll();
            } else {
              console.log('PASO1')
              console.log(result[0].Respuesta)
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
