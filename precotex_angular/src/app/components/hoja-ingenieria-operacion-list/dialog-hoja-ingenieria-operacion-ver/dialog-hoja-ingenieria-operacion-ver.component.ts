import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProduccionArtesInspeccionService } from 'src/app/services/produccion-artes-inspeccion.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { NgxSpinnerService }  from "ngx-spinner";
import { GlobalVariable } from 'src/app/VarGlobals';
import { DatePipe } from "@angular/common";
import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';

//Data proveniente del padre cuando se edita
interface data {
  IdHojaIngenieria: number;
  Num_Hoja_Correlativo: string;
  Cod_EstPro: string;
  Des_EstPro: string;
  Cod_Version: string;
  Cod_EstCli: string;
  Des_EstCli:string;
  Cod_Cliente: string;
  Des_Cliente: string;
  Cod_TipPre: string;
  Des_TipPre: string;
  Complejidad: string;
  Url_Archivo: string;
  Analista: string;
  Grupo: string;
  TipoTela: string;
  Cod_Usuario: string;
  available_production: string;
  Tipo_Estilo: string;
  Fecha_Ingreso: string;
  Fecha_Registro: string;
}

interface Analista {
  Cod_Analista: string;
  Nom_Analista: string;
  Tip_Trabajador: string;
}

interface Paso {
  Titulo: string;
  Descripcion: string;
  Observaciones: string;
  Accesorios: string;
  UrlVideo: string;
  IdHojaIngenieria: number;
}

interface Estilo {
  Cod_EstCli: string;
}



@Component({
  selector: 'app-dialog-hoja-ingenieria-operacion-ver',
  templateUrl: './dialog-hoja-ingenieria-operacion-ver.component.html',
  styleUrls: ['./dialog-hoja-ingenieria-operacion-ver.component.scss']
})

export class DialogHojaIngenieriaOperacionVerComponent implements OnInit {

  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('inputFile2') inputFile2: ElementRef;
  @ViewChild('inputFileVideo') inputFileVideo: ElementRef;
  @ViewChild('inputFileVideo2') inputFileVideo2: ElementRef;

  Cod_Accion = ''
  sCodEstPro = ''
  Cod_Cliente = ''
  Cod_TipPre = ''
  /*
  Cod_EstCli = ''
  Cod_TemCli = ''
  Nom_TemCli = ''
  Des_Present = ''*/
  IdHojaIngenieria = 0

  Titulo = ''
  btnAccionModificar: boolean = false
  Num_Hoja_Correlativo: number = 0
  dataSendActualizar: any
  btnUploadFileVisible: boolean = false;
  frmPanelVisible: boolean = false;
  ExisteArchivo: boolean = false;
  URLArchivo: string = ''
  ExisteVideo: boolean = false
  URLVideo: string = ''

  dataItemsWithPasos: any
  dataItemsPasos:any = []
  /*dataItemsPasos:any = [
    {Titulo: 'Picaron en el cuello', Descripcion:'Doblar + fijar borde inferior de cuello en forma de picaron con 20 ppts usando prensatela plana con guia de 1/8" soldada.', Observaciones:'Aqui observaciones registradas',Accesorios:'',UrlVideo:''},
    {Titulo: 'Recubierto en parte superior de cuello', Descripcion:'Recubrir borde superior de cuello con maquina recubridora plana, usando presnsatela con guia 1/6", cuidar la forma del cuello y pestaña pareja.', Observaciones:'Aqui observaciones registradas',Accesorios:'',UrlVideo:''}
  ];*/
  btnEditarPanelVisible: boolean = false;

  lstOptVersiones: any[] = [];
  itemsEstiloCliente: Estilo[] = [];
  lstOptTipoTela:any[] = [];
  lstOptComplejidad: any[] = [
    { id: "1", name: "Basico" },
    { id: "2", name: "Semimoda" },
    { id: "3", name: "Moda" },
    { id: "4", name: "Alta costura" }
  ];

