import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { startWith, map, debounceTime } from 'rxjs/operators';



@Component({
  selector: 'app-dialog-detalle-externo-crear-imagenes',
  templateUrl: './dialog-detalle-externo-crear-imagenes.component.html',
  styleUrls: ['./dialog-detalle-externo-crear-imagenes.component.scss']
})
export class DialogDetalleExternoCrearImagenesComponent implements OnInit {

  constructor(private matSnackBar: MatSnackBar,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) {

  }

  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('inputFile2') inputFile2: ElementRef;
  datos: any = [];
  dataImagenes = [];
  mostrar = false;

  ngOnInit(): void { 
    this.cargarListaImagenes()
    console.log('Dialog cargar imagenes open')
    
  }

  cargarListaImagenes() {
    console.log('Cargando imagenes')
  }

  guardarImagen(event, tipo) {

    console.log(event);
    console.log(tipo);
    var eltipo = '';
    if (tipo == 'guardar') {
      eltipo = 'I';
    } else {
      eltipo = 'U';
    }

    var sCod_Usuario = GlobalVariable.vusu;
    const formData = new FormData();
    formData.append('Tipo', eltipo);
    formData.append('Usuario', sCod_Usuario);
    formData.append('Foto', event.target.files[0]);
    
    this.auditoriaInspeccionCosturaService.cargarImagenes(
      formData
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataImagenes = result;
          /*var data = this.dataImagenes.filter(element => {
            return element.Icono != ''
          });*/

          console.log(result);

          /*if(data.length == 0){
            this.mostrar = true;
          }else{
            this.mostrar = false;
          }*/

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

  eliminarImagen() {
    console.log('Eliminar imagen')
  }

  mostrarImagen(){
    console.log('Mostrar imagen')
  }




}

 