import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { MatDialogModule } from '@angular/material/dialog';
import { GlobalVariable } from 'src/app/VarGlobals';
import { ArranquetejeduriaService } from 'src/app/services/arranquetejeduria.service';
import { ToastrService } from 'ngx-toastr';
import { Console } from 'console';
import { format } from 'path';

interface data_det {
  Titulo        : String,
  CABOS         : string,
  LM            : string,
  COLOR         : string,
  PASADAS       : number,
  ESTRUCTURA    : string,
  REPETICIONES  : string,
  AGRUPADO      : string,
}

@Component({
  selector: 'app-carga-estructura-tejido',
  templateUrl: './carga-estructura-tejido.component.html',
  styleUrls: ['./carga-estructura-tejido.component.scss']
})
export class CargaEstructuraTejidoComponent implements OnInit {

  selectedFile: File | null = null;
  errorMessage: string | null = null;
  parsedData: any[] = [];  // Lista donde guardaremos los datos procesados
  bExisteEstructura: boolean = false;

  sVersion       : string | null = null;
  sCodTela       : string | null = null;
  sServicio      : string | null = null;
  sObservaciones : string | null = null;
  sElaborado     : string | null = null;
  sRevisado      : string | null = null;

  constructor(private SpinnerService: NgxSpinnerService,
    private arranquetejeduria : ArranquetejeduriaService,  
    private toastr: ToastrService,   
  ) { this.dataSource = new MatTableDataSource();  }

    displayedColumns_cab: string[] = [
      'Titulo'      ,
      'Cabo'        ,
      'Lm'          ,
      'Color'       ,
      'Pasadas'     ,
      'Estructura'  ,
      'Repeticiones'           
    ]    
    dataSource: MatTableDataSource<data_det>;
    listar_Estructura_Tejido_Items:  data_det[] = [];

    sCod_Usuario = GlobalVariable.vusu;

  ngOnInit(): void {
  }


