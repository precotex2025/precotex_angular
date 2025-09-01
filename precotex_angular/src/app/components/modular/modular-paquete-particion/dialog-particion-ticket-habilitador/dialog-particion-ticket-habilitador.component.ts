import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { GlobalVariable } from 'src/app/VarGlobals';
import { InspeccionPrendaService } from 'src/app/services/modular/inspeccion-prenda.service';


interface data{
  "Ticket_Habilitador": string;
  "CANTIDAD": number;
  "COD_FABRICA": string;
  "COD_ORDPRO": string;
  "COD_PRESENT": string;
  "COD_TALLA": string;
  "DES_PRESENT": number;
  "ICONO_WEB": string;
  "Ruta_Inspeccion": string;
  "Num_Paquete": string;
  "Tipo_Paquete": string;
  "Modulo": string;
  "Compostura": string;
  "Estampado": string;
  "Zurcido": string;
  "Desmanche": string;
  "Retoque": string;
  "Des_Modulo": string;
  "Familia": string;
}


declare var JsBarcode: any;

@Component({
  selector: 'app-dialog-particion-ticket-habilitador',
  templateUrl: './dialog-particion-ticket-habilitador.component.html',
  styleUrls: ['./dialog-particion-ticket-habilitador.component.scss']
})
export class DialogParticionTicketHabilitadorComponent implements OnInit {

