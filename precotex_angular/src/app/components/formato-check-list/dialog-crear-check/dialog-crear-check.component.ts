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
  Id_Observacion:string;
  Codigo: string;
  Defecto: string;
  Total: number;
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

@Component({
  selector: 'app-dialog-crear-check',
  templateUrl: './dialog-crear-check.component.html',
  styleUrls: ['./dialog-crear-check.component.scss']
})
export class DialogCrearCheckComponent implements OnInit {

  sCod_Usuario = GlobalVariable.vusu;

  listar_operacionEstilo: string[] = [''];
  listar_operacionTemporada: Temporada[] = [];
  listar_operacionColor:any = [];
  listar_operacionCliente: Cliente[] = [];

  filtroOperacionCliente: Observable<Cliente[]> | undefined;
  filtroOperacionEstilo: Observable<string[]> | undefined;

  tallas: any = []
  datosDefectos: any = []

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
  Cantidad_Cabecera:any = ''
  filterValue = ''
  Numero_Auditoria_Cabecera = 0
  Codigo_Defecto_Eliminar = ''
  flg_btn_detalle = false
  flg_btn_cabecera = true
  flg_reset_estilo = false
  nRechazos = 0;
  check=false;

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


  Cod_OrdPro:any = '';
  Tipo_Prenda:any = '';
  Cod_Present:any = '';
  Lote_Tela:any = '';
  Lote:any = '';
  Tamano_Muestra:any = '';
  Numero_Defectos:any = '';
  Tamano_Muestra_Porc:any = '';
  Num_Defectos:any = '';
  Flg_Aprobado:any = '';
  Flg_FichaTecnica:any = '';
  Flg_ReporteCalidad:any = '';
  Flg_Estampado:any = '';
  Flg_Bordado:any = '';
  Cod_Usuario:any = '';
  Ruta_Prenda:any = '';
  Linea:any = '';

  Nom_TemCli = ''
  Tipo_Registro = ''
  Clasificacion = ''

  Tipo_Defecto = 'Leve';
  myControl = new FormControl();
  fec_registro = new FormControl(new Date())

  formulario = this.formBuilder.group({
    Ticket: [''],
    sCliente: ['',],
    sEstilo: [{value:'', disabled: true}],
    sColor: ['', Validators.required],
    sAuditor: ['',],
    Tipo_Prenda: [{value:'', disabled: true}],
    Cantidad: [{value:'', disabled: true}, Validators.required],
    sTemporada: ['',],
    sOP: ['', Validators.required],
    Lote: ['', Validators.required],
    Lote_Tela: [''],
    Tamano_Muestra: [{value:'', disabled: true}, Validators.required],
    Tamano_Muestra_Porc: [{value:'', disabled: true}, Validators.required],
    Numero_Defectos: [{value:0, disabled: true}],
    Num_Defectos: [{value:0, disabled: true}],
    Flg_Aprobado: [{value:'', disabled: true}],
    Flg_FichaTecnica: ['',],
    Flg_ReporteCalidad: ['',],
    Flg_Estampado: ['',],
    Flg_Bordado: ['',],
    Ruta_Prenda: ['', Validators.required],
    Linea: [{value:'', disabled: true}]
  });

  Indicaciones:any = '';

  listar_cliente: Listar_Cliente[] = [];
  idCabecera: any = '0';
  dataSource: MatTableDataSource<Derivados>;
  dataSource2: MatTableDataSource<IndicacionesTable>;

  dataDefectos:any = [];
  dataIndicaciones:any = [];

