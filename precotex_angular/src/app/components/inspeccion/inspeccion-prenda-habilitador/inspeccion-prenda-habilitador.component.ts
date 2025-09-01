import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MovimientoInspeccionService } from 'src/app/services/movimiento-inspeccion.service';
import { InspeccionPrendaService } from 'src/app/services/inspeccion-prenda.service'
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelect } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';

import { NgxSpinnerService } from "ngx-spinner";
import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { DialogHabilitadorComponent } from './dialog-inspeccion-prenda-habilitador/dialog-habilitador/dialog-habilitador.component';
interface Color {
  Codigo: string;
  Descripcion: string;
}

interface Modulo {
  Cod_Modulo: number;
  Des_Modulo: string;
}

interface Tipo_Proceso {
  Cod_Familia: string;
  Des_Familia: string;
  Cod_Almcen: number;
  Cod_TipMov: string;
}


interface data_det {
  ID_R: number
  SEC: number
  ID: number
  COD_FAMILIA: string
  COD_FABRICA: string
  COD_ORDPRO: string
  COD_PRESENT: number
  DES_PRESENT: string
  COD_TALLA: string
  CANTIDAD: number
}


@Component({
  selector: 'app-inspeccion-prenda-habilitador',
  templateUrl: './inspeccion-prenda-habilitador.component.html',
  styleUrls: ['./inspeccion-prenda-habilitador.component.scss']
})
export class InspeccionPrendaHabilitadorComponent implements OnInit {

  listar_operacionColor: Color[] = [];
  displayedColumns_cab: string[] = ['Sec', 'Cod_OrdPro', 'Des_Present', 'Cod_Talla', 'Cantidad', 'Acciones']
  dataSource: MatTableDataSource<data_det>;

  Op = ''
  Cod_Accion = ''
  ColorConcat = ''
  Flg_Btn_Buscar = false
  Cod_Modulo = ""
  Ticket = ""
  Tipo_Proceso = ""


  Cod_Ordpro = ""
  Des_Present = ""
  Prendas_Recoger = 0
  Cod_Talla = ""
  ImagePath = ""
  Id = 0
  Id_R = 0

  Sec = 0

  Flg_Habilitar_btn_Finalizar = true

  formulario = this.formBuilder.group({
    Modulo: [''],
    Tipo_Proceso: [''],
    Ticket: [''],
    color: ['']
  })

