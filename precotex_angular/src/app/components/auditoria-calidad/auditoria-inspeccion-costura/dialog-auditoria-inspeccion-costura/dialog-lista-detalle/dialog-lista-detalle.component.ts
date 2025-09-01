import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";

import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { DialogConfirmacionComponent } from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component'
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { GlobalVariable } from 'src/app/VarGlobals';
import { DialogRegistrarDetalleComponent } from '../dialog-registrar-detalle/dialog-registrar-detalle.component';
import { DialogListaSubDetalleComponent } from '../dialog-lista-sub-detalle/dialog-lista-sub-detalle.component';
interface data{
  Cod_LinPro:    string
  Num_Auditoria: number
}

interface data_det {
  Num_Auditoria_Detalle:    number
  Num_Auditoria:            number
  Cod_Inspector:            string
  Nom_Auditor:              string
  Cod_OrdPro:               string
  Cod_Cliente:              string
  Des_Cliente:              string
  Des_EstPro:               string
  Cod_Present:              string
  Des_Present:              string
  Can_Lote:                 number
  Can_Muestra:              number
  Observacion:              string
  Flg_Status:               string
  Cod_Usuario:              string
  Cod_Equipo:               string
  Fecha_Reg:                string
  Can_Defecto:              number
  Cod_EstCli:               string
  Flg_Reproceso:            string
  Flg_Reproceso_Num:        number
  Co_CodOrdPro:             string
  Num_Paquete:              string
}
@Component({
  selector: 'app-dialog-lista-detalle',
  templateUrl: './dialog-lista-detalle.component.html',
  styleUrls: ['./dialog-lista-detalle.component.scss']
})
export class DialogListaDetalleComponent implements OnInit {

  public data_det = [{
    Num_Auditoria_Detalle:    0,
    Num_Auditoria:            0,
    Cod_Inspector:            '',
    Nom_Auditor:              '',
    Cod_OrdPro:               '',
    Cod_Cliente:              '',
    Des_Cliente:              '',
    Des_EstPro:               '',
    Cod_Present:              '',
    Des_Present:              '',
    Can_Lote:                 0,
    Can_Muestra:              0,
    Observacion:              '',
    Flg_Status:               '',
    Cod_Usuario:              '',
    Cod_Equipo:               '',
    Fecha_Reg:                '', 		
    Can_Defecto:              0,
    Cod_EstCli :              '',
    Flg_Reproceso:            '',
    Flg_Reproceso_Num:        0,
    Co_CodOrdPro:             '',
    Num_Paquete:              ''
  }]

