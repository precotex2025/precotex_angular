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

export interface PeriodicElement {
  IdMerma: string;
  Fase: string;
  Cliente: string;
  OP_SEC: string;
  OC: string;
  Partida: string;
  Estilo: string;
  Color: string;
  Merma_Declarada: string;
  Merma_Fisica: string;
  Dif: string;
  Cod_Auditor_Calidad: string;
  Fecha: string;
  Item: string;
  Turno:string;
  Des_Defecto:string;
  Defecto_Principal: string;
  Prendas_Mercado_Local:string;
  Valor_Mercado:string;
  Prendas_Recuperadas: string;
  Valor_Recuperadas:string;
  Notas:string;
  Fecha_Revision:string;
  Validacion:string;
  Des_Validacion:string;
  Peso:string;
  Cod_Auditor_Control_Interno:string;
  Defecto_Interno:string;
}


const ELEMENT_DATA: PeriodicElement[] = [

];
@Component({
  selector: 'app-registro-merma',
  templateUrl: './registro-merma.component.html',
  styleUrls: ['./registro-merma.component.scss']
})
export class RegistroMermaComponent implements OnInit {

  fecha: string = '';
  resultado: boolean = false;


  data: any = [];

  sede: string = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  displayedColumns: string[] = [
    'Fecha',
    'Item',
    'Fase',
    'Turno',
    'Cliente',
    'OP_SEC',
    'OC',
    'Partida',
    'Estilo',
    'Color',
    'Des_Defecto',
    'Merma_Declarada',
    'Merma_Fisica',
    'Dif',
    'Cod_Auditor_Calidad',
    'Fecha_Revision',
    'Des_Validacion',
    'Peso',
    'Cod_Auditor_Control_Interno',
    'Defecto_Interno',
    'acciones'
  ];
  
  deshabilitar: boolean = false;

  oc:string = '';
  OP:string = '';
  Fecha_inicio = '';
  Fecha_Fin = '';
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataForExcel = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild('DniSearch') inputDni!: ElementRef;
  fecha_mes = '';
  sCod_Usuario = GlobalVariable.vusu

  Cod_Empresa: string = '';
  dataEmpresas: any = [];

  local = false;
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private exceljsService: ExceljsService,
    private despachoTelaCrudaService: RegistroPermisosService,
    private _router: Router,
    @Inject(DOCUMENT) document: any,
    private dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.cargarLista();
  }
  ngAfterViewInit(): void {

  }

  cargarLista(){
    var fecha_start = this.range.get('start')?.value;
    var fecha_end = this.range.get('end')?.value;
    this.despachoTelaCrudaService.CF_Obtener_Lista_Merma(
      'L',
      this.oc,
      this.OP,
      fecha_start,
      fecha_end
    ).subscribe(
      (result: any) => {
        this.dataSource.data = result;
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  agregarNuevo(){
    let datos = {
      tipo: 1,
      Cabecera: 'Agregar Nuevo',
      boton: 'Guardar'
    }
    this._router.navigate(['AgregarRegistroMerma'], {skipLocationChange:true, queryParams: datos});
  }

  editarOpcion(data){

    let datos = {
      tipo: 2,
      Cabecera: 'Modificar Registro',
      boton: 'Actualizar'
    }

    var parametros = Object.assign({}, datos, data);
    this._router.navigate(['AgregarRegistroMerma'], {skipLocationChange:true, queryParams: parametros});
  }

  deleteOpcion(data){
    console.log(data.IdMerma);
    if(confirm('Esta seguro de eliminar el registro?')){

      this.SpinnerService.show();
      this.despachoTelaCrudaService.registroMermaPrendasOp(
        'D',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        data.IdMerma,
        ''
      ).subscribe(
        (result: any) => {
          if (result != false) {
            console.log(result);
            this.SpinnerService.hide();
            this.matSnackBar.open("Registro  Eliminado correctamente!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
            this.cargarLista();
          } else {
            this.matSnackBar.open("Ha ocurrido un error al eliminar el registro.!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
            this.SpinnerService.hide();
          }

        },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open( err.message, 'Cerrar', { duration: 1500, })
          this.SpinnerService.hide();
      })

    }
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
        title: 'REPORTE REGISTRO DE MERMA',
        data: this.dataForExcel,
        headers: Object.keys(this.dataSource.data[0])
      }

      this.exceljsService.exportExcel(reportData);
      //this.dataSource.data = [];
    }
  }

}

