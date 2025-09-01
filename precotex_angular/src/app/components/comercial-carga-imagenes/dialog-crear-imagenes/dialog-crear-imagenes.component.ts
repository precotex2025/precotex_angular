import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { ComercialService } from 'src/app/services/comercial.service';
import { DialogMostrarImgComponent } from '../dialog-cargar-mostrar-img/dialog-mostrar-img/dialog-mostrar-img.component';

interface data {
  data: string
}

export interface PeriodicElement {
  Cod_EstPro: string;
  Id: string;
  Icono: string;
  Observacion: string;
  
}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-dialog-crear-imagenes',
  templateUrl: './dialog-crear-imagenes.component.html',
  styleUrls: ['./dialog-crear-imagenes.component.scss']
})
export class DialogCrearImagenesComponent implements OnInit {
  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('inputFile2') inputFile2: ElementRef;
  datos: any = [];
  displayedColumns: string[] = [
    'Id',
    'Cod_EstPro',
    'Icono',
    'Observacion',
    'acciones'
  ];
   
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  constructor(private dialogRef: MatDialogRef<DialogCrearImagenesComponent>, private matSnackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: data, private dialog: MatDialog,
    private comercialService: ComercialService, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {    
    this.cargarLista(); 
  }

  guardarImagen(event, tipo, data) {
    console.log(event);
    console.log(tipo);
    console.log(data);
    var eltipo = '';
    if (tipo == 'guardar') {
      eltipo = 'I';
    } else {
      eltipo = 'U';
    }

    var sCod_Usuario = GlobalVariable.vusu;
    const formData = new FormData();
    formData.append('Tipo', eltipo);
    formData.append('Estilo_Propio', data.Cod_EstPro);
    formData.append('Id', data.Id);
    formData.append('Icono', '');
    formData.append('Observacion', data.Observacion);
    formData.append('Usuario', sCod_Usuario);
    formData.append('Foto', event.target.files[0]);

    this.SpinnerService.show();
    this.comercialService.cargarImagenes(
      formData
    ).subscribe(
      (result: any) => {
        console.log(result)
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open("Se guardo la imagen correctamente", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        this.cargarLista();
        this.SpinnerService.hide();
        this.inputFile.nativeElement.value = '';
        this.inputFile2.nativeElement.value = '';

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })

  }

  saveObservacion(event, data) {
    var sCod_Usuario = GlobalVariable.vusu;
    const formData = new FormData();
    formData.append('Tipo', 'O');
    formData.append('Estilo_Propio', data.Cod_EstPro);
    formData.append('Id', data.Id);
    formData.append('Icono', '');
    formData.append('Observacion', event.target.value);
    formData.append('Usuario', sCod_Usuario);

    this.SpinnerService.show();
    this.comercialService.cargarImagenes(
      formData
    ).subscribe(
      (result: any) => {
        console.log(result)
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open("Se guardo la observación correctamente", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        this.SpinnerService.hide();

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })
  }

  mostrarImagen(data){
    var estilo_propio = this.data.data['ESTILO_PROPIO'];

    var sCod_Usuario = GlobalVariable.vusu;
    const formData = new FormData();
    formData.append('Tipo', 'V');
    formData.append('Estilo_Propio', estilo_propio);
    formData.append('Id', data.Id);
    formData.append('Icono', '');
    formData.append('Observacion', '');
    formData.append('Usuario', sCod_Usuario);

    this.SpinnerService.show();

    this.comercialService.cargarImagenes2(
      formData
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.SpinnerService.hide();
        if (result.length > 0) {
          let dialogRef = this.dialog.open(DialogMostrarImgComponent,
            {
              disableClose: true,
              minWidth:'85%',
              minHeight:'80%',
              maxHeight: '98%',
              height: '90%',
              panelClass: 'my-class',
              data: {
                data: result[0]
              }
            });
        } else {
          this.SpinnerService.hide();
          this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.dataSource.data = [];
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })
  }

  eliminarImagen(data) {
    if (confirm("Esta seguro de eliminar la imagen y observación?")) {
      var sCod_Usuario = GlobalVariable.vusu;
      const formData = new FormData();
      formData.append('Tipo', 'D');
      formData.append('Estilo_Propio', data.Cod_EstPro);
      formData.append('Id', data.Id);
      formData.append('Icono', data.Icono);
      formData.append('Observacion', data.Observacion);
      formData.append('Usuario', sCod_Usuario);

      this.SpinnerService.show();
      this.comercialService.cargarImagenes(
        formData
      ).subscribe(
        (result: any) => {
          console.log(result)
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open("Se Elimino correctamente", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
          this.cargarLista();
          this.SpinnerService.hide();

        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        })
    }

  }

  cargarLista() {
    var estilo_propio = this.data.data['ESTILO_PROPIO'];

    var sCod_Usuario = GlobalVariable.vusu;
    const formData = new FormData();
    formData.append('Tipo', 'V');
    formData.append('Estilo_Propio', estilo_propio);
    formData.append('Id', '0');
    formData.append('Icono', '');
    formData.append('Observacion', '');
    formData.append('Usuario', sCod_Usuario);


    this.comercialService.cargarImagenes2(
      formData
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataSource.data = result;
        } else {
          this.dataSource.data = [];
          this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.dataSource.data = [];
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })
  }


  closeModal() {
    this.dialogRef.close();
  }

}
