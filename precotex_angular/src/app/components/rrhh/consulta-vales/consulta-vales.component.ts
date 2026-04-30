import { Component, OnInit,ViewChild } from '@angular/core';
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
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';

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

  dataTipo: any[] = [
    {tipo: 0, des_tipo: "TODO"},
    {tipo: 1, des_tipo: "GRATIFICACION"},
    {tipo: 3, des_tipo: "LIQUIDACION"}
  ];

  dataEstado: any[] = [
    {estado: '', des_estado: "TODO"},
    {estado: 'P', des_estado: "PENDIENTE"},
    {estado: 'C', des_estado: "COBRADO"}
  ];

  dataForExcel = [];
  ld_fecha: Date = new Date;
  ln_tipo: number = 0;
  lc_estado: string = "";
  lc_numDoc: string = "";
  ln_numAno: number = 0;
  ll_super: boolean = false;

  constructor(
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private eventosService: EventosService,
    private datePipe: DatePipe,
    private exceljsService: ExceljsService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {    
    this.validarCRUDUsuario(243);
  }

  onBuscarVale(){
    let ll_busca: boolean = false;

    if(this.ll_super){
      ll_busca = true;
    }

    if(!this.ll_super && this.lc_numDoc.length >= 8){
      ll_busca = true;
    }

    if (ll_busca){
      this.spinnerService.show();
      this.eventosService.listaVale(this.ln_tipo, this.ln_numAno ? this.ln_numAno : 0, this.lc_numDoc, this.lc_estado)
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

        data.NroDocumento = row.c_nume_dni
        data.NombreTrabajador = row.c_nomb_trab;
        data.Periodo = row.c_peri_plan;
        data.Referencia = row.c_nume_refe;
        data.Importe = row.n_impo_plan;
        data.Estado = row.c_esta_regi == 'P' ? 'PENDIENTE' : 'CANCELADO';
        data.DocumentoCanje = row.moc_numdocrf1;
        data.FechaCanje = this.datePipe.transform(row.moc_fechdocu, 'dd/MM/yyyy');
        data.Saldo = row.n_sald_cuen;
        data.Lugar = row.canje;
        
        dataReporte.push(data);
      });      

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'CONSULTA VALES',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);

    } else{
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }        
  }

  limpiarValor() {
    this.lc_numDoc = '';
    this.dataSource.data = [];
  }

  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;
        if(crud.length > 0){
          this.ll_super = crud[0].Flg_Todo == 1 ? true : false;
        }

        if(!this.ll_super)
          this.ln_numAno = this.ld_fecha.getFullYear();
      });
  }  

}
