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
import { ActasAcuerdosService } from 'src/app/services/actas-acuerdos.service';
import { DialogActasParticipantesComponent } from './dialog-actas-participantes/dialog-actas-participantes.component';

export interface PeriodicElement {
  IdActa: string;
  Fecha: string;
  Descripcion: string;
  Sede: string;
  Area: string;
}


const ELEMENT_DATA: PeriodicElement[] = [

];
@Component({
  selector: 'app-actas-acuerdo',
  templateUrl: './actas-acuerdo.component.html',
  styleUrls: ['./actas-acuerdo.component.scss']
})
export class ActasAcuerdoComponent implements OnInit {
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
    'Descripcion',
    'Sede',
    'Area',
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
  Sede:any = '';
  Area:any = '';
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private exceljsService: ExceljsService,
    private actasAcuerdosService: ActasAcuerdosService,
    private _router: Router,
    @Inject(DOCUMENT) document: any,
    private dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.cargarLista();
    var cadena = document.location.href;

    var nueva = cadena.substring(0, 9);
    
    if (nueva == 'http://lo' || nueva == 'http://19') {
      this.local = true;
    } else {
      this.local = false;
    }
  }


  
  ngAfterViewInit(): void {

  }

  cargarLista(){
    var fecha_start = this.range.get('start')?.value;
    var fecha_end = this.range.get('end')?.value;
    this.actasAcuerdosService.MuestraAcuerdosService(
      'L',
      this.Sede,
      this.Area,
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
    this._router.navigate(['CrearActasAcuerdo'], {skipLocationChange:true, queryParams: datos});
  }

  detalleActa(data){
    let dialogRef = this.dialog.open(DialogActasParticipantesComponent, {
      disableClose: true,
      panelClass: 'my-class',
      data: {
        data: data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cargarLista();
    })
  }

  editarOpcion(data){
    let datos = {
      tipo: 2,
      Cabecera: 'Modificar Registro',
      boton: 'Actualizar'
    }
    var parametros = Object.assign({}, datos, data);
    this._router.navigate(['CrearActasAcuerdo'], {skipLocationChange:true, queryParams: parametros});
  }

  generarPdf(data){
    if (this.local == true) {
      window.open(`http://192.168.1.36/ws_android/app_AC_generar_pdf_Actas.php?IdActa=${data.IdActa}`, '_blank');
    } else {
      window.open(`https://gestion.precotex.com/ws_android/app_AC_generar_pdf_Actas.php?IdActa=${data.IdActa}`, '_blank');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

