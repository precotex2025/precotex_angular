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
import { DialogProduccionInspeccionSalidaCrearComponent } from './dialog-produccion-inspeccion-salida-crear/dialog-produccion-inspeccion-salida-crear.component';
import { ExceljsProdProArtesService } from 'src/app/services/exceljsProdProdArtes.service';


interface data_det {
  Id_SalidaArtes: number;
  Cod_OrdPro: string;
  Cod_Cliente: string;
  Nom_Cliente: string;
  Cod_EstCli: string;
  Cod_TemCli: string;
  Nom_TemCli:string;
  Cod_Present:string;
  Des_Present:string;
  Lote:string;
  Muestra: number;
  Ruta_Prenda:string;
  Supervisor:string;
  Observacion:string;
  Fecha_Ingreso: string;
  Fecha_Hora_Ingreso: string;
}

@Component({
  selector: 'app-produccion-inspeccion-salida-list',
  templateUrl: './produccion-inspeccion-salida-list.component.html',
  styleUrls: ['./produccion-inspeccion-salida-list.component.scss']
})
export class ProduccionInspeccionSalidaListComponent implements OnInit {

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

  dataSource: MatTableDataSource<data_det>;
  
  displayedColumns_cab: string[] = [
    'Id_SalidaArtes',
    'Cod_OrdPro',
    'Nom_Cliente',
    'Cod_EstCli',
    'Nom_TemCli',
    'Des_Present',
    'Lote',
    'Usuario_Creacion',
    'Fecha_Ingreso',
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
    this.produccionArtesInspeccionService.MantenimientoProduccionArtesSalidaInspeccion(this.Cod_Accion, this.formulario.get('sOP')?.value, this.range.get('start')?.value, this.range.get('end')?.value).subscribe((res: any) => {
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
    let dialogRef = this.dialog.open(DialogProduccionInspeccionSalidaCrearComponent, {
      disableClose: true,
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
    //console.log('datos para editar')
    //console.log(data_det);
    let dialogRef = this.dialog.open(DialogProduccionInspeccionSalidaCrearComponent, {
      disableClose: true,
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

  generateExcel(){
    this.dataForExcel = [];
    //console.log(this.dataSource.data)
    this.dataSource.data.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })
    
    let reportData = {
      title: 'REPORTE FORMATO DE INSPECCION DE ESTAMPADO Y BORDADO SALIDA',
      data: this.dataForExcel,
      headers: Object.keys(this.dataSource.data[0])
    }
    this.exceljsService.exportExcel(reportData);

  }


}



