import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { SeguimientoSaldoHiloService } from 'src/app/services/tejeduria/seguimiento-saldo-hilo.service';
import { AuditoriaDevolDeHiloProgramadaComponent } from './auditoria-devol-de-hilo-programada/auditoria-devol-de-hilo-programada.component';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';

interface data_det {
  cod_Maquina?  : string,
  ot            : string, // SOLIC #
  lote          : string,
  fibra?        : string,
  titulo?       : string,
  fec_Termino?  : string,
  cod_Hilado?   : string,
  articulo?     : number,
  estado?       : string,
  sem?          : string,
  nBultos?      : number,
  proveedor?      : string,
  descripcion_hilo?: string,
  color?          : string,
  marca?          : string,
  conera?         : string,
  solic_ot?       : string,
  oc?             : string,
}

@Component({
  selector: 'app-saldo-prueba',
  templateUrl: './auditoria-devol-hilo-component.html',
  styleUrls: ['./auditoria-devol-hilo-component.scss']
})
export class SaldoPruebaComponent implements OnInit {

  range = new FormGroup({
      start : new FormControl(new Date()),
      end   : new FormControl(new Date()),
  });     

  displayedColumns: string[] = ['opciones', 'ot', 'lote', 'sem', 'nBultos', 'estado'];
  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();
  allOTs: data_det[] = [];

  constructor(
     private formBuilder          : FormBuilder,
     private dialog               : MatDialog  ,
     private serviceSaldoHiloTela : SeguimientoSaldoHiloService,
     private SpinnerService       : NgxSpinnerService ,
  ) { }

  ngOnInit(): void {
    this.range.valueChanges.subscribe(val => {
      if (val.start && val.end) {
        this.onDateRangeSelected(val.start, val.end);
      } else {
        this.aplicarFiltros();
      }
    });

    this.onDateRangeSelected(this.range.value.start, this.range.value.end);    
  }

  formulario = this.formBuilder.group({
    filtroEstado: [''],
    filtroOT   : [''],
    filtroLote : ['']
  });  

