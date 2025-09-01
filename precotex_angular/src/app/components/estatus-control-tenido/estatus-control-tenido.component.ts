import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';

import { TiProcesosTintoreriaService } from 'src/app/services/ti-procesos-tintoreria.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TiProcesosTintoreria } from 'src/app/models/TiProcesosTintoreria';
import { MatDialog } from '@angular/material/dialog';
import { DialogCatalogoToberasComponent } from './dialog-catalogo-toberas/dialog-catalogo-toberas.component';
import { DialogVisorImageComponent } from './dialog-visor-image/dialog-visor-image.component';
import { DialogVisorPdfComponent } from './dialog-visor-pdf/dialog-visor-pdf.component';
import jsPDF, { jsPDFAPI } from 'jspdf';
import html2canvas from 'html2canvas';
import { Tx_Muestra_Control_Proceso } from 'src/app/models/Tintoreria/Tx_Muestra_Control_Proceso';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DialogVisorRegComponent } from './dialog-visor-reg/dialog-visor-reg.component';

interface data_det {
  cod_Maquina_Tinto: string
  cod_Ordtra: string
  fecha_Inicio: Date
  fecha_Fin: Date
}

@Component({
  selector: 'app-estatus-control-tenido',
  templateUrl: './estatus-control-tenido.component.html',
  styleUrls: ['./estatus-control-tenido.component.scss'],
  providers: [DatePipe]
})
export class EstatusControlTenidoComponent implements OnInit {

  Arraydata: string[][] = [];

  //* Declaramos formulario para obtener los controles */
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  formulario = this.formBuilder.group({   
    Filtro:  [''], 
  })  
  
  @ViewChild('MyFiltro') inputFiltro!: ElementRef;
  objMuestraControlProceso: Tx_Muestra_Control_Proceso[] = [];

  displayedColumns_cab: string[] = [
    'Maquina',
    'Partida',
    'Fechas',
    //'Fec_Ini',
    //'Fec_Fin',
    'R',
    'T',
    'D'
    //'P',
  ]  

  dataSource: MatTableDataSource<data_det>;
  pdfBlob: Blob | null = null;
  pdfSrcBase: SafeResourceUrl | null = null;
  base64Image: string | undefined;
  urlLogo: string = 'assets/logo.jpg';

  constructor(
    private serviceTiProcesoTintoreria: TiProcesosTintoreriaService ,
    private toastr                    : ToastrService               ,
    private formBuilder               : FormBuilder                 ,
    private SpinnerService            : NgxSpinnerService           , 
    public  dialog                    : MatDialog                   , 
    private sanitizer                 : DomSanitizer                ,
    private http: HttpClient                                        ,
    private datePipe: DatePipe
  ) { this.dataSource = new MatTableDataSource();}

  ngOnInit(): void {
    this.convertImageToBase64(this.urlLogo);
    this.getObtenerEstatusControlTenido();
  }

