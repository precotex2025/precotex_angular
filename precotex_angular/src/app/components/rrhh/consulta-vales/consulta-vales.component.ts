import { Component, OnInit,ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import * as _moment from 'moment';

import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-consulta-vales',
  templateUrl: './consulta-vales.component.html',
  styleUrls: ['./consulta-vales.component.scss']
})
export class ConsultaValesComponent implements OnInit {

  displayedColumns: string[] = ['c_nume_dni', 'c_nomb_trab', 'c_peri_plan', 'c_nume_refe', 'n_impo_plan', 'c_esta_regi', 'moc_numdocrf1', 'moc_fechdocu', 'n_sald_cuen', 'canje']
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ld_fecha: Date = new Date;
  lc_numDoc: string = "";
  ln_numAno: number = 0;

  constructor(
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private eventosService: EventosService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.ln_numAno = this.ld_fecha.getFullYear();
  }

  onBuscarVale(){
    if (this.lc_numDoc.length >= 8){
      this.spinnerService.show();
      this.eventosService.listaVale(this.ln_numAno, this.lc_numDoc)
        .subscribe((result: any) => {
          if (result.length > 0) {
            this.dataSource = new MatTableDataSource(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.spinnerService.hide();
          }else{
            this.dataSource.data = [];
            this.matSnackBar.open('No se encontró registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.spinnerService.hide();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      );

    }

  }

  limpiarValor() {
    this.lc_numDoc = '';
    this.dataSource.data = [];
  }

}
