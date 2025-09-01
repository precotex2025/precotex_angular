import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import * as moment from 'moment';
import { FormBuilder } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
//import { DialogTiemposImproductivosComponent } from '../tiempos-improductivos/dialog-tiempos-improductivos/dialog-tiempos-improductivos.component';
import { startWith, map,Observable } from 'rxjs';
import { DialogLiquidacionCorteService } from '../../../../services/dialog-liquidacion-corte.service';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { ThisReceiver } from '@angular/compiler';


export interface data_det {
  SECUENCIA: string
  LARGOTENDIDOMTS: string
  PESOXPANOKGS: string
  PRENDASXPANO: string
  NUM_PANOS: string
  CONSKGSNETO: string
  CONSKGSNETOPROM: string
  CONSMETROSNETO: string
  CONSMETROSNETOPROM: string
  LARGOTENDIDOREALPROM: string
  PESOPANOPROM: string
  PRENDAS: string
  TOTALPANOS: string
  TOTALPRENDAS: string
  Accion:string
}

export interface data{
  op: string
  grupo: string
  tela: string
  dato: string
}

@Component({
  selector: 'app-dialog-detalles-corte',
  templateUrl: './dialog-detalles-corte.component.html',
  styleUrls: ['./dialog-detalles-corte.component.scss']
})
export class DialogDetallesCorteComponent implements OnInit {


  element = false;
  codcombo=''
  codcolor=''
  codordtra=''
  codtipoordtra=''
  /*,  ConskgsNeto:['0'],  ConskgsNetoProm:['0'],  ConsMetrosNeto:['0'],  ConsMetrosNetoProm:['0'],  LTendidoRealProm:['0'],
  PesoPanoProm:['0'],  Prendas:['0'],  TotalPanos:['0'] */
  formulario = this.formBuilder.group({Secuencia:['0'],LTendidoMts:['0'],PesoxPanoKgs:['0'],PrendasxPano:['0'],
  num_panos:['0'],anchotizado:['0'],anchototalreal:['0']})

  public data_det = [{
    SECUENCIA:"",
    LARGOTENDIDOMTS:"",
    PESOXPANOKGS:"",
    PRENDASXPANO:"",
    NUM_PANOS:"",
    CONSKGSNETO:"",
    CONSKGSNETOPROM:"",
    CONSMETROSNETO:"",
    CONSMETROSNETOPROM:"",
    LARGOTENDIDOREALPROM:"",
    PESOPANOPROM:"",
    PRENDAS:"",
    TOTALPANOS:"",
    TOTALPRENDAS:"",
      Accion:""
  }]

  displayedColumns: string[] = [
    'SECUENCIA',
    'LARGOTENDIDOMTS',
    'PESOXPANOKGS',
    'PRENDASXPANO',
    'NUM_PANOS',
    'CONSKGSNETO',
    'CONSKGSNETOPROM',
    'CONSMETROSNETO',
    'CONSMETROSNETOPROM',
    'LARGOTENDIDOREALPROM',
    'PESOPANOPROM',
    'PRENDAS',
    'TOTALPANOS',
    'TOTALPRENDAS'
    ,'Acciones']

    dataSource: MatTableDataSource<data_det>;
    columnsToDisplay: string[] = this.displayedColumns.slice();
    clickedRows = new Set<data_det>();

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private despachoTelaCrudaService: DialogLiquidacionCorteService, @Inject(MAT_DIALOG_DATA) public data: data) { this.dataSource = new MatTableDataSource(); }

    @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    console.log(this.data)
  }


  cargarGrillaDetalle() {

    /*console.log(this.data.op)
    console.log(this.data.grupo)
    console.log(this.data.tela)*/

    console.log(this.data)
    console.log(GlobalVariable.Cod_op)
    console.log(GlobalVariable.Cod_Grupo)
    console.log(GlobalVariable.Cod_Tela)
    console.log(GlobalVariable.Dato)
    let codtizado=GlobalVariable.Dato


    /*if (codtizado!="") {
      this.despachoTelaCrudaService.verGrillaDetalles(this.data.op,this.data.dato,this.data.grupo).subscribe(
        (result: any) => {
          this.dataSource.data = result
          console.log(this.dataSource.data);


           // this.mostrar()

          //console.log(this.dataSource.data);
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    } else {
      this.matSnackBar.open("Error: Codigo Tizado No Existe!!", 'Cerrar', {
        duration: 1500,
      })
    }*/
  }

  grabarDatosGrilla2() {

    let Secuencia=this.formulario.get('Secuencia').value
    let LTendidoMts=this.formulario.get('LTendidoMts').value
    let PesoxPanoKgs=this.formulario.get('PesoxPanoKgs').value
    let PrendasxPano=this.formulario.get('PrendasxPano').value
    let num_panos=this.formulario.get('num_panos').value

    console.log(GlobalVariable.Cod_op)
    console.log(GlobalVariable.Cod_Grupo)
    //let codtizado=this.formulario.get('tizado')?.value
    let codtizado=this.data.dato
    let tizado = codtizado.substring(0,3);
    console.log('Tizado: '+codtizado+'Secuencia: '+Secuencia+'LTendidoMts:'+LTendidoMts+'PesoxPanoKgs:'+PesoxPanoKgs+'PrendasxPano:'+PrendasxPano+'num_panos:'+num_panos)

    this.despachoTelaCrudaService.guardarDetalleGrilla2('I',GlobalVariable.Cod_op,tizado,Secuencia,LTendidoMts,PesoxPanoKgs,PrendasxPano,num_panos,GlobalVariable.Cod_Grupo).subscribe(
      (result: any) => {
        console.log(result[0].RESPUESTA);
        this.matSnackBar.open(result[0].RESPUESTA, 'Cerrar', {
          duration: 1500,
        })
        if(result[0].RESPUESTA == 'OK'){
          this.dialog.closeAll()
        }
        

        //console.log(this.dataSource.data);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))



  }

}
