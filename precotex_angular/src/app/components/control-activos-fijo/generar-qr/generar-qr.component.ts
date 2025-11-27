import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import * as _moment from 'moment';
import { jsPDF } from 'jspdf'; 
import html2canvas from 'html2canvas';

import { ControlActivoFijoService } from 'src/app/services/control-activo-fijo.service';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.component.html',
  styleUrls: ['./generar-qr.component.scss']
})
export class GenerarQrComponent implements OnInit {

  idDescripcion: number = 226;  //Laptop
  dataTipoActivos: any[];
  dataActivoFijos: any[];
  dataActivosPDF: any[];
  
  dataForExcel = [];
  displayedColumns: string[] = ['Des_Planta','Cod_Activo', 'Descripcion', 'Nom_Marca', 'Nom_Modelo', 'Num_Serie_Equipo', 'Nom_Area', 'Nom_Responsable']
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  verPdf: boolean = false;

  constructor(
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private controlActivoFijoService: ControlActivoFijoService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.listarTipoActivos();
  }

  listarActivos(){
    this.spinnerService.show();
    this.controlActivoFijoService.getActivosFijo('8',this.idDescripcion.toString())
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.dataActivoFijos = result;
          this.dataSource = new MatTableDataSource(this.dataActivoFijos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.spinnerService.hide();
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = [];
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }

  listarTipoActivos(){
    this.controlActivoFijoService.getTipoActivos('8')
      .subscribe((response) => {
        this.dataTipoActivos = response;

        this.listarActivos();
      });
  }  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }  

  onExportarRegistro(){
    this.verPdf = true;
    this.dataActivosPDF = this.dataSource.filteredData;
    console.log(this.dataActivosPDF)
    setTimeout(() => {
      this.generatePDF();
      //this.generarPDF();
    }, 100)
  }

  async generatePDF() {
    let fecha = new Date()     
    let filePO = 'Activos'.concat(fecha.toISOString().replace(/:/g,"-").substring(0,19)).concat('.pdf');

    const pdf = new jsPDF('p', 'mm', 'a4', true); // Formato A4 en orientación vertical comprimido
    const content = document.getElementById('content') as HTMLElement;
    const pages = document.querySelectorAll<HTMLElement>('.page');

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2 }); // Escala para mayor calidad
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // Ancho de A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      if (i < pages.length - 1 && i % 5 == 0) {
        pdf.addPage(); // Agregar una nueva página excepto en la última
      }
    }

    pdf.save(filePO); // Descargar el PDF
    this.verPdf = false;
    //this.selection.clear();
    this.spinnerService.hide();
  }

generarPDF(){
    
    
    setTimeout(() => {
      var data = document.getElementById('content');  

      html2canvas(data).then(canvas => {
        var imgWidth = 300; //200;
        var pageHeight = 300; //590; //295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        
        //canvas.innerHTML.replace('img1', this.dataReporteAuditoria[0].Path_Firma_Web_1)
        var contentDataURL = canvas.toDataURL('image/png',1.0)

        let pdf = new jsPDF({
          //orientation: 'L',
          unit: 'mm',
          format: 'a4',
        });
        var position = 15;
        var position1 = -282 //-297;

        var totalPages = Math.ceil(imgHeight / pageHeight - 1)
        
        //console.log(totalPages)
        //console.log(imgHeight);
        
        pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight)
        for (var i = 1; i <= totalPages; i++) { 
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 5, position1, imgWidth, imgHeight);
        }
        
        pdf.save('FORMATO AUDITORIA FINAL.pdf'); // Generated PDF

        this.verPdf = false;
        //this.SpinnerService.hide();
      });
    }, 100);
  }  
}
