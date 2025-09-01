import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-dialog-recepcion-reposicion',
  templateUrl: './dialog-recepcion-reposicion.component.html',
  styleUrls: ['./dialog-recepcion-reposicion.component.scss']
})
export class DialogRecepcionReposicionComponent implements OnInit {
  observaciones:string = '';
  Recepcion_Conforme:string = '';
  constructor(public dialogRef: MatDialogRef<DialogRecepcionReposicionComponent>, private matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
  }


  generarAprobacion(estado){
    if(this.Recepcion_Conforme == 'SI'){
      let datos = {
        Recepcion_Conforme: this.Recepcion_Conforme,
        observaciones: this.observaciones
      }
      this.dialogRef.close(datos);
    }else{
      if(this.observaciones != ''){
        let datos = {
          Recepcion_Conforme: this.Recepcion_Conforme,
          observaciones: this.observaciones
        }
        this.dialogRef.close(datos);
      }else{
        this.matSnackBar.open('Debes ingresar la observación', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      }
    }
  }
}
