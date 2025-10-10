import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import * as logo from './mylogo.js';
import { firstValueFrom } from 'rxjs';
import { TiProcesosTintoreriaService } from 'src/app/services/ti-procesos-tintoreria.service';
import { RetiroRepuestosService } from './RetiroRepuestos/retiro-repuestos.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import { param } from 'jquery';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class ExceljsService {
  imagenUrl: string = '';
  baseUrlTinto = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });
  
  imageBase64: string | null = null;

  constructor(
              private serviceTiProcesoTintoreria: TiProcesosTintoreriaService,
              private serviceRetiroRepuestos: RetiroRepuestosService,
              private toastr: ToastrService,
              private http: HttpClient
  ) {}


  async exportExcel3(excelData){

    //Title, Header & Data
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
    abcFin = String.fromCharCode(Number(abc))

    var abcIni2 = ''
    var abcFin2 = ''
    for (let i = 0; i < header.length; i++) {
      abc = abc + 1
      if (i == 0) {
        abcIni2 = String.fromCharCode(Number(abc))
      }
    }
    abcFin2 = String.fromCharCode(Number(abc))    

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);    

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

    // Date
    worksheet.mergeCells('H1:L4');
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('H1');
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

    //agregar filtros
    worksheet.autoFilter = abcIni + '5:' + abcFin + '5';

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
    
    //Recorre la data y pinta 
    for (const d of data) {
      let row = worksheet.addRow(d);
      //String(d[9]).replace(' ','%20')
      if (!(d[9] == '')) {
        const URL_BASE = String(d[9]).replace(' ','%20');
        const response = await firstValueFrom(this.serviceTiProcesoTintoreria.GetImageBase64FromUrlAsync(URL_BASE));      
        this.imageBase64 = `data:image/jpeg;base64,${response.base64Image}`;

        let myLogoImage900 = workbook.addImage({
          base64: this.imageBase64,
          extension: 'jpeg',
        });

        worksheet.addImage(myLogoImage900, {
          tl: { col: 9, row: row.number - 1 }, // Columna 3 (2 base 0) y fila actual
          ext: { width: 67, height: 40 }, // Tamaño de la imagen
        });   
      }
      // Limpia el valor textual de la celda
      row.getCell(10).value = null;
      worksheet.getRow(row.number).height = 28;

    }
    
    let ultReg = data.length + 5;
    const ultrows = worksheet.getRow(ultReg);
    ultrows.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EEEEEE' },
        bgColor: { argb: '' }
    }
    ultrows.font = {
      bold: true
    }

    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 40;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 10;
    worksheet.getColumn(9).width = 10;
    worksheet.getColumn(10).width = 10;
    worksheet.getColumn(11).width = 10;
    worksheet.getColumn(12).width = 10;    

    //Footer Row
    let footerRow = worksheet.addRow(['']);

    //Merge Cells
    worksheet.mergeCells(`` + abcIni + `${footerRow.number}:` + abcFin + `${footerRow.number}`);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, title + '.xlsx');
    })
  }  

  async exportExcel2(excelData){

    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;
	
	let totalSum = 0;
	
    // Sumar valores de la columna 6
    for (const row of data) {
      totalSum += Number(row[6]) || 0; // Asegúrate de que la columna 6 tenga valores numéricos
    }	

    var abc = 64
    var abcIni = ''
    var abcFin = ''
    for (let i = 0; i < header.length; i++) {
      abc = abc + 1
      if (i == 0) {
        abcIni = String.fromCharCode(Number(abc))
      }
    }
    abcFin = String.fromCharCode(Number(abc))

    var abcIni2 = ''
    var abcFin2 = ''
    for (let i = 0; i < header.length; i++) {
      abc = abc + 1
      if (i == 0) {
        abcIni2 = String.fromCharCode(Number(abc))
      }
    }
    abcFin2 = String.fromCharCode(Number(abc))    

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);    

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

    // Date
    worksheet.mergeCells('H1:L4');
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('H1');
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

    //agregar filtros
    worksheet.autoFilter = abcIni + '5:' + abcFin + '5';

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
    
    //Recorre la data y pinta 
    for (const d of data) {
      let row = worksheet.addRow(d);
      //String(d[9]).replace(' ','%20')
      if (!(d[9] == '')) {
        const URL_BASE = String(d[9]).replace(' ','%20');
        console.log(URL_BASE);
        const response = await firstValueFrom(this.serviceTiProcesoTintoreria.GetImageBase64FromUrlAsync(URL_BASE));      
        this.imageBase64 = `data:image/jpeg;base64,${response.base64Image}`;

        let myLogoImage900 = workbook.addImage({
          base64: this.imageBase64,
          extension: 'jpeg',
        });

        worksheet.addImage(myLogoImage900, {
          tl: { col: 9, row: row.number - 1 }, // Columna 3 (2 base 0) y fila actual
          ext: { width: 67, height: 40 }, // Tamaño de la imagen
        });   
      }
      // Limpia el valor textual de la celda
      row.getCell(10).value = null;
      worksheet.getRow(row.number).height = 28;

    }
	
	
    
    let ultReg = data.length + 5;
    const ultrows = worksheet.getRow(ultReg);
    ultrows.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EEEEEE' },
        bgColor: { argb: '' }
    }
    ultrows.font = {
      bold: true
    }
	
    // Agregar fila de sumatoria al final
    const totalRow = worksheet.addRow(['', '', '', '', '', 'Total', totalSum]);
    totalRow.font = { bold: true };
    totalRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EEEEEE' },
      };
    });	

    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 40;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 10;
    worksheet.getColumn(9).width = 10;
    worksheet.getColumn(10).width = 10;
    worksheet.getColumn(11).width = 10;
    worksheet.getColumn(12).width = 10;    

    //Footer Row
    let footerRow = worksheet.addRow(['']);

    //Merge Cells
    worksheet.mergeCells(`` + abcIni + `${footerRow.number}:` + abcFin + `${footerRow.number}`);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, title + '.xlsx');
    })
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

    // Date
    worksheet.mergeCells('H1:L4');
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('H1');
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
    worksheet.autoFilter = abcIni + '5:' + abcFin + '5';

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

      //let sales = row.getCell(6);
      // let color = 'FF99FF99';
      // if (+sales.value < 200000) {
      //   color = 'FF9999'
      // }

      // sales.fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: 'EEEEEE' }
      // }
    }
    );
    let ultReg = data.length + 5;
    const ultrows = worksheet.getRow(ultReg);
    ultrows.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EEEEEE' },
        bgColor: { argb: '' }
    }
    ultrows.font = {
      bold: true
    }

    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 40;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 10;
    worksheet.getColumn(9).width = 10;
    worksheet.getColumn(10).width = 15;
    worksheet.getColumn(11).width = 10;
    worksheet.getColumn(12).width = 10;



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


  /* 
  Genera Reporte excel 
  2024Dic12, Ahmed
  */
  public exportExcelTotal(excelData) {
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;
    const subtotal = excelData.subtotal

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
    let worksheet = workbook.addWorksheet(title);

    //Add Row and formatting
    worksheet.mergeCells('B1', 'G4');
    let titleRow = worksheet.getCell('B1');
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
    worksheet.mergeCells('H1:J4');
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('H1');
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true
    }
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    //Add Image
    worksheet.mergeCells('A1:A4');
    let myLogoImage = workbook.addImage({
      base64: logo.imgBase64,
      extension: 'jpeg',
    });
    worksheet.addImage(myLogoImage, 'A1:A3');

    //agregar filtros
    worksheet.autoFilter = abcIni + '5:' + abcFin + '5';

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
    });
    
    worksheet.getColumn(1).width = 40;
    worksheet.getColumn(2).width = 20;

    //Range
    //let range = worksheet.getRange()
    // worksheet.subtotals...

   
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, title + '.xlsx');
    })


  }

  /* 
  Genera Reporte excel 
  2025Abril04, Henry Medina
  */
  public exportExcelArranqueHist(excelData) {

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
    worksheet.mergeCells('C1', 'M4');
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
    worksheet.mergeCells('N1:N4');
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('N1');
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
    worksheet.autoFilter = abcIni + '5:' + abcFin + '5';

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

      //let sales = row.getCell(6);
      // let color = 'FF99FF99';
      // if (+sales.value < 200000) {
      //   color = 'FF9999'
      // }

      // sales.fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: 'EEEEEE' }
      // }
    }
    );
    let ultReg = data.length + 5;
    const ultrows = worksheet.getRow(ultReg);
    ultrows.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EEEEEE' },
        bgColor: { argb: '' }
    }
    ultrows.font = {
      bold: true
    }

    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 15;//columna de fecha de producción
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 10;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 13;
    worksheet.getColumn(8).width = 13;
    worksheet.getColumn(9).width = 30;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 15;
    worksheet.getColumn(12).width = 15;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(14).width = 40;



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

  /* 
  Genera Reporte General de Colgadores - Excel
  2025Junio19, Henry Medina
  */
  public exportExcelReporteColgadoresDetalles(excelData) {

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

    // Date
    worksheet.mergeCells('H1:M4');
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('H1');
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

    //agregar filtros
    worksheet.autoFilter = abcIni + '5:' + abcFin + '5';   
    
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
    });   
    
    // Adding Data with Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);
    });   
    
    let ultReg = data.length + 5;
    const ultrows = worksheet.getRow(ultReg);
    ultrows.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EEEEEE' },
        bgColor: { argb: '' }
    }
    ultrows.font = {
      bold: true
    }    

    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 50;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 20;

    worksheet.getColumn(14).width = 10;
    worksheet.getColumn(15).width = 10;
    worksheet.getColumn(16).width = 10;
    worksheet.getColumn(17).width = 10;
    worksheet.getColumn(18).width = 10;
    worksheet.getColumn(19).width = 10;
    worksheet.getColumn(20).width = 10;

    worksheet.getColumn(21).width = 20;
    worksheet.getColumn(22).width = 10;
    worksheet.getColumn(23).width = 40;
    worksheet.getColumn(24).width = 40;
    
    //Footer Row
    let footerRow = worksheet.addRow(['']);

    //Merge Cells
    worksheet.mergeCells(`` + abcIni + `${footerRow.number}:` + abcFin + `${footerRow.number}`);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, title + '.xlsx');
    })    
  }



