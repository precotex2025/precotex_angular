import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
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
  displayedColumns: string[] = ['select','Des_Planta','Cod_Activo', 'Descripcion', 'Nom_Marca', 'Nom_Modelo', 'Num_Serie_Equipo', 'Nom_Area', 'Nom_Responsable']
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Num_Auditoria! + 1}`;
  }  

  onExportarRegistro(){
    if(this.selection.selected.length > 0){
      this.dataActivosPDF = this.selection.selected;
      this.spinnerService.show();
      this.verPdf = true;
      
      setTimeout(() => {
        this.generatePDF();
      }, 100)
    }        
  }

  async generatePDF() {
    let fecha = new Date()     
    let filePO = 'Activos'.concat(fecha.toISOString().replace(/:/g,"-").substring(0,19)).concat('.pdf');
    let j = 0;

    const pdf = new jsPDF('p', 'mm', 'a4', true); // Formato A4 en orientación vertical comprimido
    //const content = document.getElementById('content') as HTMLCanvasElement;
    //const content = <HTMLCanvasElement> document.getElementById('content');
    const pages = document.querySelectorAll<HTMLElement>('.page');

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2 }); // Escala para mayor calidad
      //const ctx = canvas.getContext("2d", {willReadFrequently: true});
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // Ancho de A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, imgHeight * j, imgWidth, imgHeight);

      if(i%6 == 0)
        j = 1;
      else
        j++;

      if (i < pages.length - 1 && j == 6) {
        j = 0;
        pdf.addPage(); // Agregar una nueva página excepto en la última
      }
    }

    pdf.save(filePO); // Descargar el PDF
    this.verPdf = false;
    this.selection.clear();
    this.spinnerService.hide();
  }
}
