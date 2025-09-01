import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { LiquidadorTransitoService } from 'src/app/services/modular/liquidador-transito.service';


interface data {
  datos: any
}

interface data_det {
  PAQUETE: string,
  COD_PRESENT: string,
  PRESENTACIÓN: string,
  TALLA: string,
  PRENDAS: string,
  KEY: string,
  POSICION: string,
  SECTOR: string,
  IMPRESO: string,
  USUARIO: string,
  FECHA: string,
  ESTACION: string
}



declare var JsBarcode: any;
@Component({
  selector: 'app-dialog-imprimir-ticket',
  templateUrl: './dialog-imprimir-ticket.component.html',
  styleUrls: ['./dialog-imprimir-ticket.component.scss']
})
export class DialogImprimirTicketComponent implements OnInit {
  displayedColumns: string[] = [
    'PAQUETE',
    'PRESENTACIÓN',
    'TALLA',
    'PRENDAS',
    'KEY',
    'POSICION',
    'SECTOR',
    'IMPRESO',
    'USUARIO',
    'FECHA'
  ];

  Num_Movstk:any = '';
  imprimirTicket: boolean = false;
  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();

  array: Array<any> = [];
  dataTickets: Array<any> = [];
  arrayPaquetes: Array<any> = [];
  dataPaquetes: string = '';
  organico = '';
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private liquidadorTransitoService: LiquidadorTransitoService,
    @Inject(MAT_DIALOG_DATA) public data: data
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    console.log(this.data.datos);
    this.obtenerPrendasDisponibles();
    this.getOrganico();
    console.log(this.organico);
  }

  getOrganico(){
    this.liquidadorTransitoService.devuelve_Organico(
      this.data.datos.Cod_OrdPro
    ).subscribe(
      (result: any) => {
        console.log(result['Organico'].trim());
        if(result['Organico'].trim() == ''){
          this.organico = '';
        }else{
          this.organico = 'ORGANICO';
        }     
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))
  }
  

  getTickets() {

    this.liquidadorTransitoService.CF_Obtener_TicketAcb(
      GlobalVariable.vusu
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        console.log(result);
        this.dataTickets = result;

        if (this.dataTickets.length > 0) {
          this.imprimirTicket = true;
          for (let i = 0; i < this.dataTickets.length; i++) {
            this.createBarcode(i, this.dataTickets[i].COD_BR2);
            console.log(this.dataTickets[i].COD_BR2);
          }

          setTimeout(() => {
            this.imprimir();
          }, 1000);

        } else {
          this.matSnackBar.open('No se encontraron registros.', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });
      })
  }


  generarMovTickets() {

    this.liquidadorTransitoService.SM_MUESTRA_PAQUETES_A_MOVIMIENTO_NEW(
      GlobalVariable.vusu
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        console.log(result);    
        if(result != false && result != 'false')   {
          this.Num_Movstk = result[0].Num_MovStk
        }
        
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });
      })
  }

  createBarcode(index, texto) {

    setTimeout(() => {
      var id = '#barcode' + index;
      console.log(id);
      JsBarcode(id, texto);
    }, 1000);


  }


  imprimir() {

    let printContents, printContents2, popupWin, cod_referencia;


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
              height: 81px;
              margin-top: 24px;
            }

            .total2 { 
              display:flex; width:400px;
              margin-bottom:-2px;
              flex-wrap: wrap;
            }
            td {
                padding: 9px;
            }
            .caja{
              display:flex;
              flex-direction: column;
            }
            .flex{
              display:flex;
            }
            .barra{
              width:100%;
              display:flex;
              flex-direction:column;
            }
            .barcode{
              width:195px !important;
              max-height: 48px !important;
              height: 48px !important;
            }

            svg{
              width:278px;
              height: 50px;
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

  obtenerPrendasDisponibles() {
    this.liquidadorTransitoService.SM_MUESTRA_PAQUETES_A_IMPRIMIR_PRENDAS_INSPECCION_NEW(
      this.data.datos.Cod_Fabrica,
      this.data.datos.Cod_OrdPro,
      this.data.datos.Cod_Tarifado,
      this.data.datos.Cod_Variante_Tarifado,
      this.data.datos.Color,
      'A',
      '',
      this.data.datos.Cod_Present,
      GlobalVariable.vusu
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        console.log(result);
        this.array = result;
        if (this.array.length > 0) {
          this.dataSource.data = this.array;
        } else {
          this.matSnackBar.open('No se encontraron registros.', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });
      })
  }

  changeImpreso(event, data_det) {
    console.log(event)
    if (event.checked == true) {
      if (this.arrayPaquetes.length == 0) {
        this.arrayPaquetes.push(data_det);
      } else {

        var array = this.arrayPaquetes.filter(element => {
          element.PAQUETE == data_det.PAQUETE
        });
        if (array.length == 0) {
          this.arrayPaquetes.push(data_det);
        }
      }
    } else {
      this.arrayPaquetes = this.arrayPaquetes.filter(element => {
        return element.PAQUETE !== data_det.PAQUETE;
      });
    }

  }
  getGeneraTickets() {
    console.log(this.arrayPaquetes);
    this.dataPaquetes = '';
    // this.arrayPaquetes.forEach(element => {
    //   this.dataPaquetes+= element.PAQUETE + ',';
    // });

    for (let i = 0; i < this.arrayPaquetes.length; i++) {
      var concatenar = '';
      if ((i + 1) < this.arrayPaquetes.length) {
        concatenar = ',';
      } else {
        concatenar = '';
      }
      this.dataPaquetes += this.arrayPaquetes[i].PAQUETE + concatenar;

    }


    this.SpinnerService.show();
    this.liquidadorTransitoService.CS_GENERA_ARCHIVO_TICKETS_TOTAL_PRENDAS_INSP_ACABADO(
      this.data.datos.Cod_OrdPro,
      this.data.datos.Cod_Present,
      this.dataPaquetes,
      'A',
      '00',
      GlobalVariable.vusu
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        console.log(result);
        this.array = result;
        this.generarMovTickets();
        this.getTickets();
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });
      })
  }

}
