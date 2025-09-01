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
import { MovimientoLiquidacionAviosService } from 'src/app/services/movimiento-liquidacion-avios.service';




interface data{
  Cod_LinPro:             string
  Num_Auditoria:          number
  Num_Liquidacion_Detalle:  number,
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
  IdLiquidacion: string,
  Item: string,
  OP: string,
  Articulo:            string,
  Grosor:            string,
  Talla:            string,
  CodColor:            string,
  Color:            string,
  Lote:            string,
  Marca:            string,
  Cantidad:            string,
  Descripcion:            string,
  Estado: string
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

interface OP {
  N: string ;
  color: string;
  combinacion: string; 
  item: string;   
}

@Component({
  selector: 'app-dialog-registrar-detalle-liquidacion',
  templateUrl: './dialog-registrar-detalle-liquidacion.component.html',
  styleUrls: ['./dialog-registrar-detalle-liquidacion.component.scss']
})
export class DialogRegistrarDetalleLiquidacionComponent implements OnInit {

  listar_operacionInspector:    Inspector[] = [];
  filtroOperacionInspector:     Observable<Inspector[]> | undefined;
  listar_operacionColor:        Color[] = [];
  listar_OP:        OP[] = [];

  // nuevas variables
  Cod_LinPro              = this.data.Cod_LinPro
  Cod_Accion              = ''
  Num_Liquidacion_Detalle   = 0
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
  Num_Item             = ''

  	 

  myControl = new FormControl();
  Fecha = new FormControl(new Date())
 
  formulario = this.formBuilder.group({
    OP:             [''],  
    Color:         [''],
    Lote:            [''], 
    IdLiquidacion:     [''], 
    Descripcion:  [''],
    Estado:     [''],
    Articulo:   [''],
    Grosor:   [''],
    Talla:   [''],
    CodigoColorPro:   [''],
    Marca:   [''],
    CantidadConos:   [''],
    Item:   [''] 
  }) 
 

  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
              private movimientoLiquidacionAviosService: MovimientoLiquidacionAviosService,
              private SpinnerService: NgxSpinnerService,
              @Inject(MAT_DIALOG_DATA) public data: data) 
  {

    this.formulario = formBuilder.group({    
      OP:              ['', Validators.required],     
      Color:           [''], 
      Lote:      ['', [Validators.required,
        Validators.pattern('[0-9]*')]],  
      IdLiquidacion:      [''],    
      Descripcion:     ['', Validators.required],
      Estado:     [''],
      Articulo:   [''],
      Grosor:      ['', [Validators.required,
        Validators.pattern('[0-9/.]*')]], 
      Talla:      ['', [Validators.required,
        Validators.pattern('[a-zA-Z,]*')]], 
      CodigoColorPro:      ['', [Validators.required,
        Validators.pattern('[a-zA-Z 0-9]*')]], 
      Marca:      ['', [Validators.required,
        Validators.pattern('[a-zA-Z ]*')]], 
      CantidadConos:      ['', [Validators.required,
        Validators.pattern('[0-9]*')]],
      Item:   ['']      
    });

  }  

  
  get grosor() {
    return this.formulario.get('Grosor') as FormControl;
  }

  get grosorErrors() {
    if (this.grosor.hasError('pattern')) {
      return 'Este campo permite números y /';
    }
    return '';
  }

  get talla() {
    return this.formulario.get('Talla') as FormControl;
  }

  get tallaErrors() {
    if (this.talla.hasError('pattern')) {
      return 'Este campo solo permite letras';
    }
    return '';
  }

  get codigoColor() {
    return this.formulario.get('CodigoColorPro') as FormControl;
  }

  get codigoColorErrors() {
    if (this.codigoColor.hasError('pattern')) {
      return 'Este campo solo permite números y letras';
    }
    return '';
  }

  
  get lote() {
    return this.formulario.get('Lote') as FormControl;
  }

  get loteErrors() {
    if (this.lote.hasError('pattern')) {
      return 'Este campo permite números';
    }
    return '';
  }

  get marca() {
    return this.formulario.get('Marca') as FormControl;
  }

  get marcaErrors() {
    if (this.marca.hasError('pattern')) {
      return 'Este campo permite letras';
    }
    return '';
  }

  get conos() {
    return this.formulario.get('CantidadConos') as FormControl;
  }

  get conosErrors() {
    if (this.conos.hasError('pattern')) {
      return 'Este campo permite números';
    }
    return '';
  }
  
