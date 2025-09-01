import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import {  MAT_DIALOG_DATA} from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { GlobalVariable } from '../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaLineaCosturaService } from 'src/app/services/auditoria-linea-costura.service';

import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-dialog-modificar',
  templateUrl: './dialog-modificar.component.html',
  styleUrls: ['./dialog-modificar.component.scss']
})
export class DialogModificarComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,private auditoriaLineaCosturaService: AuditoriaLineaCosturaService
    ,@Inject(MAT_DIALOG_DATA) public data: any
    ) { }
  ngOnInit(): void {
  }


}
