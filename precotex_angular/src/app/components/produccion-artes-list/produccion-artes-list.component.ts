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
import { DialogProduccionArtesCrearComponent } from './dialog-produccion-artes-crear/dialog-produccion-artes-crear.component';
import { ExceljsProdArtesService } from 'src/app/services/exceljsProdArtes.service';

interface data_det {
  Id_ProduccionArtes: number;
  Cod_OrdPro: string;
  Cod_EstPro: string;
  Cod_Version: string;
  Co_CodOrdPro: string;
  Cod_Present: string;
  Cod_EstCli: string;
  Cod_Cliente: string;
  Tipo_Prenda: string;
  Num_Hoja_Correlativo_General: string;
  Cod_Usuario: string;
  Fecha_Ingreso_Produccion: string;
  Fecha_Entrega_Contramuestra: string;
  Flg_Strike: string;
  Desc_Flg_Strike: string;
  Flg_Estado_Superv_Aseguramiento: boolean;
  Flg_Estado_Superv_Produccion: boolean;
  Flg_Estado: string;
  Fecha_Registro: string;
  IdNivelAutorizacion: number;
}

@Component({
  selector: 'app-produccion-artes-list',
  templateUrl: './produccion-artes-list.component.html',
  styleUrls: ['./produccion-artes-list.component.scss']
})
export class ProduccionArtesListComponent implements OnInit {
  
  Cod_Accion = ''
  Cod_OrdPro=''
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  displayedColumns_cab: string[] = [
    'Num_Hoja_Correlativo_General',
    'Cod_OrdPro',
    'Cod_EstCli',
    'Cod_Cliente',
    'Co_CodOrdPro',
    'Des_Flg_Strike',
    'Cod_Usuario',
    'Fecha_Registro',
    'ACCIONES'
  ];

  columnsToDisplay: string[] = this.displayedColumns_cab.slice();
  clickedRows = new Set<data_det>();

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private produccionArtesInspeccionService: ProduccionArtesInspeccionService,
    private exceljsService:ExceljsProdArtesService
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
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesInspeccion(this.Cod_Accion, this.formulario.get('sOP')?.value, this.range.get('start')?.value, this.range.get('end')?.value).subscribe((res: any) => {
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
      this.spinnerService.hide();
    }))
  }

  openDialog(){
    let dialogRef = this.dialog.open(DialogProduccionArtesCrearComponent, {
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

  editarHoja(data_det: data_det){
    //console.log('datos para editar')
    //console.log(data_det);
    let dialogRef = this.dialog.open(DialogProduccionArtesCrearComponent, {
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

  eliminarHoja(data_det: data_det){}

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

  generateExcel(){
    this.dataForExcel = [];
    
    this.dataSource.data.forEach((row: any) => {
      let dato = {
        "Num Hoja": row.Num_Hoja_Correlativo_General,
        "OP": row.Cod_OrdPro,
        "Estilo": row.Cod_EstCli,
        "Cliente": row.Cod_Cliente,
        "#Plantilla/Corte": row.Co_CodOrdPro,
        "Strike": row.Des_Flg_Strike,
        "Cod Usuario": row.Cod_Usuario,
        "Fecha de Registro": row.Fecha_Registro,
      }
      this.dataForExcel.push(Object.values(dato))
    })
    let HEADER = {
      "Num Hoja": "Num Hoja",
      "OP": "OP",
      "Estilo": "Estilo",
      "Cliente": "Cliente",
      "#Plantilla/Corte": "#Plantilla/Corte",
      "Strike": "Strike",
      "Cod Usuario": "Cod Usuario",
      "Fecha de Registro": "Fecha de Registro",
    }
    console.log(HEADER)
    let reportData = {
      title: 'REPORTE FORMATO DE ARRANQUE DE PRODUCCION DE ARTES',
      data: this.dataForExcel,
      headers: Object.keys(HEADER)
    }
    this.exceljsService.exportExcel(reportData);
    
  }



}



