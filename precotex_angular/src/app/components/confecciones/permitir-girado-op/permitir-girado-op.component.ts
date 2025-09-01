import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { DespachoOpIncompletaService} from 'src/app/services/despacho-op-incompleta.service'
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";

import { ExceljsService } from 'src/app/services/exceljs.service';
import {SelectionModel} from '@angular/cdk/collections';
import { DialogRegistrarGiradoOpComponent } from './dialog-registrar-girado-op/dialog-registrar-girado-op.component';

interface data_det {
  NUM_GRUPO:                number,
  ESTCLI:                   string,
  COD_ORDPRO:               string,
  COD_PRESENT:              number,
  DES_PRESENT:              string,
  PRIMER_MODOPROCESO:       string,
  COD_ORDTRA:               string,
  TELA:                     string,
  COMB:                     string,
  COD_TALLA:                string,
  KGS_PROGRAMADA_TEX:       number,
  KGS_PROGR:                number,
  KGS_CRUDO:                number,
  KGS_TENIDO:               number,
  OBSERVACION:              string,
  STATUS_PARTIDA:           string,
  FLG_APROBADO:             string,
  NOM_MOTIVO:               string,
  COD_USUARIO_SOLICITUD:    string,
  FEC_REGISTRO_SOLICITUD:   string,
  COD_USUARIO_APROBACION:   string,
  FEC_REGISTRO_APROBACION:  string
}




@Component({
  selector: 'app-permitir-girado-op',
  templateUrl: './permitir-girado-op.component.html',
  styleUrls: ['./permitir-girado-op.component.scss']
})
export class PermitirGiradoOpComponent implements OnInit {


  // public data_det = [{
  //   NUM_GRUPO:                0,
  //   ESTCLI:                   "",
  //   COD_ORDPRO:               "",
  //   COD_PRESENT:              0,
  //   DES_PRESENT:              "",
  //   PRIMER_MODOPROCESO:       "",
  //   COD_ORDTRA:               "",
  //   TELA:                     "",
  //   COMB:                     "",
  //   COD_TALLA:                "",
  //   KGS_PROGRAMADA_TEX:       0,
  //   KGS_PROGR:                0,
  //   KGS_CRUDO:                0,
  //   KGS_TENIDO:               0,
  //   OBSERVACION:              "",
  //   STATUS_PARTIDA:           "",
  //   FLG_APROBADO:             "",
  //   NOM_MOTIVO:               "",
  //   COD_USUARIO_SOLICITUD:    "",
  //   FEC_REGISTRO_SOLICITUD:   "",
  //   COD_USUARIO_APROBACION:   "",
  //   FEC_REGISTRO_APROBACION:  ""
  // }]




