import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-generar-despacho',
  templateUrl: './dialog-generar-despacho.component.html',
  styleUrls: ['./dialog-generar-despacho.component.scss']
})
export class DialogGenerarDespachoComponent implements OnInit {
  observaciones:string = '';
  piezas_prod: any = 0;
  piezas_ML: any = 0;
  reposicion: string = '';

  constructor(public dialogRef: MatDialogRef<DialogGenerarDespachoComponent>, private matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
  }


  generarAprobacion(estado){
    if(this.observaciones != '' && this.reposicion != ''){
      let datos = {
        piezas_prod: this.piezas_prod,
        piezas_ML: this.piezas_ML,
        reposicion: this.reposicion,
        observaciones: this.observaciones
      }
      this.dialogRef.close(datos);
    }else{
      this.matSnackBar.open('Debes ingresar la observación y el estado de la reposición', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
    }
  }
}