 // nuevas variables
  Cod_LinPro              = this.data.Cod_LinPro
  Cod_Accion              = ''
  Num_Auditoria_Detalle   = 0
  Num_Auditoria           = this.data.Num_Auditoria
  Cod_Inspector           = ''
  Cod_OrdPro              = ''
  Cod_Cliente             = ''
  Cod_EstCli              = ''
  Cod_Present             = '' 
  Can_Lote                = 0
  Can_Muestra             = 0
  Observacion             = ''
  Flg_Status              = ''
  Cod_Usuario             = ''
  Cod_Equipo              = ''
  Fecha_Reg               = '' 
  Cod_Supervisor          = ''
  Cod_Auditor             = ''
  Fecha_Auditoria         = ''
  Fecha_Auditoria2        = ''
  Flg_Reproceso           = ''
  Flg_Reproceso_Num       = 0
  Co_CodOrdPro            = ''
  Num_Paquete             = ''
  ll_Supervisor: boolean = false;

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    supervisor:   [''],
    fec_registro: [''],
    auditor:      ['']
  })

  displayedColumns_cab: string[] = ['Num_Auditoria_Detalle','Nom_Inspector', 'Cod_OrdPro', 'Nom_Cliente', 'Cod_EstCli', 'Cod_Present', 'Can_Lote', 'Can_Muestra', 'Can_Defecto','Co_CodOrdPro', 'Num_Paquete','Flg_Status', 'Acciones']
  dataSource: MatTableDataSource<data_det>;

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    //this.CargarOperacionConductor()
    this.MostrarDetalleAuditoria();
    this.validarCRUDUsuario(174);
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


  MostrarDetalleAuditoria() {

    this.SpinnerService.show();
    this.Cod_Accion             = 'L'
    this.Num_Auditoria_Detalle  = 0
    this.Num_Auditoria
    this.Cod_Inspector          = ''
    this.Cod_OrdPro             = ''
    this.Cod_Cliente            = ''
    this.Cod_EstCli             = ''
    this.Cod_Present            = ''
    this.Can_Lote               = 0
    this.Can_Muestra            = 0
    this.Observacion            = ''
    this.Flg_Status             = ''
    this.Flg_Reproceso          = ''
    this.Flg_Reproceso_Num      = 0
    this.Co_CodOrdPro           = ''
    this.Num_Paquete            = ''

    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaDetalleService(
      this.Cod_Accion,
      this.Num_Auditoria_Detalle,
      this.Num_Auditoria,
      this.Cod_Inspector,
      this.Cod_OrdPro,
      this.Cod_Cliente,
      this.Cod_EstCli,
      this.Cod_Present,
      this.Can_Lote,
      this.Can_Muestra,
      this.Observacion,
      this.Flg_Status,
      this.Flg_Reproceso,
      this.Flg_Reproceso_Num,
      this.Co_CodOrdPro,
      this.Num_Paquete 
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result)
          this.dataSource.data = result
          this.SpinnerService.hide();
        }
        else {
          //this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }


  EliminarRegistroDetalle(Num_Auditoria_Detalle: number) {
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.Cod_Accion             = 'D'
        this.Num_Auditoria_Detalle  = Num_Auditoria_Detalle
        this.Num_Auditoria
        this.Cod_Inspector          = ''
        this.Cod_OrdPro             = ''
        this.Cod_Cliente            = ''
        this.Cod_EstCli             = ''
        this.Cod_Present            = ''
        this.Can_Lote               = 0
        this.Can_Muestra            = 0
        this.Observacion            = ''
        this.Flg_Status             = ''
        this.Flg_Reproceso          = ''
        this.Flg_Reproceso_Num      = 0
        this.Co_CodOrdPro           = ''
        this.Num_Paquete            = ''
    
        this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaDetalleService(
          this.Cod_Accion,
          this.Num_Auditoria_Detalle,
          this.Num_Auditoria,
          this.Cod_Inspector,
          this.Cod_OrdPro,
          this.Cod_Cliente,
          this.Cod_EstCli,
          this.Cod_Present,
          this.Can_Lote,
          this.Can_Muestra,
          this.Observacion,
          this.Flg_Status,
          this.Flg_Reproceso,
          this.Flg_Reproceso_Num,
          this.Co_CodOrdPro,
          this.Num_Paquete 
        ).subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
            this.MostrarDetalleAuditoria()
            }
            else{
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

      }

    })
  }





  ModificarRegistroDetalle(Num_Auditoria_Detalle: number, Cod_Inspector: string, Nom_Auditor: string, Cod_OrdPro: string, Cod_Cliente: string, Des_Cliente: string, Cod_EstCli: string, Des_EstPro: string,Cod_Present: string, Des_Present: string, Can_Lote: number, Can_Muestra: number, Observacion: string, Co_CodOrdPro: string, Num_Paquete: string) {

    let dialogRef = this.dialog.open(DialogRegistrarDetalleComponent, {
      disableClose: true,
      data: { Num_Auditoria: this.data.Num_Auditoria,
              Num_Auditoria_Detalle: Num_Auditoria_Detalle,
              Cod_Inspector: Cod_Inspector,
              Nom_Auditor: Nom_Auditor,
              Cod_OrdPro: Cod_OrdPro,
              Cod_Cliente: Cod_Cliente,
              Des_Cliente: Des_Cliente,
              Cod_EstCli: Cod_EstCli,
              Des_EstPro: Des_EstPro,
              Cod_Present: Cod_Present,
              Des_Present: Des_Present,
              Can_Lote: Can_Lote,
              Can_Muestra: Can_Muestra,
              Observacion: Observacion,
              Co_CodOrdPro: Co_CodOrdPro,
              Num_Paquete: Num_Paquete.trim()
            }
    });

    dialogRef.afterClosed().subscribe(result => {

   
        this.MostrarDetalleAuditoria()
  
 
    })
  } 

  openDialogSubDetalle(Num_Auditoria_Detalle: number, Flg_Status: string){
    //if(Flg_Status != 'R' || GlobalVariable.vusu.toUpperCase() == 'RHUAYANA' || GlobalVariable.vusu.toUpperCase() == 'SISTEMAS' || GlobalVariable.vusu.toUpperCase() == 'IVARGAS'){
    if(Flg_Status != 'R' || this.ll_Supervisor){
    let dialogRef = this.dialog.open(DialogListaSubDetalleComponent, {
      disableClose: true,
      data: {Num_Auditoria: this.data.Num_Auditoria, Num_Auditoria_Detalle: Num_Auditoria_Detalle }
    });

    dialogRef.afterClosed().subscribe(result => {

   
        this.MostrarDetalleAuditoria()
    
 
    }) 
  }else{
    this.matSnackBar.open('No puede agregar sub detalle a un reproceso..', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
  }
  }

  openDialogRegistrarDetalle(){
    let dialogRef = this.dialog.open(DialogRegistrarDetalleComponent, {
      disableClose: true,
      data: {Num_Auditoria: this.data.Num_Auditoria}
    });

    dialogRef.afterClosed().subscribe(result => {

   
        this.MostrarDetalleAuditoria()
  
 
    })

  }

  ReprocesoRegistroDetalle(Num_Auditoria_Detalle: number, Cod_Inspector: string, Nom_Auditor: string, Cod_OrdPro: string, Cod_Cliente: string, Des_Cliente: string, Cod_EstCli: string, Des_EstPro: string,Cod_Present: string, Des_Present: string, Can_Lote: number, Can_Muestra: number, Observacion: string, Co_CodOrdPro: string, Num_Paquete: string){
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.Cod_Accion             = 'R'
        this.Num_Auditoria_Detalle  = 0
        this.Num_Auditoria
        this.Cod_Inspector          = Cod_Inspector
        this.Cod_OrdPro             = Cod_OrdPro
        this.Cod_Cliente            = Cod_Cliente
        this.Cod_EstCli             = Cod_EstCli
        this.Cod_Present            = Cod_Present
        this.Can_Lote               = Can_Lote
        this.Can_Muestra            = Can_Muestra
        this.Observacion            = Observacion
        this.Flg_Status             = 'A'
        this.Flg_Reproceso          = ''
        this.Flg_Reproceso_Num      = Num_Auditoria_Detalle
        this.Co_CodOrdPro           = Co_CodOrdPro
        this.Num_Paquete            = Num_Paquete
    
        this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaDetalleService(
          this.Cod_Accion,
          this.Num_Auditoria_Detalle,
          this.Num_Auditoria,
          this.Cod_Inspector,
          this.Cod_OrdPro,
          this.Cod_Cliente,
          this.Cod_EstCli,
          this.Cod_Present,
          this.Can_Lote,
          this.Can_Muestra,
          this.Observacion,
          this.Flg_Status,
          this.Flg_Reproceso,
          this.Flg_Reproceso_Num,
          this.Co_CodOrdPro,
          this.Num_Paquete
        ).subscribe(
          (result: any) => {
            this.MostrarDetalleAuditoria()
            this.matSnackBar.open('Se creo Reproceso de auditoria correctamente..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

        }

      })
  }


  ProcesarFicha(){
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.Cod_Accion         = 'P'
        this.Num_Auditoria      = this.data.Num_Auditoria
        this.Cod_Supervisor     = ''
        this.Cod_Auditor        = ''
        this.Fecha_Auditoria    = ''
        this.Fecha_Auditoria2   = ''
        this.Cod_LinPro         = ''
        this.Observacion        = ''
        this.Flg_Status         = 'E'
        this.Cod_OrdPro         = ''
        this.Cod_EstCli         = ''
        this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaCabeceraService(
          this.Cod_Accion,
          this.Num_Auditoria,
          this.Cod_Supervisor,
          this.Cod_Auditor,
          this.Fecha_Auditoria,
          this.Fecha_Auditoria2,  
          this.Cod_LinPro,
          this.Observacion,
          this.Flg_Status,
          this.Cod_OrdPro,
          this.Cod_EstCli
        ).subscribe(
          (result: any) => {
           if(result[0].Respuesta == 'OK'){
            let element: HTMLElement = document.getElementsByClassName('button-close')[0] as HTMLElement;
            element.click();
            this.matSnackBar.open('La auditoria se proceso correctamente..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
           }else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }) 
           }
            
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

        }

      })
  }

  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    let fecha = new Date()
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;

        if(crud.length > 0){
          this.ll_Supervisor = crud[0].Flg_Verificar == 1 ? true : false;
        } else {
          this.formulario.patchValue({
            CodAuditor: GlobalVariable.vtiptra.trim().concat("-").concat(GlobalVariable.vcodtra.trim())
          });
        }
      });
  }

}

 