import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { MantMaestroBolsaService } from 'src/app/services/mant-maestro-bolsa.service';
import { ExceljsProdProArtesService } from 'src/app/services/exceljsProdProdArtes.service';


interface data_det {
  ID_BOLSA: number;
  COD_BARRA: string;
  COD_ALMACEN_ULT: string;
  NUM_MOVSTK_ULT: string;
  COD_ORDPRO: string;
  COD_PRESENT: string;
  COD_TALLA:string;
  CANTIDAD:number;
  Cod_Usuario_Creacion:string;
  Fecha_Creacion:string;
}

@Component({
  selector: 'app-reporte-bolsas-arte',
  templateUrl: './reporte-bolsas-arte.component.html',
  styleUrls: ['./reporte-bolsas-arte.component.scss']
})
export class ReporteBolsasArteComponent implements OnInit {

  Cod_Accion = ''
  Cod_OrdPro=''
  dataForExcel:Array<any> = [];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  formulario = this.formBuilder.group({
    sOP:      ['',Validators.required]
  })

  dataSource: MatTableDataSource<data_det>;
  
  displayedColumns_cab: string[] = [
    'ID_BOLSA',
    'COD_BARRA',
    'COD_ALMACEN_ULT',
    'NUM_MOVSTK_ULT',
    'COD_ORDPRO',
    'COD_PRESENT',
    'COD_TALLA',
    'CANTIDAD',
    'Cod_Usuario_Creacion',
    'Fecha_Creacion'
  ];

  columnsToDisplay: string[] = this.displayedColumns_cab.slice();

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private bolsaService: MantMaestroBolsaService,
    private exceljsService:ExceljsProdProArtesService
  ) { 
    this.dataSource = new MatTableDataSource();
   }

  @ViewChild(MatPaginator) paginator!: MatPaginator;



  ngOnInit(): void {
    //this.buscarInfoBolsasArte()
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


  buscarInfoBolsasArte(){
    if(this.formulario.get('sOP')?.value == ''){
      this.matSnackBar.open('Debe ingresar una OP', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }else{
      this.spinnerService.show();
      this.Cod_Accion = 'L'
      this.bolsaService.getDatosReporteBolsasArte(this.Cod_Accion, this.formulario.get('sOP')?.value, this.range.get('start')?.value, this.range.get('end')?.value).subscribe((res: any) => {
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
  }



  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }


  generateExcel(){
    this.dataForExcel = [];
    //console.log(this.dataSource.data)
    this.dataSource.data.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })
    
    let reportData = {
      title: 'REPORTE BOLSA ARTES',
      data: this.dataForExcel,
      headers: Object.keys(this.dataSource.data[0])
    }
    this.exceljsService.exportExcel(reportData);

  }


}



