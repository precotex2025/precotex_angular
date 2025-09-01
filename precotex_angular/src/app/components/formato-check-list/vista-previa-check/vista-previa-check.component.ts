import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefectosAlmacenDerivadosService } from 'src/app/services/defectos-almacen-derivados.service';

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
  selector: 'app-vista-previa-check',
  templateUrl: './vista-previa-check.component.html',
  styleUrls: ['./vista-previa-check.component.scss']
})
export class VistaPreviaCheckComponent implements OnInit {

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

  dataDefectos:Array<any> = [];
  dataIndicaciones:Array<any> = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private defectosAlmacenDerivadosService: DefectosAlmacenDerivadosService,
  private matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.BuscarPorOP();
    this.cargarObservaciones();
    this.cargarIndicaciones();
  }


  BuscarPorOP() {
    this.Op = this.data.Cod_OrdPro;
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
    this.defectosAlmacenDerivadosService.CF_CHECKLIST_LISTAR_DETALLE('O', this.data.Id_CheckList).subscribe(
      (result: any) => {
        this.dataDefectos = result;
        console.log(this.dataDefectos);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  cargarIndicaciones(){
    this.defectosAlmacenDerivadosService.CF_CHECKLIST_LISTAR_DETALLE('I', this.data.Id_CheckList).subscribe(
      (result: any) => {

        this.dataIndicaciones = result;
        console.log(this.dataIndicaciones);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

}
