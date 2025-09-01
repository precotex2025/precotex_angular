import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import * as logo from './mylogo.js';
import { ToastrComponentlessModule } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ExceljsHojaMedidaService {

  
  public exportExcel(excelData) {

    //Title, Header & Data
     const title  = excelData.title;
     const header = excelData.headers
     const data   = excelData.data;
     var nomTipo = '';
     var abc = 64
     //var abc2 = 64
     var abcIni = ''
     var abcFin = ''
     //var abcIni2 = ''
     for (let i = 0; i < header.length; i++) {
       abc = abc + 1
       //abc2 = abc2 + 1
       if(i == 0){
         abcIni = String.fromCharCode(Number(abc))
         //abcIni2 = String.fromCharCode(Number(abc2))
       }
       /*if(abc == 90){
         abc2 = 64 
       }*/
     }
     abcFin = String.fromCharCode(Number(abc))
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);

 
    //Add Row and formatting
    worksheet.mergeCells('F1', 'O4');
    let titleRow = worksheet.getCell('H1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '000000' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
   
   // worksheet.mergeCells('P1:V2');
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
  
    let CellP1 = worksheet.getCell('P1');
    CellP1.value =  'CLIENTE:' ;
    CellP1.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellP1.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellP2 = worksheet.getCell('P2');
    CellP2.value =  'ESTILO:' ;
    CellP2.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellP2.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellP3 = worksheet.getCell('P3');
    CellP3.value =  'OP:' ;
    CellP3.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellP3.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellP4 = worksheet.getCell('P4');
    CellP4.value =  'COLOR:' ;
    CellP4.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellP4.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellQ1 = worksheet.getCell('Q1');
    CellQ1.value =  excelData.Nom_Cliente ;
    CellQ1.font = {
      name: 'Calibri',
      size: 11
    }
    CellQ1.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellQ2 = worksheet.getCell('Q2');
    CellQ2.value =  excelData.Cod_EstCli ;
    CellQ2.font = {
      name: 'Calibri',
      size: 11
    }
    CellQ2.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellQ3 = worksheet.getCell('Q3');
    CellQ3.value =  excelData.Cod_OrdPro ;
    CellQ3.font = {
      name: 'Calibri',
      size: 11
    }
    CellQ3.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellQ4 = worksheet.getCell('Q4');
    CellQ4.value =  excelData.Cod_ColCli ;
    CellQ4.font = {
      name: 'Calibri',
      size: 11
    }
    CellQ4.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellU1 = worksheet.getCell('U1');
    CellU1.value =  'LINEA:' ;
    CellU1.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellU1.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellU2 = worksheet.getCell('U2');
    CellU2.value =  'TIPO:' ;
    CellU2.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellU2.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellU3 = worksheet.getCell('U3');
    CellU3.value =  'AUDITOR:' ;
    CellU3.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellU3.alignment = { vertical: 'middle', horizontal: 'left' }

 
    let CellV1 = worksheet.getCell('V1');
    CellV1.value =  excelData.Cod_LinPro ;
    CellV1.font = {
      name: 'Calibri',
      size: 11
    }
    CellV1.alignment = { vertical: 'middle', horizontal: 'left' }
    
    if(excelData.Tipo==1){
      nomTipo='Antes de Vapor';
    }else{
      nomTipo='Después de Vapor';
    }
    let CellV2 = worksheet.getCell('V2');
    CellV2.value =  nomTipo ;
    CellV2.font = {
      name: 'Calibri',
      size: 11
    }
    CellV2.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellV3 = worksheet.getCell('V3');
    CellV3.value =  excelData.Auditor ;
    CellV3.font = {
      name: 'Calibri',
      size: 11
    }
    CellV3.alignment = { vertical: 'middle', horizontal: 'left' }

    //Add Image
    worksheet.mergeCells('C1:E4');
    let myLogoImage = workbook.addImage({
      base64: logo.imgBase64,
      extension: 'jpeg',
    });
    worksheet.addImage(myLogoImage, 'C1:D3');
    //let imageRow = worksheet.getCell('A1');
    //imageRow.alignment = { vertical: 'middle', horizontal: 'center' }
    
    //Blank Row 
    //worksheet.addRow([]);

    //agregar filtros
    worksheet.autoFilter = abcIni+'5:'+abcFin+'5'; 
    
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

      /*let sales = row.getCell(6);
      let color = 'FF99FF99';
      if (+sales.value < 200000) {
        color = 'FF9999'
      }

      sales.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }*/
      /*const rows = worksheet.getRow(d);
      rows.height = 20*/
      
    }
    );
    
    worksheet.getColumn(1).width = 0;
    worksheet.getColumn(2).width = 0;
    worksheet.getColumn(3).width = 10;
    worksheet.getColumn(4).width = 40;
    worksheet.getColumn(5).width = 13;
    //worksheet.addRow([]);

    //Footer Row
    let footerRow = worksheet.addRow([title + ' - Fecha: ' + date]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' }
    };

    footerRow.getCell(1).font = {
      bold: true,
      color: { argb: 'FFFFFF' },
      size: 12
    }
    var r = data.length + 6;
    console.log(r);
    //Merge Cells
    worksheet.mergeCells(``+abcIni+`${footerRow.number}:`+abcFin+`${footerRow.number}`);
    worksheet.pageSetup.orientation = 'landscape'
    worksheet.pageSetup.printArea = ('A1:AI'+r);
    worksheet.pageSetup.scale.toPrecision(85);
    worksheet.pageSetup.fitToHeight = 1
    worksheet.pageSetup.fitToWidth = 1
    worksheet.pageSetup.scale = 1
    worksheet.pageSetup.fitToPage = true
    worksheet.pageSetup.paperSize = 9; // B5 (JIS)
    worksheet.pageSetup.horizontalCentered = true;

    worksheet.pageSetup.margins = {
    left: 0, right: 0,
    top: 0, bottom: 0,
    header: 0, footer: 0
};
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, title + '.xlsx');
    })
   
  }


  public exportExcelMolde(excelData) {
    const title  = excelData.title;
    const header = excelData.headers
    const data   = excelData.data;

    var nomTipo = '';
    var abc = 64
    var abcIni = ''
    var abcFin = ''

    for (let i = 0; i < header.length; i++) {
      abc = abc + 1;

      if(i == 0){
        abcIni = String.fromCharCode(Number(abc));
      } else if((abc % 90) == 0){
        abc = 64;
        abcFin = String.fromCharCode(Number(abc + Math.trunc(i / 25)));
      }
    }

    abcFin = abcFin.concat(String.fromCharCode(Number(abc)));

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);

    //Add Row and formatting
    worksheet.mergeCells('F1', 'O4');
    let titleRow = worksheet.getCell('H1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '000000' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
   
    // worksheet.mergeCells('P1:V2');
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
  
    let CellP1 = worksheet.getCell('P1');
    CellP1.value =  'CLIENTE:' ;
    CellP1.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellP1.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellP2 = worksheet.getCell('P2');
    CellP2.value =  'ESTILO:' ;
    CellP2.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellP2.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellP3 = worksheet.getCell('P3');
    CellP3.value =  'OP:' ;
    CellP3.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellP3.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellP4 = worksheet.getCell('P4');
    CellP4.value =  'COLOR:' ;
    CellP4.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellP4.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellQ1 = worksheet.getCell('Q1');
    CellQ1.value =  excelData.Nom_Cliente ;
    CellQ1.font = {
      name: 'Calibri',
      size: 11
    }
    CellQ1.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellQ2 = worksheet.getCell('Q2');
    CellQ2.value =  excelData.Cod_EstCli ;
    CellQ2.font = {
      name: 'Calibri',
      size: 11
    }
    CellQ2.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellQ3 = worksheet.getCell('Q3');
    CellQ3.value =  excelData.Cod_OrdPro ;
    CellQ3.font = {
      name: 'Calibri',
      size: 11
    }
    CellQ3.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellQ4 = worksheet.getCell('Q4');
    CellQ4.value =  excelData.Cod_ColCli ;
    CellQ4.font = {
      name: 'Calibri',
      size: 11
    }
    CellQ4.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellU1 = worksheet.getCell('U1');
    CellU1.value =  'E/P VERSION:' ;
    CellU1.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellU1.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellU2 = worksheet.getCell('U2');
    CellU2.value =  'TEMPORADA:' ;
    CellU2.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellU2.alignment = { vertical: 'middle', horizontal: 'left' }
    
    let CellU3 = worksheet.getCell('U3');
    CellU3.value =  'MODULO:' ;
    CellU3.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellU3.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellU4 = worksheet.getCell('U4');
    CellU4.value =  'AUDITOR:' ;
    CellU4.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellU4.alignment = { vertical: 'middle', horizontal: 'left' }
 
    let CellV1 = worksheet.getCell('V1');
    CellV1.value =  excelData.Cod_EstPro + ' / ' + excelData.Cod_Version;
    CellV1.font = {
      name: 'Calibri',
      size: 11
    }
    CellV1.alignment = { vertical: 'middle', horizontal: 'left' }
    
    let CellV2 = worksheet.getCell('V2');
    CellV2.value =  excelData.Nom_TemCli;
    CellV2.font = {
      name: 'Calibri',
      size: 11
    }
    CellV2.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellV3 = worksheet.getCell('V3');
    CellV3.value =  excelData.Des_Modulo ;
    CellV3.font = {
      name: 'Calibri',
      size: 11
    }
    CellV3.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellV4 = worksheet.getCell('V4');
    CellV4.value =  excelData.Nom_Auditor ;
    CellV4.font = {
      name: 'Calibri',
      size: 11
    }
    CellV4.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellZ1 = worksheet.getCell('Z1');
    CellZ1.value =  'ENCOGIMIENTO:';
    CellZ1.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellZ1.alignment = { vertical: 'middle', horizontal: 'left' }

    let CellZ2 = worksheet.getCell('Z2');
    CellZ2.value =  'COLOR PARTIDA:';
    CellZ2.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellZ2.alignment = { vertical: 'middle', horizontal: 'left' }
    

    let CellAA1 = worksheet.getCell('AA1');
    CellAA1.value =  excelData.Encogimiento;
    CellAA1.font = {
      name: 'Calibri',
      size: 11
    }
    CellAA1.alignment = { vertical: 'middle', horizontal: 'left' }
    
    let CellAA2 = worksheet.getCell('AA2');
    CellAA2.value =  excelData.ColorPartida;
    CellAA2.font = {
      name: 'Calibri',
      size: 11
    }
    CellAA2.alignment = { vertical: 'middle', horizontal: 'left' }

    //Add Image
    worksheet.mergeCells('C1:E4');
    let myLogoImage = workbook.addImage({
      base64: logo.imgBase64,
      extension: 'jpeg',
    });
    worksheet.addImage(myLogoImage, 'C1:D3');

    worksheet.autoFilter = abcIni+'5:'+abcFin+'5'; 
    
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
      }
    );
    
    worksheet.getColumn(1).width = 0;
    worksheet.getColumn(2).width = 0;
    worksheet.getColumn(3).width = 10;
    worksheet.getColumn(4).width = 40;
    worksheet.getColumn(5).width = 13;
     

    //Footer Row
    let footerRow = worksheet.addRow([title + ' - Fecha: ' + date]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' }
    };

    footerRow.getCell(1).font = {
      bold: true,
      color: { argb: 'FFFFFF' },
      size: 12
    }
    var r = data.length + 6;
    console.log(r);
    //Merge Cells
    worksheet.mergeCells(``+abcIni+`${footerRow.number}:`+abcFin+`${footerRow.number}`);
    worksheet.pageSetup.orientation = 'landscape'
    worksheet.pageSetup.printArea = ('A1:AI'+r);
    worksheet.pageSetup.scale.toPrecision(85);
    worksheet.pageSetup.fitToHeight = 1
    worksheet.pageSetup.fitToWidth = 1
    worksheet.pageSetup.scale = 1
    worksheet.pageSetup.fitToPage = true
    worksheet.pageSetup.paperSize = 9; // B5 (JIS)
    worksheet.pageSetup.horizontalCentered = true;

    worksheet.pageSetup.margins = {
    left: 0, right: 0,
    top: 0, bottom: 0,
    header: 0, footer: 0
    };
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, title + '.xlsx');
    })
  
  }


  public exportExcelEncogimiento(excelData) {
    const title  = excelData.title;
    const header = excelData.headers
    const data   = excelData.data;
    const data_esp = excelData.especificaciones;
    const cab_esp = excelData.cabecera

    var abc = 64;
    var abcIni = '';
    var abcFin = '';

    for (let i = 0; i < header.length; i++) {
      abc = abc + 1

      if(i == 0){
        abcIni = String.fromCharCode(Number(abc));
      } else if((abc % 90) == 0){
        abc = 64;
        abcFin = String.fromCharCode(Number(abc + Math.trunc(i / 25)));
      }
    }

    abcFin = abcFin.concat(String.fromCharCode(Number(abc)));
    
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);

    //Add Logo Precotex
    worksheet.mergeCells('B1:D3');
    let myLogoImage = workbook.addImage({
      base64: logo.imgBase64,
      extension: 'jpeg',
    });
    worksheet.addImage(myLogoImage, 'B1:D3');

    //Add Imagen Prenda
    worksheet.mergeCells('AB1:AE8');
    let myImage = workbook.addImage({
      base64: excelData.img64,
      extension: 'jpeg',
    });
    worksheet.addImage(myImage, 'AB1:AE8');

    //Add Row and formatting
    worksheet.mergeCells('F1', 'O4');
    let titleRow = worksheet.getCell('H1');
    titleRow.value = title.substring(0,46);
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '000000' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
   
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    
    //Cliente
    let CellR1 = worksheet.getCell('R1');
    CellR1.value =  'Cliente:' ;
    CellR1.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellR1.alignment = { vertical: 'middle', horizontal: 'right' }

    let CellS1 = worksheet.getCell('S1');
    CellS1.value =  excelData.Nom_Cliente ;
    CellS1.font = {
      name: 'Calibri',
      size: 11
    }
    CellS1.alignment = { vertical: 'middle', horizontal: 'left' }

    //Estilo Cliente
    let CellV1 = worksheet.getCell('V1');
    CellV1.value =  'Estilo Cliente:' ;
    CellV1.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellV1.alignment = { vertical: 'middle', horizontal: 'right' }

    let CellW1 = worksheet.getCell('W1');
    CellW1.value =  excelData.Cod_EstCli ;
    CellW1.font = {
      name: 'Calibri',
      size: 11
    }
    CellW1.alignment = { vertical: 'middle', horizontal: 'left' }    

    //Versión
    let CellY1 = worksheet.getCell('Y1');
    CellY1.value =  'Versión:' ;
    CellY1.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellY1.alignment = { vertical: 'middle', horizontal: 'right' }

    let CellZ1 = worksheet.getCell('Z1');
    CellZ1.value =  excelData.Cod_Version ;
    CellZ1.font = {
      name: 'Calibri',
      size: 11
    }
    CellZ1.alignment = { vertical: 'middle', horizontal: 'left' }

    //Estilo Propio
    let CellR2 = worksheet.getCell('R2');
    CellR2.value = 'Estilo Propio:' ;
    CellR2.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellR2.alignment = { vertical: 'middle', horizontal: 'right' }

    let CellS2 = worksheet.getCell('S2');
    CellS2.value =  excelData.Cod_EstPro ;
    CellS2.font = {
      name: 'Calibri',
      size: 11
    }
    CellS2.alignment = { vertical: 'middle', horizontal: 'left' }

    //OP
    let CellV2 = worksheet.getCell('V2');
    CellV2.value =  'OP:' ;
    CellV2.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellV2.alignment = { vertical: 'middle', horizontal: 'right' }

    let CellW2 = worksheet.getCell('W2');
    CellW2.value =  excelData.Cod_OrdPro;
    CellW2.font = {
      name: 'Calibri',
      size: 11
    }
    CellW2.alignment = { vertical: 'middle', horizontal: 'left' }

    //Talla
    let CellY2 = worksheet.getCell('Y2');
    CellY2.value =  'Talla Base:' ;
    CellY2.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellY2.alignment = { vertical: 'middle', horizontal: 'right' }
 
    let CellZ2 = worksheet.getCell('Z2');
    CellZ2.value =  excelData.Cod_Talla ;
    CellZ2.font = {
      name: 'Calibri',
      size: 11
    }
    CellZ2.alignment = { vertical: 'middle', horizontal: 'left' }

    //Temporada
    let CellR3 = worksheet.getCell('R3');
    CellR3.value = 'Temporada:';
    CellR3.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellR3.alignment = { vertical: 'middle', horizontal: 'right' }

    let CellS3 = worksheet.getCell('S3');
    CellS3.value =  excelData.Nom_TemCli;
    CellS3.font = {
      name: 'Calibri',
      size: 11
    }
    CellS3.alignment = { vertical: 'middle', horizontal: 'left' }

    //Modelista    
    let CellV3 = worksheet.getCell('V3');
    CellV3.value =  'Modelista:' ;
    CellV3.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellV3.alignment = { vertical: 'middle', horizontal: 'right' }

    let CellW3 = worksheet.getCell('W3');
    CellW3.value =  excelData.Nom_Modelista;
    CellW3.font = {
      name: 'Calibri',
      size: 11
    }
    CellW3.alignment = { vertical: 'middle', horizontal: 'left' }
    
    //Ruta de Prenda
    let CellR4 = worksheet.getCell('R4');
    CellR4.value = 'Ruta de Prenda:';
    CellR4.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellR4.alignment = { vertical: 'middle', horizontal: 'right' }

    let CellS4 = worksheet.getCell('S4');
    CellS4.value =  excelData.Ruta_Prenda;
    CellS4.font = {
      name: 'Calibri',
      size: 11
    }
    CellS4.alignment = { vertical: 'middle', horizontal: 'left' }

    //ESPECIFICACIONES

    worksheet.mergeCells('H6:Z6');
    let CellHZ = worksheet.getCell('H6');
    CellHZ.value = 'T E L A';
    CellHZ.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellHZ.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellHZ.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('H7:I7');
    let CellHI = worksheet.getCell('H7');
    CellHI.value = 'Densidad';
    CellHI.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellHI.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellHI.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('J7:L7');
    let CellJL = worksheet.getCell('J7');
    CellJL.value = 'Revirado';
    CellJL.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellJL.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellJL.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('M7:O7');
    let CellMO = worksheet.getCell('M7');
    CellMO.value = 'Inclinación de trama';
    CellMO.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellMO.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellMO.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('P7:Q7');
    let CellPQ = worksheet.getCell('P7');
    CellPQ.value = 'Encogimiento std';
    CellPQ.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellPQ.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellPQ.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('R7:S7');
    let CellRS = worksheet.getCell('R7');
    CellRS.value = 'Encogimiento real 1er lavado';
    CellRS.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellRS.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellRS.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('T7:U7');
    let CellTU = worksheet.getCell('T7');
    CellTU.value = 'Encogimiento real 3er lavado';
    CellTU.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellTU.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellTU.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('V7:W7');
    let CellVW = worksheet.getCell('V7');
    CellVW.value = 'Encogimiento residual';
    CellVW.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellVW.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellVW.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('X7:Z7');
    let CellXZ = worksheet.getCell('X7');
    CellXZ.value = 'Inclinación de trama residual';
    CellXZ.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellXZ.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellXZ.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    let i=0;
    cab_esp.forEach(e => {
      i++;      
      worksheet.getCell(8, i).value = e.replace(/_/g," ")
      worksheet.getCell(8, i).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      worksheet.getCell(8, i).font = {
        color: { argb: 'FFFFFF' },
        size: 10,
        bold: true
      }
      worksheet.getCell(8, i).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    });

    let j=8;
    data_esp.forEach(e => {
      i=0;
      j++;
      e.forEach(d => {
        i++;
        worksheet.getCell(j, i).value = d + (i>9 ? '%' : '');
      })
    });

    //-- Fin Especificaciones

    worksheet.addRow([]);
    worksheet.addRow([]);

    j = j + 2;
    worksheet.mergeCells(j, 7, j, 10);
    let CellGJ = worksheet.getCell(j, 7);
    CellGJ.value = 'PIEZAS';
    CellGJ.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellGJ.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellGJ.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells(j, 11, j, 14);
    let CellKN = worksheet.getCell(j, 11);
    CellKN.value = 'ESTAMPADO';
    CellKN.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellKN.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellKN.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells(j, 15, j, 18);
    let CellOR = worksheet.getCell(j, 15);
    CellOR.value = 'BORDADO';
    CellOR.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellOR.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellOR.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells(j, 19, j, 22);
    let CellSV = worksheet.getCell(j, 19);
    CellSV.value = 'COSTURA';
    CellSV.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellSV.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellSV.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells(j, 23, j, 26);
    let CellWZ = worksheet.getCell(j, 23);
    CellWZ.value = 'LAVADO';
    CellWZ.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellWZ.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellWZ.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells(j, 27, j, 30);
    let CellAAAD = worksheet.getCell(j, 27);
    CellAAAD.value = 'VAPORIZADO';
    CellAAAD.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    CellAAAD.font = {
      color: { argb: 'FFFFFF' },
      size: 11,
      bold: true
    }
    CellAAAD.alignment = { vertical: 'middle', horizontal: 'center' }   

    j++;
    worksheet.autoFilter = abcIni+j.toString()+':'+abcFin+j.toString(); 
    
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
        size: 10
      }
    })

    // Adding Data with Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);     
      }
    );
    
    worksheet.getColumn(1).width = 0;
    worksheet.getColumn(2).width = 8;
    worksheet.getColumn(3).width = 10;
    worksheet.getColumn(4).width = 40;
    worksheet.getColumn(5).width = 13;
     
    //Footer Row
    let footerRow = worksheet.addRow([title + ' - Fecha: ' + date]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' }
    };

    footerRow.getCell(1).font = {
      bold: true,
      color: { argb: 'FFFFFF' },
      size: 12
    }
    var r = data.length + 6;
    console.log(r);
    //Merge Cells
    worksheet.mergeCells(``+abcIni+`${footerRow.number}:`+abcFin+`${footerRow.number}`);

    worksheet.pageSetup.orientation = 'landscape';
    worksheet.pageSetup.printArea = ('A1:AI'+r);
    worksheet.pageSetup.scale.toPrecision(85);
    worksheet.pageSetup.fitToHeight = 1;
    worksheet.pageSetup.fitToWidth = 1;
    worksheet.pageSetup.scale = 1;
    worksheet.pageSetup.fitToPage = true;
    worksheet.pageSetup.paperSize = 9; // B5 (JIS)
    worksheet.pageSetup.horizontalCentered = true;

    worksheet.pageSetup.margins = {
    left: 0, right: 0,
    top: 0, bottom: 0,
    header: 0, footer: 0
    };
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, title + '.xlsx');
    })
  
  }



}
