import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ReposicionesService } from 'src/app/services/reposiciones/reposiciones.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogDetalleReposicionComponent } from '../historial-reposicion/dialog-detalle-reposicion/dialog-detalle-reposicion.component';
import { DialogAprobacionReposicionComponent } from '../aprobacion-reposicion/dialog-aprobacion-reposicion/dialog-aprobacion-reposicion.component';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { NgxSpinnerService } from 'ngx-spinner';


interface data_det {
  Num_Solicitud: string,
  Fecha_Solicitud: string,
  Tipo: string,
  Sede: string,
  Num_Linea: string,
  Aprobacion_Costura: string,
  Status_Reposicion: string,
  Piezas_Falladas: string,
  Piezas_Malogradas: string,
  Piezas_Faltantes: string,
}


@Component({
  selector: 'app-aprobacion-calidad-corte',
  templateUrl: './aprobacion-calidad-corte.component.html',
  styleUrls: ['./aprobacion-calidad-corte.component.scss']
})
export class AprobacionCalidadCorteComponent implements OnInit {

  Fecha_Auditoria = ""
  Fecha_Auditoria2 = ""

  range = new FormGroup({
    start: new FormControl(new Date),
    end: new FormControl(new Date),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({

  });

  displayedColumns: string[] = [
    'Num_Solicitud',
    'Fecha_Solicitud',
    'Tipo',
    'Sede',
    'Num_Linea',
    'Estado',
    'Aprob_Cal_Opcional',
    'Estado_Salida',
    'Status_Reposicion',
    'Tela_Opcional',
    'Piezas_Falladas',
    'Piezas_Malogradas',
    'Piezas_Faltantes',
    'acciones'
  ];

  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataReposiciones: Array<any> = [];
  Estado: any = '';

  dataForExcel: any = [];
  dataSourceExcel: any = [];
  constructor(private formBuilder: FormBuilder, private reposicionesService: ReposicionesService, private matSnackBar: MatSnackBar, public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService, private exceljsService: ExceljsService) { }

  ngOnInit(): void {
    this.obtenerReposiciones();

  }

  obtenerReposiciones() {
    this.dataReposiciones = [];
    this.dataSource.data = this.dataReposiciones;
    this.reposicionesService.getReposiciones('L', '', this.range.get('start').value, this.range.get('end').value, this.Estado, 'L').subscribe(
      (result: any) => {
        console.log(result);
        if (result != false) {
          this.dataReposiciones = result;
          this.dataSource.data = this.dataReposiciones;
        } else {
          this.dataReposiciones = [];
        }
      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      })
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }


  detalleReposicion(data) {
    let dialogRef = this.dialog.open(DialogDetalleReposicionComponent,
      {
        disableClose: true,
        minWidth: '85%',
        minHeight: '80%',
        maxHeight: '98%',
        height: '90%',
        panelClass: 'my-class',
        data: {
          datos: data
        }
      });
    dialogRef.afterClosed().subscribe(result => {

    })
  }

  changeCheck(event, Num_Solicitud){
    console.log(event);
    if(event.checked == true){
      this.reposicionesService.insertarFechasReposicion('O', Num_Solicitud).subscribe(
        (result: any) => {
          console.log(result);
          this.obtenerReposiciones();
          if (result[0].status == 1) {
            this.matSnackBar.open('Se registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 });
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 });
          }
        },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
        })
      
    }
  }

