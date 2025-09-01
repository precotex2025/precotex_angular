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
import { DialogEliminarComponent } from '../../../dialogs/dialog-eliminar/dialog-eliminar.component';
export interface PeriodicElement {
  id: string;
  fec_registro: string;
  Trabajador: string;
  Cod_Trabajador: string;
  Tip_Trabajador: string;
  Des_Ocupacion: string;
  Rh_Area: string;
  Periodo: string;
  Dias: string;
  Nro_DNI: string;
  fec_inicio: string;
  fec_fin: string;
  Cod_Usuario: string;
  Flg_Estado: string;
  Cod_Empresa: string;
  Observaciones: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

];
@Component({
  selector: 'app-historial-vacaciones-recursos',
  templateUrl: './historial-vacaciones-recursos.component.html',
  styleUrls: ['./historial-vacaciones-recursos.component.scss']
})
export class HistorialVacacionesRecursosComponent implements OnInit {
  fecha: string = '';
  resultado: boolean = false;


  data: any = [];

  sede: string = '';


  displayedColumns: string[] = [
    'fec_registro',
    'Trabajador',
    'Nro_DNI',
    'Cod_Trabajador',
    'Tip_Trabajador',
    'Periodo',
    'Dias',
    'fec_inicio',
    'fec_fin',
    'Cod_Usuario',
    'Observaciones',
    'acciones'
  ];
  Nro_DNI:string = '';
  deshabilitar: boolean = false;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

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
    private despachoTelaCrudaService: RegistroPermisosService,
    private _router: Router,
    @Inject(DOCUMENT) document: any,
    private dialog: MatDialog) {

      var cadena = document.location.href;
      console.log(document.location.href);
  
      var nueva = cadena.substring(0, 9);
      console.log(nueva);
  
      if (nueva == 'http://lo' || nueva == 'http://19') {
        this.local = true;
      } else {
        this.local = false;
      }
  
    
  }

  ngOnInit(): void {
    this.cargarEmpresas();
  }
  ngAfterViewInit(): void {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  onProcesoSelectedBultos(data_det_2: PeriodicElement) {

  }

  limpiarValor() {

  }

  eliminarVacaciones(element) {
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        let Flg_Estado = '';

        this.despachoTelaCrudaService.updateEstadoVacaciones('D', Flg_Estado, element.id).subscribe((result: any) => {
          if (result[0].status == 1) {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
              duration: 1500,
            })
            this.actualizarPermiso();
          }

        },
          (err: HttpErrorResponse) => {
            this.resultado = false;
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            })
          })
      }

    })
  }
  setAll(checked, id){
    console.log(checked);
    console.log(id);
    let Flg_Estado = '';
    if(checked){
      Flg_Estado = 'A'
    }else{
      Flg_Estado = 'P'
    }
    this.despachoTelaCrudaService.updateEstadoVacaciones('U', Flg_Estado, id).subscribe((result: any) => {
      if (result[0].status == 1) {
        this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
          duration: 1500,
        })
        this.actualizarPermiso();
      }

    },
      (err: HttpErrorResponse) => {
        this.resultado = false;
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })

  }

  imprimirPapeleta(element) {
    var Opcion = 'O';
    var id = element.id;
    var Flg_Estado = '';

    if (this.local == true) {
      window.open(`http://192.168.1.36/ws_android/app_Rh_Imprimir_ficha_vacaciones.php?Opcion=O&Flg_Estado=&id=${id}`, '_blank');
    } else {
      window.open(`https://gestion.precotex.com/ws_android/app_Rh_Imprimir_ficha_vacaciones.php?Opcion=O&Flg_Estado=&id=${id}`, '_blank');
    }
  }
  cargarEmpresas() {
    this.despachoTelaCrudaService.getEmpresasVacaciones('E', GlobalVariable.vcodtra, GlobalVariable.vtiptra, '').subscribe((result: any) => {
      if (result != null) {
        this.dataEmpresas = result;
      }

    },
      (err: HttpErrorResponse) => {
        this.resultado = false;
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })

  }
  CargarLista() {
    
  }
  actualizarPermiso() {
    if(this.Cod_Empresa != ''){
      let form = {
        opcion: 'R',
        periodos: [],
        observaciones: '',
        cod_empresa: this.Cod_Empresa,
        Cod_Usuario: GlobalVariable.vusu
      }
      this.despachoTelaCrudaService.grabarDatosVacaciones(form).subscribe((result: any) => {
        if (result != null) {
          this.dataSource.data = result;
        }
      },
        (err: HttpErrorResponse) => {
          this.dataSource.data = [];
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
      })
    }else{
      this.matSnackBar.open('DEBES SELECCIONAR LA EMPRESA', 'Cerrar', {
        duration: 1500,
      })
    }
    
  }

  cargarCompletados() {
    
  }
}

