import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import * as logo from './mylogo.js';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ExceljsKardexJabasService {

  constructor() {
  }


  public exportExcel(excelData) {

    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;


    
    var abc = 64
    //var abc2 = 64
    var abcIni = ''
    var abcFin = ''
    //var abcIni2 = ''
    for (let i = 0; i < header.length; i++) {
      abc = abc + 1
      //abc2 = abc2 + 1
      if (i == 0) {
        abcIni = String.fromCharCode(Number(abc))
        //abcIni2 = String.fromCharCode(Number(abc2))
      }
      /*if(abc == 90){
        abc2 = 64 
      }*/
    }
    abcFin = String.fromCharCode(Number(abc))


    var abcIni2 = ''
    var abcFin2 = ''
    //var abcIni2 = ''
    for (let i = 0; i < header.length; i++) {
      abc = abc + 1
      //abc2 = abc2 + 1
      if (i == 0) {
        abcIni2 = String.fromCharCode(Number(abc))
        //abcIni2 = String.fromCharCode(Number(abc2))
      }
      /*if(abc == 90){
        abc2 = 64 
      }*/
    }
    abcFin2 = String.fromCharCode(Number(abc))

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);


    //Add Row and formatting
    worksheet.mergeCells('C1', 'F4');
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

    // Date
    worksheet.mergeCells('G1:H4');
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('G1');
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true
    }
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    //Add Image
    worksheet.mergeCells('A1:B4');
    let myLogoImage = workbook.addImage({
      base64: logo.imgBase64,
      extension: 'jpeg',
    });
    worksheet.addImage(myLogoImage, 'A1:B3');
    //let imageRow = worksheet.getCell('A1');
    //imageRow.alignment = { vertical: 'middle', horizontal: 'center' }

    //Blank Row 
    //worksheet.addRow([]);

    //agregar filtros
    //worksheet.autoFilter = abcIni + '5:' + abcFin + '5';

    //worksheet.autoFilter = 'A5:L5';


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
      cell.alignment = { 
        horizontal: 'center', 
        vertical: 'middle' 
      }
      

    })

    // Adding Data with Conditional Formatting

    for (const row1 of data) {
      let row = worksheet.addRow([
        row1.N,
        _moment(row1.Fecha_Registro_Java.date.valueOf()).format('DD/MM/YYYY'),      
        row1.Codigo_Barra,
        row1.Origen,                
        _moment(row1.Fecha_Registro.date.valueOf()).format('DD/MM/YYYY'),  
        row1.Num_Movstk,
        row1.Guia,
        row1.Destino 

      ]);
    }
  

    /*
    data.forEach(d => {
      let row = worksheet.addRow(d);

      // let sales = row.getCell(6);
      // let color = 'FF99FF99';
      // if (+sales.value < 200000) {
      //   color = 'FF9999'
      // }

      // sales.fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: color }
      // }
      // const rows = worksheet.getRow(d);
      // rows.height = 20

    }
    );
*/
 
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
 
    const c1 = worksheet.getColumn(1);
    c1.alignment = { horizontal: 'center' };
    const c2 = worksheet.getColumn(2);
    c2.alignment = { horizontal: 'center' };
    const c3 = worksheet.getColumn(3);
    c3.alignment = { horizontal: 'center' };
    const c4 = worksheet.getColumn(4);
    c4.alignment = { horizontal: 'center' };
    const c5 = worksheet.getColumn(5);
    c5.alignment = { horizontal: 'center' };
    const c6 = worksheet.getColumn(6);
    c6.alignment = { horizontal: 'center' };
    const c7 = worksheet.getColumn(7);
    c7.alignment = { horizontal: 'center' };
    const c8 = worksheet.getColumn(8);
    c8.alignment = { horizontal: 'center' };

    //worksheet.addRow([]);


    //Footer Row
    let footerRow = worksheet.addRow(['']);
    /*footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid'
    };

    footerRow.getCell(1).font = {      
      color: { argb: 'FFFFFF' },
      size: 12
    }*/

    //Merge Cells
    worksheet.mergeCells(`` + abcIni + `${footerRow.number}:` + abcFin + `${footerRow.number}`);

 

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, title + '.xlsx');
    })



  }

}
