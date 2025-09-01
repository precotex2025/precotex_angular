import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GlobalVariable } from '../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefectosAlmacenDerivadosService } from 'src/app/services/defectos-almacen-derivados.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { CheckListService } from 'src/app/services/check-list.service';
import { DialogCheckRechazoComponent } from '../dialog-check-rechazo/dialog-check-rechazo.component';
import { DialogCheckInspeccionAudiComponent } from '../dialog-check-inspeccion-audi/dialog-check-inspeccion-audi.component';
import { DialogAprobRechOpComponent } from '../dialog-aprob-rech-op/dialog-aprob-rech-op.component';
declare var $: any;

interface Derivados {
  Id_Observaciones:string;
  Cod_Defecto: string;
  Defecto: string;
  Cantidad: number;
  Critico: string;
}

interface IndicacionesTable {
  Id_Indicaciones:string;
  Indicaciones: string;
}


interface Listar_Cliente {
  Nom_Cliente: string;
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

@Component({
  selector: 'app-dialog-editar-check',
  templateUrl: './dialog-editar-check.component.html',
  styleUrls: ['./dialog-editar-check.component.scss']
})
export class DialogEditarCheckComponent implements OnInit {


  sCod_Usuario = GlobalVariable.vusu;

  listar_operacionEstilo: string[] = [''];
  listar_operacionTemporada: Temporada[] = [];
  listar_operacionColor: Color[] = [];
  listar_operacionCliente: Cliente[] = [];

  filtroOperacionCliente: Observable<Cliente[]> | undefined;
  filtroOperacionEstilo: Observable<string[]> | undefined;

  tallas: any = []

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
  Codigo:any = ''
  Defecto:any = ''
  Cantidad:any = ''
  filterValue = ''
  Numero_Auditoria_Cabecera = 0
  Codigo_Defecto_Eliminar = ''
  flg_btn_detalle = false
  flg_btn_cabecera = true
  flg_reset_estilo = false
  nRechazos = 0;
  Flg_Aprobado = '';

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

  ll_Reauditoria: boolean = false;

  Tipo_Defecto = ''
  Nom_TemCli = ''
  Tipo_Registro = ''
  Clasificacion = ''

  myControl = new FormControl();
  fec_registro = new FormControl(new Date())

  formulario = this.formBuilder.group({
    Ticket: [''],
    sCliente: ['',],
    sEstilo: [{value:'', disabled: true}],
    sColor: ['', Validators.required],
    sAuditor: ['',],
    Tipo_Prenda: [{value:'', disabled: true}] ,
    Cantidad: [{value:'', disabled: true}, Validators.required],
    sTemporada: ['',],
    sOP: ['', Validators.required],
    Lote: [''],
    Lote_Tela: [''],
    Tamano_Muestra: [{value:'', disabled: true}, Validators.required],
    Tamano_Muestra_Porc: [{value:'', disabled: true}, Validators.required],
    Numero_Defectos: [{value:'', disabled: true}, Validators.required],
    Num_Defectos: [{value:'', disabled: true}, Validators.required],
    Flg_Aprobado: [{value:'', disabled: true}, , Validators.required],
    Flg_FichaTecnica: ['',],
    Flg_ReporteCalidad: ['',],
    Flg_Estampado: ['',],
    Flg_Bordado: ['',],
    Ruta_Prenda: ['', Validators.required],
    Linea: [{value:'', disabled: true}],
  	chk_go: ['',],
	  chk_jc: ['',],
  });

  Indicaciones:any = '';

  listar_cliente: Listar_Cliente[] = [];
  idCabecera: any = '';
  dataSource: MatTableDataSource<Derivados>;
  dataSource2: MatTableDataSource<IndicacionesTable>;
  dataTicket:any;
  dataDefectos:any = [];
  dataIndicaciones:any = [];

