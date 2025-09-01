import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/services/excel.service';
import { ExcelAudTicketjsService } from 'src/app/services/excelaudticketjs.service';
import { AuditoriaPrendaService } from 'src/app/services/modular/auditoria-prenda.service';


interface data_det {
  Fecha: string;
  Secuencia: string;
  Codigo_Inspector: string;
  Nombre_Inspector: string;
  Cliente: string;
  OP: string;
  Estilo_Cliente: string;
  Cod_Color: string;
  Color: string;
  Ticket: string;
  Num_Paquete: string;
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
  selector: 'app-modular-reporte-auditoria-ticket',
  templateUrl: './modular-reporte-auditoria-ticket.component.html',
  styleUrls: ['./modular-reporte-auditoria-ticket.component.scss']
})
export class ModularReporteAuditoriaTicketComponent implements OnInit {

  Fecha_Auditoria = ""
  Fecha_Auditoria2 = ""
  titleReporte = ""
  dataExportar: Array<any> = []
  lstAuditores: any[] = []


  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Modulo: ['M'],
    Auditoria: [' ']
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
    'Cod_OrdPro',
    'Cliente',
    'cod_estcli',
    'Des_Present',
    'Ticket',
    'Num_Paquete',
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
    'Cod_OrdPro',
    'Cliente',
    'cod_estcli',
    'Des_Present',
    'Ticket',
    'Num_Paquete',
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
    private excelaudjsService: ExcelAudTicketjsService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.allAuditoresModular()
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
    if(this.formulario.get('Modulo').value == 'M'){
      this.titleReporte = 'REPORTE INSPECCIÓN AUDITORIA DE TICKET MODULO'
    }else{
      this.titleReporte = 'REPORTE INSPECCIÓN AUDITORIA DE TICKET TRANSITO'
    }
    
    this.dataForExcel = [];
    if (this.dataSource.data.length == 0) {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {
      
      this.dataSource.data.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        //title: 'REPORTE INSPECCIÓN AUDITORIA',
        title: this.titleReporte,
        data: this.dataForExcel,
        headers: Object.keys(this.dataSource.data[0])
      }

      this.excelaudjsService.exportExcel(reportData);
      //this.dataSource.data = [];

    }
  }


  exportAsXLSX(): void {

    this.excelService.exportAsExcelFile(this.dataSource.data, 'Reporte-Inspeccion-Prenda');

  }


  buscarReporteControlVehiculos() {
    this.dataSource.data = [];  
    
    console.log(
      'modulo: ',this.formulario.get('Modulo').value,
      'start: ',this.range.get('start')?.value,
      'end: ',this.range.get('end')?.value,
      'Auditoria: ',this.formulario.get('Auditoria').value
    )
    this.SpinnerService.show();
    this.auditoriaService.CF_Modular_Reporte_Auditoria_Ticket_Web(this.formulario.get('Modulo').value,this.range.get('start')?.value,this.range.get('end')?.value,this.formulario.get('Auditoria').value).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result)
          //this.dataSource.data = []
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

  allAuditoresModular(){

    this.SpinnerService.show();
    this.auditoriaService.CF_Modular_Reporte_Auditoria_Ticket_Web('A',this.range.get('start')?.value,this.range.get('end')?.value,null).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result)
          this.lstAuditores = result;
        }
        else {
          this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        this.SpinnerService.hide();
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    })

  }

}

