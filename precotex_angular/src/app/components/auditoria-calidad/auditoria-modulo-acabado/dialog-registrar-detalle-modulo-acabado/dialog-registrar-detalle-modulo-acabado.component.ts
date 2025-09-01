import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { NgxSpinnerService }  from "ngx-spinner";
import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';


interface data{
  Cod_LinPro:             string
  Num_Auditoria:          number
  Num_Auditoria_Detalle:  number,
  Cod_Inspector:          string,
  Nom_Auditor:            string,
  Cod_OrdPro:             string,
  Cod_Cliente:            string,
  Des_Cliente:            string,
  Cod_EstCli:             string,
  Des_EstPro:             string,
  Cod_Present:            string,
  Des_Present:            string,
  Can_Lote:               number,
  Can_Muestra:            number,
  Observacion:            string,
  Co_CodOrdPro:           string,
  Num_Paquete:            string,
  Flg_Status:             string,
  Flg_Reproceso_Num:      number,
  Cod_OrdCor:             string,
  Lectura_Manual:         string,
  Cod_Lider:              string,
  Cod_Dobladora:          string,
  Nom_Lider:              string,
  Nom_Dobladora:          string
}

interface Inspector {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

interface Color {
  Cod_Present: string;
  Des_Present: string; 
  
}
interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string
}

@Component({
  selector: 'app-dialog-registrar-detalle-modulo-acabado',
  templateUrl: './dialog-registrar-detalle-modulo-acabado.component.html',
  styleUrls: ['./dialog-registrar-detalle-modulo-acabado.component.scss']
})
export class DialogRegistrarDetalleModuloAcabadoComponent implements OnInit {

  listar_operacionInspector:    Inspector[] = [];
  filtroOperacionInspector:     Observable<Inspector[]> | undefined;
  listar_operacionColor:        Color[] = [];
  listar_Auditor:      Auditor[] = [];
  listar_Dobladora:      Auditor[] = [];
  filtroAuditor:       Observable<Auditor[]> | undefined;
  filtroDobladora:       Observable<Auditor[]> | undefined;
  // nuevas variables
  Cod_LinPro              = this.data.Cod_LinPro
  Cod_Accion              = ''
  Num_Auditoria_Detalle   = 0
  Num_Auditoria           = this.data.Num_Auditoria
  Cod_Inspector           = ''
  Cod_OrdPro              = ''
  Cod_Cliente             = ''
  Cod_EstCli              = ''
  Cod_Present             = ''
  Can_Lote                = 0
  Can_Muestra             = 0
  Observacion             = ''
  Flg_Status              = this.data.Flg_Status;
  Cod_Usuario             = GlobalVariable.vusu;
  Cod_Equipo              = '' 
  Fecha_Reg               = '' 
  Cod_Auditor             = ''
  Nom_Auditor             = ''
  Cod_Motivo              = ''
  Titulo                  = ''
  Flg_Reproceso           = ''
  Flg_Reproceso_Num       = 0
  Co_CodOrdPro            = ''
  Num_Paquete             = '' 
  Cod_OrdCor              = ''
  Lectura_Manual          = this.data.Lectura_Manual;

  isConditionTrue: boolean = false;
  myControl = new FormControl();
  Fecha = new FormControl(new Date())

