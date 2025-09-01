import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { AuditoriaAcabadosService} from 'src/app/services/auditoria-acabados.service'
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'

import { GlobalVariable } from '../../../VarGlobals'; //<==== this one
import { ExceljsHojaMedidaService } from 'src/app/services/exceljs-hoja-medida.service';
//import { DialogObservacionHojaMedidaComponent } from './dialog-auditoria-hoja-medida/dialog-observacion-hoja-medida/dialog-observacion-hoja-medida.component';
import { AuditoriaHojaMedidaService } from 'src/app/services/auditoria-hoja-medida.service'

interface data_det {
    Cod_Hoja_Medida_Cab:  number,
    Cod_OrdPro:           string,
    Cod_EstCli:           string,
    Cod_TemCli:           string,
    Cod_EstPro:           string,
    Cod_Version:          string,
    Cod_ColCli:           string,
    Cod_LinPro:           string,
    Supervisor:           string,
    Auditor:              string,
    Observacion:          string,
    Flg_Estado:           string,
    Fecha_Registro:       string

}



interface Cliente {
  Cod_Cliente: string;
  Nom_Cliente: string;
  Abr_Cliente: string;
}


interface Temporada {
  Codigo: string;
  Descripcion: string;
  Stock:string
}

@Component({
  selector: 'app-auditoria-acabados',
  templateUrl: './auditoria-acabados.component.html',
  styleUrls: ['./auditoria-acabados.component.scss']
})
export class AuditoriaAcabadosComponent implements OnInit {



  public data_det = [{
    Cod_Hoja_Medida_Cab:   0,
    Cod_OrdPro:           "",
    Cod_ColCli:           "",
    Cod_LinPro:           "",
    Supervisor:           "",
    Auditor:              "",
    Observacion:          "",
    Flg_Estado:           "",
    Fecha_Registro:       "",
  }]


  Cod_Accion        = ''
  filterValue       = ''
  flg_reset_estilo  = false
  Cod_Cliente       = ''
  Cod_EstCli        = ''
  Cod_EstPro        = ''
  Cod_Version       = ''
  Cod_OrdPro        = ''
  Cod_ColCli          = ''
  Cod_TemCli          = ''
  Cod_Clientev2       = ''
  Cod_Hoja_Medida_Cab = 0
  Cod_LinPro          = ''
  Observaciones       = ''
  Flg_Estado          = ''
  Cod_Supervisor      = ''
  columnDefinitions   = [];
  Cod_Auditor         = ''

  Fecha_Auditoria    = ''
  Fecha_Auditoria2   = ''

