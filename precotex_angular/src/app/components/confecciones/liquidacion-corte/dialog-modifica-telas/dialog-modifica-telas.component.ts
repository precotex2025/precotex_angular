import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTabGroup } from '@angular/material/tabs';
import * as moment from 'moment';
import {PageEvent} from '@angular/material/paginator';
import { FormBuilder } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
//import { DialogTiemposImproductivosComponent } from '../tiempos-improductivos/dialog-tiempos-improductivos/dialog-tiempos-improductivos.component';
import { DialogDetallesCorteComponent  } from "../dialog-detalles-corte/dialog-detalles-corte.component";
import { startWith, map,Observable, switchMap, catchError } from 'rxjs';
import { DialogLiquidacionCorteService } from '../../../../services/dialog-liquidacion-corte.service';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { ThisReceiver } from '@angular/compiler';
import { merge } from 'jquery';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';

interface myDataArray {
  value: string;
  viewValue: string;
}

interface tizado{
  NUM_TENDIDO: string,
  NUM_PRENDAS_REALES: string
}

export interface valores{
  tela: string
  combo: string
  color:string
  calidad:string
  talla:string
  tizado:string
  pdepuradas:string
  retazos:string
  telafallada:string
  puntas:string
  devolucion1:string
  entrecortes:string
  devolucion2:string
  kaccesorios:string
  retazospaños:string
  kmermalavanderia:string
  puntaspaños:string
  kempalmes:string
  ktelareasig:string
  pppromedio:string
  ptendido:string
}

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
}

