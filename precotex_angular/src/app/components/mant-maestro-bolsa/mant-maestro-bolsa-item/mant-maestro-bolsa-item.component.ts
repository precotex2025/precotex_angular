import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { IngresoRolloTejidoService } from 'src/app/services/ingreso-rollo-tejido.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { ActivatedRoute, Router } from '@angular/router';
//import { DialogConfirmacionComponent } from '../dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { data, param } from 'jquery';

import { DialogMaestroBolsaItemComponent } from './dialog-maestro-bolsa-item/dialog-maestro-bolsa-item.component';
import { DialogMaestroBolsaTransComponent } from './dialog-maestro-bolsa-trans/dialog-maestro-bolsa-trans.component';
import { MantMaestroBolsaItemDetComponent } from '../mant-maestro-bolsa-item-det/mant-maestro-bolsa-item-det.component';
import { Result } from '@zxing/library';

import { SelectionModel } from '@angular/cdk/collections';
import { MantMaestroBolsaItemService } from 'src/app/services/mant-maestro-bolsa-item.service';
import { MantMaestroBolsaItemDetService } from 'src/app/services/bolsa/mant-maestro-bolsa-item-det.service';

interface data_det {
  Id_Bolsa: number,
  Id_Det: number,
  Id_Bolsa_Det: number,
  Cod_OrdPro: string,
  Cod_Barra: string,
  Cod_Almacen_Ult: string,
  Num_MovStk_Ult: string,
  Cod_Usuario_Creacion: string,
  Fecha_Creacion: string,
  Cod_Usuario_Modificacion: string,
  Fecha_Modificacion: string
}

interface ticket {
  Id_Bolsa: number,
  Cod_OrdPro: string,
  Des_Present: string,
  Cod_Talla: string,
  Num_SecOrd: string,
  Cantidad: number
}

declare var JsBarcode: any;

@Component({
  selector: 'app-mant-maestro-bolsa-item',
  templateUrl: './mant-maestro-bolsa-item.component.html',
  styleUrls: ['./mant-maestro-bolsa-item.component.scss']
})
export class MantMaestroBolsaItemComponent implements OnInit {

  displayedColumns: string[] = [
    'select',
    'Id_Bolsa_Det',
    'Cod_Barra',
    'Cod_Almacen_Ult',
    'Num_MovStk_Ult',
    'Cod_Usuario_Creacion',
    'Fecha_Creacion',
    'Cod_Usuario_Modificacion',
    'Fecha_Modificacion',
    'acciones'
  ];

  Cod_Usuario = GlobalVariable.vusu;
  imprimirTicket: boolean = false;
  imprimirTicket2: boolean = false;
  dataTickets: Array<any> = [];
  dataTickets2: Array<any> = [];

  dataSource: MatTableDataSource<data_det>;
  dataSource2: MatTableDataSource<any>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  Ticket = '';
  Flg_Edita: boolean = true;

  selection = new SelectionModel<any>(true, []);

