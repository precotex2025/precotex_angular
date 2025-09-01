import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogConfirmacionComponent } from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalVariable } from 'src/app/VarGlobals';

interface data_det {
  Id: string,
  Ticket: string,
  Tipo_Proceso: string,
  Cod_Fabrica: string,
  Cod_OrdPro: string,
  COD_PRESENT: string,
  COD_TALLA: string,
  Num_Paquete: string,
  Usuario_Creacion: string

}

@Component({
  selector: 'app-modular-liberar-paquete',
  templateUrl: './modular-liberar-paquete.component.html',
  styleUrls: ['./modular-liberar-paquete.component.scss']
})
export class ModularLiberarPaqueteComponent implements OnInit {


  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Ticket: [''],
    Usuario: ['']
  })
  ticket: any = '';
  usuario: any = '';
  dataResult: any = [];

  filtro: any;
  displayedColumns_cab: string[] = [
    'Id',
    'Ticket',
    'Tipo_Proceso',
    'Cod_Fabrica',
    'Cod_OrdPro',
    'COD_PRESENT',
    'COD_TALLA',
    'Num_Paquete',
    'Usuario_Creacion',
    'acciones'
  ]
  dataSource: MatTableDataSource<data_det>;



  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

    this.MostrarCabeceraPaquetes()
  }

  ngAfterViewInit() {
    console.log(this.paginator);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };

  }


  clearDate(event) {
    event.stopPropagation();
    this.formulario.controls['fec_registro'].setValue('')
  }


  openDialog() {


  }


  openDialogModificar(Cod_Conductor: string, Nro_DocIde: string) {


  }



  MostrarCabeceraPaquetes() {

    this.SpinnerService.show();
    this.usuario = this.formulario.get('Usuario')?.value
    this.ticket = this.formulario.get('Ticket')?.value

    this.seguridadControlVehiculoService.CF_MUESTRA_MODULAR_PAQUETES_FINALIZADO(
      this.ticket,
      this.usuario
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          /* result.forEach((currentValue, index) => {
             result[index].Fec_Fin_Licencia2 = _moment(result[index].Fec_Fin_Licencia2['date'].valueOf()).format('DD/MM/YYYY')
           });*/
          this.dataResult = result;
          this.dataSource.data = result;
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }
  InputSearch() {
    var nombre = this.formulario.get('Usuario').value;
    var array = this.dataResult;

    var filtrado = this.dataResult;

    if (nombre != '') {
      var filtro = [];
      filtro = filtrado.filter(element => {
        return element.Nom_usuario.toUpperCase().match(nombre.toUpperCase()) || element.Cod_Trabajador.toUpperCase().match(nombre.toUpperCase());
      });
      this.dataSource.data = filtro;
    } else {
      this.dataSource.data = array;
    }
  }

  EliminarRegistro(Nro_DocIde: string, Cod_Conductor: string) {
    console.log(Cod_Conductor)
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        


      }

    })
  }


  OpenDialogConfirmacion(Id: string) {
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      disableClose: true,
      data: {}
    });
    var usuario = GlobalVariable.vusu;
    console.log(usuario);
    dialogRef.afterClosed().subscribe(result => {

      if (result == 'true') {
        console.log('aceptado');

        this.SpinnerService.show();
        this.seguridadControlVehiculoService.CF_Modular_Inspeccion_Prenda_Reversion_Paquete(
          Id,
          usuario
        ).subscribe(
          (result: any) => {
            console.log(result);
            if(result[0].Respuesta == 'OK'){
              this.matSnackBar.open("SE ACTUALIZO EL PAQUETE CORRECTAMENTE..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.MostrarCabeceraPaquetes();
              this.SpinnerService.hide();
            }else{
              this.matSnackBar.open("Ha ocurrido un error!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.SpinnerService.hide();
            }
              
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))
      }

    })
  }


}
