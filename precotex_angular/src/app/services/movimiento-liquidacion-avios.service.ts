import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';
import Integer from '@zxing/library/esm/core/util/Integer';

@Injectable({
  providedIn: 'root'
}) 
export class MovimientoLiquidacionAviosService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  MantMovimientoLiquidacionAviosService(data) {      
    return this.http.post(`${this.baseUrl}/app_Lg_Man_Liquidacion_Avios_Web_Post.php`,data);
  }

  MantMovimientoLiquidacionAviosCabService(data) 
  {  
    return this.http.post(`${this.baseUrl}/app_Lg_Man_Liquidacion_Avios_Web_Post.php`,data); 
  }
  
  MostrarPlantaService()
  {     
    return this.http.get(`${this.baseUrl}/app_Lg_Man_Planta_Web.php`);
  }
  
  BuscarEstiloOPService(
    OP: string
  )
  {     
    return this.http.get(`${this.baseUrl}/app_Lg_Man_Estilo_OP_Web.php?OP=${OP}`);
  }

  MantMovimientoLiquidacionAviosDetService(data) 
  {  
    return this.http.post(`${this.baseUrl}/app_Lg_Man_Liquidacion_Avios_Det_Web_Post.php`,data); 
  }
  
  BuscarDetalleAvios(data)
  {     
    return this.http.post(`${this.baseUrl}/app_Lg_Man_Liquidacion_Avios_Det_Web_Post.php`,data); 
  }
 
  EliminarDetalleAvios(data) 
  {  
    return this.http.post(`${this.baseUrl}/app_Lg_Man_Liquidacion_Avios_Det_Web_Post.php`,data); 
  }
  cargarClienteService(sAbr: string, sCod:string,sCliente:string, sCod_Accion:string) {
    return this.http.get(`${this.baseUrl}/app_listar_cliente_abr_derivados.php?Abr=${sAbr}&Abr_Motivo=${sCod}&Nom_Cliente=${sCliente}&Cod_Accion=${sCod_Accion}`);
  }
}