  displayedColumns: string[] = ['Cod_Defecto',
    'Defecto',
    'Cantidad', 'Leve', 'Critico', 'Eliminar'];
  displayedColumns2: string[] = ['Indicaciones'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<Derivados>();

  mostrarRechazo = false;

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private defectosAlmacenDerivadosService: DefectosAlmacenDerivadosService,
    private checkListService: CheckListService,
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private renderer: Renderer2
    , @Inject(MAT_DIALOG_DATA) public data: any) {

    this.dataSource = new MatTableDataSource();
    this.dataSource2 = new MatTableDataSource();

  }

  @ViewChild('s') inputS!: ElementRef;
  @ViewChild('abr') inputAbr!: ElementRef;
  @ViewChild('cod') inputCodMotivo!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;



  ngOnInit(): void {
    this.CargarOperacionCliente()

    this.fec_registro.disable()
    this.formulario.controls['sOP'].setValue(this.data.Cod_OrdPro);
    this.BuscarPorOP()
    console.log(this.data.Ruta_Prenda);
    this.formulario.patchValue({
      sOP: this.data.Cod_OrdPro,
      sColor: this.data.Color,
      sTemporada: this.data.Cod_TemCli.trim(),
      fec_registro: this.data.Fecha_Registro,
      Cantidad: this.data.Cantidad,
      Lote_Tela: this.data.Lote_Tela,
      Lote: this.data.Lote,
      Tamano_Muestra: this.data.Tamano_Muestra,
      Tamano_Muestra_Porc: this.data.Tamano_Muestra_Porc,
      Numero_Defectos: this.data.Numero_Defectos,
      Num_Defectos: this.data.Num_Defectos,
      Tipo_Prenda: this.data.Tipo_Prenda,
      sAuditor: this.data.Cod_Usuario,
      Flg_Aprobado: this.data.Flg_Aprobado,
      Flg_Bordado: this.data.Flg_Bordado,
      Flg_Estampado: this.data.Flg_Estampado,
      Flg_FichaTecnica: this.data.Flg_FichaTecnica,
      Flg_ReporteCalidad: this.data.Flg_ReporteCalidad,
      Ruta_Prenda: this.data.Ruta_Prenda != null ? this.data.Ruta_Prenda.trim() : '',
      Linea: this.data.Linea,
      chk_go: this.data.chk_go,
      chk_jc: this.data.chk_jc,
    });

    //this.DeshabilitarDetalle()
    /*if(this.data.Flg_Aprobado == 'R'){
      this.mostrarRechazo = true;
    } else {
      this.formulario.patchValue({
        Flg_Aprobado: "A"
      })
    }*/

    if(this.data.Flg_Aprobado == 'P'){
      this.flg_btn_cabecera = false

      this.formulario.patchValue({
        Flg_Aprobado: "R"
      })
    }

    if(this.data.Flg_Aprobado.trim() == ''){
      this.formulario.patchValue({
        Flg_Aprobado: "A"
      })
    }

      

    this.ll_Reauditoria = this.data.Id_Reauditoria != 0 ? true : false;
    this.HabilitarDetalle();
    this.calculaMuestra(this.data.Lote, false);
 
    this.idCabecera = this.data.Id_CheckList;
    this.cargarObservaciones();
    this.cargarIndicaciones();
    this.validarExistenciaTicket();
    
  }

  /******************************LISTAR LAS TALLAS Y AGREGAR ESAS TALALS A LA COLUMNAS DEL TABLE******************** */
  ListarTallas(option) {
    console.log(option);
    this.Cod_ColCli = option.Cod_ColCli;

  }

  changeTicket(event){
    if(event.target.value != ''){
      this.spinnerService.show();
      this.checkListService.CF_ValidarTicket(event.target.value).subscribe(
        (result: any) => {
          this.spinnerService.hide();
          if (result.length > 0) {
            
            this.dataTicket = result[0];
          }else{
            this.formulario.patchValue({
              Ticket:''
            });
            this.dataTicket = '';

            this.matSnackBar.open('No se encontraron registros para este ticket.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
  
        },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
          });
          this.spinnerService.hide();
      })
    }
    
  }

