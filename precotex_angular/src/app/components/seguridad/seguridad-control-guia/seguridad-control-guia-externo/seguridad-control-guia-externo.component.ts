import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlGuiaService } from '../../../../services/seguridad-control-guia.service';

import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from "@angular/common";

interface Listar_Num_OrdComp {
  num_ordcomp: string;
  oc_spring: string;
}

@Component({
  selector: 'app-seguridad-control-guia-externo',
  templateUrl: './seguridad-control-guia-externo.component.html',
  styleUrls: ['./seguridad-control-guia-externo.component.scss']
})
export class SeguridadControlGuiaExternoComponent implements OnInit {

  //*num_guiaMascara = [/[A-Z-0-9]/i, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];*/
  num_guiaMascara = [/[A-Z-0-9]/i, /[A-Z-0-9]/i, /[A-Z-0-9]/i, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  num_ordcompMascara = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  nNum_Planta = GlobalVariable.num_planta;

  //* Declaramos las variables a usar */
  cod_accion = 'E'
  texto_libre = ''
  texto_libre2 = ''
  des_planta = ''
  nom_entregado = ''
  nom_despachado = ''

  num_guia = ''
  ruc_proveedor = ''
  nom_proveedor = ''

  ordcomp_proveedor = ''

  Visible_Registro_Personal: boolean = false
  Visible_Registro_OrdComp: boolean = false
  Visible_Registro_Ruc: boolean = false

  displayedColumns_cab: string[] = ['num_ordcomp', 'oc_spring', 'detalle']

  public data_ordcomp = [{
    num_ordcomp: "",
    oc_spring: "",
  }]

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    num_guia: [''],
    cod_proveedor: [''],
    ruc_proveedor: [''],
    nom_proveedor: [''],
    num_planta_origen: [0],
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
    Codigo_Barra: [''],
    Estado: ['']
  })

  rucForm = this.formBuilder.group({
    num_ordcomp: [''],
    ordcomp_proveedor: ['']
  })

  personalForm = this.formBuilder.group({
    num_dni: [''],
    ape_paterno: [''],
    ape_materno: [''],
    nombres: ['']
  })

  ordcompForm = this.formBuilder.group({
    num_ordcomp: ['']
  })

  dataVehiculos = [];

  listar_num_ordcomps: Listar_Num_OrdComp[] = [];

  displayedColumns: string[] = [
    'Codigo_Barra',
    //'Estado_Actual',
    'Ubicacion',
    'OK',
    'RL',
    '2RL',
    'RT',
    '2RT',
    'G',
    'OUT',
    'RO'
  ];


  dataSource: MatTableDataSource<any>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataJabas = [];
  ultimoValor: string;
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private seguridadControlGuiaService: SeguridadControlGuiaService,
    private datepipe: DatePipe) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.MostrarTitulo();
    this.getVehiculos();
    this.fechaHoraInicial();
  }

  MostrarTitulo() {
    if (GlobalVariable.num_planta == 1) {
      this.des_planta = 'Santa Maria'
    } else if (GlobalVariable.num_planta == 2) {
      this.des_planta = 'Santa Cecilia'
    } else if (GlobalVariable.num_planta == 3) {
      this.des_planta = 'Huachipa Sede I'
    } else if (GlobalVariable.num_planta == 4) {
      this.des_planta = 'Huachipa Sede II'
    } else if (GlobalVariable.num_planta == 5) {
      this.des_planta = 'Independencia'
    } else if (GlobalVariable.num_planta == 14) {
      this.des_planta = 'Independencia II'
    } else if (GlobalVariable.num_planta == 13) {
      this.des_planta = 'Santa Rosa'
    } else if (GlobalVariable.num_planta == 15) {
      this.des_planta = 'Faraday'
    } else if (GlobalVariable.num_planta == 17) {
      this.des_planta = 'Huachipa Sede III'
    } else {
      this.des_planta = ''
    }
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
  }

  BuscarNomProveedor() {
    this.texto_libre = this.formulario.get('ruc_proveedor')?.value

    if (this.texto_libre.length !== 11 || this.texto_libre == null) {
      this.formulario.patchValue({ cod_proveedor: '' })
      this.nom_proveedor = ''
    } else {

      this.seguridadControlGuiaService.BuscarNomProveedorService(this.texto_libre).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {

            this.formulario.patchValue({ cod_proveedor: result[0].Codigo })
            this.formulario.patchValue({ nom_proveedor: result[0].Nombres })

            this.nom_proveedor = result[0].Nombres

          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.formulario.patchValue({ cod_proveedor: '' })
            this.nom_proveedor = ''
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }
  }

  agregarJaba() {
  
    var filtrado = this.dataJabas.filter(element => {
      return element.Codigo_Barra == this.formulario.get('Codigo_Barra').value;
    });
    
    const nuevoValor = this.formulario.get('Codigo_Barra').value;
    if(filtrado.length == 0 && nuevoValor !== this.ultimoValor){
    
      this.seguridadControlGuiaService.Lg_Packing_Select_Jaba('S', this.formulario.get('Codigo_Barra').value, '', '', '', '').subscribe(
        (result: any) => {
          if (result.length > 0) {

            let datos = {
              Codigo_Barra: result[0].Codigo_Barra,
              Id: result[0].Id,
              Ubicacion: result[0].Ubicacion,
              Opcion: 'E',
              Num_Guia: this.formulario.get('num_guia')?.value,
              Cod_Usuario: GlobalVariable.vusu,
              'OK': result[0]['OK'],
              'RL': result[0]['RL'],
              '2RL': result[0]['2RL'],
              'RT': result[0]['RT'],
              '2RT': result[0]['2RT'],
              'G': result[0]['G'],
              'OUT': result[0]['OUT'],
              'RO': result[0]['RO']
            }
            this.formulario.patchValue({
              Codigo_Barra: ''
            });

            this.dataJabas.push(datos);
  
            this.dataSource.data = this.dataJabas;
            
          } else {
           
            this.matSnackBar.open('No se encontraron registros', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }else{
      this.matSnackBar.open('Ya ingresaste el código de Jaba anteriormente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    this.ultimoValor = nuevoValor;
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
    this.dataJabas.forEach(element => {
      element.Cod_Usuario = GlobalVariable.vusu
      element.Opcion = 'E';
    });
    this.fechaHoraFinal();
    this.spinnerService.show();
    this.seguridadControlGuiaService.GuardarService(
      this.cod_accion,
      this.nNum_Planta,
      this.formulario.get('num_guia')?.value,
      this.formulario.get('cod_proveedor')?.value,
      this.nNum_Planta,
      99,
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
          if(this.dataJabas.length > 0){
            this.enviarJabas();
          }else{
            this.spinnerService.hide();
          }
          this.Limpiar()
          this.spinnerService.hide();
        }
        else {
          this.spinnerService.hide();
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        this.spinnerService.hide();
      })
  }

  Limpiar() {

    this.nom_entregado = ''
    this.nom_despachado = ''
    this.formulario.patchValue({
      Cod_Vehiculo: '',
      num_guia: '',
      cod_proveedor: '',
      ruc_proveedor: '',
      nom_proveedor: '',
      num_planta_origen: 0,
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

  BuscarRucProveedor() {
    this.texto_libre = this.rucForm.get('num_ordcomp')?.value

    if (this.texto_libre.length !== 10 || this.texto_libre == null) {
      this.rucForm.patchValue({ ordcomp_proveedor: '' })
      this.ordcomp_proveedor = ''
    } else {

      this.seguridadControlGuiaService.BuscarNomProveedorService(this.texto_libre).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {

            this.rucForm.patchValue({ ordcomp_proveedor: result[0].Nombres })

            this.ordcomp_proveedor = result[0].Nombres

          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.rucForm.patchValue({ ordcomp_proveedor: '' })
            this.ordcomp_proveedor = ''
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }
  }

  // Venta registro personal 
  MostrarVentanaRuc() {
    this.Visible_Registro_Ruc = !this.Visible_Registro_Ruc

    this.rucForm.reset()

    // this.texto_libre = this.formulario.get('cod_entregado')?.value
    // this.texto_libre2 = this.formulario.get('cod_despachado')?.value

    // if (this.texto_libre.length==8 && this.nom_entregado.length==0){
    //   this.personalForm.patchValue({ num_dni: this.texto_libre })
    //   this.texto_libre2 = ''
    // }else if (this.texto_libre2.length==8 && this.nom_despachado.length==0){
    //   this.personalForm.patchValue({ num_dni: this.texto_libre2 })
    //   this.texto_libre = ''
    // }else {
    //   this.texto_libre = ''
    //   this.texto_libre2 = ''
    // }
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

  // Venta registro orden de compra 
  MostrarVentanaOrdComp() {

    this.num_guia = this.formulario.get('num_guia')?.value
    this.ruc_proveedor = this.formulario.get('ruc_proveedor')?.value
    this.num_guia = this.num_guia.replace("_", "").trim();

    if (this.Visible_Registro_OrdComp == true) {
      this.Visible_Registro_OrdComp = !this.Visible_Registro_OrdComp
    } else if (this.num_guia.length !== 13 || this.num_guia == null || this.ruc_proveedor.length !== 11 || this.nom_proveedor.length == 0) {
    } else {

      this.Visible_Registro_OrdComp = !this.Visible_Registro_OrdComp
      this.ListarOrdComp()
      this.CargarListaOrdComp()
    }

    //this.personalForm.reset()
  }

  ListarOrdComp() {
    this.ordcompForm.reset()
    this.seguridadControlGuiaService.ListarOrdCompService(this.formulario.get('cod_proveedor')?.value).subscribe(
      (result: any) => {
        //console.log(result)
        this.listar_num_ordcomps = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  InsertDeleteOrdComp(sAccion: string, sNum_OrdComp: string) {
    if (sAccion == 'I') {
      this.texto_libre = this.ordcompForm.get('num_ordcomp')?.value
    } else {
      this.texto_libre = sNum_OrdComp
    }

    if (this.texto_libre == null || this.texto_libre.length !== 10) {
      this.matSnackBar.open('Seleccione la Orden Compra..', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    } else {

      this.seguridadControlGuiaService.ManOrdCompService(
        sAccion,
        this.formulario.get('num_guia')?.value,
        this.formulario.get('cod_proveedor')?.value,
        this.texto_libre).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK0') {

              this.ListarOrdComp()
              this.CargarListaOrdComp()

            } else if (result[0].Respuesta == 'OK') {

              this.data_ordcomp = result
              this.ListarOrdComp()

            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }
  }

  CargarListaOrdComp() {

    this.seguridadControlGuiaService.CargarListaNumGuiaOrdCompService(this.formulario.get('num_guia')?.value,
      this.formulario.get('cod_proveedor')?.value).subscribe(
        (result: any) => {
          console.log('---------')
          console.log(result)
          this.data_ordcomp = result
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

  onJabaAutomatico(){
   
    if (this.formulario.get('Codigo_Barra').value?.length  === 8) {      
       this.agregarJaba();   
    }
  }
}