  Id = 0;
  Id_Det = 0;
  Id_Bolsa_Det = 0;
  Cod_Barra = '';
  Org = '';
  hijo = '';

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private _router: Router,
    private route: ActivatedRoute,
    private bolsaitemService: MantMaestroBolsaItemService,
    private bolsaitemdetService: MantMaestroBolsaItemDetService,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); this.dataSource2 = new MatTableDataSource }

  ngOnInit(): void {
    this.route.queryParams.subscribe((res) => {
      console.log('mant: ', res)
      if (res != null) {
        this.Id = res['Id'];
        this.Id_Det = res['Id_Det'];
        this.Flg_Edita = String(res['Flg_Edita']) == "true" ? true : false;
      }
    });

    this.obtenerDatos();
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

  openImprimir() {
    //console.log(this.selection.selected);
    if (this.selection.selected.length > 0) {
 
      this.dataTickets2 = this.selection.selected;
      console.log('-----------------------------')
      console.log(this.dataTickets2)
      console.log('-----------------------------')

      this.dataTickets2 = this.dataTickets2.filter(element => {
        return element.Conteo > 0
      });
      this.imprimirTicket2 = true;
      this.dataTickets2.forEach((element, index) => {
        console.log(index);
        var Id = element.Id_Bolsa;
        var Id_Det = element.Id_Bolsa_Det;
        var Cod_Barra = element.Cod_Barra;



        if (element.Conteo > 0) {
          this.createBarcode2(index, element.Cod_Barra);
          this.dataTickets = [];
          this.SpinnerService.show();
          this.bolsaitemdetService.obtenerDatos_D(
            'V',
            Id,
            Id_Det,
            0,
            '',
            0,
            '',
            '',
            0,
          ).subscribe(
            (result: any) => {
              this.SpinnerService.hide();
              if (result.length > 0) {
                if (result.length > 0) {
                  element.data = result;
                 
                  var total = 0;
                  result.forEach(element => {
                    total += element.Cantidad;
                  });

                  element.total = total;
                }

              }
            },
            (err: HttpErrorResponse) => {
              this.SpinnerService.hide();
              this.matSnackBar.open(err.message, 'Cerrar', {
                duration: 1500,
              })
            })
        }

      });




      console.log(this.dataTickets2)
      this.SpinnerService.show();
      setTimeout(() => {
        this.imprimir();
        this.SpinnerService.hide();
      }, 5000);

    } else {
      this.matSnackBar.open('Debes seleccionar los registros a imprimir.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
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

  onProcesoSelectedBultos(data: any) {
    console.log(data);
  }

  OpenDeleteConfirmacion(data) {
    if (confirm('Esta seguro(a) de eliminar el siguiente registro?')) {
      this.SpinnerService.show();
      this.bolsaitemService.eliminarDatos_S(
        'D',
        data.Id_Bolsa,
        data.Id_Bolsa_Det,
        '',
        '',
        ''
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Se elimino el registro correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
            this.obtenerDatos();
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        })
    }
  }

  obtenerDatos() {
    this.dataSource.data = [];
    this.SpinnerService.show();
    this.bolsaitemService.obtenerDatos_S(
      'V',
      this.Id,
      0,
      '',
      '',
      ''
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataSource.data = result;
          console.log(this.dataSource.data);
        } else {
          this.matSnackBar.open('No se encontraron registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }

  openDialogBarra() {
    let dialogRef = this.dialog.open(DialogMaestroBolsaItemComponent, {
      disableClose: false,
      //minWidth: '600px',
      panelClass: 'my-class',
      maxWidth: '95%',
      data: {
        Id: this.Id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        this.obtenerDatos();
        this.openDialogBarra();
      }

    })
  }

  openDialogTransferencia(data) {
    let dialogRef = this.dialog.open(DialogMaestroBolsaTransComponent, {
      disableClose: false,
      minWidth: '30%',
      panelClass: 'my-class',
      maxWidth: '100%',
      minHeight: '75%',
      maxHeight: '100%',
      data: {
        Id_Bolsa: data.Id_Bolsa,
        Id_Bolsa_Det: data.Id_Bolsa_Det,
        Cod_Barra: data.Cod_Barra
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.obtenerDatos();
      }

    })
  }

  OpenDetalleItem(data) {
    let datos = {
      Id: data.Id_Bolsa,
      Id_Det: data.Id_Bolsa_Det,
      Cod_Barra: data.Cod_Barra,
      Id_Bolsa: data.Id_Bolsa,
      Flg_Edita: this.Flg_Edita
    }
    this._router.navigate(['/MantMaestroBolsaItemDet'], { skipLocationChange: true, queryParams: datos });
  }

  traerOp(data) {
    this.dataTickets = [];
    this.SpinnerService.show();
    this.bolsaitemdetService.obtenerDatos_D(
      'X',
      data.Id,
      data.Id_Det,
      0,
      '',
      0,
      '',
      '',
      0,
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataTickets = result;
          this.dataSource2.data = this.dataTickets;
          this.displayedColumns = Object.keys(result[0])
          this.imprimirTicket = true;

          this.createBarcode(data.Cod_Barra);

          setTimeout(() => {
            this.imprimir();
          }, 1000);


        } else {
          this.matSnackBar.open('No se encontraron registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }

  traerColor(data) {
    this.dataTickets = [];
    this.SpinnerService.show();
    this.bolsaitemdetService.obtenerDatos_D(
      'V',
      data.Id,
      data.Id_Det,
      0,
      '',
      0,
      '',
      '',
      0,
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataTickets = result;

          this.imprimirTicket = true;
          console.log("Result: ", this.dataTickets);

        } else {
          this.matSnackBar.open('No se encontraron registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }

  traerDatos(data) {
    console.log("traer datos: ", data);
    let datos = {
      Id: data.Id_Bolsa,
      Id_Det: data.Id_Bolsa_Det,
      Cod_Barra: data.Cod_Barra
    }
    this.traerOp(datos)
    console.log("ops: ", datos);
    this.traerColor(datos)
  }

  createBarcode2(index, Cod_Barra) {
    setTimeout(() => {
      var id = '#barcode' + index;
      console.log(id);
      JsBarcode(id, Cod_Barra);
    }, 1000);
  }

  createBarcode(Cod_Barra) {

    setTimeout(() => {
      var id = '#barcode';
      console.log(id);
      JsBarcode(id, Cod_Barra);
    }, 1000);
  }

  imprimir() {
    let printContents2, popupWin, cod_referencia;


    cod_referencia = '-';
    //onload="window.print();window.close();"
    //printContents = document.getElementById('print-section').innerHTML;
    printContents2 = document.getElementById('ticket').innerHTML;
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
        </style>
    
        <title>Print tab</title>
        <style>
            .center {
                margin: auto;
                width: 50%;
                padding: 9px;
            }
            .total { 
              display:flex;  width:100%;
              height: 50%;
              margin-top: 5px;
            }
  
            .total2 { 
              display:flex; width:400px;
              
              flex-wrap: wrap;
            }
            td {
              padding: 2px;
              padding-right: 25px;
              text-align: center;
            }
            th {
              padding-right: 25px;
              text-align: center;
            }
            .head{
              padding: 8px;
              margin-left: 25px;
            }
            .head2{
              padding: 8px;
              margin-left: 25px;
            }
            .body{
              margin-right: 200px;
            }
            .body2{
              margin-right: 170px;
            }
            .flex{
              margin-bottom: 0px;
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
    </head>
    
    <body onload="window.print();window.close();" style="margin:0px; padding:0px;">
        ${printContents2}
    </body>
    
    </html>`
    );
    popupWin.document.close();
  }

  // imprimir() {
  //   let printContents2, popupWin, cod_referencia;


  //   cod_referencia = '-';
  //   //onload="window.print();window.close();"
  //   //printContents = document.getElementById('print-section').innerHTML;
  //   printContents2 = document.getElementById('ticket').innerHTML;
  //   console.log(printContents2)
  //   popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  //   popupWin.document.open();
  //   popupWin.document.write(`
  //   <html>
  //   <head>
  //       <meta charset="utf-8">
  //       <meta http-equiv="X-UA-Compatible" content="IE=edge">
  //       <meta name="viewport" content="width=device-width, initial-scale=1">


  //       <!-- Fonts -->
  //       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css"
  //           integrity="sha384-XdYbMnZ/QjLh6iI4ogqCTaIjrFk87ip+ekIjefZch0Y+PvJ8CDYtEs1ipDmPorQ+" crossorigin="anonymous">
  //       <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700">
  //       <!-- Styles -->
  //       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css"
  //           integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
  //       <style>
  //           .print {
  //               font: bold 2em "Trebuchet MS", Arial, Sans-Serif;
  //           }
  //       </style>

  //       <title>Print tab</title>
  //       <style>
  //           .center {
  //               margin: auto;
  //               width: 50%;
  //               padding: 9px;
  //           }
  //           .total { 
  //             display:flex;  width:100%;
  //             height: 50%;
  //             margin-top: 5px;
  //           }

  //           .total2 { 
  //             display:flex; width:400px;
  //             height: 0px;
  //             flex-wrap: wrap;
  //           }
  //           td {
  //             padding: 2px;
  //             padding-right: 35px;
  //             text-align: center;
  //           }
  //           th {
  //             padding-right: 35px;
  //             text-align: center;
  //           }
  //           .caja{
  //             display:flex;
  //             flex-direction: column;

  //           }
  //           .flex{
  //             display:flex;
  //             text-align: center;
  //             margin-bottom: 0px;

  //             padding-left: 30px;
  //           }
  //           .barra{
  //             width:100%;
  //             display:flex;
  //             flex-direction:column;
  //           }
  //           .barcode{
  //             width:350px !important;
  //             max-width: 420px !important;
  //             max-height: 120px !important;
  //             height: 130px !important;
  //             margin-top: 20px;
  //             margin-left: 20px;
  //             text-align: center;
  //           }

  //           svg{
  //             width:1120px;
  //             height: 590px;
  //           }
  //       </style>
  //   </head>

  //   <body >
  //       ${printContents2}
  //   </body>

  //   </html>`
  //   );
  //   popupWin.document.close();
  // }

}
