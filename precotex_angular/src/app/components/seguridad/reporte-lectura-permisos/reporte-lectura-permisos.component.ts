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
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ExceljsPerService } from 'src/app/services/exceljsper.service';

interface data_det {
  Num_Permiso: string,
  Fec_Permiso: string,
  Nom_Trabajador: string,
  Nom_Trabajador_Aprob: string,
  Des_Tipo_Permiso: string,
  Inicio: string,
  Termino: string,
  Sede_partida: string,
  Cod_Tipo_Permiso: string,
  Inicio_Lectura: string,
  Termino_Lectura:string,
  Tipo_Lectura: string,
  Sede: string,
  Observacion: string

}

@Component({
  selector: 'app-reporte-lectura-permisos',
  templateUrl: './reporte-lectura-permisos.component.html',
  styleUrls: ['./reporte-lectura-permisos.component.scss']
})
export class ReporteLecturaPermisosComponent implements OnInit {
 //* Declaramos formulario para obtener los controles */
 formulario = this.formBuilder.group({
  tipo: ['P']
})

Fec_Inicio                = ''
Fec_Fin                   = ''
ticket: any = '';
usuario: any = '';
dataResult: any = [];

filtro: any;
displayedColumns_cab: string[] = [
  'Num_Permiso',
  'Fec_Permiso',
  'Nom_Trabajador',
  'Nom_Trabajador_Aprob',

  'Des_Tipo_Permiso',
  'Inicio',
  'Termino',
  'Sede_partida',
  //'Cod_Tipo_Permiso',
  'Inicio_Lectura',
  'Tipo_Lectura',
  'Sede',
  'Observacion'
]

displayedColumns_cab2: string[] = [
  'Num_Permiso',
  'Fec_Permiso',
  'Nom_Trabajador',
  'Dni',
  'Nom_Trabajador_Aprob',
  'Motivo_Permiso',
  'Des_Tipo_Permiso',
  'Inicio',
  
  'Termino',
  //'Cod_Tipo_Permiso',
  'Inicio_Lectura',
  'Termino_Lectura',
  'Marcacion_Entrada',
  'Marcacion_Salida',
  'Sede_partida',
  'Observacion'
]


displayedColumns_cab3: string[] = [
  'Num_Permiso',
  'Fec_Permiso',
  'Nom_Trabajador',
  'Nom_Trabajador_Aprob',
  'Des_Tipo_Permiso',
  'Inicio',
  'Termino',
  //'Cod_Tipo_Permiso',
  'Inicio_Lectura',
  'Termino_Lectura',
  'Sede_partida',
  'Observacion'
]
dataSource: MatTableDataSource<data_det>;

range = new FormGroup({
  start: new FormControl(new Date),
  end: new FormControl(new Date),
});

dataForExcel:Array<any> = [];

Tipo:any = 'P';
constructor(private formBuilder: FormBuilder,
  private matSnackBar: MatSnackBar,
  private seguridadControlVehiculoService: SeguridadControlVehiculoService,
  public dialog: MatDialog,
  private SpinnerService: NgxSpinnerService, private exceljsService:ExceljsPerService) { this.dataSource = new MatTableDataSource(); }

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
  
}



generateExcel() {
  this.dataForExcel = [];
  this.dataResult.forEach((row: any) => {
    this.dataForExcel.push(Object.values(row))
  })
  var des = '';
  var tipo = this.formulario.get('tipo').value;
  if(tipo == 'P'){
    des = 'PERMISO'
  }else if(tipo == 'R'){
    des = 'REFRIGERIO'
  }else if(tipo == 'C'){
    des = 'COMISION'
  }else{
    des = 'PERMISO DIA'
  }
  let reportData = {
    title: 'REPORTE LECTURA DE ' + des,
    data: this.dataForExcel,
    headers: Object.keys(this.dataResult[0])
  }

  this.exceljsService.exportExcel(reportData, tipo);

}


buscarUsuario(event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}


MostrarCabeceraPaquetes() {
  this.Tipo = this.formulario.get('tipo').value;
  this.SpinnerService.show();
  this.Fec_Inicio     = this.range.get('start')?.value
  this.Fec_Fin        = this.range.get('end')?.value
  var tipo = this.formulario.get('tipo').value;
  this.seguridadControlVehiculoService.muestraReporteLecturaService(tipo, this.Fec_Inicio, this.Fec_Fin).subscribe(
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





actualizarEstadoConductor(Cod_Conductor: string) {

}

AsignarNumAuditoriaModificar(Nro_DocIde: string, Cod_Conductor: string) {

}


}
