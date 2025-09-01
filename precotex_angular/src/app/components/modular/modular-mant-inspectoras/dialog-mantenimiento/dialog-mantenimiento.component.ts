import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { ModularMantenimientoInspectorasService } from 'src/app/services/modular/mantenimiento-inspectoras.service';
import { HttpErrorResponse } from '@angular/common/http';


interface data {
  datos: any,
  tipo: number
}

@Component({
  selector: 'app-dialog-mantenimiento',
  templateUrl: './dialog-mantenimiento.component.html',
  styleUrls: ['./dialog-mantenimiento.component.scss']
})
export class DialogMantenimientoComponent implements OnInit {

  sCod_Usuario = GlobalVariable.vusu
  listar_modulo = [];
  Id_Cabecera:number = 0;
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private mantenimientoinspectorasService: ModularMantenimientoInspectorasService,
    private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data) { }


  formulario = this.formBuilder.group({ Cod_Usuario: ['' , Validators.required ], Tip_Trabajador: ['' , Validators.required ], Cod_Trabajador: ['' , Validators.required ], Nom_Usuario: ['', Validators.required], Cod_Modulo: ['', Validators.required] })

  ngOnInit(): void {
    this.obtenerModulo();
    if(this.data.tipo == 2){
      this.formulario.patchValue({
        Cod_Usuario: this.data.datos.Cod_Usuario,
        Tip_Trabajador: this.data.datos.Tip_Trabajador,
        Cod_Trabajador: this.data.datos.Cod_Trabajador,
        Nom_Usuario: this.data.datos.Nom_Usuario,
        Cod_Modulo: this.data.datos.Cod_Modulo
      });
    }
  }

  obtenerModulo() {
    this.SpinnerService.show();
    this.mantenimientoinspectorasService.obtenerModuloInpectoras(
      'M',
      '',
      '',
      '',
      '',
      ''
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.listar_modulo = result
        }else{
          this.matSnackBar.open('No se encontraron registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
        })
      })

  }

  obtenerTrabajador($event) {
    console.log($event.target.value)
    this.SpinnerService.show();
    this.mantenimientoinspectorasService.obtenerModuloInpectoras(
      'T',
      '',
      '',
      this.formulario.get('Tip_Trabajador').value,
      $event.target.value,
      ''
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.formulario.patchValue({
            Nom_Usuario: result[0].Nom_Usuario,
            Cod_Usuario: result[0].Cod_Usuario
          })
        }else{
          this.matSnackBar.open('No se encontraron registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
        })
      })

  }


  guardar() {
    if(this.formulario.valid){
      if(this.data.tipo == 1){
        this.SpinnerService.show();
        this.mantenimientoinspectorasService.obtenerModuloInpectoras(
          'I',
          this.formulario.get('Cod_Usuario').value,
          '',
          this.formulario.get('Tip_Trabajador').value,
          this.formulario.get('Cod_Trabajador').value,
          this.formulario.get('Cod_Modulo').value
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
        this.mantenimientoinspectorasService.obtenerModuloInpectoras(
          'U',
          this.formulario.get('Cod_Usuario').value,
          '',
          this.formulario.get('Tip_Trabajador').value,
          this.formulario.get('Cod_Trabajador').value,
          this.formulario.get('Cod_Modulo').value
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
