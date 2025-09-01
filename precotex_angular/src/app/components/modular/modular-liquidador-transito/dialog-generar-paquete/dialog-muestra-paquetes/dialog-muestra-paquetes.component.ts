import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';


interface data {
  datos: any,
  paquetes:any
}

interface data_det {
  COD_ALMACEN: string,
  COD_FABRICA: string,
  COD_ORDPRO: string,
  COD_PLANTA: string,
  COD_PRESENT: string,
  COD_TALLA: string,
  DES_PRESENT: string,
  NUM_PAQUETE: string,
  NUM_REALIZADAS_POR_CONFIRMAR_ACABADOS: string,
  OPCION: string,
  POSICION: string,
  PRENDASPAQ: string,
  Sel: string,
}

@Component({
  selector: 'app-dialog-muestra-paquetes',
  templateUrl: './dialog-muestra-paquetes.component.html',
  styleUrls: ['./dialog-muestra-paquetes.component.scss']
})
export class DialogMuestraPaquetesComponent implements OnInit {



  displayedColumns: string[] = [
    'DES_PRESENT',
    'COD_TALLA',
    'PRENDASPAQ',
    'NUM_PAQUETE',
    'COD_ORDPRO'
  ];


  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();

  array: Array<any> = [];
  real: Array<any> = [];


  selectedRowIndex = -1;
  dataOp:data_det;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    //private liquidadorTransitoService: LiquidadorTransitoService,
    @Inject(MAT_DIALOG_DATA) public data: data) {

    this.dataSource = new MatTableDataSource();

  }

  ngOnInit(): void {
    console.log(this.data);
    this.dataSource.data =  this.data.paquetes;
    
  }



  
}
