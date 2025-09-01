import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefectosAlmacenDerivadosService } from 'src/app/services/defectos-almacen-derivados.service';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { NgxSpinnerService }  from "ngx-spinner";

interface Temporada {
  Codigo: string;
  Descripcion: string;
  Stock: string
}
interface Color {
  Cod_ColCli: string;
  Nom_ColCli: string;
}

@Component({
  selector: 'app-vista-previa-checklist-defectos',
  templateUrl: './vista-previa-checklist-defectos.component.html',
  styleUrls: ['./vista-previa-checklist-defectos.component.scss']
})
export class VistaPreviaChecklistDefectosComponent implements OnInit {

  listar_operacionTemporada: Temporada[] = [];
  listar_operacionColor: Color[] = [];

  Op = ''
  Cod_TemCli = '';
  Cod_EstCli = '';
  sEstilo = '';
  Cod_Cliente = '';
  Tipo_Prenda = '';
  sTemporada = '';
  Temp = '';
  Num_Auditoria_Detalle = '';

  dataDefectos:Array<any> = [];
  dataIndicaciones:Array<any> = [];

  Num_Auditoria             = this.data.Num_Auditoria;
  Cod_Accion                = '';
  Num_Auditoria_Sub_Detalle = 0;
  Cod_Motivo                = '';
  Cantidad                  = 0;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, 
  private defectosAlmacenDerivadosService: DefectosAlmacenDerivadosService,
  private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
  private matSnackBar: MatSnackBar,
  private dialogRef: MatDialogRef<VistaPreviaChecklistDefectosComponent>,
  private SpinnerService: NgxSpinnerService,) { }

  ngOnInit(): void {
    console.log("data: ",this.data);
    this.BuscarPorOP();
    this.cargarObservaciones();
    //this.cargarIndicaciones();
  }


  BuscarPorOP() {
    this.Op = this.data.Cod_OrdPro;
    this.Num_Auditoria_Detalle = this.data.Num_Auditoria_Detalle;
    this.defectosAlmacenDerivadosService.Cf_Busca_OP_Cliente_Estilo_Temporada(this.Op).subscribe(
      (result: any) => {
        if (result.length > 0) {
          this.Cod_Cliente = result[0].COD_CLIENTE
          this.sEstilo = (result[0].COD_ESTCLI);
          this.Tipo_Prenda = result[0].TIPO_PRENDA;
          this.sTemporada = (result[0].COD_TEMCLI);
          this.CargarOperacionTemporada()
        } else {
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  /*************************************CARGAR SELECT TEMPORADA*********************************************** */


  CargarOperacionTemporada() {
    this.Cod_TemCli = ''
    this.Cod_EstCli = this.sEstilo;
    this.defectosAlmacenDerivadosService.Cf_Busca_TemporadaCliente(this.Cod_Cliente, this.Cod_EstCli).subscribe(
      (result: any) => {
        this.listar_operacionTemporada = result
        console.log(this.listar_operacionTemporada);
        this.listar_operacionTemporada.filter(item => {
          if(item.Codigo == this.sTemporada){
            this.Temp = item.Descripcion
          }
        })
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


   
  cargarObservaciones(){

    this.SpinnerService.show();
    this.Cod_Accion                 = 'L';
    this.Num_Auditoria_Sub_Detalle  = 0;
    this.Num_Auditoria_Detalle      = this.data.Num_Auditoria_Detalle;
    this.Cod_Motivo                 = '';
    this.Cantidad                   = 0;
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaChecklistDetDefectosService(
      this.Cod_Accion,
      this.Num_Auditoria_Sub_Detalle,
      parseInt(this.Num_Auditoria_Detalle),
      this.Cod_Motivo,
      this.Cantidad 
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
console.log('resultresult::',result);
          this.dataDefectos = result
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataDefectos= []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
/*
    const formData = new FormData();
    formData.append('Accion', 'O');
    formData.append('Num_Auditoria_Detalle', this.data.Num_Auditoria_Detalle);
    formData.append('Num_Auditoria', '');
    formData.append('Precinto', '');
    formData.append('Bulto', '');
    formData.append('Guia', ''); 
    formData.append('Cod_LinPro', '');
    formData.append('Des_EstPro', '');
    formData.append('Cod_OrdPro', '');
    formData.append('Des_Present', ''); 
    formData.append('Des_Cliente', ''); 
    

    this.auditoriaInspeccionCosturaService.cargarObservaciones(
      formData
    ).subscribe(
      (result: any) => {
        this.dataDefectos = result;
        console.log("dataDefectos: ", this.dataDefectos);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
 */
 
    }
   
  cargarIndicaciones(){
    const formData = new FormData();
    formData.append('Accion', 'I');
    formData.append('Num_Auditoria_Detalle', this.data.Num_Auditoria_Detalle);
    formData.append('Num_Auditoria', '');
    formData.append('Precinto', '');
    formData.append('Bulto', '');
    formData.append('Guia', ''); 

    this.auditoriaInspeccionCosturaService.cargarIndicadores(
      formData
    ).subscribe(
      (result: any) => {

        this.dataIndicaciones = result;
        console.log('Indicadores: ',this.dataIndicaciones);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
  closeModal() {
    this.dialogRef.close();
  }

}