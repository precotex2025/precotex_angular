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

//Data proveniente del padre cuando se edita
interface data {
  Id_SalidaArtes: number;
  Cod_OrdPro: string;
  Cod_Cliente: string;
  Nom_Cliente: string;
  Cod_EstCli: string;
  Cod_TemCli: string;
  Nom_TemCli:string;
  Cod_Present:string;
  Des_Present:string;
  Lote:string;
  Muestra: number;
  Ruta_Prenda:string;
  Supervisor:string;
  Observacion:string;
  Fecha_Ingreso: string;
  Fecha_Hora_Ingreso: string;
}

interface Supervisor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

interface Defecto {
  Cod_Motivo: string;
  Descripcion: string;
  Cantidad: number;
  Tipo: string;
}


@Component({
  selector: 'app-dialog-produccion-inspeccion-salida-crear',
  templateUrl: './dialog-produccion-inspeccion-salida-crear.component.html',
  styleUrls: ['./dialog-produccion-inspeccion-salida-crear.component.scss']
})

export class DialogProduccionInspeccionSalidaCrearComponent implements OnInit {

  Cod_Accion = ''
  Cod_OrdPro = ''
  Cod_Cliente = ''
  Cod_EstCli = ''
  Cod_TemCli = ''
  Nom_TemCli = ''
  Des_Present = ''
  IdSalidaArtes = 0
  lstOperacionColor:any = []
  lstOperacionTemporada:any = []
  Titulo = ''
  btnAccionModificar: boolean = false
  Num_Hoja_Inspeccion: number = 0
  dataItemsWithDefectos: any
  dataSendActualizar: any
  grdPanelVisible: boolean = false

  Abr_Motivo = ''
  Defecto = ''
  Cod_Motivo = ''
  dataItemsDefectos:any = [];

  lstOptTipoPrenda: any[] = [
    { id: "Prenda", name: "Prenda" },
    { id: "Pieza", name: "Pieza" }
  ];

  lstTipoDefecto: any[] = [
    { id: "Leve", name: "Defecto Leve" },
    { id: "Critico", name: "Defecto Crítico" }
  ];
  
  optResultado: any[] = [
    { id: "1", name: "Aprobado"  },
    { id: "0", name: "Rechazado" }
  ];

  /*dataItemsOps: any[] = [
    {cod_ordpro:'F8285', Des_Present:'WHITE PB-100', Des_Destino: 'VARIOS', Flg_Estado:'1', Sel:'0'},
    {cod_ordpro:'F8080', Des_Present:'STONE', Des_Destino: 'VARIOS', Flg_Estado:'0', Sel:'1'}
  ]*/
  dataItemsOps: any[] = []
  dataItemsOpsSend: any[] = []
  		
  listar_operacionSupervisor:   Supervisor[] = [];
  filtroOperacionSupervisor:    Observable<Supervisor[]> | undefined;

  formulario = this.formBuilder.group({
    sOP: ['', Validators.required],
    sEstilo: [''],
    sCliente: [''],
    sColor: ['', Validators.required],
    sTemporada: [''],
    sLote: [''],
    sMuestra:[''],
    sRutaPrenda:['Prenda'],

    sCodigo: [''],
    sDescripcion: [''],
    sCantidad: [''],
    sTipoDefecto: ['Leve'],

    sSupervisor: [''],
    sFechaHoraIngreso: [''],
    sObservacion: ['']
  });

  constructor(
    private formBuilder: FormBuilder, 
    private matSnackBar: MatSnackBar, 
    private SpinnerService: NgxSpinnerService, 
    private datepipe: DatePipe,
    private produccionArtesInspeccionService: ProduccionArtesInspeccionService,
    public dialog_: MatDialogRef<DialogProduccionInspeccionSalidaCrearComponent>,
    @Inject(MAT_DIALOG_DATA) public data: data,
  ){
      
   

  }


  ngOnInit(): void { 
    this.formulario.controls['sFechaHoraIngreso'].disable()
    this.formulario.controls['sCliente'].disable()
    this.formulario.controls['sEstilo'].disable()
    this.fechaHoraDefaultIngreso()
    this.obtenerInformacion()
  }