@Component({
  selector: 'app-dialog-modifica-telas',
  templateUrl: './dialog-modifica-telas.component.html',
  styleUrls: ['./dialog-modifica-telas.component.scss']
})
export class DialogModificaTelasComponent implements OnInit {
  listar_operacionConductor:  tizado[] = [];
  element = false;
  codcombo=''
  codcolor=''
  codordtra=''
  codtipoordtra=''
  /*,  ConskgsNeto:['0'],  ConskgsNetoProm:['0'],  ConsMetrosNeto:['0'],  ConsMetrosNetoProm:['0'],  LTendidoRealProm:['0'],
  PesoPanoProm:['0'],  Prendas:['0'],  TotalPanos:['0'] */
  formulario = this.formBuilder.group({tela: [],combo: [''],color:[''],calidad:[''],talla:[''],tizado:[''],pdepuradas:[''],retazos:[''],
  telafallada:[''],puntas:[''],devolucion1:[''],entrecortes:[''],devolucion2:[''],kaccesorios:[''],retazospaños:[''],kmermalavanderia:[''],
  puntaspaños:[''],kempalmes:[''],ktelareasig:[''],pppromedio:[''],ptendido:[''],Secuencia:['0'],LTendidoMts:['0'],PesoxPanoKgs:['0'],PrendasxPano:['0'],
  num_panos:['0'],anchotizado:['0'],anchototalreal:['0'], fec_liquidacion: [''], cod_motivo: [''], prendas_reales: ['']})

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
  prendas_reales = '';
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
  'TOTALPRENDAS',
  'Acciones'
  ]
  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();
    
  length:number;

  cod_Combo = '';
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  vcod_op: string = '';
  vcod_grupo: string = '';
  dataObservaciones:Array<any> = [];
  kgs_devueltos: string = '';
  kgs_atendidos: string = '';
  kgs_consumidos: string = '';
  status_liq: string = '';
  deshabilitar:boolean = true;
  // MatPaginator Output
  pageEvent: PageEvent;
  @ViewChild('Depuradas') depuradas!: ElementRef;
  @ViewChild('Retazos') retazos!: ElementRef;
  @ViewChild('Fallada') fallada!: ElementRef;
  @ViewChild('Puntas') puntas!: ElementRef;
  @ViewChild('Devolucion1') devolucion1!: ElementRef;
  @ViewChild('Entrecortes') entrecortes!: ElementRef;
  @ViewChild('Devolucion2') devolucion2!: ElementRef;
  @ViewChild('Accesorios') accesorios!: ElementRef;
  @ViewChild('Paños') paños!: ElementRef;
  @ViewChild('Lavanderia') lavanderia!: ElementRef;
  @ViewChild('PuntasPaños') puntaspaños!: ElementRef;
  @ViewChild('Kempalmes') kempalmes!: ElementRef;
  @ViewChild('Ktelareasig') ktelareasig!: ElementRef;
  @ViewChild('Pppromedio') pppromedio!: ElementRef;
  @ViewChild('PAtendido') patendido!: ElementRef;
  @ViewChild('Anchotizado') anchotizado!: ElementRef;
  @ViewChild('Anchototalreal') anchototalreal!: ElementRef;
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private despachoTelaCrudaService: DialogLiquidacionCorteService) { this.dataSource = new MatTableDataSource(); 
      
    }

    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    console.log(GlobalVariable.Cod_op)
    console.log(GlobalVariable.Cod_Grupo)
    this.vcod_op = GlobalVariable.Cod_op;
    this.vcod_grupo = GlobalVariable.Cod_Grupo;

    this.kgs_devueltos = GlobalVariable.Kgs_Tela.kgs_devueltos;
    this.kgs_atendidos = GlobalVariable.Kgs_Tela.kgs_atendidos;
    this.kgs_consumidos = GlobalVariable.Kgs_Tela.kgs_consumido;
    this.status_liq = GlobalVariable.Kgs_Tela.status_liq;
    this.cargarDatos();
    this.cargarObservaciones();
  }
  loadData() {
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

  myDataArray: myDataArray[] = [
    {value: 'individual', viewValue: 'Individual'},
    {value: 'agrupado', viewValue: 'Agrupado'},
  ];

  cargarObservaciones(){
    this.despachoTelaCrudaService.verMotivosLiquidacionWeb().subscribe((res:any) => {
      this.dataObservaciones = res;

    }, (err: HttpErrorResponse) =>
      this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  cargarDatos() {

    /*console.log(this.data.op)
    console.log(this.data.grupo)
    console.log(this.data.tela)*/

    this.codcolor = GlobalVariable.Kgs_Tela.COD_COLOR
    this.codcombo = GlobalVariable.Kgs_Tela.COD_COMB
    this.codordtra = GlobalVariable.Kgs_Tela.COD_ORDTRA
    this.codtipoordtra = GlobalVariable.Kgs_Tela.COD_TIPORDTRA
    console.log(GlobalVariable.Cod_op)
    console.log(GlobalVariable.Cod_Grupo)
    console.log(GlobalVariable.Cod_Tela)
    //this.data.op,this.data.grupo,this.data.tela

    this.despachoTelaCrudaService.verDetalleLiquidacionCorte(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.codcombo,this.codcolor,GlobalVariable.Cod_Grupo)
    .subscribe(
        (result: any) => {


          //this.data_det = result
          //this.dataSource.data = result

          console.log(result[0]);

          this.formulario.get('tela').setValue(result[0].TELA.replace(/\s{2,}/g, ' ').trim())
          this.formulario.get('combo').setValue(result[0].COMBO.replace(/\s{2,}/g, ' ').trim())
          this.formulario.get('color').setValue(result[0].COLOR.replace(/\s{2,}/g, ' ').trim())
          this.formulario.get('calidad').setValue(result[0].CALIDAD.replace(/\s{2,}/g, ' ').trim())
          this.formulario.get('talla').setValue(result[0].TALLA.replace(/\s{2,}/g, ' ').trim())
          this.cod_Combo = result[0]['COD_COMB'];

          var fec_liquidacion = "";
          if(result[0].FEC_LIQUIDACION_CORTE == null || result[0].FEC_LIQUIDACION_CORTE == 'null'){
            fec_liquidacion = "";
          }else{
            fec_liquidacion = result[0].FEC_LIQUIDACION_CORTE;
          }
          this.formulario.patchValue({
            fec_liquidacion: fec_liquidacion,
            cod_motivo: result[0].COD_MOTIVO_LIQUIDADO
          });


          this.formulario.get('pdepuradas').setValue( parseFloat(result[0].DEPURADAS).toFixed(2));
          this.formulario.get('puntas').setValue(result[0].PUNTAS)
          this.formulario.get('retazos').setValue( parseFloat(result[0].RETAZOS).toFixed(2))
          this.formulario.get('devolucion1').setValue(parseFloat(result[0].DEV_1ERA).toFixed(2))
          this.formulario.get('entrecortes').setValue(parseFloat(result[0].ENTRECORTES).toFixed(2))
          this.formulario.get('devolucion2').setValue(parseFloat(result[0].DEV_2DA).toFixed(2))
          this.formulario.get('kaccesorios').setValue(parseFloat(result[0].KGS_ACCESORIOS).toFixed(2))
          this.formulario.get('retazospaños').setValue(parseFloat(result[0].RETAZOS_PANOS).toFixed(2))
          this.formulario.get('kmermalavanderia').setValue(parseFloat(result[0].MERMA_LAVANDERIA).toFixed(2))
          this.formulario.get('puntaspaños').setValue(parseFloat(result[0].PUNTAS_PANOS).toFixed(2))
          this.formulario.get('kempalmes').setValue(result[0].KGS_EMPALMES != null ? parseFloat(result[0].KGS_EMPALMES).toFixed(2) : 0)
          this.formulario.get('ktelareasig').setValue(result[0].KGS_TELA_RECUPERADA != null ? parseFloat(result[0].KGS_TELA_RECUPERADA).toFixed(2) : 0)
          
          this.formulario.get('anchotizado').setValue(result[0].CAN_ANCHOTIZADO != null ? parseFloat(result[0].CAN_ANCHOTIZADO).toFixed(2) : 0)
          this.formulario.get('anchototalreal').setValue(parseFloat(result[0].ANCHO_TOTAL_REAL).toFixed(2))
          this.formulario.get('telafallada').setValue(parseFloat(result[0].TELA_FALLADA).toFixed(2))


          this.formulario.get('pppromedio').setValue(result[0].PESO_POR_PANO.replace(/\s{2,}/g, ' ').trim())
          this.formulario.get('ptendido').setValue(result[0].NUM_PANOS_TENDIDOS)



          this.formulario.get('tela').disable();
          this.formulario.get('combo').disable();
          this.formulario.get('color').disable();
          this.formulario.get('calidad').disable();
          this.formulario.get('talla').disable();


          //result[0].NUM_PA,NOS_TENDIDOS

          this.codcombo=result[0].COMBO.replace(/\s{2,}/g, ' ').trim()
          this.codcolor=result[0].COD_COLOR.replace(/\s{2,}/g, ' ').trim()
          this.codordtra=result[0].COD_ORDTRA.replace(/\s{2,}/g, ' ').trim()
          this.codtipoordtra=result[0].COD_TIPORDTRA.replace(/\s{2,}/g, ' ').trim()



          this.CargarTizado(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,result[0].COD_COMB
            ,this.codcolor,GlobalVariable.Cod_Grupo)
          this.cargarGrillaDetalle();
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
        
        /*this.despachoTelaCrudaService.verGrillaDetalles(this.data.op,'001',this.data.grupo).subscribe(
          (result: any) => {
            this.dataSource.data = result
            console.log(this.dataSource.data);
            //console.log(this.dataSource.data);
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))*/

  }

  openDialog() {
    let codtizado=this.formulario.get('tizado')?.value
    let dialogRef = this.dialog.open(DialogDetallesCorteComponent, {
      disableClose: true,
      panelClass: 'fullscreen-dialog',
      direction:'ltr',
      width: '45vw',
      height: '45vh',
      data: {op:GlobalVariable.Cod_op,dato:codtizado,grupo:GlobalVariable.Cod_Grupo,tela:GlobalVariable.Cod_Tela }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.cargarGrillaDetalle()
      if (result == 'false') {
        this.cargarGrillaDetalle()
        this.CargarConformidad(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.codcombo,this.codcolor, this.formulario.get('calidad')?.value ,GlobalVariable.Cod_Grupo);
      }
    })
  }
  seleccionTizado(listar_origen){
    console.log(listar_origen);
    this.prendas_reales = listar_origen.NUM_PRENDAS_REALES;
  }
  cargarGrillaDetalle(dato=null) {
    console.log(dato);
    /*console.log(this.data.op)
    console.log(this.data.grupo)
    console.log(this.data.tela)*/

    console.log(GlobalVariable.Cod_op)
    console.log(GlobalVariable.Cod_Grupo)
    console.log(GlobalVariable.Cod_Tela)
    let codtizado=this.formulario.get('tizado')?.value
    let conSubstring = codtizado.substring(1, 3);
    
    console.log('recorte: ' + conSubstring);
    console.log('recorte: ' + codtizado);
    if (dato!=null) {
      codtizado=dato
    }

    
    /*
        --aqui el dialog
        let dialogRef = this.dialog.open(DialogDetallesCorteComponent, {
        disableClose: false,
        data: {op:GlobalVariable.Cod_op,dato:codtizado,grupo:GlobalVariable.Cod_Grupo,tela:GlobalVariable.Cod_Tela }
      });


      dialogRef.afterClosed().subscribe(result => {

        if (result == 'false') {

        }
      })
    */

   if (codtizado!="") {
    let tizado = codtizado.substring(0,3); 
      this.despachoTelaCrudaService.verGrillaDetalles(GlobalVariable.Cod_op,tizado,GlobalVariable.Cod_Grupo).subscribe(
        (result: any) => {
          let nregistros=result.length
          this.dataSource.data = result
          console.log(this.dataSource.data);
          this.length= this.dataSource.data.length;

            this.mostrar()
            this.dataSource.paginator = this.paginator;
          console.log(this.paginator);
          //console.log(this.dataSource.data);
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    }
  }
  keyTeclaEnter(caja){
    
    if(caja == 'Retazos'){
      
      this.puntas.nativeElement.focus();
      this.puntas.nativeElement.select();
      this.CargarConformidad(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.codcombo,this.codcolor, this.formulario.get('calidad')?.value ,GlobalVariable.Cod_Grupo);
    }
    else if(caja == 'Puntas'){
      this.fallada.nativeElement.focus();
      this.fallada.nativeElement.select();
      
      this.CargarConformidad(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.codcombo,this.codcolor, this.formulario.get('calidad')?.value ,GlobalVariable.Cod_Grupo);
    }
    else if(caja == 'Fallada'){
      this.kempalmes.nativeElement.focus();
      this.kempalmes.nativeElement.select();
      this.CargarConformidad(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.codcombo,this.codcolor, this.formulario.get('calidad')?.value ,GlobalVariable.Cod_Grupo);
    }
    else if(caja == 'Kempalmes'){

      this.accesorios.nativeElement.focus();
      this.accesorios.nativeElement.select();
      this.CargarConformidad(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.codcombo,this.codcolor, this.formulario.get('calidad')?.value ,GlobalVariable.Cod_Grupo);

    }
    else if(caja == 'Accesorios'){
      this.devolucion1.nativeElement.focus();
      this.devolucion1.nativeElement.select();
      this.CargarConformidad(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.codcombo,this.codcolor, this.formulario.get('calidad')?.value ,GlobalVariable.Cod_Grupo);
    }
 
    else if(caja == 'Devolucion1'){
      this.devolucion2.nativeElement.focus();
      this.devolucion2.nativeElement.select();
      this.CargarConformidad(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.codcombo,this.codcolor, this.formulario.get('calidad')?.value ,GlobalVariable.Cod_Grupo);

    }
    else if(caja == 'Devolucion2'){
      this.entrecortes.nativeElement.focus();
      this.entrecortes.nativeElement.select();
      this.CargarConformidad(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.codcombo,this.codcolor, this.formulario.get('calidad')?.value ,GlobalVariable.Cod_Grupo);
    }
    else if(caja == 'Entrecortes'){

      this.anchotizado.nativeElement.focus();
      this.anchotizado.nativeElement.select();
      this.CargarConformidad(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.codcombo,this.codcolor, this.formulario.get('calidad')?.value ,GlobalVariable.Cod_Grupo);
    }
    


    else if(caja == 'Anchotizado'){
      this.anchototalreal.nativeElement.focus();
      this.anchototalreal.nativeElement.select();
      this.CargarConformidad(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.codcombo,this.codcolor, this.formulario.get('calidad')?.value ,GlobalVariable.Cod_Grupo);
    }
    else if(caja == 'AnchoReal'){
      this.CargarConformidad(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.codcombo,this.codcolor, this.formulario.get('calidad')?.value ,GlobalVariable.Cod_Grupo);
      // this.paños.nativeElement.focus();
      // this.paños.nativeElement.select();
    }
    // else if(caja == 'Paños'){
    //   this.lavanderia.nativeElement.focus();
    //   this.lavanderia.nativeElement.select();
    // }
    // else if(caja == 'Lavanderia'){
    //   this.puntaspaños.nativeElement.focus();
    //   this.puntaspaños.nativeElement.select();
    // }
    // else if(caja == 'PuntasPaños'){
    //   this.ktelareasig.nativeElement.focus();
    //   this.ktelareasig.nativeElement.select();
    // }

    // else if(caja == 'Ktelareasig'){
    //   this.pppromedio.nativeElement.focus();
    //   this.pppromedio.nativeElement.select();
    // }
    // else if(caja == 'Pppromedio'){
    //   this.patendido.nativeElement.focus();
    //   this.patendido.nativeElement.select();
    // }
    
    // else if(caja == 'PAtendido'){
    //   this.depuradas.nativeElement.focus();
    //   this.depuradas.nativeElement.select();
    // }
  }



  grabarDatosGrilla2() {

    let Secuencia=this.formulario.get('Secuencia').value
    let LTendidoMts=this.formulario.get('LTendidoMts').value
    let PesoxPanoKgs=this.formulario.get('PesoxPanoKgs').value
    let PrendasxPano=this.formulario.get('PrendasxPano').value
    let num_panos=this.formulario.get('num_panos').value

    console.log(GlobalVariable.Cod_op)
    console.log(GlobalVariable.Cod_Grupo)
    let codtizado=this.formulario.get('tizado')?.value
    console.log('Secuencia: '+Secuencia+'LTendidoMts:'+LTendidoMts+'PesoxPanoKgs:'+PesoxPanoKgs+'PrendasxPano:'+PrendasxPano+'num_panos:'+num_panos)
    this.CargarConformidad(GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.codcombo,this.codcolor, this.formulario.get('calidad')?.value ,GlobalVariable.Cod_Grupo);
    this.despachoTelaCrudaService.guardarDetalleGrilla2('I',GlobalVariable.Cod_op,codtizado,Secuencia,LTendidoMts,PesoxPanoKgs,PrendasxPano,num_panos,GlobalVariable.Cod_Grupo).subscribe(
      (result: any) => {
        console.log(result);
        //console.log(this.dataSource.data);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  eliminaDatosGrilla2(Secuencia: string,LTendidoMts: string,PesoxPanoKgs: string,PrendasxPano: string,num_panos: string) {

    console.log('Secuencia: '+Secuencia+'LTendidoMts:'+LTendidoMts+'PesoxPanoKgs:'+PesoxPanoKgs+'PrendasxPano:'+PrendasxPano+'num_panos:'+num_panos)
    let codtizado=this.formulario.get('tizado')?.value

    console.log(GlobalVariable.Cod_op)
    console.log(GlobalVariable.Cod_Grupo)
    console.log(codtizado)
    console.log('Secuencia: '+Secuencia+'LTendidoMts:'+LTendidoMts+'PesoxPanoKgs:'+PesoxPanoKgs+'PrendasxPano:'+PrendasxPano+'num_panos:'+num_panos)

    this.despachoTelaCrudaService.guardarDetalleGrilla2('D',GlobalVariable.Cod_op,codtizado,Secuencia,LTendidoMts,PesoxPanoKgs,PrendasxPano,num_panos,GlobalVariable.Cod_Grupo).subscribe(
      (result: any) => {
        console.log(result);
        if(result[0].RESPUESTA == 'OK'){
          this.cargarGrillaDetalle();
          this.matSnackBar.open('DETALLE ELIMINADO CORRECTAMENTE', 'Cerrar', {
            duration: 1500,
          });
        }
        //console.log(this.dataSource.data);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

  }

  grabarFormDetalle() {

      let tela=this.formulario.get('tela')?.value
      let combo=this.formulario.get('combo')?.value
      let color=this.formulario.get('color')?.value
      let calidad=this.formulario.get('calidad')?.value
      let talla=this.formulario.get('talla')?.value
      let tizado=this.formulario.get('tizado')?.value
      let pdepuradas=this.formulario.get('pdepuradas')?.value
      let retazos=this.formulario.get('retazos')?.value
      let telafallada=this.formulario.get('telafallada')?.value
      let puntas=this.formulario.get('puntas')?.value
      let devolucion1=this.formulario.get('devolucion1')?.value
      let entrecortes=this.formulario.get('entrecortes')?.value
      let devolucion2=this.formulario.get('devolucion2')?.value
      let kaccesorios=this.formulario.get('kaccesorios')?.value
      let retazospaños=this.formulario.get('retazospaños')?.value
      let kmermalavanderia=this.formulario.get('kmermalavanderia')?.value
      let puntaspaños=this.formulario.get('puntaspaños')?.value
      let kempalmes=this.formulario.get('kempalmes')?.value
      let ktelareasig=this.formulario.get('ktelareasig')?.value
      let pppromedio=this.formulario.get('pppromedio')?.value
      let ptendido=this.formulario.get('ptendido')?.value
      let anchotizado=this.formulario.get('anchotizado')?.value
      let anchototalreal=this.formulario.get('anchototalreal')?.value
      let fec_liquidacion=this.formulario.get('fec_liquidacion')?.value
      let cod_motivo=this.formulario.get('cod_motivo')?.value
      let pesopano='0'
      let kgatentidos='0'
   
      /*console.log(this.data.op)
    console.log(this.data.grupo)*/
    console.log(GlobalVariable.Cod_op)
    console.log(GlobalVariable.Cod_Grupo)
    console.log(GlobalVariable.Cod_Tela)
    console.log(tizado)

      this.codtipoordtra
      this.codordtra
      this.codcombo
      this.codcolor

      //'U','F2522','TI','G3418','JE002634','   ','011740','          ','A',0,0,51.6,0,0,0,0,1.381,208 , 0 ,'001','5.07',0,0,0,0,0,0,0,0,0,'I'
      let codtizado=tizado.substring(0,3)
      this.despachoTelaCrudaService.guardarDetalleGrilla1('U',GlobalVariable.Cod_op,this.codtipoordtra,this.codordtra,GlobalVariable.Cod_Tela,this.cod_Combo,
      this.codcolor,talla,calidad,retazos,puntas,entrecortes,telafallada,devolucion1,devolucion2,pdepuradas,pppromedio,ptendido,kgatentidos,codtizado,kaccesorios,'0',kmermalavanderia,'0',kempalmes,ktelareasig,retazospaños,puntaspaños,anchototalreal,anchotizado,GlobalVariable.Cod_Grupo, fec_liquidacion, cod_motivo).subscribe(
      (result: any) => {
        console.log(result[0].RESPUESTA);
        //console.log(this.dataSource.data);

        if (result[0].RESPUESTA=="OK") {

          this.matSnackBar.open("Actualización Correcta!!", 'Cerrar', {
            duration: 1500,
          })
          this.deshabilitar = false;

        } else {
          this.matSnackBar.open(result[0].RESPUESTA, 'Cerrar', {
            duration: 1500,
          })
        }


      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))


  }

  mostrar() {
    this.element=true;
  }

  ocultar() {
    this.element=false;
  }

  CargarTizado(cod_op: string,Cod_Tordtra: string,cod_ordtra: string,cod_tela: string,Cod_comb: string,Cod_color: string,modo: string) {
    this.despachoTelaCrudaService.listarComboTizado(cod_op,Cod_Tordtra,cod_ordtra,cod_tela,Cod_comb,Cod_color,modo).subscribe(
      (result: any) => {
        this.listar_operacionConductor = result
        let nreg=result.length
        if (nreg>0) {

          this.cargarGrillaDetalle(result[0].NUM_TENDIDO)
          this.formulario.get('tizado')?.setValue(result[0].NUM_TENDIDO)
          
          var tizado = this.formulario.get('tizado').value;
          this.listar_operacionConductor.filter(element => {
            if(element.NUM_TENDIDO == tizado){
              this.prendas_reales = element.NUM_PRENDAS_REALES;
            }
          })
        }

        console.log(result);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  CargarConformidad(cod_op: string,Cod_Tordtra: string,cod_ordtra: string,cod_tela: string,Cod_comb: string,Cod_color: string,cod_calidad: string, modo: string) {
    this.despachoTelaCrudaService.listarCargarConformidad(cod_op,Cod_Tordtra,cod_ordtra,cod_tela,Cod_comb,Cod_color, cod_calidad, modo).subscribe(
      (result: any) => {
        console.log(result[0]['STATUS_LIQ']);
        this.status_liq = result[0]['STATUS_LIQ'];
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


}
