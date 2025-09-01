import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MantenimientoHoraService } from 'src/app/services/mantenimiento-hora.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data{
  Fecha:    number,
  Num_Liquidacion:   string, 
  area_liquida:   string,
  IdCliente:      string, 
  Cliente:  string, 
  resp_liquid:       string, 
  linea_liquida: string,
  idliquida: string,
  idplanta: string,
  IdArea: string
} 
 

@Component({
  selector: 'app-dialog-cabecera-hora',
  templateUrl: 'dialog-cabecera-hora.component.html',
  styleUrls: ['dialog-cabecera-hora.component.scss']
})
export class DialogCabeceraHoraComponent implements OnInit {
  num_guiaMascara = [/[0-2]/, /\d/,':',/[0-5]/, /\d/]; 
                   
  Opcion        =   "";
  Id_Liquidacion = "";
  Fecha =   "";
  Area =   "";
  Linea =   "";
  IdCliente =   "";
  Cliente =   "";
  Usuario =   "";
  NombreUsuario =   "";    
  Planta =   "";   
 
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


  formulario = this.formBuilder.group({
    
  }) 

  listar_lineas = [];
  listar_Areas = [];
 
  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar,               
              @Inject(MAT_DIALOG_DATA) public data: data,
              private mantenimientoHoraService: MantenimientoHoraService,
            ) 
  {
 
   
    this.formulario = formBuilder.group({     
      Area:        ['', Validators.required],
      Hora:      ['', Validators.required],
      Motivo:      ['', [Validators.required,
                  Validators.maxLength(150),
                  Validators.minLength(10)]] ,
      Usuario: ['']    
    });


  }
 

    
  ngOnInit(): void {
  this.BuscarArea();    
  this.formulario.controls['Area'].setValue(this.data.IdArea);
  this.formulario.controls['Hora'].setValue('09:00');
 
  }

   
  BuscarArea() {
    this.mantenimientoHoraService.BuscarAreaService().subscribe(
      (result: any) => {
    
        this.listar_Areas = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }
 

  get motivo() {
    return this.formulario.get('Motivo') as FormControl;
  }

  get motivoErrors() {
    if (this.motivo.hasError('maxlength')) {
      return 'La longitud máxima es de 150 caracteres.';
    }
    if (this.motivo.hasError('minlength')) {
      return 'La longitud mínima es de 10 caracteres.';
    }   
    return '';
  }

   
  submit(formDirective) :void {
   
    this.Opcion         = 'I'
   
    this.Id_Liquidacion      = '0'
    if(this.Titulo != undefined){
      this.Opcion        = 'A'
   
    }
    
    const formData = new FormData();
    formData.append('Area', this.formulario.get('Area')?.value);
    formData.append('Hora', this.formulario.get('Hora')?.value);
    formData.append('Motivo', this.formulario.get('Motivo')?.value);
    formData.append('Usuario', GlobalVariable.vusu); 
  
    this.mantenimientoHoraService.MantenimientoHoraService(
      formData
      ).subscribe(
          (result: any) => {

           if(result.data[0].Respuesta == 'OK'){
        
              if(this.Titulo == ''){
                this.limpiar()
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
 
  limpiar(){

    this.formulario.controls['Area'].setValue('');
    this.formulario.controls['Hora'].setValue('');
    this.formulario.controls['Motivo'].setValue('');
    this.formulario.controls['Usuario'].setValue(''); 
  }
 

 
}

