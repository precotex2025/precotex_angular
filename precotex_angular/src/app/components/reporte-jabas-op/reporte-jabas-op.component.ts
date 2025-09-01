import { Component, OnInit, AfterViewInit, inject,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MantMaestroBolsaService } from 'src/app/services/mant-maestro-bolsa.service';
import { format } from 'path';


interface data_det {
  ID_BOLSA: number;
  ID_BOLSA_DET: number;
  COD_BARRA: string;
  COD_ORDPRO: string;
  COD_PRESENT: number;
  PRESENT: string;
  TALLA: string;
  CANTIDAD: string;
  NUM_SECORD: string;
  COD_ITEM: string;
  Org: string;
  COD_ESTCLI: string;
}

interface Barra {
  COD_BARRA:string;
  COD_ESTCLI:string;
  COD_ITEM: string;
  COD_ORDPRO: string;
  ID_BOLSA: number;
  NUM_SECORD: string;
  Org: string;
  PRESENT:string;
  TALLA:string;
  CANTIDAD:number;
}

declare var JsBarcode: any;

@Component({
  selector: 'app-reporte-jabas-op',
  templateUrl: './reporte-jabas-op.component.html',
  styleUrls: ['./reporte-jabas-op.component.scss']
})
export class ReporteJabasOpComponent implements OnInit {

  dataItemsJaba:any = []
  flgInfoJabVisible: boolean = false
  boxImprimirTicket: boolean = false
  totalCantidad = 0
  idBolsas = "";

  dataSource: MatTableDataSource<data_det>;
  dataTickets:any = [];
  
  displayedColumns_cab: string[] = [
    //'select',
    'ID_BOLSA',
    'COD_BARRA',
    'COD_ORDPRO',
    'PRESENT',
    'TALLA',
    'CANTIDAD',
  ];

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    sBarra: ['',Validators.required]
  })  

  selection = new SelectionModel<any>(true, []);

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, 
    private bolsaService: MantMaestroBolsaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService
  ) {  
    this.dataSource = new MatTableDataSource();
  }


  ngOnInit(): void {
    this.loadDataInicial()
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  loadDataInicial(){

  }

  getInfoJaba(){
    if(this.formulario.valid){
      this.dataSource.data = []
      this.dataItemsJaba = []
      this.totalCantidad = 0
      let barra = this.formulario.get('sBarra').value
      this.SpinnerService.show();
        this.bolsaService.obtenerDatosProcesos(
          'R',barra
        ).subscribe(
          (result: any) => {
            console.log(result)  
            if (result.length > 0) {
              this.dataSource.data = result
              this.dataItemsJaba = result

              let indices = [];

              result.forEach(element => {
                this.totalCantidad += element.CANTIDAD;
                indices.push(element.ID_BOLSA);
              });
              this.flgInfoJabVisible = true

              // Quitar Id_Bolsas duplicados
              const unicos = indices.filter((valor,indice) => {
                return indices.indexOf(valor) === indice 
              })

              // Concatenar Id_bolsas
              unicos.forEach((e) => {
                this.idBolsas = this.idBolsas.concat(e).concat(" / ");
              })
              this.idBolsas = this.idBolsas.substring(0, this.idBolsas.length - 2);

            } else {
              this.dataSource.data = [];
              this.dataItemsJaba = []
              this.totalCantidad = 0
              this.flgInfoJabVisible = false
              this.matSnackBar.open('No se encontraron registros.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
            this.SpinnerService.hide();
          },
          (err: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            })
          })
    }else{
      this.matSnackBar.open('Ingresar campo requerido', 'Cerrar', {
        duration: 2000,
      })
    }

  }

  openImprimir() {
    this.modalImprimir()
  }


  modalImprimir(){

    //this.dataItemsJaba.forEach((element, index) => {
      this.createBarcode(this.dataItemsJaba[0].COD_BARRA, 0);
    //});
    
    let printContents, popupWin

    printContents = document.getElementById('ticket').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    
    
        <!-- Fonts -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css"
            integrity="sha384-XdYbMnZ/QjLh6iI4ogqCTaIjrFk87ip+ekIjefZch0Y+PvJ8CDYtEs1ipDmPorQ+" crossorigin="anonymous">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700">
        <!-- Styles -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css"
            integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
        <style>
          .print {
            font: bold 2em "Trebuchet MS", Arial, Sans-Serif;
          }

          .clase {
            font: bold 2em "Trebuchet MS", Arial, Sans-Serif;
          }
          
          .center {
            margin: auto;
            width: 50%;
            padding: 9px;
          }
          
          .barcode{
            width:100% !important;
            max-width: 550px !important;
            max-height: 100% !important;
            height: 150px !important;
            padding: 1px;
            text-align: center;
          }

          .svg{
            width:1120px;
            height: 590px;
          }
        </style>
    
        <title>Print tab</title>
    </head>
    
    <body onload="window.print(); window.close();">
        ${printContents}
    </body>
    
    </html>`
    );
    popupWin.document.close();
  }

  createBarcode(Cod_Barra, index) {

      var id = '#barcode';
      JsBarcode(id, Cod_Barra);

  }


 

}

