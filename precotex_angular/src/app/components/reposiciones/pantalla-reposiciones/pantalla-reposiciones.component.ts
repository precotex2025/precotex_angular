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
  Num_Solicitud:string,
  Num_Linea:string,
  Cod_Usuario:string,
  OP:string,
  Color:string,
  Estilo_Cliente:string,
  OC:string,
  Pieza:string,
  Cantidad:string,
  Fec_Alta:string,
  Fecha_Solicitud:string,
  Fecha_Salida:string,
  Fecha_Ingreso:string,
  Aprobacion_Calidad:string,
  Fec_Aprob_Calidad:string,
  Fecha_Salida_Despacho:string

}



@Component({
  selector: 'app-pantalla-reposiciones',
  templateUrl: './pantalla-reposiciones.component.html',
  styleUrls: ['./pantalla-reposiciones.component.scss']
})
export class PantallaReposicionesComponent implements OnInit {

  displayedColumns_cab: string[] = [
    'Num_Solicitud',
    'Num_Linea',
    'Cod_usuario',
    'OP',
    'Color',
    'Estilo_Cliente',
    'OC',
    'Pieza',
    'Cantidad',
    'Fec_Alta',
    'Fecha_Solicitud',
    'Fecha_Salida',
    'Fecha_Ingreso',
    //'Aprobacion_Calidad',
    'Fec_Aprob_Calidad',
    'Fecha_Salida_Despacho'
  ]
  dataSource: MatTableDataSource<data_det>;


  displayedColumns_cab2: string[] = ['Estilo', 'Des_Cliente', 'Des_Present', 'Fecha_Ingreso','Ingreso', 'Fec_Lectura','Salida' , 'Por_Liquidar', 'Dias']
 
 
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
    this.estilosLiquidarService.CF_PANTALLA_REPOSICIONES_WEB(
    ).subscribe(
      (result: any) => {
        this.dataSource.data = result
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
