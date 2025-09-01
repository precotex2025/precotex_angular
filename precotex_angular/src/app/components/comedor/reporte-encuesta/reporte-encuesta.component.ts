import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import * as jspdf from 'jspdf'; 
import html2canvas from 'html2canvas';

import { Color, ScaleType } from '@swimlane/ngx-charts';
import { EncuestasComedorService } from 'src/app/services/comedor/encuestas-comedor.service';
// export var single = [{ "name": "Almuerzo", "series": [{ "name": "Positivo", "value": "96.67" }, { "name": "Negativo", "value": "3.33" }] }, { "name": "Cena", "series": [{ "name": "Positivo", "value": "93.33" }, { "name": "Negativo", "value": "6.67" }] }, { "name": "Desayuno", "series": [{ "name": "Positivo", "value": "53.33" }, { "name": "Negativo", "value": "46.67" }] }];

@Component({
  selector: 'app-reporte-encuesta',
  templateUrl: './reporte-encuesta.component.html',
  styleUrls: ['./reporte-encuesta.component.scss']
})
export class ReporteEncuestaComponent implements OnInit {

  single: any[];
  multi: any[];

  view: [number, number] = [1200, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Servicios';
  showYAxisLabel = true;
  yAxisLabel = 'Porcentajes';
  legendTitle: string = 'Leyenda';
  colorScheme: Color = {
    domain: ['#192C73', '#E30202', '#CBCACA'],
    group: ScaleType.Ordinal,
    selectable: false,
    name: 'Customer Usage',
  };

  dataDesayuno:Array<any> = [];
  dataAlmuerzo:Array<any> = [];
  dataCena:Array<any> = [];

  totalDesayuno = 0;
  totalAlmuerzo = 0;
  totalCena = 0;
  range = new FormGroup({
    start: new FormControl(new Date),
    end: new FormControl(new Date),
  });

  Tipo = '';
  Sede = '';
  Fecha1!:Date;
  Fecha2!:Date;

  Fecha1tring = '';
  Fecha2tring = '';
  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }
  constructor(private encuestasService: EncuestasComedorService) {
    //Object.assign(this, { single })
    this.obtenerReportesComedor();
    this.obtenerReportesPregComedor();
    this.obtenerReportesPregAlmuerzo();
    this.obtenerReportesPregCena();
  }

  onSelect(event) {
    console.log(event);
  }

  obtenerReportesComedor() {
    this.encuestasService.obtenerReportesComedor( this.Tipo, this.range.get('start').value, this.range.get('end').value, this.Sede
    ).subscribe(
      (result: any) => {
        console.log(result);
        this.multi = result;
      },
      (err: HttpErrorResponse) => {

      })
  }
  buscar(){
    this.obtenerReportesComedor();
    this.obtenerReportesPregComedor();
    this.obtenerReportesPregAlmuerzo();
    this.obtenerReportesPregCena();

    this.Fecha1 = this.range.get('start').value;
    this.Fecha2 = this.range.get('end').value;
    this.Fecha1tring = this.Fecha1.toLocaleString();
    this.Fecha2tring = this.Fecha2.toLocaleString();
  }
  obtenerReportesPregComedor() {
    this.totalDesayuno = 0;
    this.encuestasService.COM_REPORTE_PREG_RESPUESTAS_WEB(
      'Desayuno', this.Tipo, this.range.get('start').value, this.range.get('end').value, this.Sede
    ).subscribe(
      (result: any) => {
        console.log(result);
        
        this.dataDesayuno = result;
        if(this.dataDesayuno.length > 0){
          this.totalDesayuno = this.dataDesayuno[0].Cantidad
        }
        
      },
      (err: HttpErrorResponse) => {

      })
  }

  obtenerReportesPregAlmuerzo() {
    this.totalAlmuerzo = 0;
    this.encuestasService.COM_REPORTE_PREG_RESPUESTAS_WEB(
      'Almuerzo', this.Tipo, this.range.get('start').value, this.range.get('end').value, this.Sede
    ).subscribe(
      (result: any) => {
        console.log(result);
        this.dataAlmuerzo = result;
        if(this.dataAlmuerzo.length > 0){
          this.totalAlmuerzo = this.dataAlmuerzo[0].Cantidad
        }
        
      },
      (err: HttpErrorResponse) => {

      })
  }

  obtenerReportesPregCena() {
    this.totalCena = 0;
    this.encuestasService.COM_REPORTE_PREG_RESPUESTAS_WEB(
      'Cena', this.Tipo, this.range.get('start').value, this.range.get('end').value, this.Sede
    ).subscribe(
      (result: any) => {
        this.dataCena = result;

        if(this.dataCena.length > 0){
          this.totalCena = this.dataCena[0].Cantidad
        }
        
      },
      (err: HttpErrorResponse) => {

      })
  }

  ngOnInit(): void {

  }

  imprimir(){

    setTimeout(() => {
      var data = document.getElementById('contentToConvert');

      html2canvas(data).then(canvas => {
        var imgWidth = 200;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        
        var contentDataURL = canvas.toDataURL('image/png',1.0)

        let pdf = new jspdf.jsPDF({
          //orientation: 'L',
          unit: 'mm',
          format: 'a4',
        });
        var position = 15;
        var position1 = -282 //-297;

        var totalPages = Math.ceil(imgHeight / pageHeight - 1)
        
        console.log(totalPages)
        console.log(imgHeight);
        pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight)
        for (var i = 1; i <= totalPages; i++) { 
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 5, position1, imgWidth, imgHeight);
        }
        pdf.save('REPORTE_COMEDOR.pdf'); // Generated PDF
   
      });
    }, 100);

  }

}
