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
  Num_Auditoria:  number,
  Num_Auditoria_Detalle:  number ,
  Medidas: string,
  Muestra_Fisica: string,
  Checklist: string
} 

@Component({
  selector: 'app-dialog-registrar-datos-ingreso',
  templateUrl: './dialog-registrar-datos-ingreso.component.html',
  styleUrls: ['./dialog-registrar-datos-ingreso.component.scss']
})
export class DialogRegistrarDatosIngresoComponent implements OnInit {   

  Cod_Accion= '';	               
  Titulo= '';	 
  Num_Auditoria = this.data.Num_Auditoria;
  Num_Auditoria_Detalle = this.data.Num_Auditoria_Detalle;
  CheckMuestra = 0;
  CheckChecklist = 0;

  myControl = new FormControl();
  Fecha = new FormControl(new Date())

  formulario = this.formBuilder.group({
    Muestra:          [''],
    Medidas:          [''],
    Checklist:          ['']
  }) 

  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
              private SpinnerService: NgxSpinnerService,
              @Inject(MAT_DIALOG_DATA) public data: data) 
  {

    this.formulario = formBuilder.group({     
      Muestra:          ['',Validators.required],
      Medidas:          ['',Validators.required],
      Checklist:          ['',Validators.required]
    });

  }

  ngOnInit(): void {
  console.log('this.data:::: ',this.data);
 
    this.Titulo    = this.data.Num_Auditoria_Detalle.toString();
   if(this.Titulo != undefined){
    this.formulario.controls['Medidas'].setValue(this.data.Medidas);   
 
    if(Number(this.data.Muestra_Fisica)===1){
      this.formulario.get('Muestra')?.setValue('SI');
    }else{
      this.formulario.get('Muestra')?.setValue('NO');
    }

    if(Number(this.data.Checklist)===1){    
      this.formulario.get('Checklist')?.setValue('SI');
    }else{   
      this.formulario.get('Checklist')?.setValue('NO');
     }
      

   }
  
  }
/*
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
*/ 

  submit(formDirective) :void {
  
    //this.Cod_Accion            = 'I' 
    if(this.Titulo != undefined){
      this.Cod_Accion          = 'U';   
    }
   
    if(this.formulario.get('Muestra')?.value=='SI'){
      this.CheckMuestra=1;
    }
    if(this.formulario.get('Checklist')?.value=='SI'){
      this.CheckChecklist=1;
    }
    const formData = new FormData();
    formData.append('Accion', 'O');
    formData.append('Num_Auditoria_Detalle',this.data.Num_Auditoria_Detalle.toString());
    formData.append('Num_Auditoria', this.data.Num_Auditoria.toString());
    formData.append('Cod_Inspector', '' ); 		
    formData.append('Cod_OrdPro', '' ); 			
    formData.append('Cod_Cliente', '' );		
    formData.append('Cod_EstCli', '' ); 			
    formData.append('Cod_Present', '' ); 		
    formData.append('Can_Lote', '0' ); 			
    formData.append('Can_Muestra', '0' ); 		
    formData.append('Observacion', '' ); 		
    formData.append('Flg_Status', '0' ); 			
    formData.append('Cod_Usuario', '0' ); 		
    formData.append('Flg_Reproceso', '' ); 		
    formData.append('Flg_Reproceso_Num', '0' ); 	
    formData.append('Co_CodOrdPro', '' ); 		
    formData.append('Num_Paquete', '' ); 		
    formData.append('Cod_OrdCor', '0' ); 	
    formData.append('Medidas', this.formulario.get('Medidas')?.value); 
    formData.append('Muestra', this.CheckMuestra.toString() );
    formData.append('Checklist', this.CheckChecklist.toString());     
 
    
    this.auditoriaInspeccionCosturaService.ActualizarChecklistCosturaDetalle(
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

    /*this.formulario.controls['Vehiculo'].setValue('')*/
    
  }

 
  
 
 
 


   


   

     


}
