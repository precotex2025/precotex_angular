import { Component, OnInit, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService }  from "ngx-spinner";

import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';

interface data_det {
  Num_Auditoria?: number; 
  Cod_Auditor?: string; 
  Nom_Auditor?: string;
  Fecha_Auditoria?: string;
  Cod_EstCli?: string;
  Cod_TemCli?: string;
  Lote?: string;
  Tamano_Muestra?: number;
  Tip_Trabajador_Auditor?: string;
  Observacion?: string;
  Obs_Medida?: string;
  Nro_Defectos?: number;
  Flg_Status?: string;
  Cod_Usuario?: string; 
  Nom_Cliente?: string; 
  Des_EstCli?: string; 
  Nom_TemCli?: string; 
}

@Component({
  selector: 'app-dialog-vista-salida-acabado',
  templateUrl: './dialog-vista-salida-acabado.component.html',
  styleUrls: ['./dialog-vista-salida-acabado.component.scss']
})
export class DialogVistaSalidaAcabadoComponent implements OnInit {

  dataDefectos:Array<any> = [];
  dataOPs:Array<any> = [];

  constructor(
      private auditoriaAcabadosService: AuditoriaAcabadosService,
      private matSnackBar: MatSnackBar,
      private dialogRef: MatDialogRef<DialogVistaSalidaAcabadoComponent>,
      private SpinnerService: NgxSpinnerService,
      public dialog: MatDialog, 
      @Inject(MAT_DIALOG_DATA) public data: data_det, 
  ) { }

  ngOnInit(): void {
    this.listarDefectosSalidaAcabados()
    this.listarOPsSalidaAcabados()
  }

  closeModal() {
    this.dialogRef.close();
  }

  listarOPsSalidaAcabados(){
    let dataOrdPro:Array<any>;

    this.auditoriaAcabadosService.Mant_AuditoriaModuloSalidaAcabadoOp('L', 0, this.data.Num_Auditoria, '', this.data.Cod_EstCli.trim(), this.data.Cod_TemCli.trim(), '', '')
      .subscribe((result: any) => {
        if (result.length > 0){
          dataOrdPro = result;

          this.dataOPs = dataOrdPro.filter(d => d.Flg_Estado == "1");  
        } else {
          this.dataOPs = []
        }
        console.log(this.dataOPs)
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
     }));
  }

  listarDefectosSalidaAcabados(){
    this.auditoriaAcabadosService.Mant_AuditoriaModuloSalidaAcabadoDefecto("L", 0, this.data.Num_Auditoria, "", "0", "0")
      .subscribe((result: any) => {
        if (result.length > 0) {

          this.dataDefectos = result
        } else {
          this.dataDefectos = []
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }));
  }

}
