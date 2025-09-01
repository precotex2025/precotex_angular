import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatDialogRef } from '@angular/material/dialog';
import * as _moment from 'moment';

interface data_op {
  Cod_EstCli?: string;
  Fecha_Programacion?: string;
  fechaMin?: Date;
}

@Component({
  selector: 'app-dialog-programacion-auditoria-fecha',
  templateUrl: './dialog-programacion-auditoria-fecha.component.html',
  styleUrls: ['./dialog-programacion-auditoria-fecha.component.scss']
})
export class DialogProgramacionAuditoriaFechaComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: data_op,
    private dialogRef: MatDialogRef<DialogProgramacionAuditoriaFechaComponent>
  ) { }

  ngOnInit(): void {
  
  }

  onSubmit(formDirective) :void{

  }

}
