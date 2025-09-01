import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { InspeccionPrendaService } from 'src/app/services/modular/inspeccion-prenda.service';


interface Modulo {
  Cod_Modulo: string;
  Des_Modulo: string;
}

declare var JsBarcode:any;


@Component({
  selector: 'app-modular-reimpresion-ticket',
  templateUrl: './modular-reimpresion-ticket.component.html',
  styleUrls: ['./modular-reimpresion-ticket.component.scss']
})
export class ModularReimpresionTicketComponent implements OnInit {

  Id = 0
  Tipo_Sub_Proceso = ''
  Des_Tipo_Proceso = ''

  //flg para dar clase css cuando es reproceso o proceso normal
  grid_border = ' border: 1px solid #337ab7;'
  background = 'background-color: #2962FF; border: 1px solid #2962FF;'
  btn_background = 'background-color: #2962FF; color: #ffffff;'

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Modulo: [''],
    Familia: [''],
    sOp:['']
  })

  ImagePath = 'http://192.168.1.36/Estilos/default.jpg'


  listar_operacionModulo: Modulo[] = [];
  porFinalizar: Array<any> = [];

  dataPrendasImp:Array<any> = [];
  Des_Modulo = '';
  Ticket = '';
  Num_Movstk = '';
  organico = '';
  Num_Paquete = '';
  constructor(private formBuilder: FormBuilder, private matSnackBar: MatSnackBar, private inspeccionPrendaService: InspeccionPrendaService, private SpinnerService: NgxSpinnerService) { }

  changeModulo(event) {
    console.log(event);
    if (event.value != '') {
      
    }
  }

  ngOnInit(): void {
    this.MuestraModulo();
    this.organico = '';
  }

  MuestraModulo() {
    this.inspeccionPrendaService.CF_MUESTRA_MODULO(
    ).subscribe(
      (result: any) => {
        this.listar_operacionModulo = result;
        
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
        verticalPosition:'top'
      }))

  }

  listadoTicket() {
    this.SpinnerService.show();
    this.inspeccionPrendaService.CF_MUESTRA_LISTADO_GENERADO_TICKET_WEB(
      this.formulario.get('Modulo').value,
      this.formulario.get('Familia').value,
      this.formulario.get('sOp').value
    ).subscribe(
      (result: any) => {
        console.log(result);
        if(result.length > 0){
          this.dataPrendasImp = result;
          this.SpinnerService.hide();
        }else{
          this.matSnackBar.open('No se encontraron pendientes de Impresión dentro del módulo seleccionado.', 'Cerrar', {
            duration: 5000,
            verticalPosition:'top'
          });
          this.dataPrendasImp = [];
          this.SpinnerService.hide();
        }
        
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))

  }

  touchTicket(item){

    this.getOrganico(item);
    this.listadoTicket();   
    
  }

  getOrganico(item){
    //this.operacionImprimir(item);
    this.inspeccionPrendaService.devuelve_Organico(
      item.COD_ORDPRO
    ).subscribe(
      (result: any) => {
        console.log(result['Organico'].trim());
        if(result['Organico'].trim() == ''){
          this.organico = '';
        }else{
          this.organico = 'ORGANICO';
        }
        this.operacionImprimir(item);
        
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))
  }


  createBarcode(texto){

      var id = '#barcode';
      JsBarcode(id, texto, {
        format: 'CODE128',
        width: 2,
        height: 66,
        marginBottom: 2
      });    
    
  }

  clickModule(Modulo){
    console.log(Modulo);
    this.Des_Modulo = Modulo.Des_Modulo;
  }

  operacionImprimir(item){

    this.createBarcode(item.Ticket);
    let printContents, popupWin, cod_referencia;

    
    cod_referencia = '-';

    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    //onload="window.print();window.close();"
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
                        <span> Prds: ${item.CANTIDAD} </span>
                        <span> Talla: ${item.COD_TALLA } </span>
                    </div>
                  </div>
                  <div style="display:flex; flex-direction:row; ">
                    <div style="display:flex;justify-content:center;">
                      <span>  ${item.DES_PRESENT} &nbsp; &nbsp; &nbsp;</span>
                    </div>
                    <div style="display:flex; justify-content:end; font-family:5px;">
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
                <span style="text-align:center; font-size:9px; margin-botton: 2px;">Modulo: ${this.Des_Modulo} - Pqte: ${item.Num_Paquete}</span>
              </div>
            </div>

            <div class="caja" style="width:100%;font-size:9px;margin-left: 65px;">
              <div class="flex" style="flex-direction:column;">
                  <div class="print caja" style="width:100%;font-size:9px; margin-left:5px;">
                    <div style="display:flex; justify-content:center;">
                        <span>Ruta Insp: ${item.Ruta_Inspeccion} OP: ${item.COD_ORDPRO}  </span> </br>
                    </div>                
                    <div style="display:flex; justify-content:center; margin-left:5px;">
                        <span> Prds: ${item.CANTIDAD}  Talla: ${item.COD_TALLA } ${item.DES_PRESENT}</span>
                    </div>
                    <div style="display:flex;">
                      <div style="display:flex; justify-content:center; margin-left:5px;">
                        <span style="text-align:center">Mov: 80- ${item.Num_MovStk}</span> 
                      </div>          
                      <div style="display:flex; justify-content:end;">
                        <span> &nbsp; &nbsp; ${this.organico}</span>
                      </div>
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