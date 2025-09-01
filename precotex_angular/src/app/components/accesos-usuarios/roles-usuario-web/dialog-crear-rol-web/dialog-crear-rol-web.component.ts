import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { GlobalVariable } from 'src/app/VarGlobals';

@Component({
  selector: 'app-dialog-crear-rol-web',
  templateUrl: './dialog-crear-rol-web.component.html',
  styleUrls: ['./dialog-crear-rol-web.component.scss']
})
export class DialogCrearRolWebComponent implements OnInit {
  Des_Rol: string = "";
  constructor(private dialogRef: MatDialogRef<DialogCrearRolWebComponent>, private matSnackBar: MatSnackBar, private seguridadControlVehiculoService: SeguridadControlVehiculoService) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.dialogRef.close();
  }

  guardarRol() {
    console.log(this.Des_Rol);
    if (this.Des_Rol != '') {
      this.seguridadControlVehiculoService.seg_crear_rol(this.Des_Rol, GlobalVariable.vusu).subscribe(res => {
        if(res[0].status == 1){
          this.matSnackBar.open("SE REGISTRO CORRECTAMENTE EL ROL", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })    
          this.closeModal();
        }
      },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    } else {
      this.matSnackBar.open("Debes ingresar la descripción del Rol", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }
}
