import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export  interface PartidaItem  {
  //articulo: string;
  //descripcion: string;
  //color: string;

        cod_Tela : string;
        des_Tela : string;
        num_Secuencia : number;

        cod_Color : string;
        des_Color : string;

        cod_Cliente_Tex : string;
        nom_Cliente : string;

        seleccionado?: boolean;

}

@Component({
  selector: 'app-modal-seleccion-partida-qr',
  templateUrl: './modal-seleccion-partida-qr.component.html',
  styleUrls: ['./modal-seleccion-partida-qr.component.scss']
})
export class ModalSeleccionPartidaQrComponent {

  //partidaItemList: PartidaItem [] = [];
  seleccionado: PartidaItem | null = null;
  seleccionados: any[] = [];

  constructor(
        public dialogRef          : MatDialogRef<ModalSeleccionPartidaQrComponent>,
        private matSnackBar       : MatSnackBar       ,
        @Inject(MAT_DIALOG_DATA) public data: PartidaItem []
  ) { 
    
  }

  ngOnInit(): void {
    console.log('📦 Datos recibidos en el modal:', this.data);
  }

  // seleccionar(item: any, index: number): void {
  //   this.seleccionado = item;
  //   console.log('Elemento seleccionado:', item, 'Índice:', index);
  // }

  cerrar() {
    this.dialogRef.close(null);
  } 
  
  agregar() {
    if (this.seleccionados.length === 0) {
        
      this.matSnackBar.open("¡Seleccione al menos un articulo para continuar...!", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });
    } else {
      this.dialogRef.close(this.seleccionados);
    }
  }

  toggleSeleccion(item: any) {
    const yaSeleccionado = item.seleccionado;

    // Solo se permite 1 elemento seleccionado a la vez
    this.data.forEach(i => i.seleccionado = false);
    this.seleccionados = [];

    if (!yaSeleccionado) {
      item.seleccionado = true;
      this.seleccionados = [item];
    }

    console.log("Seleccionados:", this.seleccionados);
  }

}
