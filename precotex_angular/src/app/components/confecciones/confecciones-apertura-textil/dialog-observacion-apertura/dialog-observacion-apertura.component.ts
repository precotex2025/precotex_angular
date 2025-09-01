import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-observacion-apertura',
  templateUrl: './dialog-observacion-apertura.component.html',
  styleUrls: ['./dialog-observacion-apertura.component.scss']
})
export class DialogObservacionAperturaComponent implements OnInit {
  observacion: string = '';
  constructor(private dialogRef: MatDialogRef<DialogObservacionAperturaComponent>, private matSnackBar: MatSnackBar,) { }

  ngOnInit(): void {
  }

  guardarObservacion(){
    if(this.observacion != ''){
      this.dialogRef.close(this.observacion);
    }else{
      this.matSnackBar.open('Debes ingresar una observación', 'Cerrar', {
        duration: 1500,
      })
    }
    
  }

}
