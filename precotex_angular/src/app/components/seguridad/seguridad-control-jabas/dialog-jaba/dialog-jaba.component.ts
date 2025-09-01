import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import {  MAT_DIALOG_DATA} from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { GlobalVariable } from '../../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlJabaService } from '../../../../services/seguridad-control-jaba.service';


import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';


interface Listar_Registro_Control_Jaba{
  Cod_Registro: number;
  Fec_Registro: Date;
  Num_Planta: number; 
  Cod_Accion: string;
  Num_Guia: string; 
  Num_Planta_Destino: number;
  Num_Planta_Origen:  number;
  Num_Cantidad: number;
  Glosa: string;
  Flg_Estado: number;
  Cod_Proveedor: string;
}
 

@Component({
  selector: 'app-dialog-jaba',
  templateUrl: './dialog-jaba.component.html',
  styleUrls: ['./dialog-jaba.component.scss']
})

export class DialogJabaComponent implements OnInit {

  nNum_Planta = GlobalVariable.num_planta;
  listar_Registro_Control_Jaba: Listar_Registro_Control_Jaba[] = [];
  

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,private segurdadControlJabaService: SeguridadControlJabaService
    ,@Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {

    this.ListarPendientes()
  }


  ListarPendientes(){
    this.segurdadControlJabaService.VerificarGuiasPendientesControlJabas(this.nNum_Planta, this.data.accion).subscribe(
      (resp: any) => {
        this.listar_Registro_Control_Jaba = resp
        console.log(this.listar_Registro_Control_Jaba)
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  
  }
   

}


