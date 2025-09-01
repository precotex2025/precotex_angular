import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaPrendaService } from 'src/app/services/modular/auditoria-prenda.service';
import { DialigDefectosAuditoriaComponent } from '../modular-auditoria-modulo/dialig-defectos-auditoria/dialig-defectos-auditoria.component';
import { InspeccionPrendaService } from 'src/app/services/inspeccion-prenda.service';


@Component({
  selector: 'app-modular-auditoria-salida',
  templateUrl: './modular-auditoria-salida.component.html',
  styleUrls: ['./modular-auditoria-salida.component.scss']
})
export class ModularAuditoriaSalidaComponent implements OnInit {

  Id = 0
  Tipo_Sub_Proceso = ''
  Des_Tipo_Proceso = ''

  //flg para dar clase css cuando es reproceso o proceso normal
  grid_border = ' border: 1px solid #337ab7;'
  background = 'background-color: #2962FF; border: 1px solid #2962FF;'
  btn_background = 'background-color: #2962FF; color: #ffffff;'

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Ticket: [''],
    OP: [''],
    Color: [''],
    Talla: [''],
    Muestra: [''],
    Cantidad: ['']
  })


  dataPaquetes: Array<any> = [];

  ImagePath = 'http://192.168.1.36/Estilos/default.jpg'
  Id_Auditoria_Modular:number = 0;
  Color:string = '';
  deshabilitar:boolean = false;
  calificar:boolean = false;
  noAgregar:boolean = false;
  totalPrendas = 0;
  
  dataPrendas:Array<any> = [];
  dataPrendaDefectos:Array<any> = [];

  Min_Trabajados = 0
  Min_Asistidos = 0
  Eficiencia = 0
  constructor(private formBuilder: FormBuilder, private matSnackBar: MatSnackBar, private auditoriaService: AuditoriaPrendaService, private SpinnerService: NgxSpinnerService, public dialog: MatDialog, private inspeccionPrendaService: InspeccionPrendaService) { }

  ngOnInit(): void {
  }

  deletePaquete(Ticket) {
    if (confirm('Esta seguro de eliminar este paquete?')) {
      this.dataPaquetes = this.dataPaquetes.filter(element => {
        return element.Ticket != Ticket
      });
    }
  }

  agregarTicket() {
    var ticket = this.formulario.get('Ticket').value;
    if (ticket.length >= 11) {
      this.SpinnerService.show();
      this.auditoriaService.CF_Modular_Auditoria_Muestra_Paquete('S', ticket).subscribe(
        (res: any) => {
          this.SpinnerService.hide();

          if (res[0].status == 1) {
            if (this.dataPaquetes.length == 0) {
              this.dataPaquetes = res;
            }
          } else {
            this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
          }
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
            verticalPosition:'top'
          })
        })
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


  limpiarAuditoria(){
    this.CalcularEficiencia();
    this.Id_Auditoria_Modular = 0;
    this.dataPaquetes = [];
    this.formulario.reset();
    this.ImagePath = 'http://192.168.1.36/Estilos/default.jpg';
    this.dataPrendaDefectos = [];
    this.dataPrendas = [];
    this.deshabilitar = false;
    this.calificar = false;
    this.noAgregar = false;
    this.totalPrendas = 0;
  }

  iniciarAuditoria() {
    var cantidad = 0;
    this.dataPaquetes.forEach(element => {
      cantidad += element.Cantidad;
    });
    let data = {
      Tipo_Proceso: 'S',
      Cantidad: cantidad,
      Ticket: this.dataPaquetes[0].Ticket,
      Cod_Usuario: GlobalVariable.vusu,
      paquetes: this.dataPaquetes
    }
    this.SpinnerService.show();
    this.auditoriaService.CF_Modular_Man_Auditoria_Prendas(data).subscribe({
      next: (response: any) => {
        console.log(response);
        this.SpinnerService.hide();
        if(response[0].Respuesta == 'OK'){
          this.Id_Auditoria_Modular = response[0].Id_Auditoria_Modular;
          
          var tallas = '';
          this.dataPaquetes.forEach(element => {
              tallas = tallas + element.Cod_Talla + ', ';
          });

          this.formulario.patchValue({
            Muestra: response[0].Muestra,
            Cantidad: response[0].Cantidad,
            Talla: tallas
          });
          this.obtenerDatosTicket();
        }
      },
      error: (error) => {
        console.log(error);
        this.SpinnerService.hide();
      }
    });
  }

  obtenerDatosTicket(){
    this.SpinnerService.show();
    this.auditoriaService.CF_MUESTRA_INSPECCION_LECTURA_TICKET(this.dataPaquetes[0].Ticket).subscribe({
      next: (response: any) => {
        console.log(response); 
        this.SpinnerService.hide();
        this.formulario.patchValue({
          Color: response[0].DES_PRESENT,
          OP: response[0].COD_ORDPRO
        });

        this.ImagePath = response[0].ICONO_WEB;

      },
      error: (error) => {
        console.log(error);
        this.SpinnerService.hide();
      }
    });
  }

  agregarPrenda() {
    this.SpinnerService.show();

    this.auditoriaService.CF_Auditoria_Agregar_Prenda_Web(
      'I',
      this.Id_Auditoria_Modular,
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
          this.ActualizarCantidad(false);
          document.getElementById('tabla').scrollIntoView();
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


  ActualizarCantidad(anulaItem: boolean) {
    this.SpinnerService.show();

    this.auditoriaService.CF_MODULAR_AUDITORIA_PRENDAS_WEB(
      this.Id_Auditoria_Modular
    ).subscribe(
      (result: any) => {
        //this.obtenerPendienteHabilitador();
        this.SpinnerService.hide();
        console.log(result);
        this.dataPrendas = result;
        this.totalPrendas = this.dataPrendas.length;
        this.noAgregar = this.totalPrendas >= this.formulario.get('Muestra').value ? true : false;
        this.calificar = anulaItem && this.totalPrendas > this.formulario.get('Muestra').value ? true : false;
      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3000,
          verticalPosition:'top'
        });
        this.SpinnerService.hide();
      })
  }

  agregarDefecto(item, cod_familia){
    let dialogRef = this.dialog.open(DialigDefectosAuditoriaComponent,
      {
        disableClose: true,
        panelClass: 'my-class',
        maxWidth: '550',
        data: {
          Cod_Familia: cod_familia,
          Id: item.Id_Numero_Prenda,
          Id_N: this.Id_Auditoria_Modular,
          Total: 1,
          Tipo: 'Seleccionar Defecto a Agregar'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != 'false') {
        this.SpinnerService.show();
        this.auditoriaService.CF_Man_Modular_Auditoria_Detalle_Web(
          'I',
          this.Id_Auditoria_Modular,
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
              this.matSnackBar.open('Se agrego el defecto correctamente.', 'Cerrar', {
                duration: 3000,
                verticalPosition:'top'
              });
              this.ActualizarCantidad(false);
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
        this.ActualizarCantidad(false);
      }
    });
  }
 
  quitarDefecto(item, cod_familia){
    let dialogRef = this.dialog.open(DialigDefectosAuditoriaComponent,
      {
        disableClose: true,
        panelClass: 'my-class',
        maxWidth: '550',
        data: {
          Cod_Familia: cod_familia,
          Id: item.Id_Numero_Prenda,
          Total: 0,
          Id_N: this.Id_Auditoria_Modular,
          Tipo: 'Seleccionar Defecto a Quitar'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != 'false') {
        this.SpinnerService.show();
        this.auditoriaService.CF_Man_Modular_Auditoria_Detalle_Web(
          'D',
          this.Id_Auditoria_Modular,
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
              this.ActualizarCantidad(false);
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

  eliminarPrenda(item) {
    console.log(item);
    
    if (confirm('¿Esta seguro(a) de eliminar esta prenda?')) {
      this.SpinnerService.show();
      this.auditoriaService.CF_Auditoria_Agregar_Prenda_Web(
        'D',
        this.Id_Auditoria_Modular,
        item.Id_Numero_Prenda,
        GlobalVariable.vusu
      ).subscribe(
        (result: any) => {
          //this.obtenerPendienteHabilitador();
          this.SpinnerService.hide();
          console.log(result);
          if (result[0].status == 1) {
            this.matSnackBar.open('Se elimino la prenda correctamente', 'Cerrar', {
              duration: 3000,
              verticalPosition:'top'
            })
            this.ActualizarCantidad(true);
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


  finalizarAuditoria(Flg_Estado){
    this.SpinnerService.show();
    if (confirm('¿Esta seguro(a) de finalizar estos paquetes?')) {
      this.auditoriaService.CF_Man_Modular_Auditoria_Finaliza_Web(
        'S',
        Flg_Estado,
        this.Id_Auditoria_Modular,
        this.formulario.get('Muestra').value,
        GlobalVariable.vusu
      ).subscribe(
        (result: any) => {
          //this.obtenerPendienteHabilitador();
          this.SpinnerService.hide();
          console.log(result);
          this.deshabilitar = true;
          if (result[0].status == 1) {
            this.matSnackBar.open('Se guardaron los cambios correctamente', 'Cerrar', {
              duration: 3000,
              verticalPosition:'top'
            })
            this.deshabilitar = true;
            this.calificar = true;
            this.noAgregar = true;
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
    }else{
      this.SpinnerService.hide();
    }  
  }

  onValidaMuestra(event: any){
    //console.log(this.formulario.get('Muestra')?.value)
    //console.log(event.target.value)

    if(event.target.value < this.totalPrendas){
      this.calificar = true;
      this.noAgregar = true;
    } else {
      this.calificar = false;
      this.noAgregar = event.target.value == this.totalPrendas;
    }

    //if(this.noAgregar = this.totalPrendas >= this.formulario.get('Muestra').value ? true : false;)
  }

}
