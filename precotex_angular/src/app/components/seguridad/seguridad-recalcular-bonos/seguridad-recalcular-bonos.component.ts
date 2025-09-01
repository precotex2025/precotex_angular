import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { SeguridadUsuariosService } from 'src/app/services/seguridad-usuarios.service';

@Component({
  selector: 'app-seguridad-recalcular-bonos',
  templateUrl: './seguridad-recalcular-bonos.component.html',
  styleUrls: ['./seguridad-recalcular-bonos.component.scss']
})
export class SeguridadRecalcularBonosComponent implements OnInit {

  constructor(private seguridadService: SeguridadUsuariosService, private matSnackBar: MatSnackBar, private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  recalcularAsistencia(){
    const str = new Date().toLocaleString('en-Es', { year: 'numeric', month: '2-digit', day: '2-digit' });
    var dia = str.substring(3, 5);
    var mes = str.substring(0, 2);
    var anio = str.substring(6, 10);
    var totaldia = '20' + '/' +  mes + '/' + anio;

    console.log(totaldia);
    this.spinnerService.show();
    this.seguridadService.recalcularAsistencia(
      totaldia
    ).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.matSnackBar.open('Proceso Correcto...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
     
      },
      (err: HttpErrorResponse) =>
      {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      })
    })

  }

  recalcularPagoBono(){
    const str = new Date().toLocaleString('en-Es', { year: 'numeric', month: '2-digit', day: '2-digit' });
    var dia = str.substring(3, 5);
    var mes = str.substring(0, 2);
    var anio = str.substring(6, 10);
    var totaldia = '25' + '/' +  mes + '/' + anio;

    console.log(totaldia);
    this.spinnerService.show();
    this.seguridadService.app_seg_pago_bono(
      totaldia
    ).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.matSnackBar.open('Proceso Correcto...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
     
      },
      (err: HttpErrorResponse) =>
      {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      })
    })

  }
}