  formulario = this.formBuilder.group({
    CodInspector:     [''],
    Inspector:        [''],
    OP:               [''],
    Cliente:          [''],
    Estilo:           [''],
    Color:            [''],
    Muestra:          [''],
    Observacion:      [''],
    CodCliente:       [''],
    CodEstCli:        [''],
    CodDobladora:     [''],
    Dobladora:        [''],
    CodLider:     [''],
    Lider:        ['']
  }) 

  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
              private auditoriaAcabadosService: AuditoriaAcabadosService,
              private SpinnerService: NgxSpinnerService,
              @Inject(MAT_DIALOG_DATA) public data: data) 
  {

    this.formulario = formBuilder.group({
      CodInspector:    ['',],
      Inspector:       ['',],
      OP:              ['', Validators.required],
      Cliente:         ['', Validators.required],
      Estilo:          ['', Validators.required],
      Color:           ['', Validators.required],
      Muestra:         ['', Validators.required],
      CodCliente:      ['', Validators.required],
      CodEstCli:       ['', Validators.required],
      Observacion:     [''],
      CodLider:     [''],
      Lider:    [''],
      CodDobladora:     [''],
      Dobladora:     ['']
        
    });
   
  }

  ngOnInit(): void {
    if(this.Lectura_Manual=='S'){
      this.formulario.controls['Lider'].clearValidators();
      this.formulario.controls['Dobladora'].clearValidators();
      
     }else{
      this.formulario.controls['Lider'].setValidators([Validators.required]);
      this.formulario.controls['Dobladora'].setValidators([Validators.required]);
   
     }

    this.formulario.controls['CodInspector'].disable();
   
    this.formulario.controls['Cliente'].disable();
    this.formulario.controls['Estilo'].disable();  
    this.formulario.controls['CodEstCli'].disable();
    this.formulario.controls['CodLider'].disable();
    this.formulario.controls['CodDobladora'].disable();
    
    this.CargarOperacionInspector();
    this.Titulo    = this.data.Cod_Inspector

   if(this.Titulo != undefined){

    if(this.Lectura_Manual=='S'){
      
      this.formulario.controls['OP'].disable();
      this.formulario.controls['Inspector'].disable();
      this.formulario.controls['Color'].disable();
      this.formulario.controls['Muestra'].enable();
      this.formulario.controls['CodInspector'].setValue(this.data.Cod_Inspector);
      this.formulario.controls['Inspector'].setValue(this.data.Nom_Auditor);
      this.formulario.controls['OP'].setValue(this.data.Cod_OrdPro);     
      this.buscarEstiloClientexOP();
      this.formulario.controls['Color'].setValue(this.data.Cod_Present);
      this.formulario.controls['Muestra'].setValue(this.data.Can_Muestra);
      this.formulario.controls['Observacion'].setValue(this.data.Observacion);
  
    }else{
      console.log('this.data::',this.data);
      this.CargarAuditor();
      this.CargarDobladora();
      this.formulario.controls['OP'].disable();
      this.formulario.controls['Inspector'].disable();
      this.formulario.controls['Color'].disable();
      this.formulario.controls['Muestra'].enable();
      this.formulario.controls['CodInspector'].setValue(this.data.Cod_Inspector);
      this.formulario.controls['Inspector'].setValue(this.data.Nom_Auditor);
      this.formulario.controls['OP'].setValue(this.data.Cod_OrdPro);
      this.formulario.controls['CodLider'].disable();
      this.formulario.controls['CodDobladora'].disable();   
      this.formulario.controls['Lider'].disable();
      this.formulario.controls['Dobladora'].disable(); 
      this.buscarEstiloClientexOP();
      this.formulario.controls['Color'].setValue(this.data.Cod_Present);
      this.formulario.controls['Muestra'].setValue(this.data.Can_Muestra);
      this.formulario.controls['Observacion'].setValue(this.data.Observacion);
      this.formulario.controls['Lider'].setValue(this.data.Nom_Lider);
      this.formulario.controls['CodLider'].setValue(this.data.Cod_Lider);
      this.formulario.controls['Dobladora'].setValue(this.data.Nom_Dobladora);    
      this.formulario.controls['CodDobladora'].setValue(this.data.Cod_Dobladora);   

  
    }


    
   }else{
    this.CargarAuditor();
    this.CargarDobladora();
   }
   
   
   
   
  }

  CargarAuditor(){

    this.listar_Auditor = [];
    this.Cod_Accion   = 'L'
    this.Cod_Auditor  = ''
    this.Nom_Auditor  = ''
    this.Cod_OrdPro   = ''
    this.Can_Lote     = 0
    this.Cod_Motivo   = ''
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
      this.Cod_Accion,
      this.Cod_Auditor,
      this.Nom_Auditor,
      this.Cod_OrdPro,
      this.Can_Lote,
      this.Cod_Motivo
      ).subscribe(
      (result: any) => {
        this.listar_Auditor = result
        this.RecargarAuditor()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
  
  CargarDobladora(){

    this.listar_Auditor = [];
    this.Cod_Accion   = 'L'
    this.Cod_Auditor  = ''
    this.Nom_Auditor  = ''
    this.Cod_OrdPro   = ''
    this.Can_Lote     = 0
    this.Cod_Motivo   = ''
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
      this.Cod_Accion,
      this.Cod_Auditor,
      this.Nom_Auditor,
      this.Cod_OrdPro,
      this.Can_Lote,
      this.Cod_Motivo
      ).subscribe(
      (result: any) => {
        this.listar_Dobladora = result
        this.RecargarDobladora()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
  RecargarAuditor(){
    this.filtroAuditor = this.formulario.controls['Lider'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterAuditor(option) : this.listar_Auditor.slice())),
    );
    
  }

  RecargarDobladora(){
    this.filtroDobladora = this.formulario.controls['Dobladora'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterDobladora(option) : this.listar_Dobladora.slice())),
    );
    
  }
  private _filterAuditor(value: string): Auditor[] {
    this.formulario.controls['CodLider'].setValue('')
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_Auditor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }

  private _filterDobladora(value: string): Auditor[] {
    this.formulario.controls['CodDobladora'].setValue('')
    const filterValueDobladora = value.toLowerCase();
   
    return this.listar_Dobladora.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValueDobladora ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValueDobladora ) > -1);
  }

  CambiarCodLider(Cod_Auditor: string, Tip_Trabajador: string){
    this.formulario.controls['CodLider'].setValue(Tip_Trabajador + '-' +Cod_Auditor)
  }
  
  
  CambiarCodDobladora(Cod_Auditor: string, Tip_Trabajador: string){
    this.formulario.controls['CodDobladora'].setValue(Tip_Trabajador + '-' +Cod_Auditor)
  }
  
  CompletarDatosRegistro(){
    this.SpinnerService.show();
    this.Cod_Accion            = 'C'
    this.Num_Auditoria_Detalle = 0
    this.Num_Auditoria         = this.data.Num_Auditoria
    this.Cod_Inspector         = ''
    this.Cod_OrdPro            = ''
    this.Cod_Cliente           = ''
    this.Cod_EstCli            = ''
    this.Cod_Present           = ''
    this.Can_Lote              = 0
    this.Can_Muestra           = 0
    this.Observacion           = ''
    this.Flg_Status            = 'A'
    this.Flg_Reproceso         = 'N'
    this.Flg_Reproceso_Num     = 0
    this.Co_CodOrdPro          = ''
    this.Num_Paquete           = ''
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaDetalleService(
      this.Cod_Accion,
      this.Num_Auditoria_Detalle,
      this.Num_Auditoria,
      this.Cod_Inspector,         
      this.Cod_OrdPro,
      this.Cod_Cliente,
      this.Cod_EstCli,
      this.Cod_Present,
      this.Can_Lote,
      this.Can_Muestra,
      this.Observacion,
      this.Flg_Status,
      this.Flg_Reproceso,
      this.Flg_Reproceso_Num,
      this.Co_CodOrdPro,
      this.Num_Paquete
      ).subscribe(
          (result: any) => {
            if(result[0].Respuesta != 'OK'){
            this.formulario.controls['Inspector'].setValue(result[0].Nom_Auditor)
            this.formulario.controls['CodInspector'].setValue(result[0].Tip_Trabajador_Inspector+'-'+result[0].Cod_Inspector)
            this.formulario.controls['OP'].setValue(result[0].Cod_OrdPro)
            this.buscarEstiloClientexOP()
            this.formulario.controls['Color'].setValue(result[0].Cod_Present)
            this.SpinnerService.hide();
            }
            this.SpinnerService.hide();
        
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
        )
  }

/* --------------- REGISTRAR CABECERA ------------------------------------------ */

  submit(formDirective) :void {
  
    this.Cod_Accion            = 'I'
    this.Num_Auditoria_Detalle = 0
    if(this.Titulo != undefined){
      this.Cod_Accion          = 'U'
      this.Num_Auditoria_Detalle = this.data.Num_Auditoria_Detalle
    }
    var lider = this.formulario.get('CodLider')?.value.split('-');
    var dobladora = this.formulario.get('CodDobladora')?.value.split('-');
 
    const formData = new FormData();
    formData.append('Accion', this.Cod_Accion);
    formData.append('Num_Auditoria_Detalle',this.Num_Auditoria_Detalle.toString());
    formData.append('Num_Auditoria', this.data.Num_Auditoria.toString());
    formData.append('Cod_Inspector', GlobalVariable.vtiptra + '-' + GlobalVariable.vcodtra ); 		
    formData.append('Cod_OrdPro', this.formulario.get('OP')?.value); 			
    formData.append('Cod_Cliente', this.formulario.get('CodCliente')?.value );		
    formData.append('Cod_EstCli', this.formulario.get('CodEstCli')?.value ); 			
    formData.append('Cod_Present', this.formulario.get('Color')?.value ); 		
    formData.append('Can_Muestra', this.formulario.get('Muestra')?.value ); 		
    formData.append('Observacion', this.formulario.get('Observacion')?.value ); 		
    formData.append('Flg_Status', 'A' ); 			
    formData.append('Cod_Usuario', this.Cod_Usuario ); 		
    formData.append('Flg_Reproceso', 'N' ); 		
    formData.append('Flg_Reproceso_Num', '0' ); 	
    formData.append('Co_CodOrdPro', '' ); 		
    formData.append('Num_Paquete', '' ); 		
    formData.append('Medidas',  '' ); 
    formData.append('Muestra',  '' );
    formData.append('Checklist',  '' );     
    if(this.Lectura_Manual=='S'){
      formData.append('Cod_Lider', '' );
      formData.append('Cod_Dobladora', '' );
      formData.append('Tip_Trabajador_Lider',  '');
      formData.append('Tip_Trabajador_Dobladora',  ''); 
    }else{
      formData.append('Cod_Lider',  lider[1] );
      formData.append('Cod_Dobladora',  dobladora[1] ); 
      formData.append('Tip_Trabajador_Lider',  lider[0] );
      formData.append('Tip_Trabajador_Dobladora',  dobladora[0] ); 
    }  
    
    this.auditoriaAcabadosService.Mant_AuditoriaModuloAcabadoDetService(
      formData
      ).subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
              
              //if(this.Titulo == undefined){
                //this.limpiar()
                formDirective.resetForm();
                this.formulario.reset();
              //}
            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
              
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

/* --------------- LLENAR SELECT INSPECTOR ------------------------------------------ */

  CargarOperacionInspector(){

    this.listar_operacionInspector = [];
    this.Cod_Accion   = 'L'
    this.Cod_Auditor  = ''
    this.Nom_Auditor  = ''
    this.Cod_OrdPro   = ''
    this.Can_Lote     = 0
    this.Cod_Motivo   = ''
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
      this.Cod_Accion,
      this.Cod_Auditor,
      this.Nom_Auditor,
      this.Cod_OrdPro,
      this.Can_Lote,
      this.Cod_Motivo
      ).subscribe(
      (result: any) => {
        this.listar_operacionInspector = result
        this.RecargarOperacionInspector()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
  
  
  RecargarOperacionInspector(){
    this.filtroOperacionInspector = this.formulario.controls['Inspector'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionInspector(option) : this.listar_operacionInspector.slice())),
    );
    
  }
  /*private _filterOperacionSupervisor(value: string): Supervisor[] {
    if (value == null || value == undefined ) {
      value = ''  
    }
    this.formulario.controls['CodSupervisor'].setValue('')
    const filterValue = value.toLowerCase();
    return this.listar_operacionSupervisor.filter(option => option.Nom_Auditor.toLowerCase().includes(filterValue));
  }*/ 

  private _filterOperacionInspector(value: string): Inspector[] {
    this.formulario.controls['CodInspector'].setValue('')
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_operacionInspector.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }



  /* --------------- CAMBIAR VALOR DEL INPUT COD SUPERVISOR ------------------------------------------ */

  CambiarValorCodInspector(Cod_Auditor: string, Tip_Trabajador:string){
  
    this.formulario.controls['CodInspector'].setValue(Tip_Trabajador+'-'+Cod_Auditor)
  }


  /* --------------- BUSCAR INSPECTOR Y LLENAR INPUT INSPECTOR ------------------------------------------ */
  BuscarInspector(){
    this.listar_operacionInspector = [];
    this.Cod_Accion   = 'T'
    this.Cod_Auditor  = this.formulario.get('CodInspector')?.value
    this.Nom_Auditor  = ''
    this.Cod_OrdPro   = ''
    this.Can_Lote     = 0
    this.Cod_Motivo   = ''
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
      this.Cod_Accion,
      this.Cod_Auditor,
      this.Nom_Auditor,
      this.Cod_OrdPro,
      this.Can_Lote,
      this.Cod_Motivo
      ).subscribe(
      (result: any) => {
       this.formulario.controls['Inspector'].setValue(result[0].Nom_Auditor)
       this.formulario.controls['CodInspector'].setValue(result[0].Cod_Auditor)
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  

  buscarEstiloClientexOP(){
    this.listar_operacionColor = []
    this.formulario.controls['CodCliente'].setValue('')
    this.formulario.controls['Cliente'].setValue('')
    this.formulario.controls['CodEstCli'].setValue('')
    this.formulario.controls['Estilo'].setValue('')
    this.Cod_OrdPro = this.formulario.get('OP')?.value
    if(this.Cod_OrdPro.length == 5){
    this.Cod_Accion   = 'E'
    this.Cod_Auditor  = ''
    this.Nom_Auditor  = ''
    this.Cod_OrdPro
    this.Can_Lote     = 0
    this.Cod_Motivo   = ''
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
      this.Cod_Accion,
      this.Cod_Auditor,
      this.Nom_Auditor, 
      this.Cod_OrdPro,
      this.Can_Lote,
      this.Cod_Motivo
      ).subscribe(
      (result: any) => {
        if(result.length > 0){
          console.log('resultOP: ',result);
        this.formulario.controls['CodCliente'].setValue(result[0].Cod_Cliente)
        this.formulario.controls['Cliente'].setValue(result[0].Des_Cliente)
        this.formulario.controls['CodEstCli'].setValue(result[0].Cod_EstCli)
        this.formulario.controls['Estilo'].setValue(result[0].Des_EstPro)

        
        this.CargarOperacionColor()
      }else{
        this.matSnackBar.open('La OP no existe...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
      }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }
    }


    CargarOperacionColor(){

      this.Cod_OrdPro = this.formulario.get('OP')?.value

      this.Cod_Accion   = 'C'
      this.Cod_Auditor  = ''
      this.Nom_Auditor  = ''
      this.Cod_OrdPro
      this.Can_Lote     = 0
      this.Cod_Motivo   = ''
      this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
        this.Cod_Accion,
        this.Cod_Auditor,
        this.Nom_Auditor, 
        this.Cod_OrdPro,
        this.Can_Lote,
        this.Cod_Motivo
      ).subscribe(
        (result: any) => {
          this.listar_operacionColor = result
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
        
    }

    CompararLoteConMuestra(){
      this.formulario.controls['Muestra'].setValue(0)
      this.Can_Lote     = this.formulario.get('Lote')?.value
      if(this.Can_Lote != undefined){
      if(this.Can_Lote.toLocaleString().length >0){
      this.Cod_Accion   = 'M'
      this.Cod_Auditor  = ''
      this.Nom_Auditor  = ''
      this.Cod_OrdPro
      this.Can_Lote
      this.Cod_Motivo   = ''
      this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
        this.Cod_Accion,
        this.Cod_Auditor,
        this.Nom_Auditor, 
        this.Cod_OrdPro,
        this.Can_Lote,
        this.Cod_Motivo
      ).subscribe(
        (result: any) => {
          if(result.length > 0){
          this.formulario.controls['Muestra'].setValue(result[0].Tamano_Muestro)
        }else{
          this.formulario.controls['Muestra'].setValue(0)
          this.matSnackBar.open('No hay tamaño de muestra para esa cantidad de lote...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
        }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      }
    }
  }


}
