import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { DatePipe } from "@angular/common";
import * as _moment from 'moment';

import { GlobalVariable } from 'src/app/VarGlobals';
import { ExceljsHojaMedidaService } from 'src/app/services/exceljs-hoja-medida.service';
import { DialogAuditoriaHojaMoldeRegistroComponent } from './dialog-auditoria-hoja-molde-registro/dialog-auditoria-hoja-molde-registro.component';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { AuditoriaHojaMedidaService } from 'src/app/services/auditoria-hoja-medida.service'

interface data_det {
  Id_Hoja_Medida?: number;
  Cod_OrdPro?: string;
  Nom_Cliente?: string;
  Cod_Modulo?: string;
  Sec?: string;
  Cod_Auditor?: string;
  Flg_Estado?: string;
  Fecha_Registro?: string;
  Cod_EstPro?: string;
  Cod_EstCli?: string;
  Cod_Cliente?: string;
  Cod_Version?: string;
  Nom_TemCli?: string;
  Cod_ColCli?: string;
  Nom_Auditor?: string;
  Des_Modulo?: string;
  Encogimiento?: string;
  ColorPartida?: string;
}

@Component({
  selector: 'app-auditoria-hoja-molde',
  templateUrl: './auditoria-hoja-molde.component.html',
  styleUrls: ['./auditoria-hoja-molde.component.scss']
})
export class AuditoriaHojaMoldeComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  formulario = this.formBuilder.group({
    OP: ['']
  })

  dataForExcel = [];

  displayedColumns: string[] = ['Id_Hoja_Medida', 'Cod_OrdPro', 'Nom_TemCli','Cod_ColCli', 'Des_Modulo', 'Nom_Cliente', 'Nom_Auditor', 'Fecha_Registro', 'Flg_Estado','Acciones']
  dataSource: MatTableDataSource<data_det>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private datepipe: DatePipe,
    private spinnerService: NgxSpinnerService,
    private exceljsHojaMedidaService:ExceljsHojaMedidaService,
    private auditoriaHojaMedidaService: AuditoriaHojaMedidaService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.listaraAuditriaHojaMedidaMoldes();
  }

  listaraAuditriaHojaMedidaMoldes(){
    console.log(this.range.get('end')?.value)

    const formData = new FormData();
    formData.append('Accion', 'L');
    formData.append('Id_Hoja_Medida', '0');
    formData.append('Cod_OrdPro', this.formulario.get('OP')?.value.trim());
    formData.append('Cod_ColCli', '');
    formData.append('Cod_Modulo', '');
    formData.append('Sec', '0');
    formData.append('Cod_Auditor', '');
    formData.append('Flg_Estado', '');
    formData.append('Fecha_Registro', this.range.get('start')?.value ? this.datepipe.transform(this.range.get('start')?.value, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Fecha_Registro2', this.range.get('end')?.value ? this.datepipe.transform(this.range.get('end')?.value, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    this.spinnerService.show();
    //this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes('L', 0, this.formulario.get('OP')?.value.trim(), '', '', '0' , '', '', this.datepipe.transform(this.range.get('start')?.value, 'yyyy-MM-ddTHH:mm:ss'), this.datepipe.transform(this.range.get('end')?.value, 'yyyy-MM-ddTHH:mm:ss'))
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          //this.dataSource.data = result
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          //console.log(result)
          this.spinnerService.hide();
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }

  onAgregarRegistro(){
    let data_det: data_det = {Id_Hoja_Medida: 0, Flg_Estado: "0"};

    let dialogRef = this.dialog.open(DialogAuditoriaHojaMoldeRegistroComponent, {
      disableClose: true,
      minWidth: "1350px", //-'60vw',
      maxWidth: "1450px", //-'60vw',
      minHeight: "700px", //-'70vh',
      maxHeight: "750px", //-'70vh',
      height: '100%',
      width: '100%',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listaraAuditriaHojaMedidaMoldes()
    });

  }

  onEditarRegistro(data_det: data_det){
    let dialogRef = this.dialog.open(DialogAuditoriaHojaMoldeRegistroComponent, {
      disableClose: true,
      minWidth: "1350px", //-'60vw',
      maxWidth: "1450px", //-'60vw',
      minHeight: "700px", //-'70vh',
      maxHeight: "750px", //-'70vh',
      height: '100%',
      width: '100%',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listaraAuditriaHojaMedidaMoldes()
    });
  }

  onGenerarExcel(data_det: data_det){
    this.dataForExcel = [];

    this.auditoriaHojaMedidaService.AuditoriaHojaMedidaMoldesTallas(data_det.Cod_EstPro, data_det.Cod_Version, data_det.Cod_OrdPro, data_det.Sec, data_det.Id_Hoja_Medida)
      .subscribe((result: any) => {

        result.forEach((row: any) => {
          this.dataForExcel.push(Object.values(row));
        });

        let reportData = {
          title: 'REPORTE REGISTRO HOJA DE MEDIDA - MOLDES Nº DE FICHA ' + data_det.Id_Hoja_Medida.toString(),
          data: this.dataForExcel,
          Cod_EstPro: data_det.Cod_EstPro,
          Cod_Version: data_det.Cod_Version,
          Cod_OrdPro: data_det.Cod_OrdPro,
          Nom_Cliente: data_det.Nom_Cliente,		
          Cod_EstCli:	data_det.Cod_EstCli,
          Cod_ColCli: data_det.Cod_ColCli,
          Des_Modulo:	data_det.Des_Modulo,
          Nom_TemCli: data_det.Nom_TemCli,
          Nom_Auditor: data_det.Nom_Auditor,
          Encogimiento: data_det.Encogimiento,
          ColorPartida: data_det.ColorPartida,
          headers: Object.keys(result[0])
        }

        this.exceljsHojaMedidaService.exportExcelMolde(reportData);
        this.spinnerService.hide();

      }, (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  onEliminarRegistro(Id_Hoja_Medida: number){

    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        const formData = new FormData();
        formData.append('Accion', 'D');
        formData.append('Id_Hoja_Medida', Id_Hoja_Medida.toString());
        formData.append('Cod_OrdPro', '');
        formData.append('Cod_ColCli', '');
        formData.append('Cod_Modulo', '');
        formData.append('Sec', '0');
        formData.append('Cod_Auditor', '');
        formData.append('Flg_Estado', '');
        formData.append('Fecha_Registro', '');
        formData.append('Fecha_Registro2', '');
        formData.append('Cod_Usuario', GlobalVariable.vusu);

        this.spinnerService.show();
        //this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes('D', Id_Hoja_Medida, '', '', '', '', '', '', '', '')
        this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes(formData)
        .subscribe((result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.listaraAuditriaHojaMedidaMoldes();
  
            this.matSnackBar.open('Registro eliminado..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }  
        },
         (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        );
      }
    });

   
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }


}
