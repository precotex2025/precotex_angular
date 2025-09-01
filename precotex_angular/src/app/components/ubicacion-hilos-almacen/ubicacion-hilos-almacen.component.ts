import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { DialogUbicacionRegistrarComponent } from './dialog-ubicacion/dialog-ubicacion-registrar/dialog-ubicacion-registrar.component';

import { UbicacionHilosAlmacenService } from 'src/app/services/ubicacion-hilos-almacen.service';
import { DialogEliminarComponent } from '../dialogs/dialog-eliminar/dialog-eliminar.component';
import { NgxSpinnerService }  from "ngx-spinner";
import { HttpErrorResponse } from '@angular/common/http';
import { startWith, map, debounceTime } from 'rxjs/operators';

interface data_det {
  
  Id_Num:              number,
  Rack_ubicacion:      string,
  Piso_ubicacion:      string,
  Nicho_ubicacion:     string,
  Cod_ubicacion:      string,
}
 
interface Ubicacion {
  Id_Num:             Number;
  Rack_ubicacion:     string;
  Piso_ubicacion:     string;
  Nicho_ubicacion:    string;
  Cod_ubicacion:      string;
}




@Component({
  selector: 'app-ubicacion-hilos-almacen',
  templateUrl: './ubicacion-hilos-almacen.component.html',
  styleUrls: ['./ubicacion-hilos-almacen.component.scss']
})



export class UbicacionHilosAlmacenComponent implements OnInit {

  listar_operacionUbicacion:  Ubicacion[] = [];
  filtroOperacionUbicacion:   Observable<Ubicacion[]> | undefined;

  public data_det = [{
    Id_Num:             0,
    Rack_ubicacion:    "",
    Piso_ubicacion:    "",
    Nicho_ubicacion:   "",
    Cod_ubicacion:     "",
    
  }]


  
  // nuevas variables
  Id_Num                        = 0
  Cod_Accion                           = ''
  Cod_ubicacion                           = ''
  Rack_ubicacion                       = 0
  Piso_ubicacion                    = ''
  Nicho_ubicacion                    = 0
  

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    sIdNum:           [''],
    sCodUbicacion:   [''],
    sRack:         [''],
    sPiso:       [''],
    sNicho:     ['']
  })


  displayedColumns_cab: string[] = [ 'Id_Num', 
                                      
                                      'Rack_ubicacion', 
                                      'Piso_ubicacion',
                                       'Nicho_ubicacion',
                                        'Cod_ubicacion',
                                         'acciones']
  dataSource: MatTableDataSource<data_det>;

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private UbicacionHilosAlmacenService: UbicacionHilosAlmacenService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;




  ngOnInit(): void {
    this.MostrarCabeceraUbicacion()
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
 



  openDialog() {

    let dialogRef = this.dialog.open(DialogUbicacionRegistrarComponent, {
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == 'false') {
         this.CargarOperacionUbicacion()
         this.MostrarCabeceraUbicacion()
      }
 
    })

  }


  openDialogModificar(Id_Num: number) {
    
    let dialogRef = this.dialog.open(DialogUbicacionRegistrarComponent, {
      disableClose: true,
      data: {Id_Num: Id_Num}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == 'false') {
        this.CargarOperacionUbicacion()
        this.MostrarCabeceraUbicacion()
      }
 
    })

  } 



  MostrarCabeceraUbicacion() {
    this.SpinnerService.show();
    this.Cod_Accion     = 'L'
    this.Id_Num         = 0
    this.Rack_ubicacion = 0
    this.Piso_ubicacion = ''
    this.Nicho_ubicacion = 0
    this.Cod_ubicacion  = this.formulario.get('sCodUbicacion')?.value

    this.UbicacionHilosAlmacenService.mantenimientoBultoService(
      this.Cod_Accion,
      this.Id_Num,
      this.Rack_ubicacion,
      this.Piso_ubicacion,
      this.Nicho_ubicacion,
      this.Cod_ubicacion
      ).subscribe(
      (result: any) => {
        if (result.length > 0) {

          this.dataSource.data = result
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros.......!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }


  


  MostrarUbicacionxCodigo() {
    this.SpinnerService.show();
    this.Cod_Accion     = 'F'
    this.Id_Num         = 0
    this.Rack_ubicacion = 0
    this.Piso_ubicacion = ''
    this.Nicho_ubicacion = 0
    this.Cod_ubicacion  = this.formulario.get('sCodUbicacion')?.value

    this.UbicacionHilosAlmacenService.mantenimientoBultoService(
      this.Cod_Accion,
      this.Id_Num,
      this.Rack_ubicacion,
      this.Piso_ubicacion,
      this.Nicho_ubicacion,
      this.Cod_ubicacion
      ).subscribe(
      (result: any) => {
        if (result.length > 0) {

          this.dataSource.data = result
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros.......!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }





  CargarOperacionUbicacion() {

    this.listar_operacionUbicacion = [];
    this.Cod_Accion = 'L'
    this.Id_Num= 0
    this.Cod_ubicacion = ''
    this.Rack_ubicacion = 0
    this.Piso_ubicacion = ''
    this.Nicho_ubicacion = 0
    this.UbicacionHilosAlmacenService.mantenimientoBultoService(
      this.Cod_Accion, 
      this.Id_Num,
      this.Rack_ubicacion, 
      this.Piso_ubicacion, 
      this.Nicho_ubicacion, 
      this.Cod_ubicacion ).subscribe(
      (result: any) => {
        this.listar_operacionUbicacion = result
        //this.RecargarOperacionUbicacion()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  RecargarOperacionUbicacion() {
    this.filtroOperacionUbicacion = this.formulario.controls['sCodUbicacion'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionConductor(option) : this.listar_operacionUbicacion.slice())),
    );

  }

  private _filterOperacionConductor(value: string): Ubicacion[] {
    if (value == null || value == undefined) {
      value = ''

    }

    const filterValue = value.toLowerCase();

    return this.listar_operacionUbicacion.filter(option => option.Cod_ubicacion.toLowerCase().includes(filterValue));
  }



  EliminarRegistro(Id_Num: number) {
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.Cod_Accion       = 'D'
        this.Id_Num         =Id_Num
        this.Rack_ubicacion = 0
        this.Piso_ubicacion = ''
        this.Nicho_ubicacion = 0
        this.Cod_ubicacion = ''
        this.UbicacionHilosAlmacenService.mantenimientoBultoService(
          this.Cod_Accion,
          this.Id_Num,
          this.Rack_ubicacion,
          this.Piso_ubicacion,
          this.Nicho_ubicacion,
          this.Cod_ubicacion
        ).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              this.MostrarCabeceraUbicacion()
              this.matSnackBar.open('El registro se elimino correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

      }

    })
  } 

 

 


}
