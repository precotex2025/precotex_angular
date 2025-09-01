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
import { DialogCargarMostrarImgComponent } from './dialog-cargar-mostrar-img/dialog-cargar-mostrar-img.component';
import { ComercialService } from 'src/app/services/comercial.service';
import { DialogCrearImagenesComponent } from './dialog-crear-imagenes/dialog-crear-imagenes.component';
import { DialogTransferirImagenesComponent } from './dialog-transferir-imagenes/dialog-transferir-imagenes.component';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';

export interface PeriodicElement {
  ESTILO_PROPIO: string;
  DESC_ESTILO_PROPIO: string;
  ESTILO_CLIENTE: string;
  TIPO_PRENDA: string;
  GRUPO_TALLA: string;
}
interface Cliente {
  Cod_Cliente: string;
  Nom_Cliente: string;
  Abr_Cliente: string;
}

interface Temporada {
  Cod_TemCli: string;
  Nom_TemCli: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-comercial-carga-imagenes',
  templateUrl: './comercial-carga-imagenes.component.html',
  styleUrls: ['./comercial-carga-imagenes.component.scss']
})
export class ComercialCargaImagenesComponent implements OnInit {

  fecha: string = '';
  resultado: boolean = false;

  dataForExcel = [];
  data: any = [];

  sede: string = '';
  estilo: string = '';
  estilo_propio: string = '';

  listar_operacionCliente: any = [];
  displayedColumns: string[] = [
    'ESTILO_PROPIO',
    'DESC_ESTILO_PROPIO',
    'ESTILO_CLIENTE',
    'TIPO_PRENDA',
    'GRUPO_TALLA',
    'acciones'
  ];
  deshabilitar: boolean = false;

  listar_operacionTemporada: Temporada[] = [];


  oc: string = '';
  OP: string = '';
  Fecha_inicio = '';
  Fecha_Fin = '';
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  filtroOperacionCliente: Observable<Cliente[]> | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild('DniSearch') inputDni!: ElementRef;
  fecha_mes = '';
  sCod_Usuario = GlobalVariable.vusu

  Cod_Empresa: string = '';
  dataEstilos: any = [];
  listar_estiloCliente: any = [];
  sCliente: any = '';
  sTemporada: any = '';
  local = false;
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private comercialService: ComercialService,
    private _router: Router,
    private exceljsService: ExceljsService,
    @Inject(DOCUMENT) document: any,
    private dialog: MatDialog) {
    //this.dataSource.data = ELEMENT_DATA;
  }
  ngOnInit(): void {
    this.CargarOperacionCliente();
    //this.cargarLista();
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    }, true);
  }
  ngAfterViewInit(): void {

  }

  searchEstilos(event){
    console.log(event);
    if(event != undefined){
      var search = event.term;
      if(search.length >= 3){
        this.comercialService.CC_BUSCAR_ESTILOCLIENTE(
          search
        ).subscribe(
          (result: any) => {
            console.log(result)
            this.SpinnerService.hide();
            if (result.length > 0) {
              this.listar_estiloCliente = result;
            } else {
              this.listar_estiloCliente = [];

              this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          })
      }else{
        console.log('debes ingresar al menos 3 caracteres');
      }
    }else{
      this.listar_estiloCliente = [];
      this.estilo = '';
    }
  }

  changeEstilo(event){
    if(event == undefined){
      this.listar_estiloCliente = [];
      this.estilo = '';
    }
  }

  cargarLista() {
    if (this.OP != '' || this.estilo != '' || this.estilo_propio != '' || (this.sCliente != '' && this.sTemporada != '')) {
      this.SpinnerService.show();
      this.dataEstilos = [];
      this.dataSource.data = [];
      this.comercialService.CargarEstilosAte(
        this.OP,
        this.estilo_propio,
        this.estilo,
        this.sCliente,
        this.sTemporada
      ).subscribe(
        (result: any) => {
          console.log(result)
          this.SpinnerService.hide();
          if (result.length > 0) {
            this.dataSource.data = result;
          } else {
            this.dataSource.data = [];
            this.matSnackBar.open("No se encontraron registros.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        })
    } else {
      this.matSnackBar.open("Debes ingresar un filtro de búsqueda.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  agregarNuevo(data) {
    console.log(data);
    let dialogRef = this.dialog.open(DialogCrearImagenesComponent,
      {
        disableClose: true,
        minWidth: '98%',
        minHeight: '95%',
        panelClass: 'my-class',
        data: {
          tipo: 2,
          data
        }
      });
  }

  editarOpcion(data) {
    let dialogRef = this.dialog.open(DialogCargarMostrarImgComponent,
      {
        disableClose: true,
        minWidth: '98%',
        minHeight: '95%',
        panelClass: 'my-class',
        data: {
          tipo: 2,
          data
        }
      });
    //dialogRef.afterClosed().subscribe(result => {
  }

  copiarImagenes(data) {
    let dialogRef = this.dialog.open(DialogTransferirImagenesComponent,
      {
        disableClose: true,
        minWidth: '60%',
        minHeight: '95%',
        maxWidth: '98%',
        panelClass: 'my-class',
        data: {
          data
        }
      });
  }

  CargarOperacionTemporada() {

    // console.log(this.formulario.get('sEstilo')?.value)
    // this.Cod_TemCli = ''
    // this.Cod_EstCli = this.formulario.get('sEstilo')?.value
    // this.defectosAlmacenDerivadosService.Cf_Busca_Derivado_TemporadaCliente(this.Cod_Cliente, this.Cod_EstCli).subscribe(
    //   (result: any) => {
    //     this.listar_operacionTemporada = result
    //   },
    //   (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  CambiarValorCliente(event) {
    console.log(event);
    if (event != undefined) {
      this.comercialService.buscarTempCliente(event.Cod_Cliente).subscribe(
        (result: any) => {
          this.listar_operacionTemporada = result
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    } else {
      this.listar_operacionTemporada = [];
    }

  }

  CargarOperacionCliente() {

    this.listar_operacionCliente = [];
    var Abr = ''
    var Abr_Motivo = ''
    var Nom_Cliente = ''
    var Cod_Accion = 'L'
    this.comercialService.mantenimientoDerivadosService(Abr, Abr_Motivo, Nom_Cliente, Cod_Accion).subscribe(
      (result: any) => {
        this.listar_operacionCliente = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
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

