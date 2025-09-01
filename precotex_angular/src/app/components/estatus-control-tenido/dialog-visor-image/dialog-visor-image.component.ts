import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface data {
  boton: string;
  title: string;
  Opcion: string;
  Datos: any;
  Imagen: string;
}

@Component({
  selector: 'app-dialog-visor-image',
  templateUrl: './dialog-visor-image.component.html',
  styleUrls: ['./dialog-visor-image.component.scss']
})
export class DialogVisorImageComponent implements OnInit {
  imageUrl: string = "";
  private startDistance = 0;
  private currentScale = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: data,
    public dialogRef: MatDialogRef<DialogVisorImageComponent>
  ) { }

  ngOnInit(): void {
    this.imageUrl = this.data.Imagen; 
    console.log(this.data.Datos.url_Dureza);
  }

    // Detectamos el inicio del gesto
    startTouch(event: TouchEvent) {
      if (event.touches.length === 2) {
        // Detectamos la distancia entre los dos puntos al inicio
        const dx = event.touches[0].pageX - event.touches[1].pageX;
        const dy = event.touches[0].pageY - event.touches[1].pageY;
        this.startDistance = Math.sqrt(dx * dx + dy * dy);
      }
    }

  // Detectamos el movimiento del gesto
  onTouchMove(event: TouchEvent) {
    if (event.touches.length === 2) {
      const dx = event.touches[0].pageX - event.touches[1].pageX;
      const dy = event.touches[0].pageY - event.touches[1].pageY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);

      // Calculamos el cambio en el tamaño (escala)
      const scale = currentDistance / this.startDistance;
      this.applyZoom(scale);
    }
  }    

  // Aplicamos el zoom
  applyZoom(scale: number) {
    const image = document.querySelector('.responsive-image') as HTMLImageElement;
    if (image) {
      this.currentScale = Math.max(1, Math.min(scale, 3)); // Limitar el zoom entre 1 y 3
      image.style.transform = `scale(${this.currentScale})`;
    }
  }  

  // Al finalizar el gesto
  endTouch() {
    this.startDistance = 0;
  }  

  Salir(){
    this.dialogRef.close();
  }

}
