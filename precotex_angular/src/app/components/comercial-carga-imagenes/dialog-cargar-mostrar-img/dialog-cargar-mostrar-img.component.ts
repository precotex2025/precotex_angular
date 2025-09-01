import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogMostrarImgComponent } from './dialog-mostrar-img/dialog-mostrar-img.component';
import { ComercialService } from 'src/app/services/comercial.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';

interface data {
  data:      string, 
  tipo: number
}

@Component({
  selector: 'app-dialog-cargar-mostrar-img',
  templateUrl: './dialog-cargar-mostrar-img.component.html',
  styleUrls: ['./dialog-cargar-mostrar-img.component.scss']
})
export class DialogCargarMostrarImgComponent implements OnInit {
  dataImagenes = [];
  mostrar = false;
  constructor(private dialogRef: MatDialogRef<DialogCargarMostrarImgComponent>, private matSnackBar: MatSnackBar, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: data, private comercialService:ComercialService, private  SpinnerService:NgxSpinnerService) { }

  ngOnInit(): void {
    console.log(this.data);
    document.addEventListener("contextmenu", function(e){
      e.preventDefault();
    }, false);
    this.cargarLista();
  }


  closeModal(){
    this.dialogRef.close();
  }

  cargarLista(){
    var estilo_propio = this.data.data['ESTILO_PROPIO'];
    this.dataImagenes = [];
 
    var sCod_Usuario = GlobalVariable.vusu;
    const formData = new FormData();
    formData.append('Tipo', 'V');
    formData.append('Estilo_Propio', estilo_propio);
    formData.append('Id', '0');
    formData.append('Icono', '');
    formData.append('Observacion', '');
    formData.append('Usuario', sCod_Usuario);


    this.comercialService.cargarImagenes(
      formData
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataImagenes = result;
          var data = this.dataImagenes.filter(element => {
            return element.Icono != ''
          });

          console.log(data);

          if(data.length == 0){
            this.mostrar = true;
          }else{
            this.mostrar = false;
          }
        } else {
          this.dataImagenes = [];
          this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })
  }

  verImagen(data) {
    let dialogRef = this.dialog.open(DialogMostrarImgComponent,
      {
        disableClose: true,
        minWidth:'85%',
        minHeight:'80%',
        maxHeight: '98%',
        height: '90%',
        panelClass: 'my-class',
        data: {
          data
        }
      });
    //dialogRef.afterClosed().subscribe(result => {
  }
}
