import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ProduccionArtesInspeccionService } from 'src/app/services/produccion-artes-inspeccion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { NgxSpinnerService }  from "ngx-spinner";
import { GlobalVariable } from 'src/app/VarGlobals';
import { DatePipe } from "@angular/common";
import { Result } from '@zxing/library';

//Data proveniente del padre cuando se edita
interface data {
  Id_ProduccionArtes: number;
  Cod_OrdPro: string;
  Cod_EstPro: string;
  Cod_Version: string;
  Co_CodOrdPro: string;
  Cod_Present: string;
  Cod_EstCli: string;
  Cod_Cliente: string;
  Tipo_Prenda: string;
  Num_Hoja_Correlativo_General: string;
  Cod_Usuario: string;
  Fecha_Ingreso_Produccion: string;
  Fecha_Entrega_Contramuestra: string;
  Flg_Strike: string;
  Desc_Flg_Strike: string;
  Flg_Estado_Superv_Aseguramiento: boolean;
  Flg_Estado_Superv_Produccion: boolean;
  Flg_Estado: string;
  Fecha_Registro: string;
  IdNivelAutorizacion: number;
}


@Component({
  selector: 'app-dialog-produccion-artes-crear',
  templateUrl: './dialog-produccion-artes-crear.component.html',
  styleUrls: ['./dialog-produccion-artes-crear.component.scss']
})
export class DialogProduccionArtesCrearComponent implements OnInit {

  Cod_Accion = ''
  Cod_OrdPro = ''
  Cod_EstPro = ''
  Cod_Version =''
  Co_CodOrdPro = ''
  IdProduccionArtes = 0
  dataItemsComposicion = []
  grdComposicionVisible: boolean = false
  lstOperacionColor:any = [];
  dataTrabajador: Array<any> = []
  Num_Hoja_Inspeccion: number = 0
  //dataItemsWithOpciones: Array<any> = []
  dataItemsWithOpciones: any
  dataSendActualizar: any
  lstOC:any = [];
  

  Titulo = ''
  btnAccionModificar: boolean = false
  optSupervicionVisible:boolean = false

  lstStrike: any[] = [
    { cod: "1", name: "Presenta Strike OFF"  },
    { cod: "0", name: "No presenta Strike OFF" }
  ];

  optResultado: any[] = [
    { id: "1", name: "Aprobado"  },
    { id: "0", name: "Rechazado" }
  ];

  lstOptTipoPrenda: any[] = [
    { id: "1", name: "Prenda" },
    { id: "2", name: "Pieza" },
    { id: "3", name: "Bloque" }
  ];

  Items: any[] = []
  /*
  Items: any[] = [
    {Id_Item: 1, Composicion: 'Tecnica', Estampado: '0', ExisteEstampado:1, Bordado: '0', Sublimado: '0', Resultado: '0', Observacion:'Pruebas de enlace del objeto'},
    {Id_Item: 2, Composicion: 'Amerita humectado/bordado por marca de cuadro', Estampado: '0', ExisteEstampado: 1, Sublimado: '0', Resultado: '0', Observacion:''},
    {Id_Item: 3, Composicion: 'Pzas Ameritan pasar por horno (Tonalidad)', Estampado: '0', ExisteEstampado: 1, Sublimado: '0', Resultado: '0', Observacion:''},
    {Id_Item: 4, Composicion: 'Prueba de lavado', Estampado: '1', ExisteEstampado: 1, Bordado: '0', Sublimado: '0', Resultado: '1', Observacion:''},
    {Id_Item: 5, Composicion: 'Ubicacion de arte', Estampado: '0', ExisteEstampado: 1, Sublimado: '0', Resultado: '0', Observacion:''},
    {Id_Item: 6, Composicion: 'Papel de proteccion', Estampado: '0', ExisteEstampado: 1, Sublimado: '0', Resultado: '1', Observacion:'aqui otra prueba de enlace'},
    {Id_Item: 7, Composicion: 'Hilo de tono correcto', Estampado: '0', ExisteEstampado: 1, Sublimado: '0', Resultado: '0', Observacion:''},
    {Id_Item: 8, Composicion: 'Pelon correcto/calidad', Estampado: '0', ExisteEstampado: 1, Sublimado: '0', Resultado: '0', Observacion:''},
    {Id_Item: 9, Composicion: 'Corrospum tono/Espesor', Estampado: '0', ExisteEstampado: 1, Sublimado: '0', Resultado: '0', Observacion:''},
    {Id_Item: 10, Composicion: 'Microporoso tono/espesor', Estampado: '0', ExisteEstampado: 1, Sublimado: '1', Resultado: '0', Observacion:''},
    {Id_Item: 11, Composicion: 'Papel sublimado correcto/calida', Estampado: '0', ExisteEstampado: 1, Sublimado: '0', Resultado: '0', Observacion:''}
  ] 
  */