  listar_operacionModulo: Modulo[] = [];
  listar_operacionTipo_Proceso: Tipo_Proceso[] = [];
  @ViewChild('Ticket') inputTicket!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, private SpinnerService: NgxSpinnerService,
    private movimientoInspeccionService: MovimientoInspeccionService,
    public dialog: MatDialog,
    private inspeccionPrendaService: InspeccionPrendaService

  ) {

    this.dataSource = new MatTableDataSource();

    this.formulario = formBuilder.group({
      Ticket: ['', Validators.required],
      Tipo_Proceso: ['', Validators.required],
      Modulo: ['']
    });
  }


  ngOnInit(): void {
    this.MuestraModulo()
    this.MuestraTipoProceso()
    //    this.TicketFocus()
    //this.inputTicket.nativeElement.focus()
  }



  ngAfterViewInit() {
    //this.inputTicket.nativeElement.focus()
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



  MuestraModulo() {
    this.inspeccionPrendaService.CF_MUESTRA_MODULO(
    ).subscribe(
      (result: any) => {
        this.listar_operacionModulo = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))

  }

  MuestraTipoProceso() {
    this.inspeccionPrendaService.CF_MUESTRA_INSPECCION_FAMILIA(
    ).subscribe(
      (result: any) => {
        this.listar_operacionTipo_Proceso = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))

  }

  // obtenerCodigoBarra() {
  //   this.Ticket = this.formulario.get('Ticket')?.value;
  //   console.log(this.Ticket.length);
  //   if (this.Ticket.length == 11) {
  //     this.ValidarTicket();
  //   }
  // }

  ValidarTicket() {
    this.Ticket = this.formulario.get('Ticket')?.value
    this.Cod_Modulo = this.formulario.get('Modulo')?.value
    this.Tipo_Proceso = this.formulario.get('Tipo_Proceso')?.value
    if (this.Ticket != "") {

      this.Cod_Modulo = this.Cod_Modulo
      this.Tipo_Proceso = this.Tipo_Proceso
      this.Ticket = this.Ticket
      this.Id_R = this.Id_R

      this.inspeccionPrendaService.CF_MUESTRA_INSPECCION_RECOJO_PRENDA(
        this.Cod_Modulo,
        this.Tipo_Proceso,
        this.Ticket,
        this.Id_R
      ).subscribe(
        (result: any) => {

          if (result[0].Respuesta == undefined) {

            this.formulario.controls['Tipo_Proceso'].disable()
            this.formulario.controls['Modulo'].disable()
            this.Flg_Habilitar_btn_Finalizar = false

            this.Cod_Ordpro = result[0].COD_ORDPRO
            this.Des_Present = result[0].DES_PRESENT
            this.Prendas_Recoger = result[0].PRENDAS_RECOGER
            this.Cod_Talla = result[0].COD_TALLA
            this.ImagePath = result[0].ICONO_WEB
            this.Id = result[0].ID
            this.Id_R = result[0].ID_R
            console.log('ID RETORNADOS')
            console.log(this.Id)
            console.log(this.Id_R)
            let dialogRef = this.dialog.open(DialogHabilitadorComponent,
              {
                disableClose: true,
                panelClass: 'my-class',
                data: {
                  Ticket: this.Ticket,
                  Cod_Ordpro: this.Cod_Ordpro,
                  Des_Present: this.Des_Present,
                  Prendas_Recoger: this.Prendas_Recoger,
                  Cod_Talla: this.Cod_Talla,
                  ImagePath: this.ImagePath
                }
              });
            this.formulario.controls['Ticket'].setValue('')
            this.TicketFocus()
            dialogRef.afterClosed().subscribe(result => {
              console.log(result);


              if (result == true) {

                //this.formulario.controls['Ticket'].setValue('')
                this.TicketFocus()

                this.Cod_Accion = "I"
                this.Id_R = this.Id_R
                this.Sec = 0
                this.Id = this.Id
                this.Tipo_Proceso = this.Tipo_Proceso
                this.Prendas_Recoger = this.Prendas_Recoger
                this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Detalle_Recojo_Web(
                  this.Cod_Accion,
                  this.Id_R,
                  this.Sec,
                  this.Id,
                  this.Tipo_Proceso,
                  this.Prendas_Recoger
                ).subscribe(
                  (result: any) => {

                    if (result[0].Respuesta == 'OK') {

                      this.formulario.controls['Ticket'].setValue('')
                      this.matSnackBar.open('Proceso Correcto...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
                    }
                    else {
                      this.formulario.controls['Ticket'].setValue('')
                      this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
                    }

                    this.formulario.controls['Ticket'].setValue('')
                    this.TicketFocus()

                    this.Id_R = this.Id_R
                    this.inspeccionPrendaService.CF_MUESTRA_INSPECCION_RESUMEN_RECOJO(
                      this.Id_R
                    ).subscribe(
                      (result: any) => {
                        this.dataSource.data = result
                      })

                  })
              }

            })
          }
          else {
            this.formulario.controls['Ticket'].setValue('')
            this.TicketFocus()
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
          }

        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 5000,
        }))

    }
  }

  TicketFocus() {
    this.inputTicket.nativeElement.focus()
  }

  FinalizarProceso() {
    this.Id_R
    this.inspeccionPrendaService.CF_Man_Inspeccion_Recojo_Finalizado_Web(
      this.Id_R
    ).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK') {
          this.Id_R = 0
          this.formulario.controls['Ticket'].enable()
          this.formulario.controls['Tipo_Proceso'].enable()
          this.formulario.controls['Modulo'].enable()
          this.Flg_Habilitar_btn_Finalizar = true
          this.dataSource.data = []
          this.matSnackBar.open('Proceso Correcto...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))

  }

  EliminarRegistro(ID_R: number, SEC: number) {

    let dialogRef = this.dialog.open(DialogEliminarComponent,
      {
        disableClose: false,
        data: {}
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.Cod_Accion = "D"
        this.Id_R = ID_R
        this.Sec = SEC
        this.Id = this.Id
        this.Tipo_Proceso = this.Tipo_Proceso
        this.Prendas_Recoger = this.Prendas_Recoger
        this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Detalle_Recojo_Web(
          this.Cod_Accion,
          this.Id_R,
          this.Sec,
          this.Id,
          this.Tipo_Proceso,
          this.Prendas_Recoger
        ).subscribe(
          (result: any) => {

            if (result[0].Respuesta == 'OK') {

              this.matSnackBar.open('Proceso Correcto...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
            }

            this.Id_R = this.Id_R
            this.inspeccionPrendaService.CF_MUESTRA_INSPECCION_RESUMEN_RECOJO(
              this.Id_R
            ).subscribe(
              (result: any) => {
                this.dataSource.data = result
              })

          })
      }
    })

  }

}
