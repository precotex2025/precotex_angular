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
//import { LiquidacionCorteService } from '../../services/liquidacion-corte.service';

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
  Version: string;
  Descr: string;
  Eficiencia_Costeo: string;
  Tipo_Version: string;
  Proto: string;
  Des_Tela_Cliente: string;
  Num_Id_Consumo: string;
  FLG_STATUS: string;
}
import { ActivatedRoute } from '@angular/router';
import { LiquidacionCorteService } from 'src/app/services/liquidacion-corte.service';

@Component({
  selector: 'app-detalles-operatividad-ficha',
  templateUrl: './detalles-operatividad-ficha.component.html',
  styleUrls: ['./detalles-operatividad-ficha.component.scss']
})
export class DetallesOperatividadFichaComponent implements OnInit {

  //'COD_TIPORDTRA', 'COD_ALMACEN','PARTIDA',
  displayedColumns: string[] = [
    'Version',
    'Descr',
    'Eficiencia_Costeo',
    'Tipo_Version',
    'Proto',
    'Des_Tela_Cliente',
    'Num_Id_Consumo',
    'FLG_STATUS',
    'Acciones'
  ];
  dataSource: MatTableDataSource<data_det>;

  data: any = {};
  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private _router: Router,
    private despachoTelaCrudaService: LiquidacionCorteService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((res) => {
      console.log(res);
      if (res != null) {
        this.data = res;
        this.CargarLista();
      }
    })
  }




  ngAfterViewInit() {

  }

  CargarLista() {
    //let fec_despacho = this.formulario.value['Fec_Registro'];
    let bus_opcion = this.data.bus_opcion;
    let bus_empresa = this.data.bus_empresa;
    let bus_factor = this.data.bus_factor;
    let txestilo = this.data.bus_factor;
    this.despachoTelaCrudaService.cargarDetallesOperatividad(bus_opcion, bus_factor, bus_empresa, txestilo).subscribe(
      (result: any) => {
        //this.data_det = result
        console.log(result);
        if (result) {
          this.dataSource.data = result
          this.matSnackBar.open('DATOS ENCONTRADOS', 'Cerrar', {
            duration: 1500,
          })
        } else {
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

  regresar() {
    this._router.navigate(['OperatividadFichaMuestreo']);
  }
  openDialog(data) {
    console.log(data.Version);
    let txempresa = this.data.bus_empresa;
    let txestilo = this.data.bus_factor;
    let txversion = data.Version;

    if (confirm("Desea poner operativo la version " + txversion + " del estilo " + txestilo + " ?")) {
      this.despachoTelaCrudaService.revertirOperatividadFicha(txempresa, txestilo, txversion).subscribe(
        (result: any) => {
          //this.data_det = result
          console.log(result);
          if (result == null) {
            this.dataSource.data = result
            this.matSnackBar.open('SE REVIRTIÓ CORRECTAMENTE', 'Cerrar', {
              duration: 1500,
            });
            this.CargarLista();
          } else {
            this.matSnackBar.open('FICHA TECNICA NO ASIGNADA .VERIFICAR', 'Cerrar', {
              duration: 1500,
            });
          }
  
  
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    }else{

    }

  }



  verAvances() {

  }

  verRatioConsumo() {

  }

}