  formulario = this.formBuilder.group({
    sExternas: [0],
    sInternas: [0],
  })
  lstRetoque:any
  organico = ''
  Num_Movstk = ''
  Des_Modulo = ''

  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar,
              public dialog_: MatDialogRef<DialogParticionTicketHabilitadorComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: data,
              private inspeccionPrendaService: InspeccionPrendaService,
              private SpinnerService: NgxSpinnerService
            ) 
  {



  }

  ngOnInit(): void {    
    this.getInformacion()
  }

  getInformacion(){
    console.log(this.data)
    this.lstRetoque = this.data
    this.Des_Modulo = this.lstRetoque.Des_Modulo
    this.formulario.controls['sInternas'].setValue(this.lstRetoque.CANTIDAD)
  }

  async generarProceso(){

    try {
      let cantTotal = this.lstRetoque.CANTIDAD
      let cantInternas = this.formulario.get('sInternas').value
      let cantExternas = this.formulario.get('sExternas').value
      
      let cantIngresadas = cantInternas + cantExternas
      let NumParticion = 1

      if (cantIngresadas == cantTotal){
        //preguntar llamado de procesos externos o internos
        this.SpinnerService.show();

        if(cantInternas > 0 && cantExternas > 0){
          NumParticion = 2
        }else{
          NumParticion = 1
        }

        if(cantInternas > 0){
          await this.sendInternasRetoque(cantInternas, NumParticion)
        }

        if(cantExternas > 0){
          await this.sendExternasRetoque(cantExternas, NumParticion)
        }
        
        this.SpinnerService.hide();
        this.dialog_.close(); 
        
        
      }else{
        this.matSnackBar.open('Verifique, particion de cantidades definidas incorrectas', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2000 })
      }

    } catch (error) {
      console.error('Ocurrió un error al ejecutar las funciones:', error);
    }
  }
  
  async sendInternasRetoque(cantInternas, NumParticion){
    console.log(
      'Ticket_Habilitador: ',this.lstRetoque.Ticket_Habilitador,
      'Id: ',this.lstRetoque.Id,
      'Cantidad: ',cantInternas,
      'Num_Paquete: ',this.lstRetoque.Num_Paquete,
      'Tipo_Paquete: ',this.lstRetoque.Tipo_Paquete,
      'Ruta_Inspeccion: ',this.lstRetoque.Ruta_Inspeccion,
      'Tipo_Movimiento: ','I',
      'compostura: ',this.lstRetoque.Compostura,
      'estampado: ',this.lstRetoque.Estampado,
      'zurcido: ',this.lstRetoque.Zurcido,
      'desmanche: ',this.lstRetoque.Desmanche,
      'retoque: ',this.lstRetoque.Retoque,
      'Num_Particion: ', NumParticion,
      'Usuario: ',GlobalVariable.vusu,
    )

    /*return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Tarea Interna asincrónica completada.');
        //this.getOrganico(this.lstEstampado, result[0].Num_Paquete, result[0].Ticket)
        this.getOrganico(this.lstRetoque, 'A01', cantInternas, 'E0000000050')
        resolve();
      }, 2000); // Simulando una demora de 2 segundos
    });*/
    
    this.inspeccionPrendaService.CF_MUESTRA_GENERACION_TICKET_PARTICION_RETOQUE_WEB(
      this.lstRetoque.Ticket_Habilitador,
      this.lstRetoque.Id,
      cantInternas,
      this.lstRetoque.Num_Paquete,
      this.lstRetoque.Tipo_Paquete,
      this.lstRetoque.Ruta_Inspeccion,
      'I',
      this.lstRetoque.Compostura,
      this.lstRetoque.Estampado,
      this.lstRetoque.Zurcido,
      this.lstRetoque.Desmanche,
      this.lstRetoque.Retoque
    ).subscribe(
      (result: any) => {
        console.log(result);
        if (result[0].Respuesta == 'OK') {
          //setTimeout(() => {
            this.SpinnerService.hide();
            //this.movimientoTicket(this.lstRetoque, this.lstRetoque.Num_Paquete, cantInternas, result[0].Ticket, 'I');
            this.getOrganico(this.lstRetoque, this.lstRetoque.Num_Paquete, cantInternas, result[0].Ticket, 'I')
          //}, 1000);
        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
            duration: 5000,
            verticalPosition: 'top'
          })
        }      

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
        verticalPosition: 'top'
    }))
    


  }

  async sendExternasRetoque(cantExternas, NumParticion){
    console.log(
      'Ticket_Habilitador: ',this.lstRetoque.Ticket_Habilitador,
      'Id: ',this.lstRetoque.Id,
      'Cantidad: ',cantExternas,
      'Num_Paquete: ',this.lstRetoque.Num_Paquete,
      'Tipo_Paquete: ',this.lstRetoque.Tipo_Paquete,
      'Ruta_Inspeccion: ',this.lstRetoque.Ruta_Inspeccion,
      'Tipo_Movimiento: ','E',
      'compostura: ',this.lstRetoque.Compostura,
      'estampado: ',this.lstRetoque.Estampado,
      'zurcido: ',this.lstRetoque.Zurcido,
      'desmanche: ',this.lstRetoque.Desmanche,
      'retoque: ',this.lstRetoque.Retoque,
      'Num_Particion: ', NumParticion,
      'Usuario: ',GlobalVariable.vusu,
    )

/*
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Tarea Externa asincrónica completada.');
        this.getOrganico(this.lstRetoque, 'A01', cantExternas, 'E0000000051')
        resolve();
      }, 1500); // Simulando una demora de 1.5 segundos
    });
    */


    this.inspeccionPrendaService.CF_MUESTRA_GENERACION_TICKET_PARTICION_RETOQUE_WEB(
      this.lstRetoque.Ticket_Habilitador,
      this.lstRetoque.Id,
      cantExternas,
      this.lstRetoque.Num_Paquete,
      this.lstRetoque.Tipo_Paquete,
      this.lstRetoque.Ruta_Inspeccion,
      'E',
      this.lstRetoque.Compostura,
      this.lstRetoque.Estampado,
      this.lstRetoque.Zurcido,
      this.lstRetoque.Desmanche,
      this.lstRetoque.Retoque
    ).subscribe(
      (result: any) => {
        console.log(result);
        if (result[0].Respuesta == 'OK') {
          this.movimientoTicket(this.lstRetoque, this.lstRetoque.Num_Paquete, cantExternas, result[0].Ticket, 'E');
          /*setTimeout(() => {
            //this.SpinnerService.hide();
            this.getOrganico(this.lstRetoque, this.lstRetoque.Num_Paquete, cantExternas, result[0].Ticket)
          }, 1000);
          */
        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
            duration: 5000,
            verticalPosition: 'top'
          })
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
        verticalPosition: 'top'
    }))
    
  }

  getOrganico(item, Num_Paquete, Cantidad, Ticket, Tipo_Movimiento) {
    //this.operacionImprimir(item, Num_Paquete, Cantidad, Ticket, Tipo_Movimiento);
    this.inspeccionPrendaService.devuelve_Organico(
      item.COD_ORDPRO
    ).subscribe(
      (result: any) => {
        console.log(result['Organico'].trim());
        if (result['Organico'].trim() == '') {
          this.organico = '';
        } else {
          this.organico = 'ORGANICO';
        }
        this.operacionImprimir(item, Num_Paquete, Cantidad, Ticket, Tipo_Movimiento);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))
  }

  operacionImprimir(item, Num_Paquete, Cantidad,Ticket, Tipo_Movimiento) {
    this.createBarcode(Ticket);
    let printContents, popupWin, cod_referencia;


    cod_referencia = '-';

    printContents = document.getElementById('print-section').innerHTML;
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
        </style>
    
        <title>Print tab</title>
        <style>
            .center {
                margin: auto;
                width: 50%;
                padding: 9px;
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
              margin-botton:4px;
            }
            #barcode{
              width:190px;
              max-height: 60px;
              height: 60px;
            }

            svg{
              width:278px;
              height: 55px;
            }

            .print{
              display:flex;
              justify-content: space-between;
            }

            .clase{
              display:flex;
              flex-direction:column;
            }
        </style>
    </head>
    
    <body onload="window.print(); window.close();">
        <div style="display:flex; position:absolute; bottom: 0px;">
            <div class="caja" style="width:200px;font-size:9px;">
              <div class="flex">
   
                  <div class="clase" style="width:100%;font-size:9px;margin-left:5px;">
                  <div style="display:flex;flex-direction: column; align-items: center;">
                    <div style="display:flex; justify-content:space-around;">
                      <span>Ruta Insp: ${item.Ruta_Inspeccion} </span>
                      <span> OP: ${item.COD_ORDPRO}   </span>
                    </div>                   
                    <div style="display:flex; justify-content:space-around;">
                        <span> Prds: ${Cantidad} </span>
                        <span> Talla: ${item.COD_TALLA} </span>
                    </div>
                  </div>
                  <div style="display:flex; flex-direction:column; ">
                    <div style="display:flex;justify-content:center;">
                      <span>  ${item.DES_PRESENT}</span>
                    </div>
                    <div style="display:flex; justify-content:end;">
                      <span> ${this.organico}</span>
                    </div>
                  </div>
                  
                    <div>
                        <!--?xml version="1.0" encoding="UTF-8"?-->
                  </div>

                </div>
              </div>
  
              <div class="barra">
                ${printContents}
                <span style="text-align:center; font-size:9px; margin-botton: 2px;">Modulo: ${this.Des_Modulo} - Pqte: ${Num_Paquete}</span>
              </div>
            </div>

            <div class="caja" style="width:100%;font-size:9px;margin-left: 65px;">
              <div class="flex" style="flex-direction:column;">
                  <div class="print caja" style="width:100%;font-size:9px; margin-left:5px;">
                    <div style="display:flex; justify-content:center;">
                        <span>Ruta Insp: ${item.Ruta_Inspeccion} OP: ${item.COD_ORDPRO}  </span> </br>
                    </div>                
                    <div style="display:flex; justify-content:center; margin-left:5px;">
                        <span> Prds: ${Cantidad}  Talla: ${item.COD_TALLA} ${item.DES_PRESENT}</span>
                    </div>
                    <div style="display:flex; justify-content:center; margin-left:5px;">
                      <span style="text-align:center">Mov: ${Tipo_Movimiento}- ${this.Num_Movstk}</span> 
                    </div>          
                    <div style="display:flex; justify-content:end;">
                      <span> ${this.organico}</span>
                    </div>
                </div>
              </div>
              <div class="flex">
                  <div class="print" style="width:100px;font-size:9px">
                    <center>
                        ${printContents}
                    </center>
                  </div>
              </div>
            </div>
        </div>
        <br><br>
    </body>
    
    </html>`
    );
    popupWin.document.close();
  }

  createBarcode(texto) {

    var id = '#barcode';
    JsBarcode(id, texto, {
      format: 'CODE128',
      width: 2,
      height: 66,
      marginBottom: 2
    });

  }

  
  movimientoTicket(item, Num_Paquete, cantidad, Ticket, Tipo_Movimiento) {
    this.SpinnerService.show();
    this.inspeccionPrendaService.CF_MODULAR_MOVI_PARTICION_AUTOMATICO(
      item.Modulo,
      item.Familia,
      GlobalVariable.vusu,
      Ticket,
      Tipo_Movimiento
    ).subscribe(
      (result: any) => {
        console.log(result);
        if(result == false){
          this.matSnackBar.open('Movimiento incorrecto, verifique Stock', 'Cerrar', {
            duration: 5000,
            verticalPosition: 'top'
          })  
          this.SpinnerService.hide();      
        }else{
          this.Num_Movstk = result[0].NUM_MOVSTK;
          setTimeout(() => {
            this.SpinnerService.hide();
            this.getOrganico(item, Num_Paquete, cantidad, Ticket, Tipo_Movimiento)
          }, 2000);
        }

      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 5000,
          verticalPosition: 'top'
        })
      })


  }
  

}

