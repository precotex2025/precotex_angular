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



@Component({
  selector: 'app-dialog-detalle-externo-mostrar-imagenes',
  templateUrl: './dialog-detalle-externo-mostrar-imagenes.component.html',
  styleUrls: ['./dialog-detalle-externo-mostrar-imagenes.component.scss']
})
export class DialogDetalleExternoMostrarImagenesComponent implements OnInit {

  formulario = this.formBuilder.group({
    Descripcion:     [''],
  }) 

  constructor(private formBuilder: FormBuilder, private matSnackBar: MatSnackBar, private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService, private SpinnerService: NgxSpinnerService){
      
    this.formulario = formBuilder.group({
        Descripcion:              ['', Validators.required]
      });

}

 

  ngOnInit(): void { 
    //this.CargarOperacionConductor()
    console.log('Dialog mostrar imagenes open')
    
  }

  submit(formDirective) :void {
    console.log('enviado')
  }



}

 