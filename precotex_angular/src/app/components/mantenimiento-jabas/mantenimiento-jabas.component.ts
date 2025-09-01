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
  selector: 'app-mantenimiento-jabas',
  templateUrl: './mantenimiento-jabas.component.html',
  styleUrls: ['./mantenimiento-jabas.component.scss']
})
export class MantenimientoJabasComponent implements OnInit {

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


  sAbr            = ''
  sNom_Cli        = ''
  sCod_Cli        = ''
  vEstilo         = ''
  vColor          = ''
  vAuditor        =  ''
  vTemporada      = ''
  vTalla          = ''
  vCant           = ''
  vCod_Accion     = ''
  vNum_Auditoria  = 0
  vMotivo         = ''



  // nuevas variables
  dni                           = ''
  nombres                       = ''
  Cod_Accion                    = ''
  apellido_p                    = ''
  apellido_m                    = ''
  Cod_Conductor                 = ''
  Codigo_Conductor_a_Modificar  = ''
  Numlic                        = ''
  Cat                           = ''
  Fec_Fin_Lic                   = ''
  Flg_Status                    = ''

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    sConductor:   [''],
    sDni:         [''],
    sColor:       [''],
    sAuditor:     [''],
    fec_registro: ['']
  })


  displayedColumns_cab: string[] = ['Cod_Conductor', 'Nro_DocIde', 'Nombres', 'Num_Licencia_Cond', 'Categoria_Licencia', 'Fec_Fin_Licencia', 'Flg_Status', 'acciones']
  dataSource: MatTableDataSource<data_det>;



  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    this.CargarOperacionConductor()
    this.MostrarCabeceraConductor()
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


  }


  openDialogModificar( Cod_Conductor: string, Nro_DocIde: string) {
   

  } 



  MostrarCabeceraConductor() {

    this.SpinnerService.show();
    this.Cod_Accion     = 'L'
    this.Cod_Conductor  = ''
    this.dni = this.formulario.get('sDni')?.value
    this.nombres = this.formulario.get('sConductor')?.value
    this.apellido_p = ''
    this.apellido_m = ''
    if (this.formulario.get('sConductor')?.value == '') {
      this.nombres = ''
    }
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
      this.Flg_Status
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {

         /* result.forEach((currentValue, index) => {
            result[index].Fec_Fin_Licencia2 = _moment(result[index].Fec_Fin_Licencia2['date'].valueOf()).format('DD/MM/YYYY')
          });*/

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


  EliminarRegistro(Nro_DocIde: string, Cod_Conductor: string) {
    console.log(Cod_Conductor)
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.Cod_Accion = 'D'
        this.Cod_Conductor = Cod_Conductor
        this.dni        = ''
        this.nombres    = ''
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
          this.Flg_Status
        ).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              this.MostrarCabeceraConductor()
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

    this.listar_operacionConductor = [];
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
  }


  RecargarOperacionConductor() {
    this.filtroOperacionConductor = this.formulario.controls['sConductor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionConductor(option) : this.listar_operacionConductor.slice())),
    );

  }
  private _filterOperacionConductor(value: string): Conductor[] {
    if (value == null || value == undefined) {
      value = ''

    }

    const filterValue = value.toLowerCase();

    return this.listar_operacionConductor.filter(option => option.Nombres.toLowerCase().includes(filterValue));
  }


  OpenDialogConfirmacion(Cod_Conductor: string){
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == 'true') {

        this.actualizarEstadoConductor(Cod_Conductor)
      }
 
    })
  }


  actualizarEstadoConductor(Cod_Conductor: string){
    this.Cod_Accion = 'E'
    this.Cod_Conductor = Cod_Conductor
    this.dni        = ''
    this.nombres    = ''
    this.apellido_p = ''
    this.apellido_m = ''
    this.Flg_Status = ''
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
      this.Flg_Status
    ).subscribe(
      (result: any) => {
          this.MostrarCabeceraConductor()
          //this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  AsignarNumAuditoriaModificar(Nro_DocIde: string, Cod_Conductor: string) {
    
  }


}


