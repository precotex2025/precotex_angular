import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface data_img {
  Nombre: string;
  Width: number;
  Height: number;
}

@Component({
  selector: 'app-dialog-firma-digital',
  templateUrl: './dialog-firma-digital.component.html',
  styleUrls: ['./dialog-firma-digital.component.scss']
})
export class DialogFirmaDigitalComponent implements OnInit, AfterViewInit {

  @ViewChild('canvasRef', {static: false}) canvasRef: any;

  public width = 400;
  public height = 400;

  private cx: CanvasRenderingContext2D;
  private points: Array<any> = [];

  // - Dibujar con el mouse
  ll_dibujar: boolean = false;

  @HostListener('document:mousedown', ['$event'])
  onMouseDown = (e: any) => {    
    this.ll_dibujar = true;
    this.points.length = 0;
    this.cx.beginPath();
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp = (e: any) => {    
    this.ll_dibujar = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove = (e: any) => {
    if(this.ll_dibujar){
      if(e.target.id === 'canvasId'){
        //console.log(e)
        this.write(e)
      }
    }
  }
  //-- Fin

  //- Dibujar con el touch
  @HostListener('document:touchstart', ['$event'])
  onTouchStart = (e: any) => {    
    //this.ll_dibujar = true;
    this.points.length = 0;
    this.cx.beginPath();
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove = (e: any) => {    
    if(e.target.id === 'canvasId'){
      this.write(e.touches[0])
    }
  }
  //- Fin

  lc_Nombre: string = '';
  Imagen64: string = '';

  constructor(private dialogRef: MatDialogRef<DialogFirmaDigitalComponent>, @Inject(MAT_DIALOG_DATA) public data: data_img) { }

  ngOnInit(): void{
    this.lc_Nombre = this.data.Nombre;
    this.width = this.data.Width;
    this.height = this.data.Height;
  }

  ngAfterViewInit(): void {
    this.render();
  }

  private render(): any {
    const canvasEl = this.canvasRef.nativeElement;
    this.cx = canvasEl.getContext('2d');
    
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    
  }

  private write(res): any {
    const canvasEl = this.canvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const prevPos = {
      x: res.clientX - rect.left,
      y: res.clientY - rect.top
    };
    //console.log(prevPos)
    this.writeSingle(prevPos)
  }

  private writeSingle = (prevPos) => {
    this.points.push(prevPos);
    if(this.points.length > 3){
      const prevPost = this.points[this.points.length - 1]
      const currentPos = this.points[this.points.length - 2]
      this.drawOnCanvas(prevPost, currentPos);
    }
  }

  private drawOnCanvas(prevPos: any, currentPos: any){
    if(!this.cx){
      return;
    }
    this.cx.beginPath();
    if(prevPos){
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  onSaveImage(){
    const canvas64 = <HTMLCanvasElement> document.getElementById('canvasId');
    const image = canvas64.toDataURL();

    //this.Imagen64 = image;
    this.dialogRef.close(image);
  }
  
}
