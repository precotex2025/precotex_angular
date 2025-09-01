import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { GlobalVariable } from '../../../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefectosAlmacenDerivadosService } from 'src/app/services/defectos-almacen-derivados.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelect } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;



interface Derivados {
  Abr_Motivo: string;
  MotivoDefecto: string;
  TotxMotivo: string;
  m: string;
  x: string;
  xl: string;
  total: number;
}


interface Listar_Cliente {
  Nom_Cliente: string;
}

interface Talla {
  Cod_Talla: string
}

interface Cliente {
  Cod_Cliente: string;
  Nom_Cliente: string;
  Abr_Cliente: string;
}

interface Temporada {
  Codigo: string;
  Descripcion: string;
  Stock: string
}
interface Color {
  Cod_ColCli: string;
  Nom_ColCli: string;
}

interface Tipo {
  Cod_Tipo: string;
  Nom_Tipo: string;
  background: string;
  Clasificacion: any;
}

interface Clasificacion {
  Cod_Clasificacion: string;
  Nom_Clasificacion: string
}

@Component({
  selector: 'app-dialog-derivados',
  templateUrl: './dialog-derivados.component.html',
  styleUrls: ['./dialog-derivados.component.scss'],
})


export class DialogDerivadosComponent implements OnInit, AfterViewInit {

  Tipos: Tipo[] = [
    { Cod_Tipo: 'P', Nom_Tipo: 'Produccion', background: 'background-color:white;',
      Clasificacion: [
        {id:'S', name:'Segundas A'},
        {id:'B', name:'Segundas B'},
        {id:'T', name:'Terceras'},
        {id:'E', name:'Especiales'}
      ]
    },
    { Cod_Tipo: 'R', Nom_Tipo: 'Recuperacion', background: 'background-color:white;', 
      Clasificacion: [
        {id:'E', name:'Especiales'},
        {id:'L', name:'Super Especiales'}
      ] 
    },
    /*{ Cod_Tipo: 'X', Nom_Tipo: 'Segundas Vend.', background: 'background-color:white;', Clasificacion: [] },
    { Cod_Tipo: 'S', Nom_Tipo: 'Segundas Export.', background: 'background-color:white;', Clasificacion: [] },*/
    { Cod_Tipo: 'A', Nom_Tipo: 'Adicional 2.', background: 'background-color:orange;', 
      Clasificacion: [
        {id:'A', name:'Tipo A (Mercado Local)'},
        {id:'B', name:'Tipo B (Segundas)'},
        {id:'C', name:'Tipo C (Terceras)'}
      ]
    },
    { Cod_Tipo: '3', Nom_Tipo: 'Adicional 3.', background: 'background-color:#58D3F7',
      Clasificacion: [
        {id:'A', name:'Tipo A (Mercado Local)'},
        {id:'B', name:'Tipo B (Segundas)'},
        {id:'C', name:'Tipo C (Terceras)'}
      ]
     },
  ];

  Clasificaciones: Clasificacion[] = [
    { Cod_Clasificacion: 'S', Nom_Clasificacion: 'Segundas' },
    { Cod_Clasificacion: 'M', Nom_Clasificacion: 'Mercado Local' },
    { Cod_Clasificacion: 'T', Nom_Clasificacion: 'Terceras' },
    { Cod_Clasificacion: 'E', Nom_Clasificacion: 'Especiales' },
    { Cod_Clasificacion: 'X', Nom_Clasificacion: 'Segundas Vend.' },
    { Cod_Clasificacion: 'O', Nom_Clasificacion: 'Otros' }
  ];

  sCod_Usuario = GlobalVariable.vusu;

  listar_operacionEstilo: string[] = [''];
  listar_operacionTemporada: Temporada[] = [];
  listar_operacionColor: Color[] = [];
  listar_operacionCliente: Cliente[] = [];

  filtroOperacionCliente: Observable<Cliente[]> | undefined;
  filtroOperacionEstilo: Observable<string[]> | undefined;

  tallas: any = []
  lstClasificacion:any = [];

  Cod_Accion = ''
  Num_Auditoria = 0
  Cod_Cliente = ''
  Cod_Auditor = ''
  Fec_Auditoria = ''
  Total = 0
  Cod_EstCli = ''
  Cod_TemCli = ''
  Cod_ColCli = ''
  Glosa = ''
  Cod_Talla = ''
  Cod_Motivo = ''
  Can_Defecto = 0
  Op = ''
  Abr = ''
  Nom_Cliente = ''
  Abr_Motivo = ''
  filterValue = ''
  Numero_Auditoria_Cabecera = 0
  Codigo_Defecto_Eliminar = ''
  flg_btn_detalle = false
  flg_btn_cabecera = true
  flg_reset_estilo = false


