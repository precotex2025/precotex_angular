import { Component, OnInit, AfterViewInit, inject,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { startWith, map,Observable } from 'rxjs';
import { LiquidacionCorteService } from '../../../services/liquidacion-corte.service';
import { GlobalVariable } from '../../../VarGlobals'; //<==== this one
import { DialogModificaTelasComponent } from './dialog-modifica-telas/dialog-modifica-telas.component';
import { DialogObservacionesCorteComponent } from './dialog-observaciones-corte/dialog-observaciones-corte.component';
import { Router } from '@angular/router';
//verListaLiquidacionCorte

interface data{
  Cod_op: string
  Cod_Grupo: string
}

interface Food {
  value: string;
  viewValue: string;
}

interface data_det {
  COD_TIPORDTRA:string,
  COD_ORDTRA:string,
  COD_ALMACEN:string,
  COLOR:string,
  PARTIDA:string,
  COD_TELA:string,
  TELA:string,
  ATENDIDA: string,
  DEVUELTA_A_ALMACEN:string,
  KGS_CONSUMIDO:string,
  STATUS_LIQ: string,
  STOCK_ALMACEN:string

}

@Component({
  selector: 'app-liquidacion-corte',
  templateUrl: './liquidacion-corte.component.html',
  styleUrls: ['./liquidacion-corte.component.scss']
})
export class LiquidacionCorteComponent implements OnInit {

  foods: Food[] = [
    {value: 'I', viewValue: 'Individual'},
    {value: 'A', viewValue: 'Agrupado'},
  ];


  //'COD_TIPORDTRA', 'COD_ALMACEN','PARTIDA',
  displayedColumns: string[] = ['COD_ORDTRA','COD_TELA','TELA', 'COLOR', 'ATENDIDA', 'DEVUELTA_A_ALMACEN', 'KGS_CONSUMIDO', 
  'STATUS_LIQ','STOCK_ALMACEN', 'Acciones']
  dataSource: MatTableDataSource<data_det>;

  constructor(private formBuilder: FormBuilder,
                      private matSnackBar: MatSnackBar,
                      private dialog: MatDialog,
                      private _router:Router,
                      private despachoTelaCrudaService: LiquidacionCorteService) { this.dataSource = new MatTableDataSource(); }

  formulario = this.formBuilder.group({Cod_op: [''],Cod_Grupo: ['I']})

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.CargarLista()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };

  }

  CargarLista() {
    //let fec_despacho = this.formulario.value['Fec_Registro'];

    if(this.formulario.get('Cod_op')?.value!='' && this.formulario.get('Cod_Grupo')?.value!='')
    {
      GlobalVariable.Cod_op=this.formulario.get('Cod_op')?.value
      GlobalVariable.Cod_Grupo=this.formulario.get('Cod_Grupo')?.value
    } else if (GlobalVariable.Cod_op!="" && GlobalVariable.Cod_Grupo!="") {
      this.formulario.get('Cod_op')?.setValue(GlobalVariable.Cod_op);
      this.formulario.get('Cod_Grupo')?.setValue(GlobalVariable.Cod_Grupo);
    }

    console.log(GlobalVariable.Cod_op,GlobalVariable.Cod_Grupo);

    let fec_despacho = new Date('2022-09-20').toString();
    fec_despacho = moment(fec_despacho).format('YYYY-MM-DDTHH:mm:ss');
    console.log(fec_despacho);
    if(GlobalVariable.Cod_op!="" && GlobalVariable.Cod_Grupo!="") {
      this.despachoTelaCrudaService.verListaLiquidacionCorte(GlobalVariable.Cod_op,
        GlobalVariable.Cod_Grupo).subscribe(
          (result: any) => {
            //this.data_det = result
            this.dataSource.data = result
            this.matSnackBar.open('DATOS ENCONTRADOS', 'Cerrar', {
              duration: 1500,
            })

          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))
    }

  }

  buscarReporteControlVehiculos(){
  }
  generateExcel() {
  }
  clearDate(event) {
    event.stopPropagation();

  }

  openObservaciones(Cod_tela){

  }

  openDialog(data) {

    //let Cod_op=this.formulario.controls.Cod_op
    //let Cod_Grupo=this.formulario.controls.Cod_Grupo

    //let Cod_op=this.formulario.get('Cod_op')?.value
    //let Cod_Grupo=this.formulario.get('Cod_Grupo')?.value


    GlobalVariable.Cod_op=this.formulario.get('Cod_op')?.value
    GlobalVariable.Cod_Grupo=this.formulario.get('Cod_Grupo')?.value
    GlobalVariable.Cod_Tela= data.COD_TELA;
    console.log(data);

    let datos = {
      kgs_devueltos:  data.DEVUELTA_A_ALMACEN,
      kgs_consumido:  data.KGS_CONSUMIDO,
      status_liq:  data.STATUS_LIQ,
      kgs_atendidos:  data.ATENDIDA,
      COD_COLOR: data.COD_COLOR,
      COD_COMB: data.COD_COMB,
      COD_ORDTRA: data.COD_ORDTRA,
      COD_TIPORDTRA: data.COD_TIPORDTRA
    };

    GlobalVariable.Kgs_Tela = datos;

    //let Cod_op='F2184'
    //let Cod_Grupo='I'


    /*let dialogRef = this.dialog.open(DialogModificaTelasComponent, {
     disableClose: true,
     data: {op:Cod_op,grupo:Cod_Grupo,tela:Cod_tela }
    });

   dialogRef.afterClosed().subscribe(result => {

     if (result == 'false') {
       //this.CargarOperacionConductor()
      // this.MostrarCabeceraVehiculo()
     }

   })*/

 }


 verObservaciones(){
  if(this.formulario.get('Cod_op')?.value != '' && this.formulario.get('Cod_Grupo')?.value != ''){
    let dialogRef = this.dialog.open(DialogObservacionesCorteComponent, {
      disableClose: true,
      minWidth: '400px',
      panelClass: 'my-class',
      data: {
        OC: this.formulario.get('Cod_op')?.value,
        Tipo: this.formulario.get('Cod_Grupo')?.value
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
  
      
  
    })
  }else{
    this.matSnackBar.open('Debes ingresar la OC y el Tipo', 'Cerrar', {
      duration: 1500,
    })
  }
  
 }

 verAvances(){
  if(this.formulario.get('Cod_op')?.value != '' && this.formulario.get('Cod_Grupo')?.value != ''){
    let datos = {
      oc:this.formulario.get('Cod_op')?.value,
      tipo: this.formulario.get('Cod_Grupo')?.value
    }
    this._router.navigate(['ver-avances'], {skipLocationChange:true, queryParams: datos});
  }else{
    this.matSnackBar.open('Debes ingresar la OC y el Tipo', 'Cerrar', {
      duration: 1500,
    })
  }
 }

 verRatioConsumo(){
  if(this.formulario.get('Cod_op')?.value != '' && this.formulario.get('Cod_Grupo')?.value != ''){
    let datos = {
      oc:this.formulario.get('Cod_op')?.value,
      tipo: this.formulario.get('Cod_Grupo')?.value
    }
    this._router.navigate(['ver-ratio-consumo'], {skipLocationChange:true, queryParams: datos});
  }else{
    this.matSnackBar.open('Debes ingresar la OC y el Tipo', 'Cerrar', {
      duration: 1500,
    })
  }
 }

 validarOC(event){
  var cod_op = event.target.value;
  if(cod_op.length == 5){
    this.CargarLista();
  }
 }

}
