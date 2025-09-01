import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { TejeduriaService } from 'src/app/services/tejeduria.service';
import { MaqTejeduria } from 'src/app/models/Tejeduria/maquinatejeduria';
import { Tipo_Aguja } from 'src/app/models/Tejeduria/tipoaguja';


interface Tejedor{
  Cod_Tejedor: string,
  Nom_Tejedor: string,
}

@Component({
  selector: 'app-dialog-add-solicitud-agujas',
  templateUrl: './dialog-add-solicitud-agujas.component.html',
  styleUrls: ['./dialog-add-solicitud-agujas.component.scss']
})
export class DialogAddSolicitudAgujasComponent implements OnInit {
  
  listar_operacionTejedor:      Tejedor[] = [];
  listar_operacionMaqTejeduria: MaqTejeduria[] = [];
  listar_tipoaguja:             Tipo_Aguja[] = [];
  filtroOperacionTejedor:       Observable<Tejedor[]> | undefined;  
  filtroOperacionMaqTejeduria:  Observable<MaqTejeduria[]> | undefined;  
  
  // nuevas variables  
  InputFechaDesHabilitado = true	   
  Titulo            =   ''  
  /******************************/
  Opcion = ''
  Num_Registro= ''
  Fecha_Registro:''
  Cod_Maquina_Tejeduria=''
  Cod_Ordtra = ''
  Tip_Trabajador = ''
  Cod_Trabajador=''
  Cod_Tipo_Aguja = ''
  Nom_Trabajador= ''
  Tipo_Aguja = ''
  T1 = ''
  T2 = ''
  T3 = ''
  T4 = ''
  Tp1 = ''
  Tp2 = ''
  Cntd = ''
  Fec_Reg_Ini = ''
  Fec_Reg_Fin = ''

  myControl = new FormControl();
  Fecha = new FormControl(new Date())

  formulario = this.formBuilder.group({
    CodSupervisor:    [''],
    Supervisor:       [''],
    CodAuditor:       [''],
    Auditor:          [''],
    Linea:            [''],
    Observacion:      [''],
    Fecha_Registro:   ['']
  }) 

  formulario2 = this.formBuilder.group({
    CodTejedor:           [''],
    Tejedor:              [''],
    CodOrdtra:            [''],
    CodMaquinaTejeduria:  [''],
    MaquinaTejeduria:     [''],
    CodTipoAguja:         [''],
    TalonC1:              [''],
    TalonC2:              [''],
    TalonC3:              [''],
    TalonC4:              [''],    
    Talon_Pl1:            [''],
    Talon_Pl2:            [''],
    Cntd:                 [''],
  }) 

