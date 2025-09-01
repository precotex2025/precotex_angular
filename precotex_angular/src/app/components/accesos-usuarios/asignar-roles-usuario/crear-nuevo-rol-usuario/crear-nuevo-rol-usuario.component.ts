import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { GlobalVariable } from 'src/app/VarGlobals';
@Component({
  selector: 'app-crear-nuevo-rol-usuario',
  templateUrl: './crear-nuevo-rol-usuario.component.html',
  styleUrls: ['./crear-nuevo-rol-usuario.component.scss']
})
export class CrearNuevoRolUsuarioComponent implements OnInit {
  Des_Rol: string = "";
  dataRoles: Array<any> = [];
  Cod_Rol: string = "";
  dataUsuarios:Array<any> = [];
  Id_Usuario: string = "";
  
  constructor(private dialogRef: MatDialogRef<CrearNuevoRolUsuarioComponent>, private matSnackBar: MatSnackBar, private seguridadControlVehiculoService: SeguridadControlVehiculoService) { }

  ngOnInit(): void {
    this.getUsuarios();
    this.getDataRoles();
  }

  closeModal() {
    this.dialogRef.close();
  }

  guardarRol() {
    console.log(this.Des_Rol);
    if (this.Cod_Rol != '' && this.Id_Usuario != '') {
      this.seguridadControlVehiculoService.seg_insertar_usuario_rol(this.Id_Usuario, this.Cod_Rol, GlobalVariable.vusu ).subscribe(res => {
        if(res[0].status == 1){
          this.matSnackBar.open("SE REGISTRO CORRECTAMENTE EL USUARIO CON EL ROL", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })    
          this.dialogRef.close();
        }else{
          this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })    
        }
      },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    } else {
      this.matSnackBar.open("Debes ingresar la descripción del Rol Y el Usuario", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  getUsuarios(){
    this.seguridadControlVehiculoService.mantenimientoUsuariosService(
      ""
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result);
          this.dataUsuarios = result;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  getDataRoles(){
    this.seguridadControlVehiculoService.seg_listar_roles_opciones(
      'L', 0
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result);
          this.dataRoles = result;
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }
}
