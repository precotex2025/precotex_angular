import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';
import { DialogCantidadDefectosCajasComponent } from '../dialog-cantidad-defectos-cajas/dialog-cantidad-defectos-cajas.component';

interface data_det {
  Num_Auditoria?: number; 
  Num_Caja?: number; 
  Cod_Auditor?: string; 
  Nom_Auditor?: string;
  Fec_Ini_Auditoria?: string;
  Fec_Fin_Auditoria?: string;
  Num_Vez?: number;
  Cod_Supervisor?: string;
  Flg_Estado?: string;
  Num_Packing?: number;
  Cod_Modulo?: string;
  Cod_Cliente?: string;
  Des_Modulo?: string;
  Des_Cliente?: string;
  Des_Destino?: string;
  Cod_Usuario?: string;
}

interface defecto {
  Num_Auditoria_Detalle?: number; 
  Cod_Motivo?: string;
  Descripcion?: string;
  Cod_Abr?: string;
  Cantidad?: number;
  Defecto?: string;
}

@Component({
  selector: 'app-dialog-defectos-empaque-cajas',
  templateUrl: './dialog-defectos-empaque-cajas.component.html',
  styleUrls: ['./dialog-defectos-empaque-cajas.component.scss']
})
export class DialogDefectosEmpaqueCajasComponent implements OnInit {

  displayedColumns: string[] = ['Cod_Motivo','Descripcion','Suma','Resta','Cantidad'];

  dataSource: MatTableDataSource<defecto>;
  @ViewChild(MatSort) sort!: MatSort;
  columnsToDisplay: string[] = this.displayedColumns.slice();

  lc_Estado: string = '';
  //ld_Fecha = new Date();

  formulario = this.formBuilder.group({
    Num_Auditoria: [0],
    Flg_Estado: ['']
  })

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, 
    private spinnerService: NgxSpinnerService,
    private auditoriaAcabadosService: AuditoriaAcabadosService,   
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: data_det,
    private dialogRef: MatDialogRef<DialogDefectosEmpaqueCajasComponent>
  ) { }

  ngOnInit(): void {
    this.lc_Estado = this.data.Flg_Estado;
    this.onCargarDefectos(this.data.Num_Auditoria);
  }

  onCargarDefectos(numAuditoria: number){

    this.auditoriaAcabadosService.Mant_AuditoriaEmpaqueCajasDetalle('L', 0, numAuditoria, '', 0)
      .subscribe((response: any) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.sort = this.sort;
      });

  }
  
  onGrabarAuditoria(flgEstado: string){
    let lc_accion: string = this.data.Num_Auditoria == 0 ? "I" : "U"
    let ld_FechaFin = new Date();

    this.spinnerService.show();
    this.auditoriaAcabadosService.Mant_AuditoriaEmpaqueCajas(
      lc_accion, 
      this.data.Num_Auditoria, 
      this.data.Num_Caja, 
      0,
      this.data.Cod_Auditor, 
      this.data.Fec_Ini_Auditoria, 
      ld_FechaFin.toUTCString(), 
      this.data.Num_Vez, 
      '', flgEstado)
      .subscribe((res) => {
        if(res[0].Respuesta == "OK"){
          this.formulario.patchValue({Num_Auditoria: res[0].Num_Auditoria, Flg_Estado: flgEstado});

          this.dataSource.data.filter(d => d.Cantidad > 0).forEach(element => {
            lc_accion = element.Num_Auditoria_Detalle ? "U" : "I";

            this.auditoriaAcabadosService.Mant_AuditoriaEmpaqueCajasDetalle(
              lc_accion, 
              element.Num_Auditoria_Detalle, 
              res[0].Num_Auditoria,
              element.Cod_Motivo, 
              element.Cantidad)
              .subscribe((res) => {
                //console.log(res)
              });
          });

          this.spinnerService.hide();
          this.matSnackBar.open("Registro Ok!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
        }
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
      });

  }

  onTerminarAuditoria(){
    if(this.dataSource.data.filter(d => d.Cantidad > 0 && d.Defecto == '1').length > 0)
      this.onGrabarAuditoria('R')
    else
      this.onGrabarAuditoria('A')
  }

  onSumaUnidad(defecto: defecto){
    defecto.Cantidad++;
  }

  onRestaUnidad(defecto: defecto){
    if(defecto.Cantidad > 0)
      defecto.Cantidad--;
  }

  onRegistrarCantidad(defecto: defecto){
    let data: defecto = {Cantidad: defecto.Cantidad};
    
    let dialogRef = this.dialog.open(DialogCantidadDefectosCajasComponent, {
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result || result == 0)
        defecto.Cantidad = result;
    });
    
  }

}
