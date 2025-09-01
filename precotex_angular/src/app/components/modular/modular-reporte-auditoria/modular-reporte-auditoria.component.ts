import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { AuditoriaPrendaService } from 'src/app/services/modular/auditoria-prenda.service';


interface data_det {
  Fecha: string;
  Secuencia: string;
  Codigo_Inspector: string;
  Nombre_Inspector: string;
  Cliente: string;
  Ticket: string;
  OP: string;
  Estilo_Cliente: string;
  Cod_Color: string;
  Color: string;
  Total_Prendas: string;
  Total_Muestras_Auditadas: string;
  Codigo_Defecto: string;
  Descripcion_Defecto: string;
  Cantidad_Defecto: string;
  Estado: string;
  Usuario: string;
  Codigo_Auditor: string;
  Nombre_Auditor: string;
}

@Component({
  selector: 'app-modular-reporte-auditoria',
  templateUrl: './modular-reporte-auditoria.component.html',
  styleUrls: ['./modular-reporte-auditoria.component.scss']
})
export class ModularReporteAuditoriaComponent implements OnInit {

  Fecha_Auditoria = ""
  Fecha_Auditoria2 = ""
  titleReporte = ""
  dataExportar: Array<any> = []


  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Modulo: ['M']
  })


  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }


  displayedColumns: string[] = [
    'Fecha_Registro',
    'Codigo_Inspector',
    'Inspector',
    'Ticket',
    'Cod_OrdPro',
    'Cliente',
    'cod_estcli',
    'Des_Present',
    'Cantidad',
    'Tamano_Muestra',
    'Codigo_Defecto',
    'Descripcion_Defecto',
    'Cantidad_Defecto',
    'Estado',
    'Codigo_Auditor',
    'Auditor'
  ];


  displayedColumns2: string[] = [
    'Fecha_Registro',
    'Auditor_Modulo',
    'Inspector',
    'Ticket',
    'Cod_OrdPro',
    'Cliente',
    'cod_estcli',
    'Des_Present',
    'Cantidad',
    'Tamano_Muestra',
    'Codigo_Defecto',
    'Descripcion_Defecto',
    'Cantidad_Defecto',
    'Estado',
    'Codigo_Auditor',
    'Auditor'
  ];
  
  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();




  dataForExcel = [];





  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private auditoriaService: AuditoriaPrendaService,
    private excelService: ExcelService,
    private exceljsService: ExceljsService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {


  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };

  }

  generateExcel() {
    //console.log(this.dataSource.data)
    this.dataExportar = []
    if(this.formulario.get('Modulo').value == 'M'){
      this.titleReporte = 'REPORTE INSPECCIÓN AUDITORIA MODULO'
    }else{
      this.titleReporte = 'REPORTE INSPECCIÓN AUDITORIA TRANSITO'
    }
    let datos = this.dataSource.data;

    let totalCantidad=0;
    let totalTamMuestra=0;
    let totalCantDefecto=0;

    datos.forEach(element => {
      totalCantidad += parseInt(element['Cantidad'])
      totalTamMuestra += parseInt(element['Tamano_Muestra'])
      totalCantDefecto += parseInt(element['Cantidad_Defecto'])
      this.dataExportar.push(element)
    });
    
    let objTotales =    {
      "Nro_Reg": "TOTALES",
      "Fecha_Registro": "",
      "Codigo_Inspector": "",
      "Inspector": "",
      "Ticket": "",
      "Cod_OrdPro": "",
      "Cliente": "",
      "cod_estcli": "",
      "Des_Present": "",
      "Cantidad": totalCantidad,
      "Tamano_Muestra": totalTamMuestra,
      "Codigo_Defecto": "",
      "Descripcion_Defecto": "",
      "Cantidad_Defecto": totalCantDefecto,
      "Estado": "",
      "Codigo_Auditor": "",
      "Auditor": "",
      "RowNum": ""
    }
    this.dataExportar.push(objTotales)
    //console.log(this.dataExportar)
    //console.log(this.titleReporte)
    
    this.dataForExcel = [];
    if (this.dataSource.data.length == 0) {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {
      
      /*this.dataSource.data.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })*/
      this.dataExportar.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        //title: 'REPORTE INSPECCIÓN AUDITORIA',
        title: this.titleReporte,
        data: this.dataForExcel,
        headers: Object.keys(this.dataSource.data[0])
      }

      this.exceljsService.exportExcel(reportData);
      //this.dataSource.data = [];

    }
  }


  exportAsXLSX(): void {

    this.excelService.exportAsExcelFile(this.dataSource.data, 'Reporte-Inspeccion-Prenda');

  }


  buscarReporteControlVehiculos() {
    this.dataSource.data = [];  
    
    //console.log(this.formulario.get('Modulo').value,this.range.get('start')?.value, this.range.get('end')?.value)
    this.SpinnerService.show();
    this.auditoriaService.CF_Modular_Reporte_Auditoria_Web(this.formulario.get('Modulo').value,this.range.get('start')?.value,this.range.get('end')?.value).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result)
          this.dataSource.data = result
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    })

  }

  selectTipo(valor){
    this.dataSource.data = []
  }

}

