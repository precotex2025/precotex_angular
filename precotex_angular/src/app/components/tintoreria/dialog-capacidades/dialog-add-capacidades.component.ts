import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import { TejeduriaService } from 'src/app/services/tejeduria.service';
import { MaqTejeduria } from 'src/app/models/Tejeduria/maquinatejeduria';
import { Tipo_Aguja } from 'src/app/models/Tejeduria/tipoaguja';
import { FamArticulo } from 'src/app/models/Tintoreria/FamArticulo';
import { Cliente } from 'src/app/models/Cliente';
import { TipAncho } from 'src/app/models/Tintoreria/TipAncho';
import { TintoreriaService } from 'src/app/services/tintoreria.service';
import { Gama } from 'src/app/models/Tintoreria/Gama';
import { DialogEliminarComponent } from '../../dialogs/dialog-eliminar/dialog-eliminar.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Console } from 'console';


@Component({
  selector: 'app-dialog-add-capacidades',
  templateUrl: './dialog-add-capacidades.component.html',
  styleUrls: ['./dialog-add-capacidades.component.scss']
})
export class DialogAddCapacidadesComponent implements OnInit {

  listar_FamArticulo: FamArticulo[] = [];
  listar_Cliente: Cliente[] = [];
  listar_TipAncho: TipAncho[] = [];
  listar_Gama: Gama[] = [];
    
  filtroFamArticulo:  Observable<FamArticulo[]> | undefined;
  filtroCliente:  Observable<Cliente[]> | undefined;
  filtroTipAncho:  Observable<TipAncho[]> | undefined;
  filtroGama:  Observable<Gama[]> | undefined;
      
  listar_operacionMaqTejeduria: MaqTejeduria[] = [];
  listar_tipoaguja:             Tipo_Aguja[] = [];    
  filtroOperacionMaqTejeduria:  Observable<MaqTejeduria[]> | undefined;  
    
  /******************************/
  Opcion = ''  
  Fec_Reg_Ini = ''
  Fec_Reg_Fin = ''

  myControl = new FormControl();
  Fecha = new FormControl(new Date())

  formulario = this.formBuilder.group({
    FamArticulo:    [''],
    NomCliente:     [''],
    Tip_Ancho:      [''],
    Cod_Gama:       [''],
    Eco_Master:     [''],
    Obs_Eco_Master: [''],
    IMaster:        [''],
    Obs_IMaster:    [''],
    TRD:            [''],
    Obs_TRD:        [''],
    ATYC:           [''],
    Obs_ATYC:       [''],
    MS:             [''],
    Obs_MS:         [''],
  }) 