// async exportExcel4(excelData){

//     //Title, Header & Data
//     const title = excelData.title;
//     const header = excelData.headers
//     const data = excelData.data;
//     const Num_Requerimiento = excelData.Num_Requerimiento;

//     var abc = 64
//     var abcIni = ''
//     var abcFin = ''
//     for (let i = 0; i < header.length; i++) {
//       abc = abc + 1
//       if (i == 0) {
//         abcIni = String.fromCharCode(Number(abc))
//       }
//     }
//     abcFin = String.fromCharCode(Number(abc))

//     var abcIni2 = ''
//     var abcFin2 = ''
//     for (let i = 0; i < header.length; i++) {
//       abc = abc + 1
//       if (i == 0) {
//         abcIni2 = String.fromCharCode(Number(abc))
//       }
//     }
//     abcFin2 = String.fromCharCode(Number(abc))    

//     //Create a workbook with a worksheet
//     let workbook = new Workbook();
//     let worksheet = workbook.addWorksheet(title);    

//     //Add Row and formatting
//     worksheet.mergeCells('C1', 'G4');
//     let titleRow = worksheet.getCell('C1');
//     titleRow.value = title
//     titleRow.font = {
//       name: 'Calibri',
//       size: 16,
//       underline: 'single',
//       bold: true,
//       color: { argb: '000000' }
//     }
//     titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

