import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import {  MAT_DIALOG_DATA} from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { GlobalVariable } from '../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaLineaCosturaService } from 'src/app/services/auditoria-linea-costura.service';

import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-dialog-eliminar',
  templateUrl: './dialog-eliminar.component.html',
  styleUrls: ['./dialog-eliminar.component.scss']
})
export class DialogEliminarComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,private auditoriaLineaCosturaService: AuditoriaLineaCosturaService
    ,@Inject(MAT_DIALOG_DATA) public data: any
    ) { }
  ngOnInit(): void {
  }


  /*eliminarAuditoria(){
    console.log(this.data.nNum_Auditoria);
  }*/

}