  ngOnInit(): void { 

    this.formulario.controls['IdLiquidacion'].setValue(this.data.IdLiquidacion)
    this.Titulo   = this.data.Item;
    this.Num_Item = this.data.Item;
   if(this.Titulo != undefined){
 
    //this.formulario.controls['OP'].disable()
    //this.formulario.controls['Color'].disable()
  
     this.formulario.controls['OP'].setValue(this.data.OP);
     this.formulario.controls['Articulo'].setValue(this.data.Articulo);
     this.formulario.controls['Grosor'].setValue(this.data.Grosor);
     this.formulario.controls['Talla'].setValue(this.data.Talla);
     this.formulario.controls['CodigoColorPro'].setValue(this.data.CodColor);
     this.formulario.controls['Color'].setValue(this.data.Color);
     this.formulario.controls['Lote'].setValue(this.data.Lote);
     this.formulario.controls['Marca'].setValue(this.data.Marca);
     this.formulario.controls['CantidadConos'].setValue(this.data.Cantidad);
     this.formulario.controls['Descripcion'].setValue(this.data.Descripcion);
     this.formulario.controls['Item'].setValue(this.data.Item);
     this.formulario.controls['Estado'].setValue(this.data.Estado); 
     this.buscarEstiloOPModificar();
 
   }
  
  }


  CompletarDatosRegistro(){
    this.SpinnerService.show();
    this.Cod_Accion            = 'C'
    this.Num_Liquidacion_Detalle = 0
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
      this.Num_Liquidacion_Detalle,
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
             this.formulario.controls['OP'].setValue(result[0].Cod_OrdPro)
            this.buscarEstiloOP()
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
    this.Num_Liquidacion_Detalle = 0
    if(this.Titulo != undefined){
      this.Cod_Accion          = 'A'
      this.Num_Liquidacion_Detalle = this.data.Num_Liquidacion_Detalle
    }
    
    const formData = new FormData();
    formData.append('Opcion', this.Cod_Accion );
    formData.append('IdLiquidacion', this.formulario.get('IdLiquidacion')?.value);
    formData.append('Estado', this.formulario.get('Estado')?.value);
    formData.append('Item', this.formulario.get('Item')?.value);
    formData.append('OP', this.formulario.get('OP')?.value);
    formData.append('Articulo', this.formulario.get('Articulo')?.value);
    formData.append('Grosor', this.formulario.get('Grosor')?.value);
    formData.append('Talla', this.formulario.get('Talla')?.value);
    formData.append('CodigoColorPro', this.formulario.get('CodigoColorPro')?.value);
    formData.append('Color', this.formulario.get('Color')?.value);
    formData.append('Lote', this.formulario.get('Lote')?.value);
    formData.append('Marca', this.formulario.get('Marca')?.value);
    formData.append('CantidadConos', this.formulario.get('CantidadConos')?.value);
    formData.append('Descripcion', this.formulario.get('Descripcion')?.value);  

   
    this.movimientoLiquidacionAviosService.MantMovimientoLiquidacionAviosDetService(
      formData
      ).subscribe(
          (result: any) => {

           if(result[0].Respuesta !== 'false'){
        
              if(this.Titulo == undefined){
                //this.limpiar()
                formDirective.resetForm();
                this.formulario.reset();
              }
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
       // this.RecargarOperacionInspector()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
  
   

   


  buscarEstiloOP(){
    this.listar_operacionColor = [];
    this.listar_OP= [];
    this.Cod_OrdPro = this.formulario.get('OP')?.value;
    if(this.Cod_OrdPro.length == 5){
    this.movimientoLiquidacionAviosService.BuscarEstiloOPService(
      this.Cod_OrdPro
      ).subscribe(
      (result: any) => {
   
        if(result.length > 0){ 
 
      this.formulario.controls['Color'].setValue('');
      this.formulario.controls['Articulo'].setValue('');
      
      this.listar_OP = result       
 
      }else{
        this.matSnackBar.open('La OP no existe...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
      }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }
    }

    buscarEstiloOPModificar(){
      this.listar_operacionColor = [];
      this.listar_OP= [];
      this.Cod_OrdPro = this.formulario.get('OP')?.value;
      if(this.Cod_OrdPro.length == 5){
      this.movimientoLiquidacionAviosService.BuscarEstiloOPService(
        this.Cod_OrdPro
        ).subscribe(
        (result: any) => {
     
          if(result.length > 0){ 
          this.listar_OP = result;    
        }else{
          this.matSnackBar.open('La OP no existe...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
        }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      }
      }

  selectItem(event) {
    var color ='';
    var articulo ='';
    this.formulario.controls['Articulo'].setValue('');
    this.formulario.controls['Color'].setValue('');

    this.listar_OP.forEach(element => {

      if (element.N == event.value) {
        console.log("element: ",element);
        if(element.color.length>0 || element.item.length>0){
          if(element.color.length>30){
            color=element.color.substring(0,30);
          }else{
            color=element.color;
          }
          if(element.item.length>24){
            articulo=element.item.substring(0,24);
          }else{
            if(element.item.length>0 && element.item.length<24){
              articulo=element.item;
            }else{
              articulo='';
            }
            
          }

          this.formulario.controls['Articulo'].setValue(articulo);
          this.formulario.controls['Color'].setValue(color);
        }
           

      }
    });
  }

}
