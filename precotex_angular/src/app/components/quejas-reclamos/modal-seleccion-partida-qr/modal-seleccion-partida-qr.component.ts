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
    item.seleccionado = !item.seleccionado;

    if (item.seleccionado) {
      // ✅ Agregar si no está en la lista
      this.seleccionados.push(item);
    } else {
      // ❌ Quitar si lo deselecciona
      this.seleccionados = this.seleccionados.filter(x => x !== item);
    }    
    console.log("Seleccionados:", this.seleccionados);
  }

}
