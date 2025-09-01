import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from '../../VarGlobals';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemorandumGralService {
  baseUrlTinto  = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });
  constructor(private http: HttpClient) { }

  getObtieneInformacionMemorandum(FecIni, FecFin, NumMemo: string, codUsuario: string, CodPlantaGarita: string){


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
    params = params.append('NumMemo', NumMemo);    
    params = params.append('codUsuario', codUsuario);
    params = params.append('CodPlantaGarita', CodPlantaGarita)

    return this.http.get(this.baseUrlTinto + 'TxProcesoMemorandum/getObtieneInformacionMemorandum', { headers, params });
  }  

  postProcesoMntoMemorandum(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxProcesoMemorandum/postProcesoMntoMemorandum', data, { headers })
  }
  
  getPlantas(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxProcesoMemorandum/getPlantas', { headers });
  }    

  getMateriales(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxProcesoMemorandum/getMateriales', { headers });
  }    

  getTipoMemorandum(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxProcesoMemorandum/getTipoMemorandum', { headers });
  }    
  
  getUsuario(Cod_Trabajador, Tip_Trabajador){

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_Trabajador', Cod_Trabajador);
    params = params.append('Tip_Trabajador', Tip_Trabajador);

    return this.http.get(this.baseUrlTinto + 'TxProcesoMemorandum/getUsuario', { headers, params });
  }  

  getMotivos(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxProcesoMemorandum/getMotivoMemorandum', { headers });
  } 
  
  getObtieneDetalleMemorandumByNumMemo(NumMemo){

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('NumMemo', NumMemo);

    return this.http.get(this.baseUrlTinto + 'TxProcesoMemorandum/getObtieneDetalleMemorandumByNumMemo', { headers, params });
  }    

  postAvanzaEstadoMemorandum(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxProcesoMemorandum/postAvanzaEstadoMemorandum', data, { headers })
  }  

  getObtenerPermisosMemorandum(sCodUsuario, sNumMemo){

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('sCodUsuario', sCodUsuario);
    params = params.append('sNumMemo', sNumMemo);

    return this.http.get(this.baseUrlTinto + 'TxProcesoMemorandum/getObtenerPermisosMemorandum', { headers, params });
  }   
  
  getObtenerRolUsuarioMemorandum(sCodUsuario, sNumMemo){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('sCodUsuario', sCodUsuario);
    params = params.append('sNumMemo', sNumMemo);

    return this.http.get(this.baseUrlTinto + 'TxProcesoMemorandum/getObtenerRolUsuarioMemorandum', { headers, params });
  }    
  
  postRevertirEstadoMemorandum(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxProcesoMemorandum/postRevertirEstadoMemorandum', data, { headers })
  }  

  getHistorialMovimientoMemorandum(sNumMemo){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('sNumMemo', sNumMemo);

    return this.http.get(this.baseUrlTinto + 'TxProcesoMemorandum/getHistorialMovimientoMemorandum', { headers, params });
  }

  postDevolverMemorandum(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxProcesoMemorandum/postDevolverMemorandum', data, { headers })
  }

  getObtenerTipoUsuarioMemorandum(sCodUsuario){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('sCodUsuario', sCodUsuario);

    return this.http.get(this.baseUrlTinto + 'TxProcesoMemorandum/getObtenerInfoUsuarioMemorandum', { headers, params });
  }      
  
}
