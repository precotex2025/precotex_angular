import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';

import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DespachoTelaCrudaService {
 
  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;

  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  ListarDespachoService(sFec_Despacho: string, sCod_OrdTra: string) {

    if (!_moment(sFec_Despacho).isValid()) {
      sFec_Despacho = '01/01/1900';
    }

    sFec_Despacho = _moment(sFec_Despacho.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_listar_despacho_tela_cruda.php?Fec_Despacho=${sFec_Despacho}&Cod_OrdTra=${sCod_OrdTra}&Cod_Usuario=${this.sCod_Usuario}`);
  }


  GenerarMovimiento(sCod_OrdTra: string, sCod_Barras: string) {

    return this.http.get(`${this.baseUrl}/app_man_despacho_tela_cruda_genera_mov.php?Cod_OrdTra=${sCod_OrdTra}&Cod_Barras=${sCod_Barras}&Cod_Usuario=${this.sCod_Usuario}`);

  }

  LecturarBulto(sAccion: string, sCod_Almacen: string, sNum_Movstk: string, sCod_Barras: string) {

    return this.http.get(`${this.baseUrl}/app_man_despacho_tela_cruda_lectura.php?Accion=${sAccion}&Cod_Almacen=${sCod_Almacen}&Num_Movstk=${sNum_Movstk}&Cod_Barras=${sCod_Barras}&Cod_Usuario=${this.sCod_Usuario}`);

  }

  MovimientoDespachoService(sNum_Movstk: string) {

    return this.http.get(`${this.baseUrl}/app_movimiento_despacho_tela_cruda.php?Num_Movstk=${sNum_Movstk}&Cod_Usuario=${this.sCod_Usuario}`);
  }
  
}
