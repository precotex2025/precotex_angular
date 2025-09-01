import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data {
  data: any
}

@Component({
  selector: 'app-modificar-usuario-web',
  templateUrl: './modificar-usuario-web.component.html',
  styleUrls: ['./modificar-usuario-web.component.scss']
})
export class ModificarUsuarioWebComponent implements OnInit {

  Fec_Inicio_Acceso_Especial: string = "";

  Dias_Acceso_Especial: string = "";
  
  constructor(private dialogRef: MatDialogRef<ModificarUsuarioWebComponent>, private matSnackBar: MatSnackBar, private seguridadControlVehiculoService: SeguridadControlVehiculoService, @Inject(MAT_DIALOG_DATA) public data: data) { }

  ngOnInit(): void {

    console.log(this.data.data)
  }

  closeModal() {
    this.dialogRef.close();
  }

  guardarRol() {

    if (this.Fec_Inicio_Acceso_Especial != '' && this.Dias_Acceso_Especial != '') {
      this.seguridadControlVehiculoService.seg_modificar_acceso_especial(this.data.data.Id_Usuario, this.Fec_Inicio_Acceso_Especial, this.Dias_Acceso_Especial).subscribe(res => {
        if(res[0].status == 1){
          this.matSnackBar.open("SE ACTUALIZO EL REGISTRO CORRECTAMENTE", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })    
          this.dialogRef.close();
        }else{
          this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })    
        }
      },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    } else {
      this.matSnackBar.open("Debes ingresar la Fecha y Días de Acceso Especial", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  
}