  lstOptTipoEstilo: any[] = [
    { id: "1", name: "Carry over" },
    { id: "2", name: "Nuevo" }
  ];

  /*dataItemsOps: any[] = [
    {cod_ordpro:'F8285', Des_Present:'WHITE PB-100', Des_Destino: 'VARIOS', Flg_Estado:'1', Sel:'0'},
    {cod_ordpro:'F8080', Des_Present:'STONE', Des_Destino: 'VARIOS', Flg_Estado:'0', Sel:'1'}
  ]*/
  		
  listar_operacionAnalista:   Analista[] = [];
  filtroOperacionAnalista:    Observable<Analista[]> | undefined;

  formulario = this.formBuilder.group({
    sCodEstPro: ['', Validators.required],
    sDesEstPro: [''],
    sDesCliente: [''],
    sTipoPrenda: [''],
    sCodVersion: [''],
    sCodEstCli: [''],
    sGrupo:[''],
    sComplejidad:[''],
    sAnalista: [''],
    sFechaHoraIngreso: [''],
    sTipoTela: [''],
    sTituloOperacion: [''],
    sVideoOperacion: [''],
    sDescripcionOperacion: [''],
    sObservacionesOperacion: [''],
    sAccesoriosOperacion: [''],
    sAvailable: ['0'],
    sTipoEstilo: ['1']    

  });

  constructor(
    private formBuilder: FormBuilder, 
    private matSnackBar: MatSnackBar, 
    private SpinnerService: NgxSpinnerService, 
    private datepipe: DatePipe,
    private produccionArtesInspeccionService: ProduccionArtesInspeccionService,
    public dialog_: MatDialogRef<DialogHojaIngenieriaOperacionVerComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: data,
  ){
      
   

  }


  ngOnInit(): void { 
    this.formulario.controls['sCodEstPro'].disable()
    this.formulario.controls['sTipoEstilo'].disable()
    this.formulario.controls['sDesCliente'].disable()
    this.formulario.controls['sTipoPrenda'].disable()
    this.formulario.controls['sCodVersion'].disable()
    this.formulario.controls['sCodEstCli'].disable()
    this.formulario.controls['sGrupo'].disable()
    this.formulario.controls['sComplejidad'].disable()
    this.formulario.controls['sAnalista'].disable()
    this.formulario.controls['sTipoTela'].disable()
    this.formulario.controls['sFechaHoraIngreso'].disable()
    this.fechaHoraDefaultIngreso()
    this.obtenerInformacion()
  }

  fechaHoraDefaultIngreso(){ 
    let fechaIni = new Date();
    this.formulario.patchValue({ sFechaHoraIngreso: this.datepipe.transform(fechaIni, 'yyyy-MM-ddTHH:mm')})
  }

