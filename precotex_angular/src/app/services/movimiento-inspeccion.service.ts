import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';


import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MovimientoInspeccionService {
  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;

  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  llenarColorPorOp(Cod_Accion:string, op: string) {
    return this.http.get(`${this.baseUrl}/app_llenarColorPorOp.php?Accion=${Cod_Accion}&Cod_OrdPro=${op}`);
  }

  generaMovimientoIngresoOpColor(op:string, color: string){
    return this.http.get(`${this.baseUrl}/app_generarMovimientoIngresoOpColor.php?Cod_OrdPro=${op}&Presentaciones=${color}&Cod_Usuario=${this.sCod_Usuario}`);
  }

}
 