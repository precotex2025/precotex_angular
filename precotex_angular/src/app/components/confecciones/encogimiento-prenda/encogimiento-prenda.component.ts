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
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ExceljsHojaMedidaService } from 'src/app/services/exceljs-hoja-medida.service';
import { DialogEncogimientoPrendaRegistroComponent } from './dialog-encogimiento-prenda-registro/dialog-encogimiento-prenda-registro.component';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { AuditoriaHojaMedidaService } from 'src/app/services/auditoria-hoja-medida.service'

interface data_det {
  Id_Registro?: number;
  Cod_OrdPro?: string;
  Nom_Cliente?: string;
  Sec?: string;
  Cod_Talla?: string;
  Cod_Modelista?: string;
  Flg_Estado?: string;
  Fecha_Registro?: string;
  Cod_EstPro?: string;
  Cod_EstCli?: string;
  Cod_Cliente?: string;
  Cod_Version?: string;
  Nom_TemCli?: string;
  Cod_OrdTra?: string;
  Ruta_Prenda?: string;
  Tipo_Tela?: string;
  Nom_Modelista?: string;
}

@Component({
  selector: 'app-encogimiento-prenda',
  templateUrl: './encogimiento-prenda.component.html',
  styleUrls: ['./encogimiento-prenda.component.scss']
})
export class EncogimientoPrendaComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  
  formulario = this.formBuilder.group({
    OP: ['']
  });

  dataForExcel = [];
  cabForExcel = [];

  displayedColumns: string[] = ['Id_Registro', 'Nom_Cliente', 'Cod_EstCli', 'Cod_Version', 'Cod_EstPro', 'Nom_TemCli', 'Cod_OrdPro', 'Nom_Modelista', 'Fecha_Registro', 'Flg_Estado','Acciones']
  dataSource: MatTableDataSource<data_det>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private datepipe: DatePipe,
    private spinnerService: NgxSpinnerService,
    private exceljsService: ExceljsService,
    private exceljsHojaMedidaService:ExceljsHojaMedidaService,
    private auditoriaHojaMedidaService: AuditoriaHojaMedidaService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.listarEncogimientoPrendas();
  }

  listarEncogimientoPrendas(){

    const formData = new FormData();
    formData.append('Accion', 'L');
    formData.append('Id_Registro', '0');
    formData.append('Cod_Fabrica', '001');
    formData.append('Cod_OrdPro', this.formulario.get('OP')?.value.trim());
    formData.append('Cod_Talla', '');
    formData.append('Sec', '0');
    formData.append('Cod_Modelista', '');
    formData.append('Flg_Estado', '');
    formData.append('Fecha_Registro', this.range.get('start')?.value ? this.datepipe.transform(this.range.get('start')?.value, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Fecha_Registro2', this.range.get('end')?.value ? this.datepipe.transform(this.range.get('end')?.value, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    this.spinnerService.show();
    this.auditoriaHojaMedidaService.MantenimientoEncogimientoPrendaProceso(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

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
    let data_det: data_det = {Id_Registro: 0, Flg_Estado: "P"};

    let dialogRef = this.dialog.open(DialogEncogimientoPrendaRegistroComponent, {
      disableClose: true,
      minWidth: "1450px", //-'60vw',
      maxWidth: "1650px", //-'60vw',
      minHeight: "700px", //-'70vh',
      maxHeight: "850px", //-'70vh',
      height: '100%',
      width: '100%',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listarEncogimientoPrendas()
    });
}

  onEditarRegistro(data_det: data_det){
    let dialogRef = this.dialog.open(DialogEncogimientoPrendaRegistroComponent, {
      disableClose: true,
      minWidth: "1450px", //-'60vw',
      maxWidth: "1650px", //-'60vw',
      minHeight: "700px", //-'70vh',
      maxHeight: "850px", //-'70vh',
      height: '100%',
      width: '100%',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listarEncogimientoPrendas()
    });
  }

  onGenerarExcel(data_det: data_det){
    this.dataForExcel = [];
    this.cabForExcel = [];

    const formData = new FormData();
    formData.append('Accion', 'O');
    formData.append('Id_Registro', '0');
    formData.append('Cod_Fabrica', '001');
    formData.append('Cod_OrdPro', data_det.Cod_OrdPro);
    formData.append('Cod_Talla', '');    
    formData.append('Sec', '0');
    formData.append('Cod_Modelista', '');
    formData.append('Flg_Estado', '');
    formData.append('Fecha_Registro', '');
    formData.append('Fecha_Registro2', '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);


    this.auditoriaHojaMedidaService.MantenimientoEncogimientoPrendaProceso(formData)
      .subscribe((res: any) => {
        if (res.length > 0) {
          formData.set("Accion", "E")
          this.auditoriaHojaMedidaService.MantenimientoEncogimientoPrendaProceso(formData)
            .subscribe((response: any) => {
              //this.especificaciones = response;
              response.forEach((row: any) => {
                this.cabForExcel.push(Object.values(row));
              });

              this.auditoriaHojaMedidaService.HojaEncogimientoPrendaProceso(data_det.Cod_EstPro, data_det.Cod_Version, data_det.Cod_Talla, data_det.Id_Registro)
                .subscribe((result: any) => {

                  result.forEach((row: any) => {
                    this.dataForExcel.push(Object.values(row));
                  });

                  let reportData = {
                    title: 'REGISTRO DE ENCOGIMIENTO DE PRENDA POR PROCESO - Nº DE FICHA ' + data_det.Id_Registro.toString(),
                    data: this.dataForExcel,
                    Nom_Cliente: data_det.Nom_Cliente,		
                    Cod_EstCli:	data_det.Cod_EstCli,
                    Cod_Version: data_det.Cod_Version,
                    Cod_EstPro: data_det.Cod_EstPro,
                    Nom_TemCli: data_det.Nom_TemCli,
                    Cod_OrdPro: data_det.Cod_OrdPro,
                    //Cod_OrdTra:	data_det.Cod_OrdTra,
                    Cod_Talla: data_det.Cod_Talla,
                    Nom_Modelista: data_det.Nom_Modelista,
                    Tipo_Tela: res[0].Tipo_Tela,
                    Ruta_Prenda: res[0].Ruta_Prenda,
                    img64: res[0].Icono1, 
                    headers: Object.keys(result[0]),
                    especificaciones: this.cabForExcel,  //response[0],  
                    cabecera: Object.keys(response[0]),
                  }
                  console.log(result)
                  this.exceljsHojaMedidaService.exportExcelEncogimiento(reportData);
                  this.spinnerService.hide();

                }, (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              );    

            });

        } else {
          this.matSnackBar.open('No hay datos en la OP ingresada...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }

  onEliminarRegistro(id_Registro: number){
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        const formData = new FormData();
        formData.append('Accion', 'D');
        formData.append('Id_Registro', id_Registro.toString());
        formData.append('Cod_Fabrica', '');
        formData.append('Cod_OrdPro', '');
        formData.append('Cod_Talla', '');
        formData.append('Sec', '0');
        formData.append('Cod_Modelista', '');
        formData.append('Flg_Estado', '');
        formData.append('Fecha_Registro', '');
        formData.append('Fecha_Registro2', '');
        formData.append('Cod_Usuario', GlobalVariable.vusu);

        this.spinnerService.show();
        this.auditoriaHojaMedidaService.MantenimientoEncogimientoPrendaProceso(formData)
        .subscribe((result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.listarEncogimientoPrendas();
  
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

  onGenerarReporte(){
    this.dataForExcel = [];
    if(this.dataSource.data.length > 0){
      let dataReporte: any[] = [];
      
      this.dataSource.data.forEach((row: any) => {
        let data: any = {};

        data.NumeroFicha = row.Id_Registro;
        data.Cliente = row.Nom_Cliente;
        data.EstiloCliente = row.Cod_EstCli;
        data.Version = row.Cod_Version;
        data.EstiloPropio = row.Cod_EstPro;
        data.Temporada = row.Nom_TemCli;
        data.OP = row.Cod_OrdPro;
        data.TallaBase = row.Cod_Talla;
        data.Modelista = row.Nom_Modelista;
        data.Estado = row.Des_Estado;
        data.FechaRegistro = this.datepipe.transform(row.Fecha_Registro['date'], 'yyyy-MM-dd HH:mm:ss');
        dataReporte.push(data);
      });      

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE DE ENCOGIMIENTO DE PRENDA POR PROCESO',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);

    } else{
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

}