  getObtenerEstatusControlTenido(){

    const sFiltro      : string = this.formulario.get('Filtro')?.value!;
    const fecha_start  : string = this.range.get('start')?.value;
    const fecha_end    : string = this.range.get('end')?.value;

    this.SpinnerService.show();
    this.serviceTiProcesoTintoreria.getListaEstatusControlTenido(sFiltro, fecha_start, fecha_end).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.dataSource.data = response.elements;
            this.SpinnerService.hide();
          }
          else{
            this.SpinnerService.hide();
            this.dataSource.data = [];
          }
        }        
      },
      error: (error) => {
        this.SpinnerService.hide();
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });
  }

  openCatalogToberas(data:TiProcesosTintoreria){
    if (data.flg_Tobera === 'SI'){

      let dialogRef = this.dialog.open(DialogCatalogoToberasComponent, {
        disableClose: false,
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw', // Importante para evitar el tamaño limitado por defecto
        maxHeight: '100vh',        
        panelClass: 'my-class',
        data: {
          boton:'ARRANQUE',
          Opcion:'I',
          Datos: data
              }
        //,minWidth: '45vh'
      });
    }
  }

  openVisorImagen_Dureza(data:TiProcesosTintoreria){
    if (data.flg_Dureza === 'SI'){

      let dialogRef = this.dialog.open(DialogVisorImageComponent, {
        disableClose: false,
        panelClass: 'my-class',
        data: {
          boton:'ARRANQUE',
          Opcion:'I',
          Datos: data,
          Imagen: data.url_Dureza!
              }
        ,minWidth: '45vh'
      });   

    }
  }

  openVisorImagen_Peroxido(data:TiProcesosTintoreria){
    if (data.flg_Peroxido === 'SI'){

      let dialogRef = this.dialog.open(DialogVisorImageComponent, {
        disableClose: false,
        panelClass: 'my-class',
        data: {
          boton:'ARRANQUE',
          Opcion:'I',          
          Datos: data,
          Imagen: data.url_Peroxido!
              }

        ,minWidth: '45vh'
      });   

    }
  }

  generarPDF(Arraydata: string[][]) {
    const doc = new jsPDF();

    // Configuración inicial
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const tableWidth = pageWidth * 0.95; // 95% del ancho de la página
    const marginLeft = pageWidth * 0.05; // Margen izquierdo
    const marginRight = pageWidth * 0.05; // Margen derecho
    const marginTop = 20;
    const marginBottom = 20;
    const rowHeight = 8;

    // Logo y título
    const logo = this.base64Image;
    const title = "CONTROL PROCESOS TEÑIDO TELA";

    const logoWidth = pageWidth * 0.5;
    const titleX = logoWidth;

    doc.setFont("helvetica", "bold");
    doc.addImage(logo, "JPG", 5, 0, logoWidth - 20, 20); // Logo a la izquierda
    doc.setFontSize(14);
    doc.text(title, titleX + 10, 17, { align: "left" }); // Título a la derecha

    // Anchos de columnas ajustados
    const colWidthLeft = tableWidth * 0.495; // Cuadro izquierdo
    const colWidthRight = tableWidth * 0.425; // Cuadro derecho
    const spaceWidth = tableWidth * 0.05; // Espacio reducido al 5%
    const colWidths = [colWidthLeft / 2, colWidthLeft / 2, spaceWidth, colWidthRight / 2, colWidthRight / 2];

    // Datos
    const headers = ["", "PROCESO", "", "", "PROCESO"];
    const data = Arraydata;

    // Dibujar la cabecera
    let posY = marginTop;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    let posX = marginLeft;

    headers.forEach((header, i) => {
        if (i !== 2) { // Omitir el espacio
            doc.setFillColor(200, 200, 200); // Fondo gris para cuadros 1 y 2
            doc.rect(posX, posY, colWidths[i], rowHeight, "F"); // Fondo gris solo para cuadros
            doc.setDrawColor(0, 0, 0); // Línea de borde de la cabecera
            doc.rect(posX, posY, colWidths[i], rowHeight); // Bordes
            doc.text(header, posX + 2, posY + 6);
        }
        posX += colWidths[i];
    });

// Dibujar datos
posY += rowHeight;
doc.setFont("helvetica", "normal");

data.forEach((row, rowIndex) => {
  posX = marginLeft;
  const isDoubleRow = [7, 16, 17].includes(rowIndex);

  row.forEach((cell, i) => {
      const currentRowHeight = isDoubleRow ? rowHeight * 2 : rowHeight;

      if (posY + currentRowHeight > pageHeight - marginBottom) {
          // Si excede la página, agregar nueva página
          doc.addPage();
          posY = marginTop;
      }

      // Unir las columnas 1 y 2 en la fila 13, 16, 25, 26
      if (
        (rowIndex === 13 && (i === 0 || i === 1)) ||
        (rowIndex === 16 && (i === 0 || i === 1)) ||
        (rowIndex === 25 && (i === 0 || i === 1))
      ) {
        if (i === 0) {
          // Calcular el ancho combinado de las columnas 1 y 2
          const mergedWidth = colWidths[0] + colWidths[1];

          // Determinar la altura del merge: normal o de dos filas
          const mergedHeight = rowIndex === 16 ? rowHeight * 2 : rowHeight;

          // Dibujar el rectángulo combinado
          doc.setFillColor(169, 169, 169); // Establecer el color gris (RGB)
          doc.rect(posX, posY, mergedWidth, mergedHeight, "F");
          doc.setDrawColor(0, 0, 0); // Línea de borde
          doc.rect(posX, posY, mergedWidth, mergedHeight); // Dibujar bordes

          // Texto centrado en el rectángulo combinado
          const mergedText = `${row[0]} ${row[1]}`.trim();
          doc.setFont("helvetica", "bold");
          doc.text(
            mergedText,
            posX + mergedWidth / 2,
            posY + mergedHeight / 2 + 3, // Ajustar posición del texto
            { align: "center" }
          );
          doc.setFont("helvetica", "normal");
        }
        // No dibujar nada para la segunda columna (i === 1) porque ya está unida a la primera
      }

      // Proceder con las otras celdas normalmente
      else if (i !== 2) { // Omitir la columna 2 en la fila 3
          // Fusión de columnas 3 y 4 en la fila 1, 2, 4 y 6
          if ((rowIndex === 0 && (i === 3 || i === 4) || 
               rowIndex === 2 && (i === 3 || i === 4) || 
               rowIndex === 4 && (i === 3 || i === 4) || 
               rowIndex === 6 && (i === 3 || i === 4))) {
              // Solo dibujar el rectángulo y texto una vez en la columna 3
              if (i === 3) {
                  const mergedWidth = colWidths[3] + colWidths[4]; // Ancho combinado de columnas 3 y 4
                  doc.setFillColor(169, 169, 169); // Establecer el color gris (RGB)
                  doc.rect(posX, posY, mergedWidth, rowHeight, "F");
                  doc.setDrawColor(0, 0, 0); // Línea de borde de la cabecera
                  doc.rect(posX, posY, mergedWidth, rowHeight); // Bordes                      

                  // Texto centrado dentro del rectángulo combinado
                  const mergedText = `${row[3]} ${row[4]}`.trim();
                  doc.setFont("helvetica", "bold");
                  doc.text(mergedText, posX + mergedWidth / 2, posY + 6, { align: 'center' });
                  doc.setFont("helvetica", "normal");
              }
          } 

          else if ((rowIndex === 1 && i === 4 ||
                    rowIndex === 3 && i === 4 ||
                    rowIndex === 5 && i === 4 ||
                    rowIndex === 13 && i === 4 ||
                    rowIndex === 14 && i === 4
          )) {
            // Calcular el centro de la columna 4 (i == 3)
            const centerX = posX + colWidths[3] / 2; // Centro de la columna 4
        
            // Dibujar línea vertical en el centro de la columna 4
            doc.line(centerX, posY, centerX, posY + currentRowHeight); // Línea vertical
        
            // Obtener las infos
            const info: string[] = row[4].split("|");     
            
            // Asignamos los valores a variables
            const valor1: string = info[0]; // "1"
            const valor2: string = info[1]; // "2"            

            // Dibujar la celda izquierda
            doc.rect(posX, posY, colWidths[3] / 2, currentRowHeight);
            doc.text(valor1, posX + 2, posY + 6);
        
            // Dibujar la celda derecha
            doc.rect(centerX, posY, colWidths[3] / 2, currentRowHeight);
            doc.text(valor2, centerX + 2, posY + 6);
        }          
          
          // Dividir la columna 2 en la fila 24 con una línea vertical
          else if ((rowIndex === 24 && i === 1 ||
                    rowIndex === 34 && i === 1 || 
                    rowIndex === 35 && i === 1 ||
                    rowIndex === 36 && i === 1 ||
                    rowIndex === 37 && i === 1 ||
                    rowIndex === 38 && i === 1 ||
                    rowIndex === 39 && i === 1 ||
                    rowIndex === 40 && i === 1 ||
                    rowIndex === 41 && i === 1 ||
                    rowIndex === 45 && i === 1 ||
                    rowIndex === 47 && i === 1 ||
                    rowIndex === 50 && i === 1)) {
              // Dibujar línea vertical en el centro de la columna 2
              const centerX = posX + colWidths[1] / 2; // Centro de la columna 2
              doc.line(centerX, posY, centerX, posY + currentRowHeight); // Línea vertical

              // Dibujar dos nuevas celdas a cada lado de la línea
              const leftCellWidth = colWidths[1] / 2;
              const rightCellWidth = colWidths[1] / 2;

              // Dibujar las celdas divididas
              doc.rect(posX, posY, leftCellWidth, currentRowHeight);
              doc.text(row[1], posX + 2, posY + 6); // Texto en la parte izquierda

              doc.rect(centerX, posY, rightCellWidth, currentRowHeight);
              doc.text(row[2], centerX + 2, posY + 6); // Texto en la parte derecha
          }

          // Dibujar las demás celdas normalmente (excepto la fila 18 y siguientes para las columnas 3 y 4)
          else if (!(rowIndex === 0 && i === 4)) {
              // Eliminar filas 18 en adelante para las columnas 3 y 4
              if (rowIndex >= 18 && (i === 3 || i === 4)) {
                  // No hacer nada para estas celdas
              } else {
                  doc.rect(posX, posY, colWidths[i], currentRowHeight);

                  // Dividir texto en celdas específicas
                  if (rowIndex == 7 && i == 1) {
                      doc.setFontSize(8);
                      const texto = cell.split('\n').map(linea => linea.trim()).join(' ');
                      const textArray = doc.splitTextToSize(String(texto), 45);
                      doc.text(textArray, posX + 25, posY + 3, { align: 'center' });
                      doc.setFontSize(10);
                  } else if ((rowIndex == 16 || rowIndex == 17) && i == 4) {
                      doc.setFontSize(8);
                      const texto = cell.split('\n').map(linea => linea.trim()).join(' ');
                      const textArray = doc.splitTextToSize(String(texto), 45);
                      doc.text(textArray, posX + 21, posY + 3, { align: 'center' });
                      doc.setFontSize(10);
                  }
                  // Títulos en negrita
                  else if (
                      (rowIndex == 0 && i == 3) ||
                      (rowIndex == 2 && i == 3) ||
                      (rowIndex == 4 && i == 3) ||
                      (rowIndex == 6 && i == 3) ||
                      (rowIndex == 13 && i == 0) ||
                      (rowIndex == 16 && i == 0) ||
                      (rowIndex == 25 && i == 0)
                  ) {
                      doc.setFont("helvetica", "bold");
                      doc.text(cell, posX + 2, posY + 6);
                      doc.setFont("helvetica", "normal");
                  }
                  // Celdas numéricas centradas
                  else if (
                      (rowIndex >= 0 && rowIndex <= 7 && i == 1) ||
                      (rowIndex >= 8 && rowIndex <= 50 && i == 1)
                  ) {
                      if (rowIndex == 6 && i == 1) {
                          doc.setFontSize(8);
                          doc.text(cell, posX + 2, posY + 6);
                          doc.setFontSize(10);
                      } else {
                          doc.text(cell.trim(), posX + 25, posY + 6, { align: 'center' });
                      }
                  } else if (rowIndex >= 1 && rowIndex <= 50 && i == 4) {
                      doc.text(cell.trim(), posX + 22, posY + 6, { align: 'center' });
                  } else {
                      doc.text(cell, posX + 2, posY + 6);
                  }
              }
          }
      }

      // Solo avanzar en el eje X si no es la columna 4 en la primera fila
      if (!(rowIndex === 0 && i === 4)) {
          posX += colWidths[i];
      }
  });

  posY += isDoubleRow ? rowHeight * 2 : rowHeight;
});
    // Guardar el PDF
    // doc.save("Partida.pdf");
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    this.dialog.open(DialogVisorRegComponent, {
      disableClose: false,
      panelClass: 'my-class',
      data: {
        boton: 'ARRANQUE',
        Opcion: 'I',
        Imagen: pdfUrl
      },
      minWidth: '45vh'
    });
}

