import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import * as logo from './mylogo.js';

@Injectable({
  providedIn: 'root'
})
export class ExceljsAviosVoucherService {

  constructor() {
  }


  public exportExcel(excelData) {

    //Title, Header & Data




    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;
    const encabezado = excelData.encabezado;
 
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
    worksheet.mergeCells('C1', 'J4');
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
    
    //Encabezado
    
    let LiquidacionRow = worksheet.getCell('A5');
    LiquidacionRow.value = "N° de Liquidación: "
    LiquidacionRow.font = {
      name: 'Calibri',
      size: 12
    }
    LiquidacionRow.alignment = { vertical: 'middle', horizontal: 'left' }

    let valorLiquidacionRow = worksheet.getCell('B5');
    valorLiquidacionRow.value = encabezado.liquidacion
    valorLiquidacionRow.font = {
      name: 'Calibri',
      size: 12
    }
    LiquidacionRow.alignment = { vertical: 'middle', horizontal: 'left' }

    let Fecha_LiquidaRow = worksheet.getCell('A6');
    Fecha_LiquidaRow.value = "Fecha: "
    Fecha_LiquidaRow.font = {
      name: 'Calibri',
      size: 12
    }
    Fecha_LiquidaRow.alignment = { vertical: 'middle', horizontal: 'left' }

    let valorFecha_LiquidanRow = worksheet.getCell('B6');
    valorFecha_LiquidanRow.value = encabezado.fecha_liquida.substring(0,10);
    valorFecha_LiquidanRow.font = {
      name: 'Calibri',
      size: 12
    }
    valorFecha_LiquidanRow.alignment = { vertical: 'middle', horizontal: 'left' }

    let AreaRow = worksheet.getCell('A7');
    AreaRow.value = "Area: "
    AreaRow.font = {
      name: 'Calibri',
      size: 12
    }
    AreaRow.alignment = { vertical: 'middle', horizontal: 'left' }

    let valorAreaRow = worksheet.getCell('B7');
    valorAreaRow.value = encabezado.area;
    valorAreaRow.font = {
      name: 'Calibri',
      size: 12
    }
    valorAreaRow.alignment = { vertical: 'middle', horizontal: 'left' }
    
    let LineaRow = worksheet.getCell('A8');
    LineaRow.value = "Línea: "
    LineaRow.font = {
      name: 'Calibri',
      size: 12
    }
    LineaRow.alignment = { vertical: 'middle', horizontal: 'left' }

    let valorLineaRow = worksheet.getCell('B8');
    valorLineaRow.value = encabezado.linea;
    valorLineaRow.font = {
      name: 'Calibri',
      size: 12
    }
    valorLineaRow.alignment = { vertical: 'middle', horizontal: 'left' }

    let ResponsableRow = worksheet.getCell('A9');
    ResponsableRow.value = "Responsable: "
    ResponsableRow.font = {
      name: 'Calibri',
      size: 12
    }
    ResponsableRow.alignment = { vertical: 'middle', horizontal: 'left' }

    let valorResponsableRow = worksheet.getCell('B9');
    valorResponsableRow.value = encabezado.resp_liquida;
    valorResponsableRow.font = {
      name: 'Calibri',
      size: 12
    }
    valorResponsableRow.alignment = { vertical: 'middle', horizontal: 'left' }

    let ClienteRow = worksheet.getCell('A10');
    ClienteRow.value = "Cliente: "
    ClienteRow.font = {
      name: 'Calibri',
      size: 12
    }
    ClienteRow.alignment = { vertical: 'middle', horizontal: 'left' }

    let valorClienteRow = worksheet.getCell('B10');
    valorClienteRow.value = encabezado.cod_cliente;
    valorClienteRow.font = {
      name: 'Calibri',
      size: 12
    }
    valorClienteRow.alignment = { vertical: 'middle', horizontal: 'left' }
    
    //agregar filtros
    worksheet.autoFilter = abcIni + '11:' + abcFin + '11';

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

    })

    // Adding Data with Conditional Formatting
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

    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 10;
    worksheet.getColumn(4).width = 50;
    worksheet.getColumn(5).width = 10;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 10;
    worksheet.getColumn(8).width = 40;
    worksheet.getColumn(9).width = 10;
    worksheet.getColumn(10).width = 10;
    worksheet.getColumn(11).width = 10;
    worksheet.getColumn(12).width = 40;



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





    ////////////////////////////////


    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, title + '.xlsx');
    })



  }

}
