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
  Num_Paquete:            string 
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
  selector: 'app-dialog-registrar-despacho',
  templateUrl: './dialog-registrar-despacho.component.html',
  styleUrls: ['./dialog-registrar-despacho.component.scss']
})
export class DialogRegistrarDespachoComponent implements OnInit {
  precintoMascara = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
  /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

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
  Precinto                = '';
  Bulto                   = '';
  Guia                    = '';


  	 

  myControl = new FormControl();
  Fecha = new FormControl(new Date())

  formulario = this.formBuilder.group({
    CodInspector:     [''],
    Inspector:        [''],
    OP:               [''],
    Cliente:          [''],
    Estilo:           [''],
    Color:            [''],
    Lote:             [''],
    Muestra:          [''],
    Observacion:      [''],
    CodCliente:       [''],
    CodEstCli:        [''],
    Precinto:         [''],
    Bulto:            [''],
    Guia:             ['']
  }) 

  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
              private SpinnerService: NgxSpinnerService,
              @Inject(MAT_DIALOG_DATA) public data: data) 
  {

    this.formulario = formBuilder.group({
      CodInspector:    [''],
      Inspector:       [''],
      OP:              [''],
      Cliente:         [''],
      Estilo:          [''],
      Color:           [''],
      Lote:            [''],
      Muestra:         [''],
      CodCliente:      [''],
      CodEstCli:       [''],
      Observacion:     [''],
      Precinto: ['', [Validators.required]],
      Bulto: ['', [Validators.required,
        Validators.maxLength(3),
        Validators.pattern('[0-9]*')]],
      Guia: ['', [Validators.required,
        Validators.maxLength(100)
      ]]
    });

  }

  ngOnInit(): void {
console.log("data: ", this.data);
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

    this.formulario.controls['CodInspector'].setValue(this.data.Cod_Inspector)
    this.formulario.controls['Inspector'].setValue(this.data.Nom_Auditor)
    this.formulario.controls['OP'].setValue(this.data.Cod_OrdPro)
    this.buscarEstiloClientexOP()
    this.formulario.controls['Color'].setValue(this.data.Cod_Present)
    this.formulario.controls['Lote'].setValue(this.data.Can_Lote)
    this.formulario.controls['Muestra'].setValue(this.data.Can_Muestra)
    this.formulario.controls['Observacion'].setValue(this.data.Observacion)
   }
  
  }
/*
  get precinto() {
    return this.formulario.get('Precinto') as FormControl;
  }

  get precintoErrors() {
    if (this.precinto.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (this.precinto.hasError('maxlength')) {
      return 'La longitud máxima es de 200 caracteres.';
    }   
    if (this.precinto.hasError('pattern')) {
      return 'Este campo solo permite números';
    }
    return '';
  }
*/
  get bulto() {
    return this.formulario.get('Bulto') as FormControl;
  }

  get bultoErrors() {
    if (this.bulto.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (this.bulto.hasError('maxlength')) {
      return 'La longitud máxima es de 3 números.';
    }
    if (this.bulto.hasError('pattern')) {
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
      return 'La longitud máxima es de 100 caracteres.';
    }   
    return '';
  }

 



  submit(formDirective) :void {
  
    //this.Cod_Accion            = 'I'
    this.Num_Auditoria_Detalle = 0;
    if(this.Titulo != undefined){
      this.Cod_Accion          = 'U';   
    }
    let valorSinMascara = this.formulario.get('Precinto')?.value.replace(/-_______/g, '');

    const formData = new FormData();
    formData.append('Accion', this.Cod_Accion);
    formData.append('Num_Auditoria_Detalle', this.data.Num_Auditoria_Detalle.toString());
    formData.append('Num_Auditoria', this.data.Num_Auditoria.toString());
    formData.append('Precinto', valorSinMascara);
    formData.append('Bulto', this.formulario.get('Bulto')?.value);
    formData.append('Guia', this.formulario.get('Guia')?.value); 
    formData.append('Cod_LinPro', this.data.Cod_LinPro);
    formData.append('Des_EstPro', this.data.Des_EstPro);
    formData.append('Cod_OrdPro', this.data.Cod_OrdPro);
    formData.append('Des_Present', this.data.Des_Present);
    formData.append('Des_Cliente', this.data.Des_Cliente);    
    formData.append('Can_Lote', this.data.Can_Lote.toString()); 
    formData.append('Nom_Auditor', this.data.Nom_Auditor); 
    
    this.auditoriaInspeccionCosturaService.DespacharProduccion(
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

  private _filterOperacionInspector(value: string): Inspector[] {
    this.formulario.controls['CodInspector'].setValue('')
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_operacionInspector.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }



  CambiarValorCodInspector(Cod_Auditor: string, Tip_Trabajador:string){   
    this.formulario.controls['CodInspector'].setValue(Tip_Trabajador+'-'+Cod_Auditor)
  }
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
