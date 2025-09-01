import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { EstilosLiquidarService } from 'src/app/services/estilos-liquidar.service';

interface data_det {
  Co_CodOrdPro:string,
  Cod_OrdPro:string,
  Nom_Cliente:string,
  cod_estcli:string,
  des_compest:string,
  Des_Color:string,
  Cod_OrdTra:string,
  Num_Prendas_Prog:string,
  Num_Prendas_Reales:string,
  MERMAS:string,
  flg_status:string,
  Des_Tela:string,
  Fec_Corte:string,
  MODULO:string

}


interface data_det2 {
  COD_ESTCLI: string
  DES_CLIENTE: string
  DES_PRESENT: string
  FECHA_INGRESO: string
  INGRESO: number
  FEC_LECTURA: string
  SALIDA: number
  POR_LIQUIDAR: number
  DIAS: string
}

@Component({
  selector: 'app-partidas-pendientes-estadoref',
  templateUrl: './partidas-pendientes-estadoref.component.html',
  styleUrls: ['./partidas-pendientes-estadoref.component.scss']
})
export class PartidasPendientesEstadoRefComponent implements OnInit {

  displayedColumns_cab: string[] = [
    'Co_CodOrdPro',
    'Cod_OrdPro',
    'Nom_Cliente',
    'cod_estcli',
    'des_compest',
    'Des_Color',
    'Cod_OrdTra',
    'Num_Prendas_Prog',
    'Num_Prendas_Reales',
    'MERMAS',
    'flg_status',
    'Des_Tela',
    'Fec_Corte',
    'MODULO'
  ]
  dataSource: MatTableDataSource<data_det>;


  //displayedColumns_cab2: string[] = ['Estilo', 'Des_Cliente', 'Des_Present', 'Fecha_Ingreso','Ingreso', 'Fec_Lectura','Salida' , 'Por_Liquidar', 'Dias']
  displayedColumns_cab2: string[] = ['FILA','TURNO','DES_MAQUINA','TEJEDOR','TELAS','CAL0','KG_CAL1','KG_CAL2','KG_CAL3','KG_TOTAL','KG_ESTIMADOS','MIN_IMPRODUCTIVO','EFICIENCIA','KG_PROD_TOT','KG_PROD_4TA']
  dataSource2: MatTableDataSource<data_det2>;
  
  Cod_Accion = ""
  contador = 0;
  contador2 = 0;
  ini = 10

  Num_Pag1 = 0
  Num_Pag2 = 0


  formulario = this.formBuilder.group({

  })

  
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, private SpinnerService: NgxSpinnerService,
    public dialog: MatDialog,
    private estilosLiquidarService: EstilosLiquidarService
  ) {
    
    this.dataSource = new MatTableDataSource();
    this.dataSource2 = new MatTableDataSource();

    this.formulario = formBuilder.group({
    
    });
  }




//tabla2 +
  //@ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild('MatPaginator1') paginator2: MatPaginator;

  //tabla1 -
  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('MatPaginator2') paginator: MatPaginator;
  ngAfterViewInit() {

//tabla2 +
    this.dataSource.paginator = this.paginator2;
    this.paginator2._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator2._intl.getRangeLabel = (page2: number, pageSize2: number, length2: number) => {
      if (length2 === 0 || pageSize2 === 0) {
        return `0 de ${length2}`;
      }
      length2 = Math.max(length2, 0);
      const startIndex2 = page2 * pageSize2;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex2 = startIndex2 < length ? Math.min(startIndex2 + pageSize2, length2) : startIndex2 + pageSize2;
      this.Num_Pag1 = length2
      return `${startIndex2 + 1}  - ${endIndex2} de ${length2}`;

    };


  }

  ngOnInit(): void {

    localStorage.setItem('intervalo', this.ini.toString());
    setInterval(() => {
      let valor = localStorage.getItem('intervalo');
      if (+valor === this.contador) {
        this.ActualizarIni()
        this.MuestraTabla1()
        localStorage.setItem('intervalo', this.ini + '');
        this.contador = 0
      } else {
        this.contador++;
      }
    }, 1000);


    localStorage.setItem('intervalo2', '5');
    setInterval(() => {
      let valor2 = localStorage.getItem('intervalo2');
      if (+valor2 === this.contador2) {
   
        localStorage.setItem('intervalo2', 5 + '');
        this.contador2 = 0
      } else {      
       
        this.paginator2.nextPage()
        if (this.paginator2.getNumberOfPages()-1 == this.paginator2.pageIndex){
          this.paginator2.firstPage()
        }

        this.contador2++;
      }
    }, 10000);


  }
   

  ngOnDestroy() {
    localStorage.removeItem("intervalo");
    localStorage.removeItem("intervalo2");
  }

  MuestraTabla1() {
    this.Cod_Accion = '2'
    this.estilosLiquidarService.co_seguimiento_ocorte_pendientes_nuevo(
    ).subscribe(
      (result: any) => {
        this.dataSource.data = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

  }

  MuestraTabla2() {
    this.Cod_Accion = '1'
    this.estilosLiquidarService.UP_RPT_SITUACION_ORDENES_INSPECCION_PANTALLA_FINAL(
      this.Cod_Accion
    ).subscribe(
      (result: any) => {
        //console.log(result)
        this.dataSource2.data = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

  }

  ActualizarIni() {
    this.estilosLiquidarService.ActualizarIni(
    ).subscribe(
      (result: any) => {
        this.ini = result[0].Min_Act_Visor_Inspeccion
        //console.log(this.ini)
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

  }

}
