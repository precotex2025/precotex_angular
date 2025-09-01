import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import * as logo from './mylogo.js';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ExceljsAuditoriaChecklistService {

  constructor() {
  }


  public exportExcel(excelData) {

    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.header;
    const data = excelData.data;
    const dataDetalle = excelData.dataDetalle;
    const dataDefecto = excelData.dataDefecto;
    
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
  
    var i=0;
    var j=0;
    var status='';
    let ln_num = 0;
    for (const row1 of data) {
      const linea = row1.Cod_LinPro.split("-");
      ln_num = 0;

      for (const row2 of dataDetalle) {  
      
        if(row1.Num_Auditoria==row2.Num_Auditoria ){      
          switch (row2.Flg_Status) {
            case 'A':
              status = 'APROBADO';
                break;
            case 'D':
              status = 'DESAPROBADO';
                break;
            case 'R':
              status = 'REPROCESO';
                break;
            case 'X':
              status = 'POR DEFINIR	';
                break;              
          }  
    
          const existePersona = dataDefecto.some(defecto => defecto.Num_Auditoria_Detalle === row2.Num_Auditoria_Detalle);
          
          if(existePersona==false){
            let row = worksheet.addRow([
              row1.Fecha_Auditoria,
              row1.Num_Auditoria,      
              row2.Num_Auditoria_Detalle,
              row1.Cod_Usuario,                
              row1.Nom_Auditor,  
              'COSTURA',
              linea[0],
              linea[1],
              row2.Des_Cliente,
              row2.Cod_EstCli,
              row2.Cod_OrdCor,
              row2.Cod_OrdPro,
              row2.Des_Present,
              row2.Can_Lote,
              row2.Can_Muestra,
              '',
              '',
              '',
              status,
              row2.Medidas,
              row2.Muestra_Fisica ? (row2.Muestra_Fisica == 1 ? "SI" : "NO") : "",
              row2.Checklist ? (row2.Checklist == 1 ? "SI" : "NO") : "",
              row1.Observacion,
              row2.Observacion    
            ]);       
          }else{
            for (const row3 of dataDefecto) {

              if(row2.Num_Auditoria_Detalle==row3.Num_Auditoria_Detalle){              
                let row = worksheet.addRow([
                  row1.Fecha_Auditoria,
                  row1.Num_Auditoria,      
                  row2.Num_Auditoria_Detalle,
                  row1.Cod_Usuario,                
                  row1.Nom_Auditor,  
                  'COSTURA',
                  linea[0],
                  linea[1],
                  row2.Des_Cliente,
                  row2.Cod_EstCli,
                  row2.Cod_OrdCor,
                  row2.Cod_OrdPro,
                  row2.Des_Present,
                  ln_num ==0 ? row2.Can_Lote : 0,
                  ln_num ==0 ? row2.Can_Muestra : 0,
                  row3.Cod_Motivo,
                  row3.Descripcion,
                  row3.Cantidad,
                  ln_num ==0 ? status : '',
                  row2.Medidas,
                  row2.Muestra_Fisica ? (row2.Muestra_Fisica == 1 ? "SI" : "NO") : "",
                  row2.Checklist ? (row2.Checklist == 1 ? "SI" : "NO") : "",
                  row1.Observacion,
                  row2.Observacion    
                ]);
                ln_num++;
              }
            }
            ln_num = 0;  
          }
          ln_num = 0;
        }
      }      
      i++;     
       
    }
 
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 25;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 10;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 30;
    worksheet.getColumn(11).width = 10;
    worksheet.getColumn(12).width = 10;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(14).width = 10;
    worksheet.getColumn(15).width = 10;
    worksheet.getColumn(16).width = 10;
    worksheet.getColumn(17).width = 30;
    worksheet.getColumn(18).width = 15;
    worksheet.getColumn(19).width = 15;
    worksheet.getColumn(20).width = 30;
    worksheet.getColumn(21).width = 30;
 
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
