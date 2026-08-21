import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { DatePipe } from "@angular/common";

import { GlobalVariable } from 'src/app/VarGlobals';
import { EventosService } from 'src/app/services/eventos.service';
import { ExceljsService } from 'src/app/services/exceljs.service';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements OnInit {

  displayedColumns: string[] = ['ID', 'NumeroOp', 'Cliente_desc', 'TemCli_nomb', 'cantidad', 'fechaDespacho', 'fechaEmision', 'cod_cliente', 'cod_temcli', 'Ruta']
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataForExcel = [];
  numeroOP: string = '';

  constructor(
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private eventosService: EventosService,
    private datePipe: DatePipe,
    private exceljsService: ExceljsService,
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    //this.numeroOP='4512466204'
    this.onListaOPContratos()
  }

  onListaOPContratos(){
    if (this.numeroOP.length >= 9){
      this.spinnerService.show();
      this.eventosService.listaOPContratos(this.numeroOP)
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

  onExportarRegistro(){
    this.dataForExcel = [];
    if(this.dataSource.filteredData.length > 0){
      let dataReporte: any[] = [];

      this.dataSource.filteredData.forEach((row: any) => {
        let data: any = {};

        data.ID = row.ID
        data.NumeroOp = row.NumeroOp;
        data.Cliente_desc = row.Cliente_desc;
        data.TemCli_nomb = row.TemCli_nomb;
        data.cantidad = row.cantidad;
        data.fechaDespacho = row.fechaDespacho;
        data.fechaEmision = row.fechaEmision;
        data.cod_cliente = row.cod_cliente;
        data.cod_temcli = row.cod_temcli;
        data.Ruta = row.Ruta;
        
        dataReporte.push(data);
      });      

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'Consulta PO Gestion',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);

    } else{
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }        
  }

  limpiarValor() {
    this.numeroOP = '';
    this.dataSource.data = [];
  }
}
