import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { startWith, map, Observable } from 'rxjs';
import { LiquidacionCorteService } from '../../services/liquidacion-corte.service';
import { GlobalVariable } from '../../VarGlobals'; //<==== this one

import { Router } from '@angular/router';
//verListaLiquidacionCorte

interface data {
  Cod_op: string
  Cod_Grupo: string
}

interface Food {
  value: string;
  viewValue: string;
}

interface data_det {
  Codigo: string,
  Descripcion: string,
  Tipo_de_Prenda: string,
  comentario1: string,
  Grupo: string,
  Est_Cli: string,
  Grado_Dificultad: string,

}

@Component({
  selector: 'app-operatividad-ficha-tecnica',
  templateUrl: './operatividad-ficha-tecnica.component.html',
  styleUrls: ['./operatividad-ficha-tecnica.component.scss']
})
export class OperatividadFichaTecnicaComponent implements OnInit {

  foods: Food[] = [
    { value: 'OP', viewValue: 'Búsqueda por OP' },
    { value: 'ES', viewValue: 'Búsqueda por Estilo' },
  ];


  //'COD_TIPORDTRA', 'COD_ALMACEN','PARTIDA',
  displayedColumns: string[] = [
    'Codigo',
    'Descripcion',
    'Tipo_de_Prenda',
    'comentario1',
    'Grupo',
    'Est_Cli',
    'Grado_Dificultad',
    'Acciones'
  ]
  dataSource: MatTableDataSource<data_det>;

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private _router: Router,
    private despachoTelaCrudaService: LiquidacionCorteService) { this.dataSource = new MatTableDataSource(); }

  formulario = this.formBuilder.group({ bus_opcion: ['ES'], bus_factor: [''], bus_empresa: ['001'] })

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

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

  CargarLista() {
    //let fec_despacho = this.formulario.value['Fec_Registro'];
    let bus_opcion = this.formulario.get('bus_opcion').value;
    let bus_factor = this.formulario.get('bus_factor').value;
    let bus_empresa = this.formulario.get('bus_empresa').value;
    this.despachoTelaCrudaService.busquedaOperatividadFicha(bus_opcion, bus_factor, bus_empresa).subscribe(
      (result: any) => {
        //this.data_det = result
        console.log(result);
        if (result) {
          this.dataSource.data = result
          this.matSnackBar.open('DATOS ENCONTRADOS', 'Cerrar', {
            duration: 1500,
          })
        }else{
          this.matSnackBar.open('DATOS NO ENCONTRADOS', 'Cerrar', {
            duration: 1500,
          })
        }


      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

  }

  buscarReporteControlVehiculos() {
  }
  generateExcel() {
  }
  clearDate(event) {
    event.stopPropagation();

  }


  openDialog(data) {

    let datos = Object.assign({}, data, this.formulario.value)
    this._router.navigate(['DetallesOperatividadFicha'], {skipLocationChange:true, queryParams: datos});
  }



  verAvances() {

  }

  verRatioConsumo() {

  }

  validarOC(event) {
    var cod_op = event.target.value;
    if (cod_op.length == 5) {
      this.CargarLista();
    }
  }

}
