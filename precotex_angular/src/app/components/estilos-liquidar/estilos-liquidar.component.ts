import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { GlobalVariable } from '../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstilosLiquidarService } from 'src/app/services/estilos-liquidar.service'
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

interface data_det {
  COD_ESTCLI: string
  DES_CLIENTE: string
  ICONO_WEB: string
  DES_PRESENT: string
  POR_LIQUIDAR: number
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
  selector: 'app-estilos-liquidar',
  templateUrl: './estilos-liquidar.component.html',
  styleUrls: ['./estilos-liquidar.component.scss']
})
export class EstilosLiquidarComponent implements OnInit {


  displayedColumns_cab: string[] = ['Estilo', 'Des_Cliente', 'Icono_Web', 'Des_Present', 'Por_Liquidar']
  dataSource: MatTableDataSource<data_det>;


  displayedColumns_cab2: string[] = ['Estilo', 'Des_Cliente', 'Des_Present', 'Fecha_Ingreso','Ingreso', 'Fec_Lectura','Salida' , 'Por_Liquidar', 'Dias']
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


//tabla1 -
    this.dataSource2.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      //console.log("page")
      //console.log(page)
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      //this.Num_Pag2 = this.paginator.lastPage();
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };

  }

  ngOnInit(): void {

    localStorage.setItem('intervalo', this.ini.toString());
    setInterval(() => {
      let valor = localStorage.getItem('intervalo');
      if (+valor === this.contador) {
        this.ActualizarIni()
        this.MuestraTabla1()
        this.MuestraTabla2()
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

        this.paginator.nextPage()
        if (this.paginator.getNumberOfPages()-1 == this.paginator.pageIndex){
          this.paginator.firstPage()
        }

        this.contador2++;
      }
    }, 10000);

    /*this.paginator.nextPage()
    this.paginator2.nextPage()
    this.paginator.firstPage()*/


    /*localStorage.setItem('intervalo', this.ini.toString());
    setInterval(() => {
      let valor = localStorage.getItem('intervalo');
      if (+valor === this.contador) {
        this.ActualizarIni()
        this.MuestraTabla1()
        this.MuestraTabla2()
        localStorage.setItem('intervalo', this.contador  + '');
        this.contador = 0
        //console.log(this.contador);
      } else {
        console.log(this.contador);
        this.contador++;
      }
    }, 1000);*/
  }
  

    /*localStorage.setItem("intervalo",this.ini.toString());
    setInterval(()=>{
      let valor  = localStorage.getItem("intervalo");
      if(+valor === this.contador){
        this.ActualizarIni()
        this.MuestraTabla1()
        this.MuestraTabla2()
          localStorage.setItem("intervalo",this.contador + this.ini + "");

      }else{
        this.contador++;
      }

    },1000);*/
    
  
  

  ngOnDestroy() {
    localStorage.removeItem("intervalo");
    localStorage.removeItem("intervalo2");
  }

  MuestraTabla1() {
    this.Cod_Accion = '2'
    this.estilosLiquidarService.UP_RPT_SITUACION_ORDENES_INSPECCION_PANTALLA_FINAL(
      this.Cod_Accion
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
