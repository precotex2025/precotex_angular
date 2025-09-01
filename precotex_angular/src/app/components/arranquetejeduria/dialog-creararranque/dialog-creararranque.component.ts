import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArranquetejeduriaService } from 'src/app/services/arranquetejeduria.service';
import { GlobalVariable } from '../../../VarGlobals';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Auditor } from 'src/app/models/Auditor';
import { MatDialog } from '@angular/material/dialog';
import { DialogModificalongitudmallaComponent } from '../dialog-modificalongitudmalla/dialog-modificalongitudmalla.component';
import { MatTooltip } from '@angular/material/tooltip';
import { HostListener } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { Console } from 'console';

import { DialogCombinacionComponent } from '../dialog-combinacion/dialog-combinacion.component';
import { DialogAgregarpasadaComponent } from '../dialog-agregarpasada/dialog-agregarpasada.component';
import { Observable } from 'rxjs';
import { IngresoRolloTejidoService } from 'src/app/services/ingreso-rollo-tejido.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

interface data {
  boton: string;
  title: string;
  Opcion: string;
  Datos: any;
  Version: number;
}

interface data_det {
  Inspector: string;
  Tela: string;
  Maquina: string;
}


interface Tx_Tipo_Tejido {
  Cod_TipTejido: string,
  Descripcion: string,
}

interface Tx_Area_Tejido {
  Cod_Area: string,
  Descripcion: string,
}

interface DEFECTO {
  Cod_Motivo: string,
  Descripcion: string,
  Factor_Conversion: number,
}


@Component({
  selector: 'app-dialog-creararranque',
  templateUrl: './dialog-creararranque.component.html',
  styleUrls: ['./dialog-creararranque.component.scss'],
})


export class DialogCreararranqueComponent implements OnInit {

  /*Agregado por HMEDINA - 03/03/2025*/
  opciones = [
    { valor: "S", descripcion: "APROBADO" },
    { valor: "R", descripcion: "RECHAZADO" }
  ];

  @ViewChild('inputRef', { static: true, read: MatTooltip }) tooltip!: MatTooltip;
  @ViewChild('myinputDef') inputDef!: ElementRef;
  @ViewChild('myinputCantDef') inpuCantDef!: ElementRef;

  tooltipMessage: string = 'Escribe tu nombre aquí';
  nombre: string = '';

  @HostListener('window:resize', ['$event'])
  isMobile: boolean = false;

  onResize(event: Event)
  {
    this.isMobile = window.innerWidth < 768;
  }


  listar_tipotejidotela:  Tx_Tipo_Tejido[] = [];
  listar_areatejido: Tx_Area_Tejido[] = [];

  Cod_Ordtra = '';
  Num_Secuencia = '';
  Inspector = '';
  Cod_Tela = '';
  Cod_Maquina_Tejeduria = '';

  Ser_OrdComp = '';
  Cod_OrdComp = '';
  Turno = '';
  Cod_Cliente = '';
  cod_hiltel = '';
  Tit_Hilado = '';
  Composicion = '';
  Cod_Proveedor = '';
  Cod_Galga = '';
  Num_Alimentadores = '';
  Torsion = '';
  Cod_OrdProv = '';
  Num_Aguja = '';
  Diametro = '';
  Gramaje_Crudo = '';
  Gramaje_Crudo_Real = '';
  Ancho_Crudo = '';
  Ancho_Crudo_Real = '';
  Gramaje_Acab = '';
  Gramaje_Acab_Real = '';
  Tejedor = '';
  Observaciones = '';

  Flg_Rectilineo = '';
  Flg_Rectilineo_v2 = '';

  Tip_Trabajador = '';
  Cod_Trabajador = '';
  Cod_Trabajador_B = '';
  Cod_Trabajador_S = '';

  EstadoCola = '';
  xMensaje = '';
  DesCliente = '';

  file: any;
  RutaFoto = '';

  xAccion = '';
  xCod_Ordtra = '';
  xCod_Maquina_Tejeduria = '';
  xSer_OrdComp = '';
  xCod_OrdComp = '';
  xFecha = '';
  xCod_Tela = '';
  xTurno = '';
  xCod_Cliente_Tex = '';
  xcod_hiltel = '';
  xTit_Hilado = '';
  xComposicion = '';
  xCod_Proveedor = '';
  xCod_Galga = '';
  xNum_Alimentadores = '';
  xTorsion = '';
  xCod_OrdProv = '';
  xNum_Aguja = '';
  xDiametro = '';
  xGramaje_Crudo = '';
  xGramaje_Crudo_Real = '';
  xAncho_Crudo = '';
  xAncho_Crudo_Real = '';
  xGramaje_Acab = '';
  xGramaje_Acab_Real = '';
  xInspector = '';
  xTejedor = '';
  xCod_Usuario = '';
  xObservaciones = '';
  xFlag_Estado = '';
  xNum_Secuencia = '';
  xFlg_Aprobado = '';
  xRec_Largo_Std = '';
  xRec_Largo_Real = '';
  xRec_Alto_Std = '';
  xRec_Alto_Real = '';
  xRec_Peso_Std = '';
  xRec_Peso_Real = '';
  xRec_Pasadas_Std = '';
  xRec_Pasadas_Real = '';
  xRec_Tipo_Tejido = '';

  formHabilitaButton = false;

  gl_Combinacion = '';
  gl_Talla = '';

