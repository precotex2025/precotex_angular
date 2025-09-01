import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { IngresoRolloTejidoService } from 'src/app/services/ingreso-rollo-tejido.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { Router } from '@angular/router';
import { EncuestasComedorService } from 'src/app/services/comedor/encuestas-comedor.service';
import { CrearPreguntasComedorComponent } from './crear-preguntas-comedor/crear-preguntas-comedor.component';
import { CrearCabPreguntasComponent } from './crear-cab-preguntas/crear-cab-preguntas.component';
import { DialogConfirmacionComponent } from '../../dialogs/dialog-confirmacion/dialog-confirmacion.component';


interface data_det {
  Tipo_Servicio: string,
  Titulo: string,
  Descripcion: string,
  Id_Cabecera: string,
  Flg_Estado: string
}

@Component({
  selector: 'app-mantenimientos-correos',
  templateUrl: './mantenimientos-correos.component.html',
  styleUrls: ['./mantenimientos-correos.component.scss']
})
export class MantenimientosCorreosComponent implements OnInit {


  displayedColumns: string[] = [
    'Tipo_Servicio',
    'Titulo',
    'Flg_Estado',
    'acciones'
  ];

  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private _router: Router,
    private encuestasService: EncuestasComedorService,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

    this.obtenerPreguntasComedor();
  }

  ngAfterViewInit() {
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

  OpenDialogConfirmacion(data) {
    let dialogRef = this.dialog.open(CrearCabPreguntasComponent, {
      disableClose: false,
      //minWidth: '600px',
      panelClass: 'my-class',
      maxWidth: '95%',
      data: {
        datos: data,
        tipo: 2
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log(result); 
        if(result == undefined) {
          this.obtenerPreguntasComedor();
        }
        
    })
  }

  OpenDialogEstado(data:data_det, estado){
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == 'true') {
        this.actualizarEstadoCabecera(data, estado)
      }
    })
  }

  actualizarEstadoCabecera(data:data_det, estado){
    this.encuestasService.obtenerPreguntaCabComedor(
      'E',
      data.Id_Cabecera,
      data.Tipo_Servicio,
      data.Titulo,
      '',
      estado
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open('Se actualizo el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.obtenerPreguntasComedor();
        }else{
          this.matSnackBar.open('Ha ocurrido un error al actualizar el registro!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
        })
      })
  }


  OpenDeleteConfirmacion(data) {
    console.log(data);
    if (confirm('Esta seguro(a) de eliminar el siguiente registro?')) {
      this.SpinnerService.show();
      this.encuestasService.obtenerPreguntaCabComedor(
        'D',
        data.Id_Cabecera,
        '',
        '',
        '',
        ''
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Se elimino el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
            this.obtenerPreguntasComedor();
          }else{
            this.matSnackBar.open('Ha ocurrido un error al eliminar el registro!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
          })
        })
    }

  }


  obtenerPreguntasComedor() {
    this.dataSource.data = [];
    this.SpinnerService.show();
    this.encuestasService.obtenerPreguntaCabComedor(
      'L',
      '',
      '',
      '',
      '',
      ''
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataSource.data = result;
        }else{
          this.matSnackBar.open('No se encontraron registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
        })
      })

  }

  openDialogTipos() {
    let dialogRef = this.dialog.open(CrearCabPreguntasComponent, {
      disableClose: false,
      //minWidth: '600px',
      panelClass: 'my-class',
      maxWidth: '95%',
      data: {
        tipo: 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log(result); 
        if(result == undefined) {
          this.obtenerPreguntasComedor();
        }
        
    })
  }

  openDialogDetalle() {
    this._router.navigate(['/mantenimiento-preguntas-det']);
  }

}
