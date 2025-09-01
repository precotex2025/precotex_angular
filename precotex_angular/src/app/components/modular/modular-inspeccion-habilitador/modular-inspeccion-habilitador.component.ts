import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InspeccionPrendaService } from 'src/app/services/modular/inspeccion-prenda.service';
import { DialogConfirmarHabilitadorComponent } from './dialog-confirmar-habilitador/dialog-confirmar-habilitador.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';


interface Modulo {
  Cod_Modulo: string;
  Des_Modulo: string;
}

@Component({
  selector: 'app-modular-inspeccion-habilitador',
  templateUrl: './modular-inspeccion-habilitador.component.html',
  styleUrls: ['./modular-inspeccion-habilitador.component.scss']
})
export class ModularInspeccionHabilitadorComponent implements OnInit {
  Id = 0
  Tipo_Sub_Proceso = ''
  Des_Tipo_Proceso = ''

  //flg para dar clase css cuando es reproceso o proceso normal
  grid_border = ' border: 1px solid #337ab7;'
  background = 'background-color: #2962FF; border: 1px solid #2962FF;'
  btn_background = 'background-color: #2962FF; color: #ffffff;'

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Modulo: [''],
    Ticket: ['']
  })

  ImagePath = 'http://192.168.1.36/Estilos/default.jpg'

  listar_operacionModulo: Modulo[] = [];
  porFinalizar: Array<any> = [];
  constructor(private formBuilder: FormBuilder, private matSnackBar: MatSnackBar, private inspeccionPrendaService: InspeccionPrendaService, public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.MuestraModulo();
    this.formulario.get('Ticket').disable();
  }

  MuestraModulo() {
    this.inspeccionPrendaService.CF_MUESTRA_MODULO(
    ).subscribe(
      (result: any) => {
        this.listar_operacionModulo = result;
        this.listar_operacionModulo = this.listar_operacionModulo.filter(elem => {
          return elem.Cod_Modulo != '00R'
        });
      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 5000,
          verticalPosition:'top'
        })
      })

  }

  changeModulo(event) {
    console.log(event);
    if (event.value != '') {
      this.formulario.get('Ticket').enable();
    }
  }

  finalizarRecojo() {
    console.log(this.porFinalizar);
    if (this.porFinalizar.length > 0) {
      if (confirm('Esta seguro(a) de finalizar el recojo de prendas?')) {
        this.SpinnerService.show();
        this.inspeccionPrendaService.CF_MODULAR_GUARDAR_RECOJO_PRENDA(
          this.porFinalizar
        ).subscribe(
          (result: any) => {
            console.log(result);
            this.SpinnerService.hide();
            if (result['msg'] == 'OK') {
              this.matSnackBar.open('Se guardo correctamente el registro.', 'Cerrar', {
                duration: 5000,
                verticalPosition:'top'
              });
              this.porFinalizar = [];
            } else {
              this.matSnackBar.open('Ha ocurrido un error.', 'Cerrar', {
                duration: 5000,
                verticalPosition:'top'
              });
            }
          },
          (err: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 5000,
              verticalPosition:'top'
            })
          })
      }
    }
  }

  eliminarAuditoria(item) {
    if (confirm('Esta seguro(a) de eliminar?')) {
      this.porFinalizar = this.porFinalizar.filter(element => {
        return element.Id_Numero_Prenda != item.Id_Numero_Prenda
      });
    }
  }

  changeTicket() {
    var ticket = this.formulario.get('Ticket').value;
    var modulo = this.formulario.get('Modulo').value;
    if (ticket.length >= 11) {
      this.SpinnerService.show();
      this.inspeccionPrendaService.CF_MODULAR_INSPECCION_RECOJO_PRENDA(
        modulo, ticket
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          if (result[0].Id_Numero_Prenda == 0) {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
              duration: 5000,
              verticalPosition:'top'
            })
          } else {
            var Cod_OrdPro = result[0]['COD_ORDPRO'];
            var DES_PRESENT = result[0]['DES_PRESENT'];
            var COD_TALLA = result[0]['COD_TALLA'];
            var ImagePath = result[0]['ICONO_WEB'];

            var Cantidad = 0;
            result.forEach(element => {
              Cantidad += element.PRENDAS_RECOGER;
            });
            let dialogRef = this.dialog.open(DialogConfirmarHabilitadorComponent,
              {
                disableClose: true,
                panelClass: 'my-class',
                data: {
                  Ticket: ticket,
                  Cod_Ordpro: Cod_OrdPro,
                  Des_Present: DES_PRESENT,
                  Prendas_Recoger: Cantidad,
                  Cod_Talla: COD_TALLA,
                  ImagePath: ImagePath
                }
              });
            this.formulario.controls['Ticket'].setValue('')
            let index = 0;
            dialogRef.afterClosed().subscribe(res => {
              if (res == true) {

                if (this.porFinalizar.length == 0) {
                  result.forEach(element => {
                    this.porFinalizar.push(element);
                    index++;
                  });
                } else {
                  var array = [];
                  array = this.porFinalizar.filter(element => {
                    return element.Id_Modular_Inspeccion_Prenda == result[0].Id_Modular_Inspeccion_Prenda
                  });
                  console.log(array);

                  if (array.length == 0) {
                    result.forEach(element => {
                      this.porFinalizar.push(element);
                      index++;
                    });
                  } else {
                    this.matSnackBar.open('Ya has agregado las prendas de este ticket anteriormente!', 'Cerrar', {
                      duration: 5000,
                      verticalPosition:'top'
                    });
                  }

                }


              }
            });
          }
        },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 5000,
            verticalPosition:'top'
          });
          this.SpinnerService.hide();
        })
    }


  }

}