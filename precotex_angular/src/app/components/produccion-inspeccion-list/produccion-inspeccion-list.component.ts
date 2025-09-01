import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { ProduccionArtesInspeccionService } from 'src/app/services/produccion-artes-inspeccion.service';
import { DialogProduccionInspeccionCrearComponent } from './dialog-produccion-inspeccion-crear/dialog-produccion-inspeccion-crear.component';
import { ExceljsProdProArtesService } from 'src/app/services/exceljsProdProdArtes.service';

import { DialogConfirmacion2Component} from 'src/app/components/dialogs/dialog-confirmacion2/dialog-confirmacion2.component';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';

interface data_det {
  Id_ProcesoArtes: number;
  Cod_OrdPro: string;
  Cod_EstPro: string;
  Cod_Version: string;
  Co_CodOrdPro: string;
  Cod_EstCli: string;
  Des_Cliente: string;
  Cod_Cliente: string;
  Cod_Present: string;
  Des_Present: string;
  Num_Hoja_Correlativo: string;
  Num_Maquina: string;
  Tip_Proceso: number;
  Des_Proceso: string;
  Id_Maquina: number;
  Des_Maquina: string;
  Id_Horno: number;
  Des_Horno: string;
  Tiempo_Velocidad: string;
  Tiempo: string;
  Velocidad: string;
  Presion:string;
  Temperatura: string;
  Operario: string;
  Supervisor: string;
  Prendas_Can: number;
  Piezas_Can: number;
  Prendas_Pri: number;
  Prendas_Def: number;
  Prendas_Rec: number;
  Prendas_Seg: number;
  Prendas_Esp: number;
  Total_Prendas_Aud: number;
  Flg_Aprobacion: string;
  Des_Flg_Aprobacion: string;
  Flg_Estado_Inspec_Calidad: boolean;
  Flg_Estado_Superv_Produccion: boolean;
  Observacion: string;
  Tipo_Prenda: string;
  Habilitadas: number;
  Cod_Usuario: string;
  Flg_Estado: string;
  Fecha_Registro: string;
  Fecha_Registro_Hoja: string;
  IdNivelAutorizacion: number;
}

@Component({
  selector: 'app-produccion-inspeccion-list',
  templateUrl: './produccion-inspeccion-list.component.html',
  styleUrls: ['./produccion-inspeccion-list.component.scss']
})
export class ProduccionInspeccionListComponent implements OnInit {

  Cod_Accion = ''
  Cod_OrdPro=''
  dataExcel:Array<any> = [];
  dataForExcel:Array<any> = [];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  formulario = this.formBuilder.group({
    sOP:      ['']
  })

  lstStrike: any[] = [
    { cod: "1", name: "Presenta Strike OFF"  },
    { cod: "0", name: "No presenta Strike OFF" }
  ];

  dataSource: MatTableDataSource<data_det>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  displayedColumns_cab: string[] = [
    'Num_Hoja_Correlativo',
    'Cod_OrdPro',
    'Cod_EstCli',
    'Des_Cliente',
    'Co_CodOrdPro',
    'Des_Present',
    'Des_Flg_Aprobacion',
    'Cod_Usuario',
    'Fecha_Registro',
    'ACCIONES'
  ];