  listar_lineas = [];  
  selectedValue1: any;  
  Cod_Cliente: string;
  range: any;
  Cod_Familia: string;
  Cod_Tela: string;
  Tip_Ancho: string;
  Cod_Gama: string;
  Eco_Master: string;
  IMaster: string;
  TRD: string;
  ATYC: string;
  MS : string;
  Obs_Eco_Master: string;
  Obs_IMaster:string;
  Obs_TRD :string;
  Obs_ATYC: string;
  Obs_MS: string;
  sOpcion: string;
 
  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private TintoreriaService: TintoreriaService,
              private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
              private TejeduriaService: TejeduriaService,
              public dialog: MatDialog,
              private SpinnerService: NgxSpinnerService, @Inject(MAT_DIALOG_DATA) public data: any)
  {


    this.formulario = this.formBuilder.group({
      FamArticulo:    ['', Validators.required],
      NomCliente:     ['', Validators.required],
      Tip_Ancho:      ['', Validators.required],
      Cod_Gama:       ['', Validators.required],
      Eco_Master:     [''],
      Obs_Eco_Master: [''],
      IMaster:        [''],
      Obs_IMaster:    [''],
      TRD:            [''],
      Obs_TRD:        [''],
      ATYC:           [''],
      Obs_ATYC:       [''],
      MS:             [''],
      Obs_MS:         ['']
    });



  }

  ngOnInit(): void {      
  this.sOpcion = "U"
  this.CargarFamArticulo()
  this.CargarCliente()
  this.CargarTipAncho()
  this.CargarGama()  

  let contador = 0;
  for (const clave in this.data.datos) {
    if (this.data.datos.hasOwnProperty(clave)) {
      contador++;
    }
  }
 
  if(contador == 0)
  {    
    this.sOpcion = "I"    
  }
  
  if (this.sOpcion == "U")
  {       
    this.formulario.controls['FamArticulo'].disable()
    this.formulario.controls['Tip_Ancho'].disable()
    this.formulario.controls['NomCliente'].disable()
    this.formulario.controls['Cod_Gama'].disable()
    this.formulario.get('FamArticulo')?.setValue(this.data.datos.Cod_Familia);
    this.Cod_Familia = this.data.datos.Cod_Tela     
    this.formulario.get('Tip_Ancho')?.setValue(this.data.datos.Des_Tip_Ancho);
    this.Tip_Ancho = this.data.datos.Tip_Ancho    
    this.formulario.get('NomCliente')?.setValue(this.data.datos.Nom_Cliente); 
    this.Cod_Cliente = this.data.datos.Cod_Cliente
    this.formulario.get('Cod_Gama')?.setValue(this.data.datos.Des_Gama); 
    this.Cod_Gama = this.data.datos.Cod_Gama
    this.formulario.get('Eco_Master')?.setValue(this.data.datos.Eco_Master); 
    this.formulario.get('Obs_Eco_Master')?.setValue(this.data.datos.Obs_Eco_Master); 
    this.formulario.get('IMaster')?.setValue(this.data.datos.IMaster); 
    this.formulario.get('Obs_IMaster')?.setValue(this.data.datos.Obs_IMaster); 
    this.formulario.get('TRD')?.setValue(this.data.datos.TRD); 
    this.formulario.get('Obs_TRD')?.setValue(this.data.datos.Obs_TRD); 
    this.formulario.get('ATYC')?.setValue(this.data.datos.ATYC); 
    this.formulario.get('Obs_ATYC')?.setValue(this.data.datos.Obs_ATYC);      
    this.formulario.get('MS')?.setValue(this.data.datos.MS); 
    this.formulario.get('Obs_MS')?.setValue(this.data.datos.Obs_MS);
  }  
}


  CargarFamArticulo(){
    this.listar_FamArticulo = [];    
    this.TintoreriaService.MuestraFamArticulo("0"      
      ).subscribe(data =>
      {
        this.listar_FamArticulo = data        
        this.RecargarFamArticulo()       
      }
      )
  }
    
  RecargarFamArticulo(){
    this.filtroFamArticulo = this.formulario.controls['FamArticulo'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterFamArticulo(option) : this.listar_FamArticulo.slice())),
    );    
  }

  private _filterFamArticulo(value: string): FamArticulo[] {
    //this.formulario.controls['FamArticulo'].setValue('')
    const filterValue = value.toLowerCase();    
    return this.listar_FamArticulo.filter(option => String(option.Cod_Familia).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Cod_Familia.toLowerCase().indexOf(filterValue ) > -1);
  }


  CargarCliente(){
    this.listar_Cliente = [];    
    this.TintoreriaService.MuestraCliente("0"      
      ).subscribe(data =>
      {
        this.listar_Cliente = data        
        this.RecargarClientes()       
      }
      )
  }
    
  RecargarClientes(){
    this.filtroCliente = this.formulario.controls['NomCliente'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterCliente(option) : this.listar_Cliente.slice())),
    );    
  }

  private _filterCliente(value: string): Cliente[] {        
    const filterValue = value.toLowerCase();    
    return this.listar_Cliente.filter(option => String(option.Nombre_Cliente).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nombre_Cliente.toLowerCase().indexOf(filterValue ) > -1);
  }

  CambiarValorCliente(Cod_Cliente: string){
    this.Cod_Cliente = Cod_Cliente
  }

  CargarTipAncho(){
    this.listar_TipAncho = [];    
    this.TintoreriaService.MuestraTipAncho(      
      ).subscribe(data =>
      {
        this.listar_TipAncho = data        
        this.RecargarTipAncho()       
      }
      )
  }

  RecargarTipAncho(){
    this.filtroTipAncho = this.formulario.controls['Tip_Ancho'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterTipAncho(option) : this.listar_TipAncho.slice())),
    );    
  }

  private _filterTipAncho(value: string): TipAncho[] {        
    const filterValue = value.toLowerCase();    
    return this.listar_TipAncho.filter(option => String(option.Des_TipAncho).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Des_TipAncho.toLowerCase().indexOf(filterValue ) > -1);
  }

  CambiarValorTipANcho(Tip_Ancho: string){
    this.Tip_Ancho = Tip_Ancho
  }

  CargarGama(){
    this.listar_Gama = [];
    this.TintoreriaService.MuestraGama(
      ).subscribe(data =>
      {
        this.listar_Gama = data
        this.RecargarGama()
      }
      )
  }

  RecargarGama(){
    this.filtroGama = this.formulario.controls['Cod_Gama'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterGama(option) : this.listar_Gama.slice())),
    );    
  }

  private _filterGama(value: string): Gama[] {        
    const filterValue = value.toLowerCase();    
    return this.listar_Gama.filter(option => String(option.Des_IntCol).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Des_IntCol.toLowerCase().indexOf(filterValue ) > -1);
  }

  CambiarValorGama(Cod_Gama: string){
    this.Cod_Gama = Cod_Gama
  }


  BuscarLinea() {
    this.auditoriaInspeccionCosturaService.BuscarLineaExtService().subscribe(
      (result: any) => {        
        this.listar_lineas = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }


  MuestraTipoAguja(){
    this.listar_tipoaguja = [];    
    this.TejeduriaService.MuestraTipoAguja(      
      ).subscribe(data =>
      {
        this.listar_tipoaguja = data        
      }
      )
  }

CambiarValorFamArticulo(Cod_Familia: string){
  this.Cod_Familia = Cod_Familia
}

CambiarValorTipAncho(Tip_Ancho: string){
  this.Tip_Ancho = Tip_Ancho
}


/* --------------- REGISTRAR CABECERA ------------------------------------------ */
Guardar( ) {                  
        this.Opcion = this.sOpcion
        this.Cod_Familia = this.Cod_Familia
        this.Cod_Cliente = this.Cod_Cliente
        this.Tip_Ancho = this.Tip_Ancho
        this.Cod_Gama = this.Cod_Gama
        // this.Eco_Master = this.formulario.get('Eco_Master')?.value == null ? '0' : this.formulario.get('Eco_Master')?.value
        // this.IMaster = this.formulario.get('IMaster')?.value == null ? '0' : this.formulario.get('IMaster')?.value
        // this.TRD = this.formulario.get('TRD')?.value == null ? '0' : this.formulario.get('TRD')?.value
        // this.ATYC = this.formulario.get('ATYC')?.value == null ? '0' : this.formulario.get('ATYC')?.value
        this.Eco_Master = this.formulario.get('Eco_Master')?.value == null ? '' : this.formulario.get('Eco_Master')?.value
        this.IMaster = this.formulario.get('IMaster')?.value == null ? '' : this.formulario.get('IMaster')?.value
        this.TRD = this.formulario.get('TRD')?.value == null ? '' : this.formulario.get('TRD')?.value
        this.ATYC = this.formulario.get('ATYC')?.value == null ? '' : this.formulario.get('ATYC')?.value
        this.MS = this.formulario.get('MS')?.value == null ? '' : this.formulario.get('MS')?.value
        this.Obs_Eco_Master = this.formulario.get('Obs_Eco_Master')?.value 
        this.Obs_IMaster = this.formulario.get('Obs_IMaster')?.value 
        this.Obs_TRD = this.formulario.get('Obs_TRD')?.value 
        this.Obs_ATYC = this.formulario.get('Obs_ATYC')?.value   
        this.Obs_MS = this.formulario.get('Obs_MS')?.value   
        this.Fec_Reg_Ini= ''
        this.Fec_Reg_Fin = ''  
           this.TintoreriaService.MantCapacidades(
            this.Opcion,
            this.Cod_Familia,
            this.Cod_Cliente,
            this.Tip_Ancho,
            this.Cod_Gama,
            this.Eco_Master,
            this.IMaster,
            this.TRD,
            this.ATYC,
            this.MS,
            this.Obs_Eco_Master,
            this.Obs_IMaster,
            this.Obs_TRD,
            this.Obs_ATYC,
            this.Obs_MS,                   
            this.Fec_Reg_Ini,
            this.Fec_Reg_Fin).subscribe(     
          (result: any) => {
            if(result[0].Obs_ATYC == 'OK'){            
              this.matSnackBar.open("Se registró correctamente..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })              
            }            
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.error.message.substring(5,10), 'Cerrar', {
            duration: 1500,
          }))
      }    

}

