import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import * as logo from './mylogo.js';

@Injectable({
  providedIn: 'root'
})
export class ExceljsEventosService {

  imageBase64: string | null = null;

  constructor() { }

  /* 
  Genera Reporte excel Entregas
  2025Jun11, Ahmed
  */
  public exportExcelcImg(excelData) {
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;

    var abc = 64
    var abcIni = ''
    var abcFin = ''
    for (let i = 0; i < header.length; i++) {
      abc = abc + 1
      if (i == 0) {
        abcIni = String.fromCharCode(Number(abc))
      }
    }
    abcFin = String.fromCharCode(Number(abc));

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title, {
        pageSetup:{paperSize: 9, orientation:'landscape', fitToPage: true, fitToHeight: 80, fitToWidth: 1}
      });

    worksheet.properties.defaultRowHeight = 20;
    worksheet.pageSetup.printTitlesRow = '1:5';

    // adjust pageSetup settings afterwards
    worksheet.pageSetup.margins = {
      left: 0.4, right: 0.4,
      top: 0.4, bottom: 0.4,
      header: 0.2, footer: 0.2
    };

    //Add Row and formatting
    worksheet.mergeCells('C1', 'G4');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '000000' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Fecha
    worksheet.mergeCells('K1:L4');
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('K1');
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true
    }
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    // Datoos de evento
    let CellP1 = worksheet.getCell('H1');
    CellP1.value =  'Tipo:' ;
    CellP1.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellP1.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellP2 = worksheet.getCell('H2');
    CellP2.value =  'Evento:' ;
    CellP2.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellP2.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellP3 = worksheet.getCell('H3');
    CellP3.value =  'Entrega:' ;
    CellP3.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellP3.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellP4 = worksheet.getCell('H4');
    CellP4.value =  'Fecha Evento:' ;
    CellP4.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellP4.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellQ1 = worksheet.getCell('I1');
    CellQ1.value =  excelData.tipo ;
    CellQ1.font = {
      name: 'Calibri',
      size: 11
    }
    CellQ1.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellQ2 = worksheet.getCell('I2');
    CellQ2.value =  excelData.evento ;
    CellQ2.font = {
      name: 'Calibri',
      size: 11
    }
    CellQ2.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellQ3 = worksheet.getCell('I3');
    CellQ3.value =  excelData.entrega ;
    CellQ3.font = {
      name: 'Calibri',
      size: 11
    }
    CellQ3.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellQ4 = worksheet.getCell('I4');
    CellQ4.value =  excelData.fecha ;
    CellQ4.font = {
      name: 'Calibri',
      size: 11
    }
    CellQ4.alignment = { vertical: 'middle', horizontal: 'left' }

    //Add Image
    worksheet.mergeCells('A1:B4');
    let myLogoImage = workbook.addImage({
      base64: logo.imgBase64,
      extension: 'jpeg',
    });
    worksheet.addImage(myLogoImage, 'A1:B3');
    
    //agregar filtros
    if(!excelData.firma){
      worksheet.autoFilter = abcIni + '5:' + abcFin + '5';
    }

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })

    //Ancho de columnas
    worksheet.getColumn(1).width = 10;  
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 40;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 30;
    worksheet.getColumn(9).width = 40;
    worksheet.getColumn(10).width = 15;
    worksheet.getColumn(11).width = 15;
    worksheet.getColumn(12).width = 15;

    // Adding Data with Conditional Formatting
    if(excelData.firma){
      for (const item of data) {
        let row = worksheet.addRow([
          item[0],
          item[1],
          item[2],
          item[3],
          item[4],
          item[5],
          item[6],
          item[7],
          item[8],
          '',
          item[10],
          item[11]
        ]);

        // Añadir firma
        if (!(item[9] == '')) {
          const myBase64Image = item[9];
          let img64 = workbook.addImage({
            base64: myBase64Image,
            extension: 'jpeg',
          });

          worksheet.addImage(img64, {
            tl: { col: 9, row: row.number - 1.1 }, // tl: { col: 9, row: row.number - 1.5 }, top/left Columna 9 y fila actual
            ext: { width: 80, height: 40 }, // Tamaño de la imagen
            editAs: 'absolute'
          });
        }  
      }
    } else {
      data.forEach(d => {
        let row = worksheet.addRow(d);
      });
    }

    // Protect the worksheet with a password
    if(excelData.firma){
      worksheet.protect('eventosPrecotex', {
        selectLockedCells: false, // Prevent selecting locked cells
        selectUnlockedCells: true, // Allow selecting unlocked cells
        formatCells: false, // Prevent formatting cells
        formatColumns: false, // Prevent formatting columns
        formatRows: false, // Prevent formatting rows
        insertColumns: false, // Prevent inserting columns
        insertRows: false, // Prevent inserting rows
        deleteColumns: false, // Prevent deleting columns
        deleteRows: false, // Prevent deleting rows
      });
    }
   
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, title + '.xlsx');
    })


  }

}
