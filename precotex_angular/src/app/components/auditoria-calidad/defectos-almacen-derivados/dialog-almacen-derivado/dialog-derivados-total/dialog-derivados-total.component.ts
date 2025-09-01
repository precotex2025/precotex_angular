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
  Total        : number
}


@Component({
  selector: 'app-dialog-derivados-total',
  templateUrl: './dialog-derivados-total.component.html',
  styleUrls: ['./dialog-derivados-total.component.scss']
})
export class DialogDerivadosTotalComponent implements OnInit {

  
  Cod_Accion    = ''
  Num_Auditoria = 0
  Total         = 0


  formulario = this.formBuilder.group({
    Total:          [''],
  }) 


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, private defectosAlmacenDerivadosService: DefectosAlmacenDerivadosService
    , @Inject(MAT_DIALOG_DATA) public data: data
  ) {

    this.formulario = formBuilder.group({
      Total:          ['', Validators.required],
    });
  }



  ngOnInit(): void {
   this.Num_Auditoria  = this.data.Num_Auditoria
   this.Total  = this.data.Total

   if(this.Total != 0){
      this.formulario.controls['Total'].setValue(this.Total)
   }

  }


  submit(formDirective) :void {

      this.Cod_Accion = 'U' 
      this.Total      = this.formulario.get('Total')?.value
        

      this.defectosAlmacenDerivadosService.ActualizarDerivadoCantidadTotal(
        this.Cod_Accion,
        this.Num_Auditoria,
        this.Total,
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