  columnsToDisplay: string[] = this.displayedColumns_cab.slice();

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private produccionArtesInspeccionService: ProduccionArtesInspeccionService,
    private exceljsService:ExceljsProdProArtesService
  ) { 
    this.dataSource = new MatTableDataSource();
   }

  


  ngOnInit(): void {
    this.buscarProduccionArtes()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
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


  buscarProduccionArtes(){
    this.spinnerService.show();
    this.Cod_Accion = 'L'
    //console.log(this.Cod_Accion, this.formulario.get('sOP')?.value, this.range.get('start')?.value, this.range.get('end')?.value);
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccion(this.Cod_Accion, this.formulario.get('sOP')?.value, this.range.get('start')?.value, this.range.get('end')?.value, 0)
      .subscribe((res: any) => {
      //console.log(res);
        this.spinnerService.hide();
        if (res.length > 0) {
          //this.dataSource.data = res;
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource.data = [];
          this.matSnackBar.open('No se encontraron registros.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }

      }, ((err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        this.dataSource.data = [];
        this.spinnerService.hide();
    }))
  }

  openDialog(){
    let dialogRef = this.dialog.open(DialogProduccionInspeccionCrearComponent, {
      disableClose: true,
      //panelClass: 'my-class',
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.buscarProduccionArtes()
    })
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

  editarHoja(data_det: data_det){
    let dialogRef = this.dialog.open(DialogProduccionInspeccionCrearComponent, {
      disableClose: true,
      //panelClass: 'my-class',
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.buscarProduccionArtes()
    })
  }

  onReprocesarHoja(data_det: data_det){

    let Fecha = new Date();
    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Desea reprocesar la hoja " + data_det.Id_ProcesoArtes + "?" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.spinnerService.show();

        this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccionComplemento(
          'I', 
          data_det.Cod_OrdPro,
          data_det.Cod_EstPro,
          data_det.Cod_Version,
          data_det.Co_CodOrdPro,
          data_det.Cod_EstCli,
          data_det.Cod_Cliente,
          data_det.Cod_Present,
          data_det.Id_Maquina.toString(),
          data_det.Id_Horno.toString(),
          data_det.Velocidad,
          data_det.Tiempo,
          data_det.Presion,
          data_det.Temperatura,
          data_det.Operario,
          data_det.Supervisor,
          data_det.Prendas_Can,
          data_det.Piezas_Can,
          0, //data_det.Prendas_Pri,
          0, //data_det.Prendas_Def,
          0, //data_det.Prendas_Rec,
          0, //data_det.Prendas_Seg,
          0, //data_det.Prendas_Esp,
          data_det.Total_Prendas_Aud,
          data_det.Flg_Aprobacion,
          String(data_det.Flg_Estado_Inspec_Calidad),
          String(data_det.Flg_Estado_Superv_Produccion),
          data_det.Observacion,
          data_det.Tipo_Prenda,
          data_det.Habilitadas,
          _moment(Fecha).isValid() ? _moment(Fecha.valueOf()).format() : '',
          _moment(Fecha).isValid() ? _moment(Fecha.valueOf()).format() : '',
          data_det.Id_ProcesoArtes
         ).subscribe((result: any) => {
            if (result.length > 0) {
              if(result[0].Respuesta == "OK"){
                this.buscarProduccionArtes();
                this.spinnerService.hide();
              } else{
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                this.spinnerService.hide();
              }
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }));

      }
    });


  }

  
  cargarDataExcel(){
    this.spinnerService.show();
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccion('X', this.formulario.get('sOP')?.value, this.range.get('start')?.value, this.range.get('end')?.value, 0)
      .subscribe((res: any) => {
        this.spinnerService.hide();
        if (res.length > 0) {
          this.dataExcel = res;
          this.generateExcel();
        } else {
          this.matSnackBar.open('No se encontraron registros.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, ((err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        this.dataSource.data = [];
        this.spinnerService.hide();
    }))
  }
  
  generateExcel(){
    this.dataForExcel = [];

    this.dataExcel.forEach((row: any) => {
      let dato = {
        "Num Hoja": row.Num_Hoja_Correlativo,
        "Fecha_Registro": row.Fecha_Registro,
        "Fecha_Inicial": row.Fecha_Inicio,
        "Fecha_Final": row.Fecha_Fin,
        "OP": row.Cod_OrdPro,
        "Estilo": row.Cod_EstCli,
        "Cliente": row.Des_Cliente,
        "Color": row.Des_Present,
        "Plantilla_Corte": row.Co_CodOrdPro,
        "Supervisor": row.Supervisor,
        "Operario": row.Operario,
        "Tendedor": row.Tendedor,
        "Maquinista": row.Maquinista,
        "Des_Proceso": row.Des_Proceso,
        "Des_Maquina": row.Des_Maquina,
        "Des_Horno": row.Des_Horno,
        "Tiempo": row.Tiempo,
        "Velocidad": row.Velocidad,
        "Presion": row.Presion,
        "Temperatura": row.Temperatura,
        "Prueba_Lavado": row.Prueba_Lavado,
        "Ciclos": row.Ciclos,
        "Tipo_Prenda": row.Tipo_Prenda,
        "Prendas_Can": row.Prendas_Can,
        "Piezas_Can": row.Piezas_Can,
        "Prendas_Pri": row.Prendas_Pri,
        "Prendas_Seg": row.Prendas_Seg,
        "Prendas_Esp": row.Prendas_Esp,
        "Prendas_Rec": row.Prendas_Rec,
        "Resultado": row.Des_Flg_Aprobacion,
        "Defectos": row.Defectos,
        "Cant_Defectos": row.Cant_Def,
        "Def_Segundas": row.Def_Segundas,
        "Cant_Def_Seg": row.Cant_Def_Seg,
        "Def_Especiales": row.Def_Especiales,
        "Cant_Def_Esp": row.Cant_Def_Esp,
        "Observacion": row.Observacion,
        "Cod Usuario": row.Cod_Usuario,
      }
      this.dataForExcel.push(Object.values(dato))
    })
    
    let HEADER = {
      "Num Hoja": "Num Hoja",
      "Fecha_Registro": "Fecha de Registro",
      "Fecha_Inicial": "Fecha Inicial",
      "Fecha_Final": "Fecha Final",
      "OP": "OP",
      "Estilo": "Estilo",
      "Cliente": "Cliente",
      "Color": "Color",
      "Plantilla_Corte": "#Plantilla/Corte",
      "Supervisor": "Supervisor",
      "Operario": "Operario",
      "Tendedor": "Tendedor",
      "Maquinista": "Maquinista",
      "Des_Proceso": "Proceso",
      "Des_Maquina": "Num Maquina",
      "Des_Horno": "Horno",
      "Tiempo": "Tiempo",
      "Velocidad": "Velocidad",
      "Presion": "Presion",
      "Temperatura": "Temperatura",
      "Prueba_Lavado": "Prueba_Lavado",
      "Ciclos": "Ciclos",
      "Tipo_Prenda": "Tipo_Prenda",
      "Prendas Cant": "Prendas Cant",
      "Piezas Cant": "Piezas Cant",
      "Pds 1ras": "Pds 1ras",
      "Pds 2das": "Pds 2das",
      "Especiales": "Especiales",
      "Prendas_Rec": "Recuperadas",
      "Resultado": "Resultado",
      "Defectos": "Defectos",
      "Cant_Defectos": "Cant_Def",
      "Def_Segundas": "Def_Segundas",
      "Cant_Def_Seg": "Cant_Def_Seg",
      "Def_Especiales": "Def_Especiales",
      "Cant_Def_Esp": "Cant_Def_Esp",
      "Observacion": "Observacion",
      "Cod Usuario": "Cod Usuario"
    }
    
    let reportData = {
      title: 'REPORTE FORMATO DE INSPECCION DE ESTAMPADO Y BORDADO',
      data: this.dataForExcel,
      headers: Object.keys(HEADER)
    }
    this.exceljsService.exportExcel(reportData);
    
  }

  eliminarHoja(data_det: data_det){
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.spinnerService.show();

        this.produccionArtesInspeccionService.MantenimientoProduccionArtesProcesoInspeccion('D', '', this.range.get('start')?.value, this.range.get('end')?.value, data_det.Id_ProcesoArtes)
          .subscribe((result: any) => {
            if (result.length > 0) {
              if(result[0].Respuesta == "OK"){
                this.buscarProduccionArtes();
                this.spinnerService.hide();
              } else{
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                this.spinnerService.hide();
              }
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }));
      }
    });
    
  }


}