  //variables para alerta > 5 %
  Altertas_Caidas_Global = ''
  Total_solicitado_Global = 0
  Total_requerido_Global = 0
  Defectos_Global = 0
  Caidas_solicitado_Global = 0
  Caidas_requerido_Global = 0

  //variables para alerta > 1%
  Altertas_Caidas_Global2 = ''
  Total_solicitado_Global2 = 0
  Total_requerido_Global2 = 0
  Defectos_Global2 = 0
  Caidas_solicitado_Global2 = 0
  Caidas_requerido_Global2 = 0



  Nom_TemCli = ''
  Tipo_Registro = ''
  Clasificacion = ''

  myControl = new FormControl();
  fec_registro = new FormControl(new Date())

  formulario = this.formBuilder.group({
    sCliente: [''],
    sEstilo: [''],
    sColor: [''],
    sAuditor: [''],
    sAbr: [''],
    cod: [''],
    defecto: [''],
    s: [''],
    m: [''],
    x: [''],
    xl: [''],
    cant: [''],
    sTemporada: [''],
    sOP: [''],
    sGlosa: [''],
    sIngreso: [''],
    Cod_Motivo: [''],
    sCodCli: [''],
    sCodEst: [''],
    Tipo: [''],
    Clasificacion: ['']
    /*sCodTemp:   [''],
    sCodCli:    [''],
    sCodEst:    ['']
    this.formulario.controls['sCodCli'].setValue(result[0].Cod_Cliente)
    this.formulario.controls['sCodTemp'].setValue(result[0].Cod_TemCli)
    this.formulario.controls['sCodEst'].setValue(result[0].Cod_EstCli)*/


  })


  listar_cliente: Listar_Cliente[] = [];

  dataSource: MatTableDataSource<Derivados>;

  displayedColumns: string[] = ['Codigo', 'Defecto', 'Total'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<Derivados>();

  Tipo:string = '';
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private defectosAlmacenDerivadosService: DefectosAlmacenDerivadosService,
    private elementRef: ElementRef,
    private spinnerService: NgxSpinnerService,
    private renderer: Renderer2
    , @Inject(MAT_DIALOG_DATA) public data: any) {

    this.dataSource = new MatTableDataSource();

    /*this.formulario = formBuilder.group({
      Vehiculo:       ['', Validators.required],
      Placa:          ['', Validators.required],
    });*/


  }

  @ViewChild('s') inputS!: ElementRef;
  @ViewChild('abr') inputAbr!: ElementRef;
  @ViewChild('cod') inputCodMotivo!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  changeTipo(Tipo){
    //console.log(Tipo);
    this.Tipo = Tipo.Cod_Tipo;
    this.lstClasificacion = Tipo.Clasificacion
    //this.Tipo = event.value;
  }


