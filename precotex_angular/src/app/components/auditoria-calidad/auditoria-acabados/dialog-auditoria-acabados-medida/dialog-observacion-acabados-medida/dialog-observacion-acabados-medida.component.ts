import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaHojaMedidaService} from 'src/app/services/auditoria-hoja-medida.service'
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';



interface data{
  Cod_Hoja_Medida_Cab: number
  
}

@Component({
  selector: 'app-dialog-observacion-acabados-medida',
  templateUrl: './dialog-observacion-acabados-medida.component.html',
  styleUrls: ['./dialog-observacion-acabados-medida.component.scss']
})
export class DialogObservacionAcabadosMedidaComponent implements OnInit {
  
  Cod_Accion          = ''
  filterValue         = ''
  flg_reset_estilo    = false
  Cod_Cliente         = ''
  Cod_EstCli          = ''
  Cod_EstPro          = ''
  Cod_Version         = ''
  Cod_OrdPro          = ''
  Cod_ColCli          = ''
  Cod_TemCli          = ''	 
  Cod_Clientev2       = ''
  Cod_Hoja_Medida_Cab = 0
  Cod_LinPro          = ''
  Observacion         = ''
  Flg_Estado          = ''
  Cod_Supervisor      = ''
  columnDefinitions   = [];
  Cod_Auditor         = ''

  Fecha_Auditoria     = ''
  Fecha_Auditoria2    = ''



  formulario = this.formBuilder.group({
  Observacion:          [''],
  }) 


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, private auditoriaHojaMedidaService: AuditoriaHojaMedidaService
    , @Inject(MAT_DIALOG_DATA) public data: data
  ) {

    this.formulario = formBuilder.group({
      Observacion:  ['', Validators.required],
    });
  }



  ngOnInit(): void {
   this.Cod_Hoja_Medida_Cab  = this.data.Cod_Hoja_Medida_Cab
   this.traerObservacion()
  }


  traerObservacion(){
   
    this.Cod_Accion           = 'C'
    this.Cod_Hoja_Medida_Cab
    this.Cod_OrdPro           = ''
    this.Cod_ColCli           = ''
    this.Cod_Clientev2
    this.Cod_EstCli           = ''
    this.Cod_TemCli
    this.Cod_EstPro
    this.Cod_Version
    this.Cod_LinPro            = ''
    this.Cod_Supervisor        = ''
    this.Cod_Auditor           = ''
    this.Observacion
    this.Flg_Estado           = 'P'
    this.Fecha_Auditoria    
    this.Fecha_Auditoria2   
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaCabecera(
      this.Cod_Accion,         
      this.Cod_Hoja_Medida_Cab,
      this.Cod_OrdPro,
      this.Cod_ColCli,
      this.Cod_Clientev2,
      this.Cod_EstCli,
      this.Cod_TemCli,
      this.Cod_EstPro,
      this.Cod_Version,
      this.Cod_LinPro,
      this.Cod_Supervisor,
      this.Cod_Auditor,
      this.Observacion,
      this.Flg_Estado,
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2,
      0
      ).subscribe(
      (result: any) => {
       this.formulario.controls['Observacion'].setValue(result[0].Observacion)
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      
  }

  submit(formDirective) :void {
    this.Cod_Accion           = 'O'
    this.Cod_Hoja_Medida_Cab
    this.Cod_OrdPro           = ''
    this.Cod_ColCli           = ''
    this.Cod_Clientev2
    this.Cod_EstCli           = ''
    this.Cod_TemCli
    this.Cod_EstPro
    this.Cod_Version
    this.Cod_LinPro            = ''
    this.Cod_Supervisor        = ''
    this.Cod_Auditor           = ''
    this.Observacion           = this.formulario.get('Observacion')?.value 
    this.Flg_Estado            = 'P'
    this.Fecha_Auditoria    
    this.Fecha_Auditoria2   
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaCabecera(
      this.Cod_Accion,         
      this.Cod_Hoja_Medida_Cab,
      this.Cod_OrdPro,
      this.Cod_ColCli,
      this.Cod_Clientev2,
      this.Cod_EstCli,
      this.Cod_TemCli,
      this.Cod_EstPro,
      this.Cod_Version,
      this.Cod_LinPro,
      this.Cod_Supervisor,
      this.Cod_Auditor,
      this.Observacion,
      this.Flg_Estado,
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2,
      0
      ).subscribe(
      (result: any) => {
       if(result[0].Respuesta == 'OK'){
        this.matSnackBar.open('Proceso correcto..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }else{
        this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      } 
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      
    
    }
   
    

}
