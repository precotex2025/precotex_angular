import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { InspeccionPrendaService } from 'src/app/services/inspeccion-prenda.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

import { DialogConfirmacionComponent } from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component'
import { DialogDefectoAudiComponent } from './dialog-reinspeccion-prenda/dialog-defecto-audi/dialog-defecto-audi.component';


interface Color {
  COD_PRESENT: number;
  DES_PRESENT: string;
}

interface Talla {
  COD_TALLA: string;
}
@Component({
  selector: 'app-reinspeccion-prenda',
  templateUrl: './reinspeccion-prenda.component.html',
  styleUrls: ['./reinspeccion-prenda.component.scss']
})
export class ReinspeccionPrendaComponent implements OnInit {
  Cod_Accion = ""
  Cod_OrdPro = ""
  Cod_Present = 0
  Cod_Talla = ""
  Prendas_Paq = 0
  SelectedValueColor = ""
  SelectedValueTalla = ""
  Compostura = 0
  Segunda = 0
  Zurcido = 0
  Desmanche = 0
  Estampado = 0
  Primeras = 0
  Total = 0
  Inicial = 0
  ImagePath = ''
  Codigo = ''
  Des_Tipo_Proceso = ''
  grid_border = ' border: 1px solid #337ab7;'
  background = 'background-color: #3f51b5; border: 1px solid #3f51b5;'
  btn_background = 'background-color: #3f51b5; color: #ffffff;'

  Tipo_Proceso = ""
  Cod_Fabrica = ""
  Num_Paquete = ""
  Flg_Habilitar_Detalle = false
  DisableSaveButton = true
  //variables para ejecutar SP CF_Man_Inspeccion_Prenda_Detalle_Audi_Web
  Id = 0
  Tipo_Sub_Proceso = ''
  Cod_Defecto = ""

  //variables para obtener valores del SP CF_MUESTRA_INSPECCION_EFICIENCIA
  Min_Trabajados = 0
  Min_Asistidos = 0
  Eficiencia = 0