  Cod_Accion                = ''
  Num_Grupo                 = 0
  Cod_OrdPro                = ""
  Cod_Present               = 0
  Des_Present               = ""
  Flg_Aprobado              = ""
  Nom_Motivo                = ""
  Cod_Usuario               = ""
  Fec_Creacion              = ""
  Cod_Usuario_Aprobacion    = ""
  Fec_Creacion_Aprobacion   = ""
  Id_Motivo                 = 0
  Fec_Inicio                = ''
  Fec_Fin                   = ''
  dataForExcel              = []
  Cod_OrdTra                = ""
  estado = "PENDIENTE";
  partida = "";

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    Cod_OrdPro: [''],
    estado: ['P'],
    partida: [''],
  })


  estados = [
    {
      id: 'P',
      estado: 'PENDIENTE'
    },
    {
      id: 'A',
      estado: 'APROBADO'
    }
  ];

  dataSource: MatTableDataSource<data_det>;
  displayedColumns_cab: string[] = ['NUM_GRUPO','ESTCLI','COD_ORDPRO','COD_PRESENT','DES_PRESENT','PRIMER_MODOPROCESO','COD_ORDTRA', 'TELA','COMB','COD_TALLA','KGS_PROGRAMADA_TEX','KGS_TENIDO','KGS_PROGR','KGS_CRUDO','OBSERVACION','STATUS_PARTIDA','FLG_APROBADO','NOM_MOTIVO','COD_USUARIO_SOLICITUD','FEC_REGISTRO_SOLICITUD','COD_USUARIO_APROBACION','FEC_REGISTRO_APROBACION','ACCIONES']

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private despachoOpIncompletaService: DespachoOpIncompletaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private exceljsService:ExceljsService) { this.dataSource = new MatTableDataSource(); }



  ngOnInit(): void {
      this.listarCabecera()
    }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

  generateExcel(){
    this.SpinnerService.show();
    this.Cod_Accion           = 'V'
    this.Num_Grupo            = 0
    this.Cod_OrdPro           = this.formulario.get('Cod_OrdPro')?.value
    this.Cod_Present          = 0
    this.Cod_OrdTra           = this.formulario.get('partida')?.value;
    this.Id_Motivo            = 0
    this.Fec_Inicio     = this.range.get('start')?.value
    this.Fec_Fin        = this.range.get('end')?.value
    this.estado = this.formulario.get('estado')?.value;
    this.despachoOpIncompletaService.Ti_Man_Aprobacion_Despacho_Cod_OrdPro_V2(
      this.Cod_Accion,
      this.Num_Grupo,
      this.Cod_OrdPro,
      this.Cod_Present,
      this.Cod_OrdTra,
      this.Id_Motivo,
      this.Fec_Inicio,
      this.Fec_Fin,
      this.estado
      ).subscribe(
        (result: any) => {
        if(result[0].Respuesta){
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
          this.SpinnerService.hide();

        }else{
          this.dataForExcel = [];
          result.forEach((row: any) => {
            this.dataForExcel.push(Object.values(row))
          })

          let reportData = {
            title: 'REPORTE PERMITIR GIRADO OP',
            data: this.dataForExcel,
            headers: Object.keys(result[0])
          }

          this.exceljsService.exportExcel(reportData);
          this.dataForExcel = []
          this.SpinnerService.hide();
        }

        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))


  }

  listarCabecera(){
    this.SpinnerService.show();
    this.Cod_Accion           = 'V'
    this.Num_Grupo            = 0
    this.Cod_OrdPro           = this.formulario.get('Cod_OrdPro')?.value
    this.Cod_Present          = 0
    this.Cod_OrdTra           = this.formulario.get('partida')?.value;
    this.Id_Motivo            = 0
    this.Fec_Inicio     = this.range.get('start')?.value
    this.Fec_Fin        = this.range.get('end')?.value
    this.estado = this.formulario.get('estado')?.value;
    this.despachoOpIncompletaService.Ti_Man_Aprobacion_Despacho_Cod_OrdPro_V2(
      this.Cod_Accion,
      this.Num_Grupo,
      this.Cod_OrdPro,
      this.Cod_Present,
      this.Cod_OrdTra,
      this.Id_Motivo,
      this.Fec_Inicio,
      this.Fec_Fin,
      this.estado
      ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          this.dataSource.data = result
          this.SpinnerService.hide();

        }else{
          this.matSnackBar.open("No se encontraron registros...", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }


  aprobarDespacho(NUM_GRUPO: number, COD_ORDPRO: string, COD_PRESENT: number, DES_PRESENT: string, COD_ORDTRA: string, FLG_APROBADO: string){
    let dialogRef =  this.dialog.open(DialogRegistrarGiradoOpComponent, {
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '98vw',
      maxHeight: '98vh',

      data: { Num_Grupo: NUM_GRUPO,
              Cod_OrdPro: COD_ORDPRO,
              Cod_Present: COD_PRESENT,
              Des_Present: DES_PRESENT,
              Cod_OrdTra: COD_ORDTRA,
              Flg_Aprobado: FLG_APROBADO
  }});
    dialogRef.afterClosed().subscribe(result =>{
    if(result == 'true'){
      this.listarCabecera()
    }})
  }

}



