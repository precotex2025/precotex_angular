import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import * as logo from './mylogo.js';
import { Column, Context } from 'ag-grid-community';
import { base64ToFile } from 'ngx-image-cropper';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExceljsAudFinalService {

  constructor(private http: HttpClient) { }

  public exportExcel(excelData) {
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;

    let imgFirma: any;
    let rIni: string;
    let rFin: string;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);

    //Add Image
    worksheet.mergeCells('C2:D4');
    let myLogoImage = workbook.addImage({
      base64: logo.imgBase64,
      extension: 'jpeg',
    });
    worksheet.addImage(myLogoImage, 'C2:D4');

    worksheet.getColumn(1).width = 3;
    worksheet.getColumn(2).width = 3;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 25;
    worksheet.getColumn(8).width = 3;

    // -- DATOS DE FECHA

    let CellF3 = worksheet.getCell('F3');
    CellF3.value =  'FECHA:';
    CellF3.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellF3.alignment = { vertical: 'middle', horizontal: 'left' }
    //CellF3.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};

    let CellG3 = worksheet.getCell('G3');
    CellG3.value =  excelData.lc_Fecha;
    CellG3.font = {
      name: 'Calibri',
      size: 11
    }
    CellG3.alignment = { vertical: 'middle', horizontal: 'left' }
    CellG3.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};

    // -- DATOS DE CLIENTE

    let CellC7 = worksheet.getCell('C7');
    CellC7.value =  'CLIENTE:';
    CellC7.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellC7.alignment = { vertical: 'middle', horizontal: 'left' }
    CellC7.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};

    let CellD7 = worksheet.getCell('D7');
    CellD7.value =  excelData.lc_Cliente;
    CellD7.font = {
      name: 'Calibri',
      size: 11
    }
    CellD7.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }
    CellD7.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};

    // -- DATOS DE ESTIO

    let CellF7 = worksheet.getCell('F7');
    CellF7.value =  'ESTILO:';
    CellF7.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellF7.alignment = { vertical: 'middle', horizontal: 'left' }
    CellF7.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};

    let CellG7 = worksheet.getCell('G7');
    CellG7.value =  excelData.lc_Estilo;
    CellG7.font = {
      name: 'Calibri',
      size: 11
    }
    CellG7.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }
    CellG7.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};

    // -- DATOS DE OP

    let CellC9 = worksheet.getCell('C9');
    CellC9.value =  'OP:';
    CellC9.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellC9.alignment = { vertical: 'middle', horizontal: 'left' }
    CellC9.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};

    let CellD9 = worksheet.getCell('D9');
    CellD9.value =  excelData.lc_OP;
    CellD9.font = {
      name: 'Calibri',
      size: 11
    }
    CellD9.alignment = { vertical: 'middle', horizontal: 'left' }
    CellD9.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};

    // -- DATOS DE COLOR

    let CellF9 = worksheet.getCell('F9');
    CellF9.value =  'COLOR:';
    CellF9.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellF9.alignment = { vertical: 'middle', horizontal: 'left' }
    CellF9.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};

    let CellG9 = worksheet.getCell('G9');
    CellG9.value =  excelData.lc_Color;
    CellG9.font = {
      name: 'Calibri',
      size: 11
    }
    CellG9.alignment = { vertical: 'middle', horizontal: 'left' }
    CellG9.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};

    // -- DATOS DE CANTIDAD

    let CellC11 = worksheet.getCell('C11');
    CellC11.value =  'CANTIDAD:';
    CellC11.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellC11.alignment = { vertical: 'middle', horizontal: 'left' }
    CellC11.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};

    let CellD11 = worksheet.getCell('D11');
    CellD11.value =  excelData.ln_Cantidad;
    CellD11.font = {
      name: 'Calibri',
      size: 11
    }
    CellD11.alignment = { vertical: 'middle', horizontal: 'left' }
    CellD11.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};

    // -- DATOS DE COLOR

    let CellF11 = worksheet.getCell('F11');
    CellF11.value =  'STATUS:';
    CellF11.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellF11.alignment = { vertical: 'middle', horizontal: 'left' }
    CellF11.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};

    let CellG11 = worksheet.getCell('G11');
    CellG11.value =  excelData.lc_Estado;
    CellG11.font = {
      name: 'Calibri',
      size: 11
    }
    CellG11.alignment = { vertical: 'middle', horizontal: 'left' }
    CellG11.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};
    
    // Ubicar puntero para agregar registros
    //worksheet.getCell("B12");
    
    // Añadir cabecera
    let i = 13;
    let j = 2;
    header.forEach(h => {
      j++;
      let celda = worksheet.getCell(i,j)
      celda.value = h;
      celda.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      celda.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
      celda.alignment = { vertical: 'middle', horizontal: 'center' }
    });

    // Añadir Data
    data.forEach(d => {
      //let row = worksheet.addRow(d);
      i++;
      worksheet.getCell(i,3).value = d[0];
      worksheet.getCell(i,4).value = d[1];
      worksheet.getCell(i,5).value = d[2];
      worksheet.getCell(i,6).value = d[3];
      worksheet.getCell(i,7).value = d[4];

      worksheet.getCell(i,3).alignment = { vertical: 'middle', horizontal: 'center' }
      worksheet.getCell(i,7).alignment = { vertical: 'middle', horizontal: 'center' }
    });

    // -- OBSERVACION

    let CellObs = worksheet.getCell(i+2,3);
    CellObs.value =  'Observaciones:';
    CellObs.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellObs.alignment = { vertical: 'middle', horizontal: 'left' }

    rIni = 'D'.concat((i+2).toString())
    rFin = 'G'.concat((i+4).toString())
    worksheet.mergeCells(rIni, rFin);
    let CellObs1 = worksheet.getCell(i+2,4);
    CellObs1.value =  excelData.lc_Observacion;
    CellObs1.font = {
      name: 'Calibri',
      size: 11
    }
    CellObs1.alignment = { vertical: 'top', horizontal: 'left' }

    // -- FIRMAS

    rIni = 'C'.concat((i+10).toString())
    rFin = 'D'.concat((i+10).toString())
    worksheet.mergeCells(rIni, rFin);
    let CellFirma1 = worksheet.getCell(i+10,3);
    CellFirma1.value =  'Supervisor del Servicio';
    CellFirma1.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    CellFirma1.alignment = { vertical: 'middle', horizontal:'center' }
    CellFirma1.border = {top: {style:'thin'}};

    rIni = 'F'.concat((i+10).toString())
    rFin = 'G'.concat((i+10).toString())
    worksheet.mergeCells(rIni, rFin);
    let CellFirma2 = worksheet.getCell(i+10,6);
    CellFirma2.value =  'Auditor de Aseg. Calidad';
    CellFirma2.font = {
      name: 'Calibri',
      size: 11
    }
    CellFirma2.alignment = { vertical: 'middle', horizontal: 'center' }
    CellFirma2.border = {top: {style:'thin'}};

    //'http://192.168.1.36/Estilos/EP22147.jpg'
    let urlImg1 = 'http://localhost:4200/assets/Firma1.jpg';
    let urlImg2 = 'http://localhost:4200/assets/Firma2.jpeg';
    //let urlImg2 = 'https://avatars0.githubusercontent.com/u/5053266?s=460&v=4';
    
    if(urlImg1 != ""){
      // CONVERTIR FIRMA SERVICIO A BASE 64
      this.http.get(urlImg1, { responseType: 'blob' })
      .pipe(
        switchMap(blob => this.convertBlobToBase64(blob))
      )
      .subscribe(base64ImageUrl => {
        //console.log(base64ImageUrl)
        imgFirma = base64ImageUrl;

        // INSERTAR FIRMA SERVICIO
        rIni = 'C'.concat((i+5).toString())
        rFin = 'D'.concat((i+9).toString())
        let firma1 = workbook.addImage({
          base64:  imgFirma,
          extension: 'jpeg',
        });
        worksheet.addImage(firma1, rIni.concat(":".concat(rFin)));

        // CONVERTIR FIRMA AUDITOR A BASE 64
        if(urlImg2 != ""){
          this.http.get(urlImg2, { responseType: 'blob' })
          .pipe(
            switchMap(blob => this.convertBlobToBase64(blob))
          )
          .subscribe(base64ImageUrl => {
            imgFirma = base64ImageUrl;
    
            // INSERTAR FIRMA AUDITOR
            rIni = 'F'.concat((i+5).toString())
            rFin = 'G'.concat((i+9).toString())
              let firma2 = workbook.addImage({
              base64:  imgFirma,
              extension: 'jpeg',
            });
            worksheet.addImage(firma2, rIni.concat(":".concat(rFin)));
            
            // GENERAR ARCHIVO EXCEL
            workbook.xlsx.writeBuffer().then((data) => {
              let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              FileSaver.saveAs(blob, title + '.xlsx');
            });
      
          });
          // FIN CONVERTIR FIRMA AUDITOR A BASE 64  
        } else{
          //Generate & Save Excel File
          workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, title + '.xlsx');
          });
        }
      });
    } else {
      //Generate & Save Excel File
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, title + '.xlsx');
      });
    }

    // FIN CONVERTIR FIRMA AUDITOR A BASE 64

  }

  convertBlobToBase64(blob: Blob) {
    return Observable.create(observer => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        //console.log('Image in Base64: ', event.target.result);
        observer.next(event.target.result);
        observer.complete();
      };

      reader.onerror = (event: any) => {
        //console.log("File could not be read: " + event.target.error.code);
        observer.next(event.target.error.code);
        observer.complete();
      };
    });
  }


}
