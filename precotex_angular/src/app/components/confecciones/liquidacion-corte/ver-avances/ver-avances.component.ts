import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { LiquidacionCorteService } from 'src/app/services/liquidacion-corte.service';

interface data {
  Cod_Usuario: string,
  Nom_usuario: string,
  Tip_Trabajador: string,
  Cod_Trabajador: string,
  Empresa: string,
  Flg_Activo: string,
  Fecha_Registro: string,

}
@Component({
  selector: 'app-ver-avances',
  templateUrl: './ver-avances.component.html',
  styleUrls: ['./ver-avances.component.scss']
})
export class VerAvancesComponent implements OnInit {
  cod_oc: string = '';
  tipo: string = '';
  displayedColumns: string[] = [];
  displayedColumns2: string[] = [];

  datos: Array<any> = [];
  colores: Array<any> = [];
  dataSource: MatTableDataSource<any>;
  constructor(private _router: Router, private route: ActivatedRoute,
    private matSnackBar: MatSnackBar, private despachoTelaCrudaService: LiquidacionCorteService,) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((res) => {
      console.log(res);
      if (res != null) {
        this.cod_oc = res['oc'];
        this.tipo = res['tipo'];
        this.getTablaAvance();
      }
    })
  }
  regresar() {
    this._router.navigate(['LiquidacionCorte']);
  }
  isSticky(buttonToggleGroup: MatButtonToggleGroup, id: string) {
    return (buttonToggleGroup.value || []).indexOf(id) !== -1;
  }
  getTablaAvance() {
    this.despachoTelaCrudaService.verCorteAvance(this.cod_oc, this.tipo).subscribe(
      (result: any) => {
        this.datos = result;
        this.colores = result;
        let newArray = [];
        this.datos.map(function (elm) {
          var keys = Object.keys(elm);
          let newObj = {};
          keys.map(element => {
            var texto = element.split('-');
            if (texto.length > 1) {
              var resultado = texto[1];
              Object.assign(newObj, { [resultado]: elm[element] });
            } else {
              var resultado = texto[0]
              if (resultado = 'NOM_CLIENTE') {
                Object.assign(newObj, { ['CLIENTE / CORTE']: elm['NOM_CLIENTE'] });
              }
              if (resultado = 'DES_PRESENT') {
                Object.assign(newObj, { ['PRESENTACION']: elm['DES_PRESENT'] });
              }
              if (resultado = 'COD_ESTCLI') {
                Object.assign(newObj, { ['ESTILO CLIENTE']: elm['COD_ESTCLI'] });
              }
              if (resultado = 'COD_GRUPOTEX') {
                Object.assign(newObj, { ['GRUPO TEXTIL']: elm['COD_GRUPOTEX'] });
              }
              if (resultado = 'TEMPORADA') {
                Object.assign(newObj, { ['TEMPORADA']: elm['TEMPORADA'] });
              }
              if (resultado = 'OP') {
                Object.assign(newObj, { ['OP']: elm['OP'] });
              }
              if (resultado = 'DESTINO') {
                Object.assign(newObj, { ['DESTINO']: elm['DESTINO'] });
              }
              if (resultado = 'DESCRIPCION') {
                Object.assign(newObj, { ['DESCRIPCION']: elm['DESCRIPCION'] });
              }
              if (resultado = 'FECHA') {
                Object.assign(newObj, { ['FECHA']: elm['FECHA'] });
              }
            }
          });
          newArray.push(newObj);
        });
        this.dataSource.data = newArray;
        this.displayedColumns2 = Object.keys(newArray[0])
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

}
