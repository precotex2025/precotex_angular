import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalVariable } from 'src/app/VarGlobals';
import { InspeccionPrendaService } from 'src/app/services/modular/inspeccion-prenda.service';


interface Modulo {
  Cod_Modulo: string;
  Des_Modulo: string;
}

declare var JsBarcode: any;

@Component({
  selector: 'app-modular-ticket-recuperacion',
  templateUrl: './modular-ticket-recuperacion.component.html',
  styleUrls: ['./modular-ticket-recuperacion.component.scss']
})
export class ModularTicketRecuperacionComponent implements OnInit {

  Id = 0
  Tipo_Sub_Proceso = ''
  Des_Tipo_Proceso = ''

  //flg para dar clase css cuando es reproceso o proceso normal
  grid_border = ' border: 1px solid #337ab7;'
  background = 'background-color: #2962FF; border: 1px solid #2962FF;'
  btn_background = 'background-color: #2962FF; color: #ffffff;'

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Modulo: ['00R'],
    Familia: ['']
  })

  ImagePath = 'http://192.168.1.36/Estilos/default.jpg'


  listar_operacionModulo: Modulo[] = [];
  porFinalizar: Array<any> = [];

  dataPrendasImp: Array<any> = [];
  Des_Modulo = '';
  Ticket = '';


  Num_Movstk = '';
  organico = '';
  constructor(private formBuilder: FormBuilder, private matSnackBar: MatSnackBar, private inspeccionPrendaService: InspeccionPrendaService) { }

  changeModulo(event) {
    console.log(event);
    if (event.value != '') {
    }
  }

  ngOnInit(): void {
    this.MuestraModulo();
  }

  MuestraModulo() {
    this.inspeccionPrendaService.CF_MUESTRA_MODULO(
    ).subscribe(
      (result: any) => {
        this.listar_operacionModulo = result;
        this.listar_operacionModulo = this.listar_operacionModulo.filter(elem => {
          return elem.Cod_Modulo == '00R';
        });
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
        verticalPosition: 'top'
      }))

  }

  listadoTicket() {
    this.inspeccionPrendaService.CF_MUESTRA_LISTADO_TICKET_R_WEB(
      this.formulario.get('Modulo').value,
      this.formulario.get('Familia').value
    ).subscribe(
      (result: any) => {
        console.log(result);
        if (result.length > 0) {
          this.dataPrendasImp = result;
        } else {
          this.matSnackBar.open('No se encontraron pendientes de Impresión dentro del módulo seleccionado.', 'Cerrar', {
            duration: 5000,
          });
          this.dataPrendasImp = [];
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
        verticalPosition: 'top'
      }))
  }

  touchTicket(item) {
    console.log(item);

    var ruta_prenda = item.Ruta_Inspeccion.split('-');
    ruta_prenda = ruta_prenda.filter(element => {
      return element != '';
    });

    var compostura = '';
    var estampado = '';
    var zurcido = '';
    var desmanche = '';
    var retoque = '';

    if (ruta_prenda.length > 1) {
      ruta_prenda.forEach(element => {
        if (element == 'C') {
          compostura = '1';
        }

        if (element == 'E') {
          estampado = '1';
        }

        if (element == 'Z') {
          zurcido = '1';
        }

        if (element == 'D') {
          desmanche = '1';
        }

        if (element == 'R') {
          retoque = '1';
        }
      });

    }
    this.inspeccionPrendaService.CF_MUESTRA_GENERACION_TICKET_FAMILIA_WEB(
      '001',
      item.COD_ORDPRO,
      item.COD_PRESENT,
      item.COD_TALLA,
      item.CANTIDAD,
      GlobalVariable.vusu,
      this.formulario.get('Modulo').value,
      item.Ruta_Inspeccion,
      item.Tipo_Ticket,
      compostura,
      estampado,
      zurcido,
      desmanche,
      retoque
    ).subscribe(
      (result: any) => {
        console.log(result);
        if (result.length > 0) {
          this.movimientoTicket(item, result[0].Num_Paquete, result[0].Ticket);
        } else {

        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
        verticalPosition: 'top'
      }))


  }

  movimientoTicket(item, Num_Paquete, Ticket) {

    this.inspeccionPrendaService.CF_MODULAR_R_MOVI_INSPECCION_AUTOMATICO(
      this.formulario.get('Modulo').value,
      this.formulario.get('Familia').value,
      GlobalVariable.vusu
    ).subscribe(
      (result: any) => {
        console.log(result);

        this.Num_Movstk = result[0].NUM_MOVSTK;
        this.getOrganico(item, Num_Paquete, Ticket);
        this.listadoTicket();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
        verticalPosition: 'top'
      }))


  }

  createBarcode(texto) {

    var id = '#barcode';
    JsBarcode(id, texto);

  }

  getOrganico(item, Num_Paquete, Ticket) {

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
        this.operacionImprimir(item, Num_Paquete, Ticket);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))
  }

  clickModule(Modulo) {
    console.log(Modulo);
    this.Des_Modulo = Modulo.Des_Modulo;
  }
  operacionImprimir(item, Num_Paquete, Ticket) {
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
    
    <body onload="window.print();window.close();">
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
                        <span> Prds: ${item.CANTIDAD} </span>
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
                        <span> Prds: ${item.CANTIDAD}  Talla: ${item.COD_TALLA} ${item.DES_PRESENT}</span>
                    </div>
                    <div style="display:flex; justify-content:center; margin-left:5px;">
                      <span style="text-align:center">Mov: 80- ${this.Num_Movstk}</span> 
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


}