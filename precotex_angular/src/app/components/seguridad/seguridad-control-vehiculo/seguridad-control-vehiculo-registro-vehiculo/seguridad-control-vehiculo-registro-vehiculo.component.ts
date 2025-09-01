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
import { DialogVehiculoRegistrarVehiculoComponent } from '../dialog-vehiculo/dialog-vehiculo-registrar-vehiculo/dialog-vehiculo-registrar-vehiculo.component';
import { DialogConfirmacionComponent } from '../../../dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { DialogEliminarComponent } from '../../../dialogs/dialog-eliminar/dialog-eliminar.component';
import { NgxSpinnerService }  from "ngx-spinner";


interface data_det {
  Cod_Conductor:      string, 
  Nro_DocIde:         string,
  Nombres:            string,
  Num_Licencia_Cond:  string,
  Categoria_Licencia: string,
  Fec_Fin_Licencia:   string,
  Flg_Status:         string,

}

interface Conductor {
  Cod_Conductor:      string;
  Nro_DocIde:         string;
  Nombres:            string;
  Num_Licencia_Cond:  string;
  Categoria_Licencia: string;
  Fec_Fin_Licencia:   string;
  Flg_Status:         string;
  Fec_Registro:       string;
}


@Component({
  selector: 'app-seguridad-control-vehiculo-registro-vehiculo',
  templateUrl: './seguridad-control-vehiculo-registro-vehiculo.component.html',
  styleUrls: ['./seguridad-control-vehiculo-registro-vehiculo.component.scss']
})
export class SeguridadControlVehiculoRegistroVehiculoComponent implements OnInit {

  listar_operacionConductor:  Conductor[] = [];
  filtroOperacionConductor:   Observable<Conductor[]> | undefined;


