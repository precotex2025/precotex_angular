import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'


@Component({
  selector: 'app-dialog-detalle-ocurrencia',
  templateUrl: './dialog-detalle-ocurrencia.component.html',
  styleUrls: ['./dialog-detalle-ocurrencia.component.scss']
})
export class DialogDetalleOcurrenciaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogDetalleOcurrenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

}
