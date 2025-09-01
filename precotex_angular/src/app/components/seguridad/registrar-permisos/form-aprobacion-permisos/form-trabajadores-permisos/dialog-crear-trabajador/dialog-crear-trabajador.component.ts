import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { GlobalVariable } from '../../../../../../VarGlobals'; //<==== this one
import { FormBuilder, FormControl, Validators, FormControlName, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

interface trabajadores {
  Tipo: string,
  Codigo: string,
  Nombre: string,
}

interface data {
  eltipo: string
}
@Component({
  selector: 'app-dialog-crear-trabajador',
  templateUrl: './dialog-crear-trabajador.component.html',
  styleUrls: ['./dialog-crear-trabajador.component.scss']
})
export class DialogCrearTrabajadorComponent implements OnInit {
  sCod_Usuario = GlobalVariable.vusu
  mostrar = false;
  listar_operacionConductor: trabajadores[] = [];
  dataAreas = [];
  seleccionados: Array<any> = [];
  searchable = true;
  num_guiaMascara = [/[0-2]/, /\d/, ':', /[0-5]/, /\d/];
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogCrearTrabajadorComponent>,
    private matSnackBar: MatSnackBar,
    private RegistroPermisosService: RegistroPermisosService,
    @Inject(MAT_DIALOG_DATA) public data: data) { }


  formulario = this.formBuilder.group({ codTrabajador: [''], Tip_Trabajador: [''], Tipo: [''], desTrabajador: [''], Cod_Empresa: [''], RH_Cod_Area: [''] })

  ngOnInit(): void {

    if (screen.height < 740) {
      this.searchable = false;
    }
    this.CargarTrabajadores()
    this.CargarAreas();
  }



  pasarDato() {

  }
  Seleccionados(event) {
    console.log(event);
    if (event != undefined) {
      this.formulario.get('Tip_Trabajador')?.setValue(event.Tip_Trabajador);
      this.formulario.get('codTrabajador')?.setValue(event.Cod_Trabajador);

      if (GlobalVariable.empresa == '03') {
        this.formulario.get('Cod_Empresa')?.setValue('07');
      } else {
        this.formulario.get('Cod_Empresa')?.setValue(GlobalVariable.empresa);
      }
    } else {
      this.formulario.get('Tip_Trabajador')?.setValue('');
      this.formulario.get('codTrabajador')?.setValue('');
      this.formulario.get('Cod_Empresa')?.setValue('');
    }

  }
  guardar() {
    var Cod_Trabajador = this.formulario.get('codTrabajador').value;
    var Tip_Trabajador = this.formulario.get('Tip_Trabajador').value;
    var Cod_Empresa = this.formulario.get('Cod_Empresa').value;
    var RH_Cod_Area = this.formulario.get('RH_Cod_Area').value;
    var Tipo = this.formulario.get('Tipo').value;

 
    if (Cod_Trabajador != '' && RH_Cod_Area != '' && Tipo != '') {
      this.RegistroPermisosService.insertaAreasPorUsuario('I', '001', Tip_Trabajador, Cod_Trabajador, Cod_Empresa, RH_Cod_Area, Tipo).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            console.log(result);
            this.matSnackBar.open("Se inserto el registro correctamente..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
            this.dialogRef.close();
          }
          else if (result[0].Respuesta == 'FALSE') {
            this.matSnackBar.open("El registro ya estaba registrado..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
            this.dialogRef.close();
          } else {
            this.matSnackBar.open("Ha ocurrido un error al registrar el área..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3500,
        })
      )
    } else {
      this.matSnackBar.open('Debe ingresar los campos obligatorios.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
    }
  }

  CargarTrabajadores() {
    var usuario = GlobalVariable.vusu;
    var Cod_Empresa = '';
    if (GlobalVariable.empresa == '03') {
      Cod_Empresa = '07';
    }else{
      Cod_Empresa = GlobalVariable.empresa;
    }
    this.RegistroPermisosService.Rh_Muestra_Trabajadores_Jefe_Web('T', GlobalVariable.vcodtra, GlobalVariable.vtiptra, Cod_Empresa).subscribe(
      (result: any) => {
        this.listar_operacionConductor = result
        console.log(this.listar_operacionConductor);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  CargarAreas() {
    var usuario = GlobalVariable.vusu;
    var Cod_Empresa = '';
    if (GlobalVariable.empresa == '03') {
      Cod_Empresa = '07';
    }else{
      Cod_Empresa = GlobalVariable.empresa;
    }
    this.RegistroPermisosService.Rh_Muestra_Trabajadores_Jefe_Web('A', GlobalVariable.vcodtra, GlobalVariable.vtiptra, Cod_Empresa).subscribe(
      (result: any) => {
        console.log(result);
        this.dataAreas = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

}
