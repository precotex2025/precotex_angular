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
  TEMPORADA: number;
  ESTILO_CLIENTE: string;
  OP: string;
  TIPO_PRENDA: string;
  COLOR: string;
  TALLA: string;
  STOCK_PRENDA: string;
}

@Component({
  selector: 'app-reporte-almacen-arte',
  templateUrl: './reporte-almacen-arte.component.html',
  styleUrls: ['./reporte-almacen-arte.component.scss']
})
export class ReporteAlmacenArteComponent implements OnInit {

  dataForExcel:Array<any> = [];
  lstOperacionColor:any = [];
  Cod_Accion = ''
  Cod_OrdPro = ''

  formulario = this.formBuilder.group({
    sOP:      ['',Validators.required],
    sEstilo:      [''],
    sColor:      ['']
  })

  dataSource: MatTableDataSource<data_det>;
  
  displayedColumns_cab: string[] = [
    'TEMPORADA',
    'ESTILO_CLIENTE',
    'OP',
    'TIPO_PRENDA',
    'COLOR',
    'TALLA',
    'STOCK_PRENDA',
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



  ngOnInit(): void {
    this.formulario.controls['sEstilo'].disable()
  }

  buscarEstiloClientexOP(){
    this.formulario.controls['sEstilo'].setValue('')
    this.formulario.controls['sColor'].setValue('')
    this.Cod_OrdPro = this.formulario.get('sOP')?.value
    if(this.Cod_OrdPro.length == 5){
      this.Cod_Accion   = 'E'
      console.log(this.Cod_Accion,this.Cod_OrdPro)
      this.spinnerService.show();
      this.bolsaService.getDatosReporteAlmacenArte(
        this.Cod_Accion, this.formulario.get('sOP')?.value, ''
        ).subscribe(
        (result: any) => {
          if(result.length > 0){
            this.formulario.controls['sEstilo'].setValue(result[0].Cod_EstCli)
            this.lstOperacionColor = []
            this.CargarOperacionColor()
            this.spinnerService.hide();
          }else{
            this.matSnackBar.open('La OP no existe...', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            this.spinnerService.hide();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
        
    }else{
      this.lstOperacionColor = []
      this.formulario.controls['sEstilo'].setValue('')
      this.formulario.controls['sColor'].setValue('')
      this.dataSource.data = []
    }

  }

  CargarOperacionColor() {
    this.bolsaService.SM_Presentaciones_OrdPro(this.Cod_OrdPro).subscribe(
      (result: any) => {
        //console.log(result)
        this.lstOperacionColor = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  buscarInfoBolsasArte(){
    if(this.formulario.get('sOP')?.value == ''){
      this.matSnackBar.open('Debe ingresar una OP', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }else{

      let op = this.formulario.get('sOP')?.value
      let color = (this.formulario.get('sColor').value == undefined) ? '':this.formulario.get('sColor').value
      this.Cod_Accion   = 'L'

      this.bolsaService.getDatosReporteAlmacenArte(
        this.Cod_Accion, op, color
        ).subscribe(
        (result: any) => {
          console.log(result)
          if(result.length > 0){
            this.dataSource.data = result;
            this.spinnerService.hide();
          }else{
            this.matSnackBar.open('No se tiene informacion', 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            this.spinnerService.hide();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    }
  }


  generateExcel(){
    this.dataForExcel = [];
    //console.log(this.dataSource.data)
    this.dataSource.data.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })
    
    let reportData = {
      title: 'REPORTE ALMACEN ARTES',
      data: this.dataForExcel,
      headers: Object.keys(this.dataSource.data[0])
    }
    this.exceljsService.exportExcel(reportData);

  }


}



