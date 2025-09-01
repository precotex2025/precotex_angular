import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export  interface PartidaItem  {
  articulo: string;
  descripcion: string;
  codDefecto: string;
  metros: number;
  puntos: number;
}

/*export  interface PartidaItemResponse  {
 elements: PartidaItem[];
}*/

@Component({
  selector: 'app-modal-seleccion-partida',
  templateUrl: './modal-seleccion-partida.component.html',
  styleUrls: ['./modal-seleccion-partida.component.scss'],
})


export class ModalSeleccionPartidaFComponent {

//partidaItemList: PartidaItem [] = [];
seleccionado: PartidaItem | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModalSeleccionPartidaFComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PartidaItem []
  ) {
    console.log('📦 Datos recibidos en el modal:', data);
  }

  seleccionar(item: any, index: number): void {
    this.seleccionado = item;
    console.log('Elemento seleccionado:', item, 'Índice:', index);
    setTimeout(() => {
      this.dialogRef.close(index);
    }, 500);
  }

  cerrar() {
    this.dialogRef.close(null);
  }
}
