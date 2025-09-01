import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { DatePipe } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";

import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';

interface data_det{
  Id_Auditoria?: number;
  Id_Auditoria_Op?: number;
  Fecha_Auditoria?: Date;
  Fecha_Programacion?: Date;
  Fec_Programacion?: string;
  Id_TipoAuditoria?: string;
  Cod_EstPro?: string;
  Cod_TemCli?: string;
  Cod_Auditor?: string;
  Observacion?: string;
  Fecha_Registro?: string;
  Cod_EstCli?: string;
  Des_Auditoria?: string;
  Nom_Auditor?: string;
  Id_Motivo?: string;
  Cod_OrdPro?: string;
  Cod_Present?: string;
  Des_Present?: string;
  Flg_Estado?: string;
  Nom_Cliente?: string;
  Cod_Cliente?: string;
  Cod_Usuario?: string;
}

interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

@Component({
  selector: 'app-dialog-programacion-auditoria-reprogama',
  templateUrl: './dialog-programacion-auditoria-reprogama.component.html',
  styleUrls: ['./dialog-programacion-auditoria-reprogama.component.scss']
})
export class DialogProgramacionAuditoriaReprogamaComponent implements OnInit {

  formulario = this.formBuilder.group({
    Id_Auditoria_Op: [''],
    Id_Auditoria: [''],
    Fecha_Programacion: ['', Validators.required],
    Id_TipoAuditoria: [''],
    Cod_Cliente: [''],
    Nom_Cliente: [{value: "", disabled: true}],
    Cod_EstCli: [{value: "", disabled: true}],
    Cod_TemCli: [{value: "", disabled: true}],
    Cod_EstPro: [''],
    Des_Present: [{value: "", disabled: true}],
    Observacion: [''],
    Cod_Auditor: [''],
    Nom_Auditor: ['', Validators.required],
    Cod_OrdPro: [{value: "", disabled: true}],
    Cod_Present: [{value: "", disabled: true}],
    Flg_Estado: [''],
    Id_Motivo: [''],
    Cod_Usuario: ['']
  });

  dataOperacionAuditor: Auditor[] = [];
  filtroOperacionAuditor: Observable<Auditor[]> | undefined;

  Fecha = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, 
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private datepipe: DatePipe,
    private spinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data_det,
    private dialogRef: MatDialogRef<DialogProgramacionAuditoriaReprogamaComponent>
  ) { }

  ngOnInit(): void {
    //console.log(this.data)
    this.formulario.reset();
    this.formulario.patchValue({
      Id_Auditoria: this.data.Id_Auditoria,
      Id_Auditoria_Op: this.data.Id_Auditoria_Op,
      Fecha_Programacion: this.data.Id_Auditoria != 0 ? new Date(this.data.Fec_Programacion) : this.Fecha, //.toDateString(),
      Id_TipoAuditoria: this.data.Id_TipoAuditoria,
      Nom_Cliente: this.data.Nom_Cliente,
      Cod_Cliente: this.data.Cod_Cliente,
      Cod_EstPro: this.data.Cod_EstPro,
      Cod_EstCli: this.data.Cod_EstCli,
      Cod_TemCli: this.data.Cod_TemCli,
      Cod_OrdPro: this.data.Cod_OrdPro,
      Cod_Present: this.data.Cod_Present,
      Des_Present: this.data.Des_Present,
      Flg_Estado: this.data.Flg_Estado,
      Id_Motivo: this.data.Id_Motivo,
      Observacion: this.data.Observacion,
      Cod_Auditor: this.data.Cod_Auditor,
      Cod_Usuario: this.data.Cod_Usuario,
      Nom_Auditor: this.data.Nom_Auditor
    });

    this.cargarOperacionAuditor();
  }

  onSubmit(formDirective) :void{
    const formData = new FormData();
    formData.append('Accion', "I");
    formData.append('Id_Auditoria', this.data.Id_Auditoria.toString());
    formData.append('Fecha_Programacion', this.Fecha.toLocaleDateString());
    //formData.append('Id_TipoAuditoria', this.data.Id_TipoAuditoria);
    //formData.append('Cod_EstPro', this.data.Cod_EstPro);
    formData.append('Cod_Cliente', this.data.Cod_Cliente);
    formData.append('Cod_TemCli', this.data.Cod_TemCli);
    formData.append('Cod_Auditor', this.formulario.get('Cod_Auditor')?.value);
    formData.append('Flg_KeyProg', '0');
    formData.append('Cod_OrdPro', this.formulario.get('Cod_OrdPro')?.value);
    //formData.append('Observacion', this.formulario.get('Observacion')?.value);
    formData.append('Fecha_Registro', '');
    formData.append('Fecha_Registro2', '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    this.spinnerService.show();
    this.auditoriaAcabadosService.MantenimientoProgramacionAuditoria(formData)
      .subscribe((res) => {
        
        if(res[0].Respuesta == "OK"){
          const formData = new FormData();
          formData.append('Accion', "I");
          formData.append('Id_Auditoria_Op', this.data.Id_Auditoria_Op.toString());
          formData.append('Id_Auditoria', res[0].Id_Auditoria.toString());
          formData.append('Fecha_Programacion', this.datepipe.transform(this.formulario.get('Fecha_Programacion')?.value, 'yyyy-MM-ddTHH:mm:ss'));
          formData.append('Fecha_Auditoria', '');
          formData.append('Fecha_Empaque', '');
          formData.append('Cod_EstCli', this.data.Cod_EstCli);
          formData.append('Cod_OrdPro', '');
          formData.append('Cod_Present', '');
          formData.append('Flg_Estado', '0');
          formData.append('Flg_Estado_2', '0');
          formData.append('Id_Motivo', '1');
          formData.append('Cod_Cliente', this.data.Cod_Cliente);
          formData.append('Cod_EstPro', '');
          formData.append('Cod_TemCli', this.data.Cod_TemCli);
          formData.append('Cod_Auditor', '');
          formData.append('Fecha_Registro', '');
          formData.append('Fecha_Registro2', '');
          formData.append('Cod_Usuario', GlobalVariable.vusu);

          this.auditoriaAcabadosService.MantenimientoProgramacionAuditoriaOp(formData)
            .subscribe((res) => {
              console.log(res)
          });  

          this.spinnerService.hide();
          this.matSnackBar.open("Registro Ok!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
        }
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
      }
    );
  }

  cargarOperacionAuditor(){
    this.dataOperacionAuditor = [];
      this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento('L', '', '', '', 0, '')
        .subscribe((result: any) => {
          this.dataOperacionAuditor = result;
          this.recargarOperacionAuditor();
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      );
  }

  recargarOperacionAuditor(){
    this.filtroOperacionAuditor = this.formulario.controls['Nom_Auditor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionAuditor(option) : this.dataOperacionAuditor.slice())),
    );
  }

  private _filterOperacionAuditor(value: string): Auditor[] {
    this.formulario.controls['Cod_Auditor'].setValue('')
    const filterValue = value.toLowerCase();

    return this.dataOperacionAuditor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }

  seleccionarAuditor(option: Auditor){
    this.formulario.controls['Cod_Auditor'].setValue(option.Tip_Trabajador.concat("-").concat(option.Cod_Auditor));
  }

}
