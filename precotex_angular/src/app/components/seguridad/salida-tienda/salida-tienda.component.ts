import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { DatePipe } from "@angular/common";
import * as _moment from 'moment';
import { BrowserCodeReader } from '@zxing/browser';
import { BrowserMultiFormatReader } from '@zxing/browser';
//import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';

import { GlobalVariable } from 'src/app/VarGlobals';
import { SeguridadRondasService } from 'src/app/services/seguridad-rondas.service';
import { ExceljsService } from 'src/app/services/exceljs.service';

@Component({
  selector: 'app-salida-tienda',
  templateUrl: './salida-tienda.component.html',
  styleUrls: ['./salida-tienda.component.scss']
})
export class SalidaTiendaComponent implements OnInit {
  
  //@ViewChild('action') action!: NgxScannerQrcodeComponent;

  qrResult: string | null = null;
  camaraActiva: boolean = false;
  qrInvalido: boolean = false;
  leerPDA: boolean = false;
  selectedDevice: MediaDeviceInfo | undefined;
  dispositivosDisponibles: MediaDeviceInfo[] = [];

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;

  fecha = new Date();
  ll_listado: boolean = true;
  ll_nuevo: boolean = false;
  ll_obsSalida: boolean = false;

  formulario = this.formBuilder.group({
    Tipo: ['', Validators.required],
    Serie: ['', Validators.required],
    Numero: ['', Validators.required],
    Dni: [{value: "", disabled: true}],
    Cliente: [{value: "", disabled: true}],
    DniValida: ['', Validators.required],
    qrLectura: [''],
    Observacion: [''],
    Estado: [''],
    Num_Items: [0, Validators.required]
  },{
    validators: this.validarNumItems
  });

  dataTipo: any[] = [
    {tipo: '03', documento: 'BOLETA DE VENTA'},
    {tipo: '04', documento: 'FACTURA'}
  ];

  dataForExcel = [];
  displayedColumns1: string[] = ['fec_Registro','clp_numdoc','clp_razsoc','ser_Sunat','doc_Numero','usu_Registro','flg_Estado','Acciones']
  displayedColumns2: string[] = ['art_codigo','art_descrip','par_desccolor','uni_codigo','mod_cantreal']

  dataSource1: MatTableDataSource<any>;
  dataSource2!: MatTableDataSource<any>;

  @ViewChild('sortData1') sortData1 = new MatSort();
  @ViewChild('sortData2') sortData2 = new MatSort();

