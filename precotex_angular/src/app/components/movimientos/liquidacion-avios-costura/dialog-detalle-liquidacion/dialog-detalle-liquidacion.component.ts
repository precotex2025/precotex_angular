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
import { DialogRegistrarDetalleLiquidacionComponent } from '../dialog-registrar-detalle-liquidacion/dialog-registrar-detalle-liquidacion.component'
import { MovimientoLiquidacionAviosService } from 'src/app/services/movimiento-liquidacion-avios.service';
import { DialogCabeceraLiquidacionComponent } from '../dialog-cabecera-liquidacion/dialog-cabecera-liquidacion.component';

interface data{
  Cod_LinPro:    string,
  Num_Auditoria: number,
  Liquidacion: string,
  Item: string,
  Flg_Status: string,
  IdLiquidacion: string
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
  selector: 'app-dialog-detalle-liquidacion',
  templateUrl: './dialog-detalle-liquidacion.component.html',
  styleUrls: ['./dialog-detalle-liquidacion.component.scss']
})
export class DialogDetalleLiquidacionComponent implements OnInit {



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

  Liquidacion           = this.data.Liquidacion;
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
  IdLiquidacion           = ''

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    supervisor:   [''],
    fec_registro: [''],
    auditor:      ['']
  })


  displayedColumns_cab: string[] = [
    'Item',
    'Estado', 
    'OP/Estilo', 
    'Articulo', 
    'Grosor', 
    'Talla', 
    'CodColor', 
    'Color', 
    'Lote', 
    'Marca', 
    'Cantidad', 
    'Descripcion',
    'Acciones' ]
  dataSource: MatTableDataSource<data_det>;



  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data,
    private movimientoLiquidacionAviosService: MovimientoLiquidacionAviosService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    //this.CargarOperacionConductor()

    this.Flg_Status = this.data.Flg_Status; 
    this.MostrarDetalleLiquidacion()
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


  MostrarDetalleLiquidacion() {

    this.SpinnerService.show();

    const formData = new FormData();
    formData.append('Opcion', 'V');
    formData.append('IdLiquidacion', this.data.IdLiquidacion);
    formData.append('Estado', '');
    formData.append('Item', '');
    formData.append('OP', '');
    formData.append('Articulo', '');
    formData.append('Grosor', '');
    formData.append('Talla', '');
    formData.append('CodigoColorPro', '');
    formData.append('Color', '');
    formData.append('Lote', '');
    formData.append('Marca', '');
    formData.append('CantidadConos', '');
    formData.append('Descripcion', '');
    this.movimientoLiquidacionAviosService.BuscarDetalleAvios(formData
    ).subscribe(
      (result: any) => {
    
        if (result.data.length > 0) {
  
          this.dataSource.data = result.data
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


  EliminarAvioDetalle(Item: string) {
 
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
 
        const formData = new FormData();
        formData.append('Opcion', 'B');
        formData.append('IdLiquidacion', this.data.IdLiquidacion);
        formData.append('Estado', '');
        formData.append('Item', Item);
        formData.append('OP', '');
        formData.append('Articulo', '');
        formData.append('Grosor', '');
        formData.append('Talla', '');
        formData.append('CodigoColorPro', '');
        formData.append('Color', '');
        formData.append('Lote', '');
        formData.append('Marca', '');
        formData.append('CantidadConos', '');
        formData.append('Descripcion', '');

        this.movimientoLiquidacionAviosService.EliminarDetalleAvios(
          formData
        ).subscribe(
          (result: any) => { 
            if(result.msg == 'OK'){
            this.MostrarDetalleLiquidacion()
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





  ModificarAvioDetalle(Item, OP,Articulo,Grosor,Talla,CodColor,Color,Lote,Marca,Cantidad,Descripcion, Estado) { 

    let dialogRef = this.dialog.open(DialogRegistrarDetalleLiquidacionComponent, {
      disableClose: true,
      data: { Item: Item, 
              IdLiquidacion: this.data.IdLiquidacion,
              OP: OP,
              Articulo: Articulo,
              Grosor: Grosor,
              Talla: Talla,
              CodColor: CodColor,
              Color: Color,
              Lote: Lote,
              Marca: Marca,
              Cantidad: Cantidad,
              Descripcion: Descripcion,
              Estado: Estado
             }
    });

    dialogRef.afterClosed().subscribe(result => {

   
        this.MostrarDetalleLiquidacion()
  
 
    })
 
  } 

  
  openDialogRegistrarDetalle(){
 
    let dialogRef = this.dialog.open(DialogRegistrarDetalleLiquidacionComponent, {
      disableClose: true,
      data: {Liquidacion: this.data.Liquidacion, IdLiquidacion: this.data.IdLiquidacion}
    });

    dialogRef.afterClosed().subscribe(result => {

   
        this.MostrarDetalleLiquidacion()
  
 
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
            this.MostrarDetalleLiquidacion()
            this.matSnackBar.open('Se creo Reproceso de auditoria correctamente..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

        }

      })
  }


  ProcesarFicha(){
/*

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

      */
  }

  agregarNuevo(data) {
    /*
     
    let dialogRef = this.dialog.open(DialogDetalleExternoCrearImagenesComponent, {
      disableClose: false,
      data: {
        tipo: 1,
        data
      }
  
    });
    */
  }

  editarOpcion(data) {
    /*
    
    let dialogRef = this.dialog.open(DialogDetalleExternoMostrarImagenesComponent, {
      disableClose: false,
      data: {
        tipo: 2,
        data
      }
  
    });

    dialogRef.afterClosed().subscribe(result => {
    })
    */

  }


}

 