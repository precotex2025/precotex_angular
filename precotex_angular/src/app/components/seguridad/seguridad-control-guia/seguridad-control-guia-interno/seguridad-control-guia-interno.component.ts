import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SeguridadControlGuiaService } from '../../../../services/seguridad-control-guia.service';

import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from "@angular/common";


import { DialogConfirmacion2Component } from 'src/app/components/dialogs/dialog-confirmacion2/dialog-confirmacion2.component'
import { DialogCambioJabaComponent } from '../seguridad-control-guia-salida/dialog-cambio-jaba/dialog-cambio-jaba.component';

interface Listar_Guia {
  num_guia: string;
  cod_proveedor: string,
  num_planta_origen: number,
  origen: string;
  cod_entregado: string;
  nom_entregado: string;
  num_bulto: number;
  num_cantidad: number;
  num_peso: number;
  cod_despachado: string;
  nom_despachado: string;
  glosa: string;
  Cod_Vehiculo: number;
}

@Component({
  selector: 'app-seguridad-control-guia-interno',
  templateUrl: './seguridad-control-guia-interno.component.html',
  styleUrls: ['./seguridad-control-guia-interno.component.scss']
})
export class SeguridadControlGuiaInternoComponent implements OnInit {
  seleccionaFila: any[] = []; 
  row1: any;
  nNum_Planta = GlobalVariable.num_planta;

  //* Declaramos las variables a usar */
  cod_accion = 'I'
  texto_libre = ''
  texto_libre2 = ''
  des_planta = ''
  origen_select = ''
  nom_entregado = ''
  cod_despachado_select = ''
  nom_despachado = ''
  glosa_select = ''

  // Almacenar la serie y numero de guia
  lc_Serie: string = '';
  lc_Numero: string = '';

