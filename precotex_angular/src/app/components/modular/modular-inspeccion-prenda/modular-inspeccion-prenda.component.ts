import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { InspeccionPrendaService } from 'src/app/services/modular/inspeccion-prenda.service';
import { DialogConfirmacionComponent } from '../../dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalVariable } from 'src/app/VarGlobals';
import { DialogDefectosModularComponent } from './dialog-defectos-modular/dialog-defectos-modular.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

declare var JsBarcode: any;

interface Color {
  COD_PRESENT: number;
  DES_PRESENT: string;
}

interface Talla {
  COD_TALLA: string;
}




@Component({
  selector: 'app-modular-inspeccion-prenda',
  templateUrl: './modular-inspeccion-prenda.component.html',
  styleUrls: ['./modular-inspeccion-prenda.component.scss']
})
export class ModularInspeccionPrendaComponent implements OnInit {



  Id = 0
  Tipo_Sub_Proceso = ''
  Des_Tipo_Proceso = ''

  //flg para dar clase css cuando es reproceso o proceso normal
  grid_border = ''
  background = 'background-color: #2962FF; border: 1px solid #2962FF;'
  btn_background = 'background-color: #2962FF; color: #ffffff;'

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    OP: [''],
    Color: [''],
    Talla: [''],
    Codigo: [''],
    Cantidad: ['']
  })

  DisableSaveButton = true;
  Flg_Habilitar_Detalle = false;
  deshabilitar = false;
  ImagePath = 'http://192.168.1.36/Estilos/default.jpg'
  @ViewChild('Codigo') inputCodigo!: ElementRef;

  Codigo: string = '';

  SelectedValueColor: any;
  SelectedValueTalla: any;
  Cod_Fabrica: any;
  Num_Paquete: any;
  Tipo_Ticket: any;

  listar_operacionColor: Color[] = [];
  listar_operacionTalla: Talla[] = [];

  dataPrendaDefectos: Array<any> = [];
  //VARIABLES
  Cod_Accion: string = '';
  Cod_OrdPro: string = '';
  Cod_Present: number;
  Cod_Talla: string = '';
  Prendas_Paq: number;

  Tipo_Proceso: string = '';

  Total = 0;
  Inicial = 0;
  Primeras = 0;
  Derivadas = 0;
  Recogidas = 0;

  mostrar: boolean = false;
  codigos: Array<any> = [];


  //variables para obtener valores del SP CF_MUESTRA_INSPECCION_EFICIENCIA
  Min_Trabajados = 0
  Min_Asistidos = 0
  Eficiencia = 0

  constructor(private formBuilder: FormBuilder, private matSnackBar: MatSnackBar, private inspeccionPrendaService: InspeccionPrendaService, private SpinnerService: NgxSpinnerService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtenerPendienteHabilitador();
    this.CalcularEficiencia();
    
  }
  ngAfterViewInit() {
    this.inputCodigo.nativeElement.focus()
  }

  changeCodigo(event) {
    console.log(event);
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
    this.SpinnerService.show();
    this.inspeccionPrendaService.CF_MUESTRA_INSPECCION_LECTURA_TICKET(
      this.Codigo
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result[0].Respuesta == undefined) {
          this.formulario.controls['OP'].setValue(result[0].COD_ORDPRO);
          this.listar_operacionColor = result;
          this.SelectedValueColor = result[0].COD_PRESENT;
          this.listar_operacionTalla = result;
          this.SelectedValueTalla = result[0].COD_TALLA;
          //this.formulario.controls['Talla'].setValue(result[0].COD_TALLA)
          this.ImagePath = result[0].ICONO_WEB;
          this.formulario.controls['Cantidad'].setValue(result[0].PRENDASPAQ);
          this.formulario.controls['Codigo'].disable();
          this.Cod_Fabrica = result[0].COD_FABRICA;
          this.Num_Paquete = result[0].NUM_PAQUETE;
          this.formulario.controls['OP'].disable();
          this.formulario.controls['Color'].disable();
          this.formulario.controls['Talla'].disable();
          this.formulario.controls['Cantidad'].disable();
          this.DisableSaveButton = false;
          this.Tipo_Ticket = result[0].Tipo_Ticket;
          this.inputCodigo.nativeElement.focus();


          this.Total = result[0].PRENDASPAQ

        }
        else {
          Swal.fire(result[0].Respuesta, '', 'warning')
          this.Limpiar()
        }

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });
      })

  }


  refrescarCabecera(){
    this.Cod_OrdPro = this.formulario.get('OP')?.value
        this.Cod_Present = this.formulario.get('Color')?.value
        this.Cod_Talla = this.formulario.get('Talla')?.value
        this.Num_Paquete = this.Num_Paquete
        this.Prendas_Paq = this.formulario.get('Cantidad')?.value

        this.inspeccionPrendaService.CF_Modular_Inspeccion_Prenda_Web(
          this.Cod_Accion,
          this.Cod_Fabrica,
          this.Cod_OrdPro,
          this.Cod_Present,
          this.Cod_Talla,
          this.Num_Paquete,
          this.Prendas_Paq,
          this.Codigo,
          this.Tipo_Ticket
        ).subscribe(
          (result: any) => {
            console.log(result);
            this.SpinnerService.hide();
            if (result[0].Respuesta == 'OK') {
              this.Flg_Habilitar_Detalle = true

              this.Id = result[0].Id
              this.formulario.controls['OP'].disable()
              this.formulario.controls['Color'].disable()
              this.formulario.controls['Talla'].disable()
              this.formulario.controls['Cantidad'].disable()
              this.ActualizarCantidad()
              this.matSnackBar.open('Proceso Correcto...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
            } else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
              this.Id = result[0].Id
              this.Flg_Habilitar_Detalle = true
              this.deshabilitar = true;
              this.ActualizarCantidad()
            }
            this.Tipo_Proceso = result[0].Tipo_Proceso
            console.log(this.Tipo_Proceso);
            if (this.Tipo_Proceso == 'X') {
              this.grid_border = ' border: 1px solid #E52B18;'
              this.background = 'background-color: #E52B18; border: 1px solid #E52B18;'
              this.btn_background = 'background-color: #E52B18; color: #ffffff;'
              this.deshabilitar = false;
              console.log('proceso X');
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
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top'
            });
            this.SpinnerService.hide();
          })
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

  GuardarCabecera() {
    let dialogRef = this.dialog.open(DialogConfirmacionComponent,
      {
        disableClose: true,
        data: {
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.SpinnerService.show();
        this.Cod_Accion = "I"
        this.Cod_Fabrica = this.Cod_Fabrica
        if (this.Cod_Fabrica == "") {
          this.Cod_Fabrica = "001"
        }
        this.Cod_OrdPro = this.formulario.get('OP')?.value
        this.Cod_Present = this.formulario.get('Color')?.value
        this.Cod_Talla = this.formulario.get('Talla')?.value
        this.Num_Paquete = this.Num_Paquete
        this.Prendas_Paq = this.formulario.get('Cantidad')?.value

        this.inspeccionPrendaService.CF_Modular_Inspeccion_Prenda_Web(
          this.Cod_Accion,
          this.Cod_Fabrica,
          this.Cod_OrdPro,
          this.Cod_Present,
          this.Cod_Talla,
          this.Num_Paquete,
          this.Prendas_Paq,
          this.Codigo,
          this.Tipo_Ticket
        ).subscribe(
          (result: any) => {
            console.log(result);
            this.SpinnerService.hide();
            if (result[0].Respuesta == 'OK') {
              this.Flg_Habilitar_Detalle = true

              this.Id = result[0].Id
              this.formulario.controls['OP'].disable()
              this.formulario.controls['Color'].disable()
              this.formulario.controls['Talla'].disable()
              this.formulario.controls['Cantidad'].disable()
              this.ActualizarCantidad()
              this.matSnackBar.open('Proceso Correcto...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
              this.deshabilitar = false;
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
              this.Id = result[0].Id
              this.ActualizarCantidad()
              this.Flg_Habilitar_Detalle = true
              this.deshabilitar = true;
            }
            this.Tipo_Proceso = result[0].Tipo_Proceso
            if (this.Tipo_Proceso == 'X') {
              this.grid_border = ' border: 1px solid #E52B18;'
              this.background = 'background-color: #E52B18; border: 1px solid #E52B18;'
              this.btn_background = 'background-color: #E52B18; color: #ffffff;'
              this.deshabilitar = false;
            }
            if (this.Tipo_Proceso == 'R') {
              this.grid_border = ' border: 1px solid #0e740e;'
              this.background = 'background-color: #0e740e; border: 1px solid #0e740e;'
              this.btn_background = 'background-color: #0e740e; color: #ffffff;'
            }
            if (this.Tipo_Proceso == '3') {
              this.grid_border = ' border: 1px solid #58D3F7;'
              this.background = 'background-color: #58D3F7; border: 1px solid #58D3F7;'
              this.btn_background = 'background-color: #58D3F7; color: #ffffff;'
            }
            if (this.Tipo_Proceso == '2') {
              this.grid_border = ' border: 1px solid #FE9A2E;'
              this.background = 'background-color: #FE9A2E; border: 1px solid #FE9A2E;'
              this.btn_background = 'background-color: #FE9A2E; color: #ffffff;'
            }
            if (this.Tipo_Proceso == 'R') {
              this.Des_Tipo_Proceso = 'Reproceso'
            }
            else if (this.Tipo_Proceso == 'X') {
              this.Des_Tipo_Proceso = 'Rechazado'
            }
            else if (this.Tipo_Proceso == '2') {
              this.Des_Tipo_Proceso = 'Adicional 2'
            }
            else if (this.Tipo_Proceso == '3') {
              this.Des_Tipo_Proceso = 'Adicional 3'
            }
            else {
              this.Des_Tipo_Proceso = 'Produccion'
            }

            //this.Tipo_Proceso == 'R' ? this.Tipo_Proceso = 'Reproceso' : this.Tipo_Proceso = 'Produccion';
            this.Des_Tipo_Proceso = this.Des_Tipo_Proceso.toUpperCase()

          },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top'
            });
            this.SpinnerService.hide();
          })
      }
    })

  }

  eliminarPrenda(item) {
    console.log(item);
    
    if (confirm('¿Esta seguro(a) de eliminar esta prenda?')) {
      this.SpinnerService.show();
      this.inspeccionPrendaService.CF_Modular_Agregar_Prenda_Web(
        'D',
        this.Id,
        item.Id_Numero_Prenda,
        GlobalVariable.vusu
      ).subscribe(
        (result: any) => {
          this.obtenerPendienteHabilitador();
          this.SpinnerService.hide();
          console.log(result);
          if (result[0].status == 1) {
            this.matSnackBar.open('Se elimino la prenda correctamente', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top'
            })
            this.ActualizarCantidad();
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top'
            });
          }

        },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 3000,
          });
          this.SpinnerService.hide();
        })
    }else{
      this.SpinnerService.hide();
    }

  }

  finalizarTicket() {
    let dialogRef = this.dialog.open(DialogConfirmacionComponent,
      {
        disableClose: true,
        data: {
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.SpinnerService.show();
        this.inspeccionPrendaService.CF_Modular_Inspeccion_Prenda_Finalizado_Web(
          this.Id,
          GlobalVariable.vusu
        ).subscribe(
          (result: any) => {
            this.obtenerPendienteHabilitador();
            this.SpinnerService.hide();
            console.log(result);
            if (result[0].status == 1) {
              this.matSnackBar.open('Se finalizo el paquete correctamente', 'Cerrar', {
                duration: 3000,
                verticalPosition: 'top'
              })
              this.refrescarCabecera();
            } else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
                duration: 3000,
                verticalPosition:'top'
              });
            }

          },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 3000,
              verticalPosition:'top'
            });
            this.SpinnerService.hide();
          })

      }

    });
  }

  agregarPrenda() {
    this.SpinnerService.show();

    this.inspeccionPrendaService.CF_Modular_Agregar_Prenda_Web(
      'I',
      this.Id,
      '0',
      GlobalVariable.vusu
    ).subscribe(
      (result: any) => {
        //this.obtenerPendienteHabilitador();
        this.SpinnerService.hide();
        console.log(result);
        if (result[0].status == 1) {
          this.matSnackBar.open('Se agrego la prenda correctamente', 'Cerrar', {
            duration: 3000,
            verticalPosition:'top'
          })

          document.getElementById('tabla').scrollIntoView();
          //target.scrollIntoView();
          this.ActualizarCantidad();
        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
            duration: 3000,
            verticalPosition:'top'
          });
        }

      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3000,
          verticalPosition:'top'
        });
        this.SpinnerService.hide();
      })
  }

  ActualizarCantidad() {
    this.SpinnerService.show();

    this.inspeccionPrendaService.CF_MODULAR_INSPECCION_PRENDAS(
      this.Id
    ).subscribe(
      (result: any) => {
        this.obtenerPendienteHabilitador();
        this.SpinnerService.hide();
        //console.log("result");
        //console.log(result);
        this.dataPrendaDefectos = result;

        this.Recogidas = 0
        this.Derivadas = this.dataPrendaDefectos.length;
        this.dataPrendaDefectos.forEach(element => {
          //console.log(element.Num_Prenda)
          if (element.Cantidad_R == 1) {
            this.Recogidas += 1;
          }
        });

        this.Primeras = this.Total - this.Derivadas;
      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3000,
          verticalPosition:'top'
        });
        this.SpinnerService.hide();
      })
  }

  obtenerPendienteHabilitador() {
    var usuario = GlobalVariable.vusu;
    this.inspeccionPrendaService.CF_MODULAR_RESUMEN_POR_RECOJER_INSPECTORA(usuario).subscribe(
      (res: any) => {
        console.log(res);
        if (res) {
          this.codigos = res;
          this.mostrar = true;
          var scroll = document.getElementById('card-scroll');
          scroll.scrollTo(0, 0);
          for (let i = 0; i < this.codigos.length; i++) {
            this.createBarcode(i, this.codigos[i].Ticket)
          }
        } else {
          this.mostrar = false;
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  createBarcode(index, texto) {

    setTimeout(() => {
      var id = '#barcode' + index;
      JsBarcode(id, texto);
    }, 1000);

  }

  agregarDefecto(item, cod_familia) {
    if (cod_familia == '01' || cod_familia == '02' || cod_familia == '13') {
      this.SpinnerService.show();
      this.inspeccionPrendaService.CF_Man_Modular_Inspeccion_Detalle_Web(
        'I',
        this.Id,
        cod_familia,
        '',
        item.Id_Numero_Prenda,
        '',
        '',
        GlobalVariable.vusu
      ).subscribe(
        (result: any) => {
          this.obtenerPendienteHabilitador();
          this.SpinnerService.hide();
          console.log(result);
          if (result[0]['Respuesta'] == 'OK') {
            this.matSnackBar.open('Se agrego el defecto correctamente.', 'Cerrar', {
              duration: 3000,
              verticalPosition:'top'
            });
            this.ActualizarCantidad();
          } else {
            this.matSnackBar.open(result[0]['Respuesta'], 'Cerrar', {
              duration: 3000,
              verticalPosition:'top'
            });
          }
        },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 3000,
            verticalPosition:'top'
          });
          this.SpinnerService.hide();
        })
    } else {
      let dialogRef = this.dialog.open(DialogDefectosModularComponent,
        {
          disableClose: true,
          panelClass: 'my-class',
          maxWidth: '550',
          data: {
            Cod_Familia: cod_familia,
            Id: item.Id_Numero_Prenda,
            Id_N: this.Id,
            Total: 1,
            Tipo: 'Seleccionar Defecto a Agregar'
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result != 'false') {
          this.SpinnerService.show();
          this.inspeccionPrendaService.CF_Man_Modular_Inspeccion_Detalle_Web(
            'I',
            this.Id,
            cod_familia,
            result.data,
            item.Id_Numero_Prenda,
            '',
            '',
            GlobalVariable.vusu
          ).subscribe(
            (result: any) => {
              this.obtenerPendienteHabilitador();
              this.SpinnerService.hide();
              console.log(result);
              if (result[0]['Respuesta'] == 'OK') {
                this.matSnackBar.open('Se agrego el defecto correctamente.', 'Cerrar', {
                  duration: 3000,
                  verticalPosition:'top'
                });
                this.ActualizarCantidad();
              } else {
                this.matSnackBar.open(result[0]['Respuesta'], 'Cerrar', {
                  duration: 3000,
                  verticalPosition:'top'
                });
              }
            },
            (err: HttpErrorResponse) => {
              this.matSnackBar.open(err.message, 'Cerrar', {
                duration: 3000,
                verticalPosition:'top'
              });
              this.SpinnerService.hide();
            })
        } else {
          this.ActualizarCantidad();
        }
      });
    }
  }

  quitarDefecto(item, cod_familia) {
    if (cod_familia == '01' || cod_familia == '02' || cod_familia == '13') {
      this.SpinnerService.show();
      this.inspeccionPrendaService.CF_Man_Modular_Inspeccion_Detalle_Web(
        'D',
        this.Id,
        cod_familia,
        '',
        item.Id_Numero_Prenda,
        '',
        '',
        GlobalVariable.vusu
      ).subscribe(
        (result: any) => {
          this.obtenerPendienteHabilitador();
          this.SpinnerService.hide();
          console.log(result);
          if (result[0]['Respuesta'] == 'OK') {
            this.matSnackBar.open('Se quitó el defecto correctamente.', 'Cerrar', {
              duration: 3000,
              verticalPosition:'top'
            });
            this.ActualizarCantidad();
          } else {
            this.matSnackBar.open(result[0]['Respuesta'], 'Cerrar', {
              duration: 3000,
              verticalPosition:'top'
            });
          }
        },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 3000,
            verticalPosition:'top'
          });
          this.SpinnerService.hide();
        })
    } else {
      let dialogRef = this.dialog.open(DialogDefectosModularComponent,
        {
          disableClose: true,
          panelClass: 'my-class',
          maxWidth: '550',
          data: {
            Cod_Familia: cod_familia,
            Id: item.Id_Numero_Prenda,
            Total: 0,
            Id_N: this.Id,
            Tipo: 'Seleccionar Defecto a Quitar'
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result != 'false') {
          this.SpinnerService.show();
          this.inspeccionPrendaService.CF_Man_Modular_Inspeccion_Detalle_Web(
            'D',
            this.Id,
            cod_familia,
            result.data,
            item.Id_Numero_Prenda,
            '',
            '',
            GlobalVariable.vusu
          ).subscribe(
            (result: any) => {
              this.obtenerPendienteHabilitador();
              this.SpinnerService.hide();
              console.log(result);
              if (result[0]['Respuesta'] == 'OK') {
                this.matSnackBar.open('Se ha eliminado el defecto correctamente.', 'Cerrar', {
                  duration: 3000,
                  verticalPosition:'top'
                });
                this.ActualizarCantidad();
              } else {
                this.matSnackBar.open(result[0]['Respuesta'], 'Cerrar', {
                  duration: 3000,
                  verticalPosition:'top'
                });
              }
            },
            (err: HttpErrorResponse) => {
              this.matSnackBar.open(err.message, 'Cerrar', {
                duration: 3000,
                verticalPosition:'top'
              });
              this.SpinnerService.hide();
            })
        }
      });
    }
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
    this.formulario.controls['OP'].disable()
    this.formulario.controls['Color'].disable()
    this.formulario.controls['Talla'].disable()
    this.formulario.controls['Cantidad'].disable()
    //this.formulario.controls['OP'].enable()
    //this.formulario.controls['Color'].enable()
    //this.formulario.controls['Talla'].enable()
    //this.formulario.controls['Cantidad'].enable()
    this.Des_Tipo_Proceso = ''
    this.Id = 0
    this.ImagePath = 'http://192.168.1.36/Estilos/default.jpg'
    this.grid_border = ' border: 1px solid #337ab7;'
    this.background = 'background-color: #2962FF; border: 1px solid #2962FF;'
    this.btn_background = 'background-color: #2962FF; color: #ffffff;'
    this.DisableSaveButton = true;
    this.deshabilitar = false;
    this.Flg_Habilitar_Detalle = false;
    this.dataPrendaDefectos = [];
    this.Primeras = 0;
    this.Total = 0;
    this.Derivadas = 0;
    this.Recogidas = 0;

    this.CalcularEficiencia();

  }
}
