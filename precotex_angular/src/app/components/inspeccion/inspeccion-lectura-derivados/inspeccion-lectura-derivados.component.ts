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
  selector: 'app-inspeccion-lectura-derivados',
  templateUrl: './inspeccion-lectura-derivados.component.html',
  styleUrls: ['./inspeccion-lectura-derivados.component.scss']
})
export class InspeccionLecturaDerivadosComponent implements OnInit {

  listar_operacionColor: Color[] = [];

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
    if (this.Ticket != "" && this.Ticket.length == 11) {
      this.Flg_Habilitar_btn_Finalizar = false;

    } else {
      this.Flg_Habilitar_btn_Finalizar = true;
    }
  }

  TicketFocus() {
    this.inputTicket.nativeElement.focus()
  }

  FinalizarProceso() {
    this.inspeccionPrendaService.CF_FINALIZAR_TICKET_DERIVADO(
      this.Ticket
    ).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK') {
          this.Ticket = '';
          this.formulario.patchValue({
            Ticket: ''
          });
          this.Flg_Habilitar_btn_Finalizar = true

          this.matSnackBar.open('Se finalizo el Ticket correctamente...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
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

              })

          })
      }
    })

  }

}

