import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-aprobacion-reposicion',
  templateUrl: './dialog-aprobacion-reposicion.component.html',
  styleUrls: ['./dialog-aprobacion-reposicion.component.scss']
})
export class DialogAprobacionReposicionComponent implements OnInit {

  observaciones:string = '';
  constructor(public dialogRef: MatDialogRef<DialogAprobacionReposicionComponent>, private matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
  }


  generarAprobacion(estado){
    if(this.observaciones != ''){
      let datos = {
        estado: estado,
        observaciones: this.observaciones
      }
      this.dialogRef.close(datos);
    }else{
      this.matSnackBar.open('Debes ingresar la observación', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
    }
  }
}
