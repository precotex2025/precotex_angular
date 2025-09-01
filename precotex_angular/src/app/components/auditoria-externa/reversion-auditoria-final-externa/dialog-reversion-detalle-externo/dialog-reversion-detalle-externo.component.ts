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

import { DialogConfirmacionComponent } from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component'
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { GlobalVariable } from 'src/app/VarGlobals';
//import { DialogRegistrarDetalleExtComponent } from '../dialog-registrar-detalle-ext/dialog-registrar-detalle-ext.component';
//import { DialogRegistrarSubdetalleExtComponent } from '../dialog-registrar-subdetalle-ext/dialog-registrar-subdetalle-ext.component';
//import { DialogSubDetalleExternoComponent } from '../dialog-sub-detalle-externo/dialog-sub-detalle-externo.component';
//import { DialogDetalleExternoCrearImagenesComponent } from '../dialog-detalle-externo-crear-imagenes/dialog-detalle-externo-crear-imagenes.component';
//import { DialogDetalleExternoMostrarImagenesComponent } from '../dialog-detalle-externo-mostrar-imagenes/dialog-detalle-externo-mostrar-imagenes.component';
//import { DialogCrearImagenesAuditoriaFinalComponent } from '../dialog-crear-imagenes-auditoria-final/dialog-crear-imagenes-auditoria-final.component';
//import { VistaPreviaAuditoriaExternaComponent } from '../vista-previa-auditoria-externa/vista-previa-auditoria-externa.component';
//import { DialogRegistrarDespachoComponent } from '../dialog-registrar-despacho/dialog-registrar-despacho.component';
import { DialogActualizaReversionComponent } from './dialog-actualiza-reversion/dialog-actualiza-reversion.component';

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
  Num_Paquete:              string, 
  Cod_LinPro:             string,
  Existe_Fecha_Rev: string
}

@Component({
  selector: 'app-dialog-reversion-detalle-externo',
  templateUrl: './dialog-reversion-detalle-externo.component.html',
  styleUrls: ['./dialog-reversion-detalle-externo.component.scss']
})
export class DialogReversionDetalleExternoComponent implements OnInit {



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
    Num_Paquete:              '',
    Cod_LinPro:              '',
    Existe_Fecha_Rev:        ''
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


  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    supervisor:   [''],
    fec_registro: [''],
    auditor:      ['']
  })


  displayedColumns_cab: string[] = ['Num_Auditoria_Detalle','Nom_Inspector', 'Cod_OrdPro', 'Nom_Cliente', 'Cod_EstCli', 'Cod_Present', 'Can_Lote', 'Can_Muestra', 'Flg_Status', 'Acciones']
  dataSource: MatTableDataSource<data_det>;
  isDisabled = true;


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    //this.CargarOperacionConductor()
    this.MostrarDetalleAuditoria();
   
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
    this.Co_CodOrdPro            = ''
    this.Num_Paquete             = ''

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


  ModificarReversionDetalle(Num_Auditoria_Detalle: number, Cod_Inspector: string, Nom_Auditor: string, Cod_OrdPro: string, Cod_Cliente: string, Des_Cliente: string, Cod_EstCli: string, Des_EstPro: string,Cod_Present: string, Des_Present: string, Can_Lote: number, Can_Muestra: number, Observacion: string, Flg_Status: string) {
 
    let dialogRef = this.dialog.open(DialogActualizaReversionComponent, {
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
              Flg_Status: Flg_Status}
    });

    dialogRef.afterClosed().subscribe(result => {

   
        this.MostrarDetalleAuditoria()
  
 
    })

     
  }  
  

}

 