  formulario = this.formBuilder.group({
    sOP: ['', Validators.required],
    sCliente: [''],
    sEstilo: [''],
    sOC: [''],
    sTipoPrenda: [''],
    sColor: ['', Validators.required],
    sFechaHoraIngreso: [''],
    sFechaHoraEntrega: [''],
    sFlgStrike: ['1'],
    flgSuperAseg: [0],
    flgSuperProd: [0]
  });

  constructor(
    private formBuilder: FormBuilder, 
    private matSnackBar: MatSnackBar, 
    private SpinnerService: NgxSpinnerService, 
    private datepipe: DatePipe,
    private produccionArtesInspeccionService: ProduccionArtesInspeccionService,
    public dialog_: MatDialogRef<DialogProduccionArtesCrearComponent>,
    @Inject(MAT_DIALOG_DATA) public data: data,
  ){
      
   }


  ngOnInit(): void { 

    this.formulario.controls['sFechaHoraIngreso'].disable()
    this.formulario.controls['sCliente'].disable()
    this.formulario.controls['sEstilo'].disable()

    this.fechaHoraDefaultIngreso()
    this.fechaHoraDefaultEntrega()
    this.obtenerInformacion()
  
  }

  buscarEstiloClientexOP(){

    this.formulario.controls['sCliente'].setValue('')
    this.formulario.controls['sEstilo'].setValue('')
    this.formulario.controls['sOC'].setValue('')
    this.Cod_OrdPro = this.formulario.get('sOP')?.value
    if(this.Cod_OrdPro.length == 5){
    this.Cod_Accion   = 'E'
    this.Cod_OrdPro
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','','','','','','','','',
      this.IdProduccionArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          this.formulario.controls['sCliente'].setValue(result[0].Des_Cliente)
          this.formulario.controls['sEstilo'].setValue(result[0].Cod_EstCli)
          this.Cod_EstPro = result[0].Cod_EstPro
          this.Cod_Version = result[0].Cod_Version
          this.CargarOperacionColor();
          this.CargarListaOC();
          this.changeDataGrilla();
          this.lstOperacionColor = [];
          //console.log(result);
          this.grdComposicionVisible = false
          this.SpinnerService.hide();
        }else{
          this.matSnackBar.open('La OP no existe...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          this.grdComposicionVisible = false
          this.lstOC = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }else{
      this.grdComposicionVisible = false;
      this.lstOC = []
      this.lstOperacionColor = []
      this.formulario.controls['sOC'].setValue('')
    }
  }

  RegistrarHoja() {
    if (this.formulario.valid) {
      this.Cod_Accion   = 'I'
      /*console.log(
        'Cod_Accion: ',this.Cod_Accion,
        'Cod_OrdPro: ',this.Cod_OrdPro,
        'Cod_EstPro: ',this.Cod_EstPro,
        'Cod_Version: ',this.Cod_Version,
        'Co_CodOrdPro: ',this.formulario.get('sOC').value,
        'sEstilo: ',this.formulario.get('sEstilo').value,
        'sCliente: ',this.formulario.get('sCliente').value,
        'sFechaHoraIngreso: ',this.formulario.get('sFechaHoraIngreso').value,
        'sFechaHoraEntrega: ',this.formulario.get('sFechaHoraEntrega').value,
        'sFlgStrike: ',this.formulario.get('sFlgStrike').value,
        'flgSuperAseg: ',this.formulario.get('flgSuperAseg').value,
        'flgSuperProd: ',this.formulario.get('flgSuperProd').value,
        'usuario: ', this.sCod_Usuario
      )*/
      let Co_CodOrdPro = this.formulario.get('sOC').value
      let Cod_Present = this.formulario.get('sColor').value
      let Tipo_Prenda = this.formulario.get('sTipoPrenda').value
      let Cod_EstCli = this.formulario.get('sEstilo').value
      let Cod_Cliente = this.formulario.get('sCliente').value
      let sFlgStrike = this.formulario.get('sFlgStrike').value
      let sFechaHoraIngreso = this.formulario.get('sFechaHoraIngreso').value
      let sFechaHoraEntrega = this.formulario.get('sFechaHoraEntrega').value
      let flgSuperAseg = this.formulario.get('flgSuperAseg').value
      let flgSuperProd = this.formulario.get('flgSuperProd').value
      
      this.SpinnerService.show();
      this.produccionArtesInspeccionService.MantenimientoProduccionArtesInspeccionComplemento(
        this.Cod_Accion,
        this.Cod_OrdPro,
        this.Cod_EstPro,
        this.Cod_Version,
        Co_CodOrdPro,
        Cod_Present,
        Cod_EstCli,
        Cod_Cliente,
        Tipo_Prenda,
        sFlgStrike,
        sFechaHoraIngreso,
        sFechaHoraEntrega,
        flgSuperAseg,
        flgSuperProd,
        this.IdProduccionArtes
        ).subscribe(
        (result: any) => {
        if (result[0].Respuesta == 'OK'){
          //console.log(result)
          this.Num_Hoja_Inspeccion = result[0].Num_Hoja_Inspeccion
          //this.dataItemsWithOpciones.push({'Idhoja':this.Num_Hoja_Inspeccion, 'Accion':'I','opciones':this.dataItemsComposicion})
          this.dataItemsWithOpciones= {'Idhoja':this.Num_Hoja_Inspeccion, 'Accion':'I','Opciones':this.dataItemsComposicion}
          this.enviarItemsComposicion();
          //this.SpinnerService.hide();
          //this.dialog_.close();
        }else{
          this.SpinnerService.hide();
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

    }else{
      this.matSnackBar.open('Ingrese la informacion requerida...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
  }

  CargarOperacionColor() {
    this.produccionArtesInspeccionService.SM_Presentaciones_OrdPro(this.Cod_OrdPro).subscribe(
      (result: any) => {
        //console.log(result)
        this.lstOperacionColor = result
        //this.changeDataGrilla()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  changeCheck(event, id, valor) {

    if (event.checked) {

      this.dataItemsComposicion.forEach(element => {

        if (element.Id_Item == id) {
          ////estamp, bordad, sublim, result
          if (valor == 'estamp') {
            element.Estampado = '1';
          }

          if (valor == 'bordad') {
            element.Bordado = '1';
          }

          if (valor == 'sublim') {
            element.Sublimado = '1';
          }

          if (valor == 'result') {
            element.Resultado = '1';
          }
        }

      });
    } else {

      this.dataItemsComposicion.forEach(element => {
        if (element.Id_Item == id) {
          if (valor == 'estamp') {
            element.Estampado = '0';
          }

          if (valor == 'bordad') {
            element.Bordado = '0';
          }

          if (valor == 'sublim') {
            element.Sublimado = '0';
          }

          if (valor == 'result') {
            element.Resultado = '0';
          }

        }

      });
    }

  }

  changeRadio(event, id, valor) {

    if (event.value == '1') {

      this.dataItemsComposicion.forEach(element => {

        if (element.Id_Item == id) {
         
          if (valor == 'result') {
            element.Resultado = '1';
          }
        }

      });

    } else {

      this.dataItemsComposicion.forEach(element => {
        if (element.Id_Item == id) {

          if (valor == 'result') {
            element.Resultado = '0';
          }

        }

      });
    }

  }

  changeInfoObserv(event, id, valor){

    this.dataItemsComposicion.forEach(element => {
      if (element.Id_Item == id) {
        if (valor == 'observ') {
          element.Observacion = event.target.value;
        }
      }
    });

  }
  

  fechaHoraDefaultIngreso(){ 
    let fechaIni = new Date();
    this.formulario.patchValue({ sFechaHoraIngreso: this.datepipe.transform(fechaIni, 'yyyy-MM-ddTHH:mm')})
  }
  
  fechaHoraDefaultEntrega(){ 
    let fechaFin = new Date();
    this.formulario.patchValue({ sFechaHoraEntrega: this.datepipe.transform(fechaFin, 'yyyy-MM-ddTHH:mm')})
  }

  listarItemsComposicion() {
    this.dataItemsComposicion = this.Items;
  }

  enviarItemsComposicion() {
    //console.log(this.dataItemsWithOpciones)
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesInspeccionOpciones(
      this.dataItemsWithOpciones
    ).subscribe(
      (result: any) => {
        //console.log(result)
        if (result.msg == 'OK') {
          this.dataItemsWithOpciones = [];
          this.SpinnerService.hide();
          this.dialog_.close();
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  changeDataGrilla() {
    console.log("aaqrui")
    //console.log(event)
    //console.log(this.Cod_Accion)
    this.Co_CodOrdPro = this.formulario.get('sOC')?.value
    //this.Cod_OrdPro = this.formulario.get('sOP')?.value
    //if (event != undefined) {
      //var oc = event.target.value;
      //if (oc.length == 5) {  
      if (this.Cod_OrdPro.length >= 5) {   
        this.Cod_Accion   = 'C'
        this.SpinnerService.show();
        /*console.log(
          'Cod_Accion: ',this.Cod_Accion,
          'Cod_OrdPro: ',this.Cod_OrdPro,
          'Cod_EstPro: ',this.Cod_EstPro,
          'Cod_Version: ', this.Cod_Version,
          'Co_CodOrdPro: ',this.Co_CodOrdPro,
          'IdProduccionArtes: ',this.IdProduccionArtes
        )*/
        this.produccionArtesInspeccionService.MantenimientoProduccionArtesInspeccionComplemento(
          this.Cod_Accion,
          this.Cod_OrdPro,
          this.Cod_EstPro,
          this.Cod_Version,
          this.Co_CodOrdPro,
          '','','','','','','','','',
          this.IdProduccionArtes
          ).subscribe(
          (result: any) => {
            if(result.length > 0){
            //console.log(result);
            this.dataItemsComposicion = result;
            if(this.Cod_EstPro !=''){
              this.grdComposicionVisible = true;
            }
            
            this.SpinnerService.hide();
          }else{
            this.matSnackBar.open('No se tienen items...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

      } else {
        this.grdComposicionVisible = false;
      }
    //}
  }


  Limpiar() {
    this.Cod_OrdPro = ''
    this.formulario.patchValue({
      sOP: '',
      sCliente: '',
      sEstilo: '',
      sOC: '',
      sFechaHoraIngreso: '',
      sFechaHoraEntrega: '',
      sFlgStrike: '1',
      flgSuperAseg: 0,
      flgSuperProd: 0
    })
    this.fechaHoraDefaultIngreso()
    this.fechaHoraDefaultEntrega()
    this.listarItemsComposicion()
    console.log('limpiando')
    console.log(this.dataItemsComposicion)
  }

  obtenerInformacion(){
    this.Cod_Accion   = 'N'
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','','','','','','','','',
      this.IdProduccionArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          console.log(result);
          this.dataTrabajador = result
          this.definirTitulo()
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  definirTitulo(){
    this.Titulo    = this.data.Num_Hoja_Correlativo_General
    this.optSupervicionVisible = (this.data.IdNivelAutorizacion == 1) ? true:false
    //console.log(this.Titulo)

    if(this.Titulo == undefined){//Boton nuevo pulsado
      this.Titulo  = this.dataTrabajador[0].NumHoja
    }else{
      //console.log(this.data) 
      this.formulario.patchValue({
          sOP: this.data.Cod_OrdPro,
          sCliente: this.data.Cod_Cliente,
          sEstilo: this.data.Cod_EstCli,
          sOC: this.data.Co_CodOrdPro,
          sColor: this.data.Cod_Present,
          sTipoPrenda: this.data.Tipo_Prenda,
          sFechaHoraIngreso: this.datepipe.transform(this.data.Fecha_Ingreso_Produccion['date'], 'yyyy-MM-ddTHH:mm'),
          sFechaHoraEntrega: this.datepipe.transform(this.data.Fecha_Entrega_Contramuestra['date'], 'yyyy-MM-ddTHH:mm'),
          sFlgStrike: this.data.Flg_Strike,
          flgSuperAseg: this.data.Flg_Estado_Superv_Aseguramiento,
          flgSuperProd: this.data.Flg_Estado_Superv_Produccion
      });
      this.formulario.controls['sOP'].disable()

      this.Cod_OrdPro = this.data.Cod_OrdPro
      this.Cod_EstPro = this.data.Cod_EstPro
      this.Cod_Version = this.data.Cod_Version
      this.IdProduccionArtes = this.data.Id_ProduccionArtes
      this.btnAccionModificar = true

      //console.log('Cod_Accion: ',this.Cod_Accion,  'Cod_OrdPro: ',this.Cod_OrdPro, 'Cod_EstPro: ',this.Cod_EstPro, 'Cod_Version: ',this.Cod_Version, 'IdProduccionArtes: ',this.IdProduccionArtes )
      this.CargarOperacionColor()
      this.CargarListaOC()
      this.changeDataGrilla()
    }
  }

  ModificarHoja(){

    this.Cod_Accion = 'U'
    let Cod_EstCli = this.formulario.get('sEstilo').value
    let Cod_Cliente = this.formulario.get('sCliente').value
    let Cod_Present = this.formulario.get('sColor').value
    let Tipo_Prenda = this.formulario.get('sTipoPrenda').value
    let sFlgStrike = this.formulario.get('sFlgStrike').value
    let sFechaHoraIngreso = this.formulario.get('sFechaHoraIngreso').value
    let sFechaHoraEntrega = this.formulario.get('sFechaHoraEntrega').value
    let flgSuperAseg = this.formulario.get('flgSuperAseg').value
    let flgSuperProd = this.formulario.get('flgSuperProd').value
     

    this.dataSendActualizar = {
      'Accion':this.Cod_Accion,
      'Cod_OrdPro':this.Cod_OrdPro,
      'Cod_EstPro':this.Cod_EstPro,
      'Cod_Version':this.Cod_Version,
      'Co_CodOrdPro':this.Co_CodOrdPro,
      'Cod_Present':Cod_Present,
      'Cod_EstCli':Cod_EstCli,
      'Cod_Cliente':Cod_Cliente,
      'Tipo_Prenda':Tipo_Prenda,
      'sFlgStrike':sFlgStrike,
      'sFechaHoraIngreso':sFechaHoraIngreso,
      'sFechaHoraEntrega':sFechaHoraEntrega,
      'flgSuperAseg':flgSuperAseg,
      'flgSuperProd':flgSuperProd,
      'Cod_Usuario': GlobalVariable.vusu,
      'IdProduccionArtes':this.IdProduccionArtes,
      'Opciones':this.dataItemsComposicion
    }
    console.log(this.dataSendActualizar)
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesInspeccionActualizarWithOpciones(
      this.dataSendActualizar
    ).subscribe(
      (result: any) => {
        console.log(result)
        if (result[0].Respuesta == 'OK'){
          this.dataSendActualizar = [];
          this.SpinnerService.hide();
          this.dialog_.close();
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

    

  }

  CargarListaOC() {
    this.Cod_Accion   = 'O'
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_EstPro,
      this.Cod_Version,
      '','','','','','','','','','',
      this.IdProduccionArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          console.log(result)
          this.lstOC = result
          //this.changeDataGrilla()
          this.SpinnerService.hide();
        }else{
          this.lstOC = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  selectTipoPrenda(){
    if(this.formulario.get('sTipoPrenda').value == '1'){
      this.formulario.controls['sOC'].setValue('');
      this.Co_CodOrdPro = '';
    }
  }

}

 