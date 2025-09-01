import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from "@angular/common";
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';

import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';

interface data_det{
  Id_Auditoria?: number;
  Id_Auditoria_Op?: number;
  Fecha_Auditoria?: Date;
  Fecha_Programacion?: Date;
  Fecha_Empaque?: Date;
  Fec_Programacion?: Date;
  Fec_Auditoria?: Date;
  Id_Motivo?: string;
  Cod_OrdPro?: string;
  Cod_Present?: string;
  Cod_EstPro?: string;
  Cod_TemCli?: string;
  Cod_Auditor?: string;
  Flg_Estado?: string;
  Flg_Estado_2?: string;
  Des_Motivo?: string;
  Cod_Usuario?: string;
  Accion?: string;
}

@Component({
  selector: 'app-dialog-programacion-auditoria-motivo',
  templateUrl: './dialog-programacion-auditoria-motivo.component.html',
  styleUrls: ['./dialog-programacion-auditoria-motivo.component.scss']
})
export class DialogProgramacionAuditoriaMotivoComponent implements OnInit {

  formulario = this.formBuilder.group({
    Id_Auditoria_Op: [''],
    Id_Auditoria: [''],
    Fecha_Auditoria: [''],
    Fecha_Empaque: [''],
    Cod_OrdPro: [''],
    Cod_Present: [''],
    Flg_Estado: ['', Validators.required],
    Id_Motivo: ['', Validators.required],
    Des_Motivo: [''],
    Cod_EstPro: [''],
    Cod_TemCli: [''],
    Cod_Auditor: [''],
    Cod_Usuario: ['']
  });

  dataTipoAuditoria: any[] = []
  ld_Fecha = new Date()

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private datepipe: DatePipe, 
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    @Inject(MAT_DIALOG_DATA) public data: data_det,
    private dialogRef: MatDialogRef<DialogProgramacionAuditoriaMotivoComponent>
  ) {}

  ngOnInit(): void {
    this.formulario.reset();
    this.formulario.patchValue({
      Id_Auditoria_Op: this.data.Id_Auditoria_Op,
      Id_Auditoria: this.data.Id_Auditoria,
      Fecha_Auditoria: this.ld_Fecha,
      Fecha_Programacion: this.data.Fecha_Programacion,
      Fecha_Empaque: this.data.Fecha_Empaque,
      Cod_OrdPro: this.data.Cod_OrdPro,
      Cod_Present: this.data.Cod_Present,
      Flg_Estado: this.data.Flg_Estado,
      Flg_Estado_2: this.data.Flg_Estado_2,
      Id_Motivo: this.data.Id_Motivo,
      Des_Motivo: this.data.Des_Motivo,
      Cod_EstPro: this.data.Cod_EstPro,
      Cod_TemCli: this.data.Cod_TemCli,
      Cod_Auditor: this.data.Cod_Auditor,
      Cod_Usuario: this.data.Cod_Usuario,
    });

    this.cargarTipoAuditoria('M')
  }

  onSubmit(formDirective) :void{
    const formData = new FormData();
    formData.append('Accion', "U");
    formData.append('Id_Auditoria_Op', this.data.Id_Auditoria_Op.toString());
    formData.append('Id_Auditoria', this.data.Id_Auditoria.toString());
    formData.append('Fecha_Programacion', this.data.Fec_Programacion.toLocaleString());
    formData.append('Cod_EstCli', this.data.Cod_OrdPro);
    formData.append('Cod_OrdPro', this.data.Cod_OrdPro);
    formData.append('Cod_Present', this.data.Cod_Present);
    formData.append('Cod_Cliente', '');
    formData.append('Cod_EstPro', '');
    formData.append('Cod_TemCli', '');
    formData.append('Cod_Auditor', '');
    formData.append('Fecha_Registro', '');
    formData.append('Fecha_Registro2', '');
    formData.append('Cod_Usuario', this.data.Cod_Usuario);
    switch (this.data.Accion) {
      case '1':  // Califica auditoria
        formData.append('Flg_Estado', this.formulario.get('Flg_Estado')?.value);
        formData.append('Flg_Estado_2', '0');
        formData.append('Fecha_Auditoria', this.datepipe.transform(this.ld_Fecha, 'yyyy-MM-ddTHH:mm:ss'));
        formData.append('Fecha_Empaque', '');
        formData.append('Id_Motivo', '1');
        break;
      case '2':  // Califica Empaque
        formData.append('Flg_Estado', this.data.Flg_Estado);
        formData.append('Flg_Estado_2', this.formulario.get('Flg_Estado')?.value);
        formData.append('Fecha_Auditoria', this.data.Fec_Auditoria.toLocaleString());
        formData.append('Fecha_Empaque', this.datepipe.transform(this.ld_Fecha, 'yyyy-MM-ddTHH:mm:ss'));
        formData.append('Id_Motivo', '1');
        break;
      case '3':  // Motivo
        formData.append('Flg_Estado', '0');
        formData.append('Flg_Estado_2', '0');
        formData.append('Fecha_Auditoria', '');
        formData.append('Fecha_Empaque', '');
        formData.append('Id_Motivo', this.formulario.get('Id_Motivo')?.value);
        break;      
    }

    this.auditoriaAcabadosService.MantenimientoProgramacionAuditoriaOp(formData)
    .subscribe((res) => {
      console.log(res)
    });  

  }

  cargarTipoAuditoria(tipo: string){
    this.auditoriaAcabadosService.ListaTipoAuditoria(tipo)
      .subscribe((result: any) => {
        this.dataTipoAuditoria = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

}
