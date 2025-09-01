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
import { DialogRegistroUsuariosComponent } from './dialog-registro-usuarios/dialog-registro-usuarios.component';
import { ModificarUsuarioWebComponent } from './modificar-usuario-web/modificar-usuario-web.component';

interface data_det {
  Id_Usuario:      string, 
  Cod_Usuario:      string, 
  Nom_usuario:         string,
  Tip_Trabajador:            string,
  Cod_Trabajador:  string,
  Empresa: string,
  Flg_Activo:   string,
  Fecha_Registro:         string,
  Password: string
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
  selector: 'app-accesos-usuarios',
  templateUrl: './accesos-usuarios.component.html',
  styleUrls: ['./accesos-usuarios.component.scss']
})
export class AccesosUsuariosComponent implements OnInit {

  listar_operacionConductor:  Conductor[] = [];
  filtroOperacionConductor:   Observable<Conductor[]> | undefined;



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
    Nombres:   [null]
  })


  displayedColumns_cab: string[] = [
    'Cod_Usuario',
    'Nom_usuario',
    'Tip_Trabajador',
    'Cod_Trabajador',
    'Empresa',
    'Fecha_Registro',
    'Flg_Activo',
    'Password',
    'Des_Rol',
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

    this.MostrarCabeceraUsuarios()
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
    let dialogRef = this.dialog.open(DialogRegistroUsuariosComponent, {
      disableClose: true,
      panelClass: 'my-class',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      
      
 
    })

  }


  openDialogModificar( data) {
    console.log(data);
    let dialogRef = this.dialog.open(ModificarUsuarioWebComponent, {
      disableClose: true,
      minWidth:600,
      minHeight:400,
      data: {
        data:data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.MostrarCabeceraUsuarios();
    })
  } 



  MostrarCabeceraUsuarios() {

    this.SpinnerService.show();
    this.nombres = this.formulario.get('Nombres')?.value

    this.seguridadControlVehiculoService.mantenimientoUsuariosService(
      this.nombres
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result);
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
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
      this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
      })

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
              this.MostrarCabeceraUsuarios()
              this.matSnackBar.open('El registro se elimino correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

      }

    })
  }


  OpenDialogConfirmacion(Cod_Conductor: string, estado){
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == 'true') {
        this.actualizarEstadoConductor(Cod_Conductor, estado)
      }
    })
  }


  actualizarEstadoConductor(Cod_Conductor: string, estado){

    this.seguridadControlVehiculoService.seg_modificar_estado_usuario(Cod_Conductor, estado).subscribe(
      (result: any) => {
          this.MostrarCabeceraUsuarios()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  AsignarNumAuditoriaModificar(Nro_DocIde: string, Cod_Conductor: string) {
    
  }


}
