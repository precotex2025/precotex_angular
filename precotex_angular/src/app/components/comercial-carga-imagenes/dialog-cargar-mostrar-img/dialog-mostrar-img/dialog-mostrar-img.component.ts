import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogVerImagenComponent } from './dialog-ver-imagen/dialog-ver-imagen.component';
import { DOCUMENT } from '@angular/common';

interface data {
  data:      string, 
}
@Component({
  selector: 'app-dialog-mostrar-img',
  templateUrl: './dialog-mostrar-img.component.html',
  styleUrls: ['./dialog-mostrar-img.component.scss']
})
export class DialogMostrarImgComponent implements OnInit {
  myThumbnail = this.data.data['Icono'];
  myFullresImage = this.data.data['Icono'];
  observacion = this.data.data['Observacion']
  lensWidth = 300;
  lensHeigth = 300;

  elem;

  fullScreen = false;

  // myThumbnail = "assets/precotex.jfif"  //+ this.data.data['img'];
  // myFullresImage = "assets/precotexx.jpg" //+ this.data.data['img'];
  constructor(private dialogRef: MatDialogRef<DialogMostrarImgComponent>, private matSnackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: data, private dialog: MatDialog, @Inject(DOCUMENT) private document: any) {

    if (screen.width < 740) {
      this.lensHeigth = 50;
      this.lensWidth = 50;
    }
  }

  ngOnInit(): void {
    console.log(this.data);
    this.elem = document.documentElement;
  }


  abrirImagen(){
    // let dialogRef = this.dialog.open(DialogVerImagenComponent,
    //   {
    //     disableClose: true,
    //     minWidth:'85%',
    //     minHeight:'80%',
    //     maxHeight: '98%',
    //     height: '90%',
    //     panelClass: 'my-class',
    //     data: this.data
    //   });
    this.fullScreen = !this.fullScreen;
    if (this.fullScreen) {
      this._activateFullscreen();
    }else{
      this._exitFullscreen();
    }
    

    //document.documentElement.requestFullscreen();
  }

  private _activateFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /**
   * Exits Full Screen Mode.
   */
  private _exitFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }
  closeModal(){
    this.dialogRef.close();
  }
}