  public data_det = [{
    Num_Auditoria:  "",
    Fec_Auditoria:  "",
    Cod_Auditor:    "",
    Nom_Cliente:    "",
    Cod_EstCli:     "",
    Cod_ColCli:     "",
    Cantidad_Total: "",
  }]

  
  // nuevas variables
  Des_Vehiculo      = ''
  Num_Placa         = ''
  Cod_Accion        = ''
  Cod_Barras        = ''
  Flg_Activo        = ''
  Cod_Conductor     = ''
  Num_Soat          = ''
  Fec_Fin_Soat      = ''
  Num_Tarjeta_Prop  = ''
  Tmp_Carga         = ''
  Tmp_Descarga      = ''
  Cod_Vehiculo      = ''


  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    sConductor:   [''],
    sDni:         [''],
    sColor:       [''],
    sAuditor:     [''],
    fec_registro: [''],
    sCod_Barras:  [''],
    sPlaca:       ['']
  }) 
 

  displayedColumns_cab: string[] = ['Cod_Vehiculo',
                                    'Num_Placa',
                                    'Cod_barras',
                                    'Nom_Conductor',
                                    'Num_Soat',
                                    'Fec_Fin_Soat', 
                                    'Num_Tarjeta_Prop',
                                    'Tmp_Carga', 
                                    'Tmp_Descarga', 
                                    'Flg_Activo',  
                                    'acciones']
                                    
  dataSource: MatTableDataSource<data_det>;



  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    /*this.CargarOperacionConductor()*/
    this.MostrarCabeceraVehiculo()
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
 

  clearDate(event) {
    event.stopPropagation();
    this.formulario.controls['fec_registro'].setValue('')
  }


  openDialog() {

    let dialogRef = this.dialog.open(DialogVehiculoRegistrarVehiculoComponent, {
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == 'false') {
        //this.CargarOperacionConductor()
        this.MostrarCabeceraVehiculo()
      }
 
    })

  }


  openDialogModificar( Cod_Vehiculo: string,Num_Placa: string) {
    
    let dialogRef = this.dialog.open(DialogVehiculoRegistrarVehiculoComponent, {
      disableClose: true,
      data: {Num_Placa: Num_Placa, Cod_Vehiculo: Cod_Vehiculo}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == 'false') {
        //this.CargarOperacionConductor()
        this.MostrarCabeceraVehiculo()
      }
  
    })

  }



  MostrarCabeceraVehiculo() {

    this.SpinnerService.show();
    this.Cod_Accion       = 'L'
    this.Des_Vehiculo     = ''
    this.Num_Placa        = this.formulario.get('sPlaca')?.value
    this.Cod_Barras       = this.formulario.get('sCod_Barras')?.value
    this.Flg_Activo       = ''
    this.Num_Soat         = ''
    this.Fec_Fin_Soat     = ''
    this.Num_Tarjeta_Prop = ''
    this.Tmp_Carga        = ''
    this.Tmp_Descarga     = ''
    this.Cod_Conductor    = ''

    /*if (this.formulario.get('sConductor')?.value == '') {
      this.nombres = ''
    }*/
    this.seguridadControlVehiculoService.mantenimientoVehiculoService(
      this.Cod_Accion,
      this.Des_Vehiculo,
      this.Num_Placa,
      this.Cod_Barras,
      this.Flg_Activo,
      this.Num_Soat,
      this.Fec_Fin_Soat,
      this.Num_Tarjeta_Prop,
      this.Tmp_Carga,
      this.Tmp_Descarga,
      this.Cod_Conductor,
      this.Cod_Vehiculo
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {

          this.dataSource.data = result
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


  EliminarRegistro(Num_Placa: string, Cod_Vehiculo: string) {
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.Cod_Accion       = 'D'
        this.Des_Vehiculo     = ''
        this.Num_Placa        = ''
        this.Cod_Barras       = ''
        this.Flg_Activo       = ''
        this.Num_Soat         = ''
        this.Fec_Fin_Soat     = ''
        this.Num_Tarjeta_Prop = ''
        this.Tmp_Carga        = ''
        this.Tmp_Descarga     = ''
        this.Cod_Conductor    = ''
        this.Cod_Vehiculo     = Cod_Vehiculo
        this.seguridadControlVehiculoService.mantenimientoVehiculoService(
          this.Cod_Accion,
          this.Des_Vehiculo,
          this.Num_Placa,
          this.Cod_Barras,
          this.Flg_Activo,
          this.Num_Soat,
          this.Fec_Fin_Soat,
          this.Num_Tarjeta_Prop,
          this.Tmp_Carga,
          this.Tmp_Descarga,
          this.Cod_Conductor,
          this.Cod_Vehiculo
        ).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              this.MostrarCabeceraVehiculo()
              this.matSnackBar.open('El registro se elimino correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

      }

    })
  } 

  CargarOperacionConductor() {

   /* this.listar_operacionConductor = [];
    this.Cod_Accion = 'L'
    this.Cod_Conductor = ''
    this.dni = ''
    this.nombres = ''
    this.apellido_p = ''
    this.apellido_m = ''
    this.seguridadControlVehiculoService.mantenimientoConductorService(
      this.Cod_Accion, 
      this.Cod_Conductor, 
      this.dni, 
      this.nombres, 
      this.apellido_p, 
      this.apellido_m,
      this.Numlic,
      this.Cat,
      this.Fec_Fin_Lic,
      this.Flg_Status).subscribe(
      (result: any) => {
        this.listar_operacionConductor = result
        this.RecargarOperacionConductor()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  */
  }


  RecargarOperacionConductor() {
    /*this.filtroOperacionConductor = this.formulario.controls['sConductor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionConductor(option) : this.listar_operacionConductor.slice())),
    );
      */
  }
  private _filterOperacionConductor(value: string): Conductor[] {
    if (value == null || value == undefined) {
      value = ''

    }

    const filterValue = value.toLowerCase();

    return this.listar_operacionConductor.filter(option => option.Nombres.toLowerCase().includes(filterValue));
  }


  OpenDialogConfirmacion(Num_Placa: string){
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == 'true') {
        console.log(Num_Placa)
        this.actualizarEstadoVehiculo(Num_Placa)
      }
 
    })
  }


  actualizarEstadoVehiculo(Cod_Vehiculo: string){
    this.Cod_Accion       = 'E'
    this.Des_Vehiculo     = ''
    this.Num_Placa        = ''
    this.Cod_Barras       = ''
    this.Flg_Activo       = ''
    this.Num_Soat         = ''
    this.Fec_Fin_Soat     = ''
    this.Num_Tarjeta_Prop = ''
    this.Tmp_Carga        = ''
    this.Tmp_Descarga     = ''
    this.Cod_Conductor    = ''
    this.Cod_Vehiculo     = Cod_Vehiculo
    this.seguridadControlVehiculoService.mantenimientoVehiculoService(
      this.Cod_Accion,
      this.Des_Vehiculo,
      this.Num_Placa,
      this.Cod_Barras,
      this.Flg_Activo,
      this.Num_Soat,
      this.Fec_Fin_Soat,
      this.Num_Tarjeta_Prop,
      this.Tmp_Carga,
      this.Tmp_Descarga,
      this.Cod_Conductor,
      this.Cod_Vehiculo
    ).subscribe(
      (result: any) => {
          this.MostrarCabeceraVehiculo()
          //this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
    
  }

 


}


