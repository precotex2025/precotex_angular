import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { ComercialService } from 'src/app/services/comercial.service';
import { DialogVerAuditoriaFinalComponent } from '../dialog-ver-auditoria-final/dialog-ver-auditoria-final.component';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service'; 

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
  selector: 'app-dialog-crear-imagenes-auditoria-final',
  templateUrl: './dialog-crear-imagenes-auditoria-final.component.html',
  styleUrls: ['./dialog-crear-imagenes-auditoria-final.component.scss']
})
export class DialogCrearImagenesAuditoriaFinalComponent implements OnInit {
  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('inputFile2') inputFile2: ElementRef;
  datos: any = [];
  displayedColumns: string[] = [
    'Id',
    'Imagen',
    'acciones'
  ];
  Rol = '';
  mostrar = false;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  constructor(private dialogRef: MatDialogRef<DialogCrearImagenesAuditoriaFinalComponent>, 
    private matSnackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: data, 
    private dialog: MatDialog,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService, 
    private SpinnerService: NgxSpinnerService,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService) { }

  ngOnInit(): void {
    this.cargarLista();    
    this.Rol = GlobalVariable.vusu;
    
    // Reemplaza validación los permisos a usuarios.  2024Nov11, Ahmed
    // 103 - Auditoria Final Servicios
    this.validarCRUDUsuario(103);
  }

  guardarImagen(event, tipo, data) {

    var eltipo = '';
    if (tipo == 'guardar') {
      eltipo = 'I';
    } else {
      eltipo = 'U';
    }

    var sCod_Usuario = GlobalVariable.vusu;
    const formData = new FormData();
    formData.append('Tipo', eltipo);
    formData.append('Num_Auditoria_Imagen', '');
    formData.append('Num_Auditoria_Detalle', data.Num_Auditoria_Detalle);
    formData.append('Imagen', event.target.files[0]);
    formData.append('Usuario', sCod_Usuario);
    formData.append('Id', data.Id);

    this.SpinnerService.show();
    this.auditoriaInspeccionCosturaService.cargarImagenesAuditoriaFinal(
      formData
    ).subscribe(
      (result: any) => {

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

  mostrarImagen(data) {
    var sCod_Usuario = GlobalVariable.vusu;
    const formData = new FormData();
    formData.append('Tipo', 'M');
    formData.append('Num_Auditoria_Imagen', '');
    formData.append('Num_Auditoria_Detalle', data.Num_Auditoria_Detalle);
    formData.append('Imagen', '');
    formData.append('Usuario', sCod_Usuario);
    formData.append('Id', data.Id);

    this.SpinnerService.show();

    this.auditoriaInspeccionCosturaService.cargarImagenesAuditoriaFinal(
      formData
    ).subscribe(
      (result: any) => {


        this.SpinnerService.hide();
        if (result.length > 0) {
          let dialogRef = this.dialog.open(DialogVerAuditoriaFinalComponent,
            {
              disableClose: true,
              minWidth: '85%',
              minHeight: '80%',
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

      let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'true') {
        
      var sCod_Usuario = GlobalVariable.vusu;
      const formData = new FormData();
      formData.append('Tipo', 'D');
      formData.append('Num_Auditoria_Imagen', '');
      formData.append('Num_Auditoria_Detalle', data.Num_Auditoria_Detalle);
      formData.append('Imagen', '');
      formData.append('Usuario', sCod_Usuario);
      formData.append('Id', data.Id);

      this.SpinnerService.show();
      this.auditoriaInspeccionCosturaService.cargarImagenesAuditoriaFinal(
        formData
      ).subscribe(
        (result: any) => {

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

    })

  }

  cargarLista() {
    var Num_Auditoria_Detalle = this.data.data['Num_Auditoria_Detalle'];

    var sCod_Usuario = GlobalVariable.vusu;
    const formData = new FormData();

    formData.append('Tipo', 'V');
    formData.append('Num_Auditoria_Imagen', '');
    formData.append('Num_Auditoria_Detalle', Num_Auditoria_Detalle);
    formData.append('Imagen', '');
    formData.append('Usuario', sCod_Usuario);
    formData.append('Id', '0');

    this.auditoriaInspeccionCosturaService.cargarImagenesAuditoriaFinal(
      formData
    ).subscribe(
      (result: any) => {

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

  /*
  Validar y establecer accesos CRUD del Usuario
  2024Nov11, Ahmed
  */
  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;

        if(crud.length > 0){
          //console.log(crud)
          this.mostrar = crud[0].Flg_Insertar == 1 ? true : false;
        } 
      });

  }

}
