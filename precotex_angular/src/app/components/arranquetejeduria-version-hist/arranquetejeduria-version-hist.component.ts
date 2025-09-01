import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Console } from 'node:console';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';

import { ArranquetejeduriaService } from 'src/app/services/arranquetejeduria.service';
import { ExceljsService } from 'src/app/services/exceljs.service';

interface data_det {
  turno           : string,
  nom_Usuario     : string,
  fecha_Creacion  : string,
  cod_Maquina_Tejeduria: string,
  cod_Ordtra      : string,
  ser_OrdComp     : string,
  cod_OrdComp     : string,
  estado          : string,
  nom_Cliente     : string,
  observaciones   : string,
}

@Component({
  selector: 'app-arranquetejeduria-version-hist',
  templateUrl: './arranquetejeduria-version-hist.component.html',
  styleUrls: ['./arranquetejeduria-version-hist.component.scss']
})
export class ArranquetejeduriaVersionHistComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(new Date),
    end: new FormControl(new Date),
  });
  
  constructor(
    private arranquetejeduria : ArranquetejeduriaService,
    private SpinnerService: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private exceljsService: ExceljsService
  ) { }

  ngOnInit(): void {
    this.ListadoArranqueTejeduriaHistorial();
  }

  formulario = this.formBuilder.group({
    CodOrdTra:         [''],
  });

  displayedColumns: string[] = [
    'turno'            ,           
    'nom_Usuario'      ,    
    'fecha_Produccion' , 
    'fecha_Creacion'   ,  
    'cod_Maquina_Tejeduria',
    'cod_Ordtra'  ,
    'OrdComp'     ,        
    'estado'      ,         
    'nom_Cliente' ,   
    'fch_Hora_Entrega'    ,
    'diferenciaEnMinutos' ,
    'descripcion_Area'    ,
    'descripcion_Motivo'  ,  
    'observaciones'       , 

  ];
  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataArranqueHist: Array<any> = [];

  dataForExcel: any = [];
  dataSourceExcel: any = [];  

  dataArranqueHistDetail: Array<any> = [];
  dataForExcelDetail: any = [];
  dataSourceExcelDetail: any = [];    

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

  //#region FUNCIONES BASE

  ListadoArranqueTejeduriaHistorial(){
    const sFecIni       : string =  this.range.get('start').value;
    const sFecFin       : string =  this.range.get('end').value;
    const sCodOrdtra    : string = this.formulario.get('CodOrdTra')?.value || "*";


    if (sFecIni == '' || sFecFin == ''){
      this.matSnackBar.open("Seleccione Rango de Fechas.", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;                
    } 


    this.SpinnerService.show();
    this.dataArranqueHist = [];
    this.dataSource.data = this.dataArranqueHist;

    this.arranquetejeduria.getListadoVersionHojasArranqueHist(sFecIni, sFecFin, sCodOrdtra).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){

              this.dataArranqueHist = response.elements;
              this.dataSource.data = this.dataArranqueHist;

            this.SpinnerService.hide();
          }
          else{
            this.SpinnerService.hide();
            //this.dataSource.data = [];
          };
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });    
  }

  exportarExcel() {
    this.SpinnerService.show();

    this.dataForExcel = [];
    this.dataSourceExcel = [];

    if (this.dataArranqueHist.length > 0) {

        this.dataArranqueHist.forEach((item: any) => {


          let fechaMostrada = this.formatearFechaValida(item.fch_Hora_Entrega);
          let fechaCreacion = this.formatearFechaValida(item.fecha_Creacion);
          let fechaProduccion = _moment(item.fecha_Produccion.valueOf()).format('DD/MM/YYYY');

          let datos = {
            ['Turno']: item.turno,
            ['Auditor']: item.nom_Usuario,
            //['Fecha Arranque']: _moment(item.fecha_Creacion.valueOf()).format('DD/MM/YYYY'),
            //['Hora Arranque']: _moment(item.fecha_Creacion.valueOf()).format('HH:MM'),
            ['Fecha_Produccion']: fechaProduccion,
            ['Fecha Arranque']: fechaCreacion,
            ['Maquina']: item.cod_Maquina_Tejeduria,
            ['OT']: item.cod_Ordtra       ,
            ['Orden Pedido']: item.ser_OrdComp + '-' + item.cod_OrdComp,
            ['Estado']: item.estado       ,
            ['Cliente']: item.nom_Cliente ,
            ['Hora Entre. Calidad']: fechaMostrada,
            ['Dif. Minutos']: item.diferenciaEnMinutos,
            ['Area']: item.descripcion_Area       ,
            ['Defecto']: item.descripcion_Motivo  ,
            ['Observaciones']: item.observaciones ,
          };
          this.dataForExcel.push(datos);
      });


      if (this.dataForExcel.length > 0) {
        this.dataForExcel.forEach((row: any) => {
          this.dataSourceExcel.push(Object.values(row))
        })

        let reportData = {
          title: 'REPORTE HISTORIAL DE ARRANQUE DE TEJEDURIA',
          data: this.dataSourceExcel,
          headers: Object.keys(this.dataForExcel[0])
        }

        this.exceljsService.exportExcelArranqueHist(reportData);
        
      } else {
        this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        this.SpinnerService.hide();
      }      



    } else {
      this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      this.SpinnerService.hide();
    } 

    this.SpinnerService.hide();

  }

  exportarExcelDetalle() {
    this.SpinnerService.show();

    this.dataForExcelDetail = [];
    this.dataSourceExcelDetail = [];        



    this.SpinnerService.hide();


    const sFecIni       : string =  this.range.get('start').value;
    const sFecFin       : string =  this.range.get('end').value;
    const sCodOrdtra    : string = this.formulario.get('CodOrdTra')?.value || "*";


    if (sFecIni == '' || sFecFin == ''){
      this.matSnackBar.open("Seleccione Rango de Fechas.", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;                
    } 


    this.SpinnerService.show();
    this.dataArranqueHistDetail = [];

    this.arranquetejeduria.getListadoVersionHojasArranqueHistDetail(sFecIni, sFecFin, sCodOrdtra).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){

              this.dataArranqueHistDetail = response.elements;

                if (this.dataArranqueHistDetail.length > 0) {

                    this.dataArranqueHistDetail.forEach((item: any) => {


                      let fechaMostrada = this.formatearFechaValida(item.fch_Hora_Entrega);
                      let fechaCreacion = this.formatearFechaValida(item.fecha_Creacion);
                      let fechaProduccion = _moment(item.fecha_Produccion.valueOf()).format('DD/MM/YYYY');

                      let datos = {
                        ['Turno']: item.turno,
                        ['Auditor']: item.nom_Usuario,
                        //['Fecha Arranque']: _moment(item.fecha_Creacion.valueOf()).format('DD/MM/YYYY'),
                        //['Hora Arranque']: _moment(item.fecha_Creacion.valueOf()).format('HH:MM'),
                        ['Fecha_Produccion']: fechaProduccion,
                        ['Fecha Arranque']: fechaCreacion,
                        ['Maquina']: item.cod_Maquina_Tejeduria,
                        ['OT']: item.cod_Ordtra       ,
                        ['Orden Pedido']: item.ser_OrdComp + '-' + item.cod_OrdComp,
                        ['Estado']: item.estado       ,
                        ['Cliente']: item.nom_Cliente ,
                        ['Hora Entre. Calidad']: fechaMostrada,
                        ['Dif. Minutos']: item.diferenciaEnMinutos,
                        ['Area']: item.descripcion_Area       ,
                        ['Defecto']: item.descripcion_Motivo  ,
                        ['Observaciones']: item.observaciones ,
                      };
                      this.dataForExcelDetail.push(datos);
                  });


                  if (this.dataForExcelDetail.length > 0) {
                    this.dataForExcelDetail.forEach((row: any) => {
                      this.dataSourceExcelDetail.push(Object.values(row))
                    })

                    let reportData = {
                      title: 'REPORTE HISTORIAL DE ARRANQUE DE TEJEDURIA DETALLADO',
                      data: this.dataSourceExcelDetail,
                      headers: Object.keys(this.dataForExcelDetail[0])
                    }

                    this.exceljsService.exportExcelArranqueHist(reportData);
                    
                  } else {
                    this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                    this.SpinnerService.hide();
                  }      
                } else {
                  this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                  this.SpinnerService.hide();
                } 

              this.SpinnerService.hide();
          }
          else{
            this.SpinnerService.hide();
            //this.dataSource.data = [];
          };
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });    

  }

  formatearFechaValida(fecha: string): string {
    if (!fecha || fecha.startsWith('1900-01-01T00:00:00')) {
      return '';
    }

    const f = new Date(fecha);

    const dia = f.getDate().toString().padStart(2, '0');
    const mes = (f.getMonth() + 1).toString().padStart(2, '0'); // Mes empieza en 0
    const anio = f.getFullYear();

    const horas = f.getHours().toString().padStart(2, '0');
    const minutos = f.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }  
  //#endregion

}
