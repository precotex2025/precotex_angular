import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';


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





@Component({
  selector: 'app-dialog-registrar-cabecera-jaba',
  templateUrl: './dialog-registrar-cabecera-jaba.component.html',
  styleUrls: ['./dialog-registrar-cabecera-jaba.component.scss']
})
export class DialogRegistrarCabeceraJabaComponent implements OnInit {
 
  
  // nuevas variables
  Cod_Accion        =   ""
  InputFechaDesHabilitado = true	 
  Titulo            =   ''

  myControl = new FormControl();
  Fecha = new FormControl(new Date())

  formulario = this.formBuilder.group({
    Linea:            [''],
    Observacion:      [''],
    Fecha_Registro:   ['']
  }) 
 
  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
              @Inject(MAT_DIALOG_DATA) public data: data) 
  {

    this.formulario = formBuilder.group({
      Linea:            ['', Validators.required],
      Observacion:      [''],
      Fecha_Registro:   ['']
        
    });

  }

  ngOnInit(): void {    


  }


/* --------------- REGISTRAR CABECERA ------------------------------------------ */

  submit(formDirective) :void {

   
    
  }




  

}