  isVisibleLongMallaButton = true;
  sCod_Usuario = GlobalVariable.vusu;
motivosSeleccionados: number[] = [];

  onFileChange(event: any): void {
    this.file = event.target.files[0];
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.RutaFoto = reader.result as string;
      };
    }
  }

  formulario = this.formBuilder.group({
    Cod_Ordtra: [''],
    Inspector: [''],
    Oc: [''],
    Cod_Tela: [''],
    Cod_Maquina_Tejeduria: [''],
    Combinacion: [''],
    Talla: [''],
    Cliente: [''],

    Hilo_Titulo: [''],
    Hilo_Compo: [''],
    Hilo_Lote: [''],
    Hilo_Proveedor: [''],

    Galga: [''],
    Sistemas: [''],
    Torsion: [''],
    Agujas: [''],
    Diametro: [''],

    Densidad: [''],
    Densidad_Real: [''],
    Ancho: [''],
    Ancho_Real: [''],
    Acabado: [''],
    Acabado_Real: [''],

    Largo: [''],
    Largo_Real: [''],
    Alto: [''],
    Alto_Real: [''],
    Peso_Unidad: [''],
    Peso_Unidad_Real: [''],
    Pasadas: [''],
    Pasadas_Real: [''],

    Observaciones: [''],
    ImaF: [''],
    p_Tipo_Tejido: [''],
    Tipo_Tejido_Tela: [''],
    Estado_Arranque: [''],

    //Otros
    Area_Arranque   :   [''],
    Motivo_Arranque :   [''],
    FechaHora_Arranque  :   [''],
  });

  listar_operacionAuditor: Auditor[] = [];
  dataSource: MatTableDataSource<data_det>;
  dataResult: Array<any> = [];

  listar_comboTalla:  data_det[] = [];

  listar_operacionDE: DEFECTO [] = [];

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private arranquetejeduria: ArranquetejeduriaService,
    private ingresoRolloTejidoService: IngresoRolloTejidoService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: data,
    public dialogRef: MatDialogRef<DialogModificalongitudmallaComponent>,
    private toastr      : ToastrService,
  ) {}



  openDialog(): void
  { const dialogRef = this.dialog.open(DialogComponent,
    { data: {
      title: 'OBSERVACIÓN DE LOTE',
      message:   this.tooltipMessage
    }
    });
  }

  DisableFotoButtom = false;
  DisableSaveButton = false;
  DisableLongMallaButton = false;
  DisablePasadaRealesButton = false;
  DisableInicioButton  = false;
  DisableAgregarPasadasButton = false;

  ngOnInit(): void {
    //this.showInspector()
    //this.Flg_Rectilineo='S'

    this.formulario.get('Cod_Ordtra').disable();
    this.formulario.get('Inspector').disable();
    this.formulario.get('Cod_Tela').disable();
    this.formulario.get('Oc').disable();
    this.formulario.get('Cod_Maquina_Tejeduria').disable();
    this.formulario.get('Combinacion').disable();
    this.formulario.get('Talla').disable();
    this.formulario.get('Cliente').disable();

    this.formulario.get('Hilo_Titulo').disable();
    this.formulario.get('Hilo_Compo').disable();
    this.formulario.get('Hilo_Lote').disable();
    this.formulario.get('Hilo_Proveedor').disable();

    this.formulario.get('Galga').disable();
    this.formulario.get('Sistemas').disable();
    this.formulario.get('Torsion').disable();
    this.formulario.get('Agujas').disable();
    this.formulario.get('Diametro').disable();

    this.formulario.get('Densidad').disable();
    this.formulario.get('Ancho').disable();
    this.formulario.get('Acabado').disable();

    this.formulario.get('Largo').disable();
    this.formulario.get('Alto').disable();
    this.formulario.get('Peso_Unidad').disable();
    this.formulario.get('Pasadas').disable();

    this.formulario.get('Cod_Ordtra')?.setValue(this.data.Datos.OT);

    this.formulario.get('ImaF').disable();
    this.formulario.get('Tipo_Tejido_Tela').disable();
    this.formulario.get('FechaHora_Arranque').disable();

    this.Cod_Ordtra = this.data.Datos.OT;
    this.Num_Secuencia = this.data.Datos.SEC;

    if (this.data.Datos.ESTADO == '1') {
      this.EstadoCola = 'U';
      this.xMensaje = 'Se actualizo correctamente';
      //this.DisableSaveButton = true;
    } else {
      this.EstadoCola = 'I';
      this.xMensaje = 'Se Creo correctamente';
      //this.DisableSaveButton = false;
    }
    
    this.MostrarDatosOt();
    this.mostrarDatosInspector();
    this.listarTipoTejidoTela();
    this.listarAreaTejido();
    this.showDefectos();
  }

  step = -1;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ValidaEstadoOT() {

    //VALIDAMOS SI LA OPCION ES INSERTAR OJO QUE SOLO ES DATO NO ES QUE REGISTRAR
    if (this.data.Opcion == 'I'){

      this.formulario.get('Densidad_Real')?.setValue(0);
      this.formulario.get('Ancho_Real')?.setValue(.00);
      this.formulario.get('p_Tipo_Tejido')?.reset();

      this.formulario.get('Observaciones')?.setValue('');
      this.formulario.get('Estado_Arranque')?.reset();    
      
      //Campos Nuevos
      this.formulario.get('Motivo_Arranque')?.reset();
      this.formulario.get('Area_Arranque')?.reset();
      //this.formulario.get('FechaHora_Arranque')?.setValue('');    

    }else {

      if (this.xFlg_Aprobado == 'S'){

        this.formulario.get('Observaciones').disable();
        this.formulario.get('Estado_Arranque').disable();
        this.formulario.get('Motivo_Arranque')?.disable();
        this.formulario.get('Area_Arranque')?.disable();
        this.formulario.get('FechaHora_Arranque')?.disable();

        //Datos de Formulario Rectilinio
        this.formulario.get('Densidad_Real').disable();
        this.formulario.get('Ancho_Real').disable();
        this.formulario.get('p_Tipo_Tejido').disable();   
        
        //Boton de Foto
        this.DisableFotoButtom = true;

        //Boton de Guardar
        this.DisableSaveButton = true;

        //Boton de Inicio
        this.DisableInicioButton  = true;

        //Boton de Agregar pasadas
        this.DisableAgregarPasadasButton = true;

      }else {

        this.formulario.get('Observaciones').enable();
        this.formulario.get('Estado_Arranque').enable();  

        this.formulario.get('Motivo_Arranque')?.disable();
        this.formulario.get('Area_Arranque')?.disable();    
        
        //Boton de Inicio
        this.DisableInicioButton  = false;
        
      }
    }

    if (!this.data.Datos.FCH_INICIO || this.data.Datos.FCH_INICIO.trim() === '') {
      this.DisableSaveButton = true;
      this.DisableFotoButtom = true;
      this.DisableLongMallaButton = true;
      this.DisableAgregarPasadasButton = true;
      this.formulario.get('FechaHora_Arranque')?.setValue('');
    }else {

      //Boton de Inicio
      if (this.xFlg_Aprobado == 'R' && this.data.Opcion == 'U'){
          this.DisableInicioButton  = true;
          this.formulario.get('FechaHora_Arranque')?.setValue(this.data.Datos.FCH_INICIO);
      }else if(this.xFlg_Aprobado == 'R' && this.data.Opcion == 'I'){
          //Validar que la FCH_HORA_PROGRAMADA NO TENGA VERSION
          this.getObtenerArranqueCtrolSinVersion(this.Cod_Ordtra, Number(this.Num_Secuencia), this.data.Datos.FCH_INICIO);
      }else {
          this.formulario.get('FechaHora_Arranque')?.setValue(this.data.Datos.FCH_INICIO);
          this.DisableInicioButton  = true;
      }

    }
  }

  EvaluaSiRectilineo() {
    if (this.Flg_Rectilineo == 'S') {
      this.formulario.get('Densidad_Real').disable();
      this.formulario.get('Ancho_Real').disable();
      this.formulario.get('p_Tipo_Tejido').disable();
      this.formulario.get('Tipo_Tejido_Tela').disable();

      //Cuando es Rectilinio Deshabilitamos los botones de Pasadas
      this.formulario.get('Largo_Real').disable();
      this.formulario.get('Alto_Real').disable();
      this.formulario.get('Peso_Unidad_Real').disable();
      this.formulario.get('Pasadas_Real').disable();

      //Prender el boton de Agregar Pasadas.
      this.DisablePasadaRealesButton = true;

      //Mostrar el boton
      this.isVisibleLongMallaButton = false;      

      //this.matSnackBar.open("1", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    } else {
      this.formulario.get('Largo_Real').disable();
      this.formulario.get('Alto_Real').disable();
      this.formulario.get('Peso_Unidad_Real').disable();
      this.formulario.get('Pasadas_Real').disable();

      //Apagar el boton de Agregar Pasadas.
      this.DisablePasadaRealesButton = false;

      //Mostrar el boton
      this.isVisibleLongMallaButton = true;

      //this.matSnackBar.open("2", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  MostrarDatosOt() {
    //this.SpinnerService.show();

    this.arranquetejeduria
      .MostrarOt(this.Cod_Ordtra, this.Num_Secuencia)
      .subscribe(
        (result: any) => {
          if (result.length > 0) {
            this.Flg_Rectilineo = result[0].Flg_Rectilineo;

            this.formulario.get('Oc')?.setValue(result[0].Ser_OrdComp + ' - ' + result[0].Cod_OrdComp);
            this.formulario.get('Cod_Tela')?.setValue(result[0].Cod_Tela + ' - ' + result[0].Des_Tela);
            this.formulario.get('Cod_Maquina_Tejeduria')?.setValue(result[0].Maquina);
            this.formulario.get('Combinacion')?.setValue(result[0].Des_Comb);
            this.formulario.get('Talla')?.setValue(result[0].Cod_Talla);
            this.formulario.get('Cliente')?.setValue(result[0].Cliente);
            this.formulario.get('Hilo_Titulo')?.setValue(result[0].cod_hiltel);
            this.formulario.get('Hilo_Compo')?.setValue(result[0].Composicion);
            this.formulario.get('Hilo_Lote')?.setValue(result[0].Lote);

            this.tooltipMessage = result[0].Lote_Obs;
            this.tooltip.message = this.tooltipMessage;

            this.formulario.get('Hilo_Proveedor')?.setValue(result[0].Proveedor_Hilado);

            this.formulario.get('Galga')?.setValue(result[0].Galga);
            this.formulario.get('Sistemas')?.setValue(result[0].Num_Sistemas);
            this.formulario.get('Torsion')?.setValue(result[0].Torsion);
            this.formulario.get('Agujas')?.setValue(result[0].Num_Aguja);
            this.formulario.get('Diametro')?.setValue(result[0].Diametro);

            this.formulario.get('Densidad')?.setValue(result[0].Densidad_Estandar);
            this.formulario.get('Ancho')?.setValue(result[0].Ancho_Estandar);
            this.formulario.get('Acabado')?.setValue(result[0].Acabado_Estandar);

            this.formulario.get('Densidad_Real')?.setValue(result[0].Densidad_Real);

            this.formulario.get('Ancho_Real')?.setValue(result[0].Ancho_Real);
            this.formulario.get('Acabado_Real')?.setValue(result[0].Acabado_Real);

            this.formulario.get('Largo')?.setValue(result[0].Rec_Largo_Std);
            this.formulario.get('Largo_Real')?.setValue(result[0].Rec_Largo_Real);
            this.formulario.get('Alto')?.setValue(result[0].Rec_Alto_Std);
            this.formulario.get('Alto_Real')?.setValue(result[0].Rec_Alto_Real);


            this.formulario.get('Peso_Unidad')?.setValue(result[0].Rec_Peso_Std);
            this.formulario.get('Peso_Unidad_Real')?.setValue(result[0].Rec_Peso_Real);
            this.formulario.get('Pasadas')?.setValue(result[0].Rec_Pasadas_Std);
            this.formulario.get('Pasadas_Real')?.setValue(result[0].Rec_Pasadas_Real);

            this.formulario.get('Observaciones')?.setValue(result[0].observaciones);
            this.formulario.get('Estado_Arranque')?.setValue(result[0].Flg_Aprobado);

            this.formulario.get('p_Tipo_Tejido')?.setValue(result[0].Tipo_Tejido);
            this.formulario.get('Tipo_Tejido_Tela')?.setValue(result[0].Tipo_Tejido_Tela);

            //Nuevos Datos
            const codMotivoLimpio = result[0].Cod_Motivo?.trim() || '';
            const codArea = result[0].Cod_Area?.trim() || '';

            //
            //this.formulario.get('Motivo_Arranque')?.setValue(codMotivoLimpio);

            /*************INI***************/
            /*SE CARGA LOS MOTIVOS MULTI*/
            if (result && result[0]?.Cod_Motivo) {
              // 1. Obtener el string y quitar espacios en blanco
              const motivosString = result[0].Cod_Motivo.trim();

              // 2. Convertir el string en array
              this.motivosSeleccionados = motivosString.split(',').map(x => x.trim());
            }
            /*************FIN***************/

            this.formulario.get('Area_Arranque')?.setValue(codArea);
            

            this.Flg_Rectilineo = result[0].Flg_Rectilineo;

            //this.xAccion = this.EstadoCola;
            this.xAccion = this.data.Opcion; //Agregado por Hmedina

            //Validamos Campos de Observación y Estado
            //if (this.xAccion == 'I'){
            //  this.formulario.get('Observaciones')?.setValue('');
            //  this.formulario.get('Estado_Arranque')?.reset(); 
            //} 

            this.xCod_Ordtra = result[0].OT;
            this.xCod_Maquina_Tejeduria = result[0].Cod_Maquina;
            this.xSer_OrdComp = result[0].Ser_OrdComp;
            this.xCod_OrdComp = result[0].Cod_OrdComp;
            this.xFecha = result[0].Fecha;
            this.xCod_Tela = result[0].Cod_Tela;
            this.xTurno = result[0].Turno;
            this.xCod_Cliente_Tex = result[0].Cod_Cliente_Tex;
            this.xcod_hiltel = result[0].cod_hiltel;
            this.xTit_Hilado = result[0].Titulo;
            this.xComposicion = result[0].Composicion;
            this.xCod_Proveedor = result[0].Cod_Proveedor;
            this.xCod_Galga = result[0].Galga;
            this.xNum_Alimentadores = result[0].Num_Sistemas;
            this.xTorsion = result[0].Torsion;
            this.xCod_OrdProv = result[0].Lote;
            this.xNum_Aguja = result[0].Num_Aguja;
            this.xDiametro = result[0].Diametro;
            this.xGramaje_Crudo = result[0].Densidad_Estandar;
            this.xGramaje_Crudo_Real =
            this.formulario.get('Densidad_Real')?.value;
            this.xAncho_Crudo = result[0].Ancho_Estandar;
            this.xAncho_Crudo_Real = this.formulario.get('Ancho_Real')?.value;
            this.xGramaje_Acab = result[0].Acabado_Estandar;
            this.xRec_Tipo_Tejido = this.formulario.get('p_Tipo_Tejido')?.value;
            this.xGramaje_Acab_Real = this.formulario.get('Acabado_Real')?.value;

            this.xCod_Usuario = GlobalVariable.vusu;
            this.xObservaciones = this.formulario.get('Observaciones')?.value;
            this.xFlag_Estado = this.formulario.get('Estado_Arranque')?.value;
            this.xNum_Secuencia = this.Num_Secuencia;
            this.xFlg_Aprobado = result[0].Flg_Aprobado;
            this.xRec_Largo_Std = result[0].Rec_Largo_Std;
            this.xRec_Largo_Real = this.formulario.get('Largo_Real')?.value;
            this.xRec_Alto_Std = result[0].Rec_Alto_Std;
            this.xRec_Alto_Real = this.formulario.get('Alto_Real')?.value;
            this.xRec_Peso_Std = result[0].Rec_Peso_Std;
            this.xRec_Peso_Real =
            this.formulario.get('Peso_Unidad_Real')?.value;
            this.xRec_Pasadas_Std = result[0].Rec_Pasadas_Std;
            this.xRec_Pasadas_Real = this.formulario.get('Pasadas_Real')?.value;
            this.DesCliente = result[0].Nom_Cliente;

            //Agregado a variable para validar
            this.gl_Combinacion = result[0].Des_Comb;
            this.gl_Talla = result[0].Cod_Talla;

            this.EvaluaSiRectilineo();
            this.ValidaEstadoOT();            

            //Muestra Dialog Combinaciones
            //this.openDialogCombinacion();

            //this.SpinnerService.hide();
          } else {

            //Agregado1. Deshabilita controles
            this.formulario.get('Densidad_Real').disable()    ;
            this.formulario.get('Ancho_Real').disable()       ;
            this.formulario.get('p_Tipo_Tejido').disable()    ;
            this.formulario.get('Tipo_Tejido_Tela').disable() ;
            this.formulario.get('Largo_Real').disable()       ;
            this.formulario.get('Alto_Real').disable()        ;
            this.formulario.get('Peso_Unidad_Real').disable() ;
            this.formulario.get('Pasadas_Real').disable()     ;        
            this.formulario.get('Observaciones').disable()    ; 
            this.formulario.get('Estado_Arranque').disable()  ;
            this.formulario.get('Motivo_Arranque').disable()  ;
            this.formulario.get('Area_Arranque').disable()  ;

            //Agregado2. Deshabilita Button
            this.DisableFotoButtom = true;
            this.DisableSaveButton = true;
            //this.DisableLongMallaButton = true;
            this.DisableInicioButton = true;
            this.DisablePasadaRealesButton = true;

            this.matSnackBar.open('No existen registros..!!', 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            });
            //this.SpinnerService.hide();
            this.dataSource.data = [];

            //Cerrar modal en caso no exista información
            this.dialogRef.close();
          }
        },
        (err: HttpErrorResponse) =>
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
      );
  }

  GuardarArranque() {
    if (this.formulario.get('comentarios')?.value == '') {
      this.matSnackBar.open('Rellene todos los campos!!!', 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
    } else {
      // @Accion								CHAR(1),
      // @Cod_Ordtra							Cod_OrdTra,
      // @Cod_Maquina_Tejeduria				char(10),
      // @Ser_OrdComp						Ser_OrdComp ='',
      // @Cod_OrdComp						Cod_OrdComp='',
      // @Fecha								datetime,
      // @Cod_Tela							Cod_Tela='',
      // @Turno								char (1)='',
      // @Cod_Cliente_Tex					Cod_Cliente='',
      // @cod_hiltel							varchar(150),
      // @Tit_Hilado							varchar(150),
      // @Composicion						varchar(150),
      // @Cod_Proveedor						Cod_Proveedor='',
      // @Cod_Galga							Cod_Galga='',
      // @Num_Alimentadores					numeric (3,0)=0,
      // @Torsion							varchar (100)='',
      // @Cod_OrdProv						varchar(150),
      // @Num_Aguja							numeric (4,0)=0,
      // @Diametro							Diametro=0,
      // @Gramaje_Crudo						Gramaje=0,
      // @Gramaje_Crudo_Real					Gramaje=0,
      // @Ancho_Crudo						Ancho_Tela=0,
      // @Ancho_Crudo_Real					Ancho_Tela=0,
      // @Gramaje_Acab						char(1)='',
      // @Gramaje_Acab_Real					char(1)='',
      // @Inspector							char(5)='',
      // @Tejedor							char (5)='',
      // @Cod_Usuario						varchar (15)='',
      // @Observaciones						VARCHAR(200)='',
      // @Num_Secuencia						Int	= 0,
      // @Flg_Aprobado						char(1)		= 'S',
      // @Rec_Largo_Std						numeric(20,2),
      // @Rec_Largo_Real						numeric(20,2),
      // @Rec_Alto_Std						numeric(20,2),
      // @Rec_Alto_Real						numeric(20,2),
      // @Rec_Peso_Std						numeric(20,3),
      // @Rec_Peso_Real						numeric(20,3),
      // @Rec_Pasadas_Std					numeric(20,2),
      // @Rec_Pasadas_Real					numeric(20,2)
      //39

      //this.SpinnerService.show();
      const formData = new FormData();

      formData.append('Accion', this.xAccion);
      formData.append('Cod_Ordtra', this.xCod_Ordtra);
      formData.append('Cod_Maquina_Tejeduria', this.xCod_Maquina_Tejeduria);
      formData.append('Ser_OrdComp', this.xSer_OrdComp);
      formData.append('Cod_OrdComp', this.xCod_OrdComp);
      formData.append('Fecha', this.xFecha);
      formData.append('Cod_Tela', this.xCod_Tela);
      formData.append('Turno', this.xTurno);
      formData.append('Cod_Cliente_Tex', this.xCod_Cliente_Tex);
      formData.append('cod_hiltel', this.xcod_hiltel);
      formData.append('Tit_Hilado', this.xTit_Hilado);
      formData.append('Composicion', this.xComposicion);
      formData.append('Cod_Proveedor', this.xCod_Proveedor);
      formData.append('Cod_Galga', this.xCod_Galga);
      formData.append('Num_Alimentadores', this.xNum_Alimentadores);
      formData.append('Torsion', this.xTorsion);
      formData.append('Cod_OrdProv', this.xCod_OrdProv);
      formData.append('Num_Aguja', this.xNum_Aguja);
      formData.append('Diametro', this.xDiametro);
      formData.append('Gramaje_Crudo', this.xGramaje_Crudo);
      formData.append('Gramaje_Crudo_Real', this.formulario.get('Densidad_Real')?.value);
      formData.append('Ancho_Crudo', this.xAncho_Crudo);
      formData.append('Ancho_Crudo_Real',this.formulario.get('Ancho_Real')?.value);
      formData.append('Gramaje_Acab', this.xGramaje_Acab);
      formData.append('Gramaje_Acab_Real', this.formulario.get('Acabado_Real')?.value);
      formData.append('Inspector', this.xInspector);
      formData.append('Tejedor', this.xTejedor);
      formData.append('Cod_Usuario', this.xCod_Usuario);
      formData.append('Observaciones', this.formulario.get('Observaciones')?.value);
      formData.append('Num_Secuencia', this.xNum_Secuencia);

      //formData.append('Flg_Aprobado', 'S');
      formData.append('Flg_Aprobado', this.formulario.get('Estado_Arranque')?.value);

      formData.append('Rec_Largo_Std', this.xRec_Largo_Std);
      formData.append('Rec_Largo_Real', this.formulario.get('Largo_Real')?.value);
      formData.append('Rec_Alto_Std', this.xRec_Alto_Std);
      formData.append('Rec_Alto_Real', this.formulario.get('Alto_Real')?.value);
      formData.append('Rec_Peso_Std', this.xRec_Peso_Std);
      formData.append('Rec_Peso_Real',this.formulario.get('Peso_Unidad_Real')?.value);
      formData.append('Rec_Pasadas_Std', this.xRec_Pasadas_Std);
      formData.append('Rec_Pasadas_Real', this.formulario.get('Pasadas_Real')?.value);
      formData.append('Foto', this.file);
      formData.append('Proveedor', this.formulario.get('Hilo_Proveedor')?.value);
      formData.append('Cliente', this.DesCliente);
      formData.append('NombreInspector', this.formulario.get('Inspector')?.value );
      formData.append('Tipo_Tejido', this.formulario.get('p_Tipo_Tejido')?.value );

      // formData.append('DENSIDAD_REAL', this.formulario.get('Densidad_Real')?.value);
      // formData.append('ANCHO_REAL', this.formulario.get('Ancho_Real')?.value);
      // formData.append('ACABADO_REAL', this.formulario.get('Acabado_Real')?.value);
      // formData.append('OBSERVACIONES',this.formulario.get('Observaciones')?.value);

      //Comentado aqui solo guardaba un solo motivo.
      //formData.append('Cod_Motivo', this.formulario.get('Motivo_Arranque')?.value );

      //Guarda los motivos seleccionados. Multi
      formData.append('Cod_Motivo', String(this.motivosSeleccionados));
      formData.append('Cod_Area', this.formulario.get('Area_Arranque')?.value );   
      
      //console.log('formData');
      //console.log(formData);
      //return;
      
      this.arranquetejeduria.GuardarArranqueV2(formData).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            //this.SpinnerService.hide();
            this.file = null;
            this.matSnackBar.open(this.xMensaje, 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            });
            //this.Limpiar()
            this.dialogRef.close();
          } else {
            // this.SpinnerService.hide();
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 1500,
            });
          }
        },
        (err: HttpErrorResponse) => {
          //this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });
        }
      );
    }//Cierre de la condicional IF
  }

  mostrarDatosInspector() {
    let Cod_Trabajador = GlobalVariable.vcodtra;
    let Tip_Trabajador = GlobalVariable.vtiptra;
    //if (dni_tejedor.length===8) {
    this.arranquetejeduria
      .traerDatosInspector(Cod_Trabajador, Tip_Trabajador)
      .subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            //this.formulario.get('dnitejedor')?.setValue(result[0].Nro_DocIde);
            this.Cod_Trabajador_B = result[0].Cod_Trabajador;
            //this.formulario.get('Inspector')?.setValue(result[0].Cod_Trabajador);
            //this.Cod_Trabajador=result[0].Cod_Trabajador;

            this.showInspector();
          }
        },
        (err: HttpErrorResponse) =>
          this.matSnackBar.open(err.message, 'Cerrar', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          })
      );
    //}
  }

  showInspector() {
    this.arranquetejeduria.showAuditor(this.Cod_Trabajador_B).subscribe(
      (result: any) => {
        //this.listar_operacionAuditor = result
        this.formulario.get('Inspector')?.setValue(result[0].Descripcion);
        this.Cod_Trabajador_S = result[0].Codigo;
        this.xInspector = this.Cod_Trabajador_S;
        this.xTejedor = this.Cod_Trabajador_S;
      },
      (err: HttpErrorResponse) =>
        this.matSnackBar.open(err.message, 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        })
    );
  }

  openDialogModificarLg() {
    let dialogRef = this.dialog.open(DialogModificalongitudmallaComponent, {
      disableClose: false,
      panelClass: 'my-class',
      data: {
        boton: 'LONGITUD DE MALLA',
        title: 'LONGITUD DE MALLA',
        Opcion: 'I',
        //Datos: data
        Cod_Ordtra: this.Cod_Ordtra,
        Cod_Maquina_Tejeduria: this.xCod_Maquina_Tejeduria,
        Num_Secuencia_OrdTra : this.xNum_Secuencia,
        Estado               : this.xFlag_Estado
      },
      minWidth: '46vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      //this.MostrarCabeceraFabricC();
    });
  }


  validateFormat(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
    if (!regex.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }



  listarTipoTejidoTela() {

    this.arranquetejeduria.listarTipoTejido().subscribe(
      (result: any) => {
        this.listar_tipotejidotela = result
        //console.log(this.listar_operacionMaquina);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  /*NUEVOS CAMBIOS 16/01/2025*/
  openDialogCombinacion() {
    let dialogRef = this.dialog.open(DialogCombinacionComponent, {
      disableClose: false,
      panelClass: 'my-class',
      data: {
        boton:'ARRANQUE',
        title:'LISTA DE COMBINACION DE TALLAS',
        CodOrdtra: this.formulario.get('Cod_Ordtra').value,
            }
      //,minWidth: '46vh'
      ,minHeight: '50vh'
    });

    dialogRef.afterClosed().subscribe(result => {

      this.formulario.get('Combinacion')?.setValue(result.Combinacion);
      this.formulario.get('Talla')?.setValue(result.Talla);

      /*Validamos si la combinacion y talla que seleccionamos
      son iguales a los de origen llena los campos con los mismos
      datos de origen*/
      if (String(result.Combinacion).trim() == this.gl_Combinacion.trim() &&
          String(result.Talla).trim() == this.gl_Talla.trim()){
            this.formulario.get('Largo_Real')?.setValue(this.xRec_Largo_Real);
            this.formulario.get('Alto_Real')?.setValue(this.xRec_Alto_Real);
            this.formulario.get('Peso_Unidad_Real')?.setValue(this.xRec_Peso_Real);
            this.formulario.get('Pasadas_Real')?.setValue(this.xRec_Pasadas_Real);
      }else{
        this.formulario.get('Largo_Real')?.setValue(0.00);
        this.formulario.get('Alto_Real')?.setValue(0.00);
        this.formulario.get('Peso_Unidad_Real')?.setValue(0.00);
        this.formulario.get('Pasadas_Real')?.setValue(0.00);
      }

    })
  }

  openDialogAgregarPasadasReales(){
    let dialogRef = this.dialog.open(DialogAgregarpasadaComponent, {
      disableClose: false,
      panelClass: 'my-class',
      data: {
        boton:'ARRANQUE',
        title:'LISTA DE COMBINACION DE TALLAS',
        title_Combinacion : this.formulario.get('Combinacion').value,
        CodOrdtra         : this.formulario.get('Cod_Ordtra').value,
        CodComb           : this.formulario.get('Combinacion').value.substring(0, 3),
        CodTalla          : this.formulario.get('Talla').value,
        valorLargo        : this.formulario.get('Largo').value,
        valorAlto         : this.formulario.get('Alto').value,
        valorPesoxUnidad  : this.formulario.get('Peso_Unidad').value,
        valorPasadas      : this.formulario.get('Pasadas').value,
        CodTela           : this.xCod_Tela,
        valorLargoReal    : this.xRec_Largo_Real,
        valorAltoReal     : this.xRec_Alto_Real,
        Data              : this.data.Datos,
        Version           : this.data.Version,
        Estado            : this.xFlag_Estado
            }
      ,minWidth: '80%'  // 80% del anch
      ,minHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    })
  }

  
  GetValidaVersionHojasArranque(){

    //const sObservacion: String | "" = this.formulario.get('Observaciones')?.value;
    const sEstado: String | "" = this.formulario.get('Estado_Arranque')?.value;
    //const sMotivo: string | "" = this.formulario.get('Motivo_Arranque')?.value;
    const sArea  : string | "" = this.formulario.get('Area_Arranque')?.value;

    this.arranquetejeduria.getValidaVersionHojasArranque(this.Cod_Ordtra, Number(this.Num_Secuencia), this.data.Version, this.Flg_Rectilineo).subscribe({
      next: (response: any)=> {
        if(response.success){
            if (response.codeTransacc == 2){
              this.matSnackBar.open(response.message, 'Cerrar', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 1500,
              });
            } else {

              // if (sObservacion == null){
              //   this.matSnackBar.open("Ingrese Observación", 'Cerrar', {
              //     horizontalPosition: 'center',
              //     verticalPosition: 'top',
              //     duration: 1500,s
              //   });
              //   return;                
              // }

              //if (sMotivo == null){

              if (sEstado == null){
                this.matSnackBar.open("Califique el Arranque (Aprobado | Rechazado).", 'Cerrar', {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 1500,
                });
                return;                
              } 

              if (sEstado == 'R') {
                if (this.motivosSeleccionados.length===0){
                  this.matSnackBar.open("Seleccione al menos un motivo.", 'Cerrar', {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 1500,
                  });
                  return;                  
                }

                if (sArea == null){
                  this.matSnackBar.open("Seleccione area.", 'Cerrar', {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 1500,
                  });
                  return;                  
                }    
              }          

              //aqui debe de grabar
              this.GuardarArranque();
            }
        }        
      },
      error: (error) => {
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
        });
      }
    });   

    //Verifica si es rectilinio o Tubular
    /*
    if (this.Flg_Rectilineo == 'S'){

      this.arranquetejeduria.getValidaVersionHojasArranque(this.Cod_Ordtra, Number(this.Num_Secuencia), this.data.Version).subscribe({
        next: (response: any)=> {
          if(response.success){
              if (response.codeTransacc == 2){
                this.matSnackBar.open(response.message, 'Cerrar', {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 1500,
                });
              } else {

                // if (sObservacion == null){
                //   this.matSnackBar.open("Ingrese Observación", 'Cerrar', {
                //     horizontalPosition: 'center',
                //     verticalPosition: 'top',
                //     duration: 1500,s
                //   });
                //   return;                
                // }

                if (sEstado == null){
                  this.matSnackBar.open("Califique el Arranque (Aprobado | Rechazado)", 'Cerrar', {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 1500,
                  });
                  return;                
                } 

                //aqui debe de grabar
                this.GuardarArranque();
              }
          }        
        },
        error: (error) => {
          console.log(error.error.message, 'Cerrar', {
          timeOut: 2500,
          });
        }
      });

    } else {

      if (sEstado == null){
        this.matSnackBar.open("Califique el Arranque (Aprobado | Rechazado)", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });
        return;                
      } 

      //Graba el Arranque
      this.GuardarArranque();

    }
    */
  }

    
  listarAreaTejido() {
    this.arranquetejeduria.listarAreaTejido().subscribe(
      (result: any) => {
        this.listar_areatejido = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }  

  showDefectos() {
    this.ingresoRolloTejidoService.showDefectos("B", "").subscribe(
      (result: any) => {
        this.listar_operacionDE = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }  

  getIniciarEntrega() {
    Swal.fire({
      title: '¿Desea registrar el Inicio de la entrega?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        //genera Inicio Entrega
        this.postGenerarEntrega();
      }else{
        //Verifica si obtiene version
        //this.getObtieneVersionArranque(data, Cod_Ordtra, Num_Secuencia);
      }
    });      
  }

  postGenerarEntrega() {
    let data: any = {
      "cod_OrdTra"        : this.data.Datos.OT  ,
      "num_Secuencia"     : this.data.Datos.SEC ,
      "version"           : 0                   ,
      "fch_Hora_Entrega"  : ""                  ,
      "usu_Registro"      : this.sCod_Usuario   ,
      "accion"            : "I"                 ,
    };  

    this.SpinnerService.show();
    this.arranquetejeduria.postCrudArranqueCtrol(data).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.codeResult == 200){
              this.toastr.success(response.message, '', {
                timeOut: 2500,
              });


              /*******INICIO DE BUSQUEDA DE ******/
              this.SpinnerService.hide();
              
              //Deshabilitar los botones
              this.DisableSaveButton      = false ;
              this.DisableFotoButtom      = false ;
              this.DisableLongMallaButton = false ;  
              this.DisableAgregarPasadasButton = false;
              this.DisableInicioButton    = true  ;
              this.getObtenerFechaArranqueCtrolSinVersion(this.data.Datos.OT , this.data.Datos.SEC);

              
            }else if(response.codeResult == 201){
              this.toastr.info(response.message, '', {
                timeOut: 2500,
              });
            } 

            this.SpinnerService.hide();

          }else{
            this.toastr.error(response.message, 'Cerrar', {
              timeOut: 2500,
            });
            this.SpinnerService.hide();
            //this.formulario.get('colgador_añadir')?.patchValue('');
            //this.inputAdd.nativeElement.focus();               
          }
        },
        error: (error) => {
          this.SpinnerService.hide();
          this.toastr.error(error.message, 'Cerrar', {
          timeOut: 2500,
           });
        }      
    });
  }

  getObtenerFechaArranqueCtrolSinVersion(Cod_Ordtra: string, Num_Secuencia: number){
    this.SpinnerService.show();
    this.arranquetejeduria.getObtenerArranqueCtrolSinVersion(Cod_Ordtra, Num_Secuencia).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            const fhca = response.elements[0].fch_Hora_Entrega;
            this.formulario.get('FechaHora_Arranque')?.setValue(String(fhca));
            this.SpinnerService.hide();
          }
          else{
            this.formulario.get('FechaHora_Arranque')?.setValue('');     
            this.SpinnerService.hide();
          };
        };
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });     
  }  

  getObtenerArranqueCtrolSinVersion(Cod_Ordtra: string, Num_Secuencia: number, Fecha: string)
  {
    this.arranquetejeduria.getObtenerArranqueCtrolSinVersion(Cod_Ordtra, Num_Secuencia).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            //tiene una fecha de inicio sin version por ende muestra la fecha de Inicio
            this.formulario.get('FechaHora_Arranque')?.setValue(Fecha);
            //habilita botones 
            this.DisableSaveButton      = false;    
            this.DisableLongMallaButton = false;
            this.DisableFotoButtom      = false;   
            this.DisableAgregarPasadasButton = false;
            this.DisableInicioButton    = true;         
            
            this.SpinnerService.hide();
          }
          else{
            //no tiene ninguna fecha de inicio por ende no muestra fecha 
            this.formulario.get('FechaHora_Arranque')?.setValue('');
            //deshabilita botones 
            this.DisableSaveButton      = true;     
            this.DisableLongMallaButton = true;
            this.DisableFotoButtom      = true; 
            this.DisableAgregarPasadasButton = true;           

            this.SpinnerService.hide();
          };
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });          
  }

onSelectionChange(event: any) {
  this.motivosSeleccionados = event.value;
}

}
