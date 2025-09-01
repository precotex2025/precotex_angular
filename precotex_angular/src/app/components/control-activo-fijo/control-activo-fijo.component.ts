import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { ControlActivoFijoService } from 'src/app/services/control-activo-fijo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { DialogModificarComponent } from 'src/app/components/dialogs/dialog-modificar/dialog-modificar.component'
import { GlobalVariable } from 'src/app/VarGlobals';
import { MatAccordion } from '@angular/material/expansion';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


interface data_det {
  Num_Auditoria: number,
  Cod_Supervisor: string,
  Nom_Supervisor: string,
  Cod_Auditor: String,
  Nom_Auditor: string,
  Fecha_Auditoria: string,
  Cod_LinPro: string,
  Observacion: string,
  Flg_Status: string,
  Cod_Usuario: string,
  Cod_Equipo: string,
  Fecha_Reg: string,

}

interface Clase {
  Cod_Categoria: number;
  Nombre_Categoria: string;
}

interface Empresa {
  Cod_Empresa: number;
  Des_Empresa: string;
}

interface Sede {
  Cod_Establecimiento: string;
  Des_Establecimiento: string;
}

interface Estado {
  Cod_Estado: number;
  Des_Estado: string;
}

interface Uso {
  Cod_Uso_Desuso: number;
  Des_Uso_Desuso: string;
}

interface Color {
  Cod_Color: number;
  Des_Color: string;
}

interface Combustible {
  Cod_Tip_Comb: number;
  Des_Tip_Comb: string;
}

interface Caja {
  Cod_Tip_Caja: number;
  Des_Tip_Caja: string;
}

interface Asiento {
  Cod_Num_Asiento: number
  Num_Asiento: number
}
 
interface Eje {
  Cod_Num_Eje: number
  Num_Eje: number
}


