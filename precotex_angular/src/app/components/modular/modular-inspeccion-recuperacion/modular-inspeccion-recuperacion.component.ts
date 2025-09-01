import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { InspeccionSegundaService } from 'src/app/services/modular/inspeccion-segunda.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DialogConfirmacionComponent } from '../../dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalVariable } from 'src/app/VarGlobals';
import { DialogDefectosRecuperacionComponent } from './dialog-defectos-recuperacion/dialog-defectos-recuperacion.component';
import { InspeccionPrendaService } from 'src/app/services/inspeccion-prenda.service';

declare var JsBarcode: any;

interface Color {
  COD_PRESENT: number;
  DES_PRESENT: string;
}

interface Talla {
  COD_TALLA: string;
}


@Component({
  selector: 'app-modular-inspeccion-recuperacion',
  templateUrl: './modular-inspeccion-recuperacion.component.html',
  styleUrls: ['./modular-inspeccion-recuperacion.component.scss']
})
export class ModularInspeccionRecuperacionComponent implements OnInit {

  Id = 0
  Tipo_Sub_Proceso = ''
  Des_Tipo_Proceso = ''
  Tipo_Proceso = ''

  Cod_Accion = ''
  Cod_OrdPro = ''
  Cod_Present:any;
  Cod_Talla = ''
  Prendas_Paq:any;
  mostrar = false;
  codigos:Array<any> = [];
  //flg para dar clase css cuando es reproceso o proceso normal
  grid_border = ' border: 1px solid #337ab7;'
  background = 'background-color: #2962FF; border: 1px solid #2962FF;'
  btn_background = 'background-color: #2962FF; color: #ffffff;'

