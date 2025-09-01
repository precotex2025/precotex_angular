import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';
 
@Injectable({
  providedIn: 'root'
})
export class EstilosLiquidarService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;
  
 constructor(private http: HttpClient) { }


 UP_RPT_SITUACION_ORDENES_INSPECCION_PANTALLA_FINAL(Cod_Accion: string ){
    
    return this.http.get(`${this.baseUrl}/app_UP_RPT_SITUACION_ORDENES_INSPECCION_PANTALLA_FINAL.php?Accion=${Cod_Accion}`);                                                
  }

  CO_SALDO_DEVOLVER_INDICADOR(){
    
    return this.http.get(`${this.baseUrl}/app_CO_Reporte_Saldo_Devolver_Indicador.php`);                                                
  }

  co_seguimiento_ocorte_pendientes_nuevo(){
    
    return this.http.get(`${this.baseUrl}/app_co_seguimiento_ocorte_pendientes_nuevo.php`);                                                
  }

  CF_PANTALLA_REPOSICIONES_WEB(){
    
    return this.http.get(`${this.baseUrl}/app_CF_PANTALLA_REPOSICIONES_WEB.php`);                                                
  }

  
  
  ActualizarIni(){
    
    return this.http.get(`${this.baseUrl}/app_ActualizarIni.php`);                                                
  }
}