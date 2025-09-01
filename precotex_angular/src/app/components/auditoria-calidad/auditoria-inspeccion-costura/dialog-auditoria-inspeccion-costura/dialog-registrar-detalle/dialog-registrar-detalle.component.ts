import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { NgxSpinnerService }  from "ngx-spinner";

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
  Co_CodOrdPro:           string,
  Num_Paquete:            string,
  Can_Lote:               number,
  Can_Muestra:            number,
  Observacion:            string
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


@Component({
  selector: 'app-dialog-registrar-detalle',
  templateUrl: './dialog-registrar-detalle.component.html',
  styleUrls: ['./dialog-registrar-detalle.component.scss']
})
export class DialogRegistrarDetalleComponent implements OnInit {

  listar_operacionInspector:    Inspector[] = [];
  filtroOperacionInspector:     Observable<Inspector[]> | undefined;
  listar_operacionColor:        Color[] = [];

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
  Flg_Status              = ''
  Cod_Usuario             = ''
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


  	 

  myControl = new FormControl();
  Fecha = new FormControl(new Date())

  formulario = this.formBuilder.group({
    CodInspector:     [''],
    Inspector:        [''],
    OP:               [''],
    Cliente:          [''],
    Estilo:           [''],
    Color:            [''],
    CodOrdPro:        [''],
    NumPaquete:       [''],
    Lote:             [''],
    Muestra:          [''],
    Observacion:      [''],
    CodCliente:       [''],
    CodEstCli:        [''],
  }) 

  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
              private SpinnerService: NgxSpinnerService,
              @Inject(MAT_DIALOG_DATA) public data: data) 
  {

    this.formulario = formBuilder.group({
      CodInspector:    ['', Validators.required],
      Inspector:       ['', Validators.required],
      OP:              ['', Validators.required],
      Cliente:         ['', Validators.required],
      Estilo:          ['', Validators.required],
      Color:           ['', Validators.required],
      CodOrdPro:       ['', Validators.maxLength(5)],
      NumPaquete:      ['', Validators.maxLength(3)],
      Lote:            [0, Validators.required],
      Muestra:         [0, Validators.required],
      CodCliente:      ['', Validators.required],
      CodEstCli:       ['', Validators.required],
      Observacion:     ['']
        
    });
    console.log('form para registrar ahora')
  }

  ngOnInit(): void {

    this.formulario.controls['CodInspector'].disable()
    this.formulario.controls['Cliente'].disable()
    this.formulario.controls['Estilo'].disable()
    this.formulario.controls['Muestra'].disable()
    this.formulario.controls['CodEstCli'].disable()
    
    this.CargarOperacionInspector()
    this.Titulo    = this.data.Cod_Inspector
   if(this.Titulo != undefined){
    this.formulario.controls['Inspector'].disable()
    this.formulario.controls['OP'].disable()
    this.formulario.controls['Color'].disable()
    this.formulario.controls['Lote'].disable()
    this.formulario.controls['CodOrdPro'].disable()

    this.formulario.controls['CodInspector'].setValue(this.data.Cod_Inspector)
    this.formulario.controls['Inspector'].setValue(this.data.Nom_Auditor)
    this.formulario.controls['OP'].setValue(this.data.Cod_OrdPro)
    this.buscarEstiloClientexOP()
    this.formulario.controls['Color'].setValue(this.data.Cod_Present)
    this.formulario.controls['CodOrdPro'].setValue(this.data.Co_CodOrdPro)
    this.formulario.controls['NumPaquete'].setValue(this.data.Num_Paquete)
    this.formulario.controls['Lote'].setValue(this.data.Can_Lote)
    this.formulario.controls['Muestra'].setValue(this.data.Can_Muestra)
    this.formulario.controls['Observacion'].setValue(this.data.Observacion)
   }
  
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
    this.Co_CodOrdPro     = ''
    this.Num_Paquete     = ''
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
    this.Num_Auditoria         = this.data.Num_Auditoria
    this.Cod_Inspector         = this.formulario.get('CodInspector')?.value
    this.Cod_OrdPro            = this.formulario.get('OP')?.value
    this.Cod_Cliente           = this.formulario.get('CodCliente')?.value
    this.Cod_EstCli            = this.formulario.get('CodEstCli')?.value
    this.Cod_Present           = this.formulario.get('Color')?.value
    this.Co_CodOrdPro          = this.formulario.get('CodOrdPro')?.value
    this.Num_Paquete           = this.formulario.get('NumPaquete')?.value
    this.Can_Lote              = this.formulario.get('Lote')?.value
    this.Can_Muestra           = this.formulario.get('Muestra')?.value
    this.Observacion           = this.formulario.get('Observacion')?.value
    this.Flg_Status            = 'A'
    this.Flg_Reproceso         = 'N'
    this.Flg_Reproceso_Num     = 0

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
    console.log(Cod_Auditor);
    console.log(Tip_Trabajador);
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
        this.formulario.controls['CodCliente'].setValue(result[0].Cod_Cliente)
        this.formulario.controls['Cliente'].setValue(result[0].Des_Cliente)
        this.formulario.controls['CodEstCli'].setValue(result[0].Cod_EstCli)
        this.formulario.controls['Estilo'].setValue(result[0].Des_EstPro)

        console.log(result);
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
