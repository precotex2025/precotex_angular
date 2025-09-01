import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogConfirmacionComponent } from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalVariable } from 'src/app/VarGlobals';

interface data_det {
  EMPRESA: string,
  SEDE: string,
  Orden_Compra: string,
  Proveedor: string,
  ClaseOrdenCompra: string,
  Fecha_Creacion_Orden: string,
  Fec_Entrega_Inicio: string,
  Fec_Entrega_Fin: string,
  Fec_Alerta_Control_Patrimonial: string,
  Cod_StaOrdComp: string

}

@Component({
  selector: 'app-seguimiento-ordenes-atencion',
  templateUrl: './seguimiento-ordenes-atencion.component.html',
  styleUrls: ['./seguimiento-ordenes-atencion.component.scss']
})
export class SeguimientoOrdenesAtencionComponent implements OnInit {
 //* Declaramos formulario para obtener los controles */
 formulario = this.formBuilder.group({
  Ticket: [''],
  Usuario: ['']
})

Fec_Inicio                = ''
Fec_Fin                   = ''
ticket: any = '';
usuario: any = '';
dataResult: any = [];

filtro: any;
displayedColumns_cab: string[] = [
  'EMPRESA',
  'SEDE',
  'Orden_Compra',
  'Proveedor',
  'ClaseOrdenCompra',
  'Fecha_Creacion_Orden',
  'Fec_Entrega_Inicio',
  'Fec_Entrega_Fin',
  'Fec_Alerta_Control_Patrimonial',
  'Cod_StaOrdComp',
  'acciones'
]
dataSource: MatTableDataSource<data_det>;

range = new FormGroup({
  start: new FormControl(new Date),
  end: new FormControl(new Date),
});

constructor(private formBuilder: FormBuilder,
  private matSnackBar: MatSnackBar,
  private seguridadControlVehiculoService: SeguridadControlVehiculoService,
  public dialog: MatDialog,
  private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }

@ViewChild(MatPaginator) paginator!: MatPaginator;

ngOnInit(): void {

  this.MostrarCabeceraPaquetes()
}

clearDate(event) {
  event.stopPropagation();
  this.range.controls['start'].setValue('')
  this.range.controls['end'].setValue('')
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



openDialog() {


}


openDialogModificar(Cod_Conductor: string, Nro_DocIde: string) {


}



MostrarCabeceraPaquetes() {

  this.SpinnerService.show();
  this.Fec_Inicio     = this.range.get('start')?.value
  this.Fec_Fin        = this.range.get('end')?.value

  this.seguridadControlVehiculoService.mantenimientoSeguimientoOrdenesService(this.Fec_Inicio, this.Fec_Fin).subscribe(
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
      this.seguridadControlVehiculoService.actualizarPaqueteInspeccionService(
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


actualizarEstadoConductor(Cod_Conductor: string) {

}

AsignarNumAuditoriaModificar(Nro_DocIde: string, Cod_Conductor: string) {

}


}