  exportarExcel() {
    this.SpinnerService.show();
    this.dataForExcel = [];
    this.dataSourceExcel = [];
    var Fec_Inicio = this.range.get('start')?.value
    var Fec_Fin = this.range.get('end')?.value

    this.reposicionesService.getReporteReposiciones(Fec_Inicio, Fec_Fin).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {

          result.forEach((item: any) => {
            let datos = {
              ['N° Solicitud']: item.Num_Solicitud,
              ['Linea']: item.Num_Linea,
              ['Supervisor']: item.Cod_usuario,
              ['Cliente']: item.Des_Cliente,
              ['Tipo Defecto']: item.Tipo,
              ['Obs. Defecto']: item.Obs_Defecto,
              ['Color']: item.Des_Present,
              ['Estilo']: item.Cod_Est,
              ['OC']: item.Co_CodOrdPro,
              ['Pieza']: item.Pieza,
              ['Talla']: item.Cod_Talla,
              ['Cantidad']: item.Cantidad,
              ['Tipo Tela']: item.Tipo_Tela,
              ['Fec. Ingreso Costura']: item.Fec_Alta,
              ['Observacion']: item.Observacion,
              ['Status Reposicion']: item.Status_Reposicion,
              ['Fecha Solicitud']: item.Fecha_Solicitud,
              ['Fecha Aprob. Control Interno']: item.Fec_Control_Interno,
              ['Fec. Aprobacion Calidad']: item.Fec_Aprob_Calidad,
              ['Observacion Calidad']: item.Observacion_Calidad,
              ['Fec. Aprobacion Jef. Costura']: item.Fec_Aprobacion_Costura,
              //['Aprobacion Costura']: item.Aprobacion_Costura,
              ['Observacion  Jef. Costura']: item.Observacion_Costura,
              //['Aprobacion Calidad']: item.Aprobacion_Calidad,
              ['Fecha Ingreso Transito Costura']: item.Fec_Transito_Costura,
              ['Fecha Salida Seguridad |Taller ']: item.Fecha_Salida,
              ['Fecha Ingreso Sta Rosa']: item.Fecha_Ingreso,
              ['Fecha Ingreso Transito Corte']: item.Fec_Transito_Corte,
              ['Status Aprob. Corte']: item.Aprobacion_Corte,
              ['Observacion Corte']: item.Observacion_Corte,
              ['Fecha Ingreso Despacho']: item.Fec_Ingreso_Despacho,
              ['Fecha Ingreso Almacen Tela']: item.Fec_Almacen_Tela,
              ['Fecha Aprobacion Ingreso Cald. Corte']: item.Fec_Aprob_Cal_Corte,
              ['Fecha Despacho Corte']: item.Despacho_Corte,
              ['Observaciones Despacho']: item.Observaciones_Despacho,
              ['Reposicion Completa']: item.Reposicion_Completa,
              ['Piezas Adicional 3']: item.Piezas_ML,
              ['Piezas Producción']: item.Piezas_Prod,
              ['Fecha Aprobacion Salida Cald. Corte']: item.Fec_Salida_Calidad,
              ['Fecha Salida Transito Corte']: item.Fec_Salida_TCorte,
              ['Fecha Despacho Santa Rosa']: item.Despacho_Sta_Rosa,
              ['Fecha Recepcion Despacho']: item.Recepcion_Despacho,
              ['Fecha Recepcion Transito Costura']: item.Fec_Recepcion_Transito_Cost,
              //['Fecha Recepcion Salida Transito Costura']: item.Fec_Recepcion_Salida_Transito,
              ['Fecha Recepcion Costura']: item.Fecha_Recepcion,
              ['Recepcion Conforme']: item.Recepcion_Conforme,
              ['Observaciones Recepcion']: item.Observacion_Reposicion
            };
            this.dataForExcel.push(datos);
          });

          if (this.dataForExcel.length > 0) {
            this.dataForExcel.forEach((row: any) => {
              this.dataSourceExcel.push(Object.values(row))
            })

            let reportData = {
              title: 'REPORTE REPOSICIONES',
              data: this.dataSourceExcel,
              headers: Object.keys(this.dataForExcel[0])
            }

            this.exceljsService.exportExcel(reportData);
          } else {
            this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
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

  changeAprobacion(event, Num_Solicitud, Accion) {
    console.log(event);
    console.log(Num_Solicitud);
    let dialogRef = this.dialog.open(DialogAprobacionReposicionComponent,
      {
        disableClose: true,
        panelClass: 'my-class',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != '') {
        this.reposicionesService.saveAprobReposiciones(Accion, Num_Solicitud, result['observaciones'], result.estado).subscribe(
          (res: any) => {
            console.log(res);
            this.obtenerReposiciones();
            if (res[0]['Respuesta'] == 'OK') {
              this.matSnackBar.open('Se actualizo la aprobación correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
              
            } else {
              this.matSnackBar.open('Ha ocurrido un error al actualizar la aprobación.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          })

      } else {
        this.obtenerReposiciones();
      }
    })
  }
}