  listar_lineas = [];  
selectedValue1: any;  
 
  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
              private TejeduriaService: TejeduriaService ) 
  {

    this.formulario = formBuilder.group({
      CodSupervisor:    ['',],
      Supervisor:       ['',],
      CodAuditor:       ['', Validators.required],
      Auditor:          ['', Validators.required],
      Linea:            ['', Validators.required],
      Observacion:      [''],
      Fecha_Registro:   ['']        
    });

    this.formulario2 = formBuilder.group({
    CodTejedor:           ['', [Validators.required,Validators.minLength(8)]],
    Tejedor:              ['', Validators.required],
    CodOrdtra:            [''],
    CodMaquinaTejeduria:  ['', Validators.required],
    MaquinaTejeduria:     ['', Validators.required],
    CodTipoAguja:         ['', Validators.required],
    TalonC1:              [''],
    TalonC2:              [''],
    TalonC3:              [''],
    TalonC4:              [''],    
    Talon_Pl1:            [''],
    Talon_Pl2:            [''],
    Cntd:                 [''],
    });

  }

  ngOnInit(): void {      
  this.formulario2.controls['Tejedor'].disable()
  this.formulario2.controls['CodMaquinaTejeduria'].disable()
    
  this.CargarOperacionMaqTejeduria()
  // this.CargarOperacionTejedor()
  this.MuestraTipoAguja();
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

  onChange() {        
    this.formulario2.get('TalonC1')?.setValue('');
    this.formulario2.get('TalonC2')?.setValue('');
    this.formulario2.get('TalonC3')?.setValue('');
    this.formulario2.get('TalonC4')?.setValue('');
    this.formulario2.get('Talon_Pl1')?.setValue('');
    this.formulario2.get('Talon_Pl2')?.setValue('');     
    this.formulario2.get('Cntd')?.setValue('');
}



/* --------------- REGISTRAR CABECERA ------------------------------------------ */

Guardar() {   
          
    this.Opcion = 'I' 
    this.Num_Registro = ''
    this.Cod_Maquina_Tejeduria = this.formulario2.get('CodMaquinaTejeduria')?.value
    this.Cod_Ordtra = this.formulario2.get('CodOrdtra')?.value  
    this.Tip_Trabajador = 'O'
    this.Cod_Trabajador = this.formulario2.get('CodTejedor')?.value
    this.Cod_Tipo_Aguja = this.formulario2.get('CodTipoAguja')?.value
    this.T1 = this.formulario2.get('TalonC1')?.value 
    this.T2 = this.formulario2.get('TalonC2')?.value 
    this.T3 = this.formulario2.get('TalonC3')?.value  
    this.T4 = this.formulario2.get('TalonC4')?.value  
    this.Tp1 = this.formulario2.get('Talon_Pl1')?.value 
    this.Tp2 = this.formulario2.get('Talon_Pl2')?.value 
    this.Cntd = this.formulario2.get('Cntd')?.value  
    this.Fec_Reg_Ini= ''
    this.Fec_Reg_Fin = ''      
    this.TejeduriaService.MantConsultaAguja(
                          this.Opcion,
                          this.Num_Registro,
                          this.Cod_Maquina_Tejeduria,
                          this.Cod_Ordtra,
                          this.Tip_Trabajador,
                          this.Cod_Trabajador,
                          this.Cod_Tipo_Aguja,                          
                          this.T1,
                          this.T2,
                          this.T3,
                          this.T4,
                          this.Tp1,
                          this.Tp2,
                          this.Cntd,
                          this.Fec_Reg_Ini,
                          this.Fec_Reg_Fin).subscribe(
                          (result: any) => {
                          if(result[0].Cntd == 'OK'){                            
                          
                          //this.formulario2.reset();              
                          this.matSnackBar.open('Registro Correcto !!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
                          }
                      else{
                            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
                          }
                        },
                            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
                        )                        
  
}

/* --------------- LIMPIAR INPUTS ------------------------------------------ */
  limpiar(){

    /*this.formulario.controls['Vehiculo'].setValue('')
    this.formulario.controls['Placa'].setValue('')
    this.formulario.controls['codBarras'].setValue('')
    this.formulario.controls['soat'].setValue('')
    this.formulario.controls['Fec_Fin_Lic'].setValue('')
    this.formulario.controls['tarjetaProp'].setValue('')
    this.formulario.controls['tCarga'].setValue('')
    this.formulario.controls['tDescarga'].setValue('')
    this.formulario.controls['conductor'].setValue('')*/  
    
  }

  /* --------------- LLENAR SELECT MAQUINA ------------------------------------------ */

  CargarOperacionMaqTejeduria(){
    this.listar_operacionMaqTejeduria = [];    
    this.TejeduriaService.MuestraMaqTejeduria(      
      ).subscribe(data =>
      {
        this.listar_operacionMaqTejeduria = data        
        this.RecargarOperacionMaqTejeduria()       
      }
      )
  }
    
  RecargarOperacionMaqTejeduria(){
    this.filtroOperacionMaqTejeduria = this.formulario2.controls['MaquinaTejeduria'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionMaqTejeduria(option) : this.listar_operacionMaqTejeduria.slice())),
    );
    
  }

  private _filterOperacionMaqTejeduria(value: string): MaqTejeduria[] {
    this.formulario2.controls['CodMaquinaTejeduria'].setValue('')
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_operacionMaqTejeduria.filter(option => String(option.Cod_Maquina_Tejeduria).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Maquina_Tejeduria.toLowerCase().indexOf(filterValue ) > -1);
  }

  /* --------------- LLENAR SELECT TEJEDOR ------------------------------------------ */
  BuscarNomTrabajador() {
    
  this.Cod_Trabajador = (this.formulario2.get('CodTejedor')?.value).toString();
   
  
  if (this.Cod_Trabajador == null) {
    this.Nom_Trabajador = null
  } else if (this.Cod_Trabajador.length < 8 || this.Cod_Trabajador.length > 10) {
    this.Nom_Trabajador = null
  } else {    

    this.TejeduriaService.MuestraTejedor(this.Cod_Trabajador).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK') {

          this.formulario2.patchValue({ Nom_Trabajador: result[0].Nom_Tejedor })
          this.Nom_Trabajador = result[0].Nom_Tejedor

        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })          
          this.Nom_Trabajador = null       
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }
}
  
  CambiarValorCodMaquinaTejeduria(Cod_Maquina_Tejeduria: string, Nom_Maquina_Tejeduria: string){
    this.formulario2.controls['CodMaquinaTejeduria'].setValue(Cod_Maquina_Tejeduria)    
  }
  

}