  //http://192.168.1.36/Estilos/EP18168.jpg

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    OP: [''],
    Color: [''],
    Talla: [''],
    Codigo: [''],
    Cantidad: ['']
  })

  listar_operacionColor: Color[] = [];
  listar_operacionTalla: Talla[] = [];
  @ViewChild('Codigo') inputCodigo!: ElementRef;
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private inspeccionPrendaService: InspeccionPrendaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,) {

  }

  ngOnInit(): void {
    this.ImagePath = 'http://192.168.1.36/Estilos/default.jpg'
    this.CalcularEficiencia()
    //this.inputCodigo.nativeElement.focus()
  }

  ngAfterViewInit() {

    this.inputCodigo.nativeElement.focus()
  }

  RestarCompostura() {
    if (this.Compostura != 0) {
      let dialogRef = this.dialog.open(DialogDefectoAudiComponent,
        {
          disableClose: true,
          panelClass: 'my-class',
          data: {
            Cod_Familia: '01',
            Id: this.Id,
            Total: this.Compostura
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        this.Cod_Accion = "D"
        this.Id
        this.Tipo_Sub_Proceso = '01'
        this.Cod_Defecto = result.data;
        this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Detalle_Audi_Web(
          this.Cod_Accion,
          this.Id,
          this.Tipo_Sub_Proceso,
          this.Cod_Defecto
        ).subscribe(
          (result: any) => {
            console.log(result)
            if (result[0].Respuesta == 'OK') {
              //this.Compostura = this.Compostura - 1
              //this.ActualizarTotal()
              //this.ActualizarPrimeras()
              this.ActualizarCantidad()
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 5000,
          }))
      });
    }
  }

  SumarCompostura() {
    let dialogRef = this.dialog.open(DialogDefectoAudiComponent,
      {
        disableClose: true,
        panelClass: 'my-class',
        data: {
          Cod_Familia: '01',
          Id: this.Id,
          Total: this.Compostura
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.Cod_Accion = "I"
      this.Id
      this.Tipo_Sub_Proceso = '01'
      this.Cod_Defecto = result.data;
      this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Detalle_Audi_Web(
        this.Cod_Accion,
        this.Id,
        this.Tipo_Sub_Proceso,
        this.Cod_Defecto
      ).subscribe(
        (result: any) => {
          console.log(result)
          if (result[0].Respuesta == 'OK') {
            //this.Compostura = this.Compostura + 1
            //this.ActualizarTotal()
            //this.ActualizarPrimeras()
            this.ActualizarCantidad()
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 5000,
        }))
    });

  }

  RestarSegunda() {
    if (this.Segunda != 0) {
      let dialogRef = this.dialog.open(DialogDefectoAudiComponent,
        {
          disableClose: true,
          panelClass: 'my-class',
          data: {
            Cod_Familia: '02',
            Id: this.Id,
            Total: this.Segunda
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        this.Cod_Accion = "D"
        this.Id
        this.Tipo_Sub_Proceso = '02'
        this.Cod_Defecto = result.data;
        this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Detalle_Audi_Web(
          this.Cod_Accion,
          this.Id,
          this.Tipo_Sub_Proceso,
          this.Cod_Defecto
        ).subscribe(
          (result: any) => {
            console.log(result)
            if (result[0].Respuesta == 'OK') {
              //this.Segunda = this.Segunda - 1
              //this.ActualizarTotal()
              //this.ActualizarPrimeras()
              this.ActualizarCantidad()
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 5000,
          }))
      });

    }
  }

  SumarSegunda() {

    let dialogRef = this.dialog.open(DialogDefectoAudiComponent,
      {
        disableClose: true,
        panelClass: 'my-class',
        data: {
          Cod_Familia: '02',
          Id: this.Id,
          Total: this.Segunda
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result != 'false') {
        this.Cod_Accion = "I"
        this.Id
        this.Tipo_Sub_Proceso = '02'
        this.Cod_Defecto = result.data;
        this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Detalle_Audi_Web(
          this.Cod_Accion,
          this.Id,
          this.Tipo_Sub_Proceso,
          this.Cod_Defecto
        ).subscribe(
          (result: any) => {
            console.log(result)
            if (result[0].Respuesta == 'OK') {
              //this.Segunda = this.Segunda + 1
              //this.ActualizarTotal()
              //this.ActualizarPrimeras()
              this.ActualizarCantidad()
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 5000,
          }))
      }
    });

  }

  RestarZurcido() {
    if (this.Zurcido != 0) {
      this.ActualizarCantidad()
      let dialogRef = this.dialog.open(DialogDefectoAudiComponent,
        {
          disableClose: true,
          panelClass: 'my-class',
          data: {
            Cod_Familia: '03',
            Id: this.Id,
            Total: this.Zurcido
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result != 'false') {
          this.Cod_Accion = "D"
          this.Id
          this.Tipo_Sub_Proceso = '03'
          this.Cod_Defecto = result.data
          this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Detalle_Audi_Web(
            this.Cod_Accion,
            this.Id,
            this.Tipo_Sub_Proceso,
            this.Cod_Defecto
          ).subscribe(
            (result: any) => {
              console.log(result)
              if (result[0].Respuesta == 'OK') {
                this.ActualizarCantidad()
              }
              else {
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
              }
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 5000,
            }))
        }
      })
    } else {
      console.log(this.Zurcido);
    }
  }

  SumarZurcido() {
    if (this.Primeras != 0) {
      this.ActualizarCantidad()
      let dialogRef = this.dialog.open(DialogDefectoAudiComponent,
        {
          disableClose: true,
          panelClass: 'my-class',
          data: {
            Cod_Familia: '03',
            Id: this.Id,
            Total: this.Zurcido
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result != 'false') {
          this.Cod_Accion = "I"
          this.Id
          this.Tipo_Sub_Proceso = '03'
          this.Cod_Defecto = result.data
          this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Detalle_Audi_Web(
            this.Cod_Accion,
            this.Id,
            this.Tipo_Sub_Proceso,
            this.Cod_Defecto
          ).subscribe(
            (result: any) => {
              console.log(result)
              if (result[0].Respuesta == 'OK') {
                this.ActualizarCantidad()
              }
              else {
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
              }
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 5000,
            }))
        }
      })
    } else {
      console.log(this.Primeras);
    }
  }

  RestarDesmanche() {
    if (this.Desmanche != 0) {
      this.ActualizarCantidad()
      let dialogRef = this.dialog.open(DialogDefectoAudiComponent,
        {
          disableClose: true,
          panelClass: 'my-class',
          data: {
            Cod_Familia: '04',
            Id: this.Id,
            Total: this.Desmanche
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result != 'false') {
          this.Cod_Accion = "D"
          this.Id
          this.Tipo_Sub_Proceso = '04'
          this.Cod_Defecto = result.data
          this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Detalle_Audi_Web(
            this.Cod_Accion,
            this.Id,
            this.Tipo_Sub_Proceso,
            this.Cod_Defecto
          ).subscribe(
            (result: any) => {
              console.log(result)
              if (result[0].Respuesta == 'OK') {
                this.ActualizarCantidad()
              }
              else {
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
              }
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 5000,
            }))
        }
      })
    }
  }

  SumarDesmanche() {
    if (this.Primeras != 0) {
      this.ActualizarCantidad()
      let dialogRef = this.dialog.open(DialogDefectoAudiComponent,
        {
          disableClose: true,
          panelClass: 'my-class',
          data: {
            Cod_Familia: '04',
            Id: this.Id,
            Total: this.Desmanche
          }
        });
      dialogRef.afterClosed().subscribe(result => {

        console.log(result.data)
        if (result != 'false') {
          this.Cod_Accion = "I"
          this.Id
          this.Tipo_Sub_Proceso = '04'
          this.Cod_Defecto = result.data
          this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Detalle_Audi_Web(
            this.Cod_Accion,
            this.Id,
            this.Tipo_Sub_Proceso,
            this.Cod_Defecto
          ).subscribe(
            (result: any) => {
              console.log(result)
              if (result[0].Respuesta == 'OK') {
                this.ActualizarCantidad()
              }
              else {
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
              }
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 5000,
            }))

        }

      })
    }
  }

  RestarEstampado() {
    if (this.Estampado != 0) {
      this.ActualizarCantidad()
      let dialogRef = this.dialog.open(DialogDefectoAudiComponent,
        {
          disableClose: true,
          panelClass: 'my-class',
          data: {
            Cod_Familia: '05',
            Id: this.Id,
            Total: this.Estampado
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result != 'false') {
          this.Cod_Accion = "D"
          this.Id
          this.Tipo_Sub_Proceso = '05'
          this.Cod_Defecto = result.data
          this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Detalle_Audi_Web(
            this.Cod_Accion,
            this.Id,
            this.Tipo_Sub_Proceso,
            this.Cod_Defecto
          ).subscribe(
            (result: any) => {
              console.log(result)
              if (result[0].Respuesta == 'OK') {
                this.ActualizarCantidad()
              }
              else {
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
                this.ActualizarCantidad()
              }
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 5000,
            }))
        }
      })
    }
  }

  SumarEstampado() {
    if (this.Primeras != 0) {
      this.ActualizarCantidad()
      let dialogRef = this.dialog.open(DialogDefectoAudiComponent,
        {
          disableClose: true,
          panelClass: 'my-class',
          data: {
            Cod_Familia: '05',
            Id: this.Id,
            Total: this.Estampado
          }
        });
      dialogRef.afterClosed().subscribe(result => {

        console.log(result.data)
        if (result != 'false') {
          this.Cod_Accion = "I"
          this.Id
          this.Tipo_Sub_Proceso = '05'
          this.Cod_Defecto = result.data
          this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Detalle_Audi_Web(
            this.Cod_Accion,
            this.Id,
            this.Tipo_Sub_Proceso,
            this.Cod_Defecto
          ).subscribe(
            (result: any) => {
              console.log(result)
              if (result[0].Respuesta == 'OK') {
                this.ActualizarCantidad()
              }
              else {
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
                this.ActualizarCantidad()
              }
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 5000,
            }))

        }
      })
    }
  }

  ActualizarPrimeras() {

    //this.Primeras = this.Inicial + (-1 * (this.Compostura + this.Segunda + this.Zurcido + this.Desmanche))
  }

  ActualizarTotal() {

    //this.Primeras = this.Inicial - this.Total
  }

  ActualizarCantidad() {
    this.Id
    this.inspeccionPrendaService.CF_MUESTRA_INSPECCION_RESUMEN_AUDI(
      this.Id
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.Compostura = result[0].Tipo_Sub_Proceso_01
        this.Segunda = result[0].Tipo_Sub_Proceso_02
        this.Zurcido = result[0].Tipo_Sub_Proceso_03
        this.Desmanche = result[0].Tipo_Sub_Proceso_04
        this.Estampado = result[0].Tipo_Sub_Proceso_05
        this.Total = result[0].Total
        this.Primeras = result[0].Primeras
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))
  }

  cerrar() {
    this.inputCodigo.nativeElement.focus()
  }

  obtenerCodigoBarra() {
    this.Codigo = this.formulario.get('Codigo')?.value;
    console.log(this.Codigo.length);
    if (this.Codigo.length == 11) {
      this.LecturaCodBarras();
    }
  }

  LecturaCodBarras() {
    this.Codigo = this.formulario.get('Codigo')?.value
    this.inspeccionPrendaService.CF_MUESTRA_INSPECCION_LECTURA_AUDI(
      this.Codigo
    ).subscribe(
      (result: any) => {
        if (result[0].Respuesta == undefined) {
          this.formulario.controls['OP'].setValue(result[0].COD_ORDPRO)
          this.listar_operacionColor = result
          this.SelectedValueColor = result[0].COD_PRESENT
          this.listar_operacionTalla = result
          this.SelectedValueTalla = result[0].COD_TALLA
          this.Id = result[0].ID
          //this.formulario.controls['Talla'].setValue(result[0].COD_TALLA)
          this.ImagePath = result[0].ICONO_WEB
          this.formulario.controls['Cantidad'].setValue(result[0].PRENDASPAQ)
          this.formulario.controls['Codigo'].disable()
          this.Cod_Fabrica = result[0].COD_FABRICA
          this.Num_Paquete = result[0].NUM_PAQUETE
          this.formulario.controls['OP'].disable()
          this.formulario.controls['Color'].disable()
          this.formulario.controls['Talla'].disable()
          this.formulario.controls['Cantidad'].disable()
          this.DisableSaveButton = false
          //this.formulario.get('Codigo')?.setValue('')
          this.inputCodigo.nativeElement.focus()
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
          this.Limpiar()
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))




    /* if(this.Codigo == 'PTX000001'){
       this.formulario.controls['OP'].setValue('E5470')
       this.formulario.controls['Color'].setValue('WHITE')
       this.formulario.controls['Talla'].setValue('XL')
       this.ImagePath = 'http://192.168.1.36/Estilos/EP18168.jpg'
       this.Total = 50
       this.Inicial = this.Total

     }*/


  }

  GuardarCabecera() {
    let dialogRef = this.dialog.open(DialogConfirmacionComponent,
      {
        disableClose: true,
        data: {
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.Cod_Accion = "I"
        this.Id
        this.Prendas_Paq = this.formulario.get('Cantidad')?.value
        this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Audi_Web(
          this.Cod_Accion,
          this.Id,
          this.Prendas_Paq
        ).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              this.Flg_Habilitar_Detalle = true

              /*this.Tipo_Proceso = result[0].Tipo_Proceso
              this.Tipo_Proceso == 'R' ? this.Tipo_Proceso = 'Reproceso' : this.Tipo_Proceso = 'Produccion';
              this.Tipo_Proceso = this.Tipo_Proceso.toUpperCase()
              console.log(this.Tipo_Proceso)*/

              this.Total = this.Prendas_Paq
              this.Inicial = this.Prendas_Paq
              this.Primeras = this.Prendas_Paq
              this.Id = result[0].Id
              this.formulario.controls['OP'].disable()
              this.formulario.controls['Color'].disable()
              this.formulario.controls['Talla'].disable()
              this.formulario.controls['Cantidad'].disable()
              this.ActualizarCantidad()
              //this.formulario.controls['Codigo'].setValue('')
              this.formulario.controls['Codigo'].disable()
              this.inputCodigo.nativeElement.focus()
              this.matSnackBar.open('Proceso Correcto...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })

            }

            this.Tipo_Proceso = result[0].Tipo_Proceso
            if (this.Tipo_Proceso == 'X') {
              this.grid_border = ' border: 1px solid #E52B18;'
              this.background = 'background-color: #E52B18; border: 1px solid #E52B18;'
              this.btn_background = 'background-color: #E52B18; color: #ffffff;'
            }
            if (this.Tipo_Proceso == 'R') {
              this.grid_border = ' border: 1px solid #0e740e;'
              this.background = 'background-color: #0e740e; border: 1px solid #0e740e;'
              this.btn_background = 'background-color: #0e740e; color: #ffffff;'
            }
            if (this.Tipo_Proceso == 'R') {
              this.Des_Tipo_Proceso = 'Reproceso'
            }
            else if (this.Tipo_Proceso == 'X') {
              this.Des_Tipo_Proceso = 'Rechazado'
            }
            else {
              this.Des_Tipo_Proceso = 'Produccion'
            }

            //this.Tipo_Proceso == 'R' ? this.Tipo_Proceso = 'Reproceso' : this.Tipo_Proceso = 'Produccion';
            this.Des_Tipo_Proceso = this.Des_Tipo_Proceso.toUpperCase()

          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 5000,
          }))
      }
    })

  }

  FinalizarProceso(Flg_Estado: string) {
    let dialogRef = this.dialog.open(DialogConfirmacionComponent,
      {
        disableClose: true,
        data: {
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.inspeccionPrendaService.CF_Man_Inspeccion_Prenda_Finalizado_Audi_Web(
          this.Id,
          Flg_Estado
        ).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              this.Flg_Habilitar_Detalle = false
              this.Limpiar()
              this.matSnackBar.open('Proceso Correcto...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 5000,
          })
        )
      }
    })

  }

  Limpiar() {
    this.formulario.controls['Codigo'].setValue('')
    this.formulario.controls['Codigo'].enable()
    this.inputCodigo.nativeElement.focus()
    this.formulario.controls['OP'].setValue('')
    this.formulario.controls['Color'].setValue('')
    this.listar_operacionColor = []
    this.listar_operacionTalla = []
    this.formulario.controls['Talla'].setValue('')
    this.formulario.controls['Cantidad'].setValue('')
    this.formulario.controls['OP'].enable()
    this.formulario.controls['Color'].enable()
    this.formulario.controls['Talla'].enable()
    this.formulario.controls['Cantidad'].enable()
    this.Id = 0
    this.Tipo_Proceso = ""
    this.Inicial = 0
    this.Total = 0
    this.Compostura = 0
    this.Segunda = 0
    this.Zurcido = 0
    this.Desmanche = 0
    this.Primeras = 0
    this.ImagePath = 'http://192.168.1.36/Estilos/default.jpg'
    this.grid_border = ' border: 1px solid #337ab7;'
    this.background = 'background-color: #3f51b5; border: 1px solid #3f51b5;'
    this.btn_background = 'background-color: #3f51b5; color: #ffffff;'
    this.Des_Tipo_Proceso = ''
    this.DisableSaveButton = true
  }

  CalcularEficiencia() {
    this.inspeccionPrendaService.CF_MUESTRA_INSPECCION_EFICIENCIA(
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.Min_Trabajados = result[0].MIN_TRABAJADOS
        this.Min_Asistidos = result[0].MIN_ASISTIDOS
        this.Eficiencia = result[0].EFICIENCIA
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))
  }

  MostrarColor() {
    this.Cod_OrdPro = this.formulario.get('OP')?.value
    if (this.Cod_OrdPro.length == 5) {
      this.inspeccionPrendaService.CF_MUESTRA_INSPECCION_COLOR(
        this.Cod_OrdPro
      ).subscribe(
        (result: any) => {
          if (result[0].Respuesta == undefined) {
            this.listar_operacionColor = result
            this.ImagePath = result[0].ICONO_WEB
            this.formulario.controls['Codigo'].disable()
            this.formulario.controls['OP'].disable()
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
          }

        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 5000,
        }))
    }
  }

  MostrarTalla(COD_PRESENT: number) {
    this.Cod_OrdPro = this.formulario.get('OP')?.value
    this.inspeccionPrendaService.CF_MUESTRA_INSPECCION_TALLA(
      this.Cod_OrdPro,
      COD_PRESENT
    ).subscribe(
      (result: any) => {
        this.listar_operacionTalla = result

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))

  }
}