  displayedColumns: string[] = ['Codigo', 'Defecto', 'Leve', 'Critico', 'Total', 'Eliminar'];
  displayedColumns2: string[] = ['Indicaciones'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<Derivados>();


  mostrarRechazo = false;

  dataTicket:any;
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;



  ngOnInit(): void {
    this.CargarOperacionCliente()

    this.fec_registro.disable()
    this.formulario.controls['sAuditor'].setValue(this.sCod_Usuario);

    this.DeshabilitarDetalle()
    //this.HabilitarDetalle();

  }

  changeTicket(event){
    if(event.target.value != ''){
      this.spinnerService.show();
      this.checkListService.CF_ValidarTicket(event.target.value).subscribe(
        (result: any) => {
          this.spinnerService.hide();
          if (result.length > 0) {
            console.log(result);
            this.formulario.patchValue({
              sOP: result[0].Cod_OrdPro
            });
            this.Op = result[0].Cod_OrdPro
            this.dataTicket = result[0];
            this.BuscarPorOP();
          }else{
            this.formulario.patchValue({
              sEstilo: '',
              sColor: '',
              sTemporada: '',
              sOP: '',
              Ticket:''
            });
            this.Op ='';
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
  cargarIndicaciones(){
    this.checkListService.CF_CHECKLIST_LISTAR_DETALLE('I', this.idCabecera).subscribe(
      (result: any) => {

        this.dataIndicaciones = result;
        this.dataSource2.data = this.dataIndicaciones;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  changeCantidad(event){
    this.checkListService.CF_ValidarTamano_Muestra(event.target.value).subscribe(
      (result: any) => {

        if (result.length > 0) {
          console.log(result);
          this.formulario.patchValue({
            Tamano_Muestra: result[0].Tamanio_Muestra,
            Tamano_Muestra_Porc: ((Number(result[0].Tamanio_Muestra) * 100) / Number(event.target.value)).toFixed(2)
          })

          this.nRechazos = result[0].Re;
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  getLineaOP(){
    this.checkListService.CF_ObtenerLinea(this.Op).subscribe(
      (result: any) => {

        if (result.length > 0) {
          console.log(result);
          this.formulario.patchValue({
            Linea: result[0].Linea
          });
          
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  
  /******************************LISTAR LAS TALLAS Y AGREGAR ESAS TALALS A LA COLUMNAS DEL TABLE******************** */
  ListarTallas(option) {
    this.Cod_ColCli = this.formulario.get('sColor')?.value
    console.log(option.Cod_Present);

    
    this.checkListService.CF_ObtenerCantidad_OP(
      this.Op,
      option.Cod_Present,
    ).subscribe((res:any) => {
      console.log(res);
      this.spinnerService.hide();
      if(res.length > 0)  {
        this.formulario.patchValue({
          Cantidad: res[0].Cantidad
        })
      }
    
    }, (err: HttpErrorResponse) => {
      this.spinnerService.hide();
      this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    });
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

  BuscarMotivo(event) {
    console.log(event);
    this.Abr_Motivo = event.target.value;
    console.log(this.Abr_Motivo);
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


  changeCheck(event){
    console.log(event);
    this.check = event.checked;

    
    
  }

  saveDefecto(event){
    console.log(event);

    if(event != undefined){
      this.Defecto = (event.Descripcion)
      this.Cod_Motivo = event.Cod_Motivo
    }
  }

  BuscarDefecto(event) {
    console.log(event);
    var defecto = event.value;
    console.log(this.Abr_Motivo);

    if (defecto == '' ||  defecto == undefined) {
      this.Abr_Motivo = '';

    }
    else {
      this.Abr = ''
      this.Nom_Cliente = ''
      this.Cod_Accion = 'D'
      this.spinnerService.show();
      this.defectosAlmacenDerivadosService.mantenimientoDerivadosWebService(this.Abr, this.Abr_Motivo, this.Nom_Cliente, this.Cod_Accion, defecto).subscribe(
        (result: any) => {
          if (result.length > 0) {
            console.log(result);
            this.datosDefectos = result;
            // this.Defecto = (result[0].Descripcion)
            // this.Cod_Motivo = result[0].Cod_Motivo
            
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

/************************OBTENER OP PARA APROBACIÓN O RECHAZO**************************** */
  getOpAprob(){
    
    this.listar_operacionCliente = [];
    var Cod_EstPro = this.formulario.get('sEstilo').value;
    var Cod_Present = this.Cod_ColCli;
    var Cod_TemCli = this.formulario.get('sTemporada').value;

    this.defectosAlmacenDerivadosService.obtenerOpAprobacion('O', Cod_EstPro, Cod_Present, '', '', Cod_TemCli, '', '', '', '', '', '', '').subscribe(
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
  /************************FILTAR EL MOTIVO SEGUN SU CODIGO**************************** */


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
          console.log(res);
          this.spinnerService.hide();
          if (res[0].Respuesta == 'OK') {
            let datos = {
              Id_Observacion: res[0].Id,
              Codigo: this.Cod_Motivo, 
              Defecto: this.Defecto, 
              Total: this.Cantidad,
              Leve: res[0].Leve,
              Critico: res[0].Critico
            };
            
            this.dataDefectos.push(datos);
            this.dataSource.data = this.dataDefectos;
  
            this.Cantidad = '';
            this.Defecto = '';
            this.Codigo = '';
  
            let muestra: number = this.formulario.get('Tamano_Muestra')?.value;
            let total: number = this.dataSource.data.map(t => t.Total).reduce((acc, value) => acc + value, 0);
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
    if(this.dataSource.data.filter(d => d.Critico == "1").map(t => t.Total).reduce((acc, value) => acc + value, 0) >= rechazo)
      this.Flg_Aprobado = "R";
    else
      this.Flg_Aprobado = "A";

    this.formulario.patchValue({
      Flg_Aprobado: this.Flg_Aprobado
    })

    this.RegistrarCabecera()

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
        console.log(res);
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
        console.log(res);
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

  eliminarFila(data_det:Derivados){
    if(confirm('Esta seguro de eliminar el registro?')){
      this.spinnerService.show();
      this.checkListService.CF_INSERTAR_CHECKLIST_OBS(
        'D',
        data_det.Id_Observacion,
        '',
        '',
        '',
        ''
      ).subscribe(res => {
        console.log(res);
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          
          this.dataDefectos = this.dataDefectos.filter( (element:any) => {
            return element.Id_Observacion !== data_det.Id_Observacion
          });
          this.dataSource.data = this.dataDefectos;

          let muestra: number = this.formulario.get('Tamano_Muestra')?.value;
          let total: number = this.dataSource.data.map(t => t.Total).reduce((acc, value) => acc + value, 0);
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
    console.log(this.formulario.get('Cantidad').value);

    if (this.formulario.valid) {
      const formData = new FormData();
      formData.append('Opcion', 'I');
      //formData.append('Id_CheckList', '0');
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
      formData.append('chk_go', "0");
      formData.append('chk_jc', "0");

      /* Se reemplaza metodo de solicitud de GET a POST.  2024Dic27, Ahmed*/
      this.checkListService.Cf_Mantenimiento_CheckList(formData)
        .subscribe(res => {
        console.log(res);
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          
          if(this.idCabecera == '0')
            this.matSnackBar.open('Ya puedes registrar los detalles.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          else
            this.matSnackBar.open('Actualización Ok!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

          this.idCabecera = res[0].Id;
          if(this.Flg_Aprobado == 'R'){
            this.mostrarRechazo = true;
          }          
          
          this.DeshabilitarCabcera();
          this.HabilitarDetalle();
          this.cargarIndicaciones();

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

  abrirTicket(){
    if(this.formulario.get('Ticket').value != ''){
      let datos = {
        Cod_OrdPro: this.formulario.get('sOP').value,
        Des_Present: this.formulario.get('sColor').value,
        Cod_Talla: this.dataTicket.Cod_Talla,
        Cantidad: this.dataTicket.Cantidad,
        Cantidad_Auditoria: 0,
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

    console.log(this.Cod_Cliente)

    this.Cod_Cliente = Cod_Cliente
    this.formulario.controls['sEstilo'].enable()
    this.formulario.controls['sColor'].enable()
    this.formulario.controls['sTemporada'].enable()
    this.CargarOperacionEstilo()
  }

  /*************************************CARGAR SELECT TEMPORADA*********************************************** */

  changeAprobado(event){
    console.log(event)
    const formData = new FormData();
    formData.append('Opcion', 'I');
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
    formData.append('chk_go', "0");
    formData.append('chk_jc', "0");
    
    this.checkListService.Cf_Mantenimiento_CheckList(formData)
      .subscribe(res => {
        console.log(res);
        this.spinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          this.idCabecera = res[0].Id;
          if(this.Flg_Aprobado == 'R'){
            this.mostrarRechazo = true;
          }
          this.matSnackBar.open('Se actualizo el estado correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
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
  }

  CargarOperacionTemporada() {

    console.log(this.formulario.get('sEstilo')?.value)
    this.Cod_TemCli = ''
    this.Cod_EstCli = this.formulario.get('sEstilo')?.value
    this.defectosAlmacenDerivadosService.Cf_Busca_TemporadaCliente(this.Cod_Cliente, this.Cod_EstCli).subscribe(
      (result: any) => {
        this.listar_operacionTemporada = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  /*************************************CARGAR SELECT COLOR*********************************************** */
  CargarOperacionColor(Nom_TemCli: string) {

    this.Nom_TemCli = Nom_TemCli
    this.Cod_ColCli = this.formulario.get('sColor')?.value
    this.Cod_EstCli = this.formulario.get('sEstilo')?.value
    this.Cod_TemCli = this.formulario.get('sTemporada')?.value
    this.defectosAlmacenDerivadosService.SM_Presentaciones_OrdPro(this.Op).subscribe(
      (result: any) => {
        this.listar_operacionColor = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  /*************************************CARGAR SELECT COLOR*********************************************** */

  /**********************COMPLETAR CLIENTE Y ESTILO POR OP********************************* */
  BuscarPorOP() {
    this.Op = this.formulario.get('sOP')?.value
    console.log(this.formulario.get('sOP')?.value);
    this.spinnerService.show();
    this.defectosAlmacenDerivadosService.Cf_Busca_OP_Cliente_Estilo_Temporada(this.Op).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        console.log(result.length + 'PruebaOP')
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
          this.getLineaOP();
          this.matSnackBar.open('Se encontraron registros...!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {
          this.matSnackBar.open('La OP no existe...!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          //this.mostrarAlertaCaidasMayora1()
        }


      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })

  }

  /**********************COMPLETAR CLIENTE Y ESTILO POR OP********************************* */


}