  titulo_prendas = 'Prendas Especiales'
  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    OP: [''],
    Color: [''],
    Talla: [''],
    Codigo: [''],
    Cantidad: ['']
  })

  ImagePath = 'http://192.168.1.36/Estilos/default.jpg';

  SelectedValueColor: any;
  SelectedValueTalla: any;
  Cod_Fabrica: any;
  Num_Paquete: any;

  listar_operacionColor: Color[] = [];
  listar_operacionTalla: Talla[] = [];

  DisableSaveButton = true;
  Flg_Habilitar_Detalle = false;
  deshabilitar = false;

  Codigo: string = '';
  @ViewChild('Codigo') inputCodigo!: ElementRef;

  Total = 0;
  dataPrendaDefectos:Array<any> = [];
  Primeras = 0;
  Derivadas = 0;
  Recogidas = 0;
  Tipo_Ticket = '';


  //variables para obtener valores del SP CF_MUESTRA_INSPECCION_EFICIENCIA
  Min_Trabajados = 0
  Min_Asistidos = 0
  Eficiencia = 0
  constructor(private formBuilder: FormBuilder, private matSnackBar: MatSnackBar, private inspeccionPrendaService: InspeccionPrendaService, private SpinnerService: NgxSpinnerService, private inspeccionSegundaService: InspeccionSegundaService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtenerPendienteHabilitador();
  }

  obtenerCodigoBarra() {
    this.Codigo = this.formulario.get('Codigo')?.value;
    console.log(this.Codigo.length);
    if (this.Codigo.length == 11) {
      this.Codigo = this.formulario.get('Codigo')?.value
      this.SpinnerService.show();
      this.inspeccionSegundaService.CF_MUESTRA_INSPECCION_LECTURA_TICKET(
        this.Codigo
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          if (result[0].Respuesta == undefined) {
            this.formulario.controls['OP'].setValue(result[0].COD_ORDPRO)
            this.listar_operacionColor = result
            this.SelectedValueColor = result[0].COD_PRESENT
            this.listar_operacionTalla = result
            this.SelectedValueTalla = result[0].COD_TALLA
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
            this.inputCodigo.nativeElement.focus();

            this.Total = result[0].PRENDASPAQ;
            this.Tipo_Ticket = result[0].Tipo_Ticket;
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
            verticalPosition:'top'
          });
        })
    } else {
      this.SpinnerService.hide();
    }

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

        this.inspeccionSegundaService.CF_Modular_Inspeccion_Prenda_Seg_Web(
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
            else if (this.Tipo_Proceso == 'S') {
              this.Des_Tipo_Proceso = 'Segundas'
            }else if (this.Tipo_Proceso == '2') {
              this.Des_Tipo_Proceso = 'Adicional 2'
            }
            else if (this.Tipo_Proceso == '3') {
              this.Des_Tipo_Proceso = 'Adicional 3'
            }
            else {
              this.Des_Tipo_Proceso = 'Produccion'
            }

            if(this.Tipo_Ticket == '1'){
              this.titulo_prendas = 'Prendas Especiales';
            }else if(this.Tipo_Ticket == '2'){
              this.titulo_prendas = 'Adicionales 2';
            }else if(this.Tipo_Ticket == '3'){
              this.titulo_prendas = 'Adicionales 3';
            }
            //this.Tipo_Proceso == 'R' ? this.Tipo_Proceso = 'Reproceso' : this.Tipo_Proceso = 'Produccion';
            this.Des_Tipo_Proceso = this.Des_Tipo_Proceso.toUpperCase()

          },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 3000,
              verticalPosition:'top'
            });
            this.SpinnerService.hide();
          })
      }
    })

  }

  agregarDefecto(item, cod_familia){
    let dialogRef = this.dialog.open(DialogDefectosRecuperacionComponent,
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
        
      } else {
        this.ActualizarCantidad();
      }
    });
  }
 
  quitarDefecto(item, cod_familia){
    let dialogRef = this.dialog.open(DialogDefectosRecuperacionComponent,
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
        this.inspeccionSegundaService.CF_Man_Modular_Segundas_Detalle_Web(
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
            //this.obtenerPendienteHabilitador();
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

  agregarPrenda() {
    this.SpinnerService.show();
    this.inspeccionSegundaService.CF_Modular_Agregar_Prenda_Web(
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
  

  eliminarPrenda(item) {
    console.log(item);
    
    if (confirm('¿Esta seguro(a) de eliminar esta prenda?')) {
      this.inspeccionSegundaService.CF_Modular_Agregar_Prenda_Web(
        'D',
        this.Id,
        item.Id_Numero_Prenda,
        GlobalVariable.vusu
      ).subscribe(
        (result: any) => {
          this.SpinnerService.show();
          //this.obtenerPendienteHabilitador();
          this.SpinnerService.hide();
          console.log(result);
          if (result[0].status == 1) {
            this.matSnackBar.open('Se elimino la prenda correctamente', 'Cerrar', {
              duration: 3000,
              verticalPosition:'top'
            })
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
  }

  ActualizarCantidad() {
    this.SpinnerService.show();

    this.inspeccionSegundaService.CF_MODULAR_INSPECCION_PRENDAS(
      this.Id
    ).subscribe(
      (result: any) => {
        this.obtenerPendienteHabilitador();
        this.SpinnerService.hide();
        console.log(result);
        this.dataPrendaDefectos = result;

        this.dataPrendaDefectos = this.dataPrendaDefectos.filter(elem => {
          return elem.Cod_Usuario == GlobalVariable.vusu; 
        });
        this.Derivadas = result.length;
        result.forEach(element => {
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
        this.inspeccionSegundaService.CF_Modular_Inspeccion_Prenda_Finalizado_Web(
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
                verticalPosition:'top'
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

  refrescarCabecera(){
    this.Cod_OrdPro = this.formulario.get('OP')?.value
        this.Cod_Present = this.formulario.get('Color')?.value
        this.Cod_Talla = this.formulario.get('Talla')?.value
        this.Num_Paquete = this.Num_Paquete
        this.Prendas_Paq = this.formulario.get('Cantidad')?.value

        this.inspeccionSegundaService.CF_Modular_Inspeccion_Prenda_Seg_Web(
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
              this.matSnackBar.open('Proceso Correcto...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3000 })
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
              this.Id = result[0].Id
              this.Flg_Habilitar_Detalle = true
              this.deshabilitar = true;
              this.ActualizarCantidad()
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
            else if (this.Tipo_Proceso == 'S') {
              this.Des_Tipo_Proceso = 'Segundas'
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
              verticalPosition:'top'
            });
            this.SpinnerService.hide();
          })
  }

  obtenerPendienteHabilitador() {
    var usuario = GlobalVariable.vusu;
    this.inspeccionSegundaService.CF_MODULAR_RESUMEN_POR_RECOJER_INSPECTORA(usuario).subscribe(
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
        verticalPosition:'top'
      }))
  }

  createBarcode(index, texto) {

    setTimeout(() => {
      var id = '#barcode' + index;
      JsBarcode(id, texto);
    }, 1000);

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

  }
}
