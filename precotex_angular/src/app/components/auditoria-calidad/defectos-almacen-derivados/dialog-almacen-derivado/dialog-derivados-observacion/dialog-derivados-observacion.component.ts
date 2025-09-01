import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { DefectosAlmacenDerivadosService } from 'src/app/services/defectos-almacen-derivados.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelect } from '@angular/material/select';


interface data{
  Num_Auditoria: number
  
} 


@Component({
  selector: 'app-dialog-derivados-observacion',
  templateUrl: './dialog-derivados-observacion.component.html',
  styleUrls: ['./dialog-derivados-observacion.component.scss']
})
export class DialogDerivadosObservacionComponent implements OnInit {

 
  Cod_Accion    = ''
  Num_Auditoria = 0
  Observacion   = ''


  formulario = this.formBuilder.group({
  Observacion:          [''],
  }) 


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, private defectosAlmacenDerivadosService: DefectosAlmacenDerivadosService
    , @Inject(MAT_DIALOG_DATA) public data: data
  ) {

    this.formulario = formBuilder.group({
      Observacion:          ['', Validators.required],
    });
  }



  ngOnInit(): void {
   this.Num_Auditoria  = this.data.Num_Auditoria
   this.traerObservacion()
  }


traerObservacion(){
  this.Cod_Accion  = 'L' 
  this.Observacion = ''
  
  this.defectosAlmacenDerivadosService.ActualizarDerivadoObservacion(
    this.Cod_Accion,
    this.Num_Auditoria,
    this.Observacion,
   ).subscribe(
      (result: any) => {
        
        
        this.formulario.controls['Observacion'].setValue(result[0].Glosa)
        
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
    )
}

  submit(formDirective) :void {

      this.Cod_Accion = 'U' 
      this.Observacion      = this.formulario.get('Observacion')?.value
      
      this.defectosAlmacenDerivadosService.ActualizarDerivadoObservacion(
        this.Cod_Accion,
        this.Num_Auditoria,
        this.Observacion,
       ).subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
         
            this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
              
            }
            else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
        )
    }
   
    
    


  

}
