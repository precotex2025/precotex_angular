import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { ControlActivoFijoService } from 'src/app/services/control-activo-fijo.service';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { DialogAgregarDescripcionComponent } from './dialog-agregar-descripcion/dialog-agregar-descripcion.component';


@Component({
  selector: 'app-control-activos-fijo',
  templateUrl: './control-activos-fijo.component.html',
  styleUrls: ['./control-activos-fijo.component.scss']
})
export class ControlActivosFijoComponent implements OnInit {

  formulario = this.formBuilder.group({
    //-----------NUEVO
    Cod_Activo_Fijo: [0],
    Empresa: ['', Validators.compose([Validators.required])],
    Sede: ['', Validators.compose([Validators.required])],
    Piso: ['', Validators.compose([Validators.required])],
    Ccosto: ['', Validators.compose([Validators.required])],
    Area: ['', Validators.compose([Validators.required])], //, Validators.pattern("^[a-zA-Z0-9 _-]{1,80}$")
    Responsable: ['', Validators.compose([Validators.required])], //, Validators.pattern("^[a-zA-Z0-9 _-]{1,50}$")
    Usuario: ['', Validators.compose([Validators.required])], //, Validators.pattern("^[a-zA-Z0-9 _-]{1,50}$")
    CodAct: ['', Validators.compose([Validators.required])], //, Validators.pattern("^[a-zA-Z0-9_-]{1,9}$")
    ClaseAct: ['', Validators.compose([Validators.required])],
    //UsuarioLog: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_-]$")])],
    Fijar: [''],
    Ubicacion: [''],
    Descripcion: ['', Validators.compose([Validators.required])], //, Validators.pattern("^[a-zA-Z0-9 _-]{1,200}$")
    Marca: [''], //, Validators.pattern("^[a-zA-Z0-9 _-]{1,50}$")
    Modelo: [''], //, Validators.pattern("^[a-zA-Z0-9 _-]{1,50}$")
    Serie: [''], //, Validators.pattern("^[a-zA-Z0-9_-]{1,20}$")
    Estado: [''], //, Validators.pattern("^[a-zA-Z0-9_-]$")
    Uso: [''], //, Validators.pattern("^[a-zA-Z0-9_-]$")
    Observacion: [''], //, Validators.pattern("^[a-zA-Z0-9 _-]{0,200}$")
    Color: [''], //, Validators.pattern("^[a-zA-Z0-9_-]$")
    Medidas: [''], //, Validators.pattern("^[a-zA-Z0-9_-]{1,20}$")
    Motor: [''], //, Validators.pattern("^[a-zA-Z0-9_-]{1,20}$")
    Chasis: [''], //, Validators.pattern("^[a-zA-Z0-9_-]{1,20}$")
    Placa: [''], //, Validators.pattern("^[a-zA-Z0-9_-]{1,7}$")
    Combustible: [''], //, Validators.pattern("^[a-zA-Z0-9_-]$")
    Caja: [''], //, Validators.pattern("^[a-zA-Z0-9_-]$")
    Asiento: [''], //, Validators.pattern("^[a-zA-Z0-9_-]$")
    Fabricacion: [''], //, Validators.pattern("^[a-zA-Z0-9_-]{1,50}$")
    Ejes: [''], //, Validators.pattern("^[a-zA-Z0-9_-]$")

  })
  data: any = [];
  dataEmpresas: any = [];
  dataTrabajadores: any = [];
  dataPeriodos: Array<any> = [];
  dataSedes: Array<any> = [];
  dataColor: Array<any> = [];
  dataCaja: Array<any> = [];
  ClaseActivos: Array<any> = [];
  dataAsiento: Array<any> = [];
  dataDescripcion: Array<any> = [];
  dataEje: Array<any> = [];
  dataCombustible: Array<any> = [];
  dataEstado: Array<any> = [];
  dataUso: Array<any> = [];
  sede: string = '';