  abrirRechazo(){
    let dialogRef =  this.dialog.open(DialogCheckRechazoComponent, { 
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '95vw',
      maxHeight: '95vh',
      height: '100%',
      width: '100%',
      data: this.idCabecera
    });

    dialogRef.afterClosed().subscribe(result =>{ 

  
    })
  }


  validarExistenciaTicket(){
    this.checkListService.CF_CHECK_CREAR_TICKET_AUDITORIA(
      'L',
      '',
      '',
      '',
      '',
      '',
      '',
      this.idCabecera,
      '',
    ).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        if (result.length > 0) {
          this.matSnackBar.open('Ticket', 'Cerrar', { duration: 1500})
          // this.formulario.disable();
          this.dataTicket = result[0];
          this.formulario.patchValue({
            Ticket: this.dataTicket.Ticket
          })
          
          //this.flg_btn_cabecera = true;
        }else{
          
        }

      },
      (err: HttpErrorResponse) =>{
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    })
  }

  abrirTicket(){
    if(this.formulario.get('Ticket').value != ''){
      let datos = {
        Cod_OrdPro: this.formulario.get('sOP').value,
        Des_Present: this.formulario.get('sColor').value,
        Cod_Talla: this.dataTicket.COD_TALLA,
        Cantidad: this.dataTicket.Cantidad,
        Cantidad_Auditoria: this.dataTicket.Cantidad_Auditoria,
        Cod_Usuario: this.sCod_Usuario,
        Id_CheckList: this.idCabecera,
        Ticket: this.dataTicket.Ticket
      }
      
      let dialogRef =  this.dialog.open(DialogCheckInspeccionAudiComponent, { 
        disableClose: true,
        panelClass: 'my-class',
        maxWidth: '95vw',
        maxHeight: '95vh',
        height: '100%',
        width: '70%',
        data: datos
      });
  
      dialogRef.afterClosed().subscribe(result =>{ 
  
    
      })
    }else{
      this.matSnackBar.open('Debes digitar el Ticket.', 'Cerrar', {
        duration: 1500,
      })
    }
  }
  changeCantidad(event, actualizar: boolean ){
    this.calculaMuestra(event.target.value, actualizar);
  }

  calculaMuestra(cantidad: number, actualizar: boolean){
    console.log("muestra")
    this.checkListService.CF_ValidarTamano_Muestra(cantidad).subscribe(
      (result: any) => {

        if (result.length > 0) {
          
          if(actualizar){
            this.formulario.patchValue({
              Tamano_Muestra: result[0].Tamanio_Muestra,
              Tamano_Muestra_Porc: ((Number(result[0].Tamanio_Muestra) * 100) / Number(cantidad)).toFixed(2)
            })  
          }

          this.nRechazos = result[0].Re;
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
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
    this.formulario.controls['sCliente'].setValue('')
    this.formulario.controls['sEstilo'].setValue('')
    this.formulario.controls['sColor'].setValue('')
    this.formulario.controls['sTemporada'].setValue('')
    this.formulario.controls['cant'].setValue('')
    this.formulario.controls['sOP'].setValue('')
    this.dataSource.data = []
    this.tallas = []
    this.Num_Auditoria = 0
    this.columnsToDisplay = this.displayedColumns.slice();

  }

  /************************FILTAR EL CLIENTE SEGUN SU ABR**************************** */
  BuscarCliente() {
    this.Abr = this.formulario.get('sAbr')?.value
    this.Abr_Motivo = ''
    this.Nom_Cliente = ''
    this.Cod_Accion = 'F'
    if ((this.Abr.length < 3 || this.Abr.length > 3)) {


      this.formulario.controls['sCliente'].setValue('')

      this.formulario.controls['sEstilo'].setValue('')

      this.formulario.controls['sColor'].setValue('')

      this.formulario.controls['sTemporada'].setValue('')

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


            this.formulario.controls['sCliente'].setValue('')

            this.formulario.controls['sEstilo'].setValue('')

            this.formulario.controls['sColor'].setValue('')

            this.formulario.controls['sTemporada'].setValue('')

            this.matSnackBar.open('Abr de cliente incorrecto..!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

    }
  }
  /************************FILTAR EL CLIENTE SEGUN SU ABR**************************** */

  /************************FILTAR EL MOTIVO SEGUN SU CODIGO**************************** */

  cargarObservaciones(){
    this.checkListService.CF_CHECKLIST_LISTAR_DETALLE('O', this.idCabecera).subscribe(
      (result: any) => {
        this.dataDefectos = result;
        this.dataSource.data = this.dataDefectos;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  /************************OBTENER OP PARA APROBACIÓN O RECHAZO**************************** */
  getOpAprob(){
    
    this.listar_operacionCliente = [];
    var Cod_EstPro = this.formulario.get('sEstilo').value;
    var Cod_Present = this.Cod_ColCli;
    this.defectosAlmacenDerivadosService.obtenerOpAprobacion('O', Cod_EstPro, Cod_Present, 
    '', '', this.data.Cod_TemCli, '', '', '', '', '', '','').subscribe(
      (result: any) => {
        console.log(result);
        let dialogRef =  this.dialog.open(DialogAprobRechOpComponent, { 
          disableClose: true,
          panelClass: 'my-class',
          minHeight: '600px',
          data: result
        });
    
        dialogRef.afterClosed().subscribe(res =>{ 
    
      
        })
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  cargarIndicaciones(){
    this.checkListService.CF_CHECKLIST_LISTAR_DETALLE('I', this.idCabecera).subscribe(
      (result: any) => {

        this.dataIndicaciones = result;
        this.dataSource2.data = this.dataIndicaciones;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  changeIndicaciones(event,data_det){
    console.log(event);
    console.log(data_det);
    var valor = event.target.value;


    this.spinnerService.show();
      this.checkListService.CF_INSERTAR_CHECKLIST_INDICACIONES(
        'U',
        data_det.Id_Indicaciones,
        this.idCabecera,
        valor
      ).subscribe(res => {
        
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {

          this.matSnackBar.open('Se actualizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {
          this.matSnackBar.open('Ha ocurrido un error al actualizar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      });

  }

  BuscarMotivo(event) {
    
    this.Abr_Motivo = event.target.value;
    
    if (this.Abr_Motivo == null) {
      this.Abr_Motivo = ''
    }
    if (this.Abr_Motivo.length > 3) {
      this.Abr_Motivo = '';

    }
    else {
      this.Abr = ''
      this.Nom_Cliente = ''
      this.Cod_Accion = 'M'
      this.spinnerService.show();
      this.defectosAlmacenDerivadosService.mantenimientoDerivadosService(this.Abr, this.Abr_Motivo, this.Nom_Cliente, this.Cod_Accion).subscribe(
        (result: any) => {
          if (result.length > 0) {
            this.Defecto = (result[0].Descripcion)
            this.Cod_Motivo = result[0].Cod_Motivo
            
            this.spinnerService.hide();
          }
          else {
            this.spinnerService.hide();
            this.matSnackBar.open('Abr de motivo no existe..!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => {
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        })
        this.spinnerService.hide();
    }

  }

  /************************FILTAR EL MOTIVO SEGUN SU CODIGO**************************** */

  abrFocus() {
    this.inputAbr.nativeElement.focus()
  }

  /******************************INSERTAR DETALLE **************************************** */
  InsertarFila() {

    let tmuestra: number = this.formulario.get('Tamano_Muestra')?.value;
    let tdefectos : number = this.formulario.get('Numero_Defectos')?.value;

    if(tmuestra >= tdefectos + this.Cantidad){
      if(this.Codigo != '' && this.Defecto != '' && this.Cantidad != ''){
        this.spinnerService.show();
        this.checkListService.CF_INSERTAR_CHECKLIST_OBS(
          'I',
          0,
          this.idCabecera,
          this.Cantidad,
          this.Cod_Motivo,
          this.Defecto,
          this.Tipo_Defecto
        ).subscribe(res => {
          
          this.spinnerService.hide();
          if (res[0].Respuesta == 'OK') {
            let datos = {
              Id_Observacion: res[0].Id,
              Cod_Defecto: this.Cod_Motivo, 
              Defecto: this.Defecto, 
              Cantidad: this.Cantidad,
              Leve: res[0].Leve,
              Critico: res[0].Critico
            };
            
            this.dataDefectos.push(datos);
            this.dataSource.data = this.dataDefectos;
  
            this.Cantidad = '';
            this.Defecto = '';
            this.Codigo = '';
  
            let muestra: number = this.formulario.get('Tamano_Muestra')?.value;
            let total: number = this.dataSource.data.map(t => t.Cantidad).reduce((acc, value) => acc + value, 0);
            this.formulario.controls['Numero_Defectos'].setValue(total);
            this.formulario.controls['Num_Defectos'].setValue(total / muestra * 100 );
            this.validarEstado(this.nRechazos);

            this.matSnackBar.open('Se Realizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          } else {
            this.matSnackBar.open('Ha ocurrido un error al realizar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        }, (err: HttpErrorResponse) => {
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        });
      }else{
        this.matSnackBar.open('Debes ingresar El Código, Defecto y Cantidad.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }
    } else {
      this.matSnackBar.open('El total de defectos no debe superar el tamaño de la muestra.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    
  }

  validarEstado(rechazo: number){
    console.log('rechazo')
    console.log(rechazo)
    if(this.dataSource.data.filter(d => d.Critico == "1").map(t => t.Cantidad).reduce((acc, value) => acc + value, 0) >= rechazo)
      this.Flg_Aprobado = "R";
    else
      this.Flg_Aprobado = "A";

    this.formulario.patchValue({
      Flg_Aprobado: this.Flg_Aprobado
    })

    this.RegistrarCabecera();

  }

  InsertarFilaIndicacion(){
    if(this.Indicaciones != '' ){
      this.spinnerService.show();
      this.checkListService.CF_INSERTAR_CHECKLIST_INDICACIONES(
        'I',
        0,
        this.idCabecera,
        this.Indicaciones
      ).subscribe(res => {
        
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          let datos = {
            Id_Indicaciones: res[0].Id,
            Indicaciones: this.Indicaciones, 
          };
          
          this.dataIndicaciones.push(datos);
          this.dataSource2.data = this.dataIndicaciones;

          this.Indicaciones = '';
          
          this.matSnackBar.open('Se Realizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {
          this.matSnackBar.open('Ha ocurrido un error al realizar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      });
    }else{
      this.matSnackBar.open('Debes ingresar la Indicacion/Recomendacion.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  /******************************INSERTAR DETALLE **************************************** */
  eliminarFilaIndicacion(data_det:IndicacionesTable){
    if(confirm('Esta seguro de eliminar el registro?')){
      this.spinnerService.show();
      this.checkListService.CF_INSERTAR_CHECKLIST_INDICACIONES(
        'D',
        data_det.Id_Indicaciones,
        this.idCabecera,
        ''
      ).subscribe(res => {
        
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          
          this.dataIndicaciones = this.dataIndicaciones.filter( (element:any) => {
            return element.Id_Indicaciones !== data_det.Id_Indicaciones
          });
          this.dataSource2.data = this.dataIndicaciones;

          
          this.matSnackBar.open('Se elimino el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {
          this.matSnackBar.open('Ha ocurrido un error al eliminar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      });
    }
  }

  eliminarFila(data_det:any){
    if(confirm('Esta seguro de eliminar el registro?')){
      this.spinnerService.show();
      console.log(data_det);
      this.checkListService.CF_INSERTAR_CHECKLIST_OBS(
        'D',
        data_det.Id_Observaciones,
        '',
        '',
        '',
        '',
        this.Tipo_Defecto
      ).subscribe(res => {
        console.log(res);
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          
          this.dataDefectos = this.dataDefectos.filter( (element:any) => {
            return element.Id_Observaciones !== data_det.Id_Observaciones
          });
          console.log(this.dataDefectos);
          this.dataSource.data = this.dataDefectos;

          let muestra: number = this.formulario.get('Tamano_Muestra')?.value;
          let total: number = this.dataSource.data.map(t => t.Cantidad).reduce((acc, value) => acc + value, 0);
          this.formulario.controls['Numero_Defectos'].setValue(total);
          this.formulario.controls['Num_Defectos'].setValue(total / muestra * 100 );
          this.validarEstado(this.nRechazos);

          this.matSnackBar.open('Se elimino el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {
          this.matSnackBar.open('Ha ocurrido un error al eliminar el registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      });
    }
  }



  /******************************REGISTRAR CABCERA **************************************** */
  RegistrarCabecera() {
    

    if (this.formulario.valid) {
      const formData = new FormData();
      formData.append('Opcion', 'U');
      formData.append('Id_CheckList', this.idCabecera);
      formData.append('Cod_OrdPro', this.formulario.get('sOP').value);
      formData.append('Cod_Cliente', this.Cod_Cliente);
      formData.append('Cod_EstCli', this.Cod_EstCli);
      formData.append('Tipo_Prenda', this.formulario.get('Tipo_Prenda').value);
      formData.append('Des_Present', this.Cod_ColCli);
      formData.append('Cantidad', this.formulario.get('Cantidad').value);
      formData.append('Cod_TemCli', this.Cod_TemCli);
      formData.append('Lote_Tela', this.formulario.get('Lote_Tela').value);
      formData.append('Lote', this.formulario.get('Lote').value);
      formData.append('Tamano_Muestra', this.formulario.get('Tamano_Muestra').value);
      formData.append('Numero_Defectos', this.formulario.get('Numero_Defectos').value);
      formData.append('Tamano_Muestra_Porc', this.formulario.get('Tamano_Muestra_Porc').value);
      formData.append('Num_Defectos', this.formulario.get('Num_Defectos').value);
      formData.append('Flg_Aprobado', this.formulario.get('Flg_Aprobado').value);
      formData.append('Flg_FichaTecnica', this.formulario.get('Flg_FichaTecnica').value);
      formData.append('Flg_ReporteCalidad', this.formulario.get('Flg_ReporteCalidad').value);
      formData.append('Flg_Estampado', this.formulario.get('Flg_Estampado').value);
      formData.append('Flg_Bordado', this.formulario.get('Flg_Bordado').value);
      formData.append('Cod_Usuario', this.formulario.get('sAuditor').value);
      formData.append('Ruta_Prenda', this.formulario.get('Ruta_Prenda').value);
      formData.append('Linea', this.formulario.get('Linea').value);
      formData.append('chk_go', this.formulario.get('chk_go').value ? "1" : "0");
      formData.append('chk_jc', this.formulario.get('chk_jc').value ? "1" : "0");
      console.log(formData)
      this.checkListService.Cf_Mantenimiento_CheckList(formData)
        .subscribe(res => {
        
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          this.idCabecera = res[0].Id;

          this.matSnackBar.open('Se actualizo el registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.DeshabilitarCabcera();
          this.HabilitarDetalle();

        } else {
          this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      });

    } else {
      this.matSnackBar.open('Debes ingresar los campos obligatorios.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
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

    this.flg_btn_cabecera = false
    this.formulario.controls['sCliente'].disable();
    this.formulario.controls['sEstilo'].disable();
    this.formulario.controls['sColor'].disable();
    this.formulario.controls['sAuditor'].disable();
    this.formulario.controls['Tipo_Prenda'].disable();
    this.formulario.controls['Cantidad'].disable();
    this.formulario.controls['sTemporada'].disable();
    this.formulario.controls['sOP'].disable();
    this.formulario.controls['Lote'].disable();
    this.formulario.controls['Lote_Tela'].disable();
    this.formulario.controls['Tamano_Muestra'].disable();
    this.formulario.controls['Tamano_Muestra_Porc'].disable();
    this.formulario.controls['Numero_Defectos'].disable();
    this.formulario.controls['Num_Defectos'].disable();
    this.formulario.controls['Flg_Aprobado'].disable();
    this.formulario.controls['Flg_FichaTecnica'].disable();
    this.formulario.controls['Flg_ReporteCalidad'].disable();
    this.formulario.controls['Flg_Estampado'].disable();
    this.formulario.controls['Flg_Bordado'].disable();


  }
  /*****************DESHABILITAR INPUTS DE LA CABECERA************************ */


  /*****************HABILITAR INPUTS DE LA CABECERA************************ */

  HabilitarCabcera() {
    this.formulario.controls['sOP'].enable()
    this.formulario.controls['sCliente'].enable()
    this.inputAbr.nativeElement.focus()
    this.flg_btn_cabecera = true
  }
  /*****************HABILITAR INPUTS DE LA CABECERA************************ */

  /*****************HABILITAR INPUTS DEL DETALLE************************ */
  HabilitarDetalle() {

    //this.inputCodMotivo.nativeElement.focus()
    this.flg_btn_detalle = true
  }
  /*****************HABILITAR INPUTS DEL DETALLE************************ */

  /*****************DESHABILITAR INPUTS DEL DETALLE************************ */
  DeshabilitarDetalle() {

    this.flg_btn_detalle = false
  }
  /*****************DESHABILITAR INPUTS DEL DETALLE************************ */

  /****************************ELIMINAR UN REGISTRO DEL DETALLE ***************************** */

  EliminarRegistro() {

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

    

    this.Cod_Cliente = Cod_Cliente
    this.formulario.controls['sEstilo'].enable()
    this.formulario.controls['sColor'].enable()
    this.formulario.controls['sTemporada'].enable()
    this.CargarOperacionEstilo()
  }

  /*************************************CARGAR SELECT TEMPORADA*********************************************** */


  CargarOperacionTemporada() {

    
    this.Cod_TemCli = ''
    this.Cod_EstCli = this.formulario.get('sEstilo')?.value
    this.defectosAlmacenDerivadosService.Cf_Busca_TemporadaCliente(this.Cod_Cliente, this.Cod_EstCli).subscribe(
      (result: any) => {
        this.listar_operacionTemporada = result
        console.log(this.listar_operacionTemporada);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

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
    this.defectosAlmacenDerivadosService.Cf_Busca_OP_Cliente_Estilo_Temporada(this.Op).subscribe(
      (result: any) => {
        if (result.length > 0) {
          this.flg_reset_estilo = true
          this.formulario.controls['sCliente'].setValue(result[0].NOM_CLIENTE);
          this.Cod_Cliente = result[0].COD_CLIENTE

          this.formulario.controls['sEstilo'].setValue(result[0].COD_ESTCLI);

          this.CargarOperacionTemporada()
          this.formulario.controls['Tipo_Prenda'].setValue(result[0].TIPO_PRENDA);
          this.formulario.controls['sTemporada'].setValue(result[0].COD_TEMCLI);
          this.Cod_TemCli = this.formulario.get('sTemporada')?.value
          this.CargarOperacionColor('')
        } else {
          this.matSnackBar.open('La OP no existe...!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          //this.mostrarAlertaCaidasMayora1()
        }


      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  /**********************COMPLETAR CLIENTE Y ESTILO POR OP********************************* */


}
