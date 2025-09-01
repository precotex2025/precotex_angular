import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { ProduccionArtesInspeccionService } from 'src/app/services/produccion-artes-inspeccion.service';
import { DialogHojaIngenieriaOperacionCrearComponent } from './dialog-hoja-ingenieria-operacion-crear/dialog-hoja-ingenieria-operacion-crear.component';
import { DialogHojaIngenieriaOperacionVerComponent } from './dialog-hoja-ingenieria-operacion-ver/dialog-hoja-ingenieria-operacion-ver.component';
import { ExceljsProdProArtesService } from 'src/app/services/exceljsProdProdArtes.service';


interface data_det {
  IdHojaIngenieria: number;
  Num_Hoja_Correlativo: string;
  Cod_EstPro: string;
  Des_EstPro: string;
  Cod_Version: string;
  Cod_EstCli: string;
  Des_EstCli:string;
  Cod_Cliente: string;
  Des_Cliente: string;
  Cod_TipPre: string;
  Des_TipPre: string;
  Complejidad: string;
  Url_Archivo: string;
  Analista: string;
  Grupo: string;
  TipoTela: string;
  Cod_Usuario: string;
  available_production: string;
  Tipo_Estilo: string;
  Tipo_Estilo_Name: string;
  Fecha_Ingreso: string;
  Fecha_Registro: string;
  Permiso: number;
}

@Component({
  selector: 'app-hoja-ingenieria-operacion-list',
  templateUrl: './hoja-ingenieria-operacion-list.component.html',
  styleUrls: ['./hoja-ingenieria-operacion-list.component.scss']
})
export class HojaIngenieriaOperacionListComponent implements OnInit {

  Cod_Accion = ''
  Cod_OrdPro=''
  dataForExcel:Array<any> = [];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  formulario = this.formBuilder.group({
    sEstiloPropio:      ['']
  })

  dataSource: MatTableDataSource<data_det>;
  
  displayedColumns_cab: string[] = [
    'Produccion',
    'Num_Hoja_Correlativo',
    'Cod_EstPro',
    'Des_EstPro',
    'Des_Cliente',
    'Des_TipPre',
    'Cod_Version',
    'Cod_EstCli',
    'TipoTela',
    'Cod_Usuario',
    'Analista',
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;



  ngOnInit(): void {
    this.buscarHojaIngenieria()
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


  buscarHojaIngenieria(){
    this.spinnerService.show();
    this.Cod_Accion = 'L'
    this.produccionArtesInspeccionService.MantenimientoHojaIngenieria(this.Cod_Accion, this.formulario.get('sEstiloPropio')?.value, this.range.get('start')?.value, this.range.get('end')?.value).subscribe((res: any) => {
      console.log(res);
      this.spinnerService.hide();
      if (res.length > 0) {
        this.dataSource.data = res;
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
    let dialogRef = this.dialog.open(DialogHojaIngenieriaOperacionCrearComponent, {
      disableClose: true,
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.buscarHojaIngenieria()
    })
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

  editarHoja(data_det: data_det){
    //console.log('datos para editar')
    //console.log(data_det);
    let dialogRef = this.dialog.open(DialogHojaIngenieriaOperacionCrearComponent, {
      disableClose: true,
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.buscarHojaIngenieria()
    })
  }

  visualizarHoja(data_det: data_det){
    let dialogRef = this.dialog.open(DialogHojaIngenieriaOperacionVerComponent, {
      disableClose: true,
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.buscarHojaIngenieria()
    })
  }


  changeCheck(event, id) {

    if (event.checked) {

      this.dataSource.data.forEach(element => {

        if (element.IdHojaIngenieria == id) {
          element.available_production = '1';
        }

      });
      
      this.spinnerService.show();
      this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaComplemento(
        'P',
        '',
        '','','','','','','','','','','','','','1','','',
        id
        ).subscribe(
        (result: any) => {
          //console.log(result)
          if (result[0].Respuesta == 'OK'){
            console.log(result)
            this.spinnerService.hide();
          }else{
            this.spinnerService.hide();
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
      

    } else {

      this.dataSource.data.forEach(element => {
        if (element.IdHojaIngenieria == id) {
          element.available_production = '0';
        }
      });

      this.spinnerService.show();
      this.produccionArtesInspeccionService.MantenimientoHojaIngenieriaComplemento(
        'P',
        '',
        '','','','','','','','','','','','','','0','','',
        id
        ).subscribe(
        (result: any) => {
          //console.log(result)
          if (result[0].Respuesta == 'OK'){
            console.log(result)
            this.spinnerService.hide();
          }else{
            this.spinnerService.hide();
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }

  }


}



