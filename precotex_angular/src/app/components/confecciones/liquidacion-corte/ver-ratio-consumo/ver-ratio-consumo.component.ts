import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { LiquidacionCorteService } from 'src/app/services/liquidacion-corte.service';
import { GlobalVariable } from 'src/app/VarGlobals';
@Component({
  selector: 'app-ver-ratio-consumo',
  templateUrl: './ver-ratio-consumo.component.html',
  styleUrls: ['./ver-ratio-consumo.component.scss']
})
export class VerRatioConsumoComponent implements OnInit {
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
  getTablaAvance() {
    
    this.despachoTelaCrudaService.verCorteRatioConsumo(this.cod_oc, GlobalVariable.vusu, this.tipo).subscribe(
      (result: any) => {
        console.log(result);
        this.datos = result['data'];
        console.log(this.datos);
        // this.datos = result;
        // this.colores = result;
        // let newArray = [];
        // this.datos.map(function (elm) {
        //   var keys = Object.keys(elm);
        //   let newObj = {};
        //   keys.map(element => {
        //     var texto = element.split('-');
        //     if (texto.length > 1) {
        //       var resultado = texto[1];
        //       Object.assign(newObj, { [resultado]: elm[element] });
        //     } else {
        //       var resultado = texto[0]
        //       if (resultado = 'NOM_CLIENTE') {
        //         Object.assign(newObj, { ['CLIENTE']: elm['NOM_CLIENTE'] });
        //       }
        //       if (resultado = 'DES_PRESENT') {
        //         Object.assign(newObj, { ['PRESENTACION']: elm['DES_PRESENT'] });
        //       }
        //       if (resultado = 'COD_ESTCLI') {
        //         Object.assign(newObj, { ['ESTILO CLIENTE']: elm['COD_ESTCLI'] });
        //       }
        //       if (resultado = 'COD_GRUPOTEX') {
        //         Object.assign(newObj, { ['GRUPO TEXTIL']: elm['COD_GRUPOTEX'] });
        //       }
        //       if (resultado = 'TEMPORADA') {
        //         Object.assign(newObj, { ['TEMPORADA']: elm['TEMPORADA'] });
        //       }
        //       if (resultado = 'OP') {
        //         Object.assign(newObj, { ['OP']: elm['OP'] });
        //       }
        //       if (resultado = 'DESTINO') {
        //         Object.assign(newObj, { ['DESTINO']: elm['DESTINO'] });
        //       }
        //       if (resultado = 'DESCRIPCION') {
        //         Object.assign(newObj, { ['DESCRIPCION']: elm['DESCRIPCION'] });
        //       }
        //       if (resultado = 'FECHA') {
        //         Object.assign(newObj, { ['FECHA']: elm['FECHA'] });
        //       }
        //     }
        //   });
        //   newArray.push(newObj);
        // });
        this.dataSource.data = result['datos'];
        this.displayedColumns2 = Object.keys(result['datos'][0]);

        this.displayedColumns2 = this.displayedColumns2.filter(element => {
          return element != '4' && element != 'ORDEN' && element != 'LONGITUD_TIZADO' && element != 'EFICIENCIA'
        });
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

}