openVisorPdf(data:TiProcesosTintoreria){

    if (data.flg_Registro === 'SI'){

      const sPartida1      : string = data.cod_Ordtra;
      const fecha_start1  : Date = data.fecha_Inicio;
      const fecha_end1    : Date = (data.fecha_Fin == null)?data.fecha_Inicio: data.fecha_Fin;
      this.Arraydata = [];

      this.SpinnerService.show();
      this.serviceTiProcesoTintoreria.getObtieneMuestraControlProceso(sPartida1, fecha_start1, fecha_end1).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.totalElements > 0){
              console.log(response.elements);
              /*CREAMOS LAS FILAS*/
              const row1: string[] = ["PARTIDA", response.elements[0]["partida"], "", "JABONADO",""];     
              const row2: string[] = ["NRO REFERENCIA", response.elements[0]["nrO_REFERENCIA"].trim(), "", "PH JABONADO",(response.elements[0]["jA_PH_1"]==0?"":String(response.elements[0]["jA_PH_1"])) + '|' + (response.elements[0]["jA_PH_2"]==0?"":String(response.elements[0]["jA_PH_2"]))];   
              const row3: string[] = ["OPERARIO", response.elements[0]["operario"], "", "FIJADO", ""];   
              const row4: string[] = ["FECHA", this.datePipe.transform(response.elements[0]["fecha"], 'dd/MM/yyyy'), "", "PH FIJADO",(response.elements[0]["fI_PH_1"]==0?"":String(response.elements[0]["fI_PH_1"])) + '|' + (response.elements[0]["fI_PH_2"]==0?"":String(response.elements[0]["fI_PH_2"]))];   
              const row5: string[] = ["HORA CARGA", response.elements[0]["horA_CARGA"], "", "ACIDULADO",""];   
              const row6: string[] = ["MÁQUINA", response.elements[0]["maquina"], "", "PH ACIDULADO",(response.elements[0]["aC_PH_1"]==0?"":String(response.elements[0]["aC_PH_1"])) + '|' + (response.elements[0]["aC_PH_2"]==0?"":String(response.elements[0]["aC_PH_2"]))];   
              const row7: string[] = ["COLOR", response.elements[0]["color"].trim(), "", "TEÑIDO DISPERSO",""];   
              const row8: string[] = ["ARTICULO", response.elements[0]["articulo"].trim(), "", "BAR",response.elements[0]["tD_BAR"]==0?"":String(response.elements[0]["tD_BAR"])];   
              const row9: string[] = ["PESO", response.elements[0]["peso"]==0?"":String(response.elements[0]["peso"]), "", "TOBERA",response.elements[0]["tD_TOBERA"]==0?"":String(response.elements[0]["tD_TOBERA"])];   
              const row10: string[] = ["CUERDAS", response.elements[0]["cuerdas"], "", "ACUMULADOR",response.elements[0]["tD_ACUMULADOR"]==0?"":String(response.elements[0]["tD_ACUMULADOR"])];   

              //BLOQUE 2
              const row11: string[] = ["CLIENTE", response.elements[0]["cliente"], "", "BOMBA", response.elements[0]["tD_BOMBA"]==0?"":String(response.elements[0]["tD_BOMBA"])];   
              const row12: string[] = ["RELACIÓN BAÑO", response.elements[0]["relbano"], "", "VELOCIDAD", response.elements[0]["tD_VELOCIDAD"]==0?"":String(response.elements[0]["tD_VELOCIDAD"])];  
              const row13: string[] = ["VOLUMEN RECETA", response.elements[0]["volreceta"]==0?"":String(response.elements[0]["volreceta"]), "", "T.CICLO", response.elements[0]["tD_TIEMPO_CICLO_1"]==0?"":String(response.elements[0]["tD_TIEMPO_CICLO_1"])];  
              const row14: string[] = ["CRUDO", "", "", "PH TEÑIDO", (response.elements[0]["tD_PH_TENIDO_1"]==0?"":String(response.elements[0]["tD_PH_TENIDO_1"])) + '|' + (response.elements[0]["tD_PH_TENIDO_2"]==0?"":String(response.elements[0]["tD_PH_TENIDO_2"]))];  
              const row15: string[] = ["ANCHO", response.elements[0]["cR_ANCHO"]==0?"":String(response.elements[0]["cR_ANCHO"]), "", "PH DESCARGA", (response.elements[0]["tD_PH_DESCARGA_DISP_1"]==0?"":String(response.elements[0]["tD_PH_DESCARGA_DISP_1"])) + '|' + (response.elements[0]["tD_PH_DESCARGA_DISP_2"]==0?"":String(response.elements[0]["tD_PH_DESCARGA_DISP_2"]))];  
              const row16: string[] = ["DENSIDAD", response.elements[0]["cR_DENSIDAD"]==0?"":String(response.elements[0]["cR_DENSIDAD"]), "", "PESO POR CUERDA", response.elements[0]["pesO_POR_CUERDA"]==0?"":String(response.elements[0]["pesO_POR_CUERDA"])]; 
              
              //BLOQUE PREVIO
              const row17: string[] = ["PREVIO", "", "", "P. CAMBIO DE TURNO", response.elements[0]["cambiO_TURNO"].trim()];
              const row18: string[] = ["BAR", response.elements[0]["pR_BAR"]==0?"":String(response.elements[0]["pR_BAR"]			), "", "OBSERVACIONES", response.elements[0]["observaciones"].trim()];  
              const row19: string[] = ["TOBERA", response.elements[0]["pR_TOBERA"]==0?"":				String(response.elements[0]["pR_TOBERA"]		), "", "", ""];  
              const row20: string[] = ["ACUMULADOR", response.elements[0]["pR_ACUMULADOR"]==0?"":		String(response.elements[0]["pR_ACUMULADOR"]	), "", "", ""];  
              const row21: string[] = ["BOMBA", response.elements[0]["pR_BOMBA"]==0?"":					String(response.elements[0]["pR_BOMBA"]			), "", "", ""];  
              const row22: string[] = ["VELOCIDAD", response.elements[0]["pR_VELOCIDAD"]==0?"":			String(response.elements[0]["pR_VELOCIDAD"]		), "", "", ""];  
              const row23: string[] = ["T.CICLO", response.elements[0]["pR_TIEMPO_CICLO_1"]==0?"":		String(response.elements[0]["pR_TIEMPO_CICLO_1"]), "", "", ""];  
              const row24: string[] = ["NIVEL BAÑO", response.elements[0]["pR_NIV_BANO_MAQ"]==0?"":		String(response.elements[0]["pR_NIV_BANO_MAQ"]	), "", "", ""];  
              const row25: string[] = ["PH ANTIPILLING", response.elements[0]["pR_PH_PILLING"]==0?"":	String(response.elements[0]["pR_PH_PILLING"]	), response.elements[0]["pR_PH_PILLING_2"]==0?"":	String(response.elements[0]["pR_PH_PILLING_2"]	), "", ""];  
              
              //BLOQUE TEÑIDO REACTIVO
              const row51: string[] = ["TEÑIDO REACTIVO", "", "", "", ""];  
              const row26: string[] = ["BAR", response.elements[0]["tR_BAR"]==0?"":								String(response.elements[0]["tR_BAR"]			  	), "", "", ""];  
              const row27: string[] = ["TOBERA", response.elements[0]["tR_TOBERA"]==0?"":						String(response.elements[0]["tR_TOBERA"]			), "", "", ""];  
              const row28: string[] = ["ACUMULADOR", response.elements[0]["tR_ACUMULADOR"]==0?"":				String(response.elements[0]["tR_ACUMULADOR"]		), "", "", ""];  
              const row29: string[] = ["BOMBA", response.elements[0]["tR_BOMBA"]==0?"":							String(response.elements[0]["tR_BOMBA"]				), "", "", ""];  
              const row30: string[] = ["VELOCIDAD", response.elements[0]["tR_VELOCIDAD"]==0?"":					String(response.elements[0]["tR_VELOCIDAD"]			), "", "", ""];  
              const row31: string[] = ["T.CICLO", response.elements[0]["tR_TIEMPO_CICLO_1"]==0?"":				String(response.elements[0]["tR_TIEMPO_CICLO_1"]	), "", "", ""];  
              const row32: string[] = ["VOLUMEN INICIO", response.elements[0]["tR_VOLUMEN"]==0?"":				String(response.elements[0]["tR_VOLUMEN"]			), "", "", ""];  
              const row33: string[] = ["NIVEL BAÑO 1", response.elements[0]["tR_NIV_BANO_MAQ_1"]==0?"":			String(response.elements[0]["tR_NIV_BANO_MAQ_1"]	), "", "", ""];  
              const row34: string[] = ["PH INICIAL CSAL", response.elements[0]["tR_PH_INICIO1_CSAL"]==0?"":			String(response.elements[0]["tR_PH_INICIO1_CSAL"]	), response.elements[0]["tR_PH_INICIO2_CSAL"]==0?"":			String(response.elements[0]["tR_PH_INICIO2_CSAL"]	), "", ""];  
              const row52: string[] = ["PH INICIAL SSAL", response.elements[0]["tR_PH_INICIO1_SSAL"]==0?"":			String(response.elements[0]["tR_PH_INICIO1_SSAL"]	), response.elements[0]["tR_PH_INICIO2_SSAL"]==0?"":			String(response.elements[0]["tR_PH_INICIO2_SSAL"]	), "", ""]; 
              const row35: string[] = ["DENSIDAD SAL", response.elements[0]["tR_DENSIDAD_SAL_1"]==0?"":			String(response.elements[0]["tR_DENSIDAD_SAL_1"]	), response.elements[0]["tR_DENSIDAD_SAL_2"]==0?"":			String(response.elements[0]["tR_DENSIDAD_SAL_2"]	), "", ""];  
              const row36: string[] = ["TEMPERATURA", response.elements[0]["tR_TEMPERATURA_1"]==0?"":			String(response.elements[0]["tR_TEMPERATURA_1"]		), response.elements[0]["tR_TEMPERATURA_2"]==0?"":			String(response.elements[0]["tR_TEMPERATURA_2"]		), "", ""];  
              const row37: string[] = ["G/L DENSIDAD", response.elements[0]["tR_GL_DENSIDAD"]==0?"":			String(response.elements[0]["tR_GL_DENSIDAD"]		), response.elements[0]["tR_GL_DENSIDAD2"]==0?"":			String(response.elements[0]["tR_GL_DENSIDAD2"]		), "", ""];
              const row38: string[] = ["LTS DENSIDAD", response.elements[0]["tR_LT_DENSIDAD"]==0?"":			String(response.elements[0]["tR_LT_DENSIDAD"]		), response.elements[0]["tR_LT_DENSIDAD2"]==0?"":			String(response.elements[0]["tR_LT_DENSIDAD2"]		), "", ""];
              const row39: string[] = ["CORRECCIÓN TEÓRICA", response.elements[0]["tR_CORR_TEORICA"]==0?"":		String(response.elements[0]["tR_CORR_TEORICA"]		), response.elements[0]["tR_CORR_TEORICA2"]==0?"":		String(response.elements[0]["tR_CORR_TEORICA2"]		), "", ""];
              const row40: string[] = ["CORRECCIÓN REAL", (response.elements[0]["tR_CORR_REAL"]==0)?"":			String(response.elements[0]["tR_CORR_REAL"]			), (response.elements[0]["tR_CORR_REAL2"]==0)?"":			String(response.elements[0]["tR_CORR_REAL2"]			), "", ""];
              const row41: string[] = ["LTS DOSIF COLORANTE", (response.elements[0]["tR_LT_DOSIF_COLOR"]==0)?"":String(response.elements[0]["tR_LT_DOSIF_COLOR"]	), "", "", ""];  
              const row42: string[] = ["LTS DOSIF SAL TEXTIL", (response.elements[0]["tR_LT_DOSIF_SAL"]==0)?"":	String(response.elements[0]["tR_LT_DOSIF_SAL"]		), "", "", ""];
              const row43: string[] = ["LTS DOSIF 1°",  (response.elements[0]["tR_LT_DOSIF1_ALCA"]==0)?"":		String(response.elements[0]["tR_LT_DOSIF1_ALCA"]	), "", "", ""];
              const row44: string[] = ["PH1 ALCALI",    (response.elements[0]["tR_PH_1_ALCALI_1"]==0)?"":		String(response.elements[0]["tR_PH_1_ALCALI_1"]		), (response.elements[0]["tR_PH_1_ALCALI_2"]==0)?"":		String(response.elements[0]["tR_PH_1_ALCALI_2"]		), "", ""];
              const row45: string[] = ["LTS DOSIF 2°",  (response.elements[0]["tR_LT_DOSIF2_ALCA"]==0)?"":		String(response.elements[0]["tR_LT_DOSIF2_ALCA"]	), "", "", ""];
              const row46: string[] = ["PH2 ALCALI",          (response.elements[0]["tR_PH_2_ALCALI_1"]==0)?"":	String(response.elements[0]["tR_PH_2_ALCALI_1"]		), (response.elements[0]["tR_PH_2_ALCALI_2"]==0)?"":	String(response.elements[0]["tR_PH_2_ALCALI_2"]		), "", ""]; 
              const row47: string[] = ["LTS DOSIF 3°",        (response.elements[0]["tR_LT_DOSIF3_ALCA"]==0)?"":String(response.elements[0]["tR_LT_DOSIF3_ALCA"]	), "", "", ""]; 
              const row48: string[] = ["NIVEL BAÑO 2",        (response.elements[0]["tR_NIV_BANO_MAQ_2"]==0)?"":String(response.elements[0]["tR_NIV_BANO_MAQ_2"]	), "", "", ""]; 
              const row49: string[] = ["PH AGOTAMIENTO",      (response.elements[0]["tR_AGOTAMIENTO_1"]==0)?"":	String(response.elements[0]["tR_AGOTAMIENTO_1"]		), (response.elements[0]["tR_AGOTAMIENTO_2"]==0)?"":	String(response.elements[0]["tR_AGOTAMIENTO_2"]		), "", ""]; 
              const row50: string[] = ["TIEMPO AGOTAMIENTO",  (response.elements[0]["tR_TIEMPO_AGOTA"]==0)?"":String(response.elements[0]["tR_TIEMPO_AGOTA"]), "", "", ""]; 

              // Agregar filas al ARRAY
              this.Arraydata.push(row1,row2,row3,row4,row5,row6,row7,row8,row9,row10);  
              this.Arraydata.push(row11,row12,row13,row14,row15,row16,row17,row18,row19,row20,row21,row22,row23,row24,row25,row51,row26,row27, row28, row29,row30);             
              this.Arraydata.push(row31,row32,row33,row34,row52,row35,row36,row37,row38,row39,row40,row41,row42,row43,row44,row45,row46,row47,row48,row49,row50);  
            }
          }
          this.SpinnerService.hide();    

          //Generar PDF en caso exista Data en ArrayData
          if (this.Arraydata.length >0){
            this.generarPDF(this.Arraydata);
          }

        },
        error: (error) => {
          this.SpinnerService.hide();
          this.toastr.error(error.error.message, 'Cerrar', {
          timeOut: 2500,
          });
        }
      });
    }
  }

  Filtrar(){
    this.getObtenerEstatusControlTenido();
  }

  Filtro(event){
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue.length == 5){
      this.getObtenerEstatusControlTenido();
    }
  }

  convertImageToBase64(imagePath: string): void {
    this.http.get(imagePath, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            this.base64Image = reader.result.toString(); // Aquí se obtiene el Base64
          }
        };
        reader.readAsDataURL(blob); // Convertir blob a Base64
      },
      error: (err) => {
        console.error('Error al cargar la imagen:', err);
      },
    });
  }
  

}
