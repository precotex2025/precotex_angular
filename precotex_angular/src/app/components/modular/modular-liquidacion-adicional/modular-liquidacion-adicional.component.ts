import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { LiquidadorTransitoService } from 'src/app/services/modular/liquidador-transito.service';


interface data_det {
  Ticket: string,
  COD_ORDPRO: string,
  COD_PRESENT: string,
  DES_PRESENT: string,
  COD_TALLA: string,
  Cantidad: string,
  cod_estcli: string,
  Prendas_Disgregada: string,
  NUM_PAQUETE: string
}

@Component({
  selector: 'app-modular-liquidacion-adicional',
  templateUrl: './modular-liquidacion-adicional.component.html',
  styleUrls: ['./modular-liquidacion-adicional.component.scss']
})
export class ModularLiquidacionAdicionalComponent implements OnInit {

  //flg para dar clase css cuando es reproceso o proceso normal
  grid_border = ' border: 1px solid #337ab7;'
  background = 'background-color: #2962FF; border: 1px solid #2962FF;'
  btn_background = 'background-color: #2962FF; color: #ffffff;'

  displayedColumns: string[] = [
    'Ticket',
    'COD_ORDPRO',
    //'COD_PRESENT',
    'DES_PRESENT',
    'COD_TALLA',
    'Cantidad',
    'cod_estcli',
    'NUM_PAQUETE',
    'acciones'
  ];
  Ticket: string = '';
  Num_Movstk: string = '';
  dataSource: MatTableDataSource<data_det>;
  array: Array<any> = [];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  constructor(private matSnackBar: MatSnackBar, private SpinnerService: NgxSpinnerService, private liquidadorTransitoService: LiquidadorTransitoService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
  }


  GuardarCabecera() {
    this.dataSource.data = this.array;
    if (this.Ticket != '') {
      this.SpinnerService.show();
      this.liquidadorTransitoService.CF_Modular_Muestra_Ticket_Inspeccion(
        'A',
        this.Ticket,
        0
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          console.log(this.array);
          if (result[0].status == 1) {
            if (this.array.length == 0) {
              this.array.push(result[0]);
              this.Ticket = '';
            } else {
              var array = this.array.filter(element => {
                return element.Ticket == result[0].Ticket && element.Tipo_Paquete == result[0].Tipo_Paquete;
              });

              var array2 = this.array.filter(element => {
                return element.Tipo_Paquete == result[0].Tipo_Paquete;
              });

              if (array.length == 0 && array2.length > 0) {
                this.array.push(result[0]);
                this.Ticket = '';
              } else {
                this.matSnackBar.open('Ya agregaste el Ticket Anteriormente.', 'Cerrar', {
                  duration: 3000,
                  verticalPosition: 'top'
                });
              }
            }
            this.dataSource.data = this.array;
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top'
            });
          }
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top'
          });
        })
    } else {
      this.matSnackBar.open('Debes ingresar el Ticket por agregar', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }

  realizarMovimiento() {
    if (this.array.length > 0) {
      this.SpinnerService.show();
      var tipoMov = '';
      var Tipo_Paquete = '';
      this.array.forEach(element => {
        Tipo_Paquete = element.Tipo_Paquete;
      });

      if (Tipo_Paquete == '2') {
        tipoMov = 'AD2';
      } else if (Tipo_Paquete = '3') {
        tipoMov = 'AD3';
      }

      this.liquidadorTransitoService.CF_Modular_Liquida_Adicionales(
        'M',
        '',
        0,
        '',
        GlobalVariable.vusu,
        tipoMov
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();

          if (result[0].Respuesta == 'OK') {
            this.Num_Movstk = result[0].Num_Movstk
            this.generarMovimientoPrendas(tipoMov);
          }
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top'
          });
        })
    } else {
      this.matSnackBar.open('Debes agregar al menos un ticket.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }

  generarMovimientoPrendas(tipoMov){
    this.SpinnerService.show();

    var array = [];
    this.array.forEach(element => {
      let datos = {
        Opcion: element.Opcion,
        Ticket: element.Ticket,
        Cantidad: element.Cantidad,
        Num_Movstk: this.Num_Movstk,
        Usuario: GlobalVariable.vusu,
        TipMov: tipoMov
      }
      array.push(datos);
    });


    this.liquidadorTransitoService.CF_Modular_Liquida_Adicionales_Post(
      array
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();

        if (result.msg == 'OK') {
          this.matSnackBar.open('Se realizo el movimiento correctamente', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top'
          });
          this.array = [];
          this.dataSource.data = this.array;
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

  OpenDeleteConfirmacion(data_det: data_det) {
    this.array = this.array.filter(element => {
      return element.Ticket !== data_det.Ticket
    });

    this.matSnackBar.open('Ticket eliminado correctamente.', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top'
    });
    this.dataSource.data = this.array;
  }
}

