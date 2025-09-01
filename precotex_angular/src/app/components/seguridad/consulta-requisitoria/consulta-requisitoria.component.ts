import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalVariable } from 'src/app/VarGlobals';

import { SeguridadVisitasService } from 'src/app/services/seguridad-visitas.service';

@Component({
  selector: 'app-consulta-requisitoria',
  templateUrl: './consulta-requisitoria.component.html',
  styleUrls: ['./consulta-requisitoria.component.scss']
})
export class ConsultaRequisitoriaComponent implements OnInit {

  numDocumento: string = "";
  dataRequisitoria: Array<any> = [];

  constructor(
    private matSnackBar: MatSnackBar,
    private seguridadVisitasService: SeguridadVisitasService,
  ) { }

  ngOnInit(): void {
  }

  validarDocumento(){
    if (this.numDocumento.length >= 8){
      this.seguridadVisitasService.segConsultaRequisitoria(this.numDocumento)
        .subscribe((result: any) => {
          if (result && result.length > 0){
            this.dataRequisitoria = result;
            Swal.fire('Usuario con requisitoria', '', 'warning')
          } else {
            this.dataRequisitoria = [];
            Swal.fire('No existe requisitoria', '', 'success')
          }
        },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
        });

    }

  }

  registrarSeguridad(){}

  limpiarValor() {
    this.numDocumento = '';
    this.dataRequisitoria = [];
  }

}
