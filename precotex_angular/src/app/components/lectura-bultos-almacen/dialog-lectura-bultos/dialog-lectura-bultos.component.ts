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


interface data{
  Num_Corre: string
  Id_Num: number
  Cod_Ubicacion:      string
  CodLote: string

  dataSourceD: any
}

 

interface data_det {
  Cod_OrdProv: string
  Cod_ubicacion: string  
}



@Component({
  selector: 'app-dialog-lectura-bultos',
  templateUrl: './dialog-lectura-bultos.component.html',
  styleUrls: ['./dialog-lectura-bultos.component.scss']
})
export class DialogLecturaBultosComponent implements OnInit {
  Cod_Accion      = ''
  Num_Corre =''
  Id_Num  =0
  nlote      = ''
  nhilo          = ''
  nconos           = ''
  npesobruto           = ''
  nNumCorre  =''
  Cod_Ubicacion= ''
  Id_Detalle=0

  //CodLote= ''
  
  displayedColumns_cab: string[] =  
  [ 
    'Cod_OrdProv',
    'Cod_ubicacion',
    'Palet',
    'des_hiltel'
    
  ]
  
  formulario = this.formBuilder.group({
    Num_Corre:         [''],
    Id_Num:         [0],
    nlote:         [''],
    nhilo:          [''],
    nconos:          [''],
    npesobruto:         [''],
    Cod_Ubicacion:         [''],
    npesoneto:         ['']
    

  }) 

  dataSource: MatTableDataSource<data_det>;

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, private LecturaBultosAlmacenService: LecturaBultosAlmacenService, private SpinnerService: NgxSpinnerService
    , @Inject(MAT_DIALOG_DATA) public data: data) {

      this.dataSource = new MatTableDataSource();
      

      this.formulario = formBuilder.group({
        Num_Corre:        [''],
        Id_Num:        [0],
        nlote:        [''],
        nhilo:         [''],
        nconos:         [''],
        npesobruto:        [''],
        Cod_Ubicacion:        [''],
        npesoneto:        [''],
        
      });

     }


     @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngOnInit(): void {
      
      this.nlote=this.data.CodLote
      console.log(this.data.CodLote)
      this.BuscarLoteUbicaciones();
    //  if(this.nNumCorre != undefined){
    //      this.CompletarDatosRegistroBulto()
    //   }
      // this.Id_Num=this.data.Id_Num
      // this.Cod_Ubicacion=this.data.Cod_Ubicacion
    }



    
    BuscarLoteUbicaciones(){
      
      this.LecturaBultosAlmacenService.showBultoDato('',
      this.nlote).subscribe(
        (result: any) => {
          if (result[0].Respuesta == undefined) {
            //console.log(result)
            this.dataSource.data=result
          }else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
            }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
      )
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
   

  
    CompletarDatosRegistroBulto(){
      
      this.LecturaBultosAlmacenService.showBultoDato(
      this.nNumCorre,'').subscribe(
        (result: any) => {
          if (result[0].Respuesta == undefined) {
            //console.log(result)
            this.formulario.controls['nlote'].setValue(result[0].lote)
            this.formulario.controls['nhilo'].setValue(result[0].Hilo)
          }else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
              
            }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
      )
    }
  


    MostrarResultadosBultos() {
      this.LecturaBultosAlmacenService.showUbicacionCod(this.Cod_Accion='E',this.Cod_Ubicacion).subscribe(
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
  
  
  
  }
  