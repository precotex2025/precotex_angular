import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import jsPDF, { jsPDFAPI } from 'jspdf';

interface data {
  boton: string;
  title: string;
  Opcion: string;
  Datos: any;
  pdf: string;
  pdfBlob: string;
}


@Component({
  selector: 'app-dialog-visor-pdf',
  templateUrl: './dialog-visor-pdf.component.html',
  styleUrls: ['./dialog-visor-pdf.component.scss']
})

export class DialogVisorPdfComponent implements OnInit {
  imageUrl: string = "";
  contentPdf: string = "";
  contentPdf2: SafeResourceUrl;
  pdfBlob: Blob | null = null;

  private startDistance = 0;
  private currentScale = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA) 
    public data: data,
    public dialogRef: MatDialogRef<DialogVisorPdfComponent>,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    //this.imageUrl = this.data.Imagen; 
    //console.log(this.data.Imagen);
    //this.pdfBlob = this.data.pdf;


    this.contentPdf = this.data.pdfBlob
    this.contentPdf2 = this.data.pdf;
    // this.contentPdf2 = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.pdf);
    // const container = document.getElementById('pdf-container');
    console.log(this.contentPdf);
  // Mostrar el PDF en un iframe

  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.src = this.data.pdf;

  // Abrir en un contenedor o modal
  document.body.appendChild(iframe);

    // Mostrar el PDF en un visor
    
    // const iframe = document.createElement('iframe');
    // iframe.src = this.data.pdf;
    // iframe.style.width = '100%';
    // iframe.style.height = '100%';
    // iframe.style.objectFit = 'contain'
    // iframe.style.transform = 'scale(0.8)'; // Ajusta el zoom aquí
    // iframe.style.transformOrigin = '0 0';
    

    // Agregar el iframe al contenedor del componente
    // const container = document.getElementById('pdf-container');
    // if (container) {
    //   container.appendChild(iframe);
    // }

    //console.log(this.contentPdf);
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
