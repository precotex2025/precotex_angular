import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { GlobalVariable } from 'src/app/VarGlobals';


interface data{
  Num_Auditoria:    number,
  Cod_Supervisor:   string, 
  Nom_Supervisor:   string, 
  Cod_Auditor:      string, 
  Nom_Auditor:      string, 
  Fecha_Auditoria:  string, 
  Cod_LinPro:       string, 
  Observacion:      string 
}

interface Supervisor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string
}

@Component({
  selector: 'app-dialog-cabecera-checklist-costura',
  templateUrl: './dialog-cabecera-checklist-costura.component.html',
  styleUrls: ['./dialog-cabecera-checklist-costura.component.scss']
})
export class DialogCabeceraChecklistCosturaComponent implements OnInit {

  listar_operacionSupervisor:   Supervisor[] = [];
  filtroOperacionSupervisor:    Observable<Supervisor[]> | undefined;
  listar_operacionAuditor:      Auditor[] = [];
  filtroOperacionAuditor:       Observable<Auditor[]> | undefined;
  
  // nuevas variables
  Cod_Accion        =   ""
  Num_Auditoria     =   0
  Cod_Supervisor    =   ""
  Nom_Supervisor    =   ""
  Cod_Auditor       =   ""
  Nom_Auditor       =   ""
  Fecha_Auditoria   =   ""
  Fecha_Auditoria2  =   ""
  Cod_LinPro        =   ""
  Observacion       =   ""
  Flg_Status        =   ""
  Cod_Usuario       =   ""
  Cod_Equipo        =   ""
  Fecha_Reg         =   ""
  Cod_OrdPro        =   ""
  InputFechaDesHabilitado = true	 
  Can_Lote          =   0
  Cod_Motivo        =   ''
  Titulo            =   ''
  Cod_EstCli        =   ''

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

