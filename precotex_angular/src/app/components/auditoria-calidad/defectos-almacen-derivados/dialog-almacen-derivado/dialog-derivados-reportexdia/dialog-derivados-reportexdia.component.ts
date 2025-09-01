import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefectosAlmacenDerivadosService } from 'src/app/services/defectos-almacen-derivados.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelect } from '@angular/material/select';
import { ExceljsPerService } from 'src/app/services/exceljsper.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ExceljsFecService } from 'src/app/services/exceljsFec.service';


interface data {
  Fec_Auditoria: string

}

@Component({
  selector: 'app-dialog-derivados-reportexdia',
  templateUrl: './dialog-derivados-reportexdia.component.html',
  styleUrls: ['./dialog-derivados-reportexdia.component.scss']
})
export class DialogDerivadosReportexdiaComponent implements OnInit {


  Cod_Accion = ''
  Fec_Auditoria = ''


  formulario = this.formBuilder.group({
    Total: [''],
    Defecto: [''],
    Especial: [''],
    Mercado_Local: [''],
    Exportado: [''],
    seg_Exp_A: [''],
    seg_Exp_B: [''],
    ad_A: [''],
    ad_B: [''],
    ad3_A: [''],
    ad3_B: [''],
    Cod_Auditor: ['FSANTA']
  })

  dataResultado = [];
  dataAuditores = [];
  dataForExcel = [];

  constructor(private formBuilder: FormBuilder, private exceljsService:ExceljsFecService,
    private matSnackBar: MatSnackBar, private defectosAlmacenDerivadosService: DefectosAlmacenDerivadosService
    , @Inject(MAT_DIALOG_DATA) public data: data
  ) {

  }

  ngOnInit(): void {
    this.formulario.controls['Total'].disable();
    this.formulario.controls['Defecto'].disable();
    this.formulario.controls['Especial'].disable();
    this.formulario.controls['Mercado_Local'].disable();
    this.formulario.controls['Exportado'].disable();
    this.formulario.controls['seg_Exp_A'].disable();
    this.formulario.controls['seg_Exp_B'].disable();
    this.formulario.controls['ad_A'].disable();
    this.formulario.controls['ad_B'].disable();
    this.formulario.controls['ad3_A'].disable();
    this.formulario.controls['ad3_B'].disable();
    this.traerReporte()
    this.getAuditores();
  }


  traerReporte() {
    this.Cod_Accion = 'L'
    this.Fec_Auditoria = this.data.Fec_Auditoria;
    var Cod_Auditor = this.formulario.get('Cod_Auditor').value;

    this.defectosAlmacenDerivadosService.ReporteCantidadesPorFecha(
      this.Cod_Accion,
      this.Fec_Auditoria,
      Cod_Auditor
    ).subscribe(
      (result: any) => {
        console.log(result)
        this.dataResultado = result;
        this.formulario.patchValue({
          Total: result[0].Ingresado,
          Defecto: result[0].Defecto,
          Especial: result[0].Especial,
          Mercado_Local: result[0].Mercado_Local,
          Exportado: result[0].Exportado,
          seg_Exp_A: result[0].Seg_Exp_A,
          seg_Exp_B: result[0].Seg_Exp_B,
          ad_A: result[0].Adicional_a,
          ad_B: result[0].Adicional_b,
          ad3_A: result[0].Adicional3_a,
          ad3_B: result[0].Adicional3_b,
        })
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    )
  }

  getAuditores(){
    this.defectosAlmacenDerivadosService.CF_Auditor_Derivado().subscribe(
      (result: any) => {
        this.dataAuditores = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    )
  }
  

  generateExcel() {
    this.dataForExcel = [];

    var array = [];
    this.dataResultado.forEach(element => {
      let datos = {
        ['Total Ingreso'] : element.Ingresado,
        ['Total Especiales'] : element.Especial,
        ['Total Defectos'] : element.Defecto,
        ['Segundas Vendibles'] : element.Exportado,
        ['Mercado Local'] : element.Mercado_Local,
        ['Segundas Exp. Tipo A'] : element.Seg_Exp_A,
        ['Segundas Exp. Tipo B'] : element.Seg_Exp_B,
        ['Adicionales 2. Tipo A'] : element.Adicional_a,
        ['Adicionales 2. Tipo B'] : element.Adicional_b,
        ['Adicionales 3. Tipo A'] : element.Adicional3_a,
        ['Adicionales 3. Tipo B'] : element.Adicional3_b,
      };
      array.push(datos);
    });

    array.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })

    let reportData = {
      title: 'REPORTE LECTURA DE ',
      data: this.dataForExcel,
      headers: Object.keys(array[0])
    }
  
    this.exceljsService.exportExcel(reportData, this.Fec_Auditoria);
  
  }

}