//     // Date
//     worksheet.mergeCells('H1:L4');
//     let d = new Date();
//     let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
//     let dateCell = worksheet.getCell('H1');
//     dateCell.value = date;
//     dateCell.font = {
//       name: 'Calibri',
//       size: 12,
//       bold: true
//     }
//     dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

//     //Add Image
//     worksheet.mergeCells('A1:B4');
//     let myLogoImage = workbook.addImage({
//       base64: logo.imgBase64,
//       extension: 'jpeg',
//     });
//     worksheet.addImage(myLogoImage, 'A1:B3');

//     //agregar filtros
//     worksheet.autoFilter = abcIni + '5:' + abcFin + '5';

//     //Adding Header Row
//     let headerRow = worksheet.addRow(header);
//     headerRow.eachCell((cell, number) => {
//       cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: '4167B8' },
//         bgColor: { argb: '' }
//       }
//       cell.font = {
//         bold: true,
//         color: { argb: 'FFFFFF' },
//         size: 12
//       }

//     })

      
    
//     //Recorre la data y pinta 
//     for (const d of data) {
//       let row = worksheet.addRow(d);

      
      
//       //String(d[9]).replace(' ','%20')
//       if (!(d[9] == '')) {
//         // console.log('Columna', (d[9]));
//         const URL_BASE = String(d[14]);
//         // const URL_BASE = String(d[14]).replace(/ /g, '%20');
//         // console.log(URL_BASE);
//         row.height = 200;
//         const response = await firstValueFrom(this.serviceRetiroRepuestos.getGetImageBase64FromUrlAsync(URL_BASE));      
//         this.imageBase64 = `data:image/jpeg;base64,${response.base64Image}`;

//         row.getCell(15).value = null;
//         let myLogoImage900 = workbook.addImage({
//           base64: this.imageBase64,
//           extension: 'jpeg',
//         });
//         //asignar columna
//         worksheet.addImage(myLogoImage900, {
//           tl: { col: 14, row: row.number - 1 }, // Columna 3 (2 base 0) y fila actual
//           ext: { width: 200, height: 200 }, // Tamaño de la imagen
          