  listar_lineas = [];
 
  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
              @Inject(MAT_DIALOG_DATA) public data: data) 
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

  }

  ngOnInit(): void {    
  this.formulario.controls['CodSupervisor'].disable()
  this.formulario.controls['CodAuditor'].disable()
  this.CargarOperacionSupervisor()
  this.CargarOperacionAuditor()
  this.BuscarLinea();

   this.Titulo = this.data.Cod_Supervisor
   if(this.Titulo != undefined){
      /*DESACTIVAR INPUTS PARA LA ACTUALIZACION*/ 
      this.formulario.controls['Supervisor'].disable()
      this.formulario.controls['Auditor'].disable()
      this.formulario.controls['Linea'].disable()
      this.formulario.controls['Fecha_Registro'].disable()
      /*DESACTIVAR INPUTS PARA LA ACTUALIZACION*/ 
      this.formulario.controls['CodSupervisor'].setValue(this.data.Cod_Supervisor)
      this.formulario.controls['Supervisor'].setValue(this.data.Nom_Supervisor)
      this.formulario.controls['CodAuditor'].setValue(this.data.Cod_Auditor)
      this.formulario.controls['Auditor'].setValue(this.data.Nom_Auditor)
      this.formulario.controls['Linea'].setValue(this.data.Cod_LinPro)
      this.formulario.controls['Observacion'].setValue(this.data.Observacion)
      /*SE CONVIERTE LA FECHA EJEMP. DD/MM/YYYY a un array {DD, MM, YYYY}*/
      let Fecha_Array = [] = this.data.Fecha_Auditoria.split("/")
      /*INVERTIR EL ORDEN DE LA FECHA ARRAY Y SEPARARLOS POR - QUE ES EL FORMATO QUE ACEPTA EL MATDATAPICKER: YYYY-MM-DD*/
      let Fecha_Convertia = Fecha_Array[2] + '-' +  Fecha_Array[1] + '-' + Fecha_Array[0]
      /*SETEAR LA FECHA CONVERTIDA AL INPUT DATE DE ANGULAR MATERIAL*/
      this.Fecha.setValue(Fecha_Convertia)
     
   }
  

  }

  BuscarLinea() {
    this.auditoriaInspeccionCosturaService.BuscarLineaCosturaService().subscribe(
      (result: any) => {
        //console.log(result)
        this.listar_lineas = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  submit(formDirective) :void {

    this.Cod_Accion         = 'I'
    this.Num_Auditoria      = 0
    if(this.Titulo != undefined){
      this.Cod_Accion        = 'U'
      this.Num_Auditoria     = this.data.Num_Auditoria
    }
    this.Cod_Supervisor     =  GlobalVariable.vtiptra + '-' + GlobalVariable.vcodtra
    this.Cod_Auditor        = this.formulario.get('CodAuditor')?.value
    this.Fecha_Auditoria    = this.Fecha.value
    this.Fecha_Auditoria2   = ''
    this.Cod_LinPro         = this.formulario.get('Linea')?.value
    this.Observacion        = this.formulario.get('Observacion')?.value
    this.Flg_Status         = 'P'
    this.Cod_OrdPro         = ''
    this.Cod_EstCli         = ''
    this.auditoriaInspeccionCosturaService.Mant_AuditoriaChecklistIngresoCosturaCabService(
      this.Cod_Accion,
      this.Num_Auditoria,
      this.Cod_Supervisor,
      this.Cod_Auditor,
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2,
      this.Cod_LinPro,
      this.Observacion,
      this.Flg_Status,
      this.Cod_OrdPro,
      this.Cod_EstCli
      ).subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
              console.log(result)
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

/* --------------- LLENAR SELECT SUPERVISOR ------------------------------------------ */

  CargarOperacionSupervisor(){

    this.listar_operacionSupervisor = [];
    this.Cod_Accion   = 'I'
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
        this.listar_operacionSupervisor = result
        this.RecargarOperacionSupervisor()

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
  
  
  RecargarOperacionSupervisor(){
    this.filtroOperacionSupervisor = this.formulario.controls['Supervisor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionSupervisor(option) : this.listar_operacionSupervisor.slice())),
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

  private _filterOperacionSupervisor(value: string): Supervisor[] {
    this.formulario.controls['CodSupervisor'].setValue('')
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_operacionSupervisor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }



  /* --------------- CAMBIAR VALOR DEL INPUT COD SUPERVISOR ------------------------------------------ */

  CambiarValorCodSupervisor(Cod_Auditor: string, Tip_Trabajador: string){
    this.formulario.controls['CodSupervisor'].setValue(Tip_Trabajador + '-' + Cod_Auditor)
  }


  /* --------------- BUSCAR SUPERVISOR Y LLENAR INPUT SUPERVISOR ------------------------------------------ */
  BuscarSupervisor(){
    this.listar_operacionSupervisor = [];
    this.Cod_Accion   = 'T'
    this.Cod_Auditor  = this.formulario.get('CodSupervisor')?.value
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
       this.formulario.controls['Supervisor'].setValue(result[0].Nom_Auditor)
       this.formulario.controls['CodSupervisor'].setValue(result[0].Cod_Auditor)
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }



  /* --------------- LLENAR SELECT AUDITOR ------------------------------------------ */

  CargarOperacionAuditor(){

    this.listar_operacionAuditor = [];
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
        this.listar_operacionAuditor = result
        this.RecargarOperacionAuditor()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
  
  
  RecargarOperacionAuditor(){
    this.filtroOperacionAuditor = this.formulario.controls['Auditor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionAuditor(option) : this.listar_operacionAuditor.slice())),
    );
    
  }
 
  private _filterOperacionAuditor(value: string): Auditor[] {
    this.formulario.controls['CodAuditor'].setValue('')
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_operacionAuditor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }



  /* --------------- CAMBIAR VALOR DEL INPUT COD SUPERVISOR ------------------------------------------ */

  CambiarValorCodAuditor(Cod_Auditor: string, Tip_Trabajador: string){
    this.formulario.controls['CodAuditor'].setValue(Tip_Trabajador + '-' +Cod_Auditor)
  }
  

}

