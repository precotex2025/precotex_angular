import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import {  MAT_DIALOG_DATA} from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { GlobalVariable } from '../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dialog-confirmacion-estampado',
  templateUrl: './dialog-confirmacion-estampado.component.html',
  styleUrls: ['./dialog-confirmacion-estampado.component.scss']
})
export class DialogConfirmacionEstampadoComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,@Inject(MAT_DIALOG_DATA) public data: any
    ) { }
  ngOnInit(): void {
  }


}