@Component({
  selector: 'app-control-activo-fijo',
  templateUrl: './control-activo-fijo.component.html',
  styleUrls: ['./control-activo-fijo.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ControlActivoFijoComponent implements OnInit {

  listar_operacionClase: Clase[] = [];
  listar_operacionEmpresa: Empresa[] = [];
  listar_operacionSede: Sede[] = [];
  listar_operacionEstado: Estado[] = [];
  listar_operacionUso: Uso[] = [];
  listar_operacionColor: Color[] = [];
  listar_operacionCombustible: Combustible[] = [];
  listar_operacionCaja: Caja[] = [];
  listar_operacionAsiento: Asiento[] = [];
  listar_operacionEje: Eje[] = [];
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('Cod_Activo') inputCod_Activo!: ElementRef;
  
  public data_det = [{

  }]





  // nuevas variables
  panelOpenState = false;
  PanelVehiculo = false;
  PanelMueble = false;
  PanelEquipo = false;

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

  Cod_Item_Det = 0
  Descripcion = ""
  Marca = ""
  Modelo = ""
  Serie = ""
  Estado = 0
  Uso = 0
  Observacion = ""
  Color = 0
  Medidas = ""
  Motor = ""
  Chasis = ""
  Placa = ""
  Combustible = 0
  Caja = 0
  Asiento = 0
  Fabricacion = new FormControl(moment("01-01-1990", "MM-DD-YYYY"));
  Ejes = 0
  //date = new FormControl(moment());
  disabled = false;
  // Num cabecera que se registro y se retorno en el insert 
  Cod_Item_Cab_Registrado = 0
  // Total de numeros de registros
  Cod_Item_Cab_Total = 0
  Flg_Editar = false


  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    Empresa: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_-]$")])],
    Sede: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_-]{1,50}$")])],
    Piso: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9_-]{1,2}$")])],
    Ccosto: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_-]{1,16}$")])],
    Area: ['', Validators.compose([Validators.required])], //, Validators.pattern("^[a-zA-Z0-9 _-]{1,80}$")
    Responsable: ['', Validators.compose([Validators.required])], //, Validators.pattern("^[a-zA-Z0-9 _-]{1,50}$")
    Usuario: ['', Validators.compose([Validators.required])], //, Validators.pattern("^[a-zA-Z0-9 _-]{1,50}$")
    CodAct: ['', Validators.compose([Validators.required])], //, Validators.pattern("^[a-zA-Z0-9_-]{1,9}$")
    ClaseAct: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_-]$")])],
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

 
  //Validators.pattern("^[a-zA-Z0-9_-]{4,20}$")
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private controlActivoFijoService: ControlActivoFijoService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) {

  }

  ngOnInit(): void {
    //this.formulario.controls['Responsable'].setValue(GlobalVariable.vusu)
    //this.formulario.controls['Responsable'].disable()
    this.CargarOperacionClase()
    this.MostrarEmpresa()
    this.MostrarEstado()
    this.MostrarUso()
    this.MostrarColor()
    this.MostrarCombustible()
    this.MostrarCaja()
    this.MostrarAsiento()
    this.MostrarEje()
    this.ObtenerTotalRegistrosPorDia()
  }



  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.Fabricacion.value;

    ctrlValue.year(normalizedYear.year());
    this.Fabricacion.setValue(ctrlValue);
    datepicker.close();
  }

  FijarCabecera() {
    console.log(this.formulario.get('Fijar')?.value)
    if (this.formulario.get('Fijar')?.value == true) {
      this.HabilitarCabecera()
    }
    else {
      this.DeshabilitarCabecera()
    }
  }


  DeshabilitarCabecera() {
    this.formulario.controls['Empresa'].disable()
    this.formulario.controls['Sede'].disable()
    this.formulario.controls['Piso'].disable()
    this.formulario.controls['Ccosto'].disable()
    this.formulario.controls['Area'].disable()
    this.formulario.controls['Responsable'].disable()
    this.formulario.controls['Usuario'].disable()
    this.formulario.controls['CodAct'].disable()
    this.formulario.controls['ClaseAct'].disable()
  }

  HabilitarCabecera() {
    this.formulario.controls['Empresa'].enable()
    this.formulario.controls['Sede'].enable()
    this.formulario.controls['Piso'].enable()
    this.formulario.controls['Ccosto'].enable()
    this.formulario.controls['Area'].enable()
    this.formulario.controls['Responsable'].enable()
    this.formulario.controls['Usuario'].enable()
    this.formulario.controls['CodAct'].enable()
    this.formulario.controls['ClaseAct'].enable()
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
        this.listar_operacionClase = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  CambiarContenidoDetalle(Cod_Categoria: number) {
    console.log(Cod_Categoria)
    const Vehiculo = [1];
    const Mueble = [2];
    const Equipo = [3, 4, 5, 6, 7, 8, 9];
    if (Vehiculo.includes(Cod_Categoria) == true) {
      this.PanelVehiculo = true
      this.panelOpenState = true
      this.PanelMueble = false
      this.PanelEquipo = false
      this.ResetDetalle()
      this.Fabricacion = new FormControl(moment("01-01-1990", "MM-DD-YYYY"));
      //this.formulario.reset()
    }
    else if (Mueble.includes(Cod_Categoria) == true) {
      this.PanelMueble = true
      this.panelOpenState = true
      this.PanelVehiculo = false
      this.PanelEquipo = false
      this.ResetDetalle()
      this.Fabricacion = new FormControl(moment("01-01-1990", "MM-DD-YYYY"));
    }
    else if (Equipo.includes(Cod_Categoria) == true) {
      this.PanelEquipo = true
      this.panelOpenState = true
      this.PanelVehiculo = false
      this.PanelMueble = false
      this.ResetDetalle()
      this.Fabricacion = new FormControl(moment("01-01-1990", "MM-DD-YYYY"));
    }
  }

  MostrarEmpresa() {
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
        this.listar_operacionEmpresa = result
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
        this.listar_operacionEstado = result
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
        this.listar_operacionUso = result
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
        this.listar_operacionColor = result
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
        this.listar_operacionCombustible = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

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
        this.listar_operacionCaja = result
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
        this.listar_operacionAsiento = result
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
        this.listar_operacionEje = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  MostrarSede(Accion: number) {
    this.controlActivoFijoService.MostrarSedePorEmpresaService(
      Accion
    ).subscribe(
      (result: any) => {
        this.listar_operacionSede = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  ObtenerTotalRegistrosPorDia() {
    this.Cod_Accion = "M"
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
        this.Cod_Item_Cab_Total = result[0].Num_Total_Cab
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }


  //InsertarCabecera(){
  submit(formDirective): void {
    this.Cod_Accion = "I"
    this.Cod_Item_Cab = this.Cod_Item_Cab
    this.Cod_Empresa = this.formulario.get('Empresa')?.value
    this.Planta = this.formulario.get('Sede')?.value
    this.Piso = this.formulario.get('Piso')?.value
    this.Cod_CenCost = this.formulario.get('Ccosto')?.value
    this.Nom_Area = this.formulario.get('Area')?.value
    this.Cod_Activo = this.formulario.get('CodAct')?.value
    this.Clase_Activo = this.formulario.get('ClaseAct')?.value
    this.Nom_Responsable = this.formulario.get('Responsable')?.value
    this.Nom_Usuario = this.formulario.get('Usuario')?.value
    this.Ubicacion = this.formulario.get('Ubicacion')?.value
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
        if (result[0].Respuesta == 'OK') {
          this.InsertarDetalle()
          this.Cod_Item_Cab_Registrado = result[0].Cod_Item_Cab
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  ano() {
    let Year
    Year = _moment(this.Fabricacion.value.valueOf()).format('YYYY')
    Year = '01/01/' + Year
    alert(Year)
  }
  InsertarDetalle() {

    this.Cod_Accion = "I"
    this.Cod_Item_Cab = this.Cod_Item_Cab
    this.Cod_Item_Det = this.Cod_Item_Det
    this.Descripcion = this.formulario.get('Descripcion')?.value
    this.Marca = this.formulario.get('Marca')?.value
    this.Modelo = this.formulario.get('Modelo')?.value
    this.Motor = this.formulario.get('Motor')?.value
    this.Chasis = this.formulario.get('Chasis')?.value
    this.Serie = this.formulario.get('Serie')?.value
    this.Placa = this.formulario.get('Placa')?.value

    this.Color = this.formulario.get('Color')?.value
    this.formulario.get('Color')?.value == '' ? this.Color = 0 : this.Color;
    /*if(this.formulario.get('Color')?.value == ''){
      this.Color = 0
    }*/
    this.Combustible = this.formulario.get('Combustible')?.value
    this.formulario.get('Combustible')?.value == '' ? this.Combustible = 0 : this.Combustible;
    /*if(this.formulario.get('Combustible')?.value == ''){
      this.Combustible = 0
    }*/
    this.Caja = this.formulario.get('Caja')?.value
    this.formulario.get('Caja')?.value == '' ? this.Caja = 0 : this.Caja;
    /*if(this.formulario.get('Caja')?.value == ''){
      this.Caja = 0
    }*/
    this.Asiento = this.formulario.get('Asiento')?.value
    this.formulario.get('Asiento')?.value == '' ? this.Asiento = 0 : this.Asiento;
    /*if(this.formulario.get('Asiento')?.value == ''){
      this.Asiento = 0
    }*/

    //this.Fabricacion        = this.formulario.get('Fabricacion')?.value
    let Year
    Year = _moment(this.Fabricacion.value.valueOf()).format('YYYY')
    Year = '01/01/' + Year

    this.Ejes = this.formulario.get('Ejes')?.value
    this.formulario.get('Ejes')?.value == '' ? this.Ejes = 0 : this.Ejes;
    /*if(this.formulario.get('Ejes')?.value == ''){
      this.Ejes = 0
    }*/
    this.Medidas = this.formulario.get('Medidas')?.value
    this.Estado = this.formulario.get('Estado')?.value
    this.formulario.get('Estado')?.value == '' ? this.Estado = 0 : this.Estado;
    /*if(this.formulario.get('Estado')?.value == ''){
      this.Estado = 0
    }*/
    this.Uso = this.formulario.get('Uso')?.value
    this.formulario.get('Uso')?.value == '' ? this.Uso = 0 : this.Uso;
    /*if(this.formulario.get('Uso')?.value == ''){
      this.Uso = 0
    }*/
    this.Observacion = this.formulario.get('Observacion')?.value

    this.controlActivoFijoService.MantenimientoActivoFijoDetalleService(
      this.Cod_Accion,
      this.Cod_Item_Cab,
      this.Cod_Item_Det,
      this.Descripcion,
      this.Marca,
      this.Modelo,
      this.Motor,
      this.Chasis,
      this.Serie,
      this.Placa,
      this.Color,
      this.Combustible,
      this.Caja,
      this.Asiento,
      Year,
      this.Ejes,
      this.Medidas,
      this.Estado,
      this.Uso,
      this.Observacion
    ).subscribe(
      (result: any) => {
        console.log(result)
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open('Proceso Correcto...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.ResetCabecera()
          this.ResetDetalle()
          this.formulario.controls['CodAct'].enable()
          this.formulario.controls['CodAct'].setValue('')
          this.Fabricacion = new FormControl(moment("01-01-1990", "MM-DD-YYYY"));
          this.inputCod_Activo.nativeElement.focus()
          this.ObtenerTotalRegistrosPorDia()
          this.Flg_Editar = false
        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        /*else{
          this.matSnackBar.open('Proceso Correcto...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }*/

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  ResetCabecera() {
    if (this.formulario.get('Fijar')?.value == false) {

      this.formulario.controls['Empresa'].setValue('')
      this.formulario.controls['Sede'].setValue('')
      this.formulario.controls['Piso'].setValue('')
      this.formulario.controls['Ccosto'].setValue('')
      this.formulario.controls['Area'].setValue('')
      this.formulario.controls['Responsable'].setValue('')
      this.formulario.controls['Usuario'].setValue('')
      this.formulario.controls['CodAct'].setValue('')
      this.formulario.controls['ClaseAct'].setValue('')
    }
  }

  ResetDetalle() {
    this.formulario.controls['Descripcion'].setValue('')
    this.formulario.controls['Marca'].setValue('')
    this.formulario.controls['Modelo'].setValue('')
    this.formulario.controls['Serie'].setValue('')
    this.formulario.controls['Estado'].setValue('')
    this.formulario.controls['Uso'].setValue('')
    this.formulario.controls['Observacion'].setValue('')
    this.formulario.controls['Color'].setValue('')
    this.formulario.controls['Medidas'].setValue('')
    this.formulario.controls['Motor'].setValue('')
    this.formulario.controls['Chasis'].setValue('')
    this.formulario.controls['Placa'].setValue('')
    this.formulario.controls['Combustible'].setValue('')
    this.formulario.controls['Caja'].setValue('')
    this.formulario.controls['Asiento'].setValue('')
    this.formulario.controls['Fabricacion'].setValue('')
    this.formulario.controls['Ejes'].setValue('')
  }


  verificarEditar() {
    this.Cod_Activo = this.formulario.get('CodAct')?.value
    if (this.Cod_Activo.length == 9) {

      this.Cod_Accion = "V"
      this.Cod_Item_Cab = 0
      this.Cod_Empresa = 0
      this.Planta = ""
      this.Piso = 0
      this.Cod_CenCost = ""
      this.Nom_Area = ""
      this.Cod_Activo = this.Cod_Activo
      this.Clase_Activo = 0,
      this.Nom_Responsable = ""
      this.Nom_Usuario = ""
      this.Ubicacion
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

          if(result[0].Cod_Item_Cab != 0){
            let dialogRef = this.dialog.open(DialogModificarComponent, {
              disableClose: true,
              data: {}
            });
    
            dialogRef.afterClosed().subscribe(resultadoDialog => {
    
              if (resultadoDialog == 'true') {
                
                //Cabecera
                this.Cod_Item_Cab_Registrado = result[0].Cod_Item_Cab
                this.Cod_Item_Cab = result[0].Cod_Item_Cab
    
                this.formulario.controls['Empresa'].setValue(result[0].Cod_Empresa)
                this.MostrarSede(result[0].Cod_Empresa)
                this.formulario.controls['Sede'].setValue(result[0].Cod_Establecimiento)
                this.formulario.controls['Piso'].setValue(result[0].Num_Piso)
                this.formulario.controls['Ccosto'].setValue(result[0].Cod_CenCost)
                this.formulario.controls['Area'].setValue(result[0].Nom_Area)
                this.formulario.controls['Responsable'].setValue(result[0].Nom_Responsable)
                this.formulario.controls['Usuario'].setValue(result[0].Nom_Usuario)
                this.formulario.controls['CodAct'].disable()
                //Cambiar Contenido
                this.formulario.controls['ClaseAct'].setValue(result[0].Cod_Categoria)
                this.CambiarContenidoDetalle(result[0].Cod_Categoria)

                //Detalle
                this.Cod_Item_Det = result[0].Cod_Item_Det
                this.formulario.controls['Descripcion'].setValue(result[0].Descripcion)
                this.formulario.controls['Marca'].setValue(result[0].Nom_Marca)
                this.formulario.controls['Modelo'].setValue(result[0].Nom_Modelo)
                this.formulario.controls['Serie'].setValue(result[0].Num_Serie_Equipo)
                this.formulario.controls['Estado'].setValue(result[0].Estado_Fisico)
                this.formulario.controls['Uso'].setValue(result[0].Uso_Desuso)
                this.formulario.controls['Observacion'].setValue(result[0].Observacion)
                this.formulario.controls['Color'].setValue(result[0].Color)
                this.formulario.controls['Medidas'].setValue(result[0].Medida)
                this.formulario.controls['Motor'].setValue(result[0].Num_Serie_Motor)
                this.formulario.controls['Chasis'].setValue(result[0].Num_Serie_Chasis)
                this.formulario.controls['Placa'].setValue(result[0].Num_Placa)
                this.formulario.controls['Combustible'].setValue(result[0].Tipo_Combustible)
                this.formulario.controls['Caja'].setValue(result[0].Tipo_Caja)
                this.formulario.controls['Asiento'].setValue(result[0].Cant_Asiento)

                /*SE CONVIERTE LA FECHA EJEMP. DD/MM/YYYY a un array {DD, MM, YYYY}*/
                //let Fecha_Array = [] = result[0].Ano_Fabricacion.split("/")
                /*INVERTIR EL ORDEN DE LA FECHA ARRAY Y SEPARARLOS POR - QUE ES EL FORMATO QUE ACEPTA EL MATDATAPICKER: YYYY-MM-DD*/
                //let Fecha_Convertia = Fecha_Array[2] + '-' +  Fecha_Array[1] + '-' + Fecha_Array[0]
                /*SETEAR LA FECHA CONVERTIDA AL INPUT DATE DE ANGULAR MATERIAL*/

                let Year
                Year = _moment(result[0].Ano_Fabricacion.date.valueOf()).format('YYYY')
                Year = '01/01/' + Year
                //this.Fabricacion.setValue(result[0].Ano_Fabricacion.date)
                this.Fabricacion = new FormControl(moment(Year, "MM-DD-YYYY"));
                //this.formulario.controls['Fabricacion'].setValue(result[0].Ano_Fabricacion)


                this.formulario.controls['Ejes'].setValue(result[0].Cant_Eje)
                this.Flg_Editar = true
              } else {
                this.formulario.controls['CodAct'].setValue('')
                this.inputCod_Activo.nativeElement.focus()
              }
    
            })
          }
          else{
            this.Cod_Item_Cab = 0
            this.Cod_Item_Det = 0
          }
         
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  
    }
  }

  Limpiar(){
    this.formulario.reset()
    this.Cod_Item_Cab = 0
    this.Cod_Item_Det = 0
    this.Flg_Editar = false
    this.Cod_Item_Cab_Registrado = 0
    this.Fabricacion = new FormControl(moment("01-01-1990", "MM-DD-YYYY"));
    this.formulario.controls['CodAct'].enable()
  }
}

