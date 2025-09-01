import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

@Component({
  selector: 'app-dialog-visor-reg',
  templateUrl: './dialog-visor-reg.component.html',
  styleUrls: ['./dialog-visor-reg.component.scss']
})
export class DialogVisorRegComponent implements OnInit {
  @ViewChild('pdfCanvas', { static: false }) pdfCanvas!: ElementRef<HTMLCanvasElement>;

  imageUrl: string = "";
  pdfDoc: any;  // <--- Referencia al documento PDF
  currentPage: number = 1;
  totalPages: number = 0;
  isPdfLoaded: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogVisorRegComponent>,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.imageUrl = this.data.Imagen;
    if (this.isPDF()) {
      this.loadPdf(this.imageUrl);
    }
  }

  // ngAfterViewInit(): void {
  //   if (this.isPDF()) {
  //     this.loadPdf(this.imageUrl);
  //   }
  // }

  isPDF(): boolean {
    return this.imageUrl?.endsWith('.pdf') || this.imageUrl?.startsWith('blob:');
  }
  

  async loadPdf(url: string) {
    this.pdfDoc = await pdfjsLib.getDocument(url).promise;
    this.totalPages = this.pdfDoc.numPages;
    this.renderPage(this.currentPage);
  }

  async renderPage(pageNumber: number) {
    const page = await this.pdfDoc.getPage(pageNumber);
    const canvas = this.pdfCanvas.nativeElement;
    const context = canvas.getContext('2d')!;
    const viewport = page.getViewport({ scale: 1.5 });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    this.isPdfLoaded = true;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.renderPage(this.currentPage);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderPage(this.currentPage);
    }
  }
  
  Salir() {
    this.dialogRef.close();
  }
}
