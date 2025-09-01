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
import { ExceljsJabasService } from 'src/app/services/exceljs-jabas.service';
import { IngresoRolloTejidoService } from 'src/app/services/ingreso-rollo-tejido.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { Router } from '@angular/router';
import { EncuestasComedorService } from 'src/app/services/comedor/encuestas-comedor.service';
import { DialogConfirmacionComponent } from '../../dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { JabasCochesService } from 'src/app/services/jabas/jabas-coches.service';
import { DialogJabasCochesComponent } from './dialog-jabas-coches/dialog-jabas-coches.component';
 

interface data_det {
  Tipo_Servicio: string,
  Titulo: string,
  Descripcion: string,
  Id_Cabecera: string,
  Flg_Estado: string
}

@Component({
  selector: 'app-mantenimiento-jaba-coche',
  templateUrl: './mantenimiento-jaba-coche.component.html',
  styleUrls: ['./mantenimiento-jaba-coche.component.scss']
})
export class MantenimientoJabaCocheComponent implements OnInit {

  displayedColumns: string[] = [
    'Codigo',
    'Codigo_Barra',
    'Ubicacion',
    'OK',
    'RL',
    '2RL',
    'RT',
    '2RT',
    'G',
    'OUT',
    'RO',
    'Fecha_Compra',
    'Observacion',
    'Nro_Hoja',
    'Tipo',
    'Cod_Usuario',
    'Fecha_Registro',
    'acciones'
  ];

  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();
  dataForExcel = [];

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private _router: Router,
    private jabasCocheService: JabasCochesService,
    private SpinnerService: NgxSpinnerService,
    private exceljsJabasService: ExceljsJabasService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

    this.obtenerListadoJabas();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    let dialogRef = this.dialog.open(DialogJabasCochesComponent, {
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
          this.obtenerListadoJabas()
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
    // this.encuestasService.obtenerPreguntaCabComedor(
    //   'E',
    //   data.Id_Cabecera,
    //   data.Tipo_Servicio,
    //   data.Titulo,
    //   '',
    //   estado
    // ).subscribe(
    //   (result: any) => {
    //     this.SpinnerService.hide();
    //     if (result[0].Respuesta == 'OK') {
    //       this.matSnackBar.open('Se actualizo el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    //       this.obtenerListadoJabas();
    //     }else{
    //       this.matSnackBar.open('Ha ocurrido un error al actualizar el registro!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    //     }
    //   },
    //   (err: HttpErrorResponse) => {
    //     this.SpinnerService.hide();
    //     this.matSnackBar.open(err.message, 'Cerrar', {
    //     duration: 1500,
    //     })
    //   })
  }


  OpenDeleteConfirmacion(data) {
    console.log(data);
    // if (confirm('Esta seguro(a) de eliminar el siguiente registro?')) {
    //   this.SpinnerService.show();
    //   this.encuestasService.obtenerPreguntaCabComedor(
    //     'D',
    //     data.Id_Cabecera,
    //     '',
    //     '',
    //     '',
    //     ''
    //   ).subscribe(
    //     (result: any) => {
    //       this.SpinnerService.hide();
    //       if (result[0].Respuesta == 'OK') {
    //         this.matSnackBar.open('Se elimino el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
    //         this.obtenerListadoJabas();
    //       }else{
    //         this.matSnackBar.open('Ha ocurrido un error al eliminar el registro!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    //       }
    //     },
    //     (err: HttpErrorResponse) => {
    //       this.SpinnerService.hide();
    //       this.matSnackBar.open(err.message, 'Cerrar', {
    //       duration: 1500,
    //       })
    //     })
    // }

  }


  obtenerListadoJabas() {
    this.dataSource.data = [];
    this.SpinnerService.show();
    this.jabasCocheService.ManteJabasCoches(
      'S',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
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
    let dialogRef = this.dialog.open(DialogJabasCochesComponent, {
      disableClose: false,
      //minWidth: '600px',
      panelClass: 'my-class',
      minWidth: '600px',
      maxWidth: '95%',
      data: {
        tipo: 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log(result); 
        if(result == undefined) {
          this.obtenerListadoJabas();
        }
        
    })
  }

  openDialogDetalle() {
    this._router.navigate(['/mantenimiento-preguntas-det']);
  }

  ExportarJabas() {

    this.dataForExcel = [];
    if (this.dataSource.data.length == 0) {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {

      this.dataSource.data.forEach((row: any) => {       
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE DE JABAS - COCHES',
        data: this.dataForExcel,
        headers: Object.keys(this.dataSource.data[0])
      }

      this.exceljsJabasService.exportExcel(reportData);


    }

  }

}