  onLoadOTTerminadas(start: Date, end: Date, valorPendiente: string){
    const mockItems: data_det[] = [
      {
        ot: 'SOL-1048',
        lote: 'LOT-23A40',
        sem: '26',
        nBultos: 12,
        fec_Termino: '2026-06-25T12:00:00Z',
        cod_Maquina: '10',
        fibra: 'ALGODON 100%',
        titulo: '30/1',
        cod_Hilado: 'HIL-TEST-001',
        articulo: 9999,
        proveedor: 'PRECOTEX',
        descripcion_hilo: 'ALGODÓN AMERICANO 30/1 PEINADO',
        color: 'PINEEDLE',
        marca: '10',
        conera: '1',
        solic_ot: '2026045',
        oc: 'OC-9901'
      },
      {
        ot: 'SOL-1052',
        lote: 'LOT-23B12',
        sem: '27',
        nBultos: 8,
        fec_Termino: '2026-06-28T14:30:00Z',
        cod_Maquina: '12',
        fibra: 'POLIESTER 100%',
        titulo: '40/1',
        cod_Hilado: 'HIL-TEST-002',
        articulo: 8888,
        estado: 'A',
        proveedor: 'PRECOTEX',
        descripcion_hilo: 'ALGODÓN TANGUIS 20/1',
        color: 'MELANGE',
        marca: '12',
        conera: '2',
        solic_ot: '2026098',
        oc: 'OC-9902'
      },
      {
        ot: 'SOL-1065',
        lote: 'LOT-23C55',
        sem: '25',
        nBultos: 15,
        fec_Termino: '2026-06-20T09:15:00Z',
        cod_Maquina: '6',
        fibra: 'VISCOSA 100%',
        titulo: '20/1',
        cod_Hilado: 'HIL-TEST-003',
        articulo: 7777,
        estado: 'D',
        proveedor: 'PRECOTEX',
        descripcion_hilo: 'VISCOSA / POLIESTER 40/1',
        color: 'CRU',
        marca: '6',
        conera: '1',
        solic_ot: '2026112',
        oc: 'OC-9903'
      },
      {
        ot: 'SOL-1070',
        lote: 'LOT-23D77',
        sem: '28',
        nBultos: 6,
        fec_Termino: '2026-06-29T10:00:00Z',
        cod_Maquina: '14',
        fibra: 'ALGODON / POLIESTER',
        titulo: '24/1',
        cod_Hilado: 'HIL-TEST-004',
        articulo: 6666,
        proveedor: 'PRECOTEX',
        descripcion_hilo: 'ALGODÓN PIMA 50/1',
        color: 'BLANCO',
        marca: '14',
        conera: '3',
        solic_ot: '2026154',
        oc: 'OC-9904'
      },
      {
        ot: 'SOL-1082',
        lote: 'LOT-23E89',
        sem: '26',
        nBultos: 20,
        fec_Termino: '2026-06-30T08:00:00Z',
        cod_Maquina: '21',
        fibra: 'LINO 100%',
        titulo: '50/1',
        cod_Hilado: 'HIL-TEST-005',
        articulo: 5555,
        proveedor: 'PRECOTEX',
        descripcion_hilo: 'LINO / ALGODÓN 30/1',
        color: 'AZUL MARINO',
        marca: '21',
        conera: '1',
        solic_ot: '2026210',
        oc: 'OC-9905'
      }
    ];

    this.dataSource.data = [];
    this.SpinnerService.show();
    this.serviceSaldoHiloTela.getListaOT_Terminada(start, end, valorPendiente).subscribe({
      next: (response: any)=> {
        if(response.success){
          const elements = response.elements || [];
          this.allOTs = [...mockItems, ...elements];
          this.aplicarFiltros();
          this.SpinnerService.hide();
        } else {
          this.allOTs = mockItems;
          this.aplicarFiltros();
          this.SpinnerService.hide();
        }
      },  
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error?.error?.message || 'Error', 'Cerrar', {
          timeOut: 2500,
        });
        this.allOTs = mockItems;
        this.aplicarFiltros();
      }         
    })
  }

  onEspecificacion(data: any){
    const esMovil = window.innerWidth < 768; 
    let dialogRef = this.dialog.open(AuditoriaDevolDeHiloProgramadaComponent, {
      width         : esMovil ? '100%' : '1050px',
      height        : esMovil ? '100%' : '',
      maxHeight     : esMovil ? '100vh' : '95vh',
      maxWidth      : esMovil ? '100vw' : '1050px',
      disableClose  : true,
      panelClass    : 'my-class',
      data: {
        Datos  : data
      }
    });
    dialogRef.afterClosed().subscribe((resState) => {
      if (resState) {
        const mockOTs = ['SOL-1048', 'SOL-1052', 'SOL-1065', 'SOL-1070', 'SOL-1082'];
        const isMock = mockOTs.includes(data.ot);
        const testItemIndex = this.allOTs.findIndex(item => item.ot === data.ot);
        if (testItemIndex > -1 && isMock) {
          this.allOTs[testItemIndex].estado = resState;
          this.aplicarFiltros();
        } else {
          const sFecIni = this.range.get('start').value;
          const sFecFin = this.range.get('end').value;
          this.onLoadOTTerminadas(new Date(sFecIni), new Date(sFecFin), 'N');
        }
      }
    });    
  }

  // chgPendiente was removed since toggle was replaced by state filter dropdown

  onDateRangeSelected(start: Date, end: Date) {
    if (start && end) {
      this.onLoadOTTerminadas(new Date(start), new Date(end), 'N');
    }
  }  

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }    

  aplicarFiltros() {
    const otVal = (this.formulario.get('filtroOT')?.value || '').toLowerCase().trim();
    const loteVal = (this.formulario.get('filtroLote')?.value || '').toLowerCase().trim();
    const estadoVal = this.formulario.get('filtroEstado')?.value || '';
    const startVal = this.range.get('start')?.value;
    const endVal = this.range.get('end')?.value;

    this.dataSource.data = this.allOTs.filter(item => {
      const matchOT = !otVal || (item.ot && item.ot.toString().toLowerCase().includes(otVal));
      const matchLote = !loteVal || (item.lote && item.lote.toString().toLowerCase().includes(loteVal));
      
      let matchEstado = true;
      if (estadoVal === 'A') {
        matchEstado = item.estado === 'A';
      } else if (estadoVal === 'D') {
        matchEstado = item.estado === 'D';
      } else if (estadoVal === '--') {
        matchEstado = !item.estado || (item.estado !== 'A' && item.estado !== 'D');
      }

      let matchDate = true;
      if (startVal && endVal && item.fec_Termino) {
        const itemDate = new Date(item.fec_Termino);
        const start = new Date(startVal);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endVal);
        end.setHours(23, 59, 59, 999);
        matchDate = itemDate >= start && itemDate <= end;
      }

      return matchOT && matchLote && matchEstado && matchDate;
    });
  }

  exportarAExcel() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Saldos');

    // Habilitar las líneas de cuadrícula para que Excel las muestre por defecto
    worksheet.views = [{ showGridLines: true }];

    // Title Banner
    worksheet.mergeCells('A1:G2');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'DIR. DE HILO - REPORTE DE SALDO';
    titleCell.font = {
      name: 'Segoe UI',
      size: 16,
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F4C5C' } // Deep Teal/Emerald corporate banner
    };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Metadata Row
    const startVal = this.range.get('start')?.value;
    const endVal = this.range.get('end')?.value;
    const startText = (startVal && !isNaN(new Date(startVal).getTime())) ? new Date(startVal).toLocaleDateString('es-PE') : 'Inicio';
    const endText = (endVal && !isNaN(new Date(endVal).getTime())) ? new Date(endVal).toLocaleDateString('es-PE') : 'Fin';

    const row4 = worksheet.getRow(4);
    row4.values = [
      'Reporte generado el:', 
      new Date().toLocaleDateString('es-PE'), 
      '', 
      'Rango:', 
      startText,
      'al',
      endText
    ];
    row4.font = { italic: true, size: 10, name: 'Segoe UI', color: { argb: 'FF546E7A' } };

    // Table Headers
    const row6 = worksheet.getRow(6);
    row6.values = ['SOLIC #', 'LOTE', 'SEM', 'N BULTOS', 'ESTADO'];
    row6.height = 25;
    row6.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF00695C' } // Medium-Dark Teal Header
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
        size: 11,
        name: 'Segoe UI'
      };
      cell.alignment = { 
        vertical: 'middle', 
        horizontal: colNumber === 4 ? 'right' : 'center' 
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF004D40' } },
        left: { style: 'thin', color: { argb: 'FF004D40' } },
        bottom: { style: 'medium', color: { argb: 'FF004D40' } },
        right: { style: 'thin', color: { argb: 'FF004D40' } }
      };
    });

    // Populate data
    const activeData = this.dataSource.data;
    let currentRow = 7;
    activeData.forEach((item, index) => {
      const estadoDesc = item.estado === 'A' ? 'Aprobado' : (item.estado === 'D' ? 'Desaprobado' : 'Sin Asignar');
      const bultosVal = (item.nBultos !== null && item.nBultos !== undefined) ? item.nBultos : '';
      
      const row = worksheet.getRow(currentRow);
      row.values = [
        item.ot !== null && item.ot !== undefined ? String(item.ot) : '',
        item.lote !== null && item.lote !== undefined ? String(item.lote) : '',
        item.sem !== null && item.sem !== undefined ? String(item.sem) : '',
        bultosVal,
        estadoDesc
      ];
      row.height = 20;

      // Apply row styles (Zebra striping and borders)
      const isEven = index % 2 === 0;
      row.eachCell((cell, colNumber) => {
        cell.font = {
          name: 'Segoe UI',
          size: 10,
          color: { argb: 'FF333333' }
        };
        
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isEven ? 'FFF2F6F6' : 'FFFFFFFF' } // Soft grey-teal stripe vs pure white
        };

        // Professional alignment & cell type styling
        if (colNumber === 4) { // N BULTOS (numeric)
          cell.alignment = { vertical: 'middle', horizontal: 'right' };
          cell.numFmt = '#,##0'; // Standard integer format
        } else if (colNumber === 5) { // ESTADO (dynamic badging)
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          if (item.estado === 'A') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFE8F5E9' } // Light green
            };
            cell.font = {
              name: 'Segoe UI',
              size: 10,
              bold: true,
              color: { argb: 'FF2E7D32' } // Dark green
            };
          } else if (item.estado === 'D') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFEBEE' } // Light red
            };
            cell.font = {
              name: 'Segoe UI',
              size: 10,
              bold: true,
              color: { argb: 'FFC62828' } // Dark red
            };
          } else {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFECEFF1' } // Light gray
            };
            cell.font = {
              name: 'Segoe UI',
              size: 10,
              bold: true,
              color: { argb: 'FF546E7A' } // Gray blue
            };
          }
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }

        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
        };
      });

      currentRow++;
    });

    // Set Column widths
    worksheet.getColumn(1).width = 18; // SOLIC #
    worksheet.getColumn(2).width = 20; // Lote
    worksheet.getColumn(3).width = 12; // SEM
    worksheet.getColumn(4).width = 18; // N BULTOS
    worksheet.getColumn(5).width = 18; // Estado

    // Save File
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'Reporte_Saldo_Tejeduria.xlsx');
    });
  }
}