  Flg_Btn_Registrar = true

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  dataForExcel = [];

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    OP:      [''],
  })


  displayedColumns_cab: string[] = ['Cod_Hoja_Medida_Cab', 'Cod_OrdPro', 'Cod_TemCli','Cod_ColCli', 'Cod_LinPro', 'Supervisor', 'Auditor', 'Fecha_Registro', 'Flg_Estado', 'Observacion','Acciones']
  dataSource: MatTableDataSource<data_det>;



  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private exceljsHojaMedidaService:ExceljsHojaMedidaService,
    private auditoriaHojaMedidaService: AuditoriaHojaMedidaService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    //this.MostrarCabeceraAuditoria()
    GlobalVariable.Cod_Hoja_Medida_Cab = 0
    this.listarCabecera()

    if(GlobalVariable.vCod_Rol == 6){
      this.Flg_Btn_Registrar = false
    }
    }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };

  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }


  listarCabecera(){
    this.SpinnerService.show();
    this.Cod_Accion           = 'L'
    this.Cod_Hoja_Medida_Cab
    this.Cod_OrdPro           = this.formulario.get('OP')?.value
    this.Cod_ColCli           = ''
    this.Cod_Clientev2
    this.Cod_EstCli           = ''
    this.Cod_TemCli
    this.Cod_EstPro
    this.Cod_Version
    this.Cod_LinPro            = ''
    this.Cod_Supervisor        = ''
    this.Cod_Auditor           = ''
    this.Observaciones
    this.Flg_Estado           = 'P',
    this.Fecha_Auditoria    = this.range.get('start')?.value
    this.Fecha_Auditoria2   = this.range.get('end')?.value
    this.auditoriaAcabadosService.MantenimientoAuditoriaAcabadosCabecera(
      this.Cod_Accion,
      this.Cod_Hoja_Medida_Cab,
      this.Cod_OrdPro,
      this.Cod_ColCli,
      this.Cod_Clientev2,
      this.Cod_EstCli,
      this.Cod_TemCli,
      this.Cod_EstPro,
      this.Cod_Version,
      this.Cod_LinPro,
      this.Cod_Supervisor,
      this.Cod_Auditor,
      this.Observaciones,
      this.Flg_Estado,
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2,
      0,
      ''
      ).subscribe(
      (result: any) => {
        if (result[0].Respuesta == undefined) {
          this.dataSource.data = result
          console.log(result)
          this.SpinnerService.hide();

        }else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }


  asginarVGlobalAuditoriaHojaMedida(Cod_Hoja_Medida_Cab: number, Cod_EstPro: string, Cod_Verion: string){
   GlobalVariable.Cod_Hoja_Medida_Cab = Cod_Hoja_Medida_Cab
   GlobalVariable.Cod_EstProHojaMedida = Cod_EstPro
   GlobalVariable.Cod_VersionHojaMedida = Cod_Verion
  }

  actualizarObservacion(Cod_Hoja_Medida_Cab: number){
/*
    let dialogRef =  this.dialog.open(DialogObservacionHojaMedidaComponent,
      { disableClose: true,
        panelClass: 'my-class',
        data: { Cod_Hoja_Medida_Cab: Cod_Hoja_Medida_Cab
        }});
      dialogRef.afterClosed().subscribe(result => {
          if (result == 'true') {
            this.listarCabecera()
      }})
      */
  }


  EliminarRegistrocCabecera(Cod_Hoja_Medida_Cab: number) {
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.Cod_Accion             = 'D'
        this.Cod_Hoja_Medida_Cab    = Cod_Hoja_Medida_Cab
        this.Cod_OrdPro             = ''
        this.Cod_ColCli             = ''
        this.Cod_Clientev2
        this.Cod_EstCli             = ''
        this.Cod_TemCli
        this.Cod_EstPro
        this.Cod_Version
        this.Cod_LinPro             = ''
        this.Cod_Supervisor         = ''
        this.Cod_Auditor            = ''
        this.Observaciones
        this.Flg_Estado             = 'P'
        this.Fecha_Auditoria        = ''
        this.Fecha_Auditoria2       = ''
        this.auditoriaAcabadosService.MantenimientoAuditoriaAcabadosCabecera(
          this.Cod_Accion,
          this.Cod_Hoja_Medida_Cab,
          this.Cod_OrdPro,
          this.Cod_ColCli,
          this.Cod_Clientev2,
          this.Cod_EstCli,
          this.Cod_TemCli,
          this.Cod_EstPro,
          this.Cod_Version,
          this.Cod_LinPro,
          this.Cod_Supervisor,
          this.Cod_Auditor,
          this.Observaciones,
          this.Flg_Estado,
          this.Fecha_Auditoria,
          this.Fecha_Auditoria2,
          0,
          ''
          ).subscribe(
          (result: any) => {
            if (result[0].Respuesta == 'OK') {
              this.listarCabecera()
            }else{
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

      }

    })
  }



  generateExcel(Cod_Hoja_Medida_Cab: number, Cod_EstPro: string, Cod_OrdPro: string,Cod_Verion: string, Nom_Cliente: string, Cod_EstCli: string, Cod_ColCli: string, Cod_LinPro: string,Tipo: string,Auditor: string	) {

    this.SpinnerService.show();
    this.dataForExcel=[];
    // this.auditoriaAcabadosService.AuditoriaHojaMedidaCargaMedidaService(
      this.auditoriaHojaMedidaService.AuditoriaHojaMedidaCargaMedidaAcabadosService(
      Cod_EstPro,
      Cod_Verion,
      Cod_OrdPro,
      Cod_Hoja_Medida_Cab
    ).subscribe(
      (result: any) => {

        result.forEach((row: any) => {
          this.dataForExcel.push(Object.values(row))
        })

        let reportData = {
          title: 'REPORTE REGISTRO HOJA DE MEDIDA - ACABADOS Nº DE FICHA '+Cod_Hoja_Medida_Cab,
          data: this.dataForExcel,
          Cod_EstPro: Cod_EstPro,
          Cod_Verion: Cod_Verion,
          Cod_OrdPro: Cod_OrdPro,
          Nom_Cliente: Nom_Cliente,		
          Cod_EstCli:	Cod_EstCli,
          Cod_ColCli: Cod_ColCli,
          Cod_LinPro:	Cod_LinPro,
          Tipo: Tipo,
          Auditor: Auditor,
          headers: Object.keys(result[0])
        }

        this.exceljsHojaMedidaService.exportExcel(reportData);
        this.SpinnerService.hide();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

}

