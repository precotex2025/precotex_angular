import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { DialogCargarMostrarImgComponent } from '../comercial-carga-imagenes/dialog-cargar-mostrar-img/dialog-cargar-mostrar-img.component';
import { ComercialService } from 'src/app/services/comercial.service';


export interface PeriodicElement {
  Cliente: string;
  Estilo_Cliente: string;
  Estilo_Propio: string;
  OP: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

];

@Component({
  selector: 'app-comercial-img-huachipa',
  templateUrl: './comercial-img-huachipa.component.html',
  styleUrls: ['./comercial-img-huachipa.component.scss']
})
export class ComercialImgHuachipaComponent implements OnInit {
  fecha: string = '';
  resultado: boolean = false;

  dataForExcel = [];
  data: any = [];

  sede: string = '';
  estilo: string = '';
  estilo_propio: string = '';


  displayedColumns: string[] = [
    'ESTILO_PROPIO',
    'DESC_ESTILO_PROPIO',
    'ESTILO_CLIENTE',
    'TIPO_PRENDA',
    'GRUPO_TALLA',
    'acciones'
  ];
  deshabilitar: boolean = false;



  oc: string = '';
  OP: string = '';
  OT: string = '';
  Fecha_inicio = '';
  Fecha_Fin = '';
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild('DniSearch') inputDni!: ElementRef;
  fecha_mes = '';
  sCod_Usuario = GlobalVariable.vusu

  Cod_Empresa: string = '';
  dataEstilos: any = [];

  local = false;
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private comercialService: ComercialService,
    private _router: Router,
    private exceljsService: ExceljsService,
    @Inject(DOCUMENT) document: any,
    private dialog: MatDialog) {
  }
  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {

  }

  cargarLista() {
    if(this.OP != '' || this.estilo != '' || this.estilo_propio != '' || this.OT != ''){
      this.SpinnerService.show();
      this.dataEstilos = [];
      this.dataSource.data = [];
      this.comercialService.CargarEstilosHuachipa(
        this.OP,
        this.estilo,
        this.estilo_propio,
        this.OT
      ).subscribe(
        (result: any) => {
          console.log(result)
          this.SpinnerService.hide();
          if(result.length > 0){
            this.dataSource.data = result;
          }else{
            this.dataSource.data = [];
            this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })      
          }
          
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        })
    }else{
      this.matSnackBar.open("Debes ingresar un filtro de búsqueda.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  agregarNuevo() {

  }

  editarOpcion(data) {
    console.log(data)
    let dialogRef = this.dialog.open(DialogCargarMostrarImgComponent,
      {
        disableClose: true,
        minWidth:'98%',
        minHeight:'95%',
        panelClass: 'my-class',
        data: {
          data,
          tipo:2
        }
      });
    //dialogRef.afterClosed().subscribe(result => {
  }

  applyFilter() {
    console.log(this.dataSource.data)

    this.dataForExcel = [];
    if (this.dataSource.data.length == 0) {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {

      this.dataSource.data.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE CONTROL INTERNO DE MERMA',
        data: this.dataForExcel,
        headers: Object.keys(this.dataSource.data[0])
      }

      this.exceljsService.exportExcel(reportData);
      //this.dataSource.data = [];
    }
  }
}