  Visible_Registro_Personal: boolean = false

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    num_guia: [''],
    cod_proveedor: [''],
    num_planta_origen: [0],
    origen: [''],
    cod_entregado: [''],
    nom_entregado: [''],
    num_bulto: [0],
    num_cantidad: [0],
    num_peso: [0],
    cod_despachado: [''],
    nom_despachado: [''],
    glosa: [''],
    Fecha_Inicio: [''],
    Fecha_Fin: [''],
    Cod_Vehiculo: [''],
    BuscarJabas: ['']
  })

  personalForm = this.formBuilder.group({
    num_dni: [''],
    ape_paterno: [''],
    ape_materno: [''],
    nombres: ['']
  })

  msg: string = '';
  dataVehiculos = [];
  listar_guias: Listar_Guia[] = [];

  displayedColumns: string[] = [
    'Codigo_Barra',
    'Ubicacion',
    'OK',
    'RL',
    '2RL',
    'RT',
    '2RT',
    'G',
    'OUT',
    'RO',
    'Acciones'
  ];

  dataSource: MatTableDataSource<any>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataJabas = [];
   datosFiltrados = [];
   
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    public dialog: MatDialog,
    private seguridadControlGuiaService: SeguridadControlGuiaService,
    private datepipe: DatePipe) {
    this.dataSource = new MatTableDataSource();

  }
  @ViewChild('myInput') myInput: any; 
  ngOnInit(): void {
    this.MostrarTitulo()
    //this.ListarGuia()
    this.getVehiculos();

    this.formulario.get('Cod_Vehiculo').disable();
  }

  MostrarTitulo() {
    if (GlobalVariable.num_planta == 1) {
      this.des_planta = 'SANTA MARIA'
    } else if (GlobalVariable.num_planta == 2) {
      this.des_planta = 'SANTA CECILIA'
    } else if (GlobalVariable.num_planta == 3) {
      this.des_planta = 'HUACHIPA SEDE I'
    } else if (GlobalVariable.num_planta == 4) {
      this.des_planta = 'HUACHIPA SEDE II'
    } else if (GlobalVariable.num_planta == 5) {
      this.des_planta = 'INDEPENDENCIA'
    } else if (GlobalVariable.num_planta == 14) {
      this.des_planta = 'INDEPENDENCIA II'
    } else if (GlobalVariable.num_planta == 13) {
      this.des_planta = 'SANTA ROSA'
    } else if (GlobalVariable.num_planta == 15) {
      this.des_planta = 'FARADAY'
    } else if (GlobalVariable.num_planta == 17) {
      this.des_planta = 'HUACHIPA SEDE III'
    } else {
      this.des_planta = ''
    }
  }

  ListarGuia() {
    this.seguridadControlGuiaService.ListarGuiaInternoService(GlobalVariable.num_planta).subscribe(
      (result: any) => {
        this.listar_guias = result;
        console.log(result)
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  changeRadio(event, Id, valor) {

    if (event.checked) {
      console.log('true')
      this.dataJabas.forEach(element => {

        if (element.Id == Id) {
          if (valor == 'OK') {
            element.OK = 'OK ';
            element.RL = '';
            element['2RL'] = '';
            element['RT'] = '';
            element['2RT'] = '';
            element['G'] = '';
            element['OUT'] = '';
            element['RO'] = ' ';
          }

          if (valor == 'RL') {
            element.RL = 'RL ';
            element.OK = '';
          }

          if (valor == '2RL') {
            element['2RL'] = '2RL';
            element.OK = '';
          }

          if (valor == 'RT') {
            element['RT'] = 'RT ';
            element.OK = '';
          }

          if (valor == '2RT') {
            element['2RT'] = '2RT';
            element.OK = '';
          }

          if (valor == 'G') {
            element['G'] = 'G  ';
            element.OK = '';
          }

          if (valor == 'OUT') {
            element['OUT'] = 'OUT';
            element.OK = '';
          }

          if (valor == 'RO') {
            element['RO'] = 'RO ';
            element.OK = '';
          }

        }

      });
      this.seleccionarFijo(this.row1);
    } else {
      console.log('falso')
      this.dataJabas.forEach(element => {
        if (element.Id == Id) {
          if (valor == 'OK') {
            element.OK = '';
          }

          if (valor == 'RL') {
            element.RL = '';
          }

          if (valor == '2RL') {
            element['2RL'] = '';
          }

          if (valor == 'RT') {
            element['RT'] = '';
          }

          if (valor == '2RT') {
            element['2RT'] = '';
          }

          if (valor == 'G') {
            element['G'] = '';
          }

          if (valor == 'OUT') {
            element['OUT'] = '';
          }

          if (valor == 'RO') {
            element['RO'] = '';
          }

        }

      });
    }

    this.seleccionarFijo(this.row1);

  }



  listarJabas(serie, numero) {

    this.seguridadControlGuiaService.ListarGuiaSalidaJabas(serie, numero).subscribe((result: any) => {
      if (result.length > 0) {
        this.dataJabas = result;

        if (this.dataJabas.length > 0) {
          this.dataJabas.forEach(element => {
            element.Opcion = 'I'
          });
          console.log(this.dataJabas);
          this.dataSource.data = this.dataJabas;
        

        }
      }
    });
  }


  DatosGuia(serie, Num_Guia) {
    var guia = serie + '-' + Num_Guia;

    this.seguridadControlGuiaService.ListarGuiaInternoServiceWeb(GlobalVariable.num_planta, guia).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        if (result.length > 0) {
          if (result[0].status == 1) {
            var guia_select = result;

            this.formulario.patchValue({ cod_proveedor: guia_select[0]?.cod_proveedor })
            this.formulario.patchValue({ num_planta_origen: guia_select[0]?.num_planta_origen })
            this.formulario.patchValue({ origen: guia_select[0]?.origen })
            this.formulario.patchValue({ cod_entregado: guia_select[0]?.cod_entregado })
            this.formulario.patchValue({ nom_entregado: guia_select[0]?.nom_entregado })
            this.formulario.patchValue({ num_bulto: guia_select[0]?.num_bulto })
            this.formulario.patchValue({ num_cantidad: guia_select[0]?.num_cantidad })
            this.formulario.patchValue({ num_peso: guia_select[0]?.num_peso })
            this.formulario.patchValue({ cod_despachado: guia_select[0]?.cod_despachado })
            this.formulario.patchValue({ nom_despachado: guia_select[0]?.nom_despachado })
            this.formulario.patchValue({
              glosa: guia_select[0]?.glosa,
              Cod_Vehiculo: guia_select[0]?.Cod_Vehiculo
            })
            this.origen_select = this.formulario.get('origen')?.value

            this.nom_entregado = this.formulario.get('nom_entregado')?.value

            this.cod_despachado_select = this.formulario.get('cod_despachado')?.value
            this.nom_despachado = this.formulario.get('nom_despachado')?.value
            this.glosa_select = this.formulario.get('glosa')?.value
            this.msg = '';
            this.listarJabas(serie, Num_Guia);
            this.fechaHoraInicial();
          } else if (result[0].status == 0) {
            this.personalForm.reset();
            this.formulario.patchValue({
              cod_proveedor: '',
              num_planta_origen: '',
              origen: '',
              cod_entregado: '',
              nom_entregado: '',
              num_bulto: '',
              num_cantidad: '',
              num_peso: '',
              cod_despachado: '',
              nom_despachado: '',
              glosa: '',
              Fecha_Inicio: '',
              Fecha_Fin: '',
              Cod_Vehiculo: ''
            });
            this.nom_entregado = '';
            this.cod_despachado_select = '';
            this.nom_despachado = '';
            this.glosa_select = '';
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
            this.origen_select = '';
            this.msg = result[0].Respuesta;

          }
        }
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })

  }

  BuscarNomTrabajador(sTipo: string) {
    if (sTipo == 'E') {
      this.texto_libre = this.formulario.get('cod_entregado')?.value
    } else {
      this.texto_libre = this.formulario.get('cod_despachado')?.value
    }

    if (this.texto_libre == null) {

    } else if (sTipo == 'E' && (this.texto_libre.length < 8 || this.texto_libre.length > 10)) {
      this.nom_entregado = ''
    } else if (sTipo == 'D' && (this.texto_libre.length < 8 || this.texto_libre.length > 10)) {
      this.nom_despachado = ''
    } else {

      this.seguridadControlGuiaService.BuscarNomTrabajadorService(this.texto_libre).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {

            if (sTipo == 'E') {
              this.formulario.patchValue({ nom_entregado: result[0].Nombres })
              this.nom_entregado = result[0].Nombres
            } else {
              this.formulario.patchValue({ nom_despachado: result[0].Nombres })
              this.nom_despachado = result[0].Nombres
            }

          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

            if (sTipo == 'E') {
              this.nom_entregado = ''
            }

            if (sTipo == 'D') {
              this.nom_despachado = ''
            }
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }
  }

  enviarJabas() {

    this.seguridadControlGuiaService.packingUpdateJaba(
      this.dataJabas
    ).subscribe(
      (result: any) => {
        if (result.msg == 'OK') {
          this.dataJabas = [];
          this.dataSource.data = this.dataJabas;
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  Guardar() {
    var conteo = this.dataJabas.length;
    var cuenta = 0;
    this.fechaHoraFinal();
    this.spinnerService.show();

    this.seguridadControlGuiaService.GuardarService(
      this.cod_accion,
      this.nNum_Planta,
      this.formulario.get('num_guia')?.value,
      this.formulario.get('cod_proveedor')?.value,
      this.nNum_Planta,
      this.formulario.get('num_planta_origen')?.value,
      this.formulario.get('cod_entregado')?.value,
      this.formulario.get('num_bulto')?.value,
      this.formulario.get('num_cantidad')?.value,
      this.formulario.get('num_peso')?.value,
      this.formulario.get('cod_despachado')?.value,
      this.formulario.get('glosa')?.value,
      this.formulario.get('Cod_Vehiculo')?.value,
      this.formulario.get('Fecha_Inicio')?.value,
      this.formulario.get('Fecha_Fin')?.value
    ).subscribe(

      (result: any) => {
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          if (this.dataJabas.length > 0) {
            this.enviarJabas();
          } else {
            this.spinnerService.hide();
          }
          this.Limpiar()
          this.ListarGuia()
          this.spinnerService.hide();
        }
        else {
          this.spinnerService.hide();
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      })
  }

  getVehiculos() {
    this.spinnerService.show();
    var Cod_Accion = 'L'
    var Des_Vehiculo = ''
    var Num_Placa = ''
    var Cod_Barras = ''
    var Flg_Activo = ''
    var Num_Soat = ''
    var Fec_Fin_Soat = ''
    var Num_Tarjeta_Prop = ''
    var Tmp_Carga = ''
    var Tmp_Descarga = ''
    var Cod_Conductor = ''
    var Cod_Vehiculo = ''
    /*if (this.formulario.get('sConductor')?.value == '') {
      this.nombres = ''
    }*/
    this.seguridadControlGuiaService.mantenimientoVehiculoService(
      Cod_Accion,
      Des_Vehiculo,
      Num_Placa,
      Cod_Barras,
      Flg_Activo,
      Num_Soat,
      Fec_Fin_Soat,
      Num_Tarjeta_Prop,
      Tmp_Carga,
      Tmp_Descarga,
      Cod_Conductor,
      Cod_Vehiculo
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {

          this.dataVehiculos = result
          this.spinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataVehiculos = []
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

  changeData(event) {
    var letra='';
    if (event != undefined) {
      var termino = event.target.value;

      if(termino.length==12){
        letra = termino.substring(0,1);
        if(letra!='T'){
          termino = termino.split("-");       
          this.DatosGuia(termino[0], termino[1]);         
        }
      }

      if (termino.length == 13) {
        termino = termino.split("-");
        console.log(termino);
        this.DatosGuia(termino[0], termino[1])
      } else {

      }

      this.lc_Serie = termino[0];
      this.lc_Numero = termino[1];
    }
  }

  Limpiar() {
    this.nom_entregado = ''
    this.cod_despachado_select = ''
    this.nom_despachado = ''
    this.glosa_select = ''
    this.origen_select = ''
    this.formulario.patchValue({
      Cod_Vehiculo: '',
      num_guia: '',
      cod_proveedor: '',
      num_planta_origen: 0,
      origen: '',
      cod_entregado: '',
      nom_entregado: '',
      num_bulto: 0,
      num_cantidad: 0,
      num_peso: 0,
      cod_despachado: '',
      nom_despachado: '',
      glosa: ''
    })
  }

  // Venta registro personal 
  MostrarVentanaPersonal() {
    this.Visible_Registro_Personal = !this.Visible_Registro_Personal

    this.personalForm.reset()

    this.texto_libre = this.formulario.get('cod_entregado')?.value
    this.texto_libre2 = this.formulario.get('cod_despachado')?.value

    if (this.texto_libre.length == 8 && this.nom_entregado.length == 0) {
      this.personalForm.patchValue({ num_dni: this.texto_libre })
      this.texto_libre2 = ''
    } else if (this.texto_libre2.length == 8 && this.nom_despachado.length == 0) {
      this.personalForm.patchValue({ num_dni: this.texto_libre2 })
      this.texto_libre = ''
    } else {
      this.texto_libre = ''
      this.texto_libre2 = ''
    }
  }

  GuardarRegistroPersonal() {
    this.seguridadControlGuiaService.GuardarPersonalService(
      this.personalForm.get('num_dni')?.value,
      this.personalForm.get('ape_paterno')?.value,
      this.personalForm.get('ape_materno')?.value,
      this.personalForm.get('nombres')?.value).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

            this.Visible_Registro_Personal = !this.Visible_Registro_Personal

            if (this.texto_libre.length == 8) {
              this.BuscarNomTrabajador('E')
            } else if (this.texto_libre2.length == 8) {
              this.BuscarNomTrabajador('D')
            } else {

            }
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
  
  fechaHoraInicial(){ 
    let fechaIni = new Date();
    this.formulario.patchValue({ Fecha_Inicio: this.datepipe.transform(fechaIni, 'yyyy-MM-ddTHH:mm')})
  }
  
  fechaHoraFinal(){ 
    let fechaFin = new Date();
    this.formulario.patchValue({ Fecha_Fin: this.datepipe.transform(fechaFin, 'yyyy-MM-ddTHH:mm')})
  }

  seleccionarFila(row: any) { 
    
    
    const index = this.seleccionaFila.indexOf(row);
    this.row1 = row;
    
    if (index === -1) {
      this.seleccionaFila.push(row);  
    } 
    else {
      this.seleccionaFila.splice(index, 1); 
    }
    
  }

  seleccionarFijo(row: any) { 
    
    
    const index = this.seleccionaFila.indexOf(row);
    this.row1 = row;
    
    if (index === -1) {
      this.seleccionaFila.push(row);  
    }  
    
  }

  isSeleccionadaFila(row: any): boolean {
    return this.seleccionaFila.includes(row);
  }
  
  filtrarDatos(valor: any) {
   
   this.datosFiltrados = this.dataSource.data.filter(item =>
      Object.values(item).some(val => val.toString().includes(valor.target.value))
    );
     
  }
  
  limpiarBuscarJabas(){
    this.formulario.patchValue({ BuscarJabas: '' });
    this.myInput.nativeElement.focus();
  } 

  refreshJabas(){
    this.datosFiltrados = this.dataSource.data.filter(item =>
      Object.values(item).some(val => val.toString().includes(''))
    );
    this.limpiarBuscarJabas();
  }


  // Cambiar Codigo de Barra Jaba del Packinglist
   // 2024Oct31, Ahmed
   onCambiarJaba(data_det: any){
    console.log(data_det)
    //console.log(data_det.Codigo_Barra)

    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Desea reemplazar la jaba " + data_det.Codigo_Barra + " del paking list?" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        console.log("ok")
        let dialogRef = this.dialog.open(DialogCambioJabaComponent, {
          disableClose: true,
          data: data_det
        });
    
        dialogRef.afterClosed().subscribe(result => {
          
          this.DatosGuia(this.lc_Serie, this.lc_Numero);
        });
      }
    });
  }

  // Quitar Jaba de Packinglist
   // 2024Nov01, Ahmed
  onQuitarJaba(data_det: any){
    let numGuia: string;

    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Desea quitar la jaba " + data_det.Codigo_Barra + " del paking list?" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        numGuia = this.lc_Serie.concat("-").concat(this.lc_Numero);
        console.log("ok")
        
        this.seguridadControlGuiaService.packingQuitarJaba(numGuia, data_det.Id, 'I').subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
              this.DatosGuia(this.lc_Serie, this.lc_Numero);
            }
            else{
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }));
      }
    });


  }








}