  buscarClienteEstiloTemxOP(){

    this.formulario.controls['sCliente'].setValue('')
    this.formulario.controls['sEstilo'].setValue('')
    this.formulario.controls['sTemporada'].setValue('')
    this.Cod_OrdPro = this.formulario.get('sOP')?.value
    if(this.Cod_OrdPro.length == 5){
    this.Cod_Accion   = 'E'
    this.SpinnerService.show();

    this.produccionArtesInspeccionService.MantenimientoProduccionArtesSalidaInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_Cliente,
      '',
      this.Cod_EstCli,
      this.Cod_TemCli,
      '','','','',0,'','','','','','','','',
      this.IdSalidaArtes
      ).subscribe(
      (result: any) => {
        //console.log(result)
        if(result.length > 0){
          this.formulario.controls['sCliente'].setValue(result[0].NOM_CLIENTE)
          this.formulario.controls['sEstilo'].setValue(result[0].COD_ESTCLI)
          this.formulario.controls['sTemporada'].setValue(result[0].COD_TEMCLI)
          this.Cod_Cliente = result[0].COD_CLIENTE
          this.Cod_EstCli = result[0].COD_ESTCLI
          this.Cod_TemCli = result[0].COD_TEMCLI
          this.Nom_TemCli = result[0].NOM_TEMCLI
          this.CargarOperacionTemporada()
          this.CargarOperacionColor()
          this.grdPanelVisible = true
          this.SpinnerService.hide()
        }else{
          this.matSnackBar.open('La OP no existe...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          this.lstOperacionColor = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }else{
      this.lstOperacionColor = []
      this.lstOperacionTemporada = []
      this.dataItemsOps = []
      this.grdPanelVisible = false
    }
  }

  CargarOperacionTemporada() {

    this.produccionArtesInspeccionService.Cf_Busca_TemporadaCliente(this.Cod_Cliente, this.Cod_EstCli).subscribe(
      (result: any) => {
        this.lstOperacionTemporada = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  CargarOperacionColor() {
    this.produccionArtesInspeccionService.SM_Presentaciones_OrdPro(this.Cod_OrdPro).subscribe(
      (result: any) => {
        this.lstOperacionColor = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  selTemporada(item){
    this.Cod_TemCli = item.Codigo
    this.Nom_TemCli = item.Descripcion
    this.formulario.controls['sColor'].setValue('')
    this.dataItemsOps = []
  }

  selColor(item){
    this.Des_Present = item.Des_Present
    this.getOpsAprobarRechazar()
  }

  fechaHoraDefaultIngreso(){ 
    let fechaIni = new Date();
    this.formulario.patchValue({ sFechaHoraIngreso: this.datepipe.transform(fechaIni, 'yyyy-MM-ddTHH:mm')})
  }
  
  obtenerInformacion(){
    this.definirTitulo()
    this.CargarOperacionSupervisor()
  }


  RegistrarHoja() {
    if (this.formulario.valid) {
      this.Cod_Accion   = 'I'
      let sNomCli = this.formulario.get('sCliente').value
      let sNomTemCli = this.Nom_TemCli
      let sTemporada = this.formulario.get('sTemporada').value
      let Cod_Present = this.formulario.get('sColor').value
      let sLote = this.formulario.get('sLote').value
      let sMuestra = this.formulario.get('sMuestra').value
      let sRutaPrenda = this.formulario.get('sRutaPrenda').value
      let sFechaHoraIngreso = this.formulario.get('sFechaHoraIngreso').value
      let sSupervisor = this.formulario.get('sSupervisor').value
      let sObservacion = this.formulario.get('sObservacion').value

      console.log(
        'Accion :', this.Cod_Accion,
        'Cod_OrdPro :',this.Cod_OrdPro,
        'Cod_Cliente :',this.Cod_Cliente,
        'sNomCli :',sNomCli,
        'Cod_EstCli :',this.Cod_EstCli,
        'sTemporada :',sTemporada,
        'sNomTemCli :',sNomTemCli,
        'Cod_Present :',Cod_Present,
        'Des_Present :',this.Des_Present,
        'sLote :',sLote,
        'sMuestra :',sMuestra,
        'sRutaPrenda :',sRutaPrenda,
        'sFechaHoraIngreso :',sFechaHoraIngreso,
        'sSupervisor :',sSupervisor,
        'sObservacion :',sObservacion,
        'IdSalidaArtes :',this.IdSalidaArtes
      )

      this.SpinnerService.show();
      this.produccionArtesInspeccionService.MantenimientoProduccionArtesSalidaInspeccionComplemento(
        this.Cod_Accion,
        this.Cod_OrdPro,
        this.Cod_Cliente,
        sNomCli,
        this.Cod_EstCli,
        sTemporada,
        this.Nom_TemCli,
        Cod_Present,
        this.Des_Present,
        sLote,
        sMuestra,
        sRutaPrenda,
        sFechaHoraIngreso,
        sSupervisor,
        sObservacion,
        '','','','',
        this.IdSalidaArtes
        ).subscribe(
        (result: any) => {
        if (result[0].Respuesta == 'OK'){
          //console.log(result)
          this.Num_Hoja_Inspeccion = result[0].Num_Hoja_Inspeccion
          this.dataItemsWithDefectos= {'Idhoja':this.Num_Hoja_Inspeccion, 'Accion':'I','Defectos':this.dataItemsDefectos}
          this.enviarItemsDefectos()
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


  enviarItemsDefectos() {
    //console.log(this.dataItemsWithDefectos)
    //this.dialog_.close();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesSalidaInspeccionOpciones(
      this.dataItemsWithDefectos
    ).subscribe(
      (result: any) => {
        //console.log(result)
        if (result.msg == 'OK') {
          this.dataItemsWithDefectos = [];
          //this.SpinnerService.hide();
          this.enviarItemsOps()
          //this.dialog_.close();
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  enviarItemsOps(){

    this.dataItemsOps.forEach(element => {

      if (element.Flg_Estado == '1' || element.Flg_Estado == '0') {

       this.dataItemsOpsSend.push({
          "Cod_OrdPro": element.cod_ordpro,
          "Cod_Cliente": element.Cod_Cliente,
          "sNomCli": "",
          "Cod_EstCli": element.cod_estcli,
          "Cod_TemCli": element.Cod_TemCli,
          "Nom_TemCli": element.Nom_TemCli,
          "Cod_Present": element.Cod_Present,
          "Des_Present": element.Des_Present,
          "Lote": "",
          "Muestra": 0,
          "sRutaPrenda": "",
          "sFechaHoraIngreso":"",
          "sSupervisor":"",
          "Cod_Destino": element.cod_destino,
          "Des_Destino": element.Des_Destino,
          "Cod_EstPro": element.cod_estpro,
          "Flg_Estado_Op": element.Flg_Estado,
          "sObservacion": "",
          "Cod_Usuario": GlobalVariable.vusu
        })

      }

    });
    //console.log({'Idhoja':this.Num_Hoja_Inspeccion, 'Accion':'G','Ops':this.dataItemsOpsSend})
    if(this.dataItemsOpsSend.length > 0){

      this.produccionArtesInspeccionService.MantenimientoProduccionArtesSalidaInspeccionOps(
        {'Idhoja':0, 'Accion':'G','Ops':this.dataItemsOpsSend}
      ).subscribe(
        (result: any) => {
          //console.log(result)
          if (result.msg == 'OK') {
            this.dataItemsOpsSend=[]
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.SpinnerService.hide();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }

    this.SpinnerService.hide();
    this.dialog_.close();

  }
 
 
  definirTitulo(){
    //console.log(this.data.Id_SalidaArtes)
    if(this.data.Id_SalidaArtes == undefined){//Boton nuevo pulsado
      this.Titulo  = 'Crear nuevo registro'
    }else{
     this.Titulo    = 'Modificar registro'
     this.Cod_OrdPro = this.data.Cod_OrdPro
     this.Cod_Cliente = this.data.Cod_Cliente
     this.Cod_EstCli = this.data.Cod_EstCli
     this.Cod_TemCli = this.data.Cod_TemCli
     this.Nom_TemCli = this.data.Nom_TemCli
     this.Des_Present = this.data.Des_Present
     this.IdSalidaArtes = this.data.Id_SalidaArtes
     this.btnAccionModificar = true
     this.CargarOperacionTemporada()
     this.CargarOperacionColor()
     this.getDefectosHoja()
     this.getOpsAprobarRechazar()
     this.grdPanelVisible = true
     this.formulario.patchValue({
        sOP: this.data.Cod_OrdPro,
        sCliente: this.data.Nom_Cliente,
        sEstilo: this.data.Cod_EstCli,
        sTemporada: this.data.Cod_TemCli,
        sColor: this.data.Cod_Present,
        sRutaPrenda: this.data.Ruta_Prenda,
        sLote: this.data.Lote,
        sMuestra: this.data.Muestra,
        sSupervisor: this.data.Supervisor,
        sObservacion: this.data.Observacion,
        sFechaHoraIngreso: this.datepipe.transform(this.data.Fecha_Hora_Ingreso['date'], 'yyyy-MM-ddTHH:mm')
     });
        
    this.formulario.controls['sOP'].disable()
    this.formulario.controls['sEstilo'].disable()
    this.formulario.controls['sCliente'].disable()
    this.btnAccionModificar = true
    }
  }


  ModificarHoja(){

    this.Cod_Accion = 'U'
    let sNomCli = this.formulario.get('sCliente').value
    let sNomTemCli = this.Nom_TemCli
    let sTemporada = this.formulario.get('sTemporada').value
    let Cod_Present = this.formulario.get('sColor').value
    let sLote = this.formulario.get('sLote').value
    let sMuestra = this.formulario.get('sMuestra').value
    let sRutaPrenda = this.formulario.get('sRutaPrenda').value
    let sFechaHoraIngreso = this.formulario.get('sFechaHoraIngreso').value
    let sSupervisor = this.formulario.get('sSupervisor').value
    let sObservacion = this.formulario.get('sObservacion').value

    this.dataSendActualizar = {
      'Accion':this.Cod_Accion,
      'Cod_OrdPro':this.Cod_OrdPro,
      'Cod_Cliente': this.Cod_Cliente,
      'sNomCli': sNomCli,
      'Cod_EstCli': this.Cod_EstCli,
      'Cod_TemCli': sTemporada,
      'Nom_TemCli': sNomTemCli,
      'Cod_Present': Cod_Present,
      'Des_Present': this.Des_Present,
      'Lote': sLote,
      'Muestra': sMuestra,
      'sRutaPrenda': sRutaPrenda,
      'sFechaHoraIngreso': sFechaHoraIngreso,
      'sSupervisor': sSupervisor,
      'sObservacion': sObservacion,
      'Cod_Destino':'',
      'Des_Destino':'',
      'Cod_EstPro':'',
      'Flg_Estado_Op':'',
      'Cod_Usuario': GlobalVariable.vusu,
      'IdSalidaArtes':this.IdSalidaArtes,
      'Defectos': this.dataItemsDefectos
    }
    //console.log(this.dataSendActualizar)
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesSalidaInspeccionActualizarWithOpciones(
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

  CargarOperacionSupervisor(){
    this.Cod_Accion   = 'S'
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesSalidaInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_Cliente,
      '',
      this.Cod_EstCli,
      this.Cod_TemCli,
      '','','','',0,'','','','','','','','',
      this.IdSalidaArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          //console.log(result);
          this.listar_operacionSupervisor = result
          this.RecargarOperacionSupervisor()
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  RecargarOperacionSupervisor(){
    this.filtroOperacionSupervisor = this.formulario.controls['sSupervisor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionSupervisor(option) : this.listar_operacionSupervisor.slice())),
    );
  }

  private _filterOperacionSupervisor(value: string): Supervisor[] {
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_operacionSupervisor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }

  BuscarMotivo(event){
    this.Abr_Motivo = event.target.value;
    
    if (this.Abr_Motivo == null) {
      this.Abr_Motivo = ''
    }
    if (this.Abr_Motivo.length > 3) {
      this.Abr_Motivo = '';
    } else {

      this.Cod_Accion = 'B'
      this.SpinnerService.show();
      this.produccionArtesInspeccionService.MantenimientoProduccionArtesSalidaInspeccionComplemento(
        this.Cod_Accion,
        this.Cod_OrdPro,
        this.Cod_Cliente,
        this.Abr_Motivo,
        this.Cod_EstCli,
        this.Cod_TemCli,
        '','','','',0,'','','','','','','','',
        this.IdSalidaArtes
      ).subscribe(
        (result: any) => {
          if (result.length > 0) {
            //console.log(result)
            this.Cod_Motivo = result[0].Cod_Motivo
            this.Defecto = (result[0].Descripcion)
            this.formulario.controls['sDescripcion'].setValue(result[0].Descripcion)
            this.SpinnerService.hide();
          }
          else {
            this.SpinnerService.hide();
            this.matSnackBar.open('Abr de motivo no existe..!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        })
        this.SpinnerService.hide();
    }
  }

  addDefecto(){
    let codigo_motivo = this.Cod_Motivo
    let descripcion_motivo = this.Defecto
    let cantidad_motivo = this.formulario.get('sCantidad').value
    let tipo_motivo = this.formulario.get('sTipoDefecto').value

    if(codigo_motivo!='' && cantidad_motivo!=''){
      this.addUniqueDefectoObject(this.dataItemsDefectos, {
        Cod_Motivo: codigo_motivo, 
        Descripcion: descripcion_motivo,
        Cantidad: cantidad_motivo,
        Tipo: tipo_motivo
      })
      this.formulario.controls['sCodigo'].setValue('')      
      this.formulario.controls['sDescripcion'].setValue('')   
      this.formulario.controls['sCantidad'].setValue('')  

    }else{
      this.matSnackBar.open('Ingrese un defecto o cantidad valida ', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    }
  }

  addUniqueDefectoObject(arr: Defecto[], obj: Defecto): Defecto[] {
    if (!arr.some(item => (item.Cod_Motivo === obj.Cod_Motivo && item.Descripcion === obj.Descripcion))) {
      arr.push(obj);
    }
    return arr;
  }

  supItemMotivo(elemento){
      //console.log(elemento)
      const indice = this.dataItemsDefectos.findIndex(item => item === elemento)
      this.dataItemsDefectos.splice(indice, 1)
    
  }

  getDefectosHoja(){

    this.Cod_Accion   = 'F'
    this.SpinnerService.show();

    this.produccionArtesInspeccionService.MantenimientoProduccionArtesSalidaInspeccionComplemento(
      this.Cod_Accion,
      this.Cod_OrdPro,
      this.Cod_Cliente,
      '',
      this.Cod_EstCli,
      this.Cod_TemCli,
      '','','','',0,'','','','','','','','',
      this.IdSalidaArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          this.dataItemsDefectos = result
        }
        this.SpinnerService.hide()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  changeRadio(event, item) {

    if (event.value == '1') {

      this.dataItemsOps.forEach(element => {

        if (element.cod_ordpro == item.cod_ordpro && element.cod_estcli == item.cod_estcli) {
            element.Flg_Estado = '1';
        }

      });

    } else {

      this.dataItemsOps.forEach(element => {
        if (element.cod_ordpro == item.cod_ordpro && element.cod_estcli == item.cod_estcli) {
            element.Flg_Estado = '0';
        }

      });
    }

    //console.log(this.dataItemsOps)

  }


  getOpsAprobarRechazar(){

    this.Cod_Accion   = 'O'
    this.SpinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesSalidaInspeccionComplemento(
        this.Cod_Accion,
        this.Cod_OrdPro,
        this.Cod_Cliente,
        '',
        this.Cod_EstCli,
        this.Cod_TemCli,
        this.Nom_TemCli,
        '',
        this.Des_Present,
        '',
        0,
        '',
        '',
        '',
        '','','','','',
        this.IdSalidaArtes
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          this.dataItemsOps = result
          this.SpinnerService.hide()
        }else{
          //this.matSnackBar.open('La OP no existe...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  /**reocrrer array ops y agregar array a enviar*/

}

 