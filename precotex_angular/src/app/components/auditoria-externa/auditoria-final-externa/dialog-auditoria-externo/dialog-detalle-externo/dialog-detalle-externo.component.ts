import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _moment from 'moment';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service'; 

import { jsPDF } from 'jspdf'; 
import html2canvas from 'html2canvas';

import { DialogConfirmacionComponent } from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component'
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { GlobalVariable } from 'src/app/VarGlobals';
import { DialogRegistrarDetalleExtComponent } from '../dialog-registrar-detalle-ext/dialog-registrar-detalle-ext.component';
import { DialogSubDetalleExternoComponent } from '../dialog-sub-detalle-externo/dialog-sub-detalle-externo.component';
import { DialogDetalleExternoMostrarImagenesComponent } from '../dialog-detalle-externo-mostrar-imagenes/dialog-detalle-externo-mostrar-imagenes.component';
import { DialogCrearImagenesAuditoriaFinalComponent } from '../dialog-crear-imagenes-auditoria-final/dialog-crear-imagenes-auditoria-final.component';
import { VistaPreviaAuditoriaExternaComponent } from '../vista-previa-auditoria-externa/vista-previa-auditoria-externa.component';
import { DialogRegistrarDespachoComponent } from '../dialog-registrar-despacho/dialog-registrar-despacho.component';
import { DialogFirmaDigitalComponent } from '../../../registro-firmas-auditoria/dialog-firma-digital/dialog-firma-digital.component';
import { ExceljsAudFinalService } from 'src/app/services/exceljs-aud-final.service'

interface data{
  Cod_LinPro:    string
  Num_Auditoria: number,
  Flg_Status: string,
  Num_Guia: string,
  Num_Bultos : string,
  Num_Precintos: string,
  Status: string,
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
  Cod_LinPro:               string,
  Flg_Precintos:            string,
  Num_Guia:			            string,
  Num_Bultos:				        string,
  Num_Precintos:			      string,
  Fecha_Auditoria:          string,
  Descripcion:			        string,
  Des_Servicio:			        string,
  Firma_1:                  string,
  Firma_2:                  string,
  Firma64_1:                string,
  Firma64_2:                string,
}

interface data_det_reporte {
  NRow?: string;
  Cod_Motivo?: string;
  Des_Defecto?: string;
  Espacio?: string;
  Can_Defecto?: number;
}

@Component({
  selector: 'app-dialog-detalle-externo',
  templateUrl: './dialog-detalle-externo.component.html',
  styleUrls: ['./dialog-detalle-externo.component.scss']
})
export class DialogDetalleExternoComponent implements OnInit {
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
    Num_Guia:				   '',
		Num_Bultos:				   '',
		Num_Precintos:			   ''
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
  Rol                     = ''
  mostrar                 = false;
  deshabilitar            = false;  
  ll_Supervisor: boolean = false;

