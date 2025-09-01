import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComercialService } from 'src/app/services/comercial.service';

interface data {
  data: string,
}
@Component({
  selector: 'app-dialog-transferir-imagenes',
  templateUrl: './dialog-transferir-imagenes.component.html',
  styleUrls: ['./dialog-transferir-imagenes.component.scss']
})
export class DialogTransferirImagenesComponent implements OnInit {

  estilo_origen: any = '';
  estilo_destino: any = '';
  constructor(private dialogRef: MatDialogRef<DialogTransferirImagenesComponent>, private matSnackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: data, private dialog: MatDialog, private comercialService: ComercialService, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.estilo_origen = this.data.data['ESTILO_PROPIO'];
  }

  copiarImagenes() {
    if (this.estilo_destino != '') {
      this.SpinnerService.show();
      this.comercialService.copiarImagenes(
        this.estilo_origen,
        this.estilo_destino
      ).subscribe(
        (result: any) => {
          console.log(result)
          this.SpinnerService.hide();
          if (result[0]['Respuesta'] == 'OK') {
            this.dialogRef.close();
            this.matSnackBar.open("Se realizao la copia de imagénes correctamente.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          } else {

            this.matSnackBar.open(result[0]['Respuesta'], 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }

        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        })
    } else {
      this.matSnackBar.open('Debes ingresar el Estilo Propio Destino', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }

  }

  cerrarModal() {
    this.dialogRef.close();
  }
}