  detalleCategoria = {
    vehiculos: false,
    muebles: false,
    computo: false,
    comunicaciones: false,
    laboratorio: false,
    energia: false,
    electrodomesticos: false,
    maquinas_industriales: false,
    diversos: false,
    otros: false
  }

  dataFijar = {
    empresa: false,
    sede: false,
    piso: false,
    area: false,
    centro: false,
    ubicacion: false,
    responsable: false,
    usuario: false,
    clase: false,
    descripcion: false,
    marca: false,
    modelo:false,
    serie:false,
    motor:false,
    chasis: false,
    placa: false,
    color: false,
    medidas: false,
    estado: false,
    uso: false,
    combustible: false,
    caja: false,
    asiento: false,
    fabricacion: false,
    ejes: false,
    observacion: false
  }

  deshabilitar: boolean = false;

  sCod_Usuario = GlobalVariable.vusu

  validarForm = false;

  Cod_Accion = ""
  Cod_Item_Cab = 0
  Cod_Empresa = 0
  Planta = ""
  Piso = 0
  Cod_CenCost = ""
  Nom_Area = ""
  Nom_Responsable = ""
  Nom_Usuario = ""
  Ubicacion = ""
  Cod_Activo = ""
  Clase_Activo = 0


  tipo = 1;
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private despachoTelaCrudaService: RegistroPermisosService,
    private controlActivoFijoService: ControlActivoFijoService,
    private _router: Router,
    private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.cargarEmpresas();
    this.CargarOperacionClase();
    this.MostrarCaja();
    this.MostrarAsiento();
    this.MostrarEje();
    this.MostrarEstado();
    this.MostrarUso();
    this.MostrarColor();
    this.MostrarCombustible();
    this.getDescripcionActivos();
    console.log(this.formulario);
  }
  ngAfterViewInit(): void {
  }

  MostrarCaja() {
    this.Cod_Accion = "J"
    this.Cod_Item_Cab = 0
    this.Cod_Empresa = 0
    this.Planta = ""
    this.Piso = 0
    this.Cod_CenCost = ""
    this.Nom_Area  = ""
    this.Cod_Activo = ""
    this.Clase_Activo = 0
    this.Nom_Responsable = ""
    this.Nom_Usuario = "",
    this.Ubicacion = ""
    this.controlActivoFijoService.MantenimientoActivoFijoCabeceraService(
      this.Cod_Accion,
      this.Cod_Item_Cab,
      this.Cod_Empresa,
      this.Planta,
      this.Piso,
      this.Cod_CenCost,
      this.Nom_Area,
      this.Cod_Activo,
      this.Clase_Activo,
      this.Nom_Responsable,
      this.Nom_Usuario,
      this.Ubicacion
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.dataCaja = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  MostrarAsiento() {
    this.Cod_Accion = "S"
    this.Cod_Item_Cab = 0
    this.Cod_Empresa = 0
    this.Planta = ""
    this.Piso = 0
    this.Cod_CenCost = ""
    this.Nom_Area = ""
    this.Cod_Activo = ""
    this.Clase_Activo = 0
    this.Nom_Responsable = ""
    this.Nom_Usuario = ""
    this.Ubicacion = ""
    this.controlActivoFijoService.MantenimientoActivoFijoCabeceraService(
      this.Cod_Accion,
      this.Cod_Item_Cab,
      this.Cod_Empresa,
      this.Planta,
      this.Piso,
      this.Cod_CenCost,
      this.Nom_Area,
      this.Cod_Activo,
      this.Clase_Activo,
      this.Nom_Responsable,
      this.Nom_Usuario,
      this.Ubicacion
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.dataAsiento = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  MostrarEje() {
    this.Cod_Accion = "N"
    this.Cod_Item_Cab = 0
    this.Cod_Empresa = 0
    this.Planta = ""
    this.Piso = 0
    this.Cod_CenCost = ""
    this.Nom_Area = ""
    this.Cod_Activo = ""
    this.Clase_Activo = 0
    this.Nom_Responsable = ""
    this.Nom_Usuario = ""
    this.Ubicacion = ""
    this.controlActivoFijoService.MantenimientoActivoFijoCabeceraService(
      this.Cod_Accion,
      this.Cod_Item_Cab,
      this.Cod_Empresa,
      this.Planta,
      this.Piso,
      this.Cod_CenCost,
      this.Nom_Area,
      this.Cod_Activo,
      this.Clase_Activo,
      this.Nom_Responsable,
      this.Nom_Usuario,
      this.Ubicacion
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.dataEje = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  MostrarEstado() {
    this.Cod_Accion = "F"
    this.Cod_Item_Cab = 0
    this.Cod_Empresa = 0
    this.Planta = ""
    this.Piso = 0
    this.Cod_CenCost = ""
    this.Nom_Area = ""
    this.Cod_Activo = ""
    this.Clase_Activo = 0
    this.Nom_Responsable = ""
    this.Nom_Usuario = ""
    this.Ubicacion = ""
    this.controlActivoFijoService.MantenimientoActivoFijoCabeceraService(
      this.Cod_Accion,
      this.Cod_Item_Cab,
      this.Cod_Empresa,
      this.Planta,
      this.Piso,
      this.Cod_CenCost,
      this.Nom_Area,
      this.Cod_Activo,
      this.Clase_Activo,
      this.Nom_Responsable,
      this.Nom_Usuario,
      this.Ubicacion
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.dataEstado = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  MostrarUso() {
    this.Cod_Accion = "A"
    this.Cod_Item_Cab = 0
    this.Cod_Empresa = 0
    this.Planta = ""
    this.Piso = 0
    this.Cod_CenCost = ""
    this.Nom_Area = ""
    this.Cod_Activo = ""
    this.Clase_Activo = 0
    this.Nom_Responsable = ""
    this.Nom_Usuario = ""
    this.Ubicacion = ""
    this.controlActivoFijoService.MantenimientoActivoFijoCabeceraService(
      this.Cod_Accion,
      this.Cod_Item_Cab,
      this.Cod_Empresa,
      this.Planta,
      this.Piso,
      this.Cod_CenCost,
      this.Nom_Area,
      this.Cod_Activo,
      this.Clase_Activo,
      this.Nom_Responsable,
      this.Nom_Usuario,
      this.Ubicacion = ""
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.dataUso = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  MostrarColor() {
    this.Cod_Accion = "O"
    this.Cod_Item_Cab = 0
    this.Cod_Empresa = 0
    this.Planta = ""
    this.Piso = 0
    this.Cod_CenCost = ""
    this.Nom_Area = ""
    this.Cod_Activo = ""
    this.Clase_Activo = 0
    this.Nom_Responsable = ""
    this.Nom_Usuario = "",
    this.Ubicacion = ""
    this.controlActivoFijoService.MantenimientoActivoFijoCabeceraService(
      this.Cod_Accion,
      this.Cod_Item_Cab,
      this.Cod_Empresa,
      this.Planta,
      this.Piso,
      this.Cod_CenCost,
      this.Nom_Area,
      this.Cod_Activo,
      this.Clase_Activo,
      this.Nom_Responsable,
      this.Nom_Usuario,
      this.Ubicacion
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.dataColor = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }


  MostrarCombustible() {
    this.Cod_Accion = "T"
    this.Cod_Item_Cab = 0
    this.Cod_Empresa = 0
    this.Planta = ""
    this.Piso = 0
    this.Cod_CenCost = ""
    this.Nom_Area = ""
    this.Cod_Activo = ""
    this.Clase_Activo = 0
    this.Nom_Responsable = ""
    this.Nom_Usuario
    this.Ubicacion = ""
    this.controlActivoFijoService.MantenimientoActivoFijoCabeceraService(
      this.Cod_Accion,
      this.Cod_Item_Cab,
      this.Cod_Empresa,
      this.Planta,
      this.Piso,
      this.Cod_CenCost,
      this.Nom_Area,
      this.Cod_Activo,
      this.Clase_Activo,
      this.Nom_Responsable,
      this.Nom_Usuario,
      this.Ubicacion
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.dataCombustible = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  cargarEmpresas() {
    this.Cod_Accion = "E"
    this.Cod_Item_Cab = 0
    this.Cod_Empresa = 0
    this.Planta = ""
    this.Piso = 0
    this.Cod_CenCost = ""
    this.Nom_Area = ""
    this.Cod_Activo = ""
    this.Clase_Activo = 0
    this.Nom_Responsable = ""
    this.Nom_Usuario = ""
    this.Ubicacion = ""
    this.controlActivoFijoService.MantenimientoActivoFijoCabeceraService(
      this.Cod_Accion,
      this.Cod_Item_Cab,
      this.Cod_Empresa,
      this.Planta,
      this.Piso,
      this.Cod_CenCost,
      this.Nom_Area,
      this.Cod_Activo,
      this.Clase_Activo,
      this.Nom_Responsable,
      this.Nom_Usuario,
      this.Ubicacion
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.dataEmpresas = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  CargarOperacionClase() {
    this.Cod_Accion = "C"
    this.Cod_Item_Cab = 0
    this.Cod_Empresa = 0
    this.Planta = ""
    this.Piso = 0
    this.Cod_CenCost = ""
    this.Nom_Area = ""
    this.Cod_Activo = ""
    this.Clase_Activo = 0
    this.Nom_Responsable = ""
    this.Nom_Usuario = ""
    this.Ubicacion = ""
    this.controlActivoFijoService.MantenimientoActivoFijoCabeceraService(
      this.Cod_Accion,
      this.Cod_Item_Cab,
      this.Cod_Empresa,
      this.Planta,
      this.Piso,
      this.Cod_CenCost,
      this.Nom_Area,
      this.Cod_Activo,
      this.Clase_Activo,
      this.Nom_Responsable,
      this.Nom_Usuario,
      this.Ubicacion
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.ClaseActivos = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }
  submit(formDirective){

  }
  escanearCentro(){
    console.log(this.formulario.get('Ccosto').value);
    if(this.formulario.get('Ccosto').value != ''){
      this.controlActivoFijoService.buscarAreaCentro(
        this.formulario.get('Ccosto').value
      ).subscribe(
        (result: any) => {
          if(result.length > 0){
            this.formulario.patchValue({
              Area: result[0].Des_Area
            })
          }
        },
        (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        this.formulario.patchValue({
          Area: ''
        })
      })
    }
  }
  getDescripcionActivos(){
    this.controlActivoFijoService.getDescripcionActivos('M', '', '', ''
    ).subscribe(
      (result: any) => {
        
        if(result != null){
          console.log(result);
          this.dataDescripcion = result;
        }
      },
      (err: HttpErrorResponse) => {
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    })
  }

  agregarDescripcion(){
    let datos = {
      tipo: 1,
      boton: 'Guardar',
      cabecera: 'Crear Nueva Descripción'
    }
    let dialogRef = this.dialog.open(DialogAgregarDescripcionComponent, {
      disableClose: true,
      panelClass: 'my-class',
      data: {
        data: datos
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDescripcionActivos();
    })
  }

  changeDescripcion(event){
    console.log(event);
    if(event != '' && event != undefined){
      this.formulario.patchValue({
        ClaseAct: event.Cod_Categoria
      })
      this.CambiarContenidoDetalle(event.Cod_Categoria);
    }else{
      this.formulario.patchValue({
        ClaseAct: ''
      })
      this.CambiarContenidoDetalle('');
    }
    
  }

  CambiarContenidoDetalle(Cod_Categoria){
    this.formulario.patchValue({
      Fijar: false
    })
    console.log(Cod_Categoria);
    if(Cod_Categoria == 1){
      this.detalleCategoria.vehiculos = true;
      this.detalleCategoria.muebles = false;
      this.detalleCategoria.computo = false;
      this.detalleCategoria.otros = false;
    }
    if(Cod_Categoria == 2){
      this.detalleCategoria.muebles = true;
      this.detalleCategoria.vehiculos = false;
      this.detalleCategoria.computo = false;
      this.detalleCategoria.otros = false;
    }
    if(Cod_Categoria >= 3 && Cod_Categoria <= 9){
      this.detalleCategoria.muebles = false;
      this.detalleCategoria.vehiculos = false;
      this.detalleCategoria.computo = true;
      this.detalleCategoria.otros = false;
    }
    if(Cod_Categoria > 9){
      this.detalleCategoria.muebles = false;
      this.detalleCategoria.vehiculos = false;
      this.detalleCategoria.computo = false;
      this.detalleCategoria.otros = true;
    }
  }
  selectEmpresa(Accion) {
    this.controlActivoFijoService.MostrarSedePorEmpresaService(
      Accion
    ).subscribe(
      (result: any) => {
        this.dataSedes = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
  selectUsuario(event) {

  }


  FijarCabecera(valor, campo){
      if(campo == 'empresa'){
        this.dataFijar.empresa =  valor.checked;
      }
      if(campo == 'sede'){
        this.dataFijar.sede =  valor.checked;
      }
      console.log(this.dataFijar);
      if(campo == 'piso'){
        this.dataFijar.piso =  valor.checked;
      }
      if(campo == 'area'){
        this.dataFijar.area =  valor.checked;
      }
      if(campo == 'centro'){
        this.dataFijar.centro =  valor.checked;
      }
      if(campo == 'ubicacion'){
        this.dataFijar.ubicacion =  valor.checked;
      }
      if(campo == 'responsable'){
        this.dataFijar.responsable =  valor.checked;
      }
      if(campo == 'usuario'){
        this.dataFijar.usuario =  valor.checked;
      }
      if(campo == 'clase'){
        this.dataFijar.clase =  valor.checked;
      }
      if(campo == 'descripcion'){
        this.dataFijar.descripcion =  valor.checked;
      }
      if(campo == 'marca'){
        this.dataFijar.marca =  valor.checked;
      }
      if(campo == 'modelo'){
        this.dataFijar.modelo =  valor.checked;
      }
      if(campo == 'serie'){
        this.dataFijar.serie =  valor.checked;
      }
      if(campo == 'motor'){
        this.dataFijar.motor =  valor.checked;
      }
      if(campo == 'chasis'){
        this.dataFijar.chasis =  valor.checked;
      }
      if(campo == 'placa'){
        this.dataFijar.placa =  valor.checked;
      }
      if(campo == 'color'){
        this.dataFijar.color =  valor.checked;
      }
      if(campo == 'medidas'){
        this.dataFijar.medidas =  valor.checked;
      }
      if(campo == 'estado'){
        this.dataFijar.estado =  valor.checked;
      }
      if(campo == 'uso'){
        this.dataFijar.uso =  valor.checked;
      }
      if(campo == 'combustible'){
        this.dataFijar.combustible =  valor.checked;
      }
      if(campo == 'caja'){
        this.dataFijar.caja =  valor.checked;
      }
      if(campo == 'asiento'){
        this.dataFijar.asiento =  valor.checked;
      }
      if(campo == 'fabricacion'){
        this.dataFijar.fabricacion =  valor.checked;
      }
      if(campo == 'ejes'){
        this.dataFijar.ejes =  valor.checked;
      }
      if(campo == 'observacion'){
        this.dataFijar.observacion =  valor.checked;
      }
  }
  guardarRegistro() {
    var Cod_Activo_Fijo = this.formulario.get('Cod_Activo_Fijo')?.value
    var Empresa = this.formulario.get('Empresa')?.value
    var Sede = this.formulario.get('Sede')?.value
    var Piso = this.formulario.get('Piso')?.value
    var Ccosto = this.formulario.get('Ccosto')?.value
    var Area = this.formulario.get('Area')?.value
    var Responsable = this.formulario.get('Responsable')?.value
    var Usuario = this.formulario.get('Usuario')?.value
    var CodAct = this.formulario.get('CodAct')?.value
    var ClaseAct = this.formulario.get('ClaseAct')?.value
    var Ubicacion = this.formulario.get('Ubicacion')?.value
    var Descripcion = this.formulario.get('Descripcion')?.value
    var Marca = this.formulario.get('Marca')?.value
    var Modelo = this.formulario.get('Modelo')?.value
    var Motor = this.formulario.get('Motor')?.value
    var Chasis = this.formulario.get('Chasis')?.value
    var Serie = this.formulario.get('Serie')?.value
    var Placa = this.formulario.get('Placa')?.value
    var Estado = this.formulario.get('Estado')?.value
    var Uso = this.formulario.get('Uso')?.value
    var Observacion = this.formulario.get('Observacion')?.value
    var Color = this.formulario.get('Color')?.value
    var Medidas = this.formulario.get('Medidas')?.value
    var Combustible = this.formulario.get('Combustible')?.value
    var Caja = this.formulario.get('Caja')?.value
    var Asiento = this.formulario.get('Asiento')?.value
    var Fabricacion = this.formulario.get('Fabricacion')?.value
    var Ejes = this.formulario.get('Ejes')?.value

    console.log(this.formulario);
    if(this.formulario.valid){
      this.controlActivoFijoService.MantenimientoActivoFijoService(
        'I',
        Cod_Activo_Fijo,
        Empresa,
        Sede,
        Piso,
        Ccosto,
        Area,
        CodAct,
        ClaseAct,
        Responsable,
        Usuario,
        GlobalVariable.vusu,
        Ubicacion,
        Descripcion,
        Marca,
        Modelo,
        Motor,
        Chasis,
        Serie,
        Placa,
        Color,
        Combustible,
        Caja,
        Asiento,
        Fabricacion,
        Ejes,
        Medidas,
        Estado,
        Uso,
        Observacion,
      ).subscribe(
        (result: any) => {
          console.log(result);
          if(result[0].Respuesta == 'OK'){
            this.matSnackBar.open('Se completo el registro correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
            this.formulario.patchValue({
              Cod_Activo: '',
              Cod_Activo_Fijo: 0,
              CodAct: ''
            })
            if(this.dataFijar.empresa == false){
              this.formulario.patchValue({
                Empresa: ''
              })
            }
            if(this.dataFijar.sede == false){
              this.formulario.patchValue({
                Sede: ''
              })
            }
            if(this.dataFijar.piso == false){
              this.formulario.patchValue({
                Piso: ''
              })
            }
            if(this.dataFijar.centro == false){
              this.formulario.patchValue({
                Ccosto: ''
              })
            }
            if(this.dataFijar.area == false){
              this.formulario.patchValue({
                Area: ''
              })
            }
            if(this.dataFijar.responsable == false){
              this.formulario.patchValue({
                Responsable: ''
              })
            }
            if(this.dataFijar.usuario == false){
              this.formulario.patchValue({
                Usuario: ''
              })
            }
            if(this.dataFijar.clase == false){
              this.formulario.patchValue({
                ClaseAct: ''
              })
            }
            if(this.dataFijar.ubicacion == false){
              this.formulario.patchValue({
                Ubicacion: ''
              })
            }
            if(this.dataFijar.descripcion == false){
              this.formulario.patchValue({
                Descripcion: ''
              })
            }
            if(this.dataFijar.marca == false){
              this.formulario.patchValue({
                Marca: ''
              })
            }
            if(this.dataFijar.modelo == false){
              this.formulario.patchValue({
                Modelo: ''
              })
            }
            if(this.dataFijar.motor == false){
              this.formulario.patchValue({
                Motor: ''
              })
            }
            if(this.dataFijar.chasis == false){
              this.formulario.patchValue({
                Chasis: ''
              })
            }
            if(this.dataFijar.serie == false){
              this.formulario.patchValue({
                Serie: ''
              })
            }
            if(this.dataFijar.placa == false){
              this.formulario.patchValue({
                Placa: ''
              })
            }
            if(this.dataFijar.estado == false){
              this.formulario.patchValue({
                Estado: ''
              })
            }
            if(this.dataFijar.uso == false){
              this.formulario.patchValue({
                Uso: ''
              })
            }
            if(this.dataFijar.observacion == false){
              this.formulario.patchValue({
                Observacion: ''
              })
            }
            if(this.dataFijar.color == false){
              this.formulario.patchValue({
                Color: ''
              })
            }
            if(this.dataFijar.medidas == false){
              this.formulario.patchValue({
                Medidas: ''
              })
            }
            if(this.dataFijar.combustible == false){
              this.formulario.patchValue({
                Combustible: ''
              })
            }
            if(this.dataFijar.caja == false){
              this.formulario.patchValue({
                Caja: ''
              })
            }
            if(this.dataFijar.asiento == false){
              this.formulario.patchValue({
                Asiento: ''
              })
            }
            if(this.dataFijar.fabricacion == false){
              this.formulario.patchValue({
                Fabricacion: ''
              })
            }
            if(this.dataFijar.ejes == false){
              this.formulario.patchValue({
                Ejes: ''
              })
            }
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }else{
      this.matSnackBar.open('Debes llenar los campos obligatorios', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  nuevoRegistro() {
    this.formulario.reset();
    this.detalleCategoria.muebles = false;
    this.detalleCategoria.vehiculos = false;
    this.detalleCategoria.computo = false;
    this.detalleCategoria.otros = false;
  }

  verificarEditar(){
    var Cod_Activo = this.formulario.get('CodAct')?.value;
    console.log(Cod_Activo)
    if (Cod_Activo.length == 9) {
      this.controlActivoFijoService.ObtenerActivoFijoCodigo(
        Cod_Activo
      ).subscribe(
        (result: any) => {
          console.log(result);
          
          if(result.length > 0){
            this.matSnackBar.open('Registro encontrado.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            console.log(this.formulario);
            this.formulario.patchValue({
              Cod_Activo_Fijo: result[0]['Cod_Activo_Fijo'],
              Empresa: Number(result[0]['Cod_Empresa']),
              Sede:  result[0]['Cod_Establecimiento'],
              Piso: result[0]['Num_Piso'],
              Ccosto: result[0]['Cod_CenCost'],
              Area: result[0]['Nom_Area'],
              Responsable: result[0]['Nom_Responsable'],
              Usuario: result[0]['Nom_Usuario'],
              CodAct: result[0]['Cod_Activo'],
              ClaseAct: Number(result[0]['Cod_Categoria']),
              Ubicacion: result[0]['Ubicacion'],
              Descripcion: result[0]['Descripcion'],
              Marca: result[0]['Nom_Marca'],
              Modelo: result[0]['Nom_Modelo'],
              Serie: result[0]['Num_Serie_Equipo'],
              Estado: Number(result[0]['Estado_Fisico']),
              Uso: Number(result[0]['Uso_Desuso']),
              Observacion: result[0]['Observacion'],
              Color: result[0]['Color'],
              Medidas: result[0]['Medida'] != '' ? result[0]['Medida'].trim() : '',
              Motor: result[0]['Num_Serie_Motor'] != undefined ? result[0]['Num_Serie_Motor'] : '',
              Chasis: result[0]['Num_Serie_Chasis'] != undefined ? result[0]['Num_Serie_Chasis'] : '',
              Placa: result[0]['Num_Placa'] != undefined ? result[0]['Num_Placa'] : '',
              Combustible: result[0]['Tipo_Combustible'] != undefined ? result[0]['Tipo_Combustible'] : '',
              Caja: result[0]['Tipo_Caja'] != undefined ? result[0]['Tipo_Caja'] : '',
              Asiento: result[0]['Cant_Asiento'] != undefined ? result[0]['Cant_Asiento'] : '', 
              Ejes: result[0]['Cant_Eje'] != undefined ? result[0]['Cant_Eje'] : '',
            })
            this.selectEmpresa(result[0]['Cod_Empresa']);
            this.CambiarContenidoDetalle(result[0]['Cod_Categoria']);
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }
  }
}