  ngOnInit(): void {


    this.CargarOperacionCliente()

    this.fec_registro.disable()
    this.formulario.controls['sAuditor'].setValue(this.sCod_Usuario);
    this.formulario.controls['sAuditor'].disable()
    this.formulario.controls['sEstilo'].disable()
    this.formulario.controls['sTemporada'].disable()
    this.formulario.controls['sColor'].disable()
    this.DeshabilitarDetalle()

    console.log(this.flg_btn_detalle);
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

  /******************************LISTAR LAS TALLAS Y AGREGAR ESAS TALALS A LA COLUMNAS DEL TABLE******************** */
  ListarTallas() {
    this.displayedColumns = ['Codigo', 'Motivo', 'Total'];
    this.columnsToDisplay = this.displayedColumns.slice();
    this.Cod_ColCli = this.formulario.get('sColor')?.value

    this.defectosAlmacenDerivadosService.Cf_Busca_Derivado_Talla(this.Cod_Cliente, this.Cod_TemCli, this.Cod_EstCli, this.Cod_ColCli).subscribe(
      (result: any) => {
        this.tallas = result
        if (this.tallas.length > 0) {
          this.tallas.forEach((currentValue, index) => {

            this.displayedColumns.push(this.tallas[index].Cod_Talla)
          })

          this.columnsToDisplay = this.displayedColumns.slice()
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }
  /******************************LISTAR LAS TALLAS Y AGREGAR ESAS TALALS A LA COLUMNAS DEL TABLE******************** */

  /********************************* LISTAR EL DETALLE ********************************************* */

  ListarRegistroDefecto() {
    this.defectosAlmacenDerivadosService.Cf_Busca_Derivado_Detalle(this.Numero_Auditoria_Cabecera).subscribe(
      (result: any) => {

        this.dataSource.data = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  /********************************* LISTAR EL DETALLE ********************************************* */



  limpiar() {
    this.DeshabilitarDetalle()
    this.HabilitarCabcera()
    this.flg_reset_estilo = false
    this.formulario.controls['sAbr'].setValue('')
    this.formulario.controls['sCliente'].setValue('')
    this.formulario.controls['sEstilo'].setValue('')
    this.formulario.controls['sColor'].setValue('')
    this.formulario.controls['sTemporada'].setValue('')
    this.formulario.controls['cant'].setValue('')
    this.formulario.controls['defecto'].setValue('')
    this.formulario.controls['cod'].setValue('')
    this.formulario.controls['sOP'].setValue('')
    this.formulario.controls['sIngreso'].setValue('')
    this.formulario.controls['sGlosa'].setValue('')
    this.formulario.controls['Tipo'].setValue('')
    this.formulario.controls['Clasificacion'].setValue('')
    this.dataSource.data = []
    this.tallas = []
    this.Num_Auditoria = 0
    this.displayedColumns = ['Codigo', 'Motivo', 'Total'];
    this.columnsToDisplay = this.displayedColumns.slice();
    this.Altertas_Caidas_Global = ''

  }

  /************************FILTAR EL CLIENTE SEGUN SU ABR**************************** */
  BuscarCliente() {
    this.Abr = this.formulario.get('sAbr')?.value
    this.Abr_Motivo = ''
    this.Nom_Cliente = ''
    this.Cod_Accion = 'F'
    if ((this.Abr.length < 3 || this.Abr.length > 3)) {


      this.formulario.controls['sCliente'].setValue('')

      this.formulario.controls['sEstilo'].disable()
      this.formulario.controls['sEstilo'].setValue('')

      this.formulario.controls['sColor'].disable()
      this.formulario.controls['sColor'].setValue('')

      this.formulario.controls['sTemporada'].disable()
      this.formulario.controls['sTemporada'].setValue('')

      this.formulario.controls['cod'].disable()


      this.listar_operacionEstilo = [];
      this.listar_operacionTemporada = [];
      this.listar_operacionColor = [];


    }
    else {

      this.defectosAlmacenDerivadosService.mantenimientoDerivadosService(this.Abr, this.Abr_Motivo, this.Nom_Cliente, this.Cod_Accion).subscribe(
        (result: any) => {
          if (result.length > 0) {


            this.formulario.controls['sCliente'].setValue(result[0].Nom_Cliente);

            this.Cod_Cliente = result[0].Cod_Cliente

            this.formulario.controls['sEstilo'].enable()
            this.formulario.controls['sColor'].enable()
            this.formulario.controls['sTemporada'].enable()
            this.CargarOperacionEstilo()
          }
          else {
            this.formulario.controls['sAbr'].setValue('')

            this.formulario.controls['sCliente'].setValue('')

            this.formulario.controls['sEstilo'].disable()
            this.formulario.controls['sEstilo'].setValue('')

            this.formulario.controls['sColor'].disable()
            this.formulario.controls['sColor'].setValue('')

            this.formulario.controls['sTemporada'].disable()
            this.formulario.controls['sTemporada'].setValue('')

            this.formulario.controls['cod'].disable()

            this.matSnackBar.open('Abr de cliente incorrecto..!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

    }
  }
  /************************FILTAR EL CLIENTE SEGUN SU ABR**************************** */

  /************************FILTAR EL MOTIVO SEGUN SU CODIGO**************************** */

  BuscarMotivo() {

    this.Abr_Motivo = this.formulario.get('cod')?.value
    if (this.Abr_Motivo == null) {
      this.Abr_Motivo = ''
    }
    if (this.Abr_Motivo.length < 3 || this.Abr_Motivo.length > 3) {

      this.formulario.controls['defecto'].setValue('')

    }
    else {
      this.Abr = ''
      this.Nom_Cliente = ''
      this.Cod_Accion = 'M'
      this.spinnerService.show();
      this.defectosAlmacenDerivadosService.mantenimientoDerivadosService(this.Abr, this.Abr_Motivo, this.Nom_Cliente, this.Cod_Accion).subscribe(
        (result: any) => {
          if (result.length > 0) {
            this.formulario.controls['defecto'].setValue(result[0].Descripcion)
            this.Cod_Motivo = result[0].Cod_Motivo
            this.formulario.controls['Cod_Motivo'].setValue(result[0].Cod_Motivo)
            this.spinnerService.hide();
          }
          else {
            this.spinnerService.hide();
            this.matSnackBar.open('Abr de motivo no existe..!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => 
        {
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        })
    }

  }

  /************************FILTAR EL MOTIVO SEGUN SU CODIGO**************************** */

  abrFocus() {
    this.inputAbr.nativeElement.focus()
  }



  mostrarAlertaCaidasMayora1() {
    this.Total_solicitado_Global2 = 0
    this.Defectos_Global2 = 0
    this.Caidas_solicitado_Global2 = 0

    this.Cod_Accion = 'C'
    this.Num_Auditoria = this.Numero_Auditoria_Cabecera
    this.Cod_Cliente = this.formulario.controls['sCodCli'].value
    this.Cod_Auditor = ''
    this.Fec_Auditoria = ''
    this.Total = 0
    this.Cod_EstCli = this.formulario.controls['sCodEst'].value
    this.Cod_TemCli = this.formulario.get('sTemporada')?.value
    this.Cod_ColCli = this.formulario.get('sColor')?.value
    this.Glosa = ''
    this.Cod_Talla = ''
    this.Cod_Motivo = ''
    this.Can_Defecto = 0
    this.Op = ''
    this.Tipo_Registro = ''
    this.Clasificacion = ''
    /*console.log( this.Cod_Cliente)
    console.log( this.Cod_EstCli)
    console.log( this.Cod_TemCli)*/
    this.defectosAlmacenDerivadosService.Cf_Mantenimiento_Derivados(
      this.Cod_Accion,
      this.Num_Auditoria,
      this.Cod_Cliente,
      this.Cod_Auditor,
      this.Fec_Auditoria,
      this.Total,
      this.Cod_EstCli,
      this.Cod_TemCli,
      this.Cod_ColCli,
      this.Glosa,
      this.Cod_Talla,
      this.Cod_Motivo,
      this.Can_Defecto,
      this.Op,
      this.Tipo_Registro,
      this.Clasificacion
    ).subscribe(
      (result: any) => {
        if (result[0]['Alerta'] != undefined) {
          /* console.log(result[0]['Total'])
           console.log(result[0]['Defectos'])
           console.log(result[0]['Caidas'])*/


          this.Total_solicitado_Global2 = result[0]['Total_solicitado']
          this.Total_requerido_Global2 = result[0]['Total_requerido']
          this.Defectos_Global2 = result[0]['Defectos']
          this.Caidas_solicitado_Global2 = result[0]['Caidas_solicitado']
          this.Caidas_requerido_Global2 = result[0]['Caidas_requerido']

          this.Altertas_Caidas_Global2 = result[0]['Alerta']


          this.EnviarAlertaTelegramMayora1()
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))


  }

  mostrarAlertaCaidasMayora5() {
    this.Total_solicitado_Global = 0
    this.Defectos_Global = 0
    this.Caidas_solicitado_Global = 0
    this.Cod_Accion = 'A'
    this.Num_Auditoria = this.data
    this.Cod_Cliente = this.formulario.controls['sCodCli'].value
    this.Cod_Auditor = ''
    this.Fec_Auditoria = ''
    this.Total = 0
    this.Cod_EstCli = this.formulario.controls['sEstilo'].value
    this.Cod_TemCli = this.formulario.controls['sCodTemp'].value
    this.Cod_ColCli = this.formulario.controls['sColor'].value
    this.Glosa = ''
    this.Cod_Talla = ''
    this.Cod_Motivo = ''
    this.Can_Defecto = 0
    this.Op = ''
    this.Tipo_Registro = ''
    this.Clasificacion = ''
    this.defectosAlmacenDerivadosService.Cf_Mantenimiento_Derivados(
      this.Cod_Accion,
      this.Num_Auditoria,
      this.Cod_Cliente,
      this.Cod_Auditor,
      this.Fec_Auditoria,
      this.Total,
      this.Cod_EstCli,
      this.Cod_TemCli,
      this.Cod_ColCli,
      this.Glosa,
      this.Cod_Talla,
      this.Cod_Motivo,
      this.Can_Defecto,
      this.Op,
      this.Tipo_Registro,
      this.Clasificacion
    ).subscribe(
      (result: any) => {
        if (result[0]['Alerta'] != undefined) {
          /* console.log(result[0]['Total'])
           console.log(result[0]['Defectos'])
           console.log(result[0]['Caidas'])*/


          this.Total_solicitado_Global = result[0]['Total_solicitado']
          this.Total_requerido_Global = result[0]['Total_requerido']
          this.Defectos_Global = result[0]['Defectos']
          this.Caidas_solicitado_Global = result[0]['Caidas_solicitado']
          this.Caidas_requerido_Global = result[0]['Caidas_requerido']

          this.Altertas_Caidas_Global = result[0]['Alerta']


          this.EnviarAlertaTelegramMayora5()
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))


  }

  EnviarAlertaTelegramMayora1() {
    console.log(this.formulario.controls['sCodCli'].value)
    console.log(this.formulario.controls['sCliente'].value)
    console.log(this.formulario.controls['sCodEst'].value)
    console.log(this.formulario.get('sTemporada')?.value)
    console.log(this.Nom_TemCli)
    console.log(this.formulario.get('sColor')?.value)
    console.log(this.Total_solicitado_Global2)
    console.log(this.Total_requerido_Global2)
    console.log(this.Defectos_Global2)
    console.log(this.Caidas_solicitado_Global2)
    console.log(this.Caidas_requerido_Global2)



    this.defectosAlmacenDerivadosService.Cf_Enviar_Alerta_Audita_Defectos_Derivados_Telegram1(
      this.formulario.controls['sCodCli'].value,
      this.formulario.controls['sCliente'].value,
      this.formulario.controls['sCodEst'].value,
      this.formulario.get('sTemporada')?.value,
      this.Nom_TemCli,
      this.formulario.get('sColor')?.value,
      this.Total_solicitado_Global2,
      this.Total_requerido_Global2,
      this.Defectos_Global2,
      this.Caidas_solicitado_Global2,
      this.Caidas_requerido_Global2
    ).subscribe(

      (result: any) => {

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))


  }

  EnviarAlertaTelegramMayora5() {
    this.defectosAlmacenDerivadosService.Cf_Enviar_Alerta_Audita_Defectos_Derivados_Telegram5(
      this.formulario.controls['sCodCli'].value,
      this.formulario.controls['sCliente'].value,
      this.formulario.controls['sEstilo'].value,
      this.formulario.controls['sCodTemp'].value,
      this.formulario.controls['sTemporada'].value,
      this.formulario.controls['sColor'].value,
      this.Total_solicitado_Global,
      this.Total_requerido_Global,
      this.Defectos_Global,
      this.Caidas_solicitado_Global,
      this.Caidas_requerido_Global
    ).subscribe(

      (result: any) => {

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))


  }


  /******************************INSERTAR DETALLE **************************************** */
  InsertarFila() {

    this.Cod_Accion = 'U'
    this.Num_Auditoria = this.Numero_Auditoria_Cabecera
    this.Cod_Cliente = ''
    this.Cod_Auditor = ''
    this.Fec_Auditoria = ''
    this.Total = 0
    this.Cod_EstCli = this.formulario.controls['sCodEst'].value,
      this.Cod_TemCli = this.formulario.get('sTemporada')?.value
    this.Cod_ColCli = ''
    this.Glosa = ''
    this.Cod_Talla = this.formulario.get('s')?.value
    this.Cod_Motivo = this.formulario.controls['Cod_Motivo'].value
    this.Can_Defecto = this.formulario.get('cant')?.value
    this.Op = ''
    this.Tipo_Registro = ''
    this.Clasificacion = ''

    if (this.Cod_Talla != '' && this.Cod_Motivo != '' && this.Can_Defecto != 0 && this.Can_Defecto != null) {
      this.spinnerService.show();
      this.defectosAlmacenDerivadosService.Cf_Mantenimiento_Derivados(
        this.Cod_Accion,
        this.Num_Auditoria,
        this.Cod_Cliente,
        this.Cod_Auditor,
        this.Fec_Auditoria,
        this.Total,
        this.Cod_EstCli,
        this.Cod_TemCli,
        this.Cod_ColCli,
        this.Glosa,
        this.Cod_Talla,
        this.Cod_Motivo,
        this.Can_Defecto,
        this.Op,
        this.Tipo_Registro,
        this.Clasificacion
      ).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.spinnerService.hide();
            this.inputCodMotivo.nativeElement.focus()
            this.formulario.controls['cant'].setValue('')
            this.matSnackBar.open('Defecto agregado correctamente..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.ListarRegistroDefecto()
            this.mostrarAlertaCaidasMayora5()
            this.mostrarAlertaCaidasMayora1()
            
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.spinnerService.hide();
          }
        },
        (err: HttpErrorResponse) => {
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        })

    }

    else {
      this.matSnackBar.open('Complete todos los campos requeridos..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }


  }
  /******************************INSERTAR DETALLE **************************************** */

  /******************************REGISTRAR CABCERA **************************************** */
  RegistrarCabecera() {
    //asignar cod_cliente para posteriormente usarlo en la alerta 
    this.formulario.controls['sCodCli'].setValue(this.Cod_Cliente)
    this.formulario.controls['sCodEst'].setValue(this.Cod_EstCli)

    //asignar cod_cliente para posteriormente usarlo en la alerta 
    this.Cod_Accion = 'I'
    this.Num_Auditoria = 0
    this.Cod_Cliente
    this.Cod_Auditor = ''
    this.Fec_Auditoria = this.fec_registro.value
    this.Total = this.formulario.get('sIngreso')?.value
    this.Cod_EstCli = this.formulario.get('sEstilo')?.value
    this.Cod_TemCli = this.formulario.get('sTemporada')?.value
    this.Cod_ColCli = this.formulario.get('sColor')?.value
    this.Glosa = this.formulario.get('sGlosa')?.value
    this.Cod_Talla = ''
    this.Cod_Motivo = ''
    this.Can_Defecto = 0
    this.Op = this.formulario.get('sOP')?.value
    this.Tipo_Registro = this.formulario.get('Tipo')?.value
    this.Clasificacion = this.formulario.get('Clasificacion')?.value
    if (this.Total == 0 || this.Total == null) {
      this.Total = 0
    }

    if (this.Cod_Cliente != '' && this.Fec_Auditoria != '' && this.Cod_EstCli != '' && this.Cod_TemCli != '' && this.Cod_ColCli != '' && this.Tipo_Registro != '') {
      this.defectosAlmacenDerivadosService.Cf_Mantenimiento_Derivados(
        this.Cod_Accion,
        this.Num_Auditoria,
        this.Cod_Cliente,
        this.Cod_Auditor,
        this.Fec_Auditoria,
        this.Total,
        this.Cod_EstCli,
        this.Cod_TemCli,
        this.Cod_ColCli,
        this.Glosa,
        this.Cod_Talla,
        this.Cod_Motivo,
        this.Can_Defecto,
        this.Op,
        this.Tipo_Registro,
        this.Clasificacion
      ).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {


            this.flg_btn_cabecera = false
            this.DeshabilitarCabcera()
            this.HabilitarDetalle()
            this.Numero_Auditoria_Cabecera = result[0].Numero_Auditoria
            this.formulario.controls['sEstilo'].setValue(this.formulario.controls['sCodEst'].value)
            this.matSnackBar.open('Proceso correcto..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            //this.mostrarAlertaCaidasMayora1()
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.flg_btn_detalle = false
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    }
    else {
      this.matSnackBar.open('Complete todos los campos requeridos..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      this.flg_btn_detalle = false
    }
  }
  /******************************REGISTRAR CABCERA **************************************** */

  /****************ASIGNAR A UNA VARIABLE LO QUE SELECCIONE EN EL DETALLE PARA POSTERIORMENTE ELIMINAR *********** */
  AsignarCodRegistroVariableEliminar(cod: string) {
    this.Codigo_Defecto_Eliminar = cod
  }
  /****************ASIGNAR A UNA VARIABLE LO QUE SELECCIONE EN EL DETALLE PARA POSTERIORMENTE ELIMINAR *********** */

  /*****************DESHABILITAR INPUTS DE LA CABECERA************************ */

  DeshabilitarCabcera() {
    this.formulario.controls['sOP'].disable()
    this.formulario.controls['sAbr'].disable()
    this.formulario.controls['sCliente'].disable()
    this.formulario.controls['sEstilo'].disable()
    this.formulario.controls['sTemporada'].disable()
    this.formulario.controls['sColor'].disable()
    this.formulario.controls['sIngreso'].disable()
    this.formulario.controls['sGlosa'].disable()
    this.formulario.controls['Tipo'].disable()
    this.formulario.controls['Clasificacion'].disable()
    this.flg_btn_cabecera = false
  }
  /*****************DESHABILITAR INPUTS DE LA CABECERA************************ */


  /*****************HABILITAR INPUTS DE LA CABECERA************************ */

  HabilitarCabcera() {
    this.formulario.controls['sOP'].enable()
    this.formulario.controls['sAbr'].enable()
    this.formulario.controls['sCliente'].enable()
    this.formulario.controls['sIngreso'].enable()
    this.formulario.controls['sGlosa'].enable()
    this.formulario.controls['Tipo'].enable()
    this.formulario.controls['Clasificacion'].enable()
    this.inputAbr.nativeElement.focus()
    this.flg_btn_cabecera = true
  }
  /*****************HABILITAR INPUTS DE LA CABECERA************************ */

  /*****************HABILITAR INPUTS DEL DETALLE************************ */
  HabilitarDetalle() {
    this.formulario.controls['cod'].enable()
    this.formulario.controls['s'].enable()
    this.formulario.controls['cant'].enable()
    this.inputCodMotivo.nativeElement.focus()
    this.flg_btn_detalle = true
  }
  /*****************HABILITAR INPUTS DEL DETALLE************************ */

  /*****************DESHABILITAR INPUTS DEL DETALLE************************ */
  DeshabilitarDetalle() {
    this.formulario.controls['cod'].disable()
    this.formulario.controls['s'].disable()
    this.formulario.controls['cant'].disable()
    this.formulario.controls['defecto'].disable()
    this.flg_btn_detalle = false
  }
  /*****************DESHABILITAR INPUTS DEL DETALLE************************ */

  /****************************ELIMINAR UN REGISTRO DEL DETALLE ***************************** */

  EliminarRegistro() {
    this.Cod_Accion = 'E'
    this.Num_Auditoria = this.Numero_Auditoria_Cabecera
    this.Cod_Cliente = ''
    this.Cod_Auditor = ''
    this.Fec_Auditoria = ''
    this.Total = 0
    this.Cod_EstCli = this.formulario.controls['sCodEst'].value,
      this.Cod_TemCli = this.formulario.get('sTemporada')?.value
    this.Cod_ColCli = ''
    this.Glosa = ''
    this.Cod_Talla = ''
    this.Cod_Motivo = this.Codigo_Defecto_Eliminar
    this.Can_Defecto = 0
    this.Op = ''
    this.Tipo_Registro = ''
    this.Clasificacion = ''
    this.defectosAlmacenDerivadosService.Cf_Mantenimiento_Derivados(
      this.Cod_Accion,
      this.Num_Auditoria,
      this.Cod_Cliente,
      this.Cod_Auditor,
      this.Fec_Auditoria,
      this.Total,
      this.Cod_EstCli,
      this.Cod_TemCli,
      this.Cod_ColCli,
      this.Glosa,
      this.Cod_Talla,
      this.Cod_Motivo,
      this.Can_Defecto,
      this.Op,
      this.Tipo_Registro,
      this.Clasificacion
    ).subscribe(

      (result: any) => {
        if (result[0].Respuesta == 'OK') {

          this.ListarRegistroDefecto()
          this.matSnackBar.open('Registro Eliminado!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.mostrarAlertaCaidasMayora5()
          this.mostrarAlertaCaidasMayora1()

        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

    )
  }

  /****************************ELIMINAR UN REGISTRO DEL DETALLE ***************************** */

  /*********************************ESTILO*************************************************** */
  CargarOperacionEstilo() {
    this.listar_operacionEstilo = [];

    this.Cod_EstCli = this.formulario.get('sEstilo')?.value
    this.Cod_TemCli = this.formulario.get('sTemporada')?.value
    if (this.Cod_EstCli.length < 0) {

    }
    else {
      this.defectosAlmacenDerivadosService.es_muestra_estilos_del_cliente(this.Cod_Cliente, this.Cod_TemCli, this.Cod_EstCli).subscribe(
        (result: any) => {

          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              this.listar_operacionEstilo.push(result[i].Cod_Estcli)
              //.replace(/\s+/g, " ").trim()
            }
            this.RecargarOperacionEstilo()
          }

        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))

    }
  }


  private _filterOperacionEstilo(value: string): string[] {

    if (value == null || value == undefined) {
      value = ''

    }

    this.filterValue = value?.toLowerCase();

    return this.listar_operacionEstilo.filter(option => option.toLowerCase().includes(this.filterValue));

  }

  RecargarOperacionEstilo() {
    this.filtroOperacionEstilo = this.formulario.controls['sEstilo'].valueChanges.pipe(
      debounceTime(100),
      startWith(''),
      map(value => this._filterOperacionEstilo(value))
    );
  }

  /*********************************ESTILO*************************************************** */


  /******************** LLENAR SELECT DE CLIENTE ****************** */

  CargarOperacionCliente() {

    this.listar_operacionCliente = [];
    this.Abr = ''
    this.Abr_Motivo = ''
    this.Nom_Cliente = ''
    this.Cod_Accion = 'L'
    this.defectosAlmacenDerivadosService.mantenimientoDerivadosService(this.Abr, this.Abr_Motivo, this.Nom_Cliente, this.Cod_Accion).subscribe(
      (result: any) => {
        this.listar_operacionCliente = result
        this.RecargarOperacionCliente()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  RecargarOperacionCliente() {

    this.filtroOperacionCliente = this.formulario.controls['sCliente'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionCliente(option) : this.listar_operacionCliente.slice())),
    );

  }
  private _filterOperacionCliente(value: string): Cliente[] {
    if (value == null || value == undefined) {
      value = ''

    }
    if (this.flg_reset_estilo == false) {
      this.formulario.controls['sEstilo'].setValue('');
    }
    const filterValue = value.toLowerCase();

    return this.listar_operacionCliente.filter(option => option.Nom_Cliente.toLowerCase().includes(filterValue));
  }

  /******************** LLENAR SELECT DE CLIENTE ****************** */





  /******************** CAMBIAR VALOR DE LA VARIABLE COD_CLIENTE SEGUN LO QUE SELECCIONO EN EL COMBO ****************** */

  CambiarValorCliente(Cod_Cliente: string, Abr: string) {
    this.Cod_Cliente = Cod_Cliente

    console.log(this.Cod_Cliente)

    this.formulario.controls['sAbr'].setValue(Abr);
    this.Cod_Cliente = Cod_Cliente
    this.formulario.controls['sEstilo'].enable()
    this.formulario.controls['sColor'].enable()
    this.formulario.controls['sTemporada'].enable()
    this.formulario.controls['cod'].enable()
    this.CargarOperacionEstilo()
  }

  /******************** CAMBIAR VALOR DE LA VARIABLE COD_CLIENTE SEGUN LO QUE SELECCIONO EN EL COMBO ****************** */







  /*************************************CARGAR SELECT TEMPORADA*********************************************** */


  CargarOperacionTemporada() {

    console.log(this.formulario.get('sEstilo')?.value)
    this.Cod_TemCli = ''
    this.Cod_EstCli = this.formulario.get('sEstilo')?.value
    this.defectosAlmacenDerivadosService.Cf_Busca_Derivado_TemporadaCliente(this.Cod_Cliente, this.Cod_EstCli).subscribe(
      (result: any) => {
        this.listar_operacionTemporada = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  /*************************************CARGAR SELECT TEMPORADA*********************************************** */




  /*************************************CARGAR SELECT COLOR*********************************************** */
  CargarOperacionColor(Nom_TemCli: string) {

    this.Nom_TemCli = Nom_TemCli
    this.Cod_ColCli = this.formulario.get('sColor')?.value
    this.Cod_EstCli = this.formulario.get('sEstilo')?.value
    this.Cod_TemCli = this.formulario.get('sTemporada')?.value
    this.defectosAlmacenDerivadosService.Cf_Buscar_Derivado_Estilo_Color(this.Cod_Cliente, this.Cod_TemCli, this.Cod_EstCli).subscribe(
      (result: any) => {
        this.listar_operacionColor = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  /*************************************CARGAR SELECT COLOR*********************************************** */

  /**********************COMPLETAR CLIENTE Y ESTILO POR OP********************************* */
  BuscarPorOP() {
    this.Op = this.formulario.get('sOP')?.value
    this.defectosAlmacenDerivadosService.Cf_Busca_Derivado_OP_Cliente_Estilo_Temporada(this.Op).subscribe(
      (result: any) => {
        if (result.length > 0) {
          this.flg_reset_estilo = true
          this.formulario.controls['sCliente'].setValue(result[0].NOM_CLIENTE);
          this.formulario.controls['sAbr'].setValue(result[0].ABR_CLIENTE);
          this.Cod_Cliente = result[0].COD_CLIENTE
          this.formulario.controls['sAbr'].disable()
          this.formulario.controls['sCliente'].disable()
          this.formulario.controls['sEstilo'].setValue(result[0].COD_ESTCLI);
          this.formulario.controls['sEstilo'].disable()
          this.CargarOperacionTemporada()
          this.formulario.controls['sTemporada'].setValue(result[0].COD_TEMCLI);
          this.Cod_TemCli = this.formulario.get('sTemporada')?.value
          this.CargarOperacionColor('')
          this.formulario.controls['sColor'].enable()
        } else {
          this.matSnackBar.open('La OP no existe...!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          //this.mostrarAlertaCaidasMayora1()
        }


      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  /**********************COMPLETAR CLIENTE Y ESTILO POR OP********************************* */


}
