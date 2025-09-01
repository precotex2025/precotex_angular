import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { GlobalVariable } from '../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LecturaBultosAlmacenService } from 'src/app/services/lectura-bultos-almacen.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelect } from '@angular/material/select';
import { NgxSpinnerService }  from "ngx-spinner";



interface data_det {
  Id_Detalle: number
  Lote: number
  Hilo:string
  Peso_neto: string
  
}

interface data{
  dataSourceD: any
  sCodUbicacionOriginal:string
}

@Component({
  selector: 'app-dialog-tranfer-bultos',
  templateUrl: './dialog-tranfer-bultos.component.html',
  styleUrls: ['./dialog-tranfer-bultos.component.scss']
})
export class DialogTranferBultosComponent implements OnInit {

  nCodUbica:number=0;
  CodBarUbica: string='';
  Id_Ubicacion: number=0;
  codBarUbicacion: string = '';
  sCodUbicacion: string = '';
  sCodUbicacionOriginal: string = '';
  

  displayedColumns_cab: string[] =  
  [ 'Id_correlativo',
    'Id_num',
    'Cod_ubicacion',
    'lote',
    'Palet'
  ]


  formulario = this.formBuilder.group({
    sCodUbicacion:   [''],
    Id_Detalle:     [0],    
    Lote:           [''],
    Hilo:           [''],
    Peso_Neto:      [''],
    sCodUbicacionOriginal:      [''],
  }) 


  dataSource: MatTableDataSource<data_det>;
  
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,private LecturaBultosAlmacenService: LecturaBultosAlmacenService, private SpinnerService: NgxSpinnerService
    , @Inject(MAT_DIALOG_DATA) public data: data ) { 
      this.dataSource = new MatTableDataSource();
    }


    @ViewChild(MatPaginator) paginator!: MatPaginator;

  
  
  
    ngOnInit(): void {
      this.dataSource.data=[]
      this.dataSource.data=this.data.dataSourceD
      
      this.sCodUbicacionOriginal=this.data.sCodUbicacionOriginal
      console.log(this.sCodUbicacionOriginal)
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
 
  onToggleCodBarUbicacion() {
    if (this.codBarUbicacion.length >= 4) {
        this.MostrarCodigoUbicacion();
    }
  }

  MostrarCodigoUbicacion() {
    this.LecturaBultosAlmacenService.showUbicacionCod('F',this.codBarUbicacion).subscribe(
        (result: any) => {
          if (result[0].Respuesta == undefined) {
            this.Id_Ubicacion=result[0].Id_num
            this.SpinnerService.hide();
            this.matSnackBar.open("Correcto", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
          }
          else
          {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
            this.codBarUbicacion = '';
            document.getElementById("sCodUbicacion")?.focus();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 5000,
        }))
    }



    MostrarResultadosBultos() {
      this.LecturaBultosAlmacenService.showUbicacionCod('E','').subscribe(
          (result: any) => {
            if (result[0].Respuesta == undefined) {
              this.dataSource.data = result
              this.SpinnerService.hide();
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
              this.dataSource.data = []
              this.SpinnerService.hide();
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 5000,
          }))
      }





 guardarTranfer(){
  var dataDet = [];
  let det= {
    nCodUbica:this.Id_Ubicacion,
    datos:this.dataSource.data

  }     

  dataDet.push(det)

  this.LecturaBultosAlmacenService.saveTtranferBulto(det).subscribe(
    (res: any) => {
      if(res.msg == 'OK'){
        console.log(dataDet)
      this.matSnackBar.open('Bultos transferidos a Ubicacion: '+this.codBarUbicacion, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 5000 })
      this.MostrarCodigoUbicacion_detalle()
      }
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 5000 })
  )

 }



 MostrarCodigoUbicacion_detalle() {
  this.LecturaBultosAlmacenService.showUbicacionCod('L',this.sCodUbicacionOriginal).subscribe(
      (result: any) => {
        if (result[0].Respuesta == undefined) {
          
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 5000 })
          this.SpinnerService.hide();
          
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      }))
  }


  

   
  


























}
