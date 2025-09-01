import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { GlobalVariable } from '../../../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';


interface data{

}




@Component({
  selector: 'app-dialog-cantidad-registrar-detalle',
  templateUrl: './dialog-cantidad-registrar-detalle.component.html',
  styleUrls: ['./dialog-cantidad-registrar-detalle.component.scss']
})
export class DialogCantidadRegistrarDetalleComponent implements OnInit {

 

  Cantidad  = 0



  formulario = this.formBuilder.group({
    Cantidad: ['']
  }) 
 
  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
              @Inject(MAT_DIALOG_DATA) public data: data) 
  {

    this.formulario = formBuilder.group({
      Cantidad:  ['', Validators.required],
    });

  }

  ngOnInit(): void {    


  }


  submit(formDirective) :void {

   this.Cantidad = this.formulario.get('Cantidad')?.value
   GlobalVariable.Cant_PrendasG = this.Cantidad 
  }

}
