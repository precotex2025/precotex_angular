import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from 'src/app/VarGlobals';
import * as _moment from 'moment';
import { param } from 'jquery';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReporteNCService {

  baseUrlTinto = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });
  constructor(private http: HttpClient) { }

  getListarRegistro(Rep_ID: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Rep_ID", Rep_ID)
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getListarRegistro', { headers, params });
  }

  getListarPlantas(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getListarPlantas', {headers});
  }

  getListarClasificaciones(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getListarClasificaciones', {headers});
  }

  getListarDatosResolvedor(Rep_ID: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Rep_ID", Rep_ID);
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getListarDatosResolvedor', { headers, params });
  }

  getListarEstados(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getListarEstados', {headers});
  }

  postRegistrarReporteNC(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxReporteNC/postRegistrarReporteNC', data, {headers});
  }

  patchActualizarEstado(data: any){
    const headers = this.Header;
    return this.http.patch(this.baseUrlTinto + 'TxReporteNC/patchActualizarEstado', data, {headers});
  }
  
  patchActualizarReporteNC(data: any){
    const headers = this.Header;
    return this.http.patch(this.baseUrlTinto + 'TxReporteNC/patchActualizarReporteNC', data, {headers});
  }

  patchActualizarReporteNCOriginal(data: any){
    const headers = this.Header;
    return this.http.patch(this.baseUrlTinto + 'TxReporteNC/patchActualizarReporteNC', data, {headers});
  }



}