//         });   
//       }
//       // Limpia el valor textual de la celda
//       // row.getCell(10).value = null;
//       // worksheet.getRow(row.number).height = 28;

//     }
    
//     let ultReg = data.length + 5;
//     const ultrows = worksheet.getRow(ultReg);
//     ultrows.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: 'EEEEEE' },
//         bgColor: { argb: '' }
//     }
//     ultrows.font = {
//       bold: true
//     }

//     worksheet.getColumn(1).width = 40;
//     worksheet.getColumn(2).width = 40;
//     worksheet.getColumn(3).width = 40;
//     worksheet.getColumn(4).width = 40;
//     worksheet.getColumn(5).width = 40;
//     worksheet.getColumn(6).width = 40;
//     worksheet.getColumn(7).width = 40;
//     worksheet.getColumn(8).width = 40;
//     worksheet.getColumn(9).width = 40;
//     worksheet.getColumn(10).width = 40;
//     worksheet.getColumn(11).width = 40;
//     worksheet.getColumn(12).width = 40;    
//     worksheet.getColumn(13).width = 40;    
//     worksheet.getColumn(14).width = 40;    
//     worksheet.getColumn(15).width = 40;

    
//     //Footer Row
//     let footerRow = worksheet.addRow(['']);

//     //Merge Cells
//     worksheet.mergeCells(`` + abcIni + `${footerRow.number}:` + abcFin + `${footerRow.number}`);
//     //Generate & Save Excel File
//     workbook.xlsx.writeBuffer().then((data) => {
      
      
//       let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       if(Num_Requerimiento === 0){
//         FileSaver.saveAs(blob, title + '.xlsx');
        
//         // this.http.get('https://gestion.precotex.com:444/getImagen/' + '54dfd366-bd41-4e2b-9a41-4f5259e00479_TUBO ESTRUCTURAL REDONDO INOX.jpg', { responseType: 'blob' })
//         // .subscribe(blob => {
//         // const url = URL.createObjectURL(blob);
//         // this.imagenUrl = url;
//         // });
//       }else{

//         let params = new HttpParams();
//         params = params.append('Num_Requerimiento', Num_Requerimiento)

//         this.http.post(this.baseUrlTinto + 'TxRetiroRepuestos/guardar-excel', blob, {
//         headers: { 'Content-Type': 'application/octet-stream' },
//         params
//         }).subscribe(() => {
//           console.log('Archivo guardado en el servidor');
//           this.http.post(this.baseUrlTinto + 'TxRetiroRepuestos/postEnviarCorreo2', Num_Requerimiento,
//             {headers: { 'Content-Type': 'application/json' }}
//           ).subscribe(() => {
//             console.log('Correo Enviado');
//           });
//         });
        
//         // // const headers = this.Header;
//         // this.http.post(this.baseUrlTinto + 'TxRetiroRepuestos/postEnviarCorreo', '"1"',
//         //   {headers: { 'Content-Type': 'application/json' }}
//         // ).subscribe(() => {
//         //   console.log('Se envio el correo');
//         // });      

//       }
//     })


//         // const headers = this.Header;
       
