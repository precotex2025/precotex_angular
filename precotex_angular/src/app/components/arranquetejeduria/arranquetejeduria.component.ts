import {Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { ExceljsService } from 'src/app/services/exceljs.service';
import { ArranquetejeduriaService } from 'src/app/services/arranquetejeduria.service';
import { DialogCreararranqueComponent } from './dialog-creararranque/dialog-creararranque.component';
import { data } from 'jquery';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

interface data_det {
  Id: string
  Cod_Ordtra: string
  Oc: string
  Num_Secuencia: string
  Fecha_Mov : string
  Kg_Pro : string
  Und_Pro : string
  Cod_Proveedor   : string
  Flg_Status: string
}

@Component({
  selector: 'app-arranquetejeduria',
  templateUrl: './arranquetejeduria.component.html',
  styleUrls: ['./arranquetejeduria.component.scss']
})
export class ArranquetejeduriaComponent implements OnInit {

  Estado: '';
  NumeroVersion: number = 0;

  displayedColumns_cab: string[] = [
    'Accion',
    'Id',
    'Cod_Ordtra',
    'Oc',
    'Num_Secuencia',
    'Fecha_Mov',
    'Kg_Pro',
    'Und_Pro',
    'Cod_Proveedor',
    'Flg_Status',
    //'Flg_Status_Arranque',
    'Fecha_Inicio'
  ]

  formulario = this.formBuilder.group({
    Filtro:  [''],
  });

  dataSource: MatTableDataSource<data_det>;
  dataResult:Array<any> = [];

  constructor(
    private formBuilder       : FormBuilder             , 
    private matSnackBar       : MatSnackBar             , 
    public  dialog            : MatDialog               , 
    private SpinnerService    : NgxSpinnerService       , 
    private arranquetejeduria : ArranquetejeduriaService,
    private toastr            : ToastrService           ,
  ) 
  {this.dataSource = new MatTableDataSource(); }


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  Flg_Habilitar_Detalle = true
  DisableSaveButtonAgregar = false
  DisableSaveButtonEditar = false

  ngOnInit(): void {

    this.MostrarCabeceraFabricC()
  }


  MostrarCabeceraFabricC() {

    this.SpinnerService.show();
    this.arranquetejeduria.MostrarPendientes().subscribe(
      (result: any) => {
        if (result.length > 0) {

          this.Estado=result[0].ESTADO
          this.dataSource.data = result
          this.dataResult = result;

          if (result[0].ESTADO=='0'){
            this.DisableSaveButtonAgregar = false;
            this.DisableSaveButtonEditar = true;
          }

          if (result[0].ESTADO=='1'){
            this.DisableSaveButtonAgregar = true;
            this.DisableSaveButtonEditar = false;
          }
          
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = [];
          
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
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


  openDialogModificar(data) {

    const Cod_Ordtra    : string = data.OT;
    const Num_Secuencia : number = data.SEC;   
    const Talla         : string = data.TALLA;

    /*Generamos*/
    if (data.ESTADO == 0){

      //Genera version
      this.getGeneraVersionArranque(data, Cod_Ordtra, Num_Secuencia, Talla);      
        
    }else{
      
        //Validamos si esta aprobado
        if (data.FLG_APROBADO == "S"){
          //Verifica si obtiene version
          this.getObtieneVersionArranque(data, Cod_Ordtra, Num_Secuencia);
        }else{

          Swal.fire({
            title: '¿Desea realizar nueva calificación del arranque?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
              //genera version
                this.getGeneraVersionArranque(data, Cod_Ordtra, Num_Secuencia, Talla);
            }else{
                //Verifica si obtiene version
                this.getObtieneVersionArranque(data, Cod_Ordtra, Num_Secuencia);
            }
          });          

        }
    }

    return
    let dialogRef = this.dialog.open(DialogCreararranqueComponent, {
      disableClose: false,
      panelClass: 'my-class',
      data: {
        boton:'ARRANQUE',
        title:'ARRANQUE DE TEJEDURIA',
        Opcion:'I',
        Datos: data
            }
      ,minWidth: '46vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.MostrarCabeceraFabricC();


    })

  }

  Filtro(event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getGeneraVersionArranque(data, Cod_Ordtra: string, Num_Secuencia: number, Cod_Talla: string) {
    this.SpinnerService.show();
    this.arranquetejeduria.getGeneraVersionHojasArranque(Cod_Ordtra, Num_Secuencia, Cod_Talla).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){

            //Obtiene Version 
            this.NumeroVersion = response.elements[0].version;

            //Abre el dialog
            let dialogRef = this.dialog.open(DialogCreararranqueComponent, {
              disableClose: true,
              panelClass: 'my-class',
              data: {
                boton   :'ARRANQUE'             ,
                title   :'ARRANQUE DE TEJEDURIA',
                Opcion  :'I'                    ,
                Datos   : data                  ,
                Version : this.NumeroVersion    ,
                    }
              ,minWidth: '46vh'
            });
            dialogRef.afterClosed().subscribe(result => {
              this.MostrarCabeceraFabricC();
            })      
            
            this.SpinnerService.hide();
          }
          else{
            this.SpinnerService.hide();
            this.dataSource.data = [];
          }
        }        
      },
      error: (error) => {
        this.SpinnerService.hide();
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
        });
      }
    });      
  }  
  
  getObtieneVersionArranque(data, Cod_Ordtra: string, Num_Secuencia: number) {
    this.SpinnerService.show();
    this.arranquetejeduria.getObtenerVersionHojasArranque(Cod_Ordtra, Num_Secuencia).subscribe({
      next: (response: any)=> {
        if(response.success){

          const iVersion: number = response.elements[0].version;
          if (iVersion > 0){
            //Tiene version 
            this.NumeroVersion = response.elements[0].version;
          }
          else{
            this.NumeroVersion = 0;
          }

          //Abre el dialog
          let dialogRef = this.dialog.open(DialogCreararranqueComponent, {
            disableClose: false,
            panelClass: 'my-class',
            data: {
              boton   :'ARRANQUE'             ,
              title   :'ARRANQUE DE TEJEDURIA',
              Opcion  :'U'                    ,
              Datos   : data                  ,
              Version : this.NumeroVersion    ,
                  }
            ,minWidth: '46vh'
          });
        
          dialogRef.afterClosed().subscribe(result => {
            this.MostrarCabeceraFabricC();
          })          

          this.SpinnerService.hide();
        }        
      },
      error: (error) => {
        this.SpinnerService.hide();
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
        });
      }
    });      
  }  

}