  // Función que maneja la selección del archivo
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    // Verificar si un archivo ha sido seleccionado
    if (file) {
      const fileType = file.type;

      // Validar si el archivo es de tipo Excel
      if (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.selectedFile = file;
        this.errorMessage = null;
      } else {
        this.selectedFile = null;
        this.bExisteEstructura = false;
        this.dataSource.data = [];
        this.errorMessage = 'Por favor, selecciona un archivo de tipo Excel (.xls o .xlsx).';
      }
    } else {
      this.selectedFile = null;
      this.bExisteEstructura = false;
      this.dataSource.data = [];
      this.errorMessage = 'No se ha seleccionado ningún archivo.';
    }
  }

  // Función que simula la carga del archivo
  uploadFile(): void {
    if (this.selectedFile) {

      this.SpinnerService.show();

      const reader = new FileReader();
      reader.readAsArrayBuffer(this.selectedFile);

      reader.onload = (e) => {

        const binaryData = reader.result;
        const workbook = XLSX.read(binaryData, { type: 'binary' });

        // Suponemos que el archivo tiene una sola hoja (puedes adaptar esto si es necesario)
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];     
        
        // Convertir la hoja a un formato de objeto JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Procesar los datos extraídos
        this.parseExcelData(jsonData);
      }
    }
  }


    // Función para procesar los datos extraídos del Excel
    parseExcelData(data: any[]): void {
      console.log('data');
      console.log(data);
      let foundTitulo = false;
      let foundObservacion = false;

      let previousValue_Elaborado: any = null;  // Variable para almacenar el valor anterior
      let previousValue_Revisado : any = null;  // Variable para almacenar el valor anterior
      let previousIndex: number = -1;  // Variable para almacenar el índice anterior
  
      // Limpiar la lista antes de llenarla
      this.parsedData = [];

      var i: number = 1;

      data.forEach((element, index) => {    
        if (element.length>0){
          
          //*1. CAPTURA VERSION
          if (index == 1){
            this.sVersion = element[9];
          }

          //*2. CAPTURA CODIGO TELA
          if (index == 8){
            this.sCodTela = element[1];
          }      
          
          //*3. CAPTURA SERVICIO
          if (index == 10){
            this.sServicio = element[3];
          }

          //*3. OBTIENE ESTRUCTURA DE TEJIDO
          if (!(element[0] == undefined)){
            const sWordClave: string = element[0];

            if(sWordClave == 'Titulo'){
               foundTitulo = true;
               return;
            } else if (sWordClave == '4. OBSERVACIONES'){
                foundObservacion = true;
                return;
            }

            if (foundTitulo) {

              const parsedRow = {
                Titulo: element[0],   // Columna A
                CABOS: element[1],    // Columna B
                LM: element[2],       // Columna C
                COLOR: element[3],    // Columna D
                PASADAS: element[4],  // Columna E
                ESTRUCTURA: element[5], // Columna F
                REPETICIONES: element[8], // Columna G
                AGRUPADO: ""
              };
              this.parsedData.push(parsedRow);              
            } else if (foundObservacion){
              this.sObservaciones = element[0];
            }
          }else {
            const sWordClave2: string = element[2];

            if (sWordClave2 == 'Elaborado'){        
              this.sElaborado = previousValue_Elaborado;
              this.sRevisado = previousValue_Revisado
            }            
          }

        }else{
          if (foundTitulo){
            foundTitulo = false;
          }

          if (foundObservacion){
            foundObservacion = false;
          }
        } 

        // Actualizamos las variables con el valor y el índice actuales
        previousValue_Elaborado = element[2];
        previousValue_Revisado = element[6];
        previousIndex = index;
        //Contador +1
        i += 1;    

      });

      this.parsedData.forEach((item, index, arr) => {
        if (item.REPETICIONES !== '' && item.REPETICIONES !== undefined){

          const nextItem = arr[index + 1];
          if (nextItem && (nextItem.REPETICIONES === undefined)) {
            item.AGRUPADO = 'X';
            arr[index + 1].AGRUPADO = 'X';
            arr[index + 1].REPETICIONES = item.REPETICIONES;
          }
        }
      });

      if (this.parsedData.length > 0){
          this.bExisteEstructura = true;
          this.selectedFile = null;

          this.listar_Estructura_Tejido_Items = this.parsedData;
          this.dataSource.data = this.listar_Estructura_Tejido_Items;
      }

      this.SpinnerService.hide();
    
    }

    guardarEstructura(fileInput: HTMLInputElement){

      if (this.sVersion == null){

        this.toastr.info("¡Verifique nombre de la versión, Vacio!", '', {
          timeOut: 2500,
        });      
        return;
      }

      if (this.sCodTela == null){
        this.toastr.info("¡Verifique codigo de la tela, Vacio!", '', {
          timeOut: 2500,
        });      
        return;
      }    

      if (this.sServicio == null){
        this.toastr.info("¡Verifique nombre de servicio, Vacio!", '', {
          timeOut: 2500,
        });      
        return;
      }   

      if (this.sElaborado == null){
        this.toastr.info("¡Verifique nombre de elaborador, Vacio!", '', {
          timeOut: 2500,
        });      
        return;
      }  
      
      if (this.sRevisado == null){
        this.toastr.info("¡Verifique nombre de revisador, Vacio!", '', {
          timeOut: 2500,
        });      
        return;
      }       

      if(confirm("¿Desea guardar la estructura de tejido! ?")){
          //LEER LA INFORMACION DE MATTABLE
          const strXMLVar: String = this.fncGenerarXML_EstructuraTejido();
          let data: any = {
            NombreVersion   : this.sVersion       ,
            Cod_Tela        : this.sCodTela       ,
            Servicio        : this.sServicio      ,
            Observacion     : this.sObservaciones ,
            Elaborado       : this.sElaborado     ,
            Revisado        : this.sRevisado      ,
            CodUsuario      : this.sCod_Usuario   ,
            XmlData         : strXMLVar  // Ejemplo de XML
          }         
          
          this.SpinnerService.show();
          this.arranquetejeduria.postRegistraEstructuraTejido(data).subscribe({
            next: (response: any)=> {

              if(response.success){
                if (response.codeTransacc == 1){
                  this.SpinnerService.hide();
                  this.toastr.success(response.message, '', {
                    timeOut: 2500,
                  });

                  //Limpia Estructura
                  fileInput.value = '';
                  this.selectedFile = null;
                  this.bExisteEstructura = false;
                  this.dataSource.data = [];          

                }else{
                  this.SpinnerService.hide();
                  this.toastr.info(response.message, '', {
                    timeOut: 2500,
                  });
                }
      
              }else{
                this.SpinnerService.hide();
                this.toastr.error(response.message, 'Cerrar', {
                  timeOut: 2500,
                });          
              }
            },
            error: (error) => {
              this.SpinnerService.hide();
              this.toastr.error(error.message, 'Cerrar', {
              timeOut: 2500,
                });
            }  
          });

        }

    }

    fncGenerarXML_EstructuraTejido(){
      let xml = `<Datos>\n`;
      this.listar_Estructura_Tejido_Items.forEach(item => {
        xml += `  <Registro>\n`;  
        xml += `    <Titulo>          ${item.Titulo}        </Titulo>\n`;    
        xml += `    <Cabos>           ${item.CABOS}         </Cabos>\n`;
        xml += `    <LongitudMalla>   ${item.LM}            </LongitudMalla>\n`;
        xml += `    <Color>           ${item.COLOR}         </Color>\n`;
        xml += `    <Pasadas>         ${item.PASADAS}       </Pasadas>\n`;
        xml += `    <Estructura>      ${item.ESTRUCTURA}    </Estructura>\n`;
        xml += `    <Repeticiones>    ${item.REPETICIONES}  </Repeticiones>\n`;
        xml += `  </Registro>\n`;
      });
  
      xml += `</Datos>`;
      return xml;
    }

}