//   }
async exportExcel4(excelData) {
  const title = excelData.title;
  const header = excelData.headers;
  const data = excelData.data;
  const Num_Requerimiento = excelData.Num_Requerimiento;

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(title);

  // Título
  worksheet.mergeCells('C1', 'G4');
  const titleRow = worksheet.getCell('C1');
  titleRow.value = title;
  titleRow.font = {
    name: 'Calibri',
    size: 16,
    underline: 'single',
    bold: true,
    color: { argb: '000000' }
  };
  titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

  // Fecha
  worksheet.mergeCells('H1:L4');
  const d = new Date();
  const date = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  const dateCell = worksheet.getCell('H1');
  dateCell.value = date;
  dateCell.font = { name: 'Calibri', size: 12, bold: true };
  dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Logo
  worksheet.mergeCells('A1:B4');
  const logoImage = workbook.addImage({
    base64: logo.imgBase64,
    extension: 'jpeg',
  });
  worksheet.addImage(logoImage, 'A1:B3');

  // Filtros
  const abcIni = 'A';
  const abcFin = String.fromCharCode(65 + header.length - 1);
  worksheet.autoFilter = `${abcIni}5:${abcFin}5`;

  // Encabezado
  const headerRow = worksheet.addRow(header);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' }
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFF' },
      size: 12
    };
  });

  // Datos + Imágenes
  for (const row of data) {
    const rowValues = header.map((key) => key === 'Foto' ? null : row[key] ?? '');
    const excelRow = worksheet.addRow(rowValues);

    const nombreImagen = row['Foto'];
    if (nombreImagen && nombreImagen.trim() !== '' && !nombreImagen.includes('sin_foto')) {
      try {
        const response = await firstValueFrom(this.serviceRetiroRepuestos.getImagen(nombreImagen));
        const blob = new Blob([response], { type: 'image/jpeg' });

        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = () => reject('Error al leer imagen');
          reader.readAsDataURL(blob);
        });

        const imageId = workbook.addImage({
          base64,
          extension: 'jpeg'
        });

        worksheet.addImage(imageId, {
          tl: { col: header.indexOf('Foto'), row: excelRow.number - 1 },
          ext: { width: 100, height: 100 }
        });

        excelRow.height = 80;
      } catch (err) {
        console.warn(`No se pudo cargar la imagen ${nombreImagen}`, err);
      }
    }
  }

  // Estilos finales
  const ultReg = data.length + 5;
  const ultrows = worksheet.getRow(ultReg);
  ultrows.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'EEEEEE' }
  };
  ultrows.font = { bold: true };

  for (let i = 1; i <= header.length; i++) {
    worksheet.getColumn(i).width = 40;
  }

  const footerRow = worksheet.addRow(['']);
  worksheet.mergeCells(`${abcIni}${footerRow.number}:${abcFin}${footerRow.number}`);

  // Guardar archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  if (Num_Requerimiento === 0) {
    FileSaver.saveAs(blob, title + '.xlsx');
  } else {
    // const params = new HttpParams().append('Num_Requerimiento', Num_Requerimiento);
    // this.http.post(this.baseUrlTinto + 'TxRetiroRepuestos/guardar-excel', blob, {
    //   headers: { 'Content-Type': 'application/octet-stream' },
    //   params
    // }).subscribe(() => {
    //   console.log('Archivo guardado en el servidor');
    //   this.http.post(this.baseUrlTinto + 'TxRetiroRepuestos/postEnviarCorreo2', Num_Requerimiento, {
    //     headers: { 'Content-Type': 'application/json' }
    //   }).subscribe(() => {
    //     console.log('Correo Enviado');
    //   });
    // });
    const params = new HttpParams().append('Num_Requerimiento', Num_Requerimiento);

    this.http.post(this.baseUrlTinto + 'TxRetiroRepuestos/guardar-excel', blob, {
      headers: { 'Content-Type': 'application/octet-stream' },
      params
    }).subscribe(() => {
      console.log('Archivo guardado en el servidor');

      this.http.post(this.baseUrlTinto + 'TxRetiroRepuestos/postEnviarCorreo2', Num_Requerimiento, {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe(() => {
        console.log('Correo Enviado');
      });
    });

  }
}






  /* 
  Genera Reporte excel - Memorandum Detallados
  2025Septiembre18, Henry Medina
  */
  public exportExcelMemorandumDetallado(excelData) {

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
    worksheet.mergeCells('C1', 'O4');
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
    worksheet.mergeCells('P1:P4');
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('P1');
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
    worksheet.autoFilter = abcIni + '5:' + abcFin + '5';

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
    });

    let ultReg = data.length + 5;
    const ultrows = worksheet.getRow(ultReg);
    ultrows.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EEEEEE' },
        bgColor: { argb: '' }
    }
    ultrows.font = {
      bold: true
    }

    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 40;//columna de fecha de producción
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 40;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 30;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 50;
    worksheet.getColumn(12).width = 10;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(14).width = 20;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 10;



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

  /* 
  Genera Reporte excel - Quejas y Reclamos
  2025Septiembre30, Henry Medina
  */  
  public exportExcelQuejasReclamosGral(excelData) {

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
    worksheet.mergeCells('C1', 'R4');
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
    worksheet.mergeCells('S1:T4');
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('S1');
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
    worksheet.autoFilter = abcIni + '5:' + abcFin + '5';

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
    });

    let ultReg = data.length + 5;
    const ultrows = worksheet.getRow(ultReg);
    ultrows.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EEEEEE' },
        bgColor: { argb: '' }
    }
    ultrows.font = {
      bold: true
    }

    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 40;//columna de fecha de producción
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 50;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 40;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 45;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 40;
    worksheet.getColumn(14).width = 40;
    worksheet.getColumn(15).width = 40;
    worksheet.getColumn(16).width = 50;
    worksheet.getColumn(17).width = 35;
    worksheet.getColumn(18).width = 35;
    worksheet.getColumn(19).width = 35;
    worksheet.getColumn(20).width = 10;



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
