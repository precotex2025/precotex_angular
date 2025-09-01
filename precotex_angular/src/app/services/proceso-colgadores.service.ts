import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ProcesoColgadoresService {
  baseUrlTinto  = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });
  constructor(private http: HttpClient) { }

  getObtieneInformacionTelaColgador(Cod_Tela: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_Tela', Cod_Tela);
    return this.http.get(this.baseUrlTinto + 'TxProcesoColgadorRegistro/getObtieneInformacionTelaColgador', { headers, params });
  }  

  getObtieneInformacionRutaColgador(Cod_Tela: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_Tela', Cod_Tela);
    return this.http.get(this.baseUrlTinto + 'TxProcesoColgadorRegistro/getObtieneInformacionRutaColgador', { headers, params });
  }    

  getObtieneInformacionClienteColgador(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxProcesoColgadorRegistro/getObtieneInformacionClienteColgador', { headers });
  }  

  postProcesoMntoColgador(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxProcesoColgadorRegistro/postProcesoMntoColgador', data, { headers })
  }

  postPrintQRCode(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'HelpCommon/postPrintQRCode', data, { headers })
  }

  getListadoColgadoresBandeja(FecIni, FecFin, Cod_Tela: string){

    if (!_moment(FecIni).isValid()) {
      FecIni = '';
    } else {
      FecIni = _moment(FecIni.valueOf()).format('MM/DD/YYYY');
    }

    if (!_moment(FecFin).isValid()) {
      FecFin = '';
    } else {
      FecFin = _moment(FecFin.valueOf()).format('MM/DD/YYYY');
    }

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('FecIni', FecIni);
    params = params.append('FecFin', FecFin);
    params = params.append('Cod_Tela', Cod_Tela);    

    return this.http.get(this.baseUrlTinto + 'TxProcesoColgadorRegistro/getListadoColgadoresBandeja', { headers, params });
  }   
  
  getObtieneInformacionTelaColgadorDet(Id_Tx_Colgador_Registro_Cab: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Id_Tx_Colgador_Registro_Cab', Id_Tx_Colgador_Registro_Cab);
    return this.http.get(this.baseUrlTinto + 'TxProcesoColgadorRegistro/getObtieneInformacionTelaColgadorDet', { headers, params });
  }  

  // Servicios tipos de Ubicaciones
  getListadoTipoUbicacionColgador(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxUbicacionColgador/getListadoTipoUbicacionColgador', { headers });
  }  

  getListadoTipoFamTela(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxUbicacionColgador/getListadoTipoFamTela', { headers });
  }  

  getObtenerCorrelativo(Id_Tipo_Ubicacion_Colgador: number, Cod_FamTela: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Id_Tipo_Ubicacion_Colgador', Id_Tipo_Ubicacion_Colgador);
    params = params.append('Cod_FamTela', Cod_FamTela);
    return this.http.get(this.baseUrlTinto + 'TxUbicacionColgador/getObtenerCorrelativo', { headers, params });
  }  

  postCrudUbicacionColgador(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxUbicacionColgador/postCrudUbicacionColgador', data, { headers })
  }  

  postPrintQRCode2(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'HelpCommon/postPrintQRCode2', data, { headers })
  }  

  getListadoUbicacionColgador(FecIni, FecFin, Id_Tipo_Ubicacion_Colgador: number){
    
    if (!_moment(FecIni).isValid()) {
      FecIni = '';
    } else {
      FecIni = _moment(FecIni.valueOf()).format('MM/DD/YYYY');
    }

    if (!_moment(FecFin).isValid()) {
      FecFin = '';
    } else {
      FecFin = _moment(FecFin.valueOf()).format('MM/DD/YYYY');
    }

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('FecIni', FecIni);
    params = params.append('FecFin', FecFin);
    params = params.append('Id_Tipo_Ubicacion_Colgador', Id_Tipo_Ubicacion_Colgador);    

    return this.http.get(this.baseUrlTinto + 'TxUbicacionColgador/getListadoUbicacionColgador', { headers, params });
  } 
  
  //UBICACIONES Y REUBICACIONES DE COLGADORES
  getObtenerUbicacionColgadorQR(CodigoBarra: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('CodigoBarra', CodigoBarra);
    return this.http.get(this.baseUrlTinto + 'TxUbicacionColgador/getObtenerUbicacionColgadorQR', { headers, params });
  }  

  postCrudUbicacionColgadorItems(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxUbicacionColgador/postCrudUbicacionColgadorItems', data, { headers })
  }  

  getObtenerUbicacionColgadorById(Id_Tx_Ubicacion_Colgador: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Id_Tx_Ubicacion_Colgador', Id_Tx_Ubicacion_Colgador);
    return this.http.get(this.baseUrlTinto + 'TxUbicacionColgador/getObtenerUbicacionColgadorById', { headers, params });
  }    

  getListadoTotalColgadoresxTipoUbicaciones(FecCrea: Date){
    const headers = this.Header;
    const fechaActual = new Date();
    
    let params = new HttpParams();
    if (!_moment(FecCrea).isValid()) {
      params = params.append('FecCrea', _moment(fechaActual).format('YYYY-MM-DD'));
    }else{
      params = params.append('FecCrea', _moment(FecCrea).format('YYYY-MM-DD'));
    }

    return this.http.get(this.baseUrlTinto + 'TxUbicacionColgador/getListadoTotalColgadoresxTipoUbicaciones', { headers, params });
  }      

  getListadoColgadoresxUbicacion(Id_Tx_Ubicacion_Colgador: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Id_Tx_Ubicacion_Colgador', Id_Tx_Ubicacion_Colgador);
    return this.http.get(this.baseUrlTinto + 'TxUbicacionColgador/getListadoColgadoresxUbicacion', { headers, params });
  }     

  getListadoTotalColgadoresxCodigoBarra(CodigoBarra: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('CodigoBarra', CodigoBarra);
    return this.http.get(this.baseUrlTinto + 'TxUbicacionColgador/getListadoTotalColgadoresxCodigoBarra', { headers, params });
  }   
  
  //Ubicacion de cajas
  getListadoUbicacioFisica(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxUbicacionColgador/getListadoUbicacioFisica', { headers });
  }  

  getObtenerInformacionTotalCajasxUbicacion(Id_Tx_Ubicacion_Fisica: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Id_Tx_Ubicacion_Fisica', Id_Tx_Ubicacion_Fisica);
    return this.http.get(this.baseUrlTinto + 'TxUbicacionColgador/getObtenerInformacionTotalCajasxUbicacion', { headers, params });
  }   

  getObtenerInformacionCajasxUbicacion(Id_Tx_Ubicacion_Fisica: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Id_Tx_Ubicacion_Fisica', Id_Tx_Ubicacion_Fisica);
    return this.http.get(this.baseUrlTinto + 'TxUbicacionColgador/getObtenerInformacionCajasxUbicacion', { headers, params });
  }    

  getReporteColgadoresGralDetallado(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxUbicacionColgador/getReporteColgadoresGralDetallado', { headers });
  } 

  postProcesoEliminarColgador(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxProcesoColgadorRegistro/postProcesoEliminarColgador', data, { headers })
  }

}
