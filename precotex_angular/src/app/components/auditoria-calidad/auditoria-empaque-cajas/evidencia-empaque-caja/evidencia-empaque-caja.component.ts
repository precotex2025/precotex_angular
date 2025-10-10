import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from "@angular/common";
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";

import { jsPDF } from 'jspdf'; 
import html2canvas from 'html2canvas';
import { ExceljsService } from 'src/app/services/exceljs.service';

import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';

import { DialogEvidenciaEmpaqueCajaComponent } from './../dialog-evidencia-empaque-caja/dialog-evidencia-empaque-caja.component';

interface data_det {
  Num_Auditoria?: number; 
  Num_Caja?: string; 
  Cod_Auditor?: string; 
  Nom_Auditor?: string;
  Fec_Ini_Auditoria?: string;
  Fec_Fin_Auditoria?: string;
  Num_Vez?: number;
  Cod_Supervisor?: string;
  Cod_PurOrd?: string;
  Cod_EstCli?: string;
  Flg_Estado?: string;
  Num_Packing?: number;
  Num_SecPacking?: number;
  Peso_Caja?: number;
  Evidencia?: string;
  Cod_Modulo?: string;
  Cod_Cliente?: string;
  Des_Modulo?: string;
  Des_Cliente?: string;
  Des_Destino?: string;
  Cod_Usuario?: string;
  Evidencia64?: string;
  Detalle?: any[];
}

@Component({
  selector: 'app-evidencia-empaque-caja',
  templateUrl: './evidencia-empaque-caja.component.html',
  styleUrls: ['./evidencia-empaque-caja.component.scss']
})
export class EvidenciaEmpaqueCajaComponent implements OnInit {

  //displayedColumns: string[] = ['select','Num_Auditoria','Fec_Ini_Auditoria','Cod_PurOrd','Num_Packing','Num_SecPacking','Num_Caja','Des_Cliente','Des_Modulo','Num_Vez','Nom_Auditor','Flg_Estado','Acciones']
  displayedColumns: string[] = ['select','Num_Auditoria','Fec_Ini_Auditoria','Cod_PurOrd','Num_Packing','Num_SecPacking','Num_Caja','Des_Cliente','Des_Modulo','Flg_Estado','Acciones']
  dataSource!: MatTableDataSource<data_det>;
  selection = new SelectionModel<data_det>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formulario = this.formBuilder.group({
    CodAuditor: [''],
    NomAuditor: [''],
    CodPurOrd: [''],
    NumCaja: [''],
    numSemana: ['']
  });

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  ld_fecha = new Date()
  verPdf: boolean = false;
  dataForExcel = [];
  dataEvidencia: data_det[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private exceljsService: ExceljsService,
    private spinnerService: NgxSpinnerService
  ) {
    this.dataSource = new MatTableDataSource();
    this.range.controls['start'].setValue(new Date(this.ld_fecha.getFullYear(), this.ld_fecha.getMonth(), this.ld_fecha.getDate()));
    this.range.controls['end'].setValue(new Date(this.ld_fecha.getFullYear(), this.ld_fecha.getMonth(), this.ld_fecha.getDate()));

  }

  ngOnInit(): void {
    this.onListarAuditoriaEmpaqueCajas();
  }

  onListarAuditoriaEmpaqueCajas(){
    let CodPurOrd = this.formulario.get('CodPurOrd').value ? this.formulario.get('CodPurOrd').value : '0';

    this.spinnerService.show();
    this.auditoriaAcabadosService.Evidencia_AuditoriaEmpaqueCajas('L', 0, 0, CodPurOrd, '', this.range.get('start')?.value, this.range.get('end').value, 0, '', 'S')
      .subscribe((result: any) => {
        if (result.length > 0) {     
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.spinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.spinnerService.hide();
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }));
  }

  onVisualizarEvidencia(data_det: any){
    const formData = new FormData();
    formData.append('Accion', 'C');
    formData.append('Num_Packing', '0');
    formData.append('Num_SecPacking', '0');
    formData.append('Num_Auditoria', data_det.Num_Auditoria.toString());
    formData.append('Carton_Label', '');
    formData.append('Peso_Caja', data_det.Peso_Caja.toString());
    formData.append('Evidencia', data_det.Evidencia);
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    this.spinnerService.show();
    this.auditoriaAcabadosService.Mant_EvidenciaEmpaque (formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          console.log(result)
          this.spinnerService.hide();

          let evidencia: any = {Accion: 'C', Num_Auditoria: result[0].Num_Auditoria, Num_Caja: result[0].Num_Caja, Carton_Label: result[0].Carton_Label, Peso_Caja: result[0].Peso_Caja , Evidencia: result[0].Evidencia, Captura_64: result[0].Evidencia_64, Fec_Evidencia: result[0].Fec_Evidencia, Cod_Usuario: GlobalVariable.vusu};

          let dialogRef = this.dialog.open(DialogEvidenciaEmpaqueCajaComponent, {
            disableClose: true,
            width: "600px",
            data: evidencia
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log(result)
          });


        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );    

  }  

  onExportarListado(){
    this.dataForExcel = [];
    if(this.dataSource.filteredData.length > 0){
      let dataReporte: any[] = [];

      this.dataSource.filteredData.forEach((row: any) => {
        let data: any = {};

        data.FechaAuditoria = this.datePipe.transform(row.Fec_Ini_Auditoria, 'yyyy-MM-dd HH:mm') //row.Fec_Ini_Auditoria;
        data.CodigoPO = row.Cod_PurOrd;
        data.Secuecia = row.Num_SecPacking;
        data.Cliente = row.Des_Cliente;
        data.EstiloCliente = row.Cod_EstCli;
        data.NumeroPacking = row.Num_Packing;
        data.NumeroCaja = row.Num_Caja;
        
        dataReporte.push(data);
      });      

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'AUDITORIA EMPAQUE CAJAS',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);

    } else{
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }        
  }

  onGeneraEvidencia(){
    let codPO = this.formulario.get('CodPurOrd').value ? this.formulario.get('CodPurOrd').value : '0';

    if(codPO != '0'){
      if(this.selection.selected.length > 0){
        this.dataEvidencia = this.selection.selected;
        console.log(this.dataEvidencia)
        this.spinnerService.show();
        this.verPdf = true;

        setTimeout(() => {
          this.generatePDF();
        }, 100);
      } else {
        this.matSnackBar.open("Seleccione las cajas a exportar!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }
    } else {
      this.matSnackBar.open("Especifique el código de P.O.!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  async generatePDF() {
    let fecha = new Date()     
    let filePO = this.formulario.get('CodPurOrd').value.concat(fecha.toISOString().replace(/:/g,"-").substring(0,19)).concat('.pdf');

    const pdf = new jsPDF('p', 'mm', 'a4'); // Formato A4 en orientación vertical
    const content = document.getElementById('content') as HTMLElement;
    const pages = document.querySelectorAll<HTMLElement>('.page');

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2 }); // Escala para mayor calidad
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // Ancho de A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      if (i < pages.length - 1) {
        pdf.addPage(); // Agregar una nueva página excepto en la última
      }
    }

    pdf.save(filePO); // Descargar el PDF
    this.verPdf = false;
    this.selection.clear();
    this.spinnerService.hide();
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
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
  checkboxLabel(row?: data_det): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Num_Auditoria! + 1}`;
  }  

}
