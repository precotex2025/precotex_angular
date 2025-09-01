import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { InspeccionPrendaService } from 'src/app/services/modular/inspeccion-prenda.service';

@Component({
  selector: 'app-modular-derivados-control',
  templateUrl: './modular-derivados-control.component.html',
  styleUrls: ['./modular-derivados-control.component.scss']
})
export class ModularDerivadosControlComponent implements OnInit {

  Ticket: string = '';
  Ticket_1: string = '';
  Ticket_2: string = '';
  Ticket_3: string = '';

  constructor(private inspeccionPrendaService: InspeccionPrendaService, private matSnackBar: MatSnackBar, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  changeTicket() {

  }

  registrarMovimiento(tipo) {
    console.log(tipo);
    if (tipo == 'E') {
      if (this.Ticket_1 != '') {
        this.SpinnerService.show();
        this.inspeccionPrendaService.CF_Modular_Control_Ruta_Web(
          this.Ticket_1,
          tipo,
          GlobalVariable.vusu
        ).subscribe(
          (result: any) => {

            this.SpinnerService.hide();
            console.log(result);

            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top'
            });
          },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top'
            });
            this.SpinnerService.hide();
          })
      } else {
        this.matSnackBar.open('Debes ingresar el Ticket a lecturar...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3000 })
      }
    } else if (tipo == 'C') {
      if (this.Ticket != '') {
        this.SpinnerService.show();
        this.inspeccionPrendaService.CF_Modular_Control_Ruta_Web(
          this.Ticket,
          tipo,
          GlobalVariable.vusu
        ).subscribe(
          (result: any) => {

            this.SpinnerService.hide();
            console.log(result);

            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top'
            });
          },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top'
            });
            this.SpinnerService.hide();
          })
      } else {
        this.matSnackBar.open('Debes ingresar el Ticket a lecturar...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3000 })
      }
    } else if (tipo == 'Z') {
      if (this.Ticket_2 != '') {
        if (confirm('Esta seguro(a) de realizar el movimiento?')) {
          this.SpinnerService.show();
          this.inspeccionPrendaService.CF_Modular_Control_Ruta_Web(
            this.Ticket_2,
            tipo,
            GlobalVariable.vusu
          ).subscribe(
            (result: any) => {

              this.SpinnerService.hide();
              console.log(result);

              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
                duration: 3000,
                verticalPosition: 'top'
              });
            },
            (err: HttpErrorResponse) => {
              this.matSnackBar.open(err.message, 'Cerrar', {
                duration: 3000,
                verticalPosition: 'top'
              });
              this.SpinnerService.hide();
            })
        }
      } else {
        this.matSnackBar.open('Debes ingresar el Ticket a lecturar...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3000 })
      }
    }

  }


}