  buscarxEstiloPropio(){

    this.formulario.controls['sDesEstPro'].setValue('')
    this.formulario.controls['sDesCliente'].setValue('')
    this.formulario.controls['sTipoPrenda'].setValue('')
    this.formulario.controls['sCodVersion'].setValue('')
    this.sCodEstPro = this.formulario.get('sCodEstPro')?.value
    if(this.sCodEstPro.length == 5){
    this.Cod_Accion   = 'E'
    this.SpinnerService.show();

    this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaComplemento(
      this.Cod_Accion,
      this.sCodEstPro,
      '','','','','','','','','','','','','','','','',
      this.IdHojaIngenieria
      ).subscribe(
      (result: any) => {
        //console.log(result)
        if(result.length > 0){
          this.formulario.controls['sDesEstPro'].setValue(result[0].Des_EstPro)
          this.Cod_Cliente = result[0].Cod_Cliente
          this.formulario.controls['sDesCliente'].setValue(result[0].Des_Cliente)
          this.Cod_TipPre = result[0].Cod_TipPre
          this.formulario.controls['sTipoPrenda'].setValue(result[0].Tipo_Prenda)
          this.lstOptVersiones = result
          this.btnUploadFileVisible = true
          this.SpinnerService.hide()
        }else{
          this.matSnackBar.open('El estilo propio no existe...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          this.lstOptVersiones = []
          this.btnUploadFileVisible = false
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }else{
      this.lstOptVersiones = []
      this.btnUploadFileVisible = false
    }
  }

  buscarxEstiloPropioEdit(){

    this.Cod_Accion   = 'E'
    this.SpinnerService.show();

    this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaComplemento(
      this.Cod_Accion,
      this.sCodEstPro,
      '','','','','','','','','','','','','','','','',this.IdHojaIngenieria
      ).subscribe(
      (result: any) => {
        //console.log(result)
        if(result.length > 0){
          this.lstOptVersiones = result
          this.btnUploadFileVisible = true
          this.SpinnerService.hide()
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  onVersionChangeEdit(version){

    this.Cod_Accion   = 'C'
    this.itemsEstiloCliente = []
    this.lstOptTipoTela = []
    this.SpinnerService.show();

    this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaComplemento(
      this.Cod_Accion,
      this.sCodEstPro,
      '',version,'','','','','','','','','','','','','','',
      this.IdHojaIngenieria
      ).subscribe(
      (result: any) => {
        //console.log(result)
        if(result.length > 0){
          result.forEach(element => {
            this.itemsEstiloCliente = this.addUniqueObject(this.itemsEstiloCliente, {Cod_EstCli: element.Cod_EstCli})
          })
          this.lstOptTipoTela = result
        }
        this.SpinnerService.hide()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    
  }

  onVersionChange(event){
    //console.log(event.value);
    this.Cod_Accion   = 'C'
    this.itemsEstiloCliente = []
    this.lstOptTipoTela = []
    this.formulario.controls['sCodEstCli'].setValue('')
    this.sCodEstPro = this.formulario.get('sCodEstPro')?.value
    let version = event.value
    this.SpinnerService.show();

    this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaComplemento(
      this.Cod_Accion,
      this.sCodEstPro,
      '',version,'','','','','','','','','','','','','','',
      this.IdHojaIngenieria
      ).subscribe(
      (result: any) => {
        //console.log(result)
        if(result.length > 0){
          result.forEach(element => {
            this.itemsEstiloCliente = this.addUniqueObject(this.itemsEstiloCliente, {Cod_EstCli: element.Cod_EstCli})
          })
          this.lstOptTipoTela = result
          
        }
        this.SpinnerService.hide()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    
  }
  
  obtenerInformacion(){
    this.definirTitulo()
    this.CargarOperacionAnalista()
  }


  RegistrarHoja() {
    if (this.formulario.valid) {

      this.Cod_Accion   = 'I'
      let Cod_EstPro = this.sCodEstPro
      let Des_EstPro = this.formulario.get('sDesEstPro').value
      let Cod_Version = this.formulario.get('sCodVersion').value
      let Cod_EstCli = this.formulario.get('sCodEstCli').value
      let Des_EstCli = ''
      let Cod_Cliente = this.Cod_Cliente
      let Des_Cliente = this.formulario.get('sDesCliente').value
      let Cod_TipPre = this.Cod_TipPre
      let Des_TipPre = this.formulario.get('sTipoPrenda').value
      let Complejidad = this.formulario.get('sComplejidad').value
      let Url_Archivo = this.URLArchivo
      let Analista = this.formulario.get('sAnalista').value
      let Grupo = this.formulario.get('sGrupo').value
      let TipoTela = this.replaceSingleQuotesWithDoubleQuotes(this.formulario.get('sTipoTela').value)
      let Tipo_Estilo = this.formulario.get('sTipoEstilo').value
      let Available = '0'
      let Fecha_Ingreso = this.formulario.get('sFechaHoraIngreso').value


      console.log(
        'Accion :', this.Cod_Accion,
        'Cod_EstPro :',Cod_EstPro,
        'Des_EstPro :',Des_EstPro,
        'Cod_Version :',Cod_Version,
        'Cod_EstCli :',Cod_EstCli,
        'Des_EstCli :',Des_EstCli,
        'Cod_Cliente :',Cod_Cliente,
        'Des_Cliente :',Des_Cliente,
        'Complejidad :',Complejidad,
        'Url_Archivo :',Url_Archivo,
        'Analista :',Analista,
        'Grupo :',Grupo,
        'TipoTela :',TipoTela,
        'Available: ', Available,
        'Tipo_Estilo: ', Tipo_Estilo,
        'Fecha_Ingreso :',Fecha_Ingreso,
        'IdHojaIngenieria :',this.IdHojaIngenieria
      )
      //this.dataItemsWithPasos= {'Idhoja':this.Num_Hoja_Correlativo, 'Accion':'G','Pasos':this.dataItemsPasos}
      //this.enviarPasosItems()
      this.SpinnerService.show();
      this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaComplemento(
        this.Cod_Accion,
        this.sCodEstPro,
        Des_EstPro,Cod_Version,Cod_EstCli,Des_EstCli,Cod_Cliente,Des_Cliente,Cod_TipPre,Des_TipPre,Complejidad,Url_Archivo,Analista,Grupo,TipoTela,Available,Tipo_Estilo,Fecha_Ingreso,
        this.IdHojaIngenieria
        ).subscribe(
        (result: any) => {
          //console.log(result)
          if (result[0].Respuesta == 'OK'){
            //console.log(result)
            this.Num_Hoja_Correlativo = result[0].Num_Hoja_Correlativo
            this.dataItemsWithPasos= {'Idhoja':this.Num_Hoja_Correlativo, 'Accion':'G','Pasos':this.dataItemsPasos}
            this.enviarPasosItems()
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
 
  definirTitulo(){
    //console.log(this.data)
    if(this.data.Num_Hoja_Correlativo == undefined){//Boton nuevo pulsado
      this.Titulo  = 'Nueva Hoja de Ingenieria'
    }else{
     this.Titulo    = 'Hoja de Ingenieria ' + this.data.Num_Hoja_Correlativo
     this.sCodEstPro = this.data.Cod_EstPro
     this.Cod_Cliente = this.data.Cod_Cliente
     this.Cod_TipPre = this.data.Cod_TipPre
     this.IdHojaIngenieria = this.data.IdHojaIngenieria
     //this.Archivo = this.data.Url_Archivo
     this.URLArchivo = this.data.Url_Archivo
     this.ExisteArchivo = (this.data.Url_Archivo != '') ? true:false
     this.buscarxEstiloPropioEdit()
     this.onVersionChangeEdit(this.data.Cod_Version)
     this.btnAccionModificar = true
     this.getPasosHoja()
     
     //this.grdPanelVisible = true
     this.formulario.patchValue({
        sCodEstPro: this.data.Cod_EstPro,
        sDesEstPro: this.data.Des_EstPro,
        sDesCliente: this.data.Des_Cliente,
        sTipoPrenda: this.data.Des_TipPre,
        sCodVersion: this.data.Cod_Version,
        sCodEstCli: this.data.Cod_EstCli,
        sGrupo: this.data.Grupo,
        sComplejidad: this.data.Complejidad,
        sAnalista: this.data.Analista,
        sTipoTela: this.data.TipoTela,
        sAvailable: this.data.available_production,
        sTipoEstilo: this.data.Tipo_Estilo,
        sFechaHoraIngreso: this.datepipe.transform(this.data.Fecha_Registro['date'], 'yyyy-MM-ddTHH:mm')
     });
     this.formulario.controls['sCodEstPro'].disable()

    }
  }

  ModificarHoja(){

    this.Cod_Accion   = 'U'
    let Cod_EstPro = this.sCodEstPro
    let Des_EstPro = this.formulario.get('sDesEstPro').value
    let Cod_Version = this.formulario.get('sCodVersion').value
    let Cod_EstCli = this.formulario.get('sCodEstCli').value
    let Des_EstCli = ''
    let Cod_Cliente = this.Cod_Cliente
    let Des_Cliente = this.formulario.get('sDesCliente').value
    let Cod_TipPre = this.Cod_TipPre
    let Des_TipPre = this.formulario.get('sTipoPrenda').value
    let Complejidad = this.formulario.get('sComplejidad').value
    let Url_Archivo = this.URLArchivo
    let Analista = this.formulario.get('sAnalista').value
    let Grupo = this.formulario.get('sGrupo').value
    let TipoTela = this.replaceSingleQuotesWithDoubleQuotes(this.formulario.get('sTipoTela').value);
    let Tipo_Estilo = this.formulario.get('sTipoEstilo').value
    let Available = this.formulario.get('sAvailable').value
    let Fecha_Ingreso = this.formulario.get('sFechaHoraIngreso').value

    
    this.dataSendActualizar = {
      'Accion': this.Cod_Accion,
      'Cod_EstPro': Cod_EstPro,
      'Des_EstPro': Des_EstPro,
      'Cod_Version': Cod_Version,
      'Cod_EstCli': Cod_EstCli,
      'Des_EstCli': Des_EstCli,
      'Cod_Cliente': Cod_Cliente,
      'Des_Cliente': Des_Cliente,
      'Cod_TipPre':Cod_TipPre,
      'Des_TipPre':Des_TipPre,
      'Complejidad': Complejidad,
      'Url_Archivo': Url_Archivo,
      'Analista': Analista,
      'Grupo': Grupo,
      'TipoTela': TipoTela,
      'Available': Available,
      'Tipo_Estilo': Tipo_Estilo,
      'Fecha_Ingreso': Fecha_Ingreso,
      'Cod_Usuario': GlobalVariable.vusu,
      'IdHojaIngenieria':this.IdHojaIngenieria,
      'Pasos': this.dataItemsPasos
    }
    console.log(this.dataSendActualizar)

    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaActualizarWithOpciones(
      this.dataSendActualizar
    ).subscribe(
      (result: any) => {
        //console.log(result)
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

  CargarOperacionAnalista(){
    this.Cod_Accion   = 'S'
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaComplemento(
      this.Cod_Accion,
      this.sCodEstPro,
      '','','','','','','','','','','','','','','','',
      this.IdHojaIngenieria
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          //console.log(result);
          this.listar_operacionAnalista = result
          this.RecargarOperacionAnalista()
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  RecargarOperacionAnalista(){
    this.filtroOperacionAnalista = this.formulario.controls['sAnalista'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionAnalista(option) : this.listar_operacionAnalista.slice())),
    );
  }

  private _filterOperacionAnalista(value: string): Analista[] {
    const filterValue = value.toLowerCase();
    return this.listar_operacionAnalista.filter(option => String(option.Cod_Analista).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Analista.toLowerCase().indexOf(filterValue ) > -1);
  }

  addPasoOperacion(){

    let sTitulo = this.formulario.get('sTituloOperacion').value
    let sVideo = this.URLVideo
    let sDescripcion = this.replaceNewLinesWithBr(this.formulario.get('sDescripcionOperacion').value)
    let sObservaciones = this.replaceNewLinesWithBr(this.formulario.get('sObservacionesOperacion').value)
    let sAccesorios = this.replaceNewLinesWithBr(this.formulario.get('sAccesoriosOperacion').value)

    if(sTitulo!='' && sDescripcion!=''){
      this.addUniquePasoObject(this.dataItemsPasos, {
        Titulo: sTitulo, 
        UrlVideo: sVideo,
        Descripcion: sDescripcion,
        Observaciones: sObservaciones,
        Accesorios: sAccesorios,
        IdHojaIngenieria: this.IdHojaIngenieria
      })
      this.formulario.controls['sTituloOperacion'].setValue('')      
      this.formulario.controls['sVideoOperacion'].setValue('')   
      this.formulario.controls['sDescripcionOperacion'].setValue('')  
      this.formulario.controls['sObservacionesOperacion'].setValue('')
      this.formulario.controls['sAccesoriosOperacion'].setValue('')
      this.inputFileVideo.nativeElement.value = '';
      this.inputFileVideo2.nativeElement.value = '';
      this.URLVideo = ''
      this.ExisteVideo = false

    }else{
      this.matSnackBar.open('Defina Nombre de Operación y Método, requeridos', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }

    //console.log(sTitulo, sVideo, sDescripcion, sObservaciones, sAccesorios)
  }

  supItemPaso(elemento){
    if(typeof elemento.IdHojaIngenieria === 'undefined'){
      const indice = this.dataItemsPasos.findIndex(item => item === elemento)
      this.dataItemsPasos.splice(indice, 1)
    }else{
      let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'true') {
          
          let info = {'Idhoja':elemento.IdHojaIngenieria, 'Accion':'D','Pasos':[elemento]}
          //console.log(info)
          this.SpinnerService.show();
          this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaPasos(
            info
          ).subscribe(
            (result: any) => {
              //console.log(result)
              if (result.msg == 'OK') {

                const indice = this.dataItemsPasos.findIndex(item => item === elemento)
                this.dataItemsPasos.splice(indice, 1)

                this.SpinnerService.hide();
              }
              else {
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                this.SpinnerService.hide();
              }
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
          
        }
      })
    }

    this.formulario.controls['sTituloOperacion'].setValue('')
    this.formulario.controls['sVideoOperacion'].setValue('')
    this.formulario.controls['sDescripcionOperacion'].setValue('')
    this.formulario.controls['sObservacionesOperacion'].setValue('')
    this.formulario.controls['sAccesoriosOperacion'].setValue('')
    //this.inputFileVideo.nativeElement.value = '';
    //this.inputFileVideo2.nativeElement.value = '';
    this.btnEditarPanelVisible = false
  }

  editarItemPaso(elemento){
    this.frmPanelVisible = true
    this.btnEditarPanelVisible = true
    this.IdHojaIngenieria = elemento.IdHojaIngenieria
    this.URLVideo = elemento.UrlVideo
    this.ExisteVideo = (elemento.UrlVideo != '') ? true:false
    this.formulario.patchValue({
      sTituloOperacion: elemento.Titulo,
      sDescripcionOperacion: this.replaceBrWithNewLines(elemento.Descripcion),
      sObservacionesOperacion: this.replaceBrWithNewLines(elemento.Observaciones),
      sAccesoriosOperacion: this.replaceBrWithNewLines(elemento.Accesorios)
   });
  }

  updatePasoOperacion(){
    let IdHojaIngenieria = this.IdHojaIngenieria
    let sTituloOperacion = this.formulario.get('sTituloOperacion').value

    const paso = this.dataItemsPasos.find(p => p.IdHojaIngenieria === IdHojaIngenieria && p.Titulo === sTituloOperacion.trim());
    if (paso) {
      paso.Titulo = this.replaceSingleQuotesWithDoubleQuotes(this.formulario.get('sTituloOperacion').value)
      paso.Descripcion = this.replaceNewLinesWithBr(this.formulario.get('sDescripcionOperacion').value)
      paso.Observaciones = this.replaceNewLinesWithBr(this.formulario.get('sObservacionesOperacion').value)
      paso.Accesorios = this.replaceNewLinesWithBr(this.formulario.get('sAccesoriosOperacion').value)
      paso.UrlVideo = this.URLVideo
      paso.IdHojaIngenieria = this.IdHojaIngenieria
    }

    if(typeof IdHojaIngenieria === 'undefined'){
      //console.log('solo cambios frontend')
    }else{
      //console.log(paso)
      let info = {'Idhoja':IdHojaIngenieria, 'Accion':'G','Pasos':[paso]}
      this.SpinnerService.show();
      this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaPasos(
        info
      ).subscribe(
        (result: any) => {
          //console.log(result)
          if (result.msg == 'OK') {
            this.SpinnerService.hide();
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.SpinnerService.hide();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }

    this.frmPanelVisible = false
    this.formulario.controls['sTituloOperacion'].setValue('')
    this.formulario.controls['sVideoOperacion'].setValue('')
    this.formulario.controls['sDescripcionOperacion'].setValue('')
    this.formulario.controls['sObservacionesOperacion'].setValue('')
    this.formulario.controls['sAccesoriosOperacion'].setValue('')
    this.inputFileVideo.nativeElement.value = '';
    this.inputFileVideo2.nativeElement.value = '';
    this.btnEditarPanelVisible = false

  }


  addUniquePasoObject(arr: Paso[], obj: Paso): Paso[] {
    if (!arr.some(item => (item.Titulo === obj.Titulo))) {
      arr.push(obj);
      if(obj.IdHojaIngenieria === 0){
        
      }else{
        let info = {'Idhoja':obj.IdHojaIngenieria, 'Accion':'G','Pasos':[obj]}
        this.SpinnerService.show();
        this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaPasos(
          info
        ).subscribe(
          (result: any) => {
            //console.log(result)
            if (result.msg == 'OK') {
              this.SpinnerService.hide();
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.SpinnerService.hide();
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      }
      //console.log(obj)
    }
    return arr;
  }

  togglePanel() {
    this.frmPanelVisible = !this.frmPanelVisible;
  }

  guardarArchivo(event, tipo) {

    let accion = '';
    if (tipo == 'guardar') {
      accion = 'I';
    } else {
      accion = 'U';
    }
    let sCodEstPro = this.formulario.get('sCodEstPro')?.value
    let sVersion = this.formulario.get('sCodVersion')?.value
    let sId = this.IdHojaIngenieria

    var sCod_Usuario = GlobalVariable.vusu;
    const formData = new FormData();
    formData.append('Accion', accion);
    formData.append('Tipo', 'documento');
    formData.append('Cod_EstPro', sCodEstPro);
    formData.append('Cod_Version', sVersion);
    formData.append('Archivo', event.target.files[0]);
    formData.append('Archivo_Cargado', this.URLArchivo);
    formData.append('Cod_Usuario', sCod_Usuario);
    formData.append('IdHojaIngenieria', '0');

    this.SpinnerService.show();
    this.produccionArtesInspeccionService.HojaIngenieriaUploadFile(
      formData
    ).subscribe(
      (result: any) => {
        //console.log(result)
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open(result[0].Mensaje, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          //this.Archivo = result[0].Archivo
          this.URLArchivo = result[0].Ruta_archivo
          this.ExisteArchivo = true
        }else{
          this.matSnackBar.open(result[0].Mensaje, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2000 })
        }
        this.SpinnerService.hide();
        this.inputFile.nativeElement.value = '';
        this.inputFile2.nativeElement.value = '';

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })

  }

  eliminarArchivo(){

    let accion = 'O';
    let sCodEstPro = this.formulario.get('sCodEstPro')?.value
    let sVersion = this.formulario.get('sCodVersion')?.value
    let sId = this.IdHojaIngenieria.toString();
    var sCod_Usuario = GlobalVariable.vusu
    let archivo_file = this.obtenerParteDespuesDeUltimoSlash(this.URLArchivo)

    const formData = new FormData();
    formData.append('Accion', accion);
    formData.append('Tipo', 'documento');
    formData.append('Cod_EstPro', sCodEstPro);
    formData.append('Cod_Version', sVersion);
    formData.append('Archivo', '');
    formData.append('Archivo_Cargado', archivo_file);
    formData.append('Cod_Usuario', sCod_Usuario);
    formData.append('IdHojaIngenieria', sId);
    /*
    console.log('---------------------------')
    console.log(sCodEstPro)
    console.log(sVersion)
    console.log(archivo_file)
    console.log(sId)
    console.log('---------------------------')
    */
    
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.HojaIngenieriaUploadFile(
      formData
    ).subscribe(
      (result: any) => {
        //console.log(result)
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open("Se elimino archivo correctamente", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.URLArchivo = ''
          this.ExisteArchivo = false
        }
        this.SpinnerService.hide();

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })

  }

  guardarVideo(event, tipo){

    let accion = '';
    if (tipo == 'guardar') {
      accion = 'I';
    } else {
      accion = 'U';
    }
    let sCodEstPro = this.formulario.get('sCodEstPro')?.value
    let sVersion = this.formulario.get('sCodVersion')?.value
    let sId = this.IdHojaIngenieria

    var sCod_Usuario = GlobalVariable.vusu;
    const formData = new FormData();
    formData.append('Accion', accion);
    formData.append('Tipo', 'media');
    formData.append('Cod_EstPro', sCodEstPro);
    formData.append('Cod_Version', sVersion);
    formData.append('Archivo', event.target.files[0]);
    formData.append('Archivo_Cargado', this.URLVideo);
    formData.append('Cod_Usuario', sCod_Usuario);
    formData.append('IdHojaIngenieria', '0');

    this.SpinnerService.show();
    this.produccionArtesInspeccionService.HojaIngenieriaUploadFile(
      formData
    ).subscribe(
      (result: any) => {
        //console.log(result)
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open("Se adjunto archivo correctamente", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.URLVideo = result[0].Ruta_archivo
          this.ExisteVideo = true
        }else{
          this.matSnackBar.open(result[0].Mensaje, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2000 })
        }
        this.SpinnerService.hide();
        this.inputFileVideo.nativeElement.value = '';
        this.inputFileVideo2.nativeElement.value = '';

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2000 })
      })

  }

  eliminarVideo(){

    let accion = 'O';
    let sCodEstPro = this.formulario.get('sCodEstPro')?.value
    let sVersion = this.formulario.get('sCodVersion')?.value
    let sId = this.IdHojaIngenieria
    var sCod_Usuario = GlobalVariable.vusu
    let video_file = this.obtenerParteDespuesDeUltimoSlash(this.URLVideo)

    const formData = new FormData();
    formData.append('Accion', accion);
    formData.append('Tipo', 'media');
    formData.append('Cod_EstPro', sCodEstPro);
    formData.append('Cod_Version', sVersion);
    formData.append('Archivo', '');
    formData.append('Archivo_Cargado', video_file);
    formData.append('Cod_Usuario', sCod_Usuario);
    formData.append('IdHojaIngenieria', '0');

    
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.HojaIngenieriaUploadFile(
      formData
    ).subscribe(
      (result: any) => {
        //console.log(result)
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open("Se elimino archivo correctamente", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.URLVideo = ''
          this.ExisteVideo = false
        }
        this.SpinnerService.hide();

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })

  }

  enviarPasosItems() {
    //console.log(this.dataItemsWithPasos)
    this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaPasos(
      this.dataItemsWithPasos
    ).subscribe(
      (result: any) => {
        //console.log(result)
        if (result.msg == 'OK') {
          this.dataItemsWithPasos = [];
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

  getPasosHoja(){

    this.Cod_Accion   = 'F'
    this.SpinnerService.show();

    this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaComplemento(
      this.Cod_Accion,
        this.sCodEstPro,
        '','','','','','','','','','','','','','','','',
        this.IdHojaIngenieria
      ).subscribe(
      (result: any) => {
        //console.log(result)
        if(result.length > 0){
          this.dataItemsPasos = result
        }
        this.SpinnerService.hide()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  replaceSingleQuotesWithDoubleQuotes(input: string): string {
    return input.replace(/'/g, '"')
  }

  replaceNewLinesWithBr(text: string): string {
    text = text.replace(/'/g, '"')
    return text.replace(/\n/g, '<br>')
  }

  replaceBrWithNewLines(text: string): string {
    return text.replace(/<br\s*[\/]?>/gi, '\n');
  }

  obtenerParteDespuesDeUltimoSlash(ruta: string): string {
    const ultimaBarraIndex = ruta.lastIndexOf('/')
    if (ultimaBarraIndex !== -1) {
      return ruta.substring(ultimaBarraIndex + 1);
    } else {
      return ruta;
    }
  }

  addUniqueObject(arr: Estilo[], obj: Estilo): Estilo[] {
    if (!arr.some(item => item.Cod_EstCli === obj.Cod_EstCli)) {
      arr.push(obj);
    }
    return arr;
  }


}

 