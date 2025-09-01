import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionCorteService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  verListaLiquidacionCorte(cod_op: string, cod_grupo: string){

    return this.http.get(`${this.baseUrl}/app_listar_liquidacion_corte.php?Cod_op=${cod_op}&Cod_Grupo=${cod_grupo}`);
  }


  busquedaOperatividadFicha(bus_opcion: string, bus_factor: string, bus_empresa: string){

    return this.http.get(`${this.baseUrl}/app_Operatividad_Ficha_Muestreo.php?bus_opcion=${bus_opcion}&bus_factor=${bus_factor}&bus_empresa=${bus_empresa}`);
  }

  revertirOperatividadFicha(txempresa: string, txestilo: string, txversion: string){

    return this.http.get(`${this.baseUrl}/app_Revertir_Operatividad_Muestreo.php?txempresa=${txempresa}&txestilo=${txestilo}&txversion=${txversion}`);
  }

  cargarDetallesOperatividad(bus_opcion: string, bus_factor: string, bus_empresa: string, txestilo:string){

    return this.http.get(`${this.baseUrl}/app_Detalle_Operatividad_Ficha.php?bus_opcion=${bus_opcion}&bus_factor=${bus_factor}&bus_empresa=${bus_empresa}&txestilo=${txestilo}`);
  }


  verObservacionesLiquidacionCorte(cod_op: string, tipo: string){

    return this.http.get(`${this.baseUrl}/App_CO_LIQUIDACION_CORTE_OBSERVACIONES.php?Corte=${cod_op}&Tipo=${tipo}`);
  }

  verCorteAvance(cod_op: string, tipo:string){

    return this.http.get(`${this.baseUrl}/app_Corte_Mostrar_Avances.php?Corte=${cod_op}&Tipo=${tipo}`);
  }

  verCorteRatioConsumo(cod_op: string, usuario:string, tipo: string){

    return this.http.get(`${this.baseUrl}/app_Corte_Mostra_Ratio_Consumo.php?Corte=${cod_op}&Cod_Usuario=${usuario}&Tipo=${tipo}`);
  }

  

}