  @ViewChild('paginatorData1') paginatorData1!: MatPaginator;
  @ViewChild('paginatorData2') paginatorData2!: MatPaginator;
  
  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private seguridadRondasService: SeguridadRondasService,
    private datePipe: DatePipe,
    private exceljsService: ExceljsService
  ) {
    this.dataSource1 = new MatTableDataSource();
  }

  ngOnInit(): void {
    //this.obtenerDispositivos();
    this.listarSalidaTienda();
  }

  listarSalidaTienda(){
    let data: any = {
      Accion: 'L',
      id_Registro: 0,
      doc_Tipo: '',
      doc_Serie: '',
      doc_Numero: '',
      ser_Sunat: '',
      dni_Valida: '',
      obs_Registro: '',
      flg_Estado: '',
      fec_Registro: this.fecha ? this.datePipe.transform(this.fecha, 'yyyy-MM-ddTHH:mm:ss') : '',
      usu_Registro: GlobalVariable.vusu,
    }
    
    this.spinnerService.show();
    this.seguridadRondasService.listarSalidaTienda(data)
      .subscribe((result: any) => {
        if (result.length > 0) {
          //console.log(result)
          this.dataSource1 = new MatTableDataSource(result);
          this.dataSource1.paginator = this.paginatorData1;
          this.dataSource1.sort = this.sortData1;

          this.spinnerService.hide();
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource1 = new MatTableDataSource([]);
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }  

  onInsertarRegistro(){
    this.ll_listado = false;
    this.ll_nuevo = true;
    this.ll_obsSalida = false;

    this.formulario.controls['Tipo'].enable();
    this.formulario.controls['Serie'].enable();
    this.formulario.controls['Numero'].enable();
    this.formulario.controls['DniValida'].enable();
    this.formulario.controls['Observacion'].enable();
  }

  onBuscarRegistro(){
    const formValues = this.formulario.getRawValue();
    let numero: string = '00000000' + formValues.Numero.trim();

    formValues.Numero = numero.substring(numero.length - 8);

    this.spinnerService.show();
    this.seguridadRondasService.listarMovimientoTienda(formValues.Tipo, formValues.Serie, formValues.Numero)
      .subscribe((result: any) => {
        if (result.length > 0) {
          //console.log(result)
          this.dataSource2 = new MatTableDataSource(result);
          this.dataSource2.paginator = this.paginatorData2;
          this.dataSource2.sort = this.sortData2;

          this.formulario.patchValue({
            Dni: result[0].clp_numdoc.trim(),
            Cliente: result[0].clp_razsoc
          });
          
          this.spinnerService.hide();
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource2 = new MatTableDataSource([]);
          this.spinnerService.hide();
        }

        this.formulario.patchValue({
          Num_Items: result.length
        });

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );    
  }

  onGrabarRegistro(){
    let data: any = {
      Accion: 'I',
      id_Registro: 0,
      doc_Tipo: this.dataSource2.data[0].moc_tipdocrf1,
      doc_Serie: this.dataSource2.data[0].moc_serdocrf1,
      doc_Numero: this.dataSource2.data[0].moc_numdocrf1,
      ser_Sunat: this.dataSource2.data[0].ser_sunat,
      dni_Valida: this.formulario.get('DniValida')?.value,
      obs_Registro: this.formulario.get('Observacion')?.value,
      flg_Estado: this.formulario.get('Estado')?.value,
      fec_Registro: '',
      usu_Registro: GlobalVariable.vusu,
    }
    
    this.spinnerService.show();
    this.seguridadRondasService.listarSalidaTienda(data)
      .subscribe((result: any) => {
        if (result.length > 0) {
          if (result[0].Id_Registro != 0){
            this.onLimpiarRegistro();
            this.listarSalidaTienda();
            this.ll_listado = true;
          }else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.spinnerService.hide();  
          }
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }

  onExportarRegistro(){
    this.dataForExcel = [];
    if(this.dataSource1.filteredData.length > 0){
      let dataReporte: any[] = [];
      
      this.dataSource1.filteredData.forEach((row: any) => {
        let data: any = {};

        data.FechaRegistro = this.datePipe.transform(row.fec_Registro, 'yyyy-MM-dd HH:mm');
        data.NumeroDocumento = row.clp_numdoc;
        data.ApellidosNombres = row.clp_razsoc;
        data.Serie = row.ser_Sunat;
        data.Numero = row.doc_Numero;
        data.Responsable = row.usu_Registro;
        data.ValidaDNI = row.dni_Valida,
        data.Observacion = row.obs_Registro;
        data.Estado = row.flg_Estado == '1' ? 'NORMAL' : 'OBSERVADO';
        dataReporte.push(data);
      });      

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'CONTROL SALIDA TIENDA',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);

    } else{
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  onLimpiarRegistro(){
    this.dataSource2 = new MatTableDataSource([]);
    this.ll_obsSalida = false;

    this.formulario.patchValue({
      Serie: '',
      Numero: '',
      Dni: '',
      Cliente: '',
      DniValida: '',
      Observacion: '',
      Estado: '',
      Num_Items: 0
    });
  }
  
  onCerrarRegistro(){
    this.ll_listado = true;
    this.onLimpiarRegistro();
  }

  onDetalleRegistro(data: any){
    this.formulario.patchValue({
      Tipo: data.doc_Tipo,
      Serie: data.ser_Sunat,
      Numero: data.doc_Numero,
      DniValida: data.dni_Valida,
      Observacion: data.obs_Registro,
      Estado: data.flg_Estado
    });

    this.formulario.controls['Tipo'].disable();
    this.formulario.controls['Serie'].disable();
    this.formulario.controls['Numero'].disable();
    this.formulario.controls['DniValida'].disable();
    this.formulario.controls['Observacion'].disable();

    this.onBuscarRegistro();
    this.ll_listado = false;
    this.ll_nuevo = false;
  }

  onValidaDocumento(documentoIdentidad: any){
    this.formulario.controls['Estado'].setValue('2');

    if(documentoIdentidad.length > 7){
      if(documentoIdentidad != this.formulario.get('Dni')?.value)
        this.ll_obsSalida = true;
      else {
        this.formulario.controls['Estado'].setValue('1');
        this.ll_obsSalida = false;
      }
    } else {
      this.ll_obsSalida = true;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  validarNumItems(form: FormGroup){
    const numItems = form.get('Num_Items')?.value;
    return numItems > 0 ? null : { mismatch: true };
  }
  
  onScannerPDA(){
    this.leerPDA = true;
  }

  onLecturaQR(qrLeido: any){
    let regex = /[|]/g;
    console.log(qrLeido)
    if(qrLeido != "" && qrLeido.match(regex) && qrLeido.match(regex).length == 9){
      this.formulario.patchValue({
        Tipo: qrLeido.substring(12, 14),
        Serie: qrLeido.substring(15, 19),
        Numero: qrLeido.substring(20, 28),
        qrLectura: ''
      });

      this.onBuscarRegistro();
    } else {
      this.matSnackBar.open('Codigo QR Inválido!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
      this.qrInvalido = true;
      this.qrResult = 'Código Inválido..!';
      this.formulario.controls['qrLectura'].setValue('');
    }
    this.leerPDA = false;
  }

  async onScannerQR() {
    let regex = /[|]/g;

    this.qrResult = "";
    this.camaraActiva = true;
    this.qrInvalido = false;
    const videoInputDevices = await BrowserCodeReader.listVideoInputDevices();
    const selectedDeviceId = videoInputDevices[1].deviceId;  // [0] Camara delantera / [1] Camara principal 

    const codeReader = new BrowserMultiFormatReader();
    const videoElement = document.querySelector('video');

    //codeReader.decodeFromVideoDevice(null, videoElement, (result, err, controls) => {
    codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement, (result, err, controls) => {
      if (result) {
        this.qrResult = result.getText();

        if(this.qrResult.match(regex) && this.qrResult.match(regex).length == 9){
          this.formulario.patchValue({
            Tipo: this.qrResult.substring(12, 14),
            Serie: this.qrResult.substring(15, 19),
            Numero: this.qrResult.substring(20, 28)
          });
        } else {
          this.matSnackBar.open('Codigo QR Inválido!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
          this.qrInvalido = true;
          this.qrResult = 'Código Inválido..!';
        }
        //alert(this.qrResult)
        this.camaraActiva = false;
        
        controls.stop();
        this.onBuscarRegistro();
      }
      if (err) {
        console.error(err);
      }

    });
  }

  onDeviceSelectChange(selected: any) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device || null;
  }
  
  obtenerDispositivos() {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        //console.log(devices)
        //alert(devices)
        this.dispositivosDisponibles = devices.filter(
          (d) => d.kind === 'videoinput'
        );
        if (this.dispositivosDisponibles.length > 0) {
          this.selectedDevice = this.dispositivosDisponibles[0];
          //alert(this.selectedDevice)
        }
      })
      .catch((err) => {
        console.error('Error al obtener cámaras:', err);
      });
  }

}
