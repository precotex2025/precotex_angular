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
  Flg_Status:             string
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
  selector: 'app-dialog-actualiza-reversion',
  templateUrl: './dialog-actualiza-reversion.component.html',
  styleUrls: ['./dialog-actualiza-reversion.component.scss']
})
export class DialogActualizaReversionComponent implements OnInit {

  num_guiaMascara = [/[A-Z-0-9]/i, /[A-Z-0-9]/i, /[A-Z-0-9]/i, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

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
  Flg_Status              = this.data.Flg_Status;
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
    Lote:             [''],
    Muestra:          [''],
    Guia:  [''],
    Observacion:      ['']    
  }) 

  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
              private SpinnerService: NgxSpinnerService,
              @Inject(MAT_DIALOG_DATA) public data: data) 
  {

    this.formulario = formBuilder.group({
      Lote:            [0, [Validators.required,
      Validators.maxLength(8),
      Validators.pattern('[0-9]*')]],
      Muestra:         [''],   
      Guia:            ['',[Validators.required]],   
      Observacion:     ['', [Validators.required]],     
      OP:              [''],
      Cliente:         [''],
      Estilo:          [''],
      Color:           [''],   
      CodEstCli:           [''], 
      CodCliente:           [''],   
    });

  }

  ngOnInit(): void {
  
    this.formulario.controls['Muestra'].disable();
    this.formulario.controls['Cliente'].disable();
    this.formulario.controls['CodEstCli'].disable();
    this.formulario.controls['Estilo'].disable();
    this.Titulo    = this.data.Cod_Inspector
   if(this.Titulo != undefined){ 
    
     this.formulario.controls['Lote'].setValue(this.data.Can_Lote)
    this.formulario.controls['Muestra'].setValue(this.data.Can_Muestra)
   // this.formulario.controls['Observacion'].setValue(this.data.Observacion)
   }
 
  }

    get lote() {
      return this.formulario.get('Lote') as FormControl;
    }

    get loteErrors() {
      if (this.lote.hasError('required')) {
        return 'Este campo es requerido';
      }
      if (this.lote.hasError('maxlength')) {
        return 'La longitud máxima es de 10 numeros.';
      }
      if (this.lote.hasError('pattern')) {
        return 'Este campo solo permite números';
      }
      return '';
    } 
    
    get guia() {
      return this.formulario.get('Guia') as FormControl;
    }

    get guiaErrors() {
      if (this.guia.hasError('required')) {
        return 'Este campo es requerido';
      }
      if (this.guia.hasError('maxlength')) {
        return 'La longitud máxima es de 100';
      } 
      return '';
    } 
    get observacion() {
      return this.formulario.get('Observacion') as FormControl;
    }

    get observacionErrors() {
      if (this.observacion.hasError('required')) {
        return 'Este campo es requerido';
      }
      if (this.observacion.hasError('maxlength')) {
        return 'La longitud máxima es de 200';
      } 
      return '';
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
            //this.buscarEstiloClientexOP()
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
  
   //this.Cod_Accion            = 'I'
   this.Num_Auditoria_Detalle = 0;
   if(this.Titulo != undefined){
     this.Cod_Accion          = 'U';   
   }

   const formData = new FormData();
   formData.append('Accion', this.Cod_Accion);
   formData.append('Num_Auditoria_Detalle', this.data.Num_Auditoria_Detalle.toString());
   formData.append('Num_Auditoria', this.data.Num_Auditoria.toString());  
   formData.append('Lote', this.formulario.get('Lote')?.value);
   formData.append('Muestra', this.formulario.get('Muestra')?.value);
   formData.append('Guia', this.formulario.get('Guia')?.value); 
   formData.append('Observacion',this.formulario.get('Observacion')?.value); 
   formData.append('OP',this.formulario.get('OP')?.value); 
   formData.append('Cliente',this.formulario.get('CodCliente')?.value); 
   formData.append('Estilo',this.formulario.get('CodEstCli')?.value); 
   formData.append('Color',this.formulario.get('Color')?.value);  
 
   this.auditoriaInspeccionCosturaService.RevertirDetalleAuditoria(
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

buscarEstiloClientexOP(){
  this.listar_operacionColor = []
  this.formulario.controls['CodCliente'].setValue('')
  this.formulario.controls['Cliente'].setValue('')
  //this.formulario.controls['CodEstCli'].setValue('')
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

}
