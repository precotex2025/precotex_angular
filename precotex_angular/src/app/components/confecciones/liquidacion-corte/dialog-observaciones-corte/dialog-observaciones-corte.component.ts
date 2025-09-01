import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LiquidacionCorteService } from 'src/app/services/liquidacion-corte.service';


interface data {
  OC:      string,
  Tipo: string
}
@Component({
  selector: 'app-dialog-observaciones-corte',
  templateUrl: './dialog-observaciones-corte.component.html',
  styleUrls: ['./dialog-observaciones-corte.component.scss']
})
export class DialogObservacionesCorteComponent implements OnInit {
  datos:Array<any> = [];
  constructor(public dialogRef: MatDialogRef<DialogObservacionesCorteComponent>,
    private formBuilder: FormBuilder,
       private matSnackBar: MatSnackBar,
       private despachoTelaCrudaService: LiquidacionCorteService, 
       @Inject(MAT_DIALOG_DATA) public data: data) { }

  ngOnInit(): void {
    console.log(this.data.OC);
    this.getObservaciones();
  }

  closeModal(){
    this.dialogRef.close();
  }

  getObservaciones(){
    this.despachoTelaCrudaService.verObservacionesLiquidacionCorte(this.data.OC, this.data.Tipo).subscribe(
        (result: any) => {
          this.datos = result
          console.log(result);


        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }
}