  lc_firma1: string = ""
  lc_firma2: string = ""

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    supervisor:   [''],
    fec_registro: [''],
    auditor:      ['']
  });

  verPdf: boolean = false;
  dataForExcel = [];
  dataReporteAuditoria: data_det[] = [];

  displayedColumns_cab: string[] = ['Foto', 'Num_Auditoria_Detalle','Nom_Inspector', 'Cod_OrdPro', 'Nom_Cliente', 'Cod_EstCli', 'Cod_Present', 'Num_Guia', 'Can_Lote', 'Can_Muestra', 'Can_Defecto', 'Flg_Status', 'Firma_1', 'Firma_2', 'Acciones']
  displayedColumns_inf: string[] = ['NRow', 'Cod_Motivo','Des_Defecto', 'Can_Defecto']
  dataSource: MatTableDataSource<data_det>;
  dataSourceInf: MatTableDataSource<data_det>;
  isDisabled = true;

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private exceljsAudFinalService: ExceljsAudFinalService,
    @Inject(MAT_DIALOG_DATA) public data: data) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    //this.CargarOperacionConductor()
    this.MostrarDetalleAuditoria(); 
    this.Rol = GlobalVariable.vusu;

    // Reemplaza validación los permisos a usuarios.  2024Nov11, Ahmed
    // 103 - Auditoria Final Servicios
    this.validarCRUDUsuario(103);
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
          //console.log('dataPrecinto: ',result);
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





  ModificarRegistroDetalle(Num_Auditoria_Detalle: number, Cod_Inspector: string, Nom_Auditor: string, Cod_OrdPro: string, Cod_Cliente: string, Des_Cliente: string, Cod_EstCli: string, Des_EstPro: string,Cod_Present: string, Des_Present: string, Can_Lote: number, Can_Muestra: number, Observacion: string, Flg_Status: string, Flg_Reproceso_Num: number) {

    let dialogRef = this.dialog.open(DialogRegistrarDetalleExtComponent, {
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
              Flg_Status: Flg_Status,
              Flg_Reproceso_Num: Flg_Reproceso_Num}
    });

    dialogRef.afterClosed().subscribe(result => {

   
        this.MostrarDetalleAuditoria()
  
 
    })
  } 

  openDialogSubDetalle(Num_Auditoria_Detalle: number, Flg_Status: string){
    //if(Flg_Status != 'R' || GlobalVariable.vusu.toUpperCase() == 'RHUAYANA' || GlobalVariable.vusu.toUpperCase() == 'SISTEMAS' || GlobalVariable.vusu.toUpperCase() == 'IVARGAS'){
    if(Flg_Status != 'R' || this.ll_Supervisor){
    let dialogRef = this.dialog.open(DialogSubDetalleExternoComponent, {
      disableClose: true,
      data: {Num_Auditoria: this.data.Num_Auditoria, Num_Auditoria_Detalle: Num_Auditoria_Detalle, Flg_Status: Flg_Status }
    });

    dialogRef.afterClosed().subscribe(result => {

   
        this.MostrarDetalleAuditoria()
    
 
    }) 
  }else{
    this.matSnackBar.open('No puede agregar sub detalle a un reproceso..', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
  }
  }

  openDialogRegistrarDetalle(){
    let dialogRef = this.dialog.open(DialogRegistrarDetalleExtComponent, {
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

  agregarNuevo(data, Flg_Status) {
    data.Status = Flg_Status;
    let dialogRef = this.dialog.open(DialogCrearImagenesAuditoriaFinalComponent, {
      disableClose: false,
      data: {
        tipo: 1,
        data
      }
  
    });
  }

  editarOpcion(data) {
    
    let dialogRef = this.dialog.open(DialogDetalleExternoMostrarImagenesComponent, {
      disableClose: false,
      data: {
        tipo: 2,
        data
      }
  
    });

    dialogRef.afterClosed().subscribe(result => {
    })

  }

  vistaPreviaAuditoria(data_det: data_det) {
    data_det.Cod_LinPro = this.data.Cod_LinPro;
    let dialogRef = this.dialog.open(VistaPreviaAuditoriaExternaComponent, {
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '95vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {

    })
  }

  DespacharProduccion(Num_Auditoria_Detalle: number, Cod_Inspector: string, Nom_Auditor: string, Cod_OrdPro: string, Cod_Cliente: string, Des_Cliente: string, Cod_EstCli: string, Des_EstPro: string,Cod_Present: string, Des_Present: string, Can_Lote: number, Can_Muestra: number, Observacion: string, Cod_LinPro: string) {

    let dialogRef = this.dialog.open(DialogRegistrarDespachoComponent, {
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
              Cod_LinPro: Cod_LinPro}
    });

    dialogRef.afterClosed().subscribe(result => {

   
        this.MostrarDetalleAuditoria()
  
 
    })
  } 
  
  /*
  FORMARTO DE INFOME EXCEL
  03Oct2024, Ahmed
  */

  generaDataInforme(data_det: data_det){

    this.SpinnerService.show();
    this.Cod_Accion             = 'X';
    this.Num_Auditoria_Detalle  = data_det.Num_Auditoria_Detalle;
    this.Num_Auditoria          = 0  
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

          this.dataReporteAuditoria = result;
          console.log(this.dataReporteAuditoria)
          // Generar Excel
          //**this.generateExcel();

          // Generar PDF
          //this.lc_firma1 = 'assets/Firma1.jpg';
          //this.lc_firma2 = 'assets/Firma2.jpeg';
          this.lc_firma1 = this.dataReporteAuditoria[0].Firma64_1;
          this.lc_firma2 = this.dataReporteAuditoria[0].Firma64_2;

          //console.log("firmas")
          //console.log(this.lc_firma1)
          //console.log(this.lc_firma2)

          this.verPdf = true;
          this.dataSourceInf = result;
          setTimeout(() => {
            this.generarPDF('contentToConvert');
          }, 100);
          
          //this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataReporteAuditoria = [];
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  /*
    REGISTRA FIRMA DIGITAL
    <!-- 26nov2024 Ahmed -->
  */
  onFirmaDigital(data_det: data_det, nFirma: string){
    
    let dialogRef = this.dialog.open(DialogFirmaDigitalComponent, {
      disableClose: true,
      data: {Nombre: nFirma == 'F1' ? data_det.Nom_Auditor : data_det.Des_Servicio, Width: 400, Height: 400}
    });

    dialogRef.afterClosed().subscribe(result => {
      const formData = new FormData();
      formData.append('Accion', nFirma);
      formData.append('Num_Auditoria_Detalle', data_det.Num_Auditoria_Detalle.toString());
      formData.append('Num_Auditoria', data_det.Num_Auditoria.toString());
      formData.append('Cod_OrdPro', data_det.Cod_OrdPro);
      formData.append('Imagen64', result);
      //console.log(formData)      
      
      this.auditoriaInspeccionCosturaService.RegistrarFirmaAuditoria(formData)
        .subscribe((res) => {
          console.log(res)
          if(res[0].Numero_Auditoria_Detalle != 0){
            if(nFirma == "F1")
              data_det.Firma_1 = res[0].Firma_Digital
            else 
              data_det.Firma_2 = res[0].Firma_Digital
          }
        });
      
    });
  }

  /*
  GENERA FORMATO EN EXCEL
  <!-- 03oct2024 Ahmed -->
  */

  generateExcel() {

    this.dataForExcel = [];
    if (this.dataReporteAuditoria.length == 0) {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {
      let dataReporte: data_det_reporte[] = [];
      let totalCantDefecto=0;

      this.dataReporteAuditoria.forEach((row: any) => {
        let data: data_det_reporte = {};

        data.NRow = row.NRow;
        data.Cod_Motivo = row.Cod_Motivo;
        data.Des_Defecto = row.Des_Defecto;
        data.Espacio = "";
        data.Can_Defecto = row.Can_Defecto;

        totalCantDefecto += parseInt(row.Can_Defecto);

        dataReporte.push(data);
      })

      let rowTotales: data_det_reporte  = {
        NRow: "",
        Cod_Motivo: "TOTALES",
        Des_Defecto: "",
        Espacio: "",
        Can_Defecto: totalCantDefecto,
      }

      dataReporte.push(rowTotales);

      //console.log(dataReporte)

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })
      let reportData = {
        title: 'FORMATO AUDITORIA FINAL',
        data: this.dataForExcel,
        //headers: Object.keys(dataReporte[0]),
        headers: Object.keys({"N°":"N°", "CODIGO":"CODIGO", "DESCRIPCION":"DESCRIPCION", "" :"", "CANTIDAD":"CANTIDAD"}),

        lc_Fecha: this.dataReporteAuditoria[0].Fecha_Auditoria,
        lc_Cliente: this.dataReporteAuditoria[0].Des_Cliente,
        lc_Estilo: this.dataReporteAuditoria[0].Cod_EstCli,
        lc_OP: this.dataReporteAuditoria[0].Cod_OrdPro,
        lc_Color: this.dataReporteAuditoria[0].Des_Present,
        ln_Cantidad: this.dataReporteAuditoria[0].Can_Muestra,
        lc_Estado: this.dataReporteAuditoria[0].Descripcion,
        lc_Observacion: this.dataReporteAuditoria[0].Observacion
      }

      this.exceljsAudFinalService.exportExcel(reportData);

    }

  }

  getTotalCantidad() {
    return this.dataReporteAuditoria.map(t => t.Can_Defecto).reduce((acc, value) => acc + value, 0);
  }

  /*
  GENERA FORMATO PDF
  <!-- 04oct2024 Ahmed -->
  */

  async generarPDF0(seccion: string){
    const cadPDF = new Promise(resolve => {
      let docHtml: any;
      let lc_pdf: any;

      //document.getElementById(seccion).innerHTML.replace('img1', this.dataReporteAuditoria[0].Path_Firma_Web_1)

      docHtml = document.getElementById(seccion);
      const doc = new jsPDF('p', 'pt', 'a4', true);

      doc.html(docHtml, {
        margin: [10, 60, 40, 60],
        callback: function(pdf){
          pdf.save('FORMATO AUDITORIA FINAL.pdf')
        }
      });
    });
  }

  generarPDF(seccion: string){
    
    //setTimeout(() => {
      //document.getElementById('img2').setAttribute('src', this.dataReporteAuditoria[0].Path_Firma_Web_1);
      //document.getElementById('img2').innerHTML.replace('img1', this.dataReporteAuditoria[0].Path_Firma_Web_1)
    //}, 100);

    
    setTimeout(() => {
      var data = document.getElementById(seccion);  

      html2canvas(data).then(canvas => {
        var imgWidth = 300; //200;
        var pageHeight = 300; //590; //295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        
        //canvas.innerHTML.replace('img1', this.dataReporteAuditoria[0].Path_Firma_Web_1)
        var contentDataURL = canvas.toDataURL('image/png',1.0)

        let pdf = new jsPDF({
          //orientation: 'L',
          unit: 'mm',
          format: 'a4',
        });
        var position = 15;
        var position1 = -282 //-297;

        var totalPages = Math.ceil(imgHeight / pageHeight - 1)
        
        //console.log(totalPages)
        //console.log(imgHeight);
        
        pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight)
        for (var i = 1; i <= totalPages; i++) { 
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 5, position1, imgWidth, imgHeight);
        }
        
        pdf.save('FORMATO AUDITORIA FINAL.pdf'); // Generated PDF

        this.verPdf = false;
        this.SpinnerService.hide();
      });
    }, 100);
  }

  /*
  Validar y establecer accesos CRUD del Usuario
  2024Nov11, Ahmed
  */
  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;

        if(crud.length > 0){
          //console.log(crud)
          this.mostrar = crud[0].Flg_Insertar == 1 ? true : false;
          this.ll_Supervisor = crud[0].Flg_Verificar == 1 ? true : false;
        } 
      });

  }


}

 