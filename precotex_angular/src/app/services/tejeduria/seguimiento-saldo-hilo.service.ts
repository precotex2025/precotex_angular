import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from '../../VarGlobals';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoSaldoHiloService {
  baseUrlTinto  = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });
  constructor(private http: HttpClient) { }

  getListaOT_Programada(Cod_OrdProv, Tit_Hilado){

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_OrdProv', Cod_OrdProv);
    params = params.append('Tit_Hilado', Tit_Hilado);

    return this.http.get(this.baseUrlTinto + 'TjSeguimientoSaldoHilo/getListaOT_Programada', { headers, params });
  }  

  getListaOT_Terminada(Fecha, Fecha_Fin, Flg_Pendiente){

    if (!_moment(Fecha).isValid()) {
      Fecha = '';
    } else {
      Fecha = _moment(Fecha.valueOf()).format('MM/DD/YYYY');
    }    

    if (!_moment(Fecha_Fin).isValid()) {
      Fecha_Fin = '';
    } else {
      Fecha_Fin = _moment(Fecha_Fin.valueOf()).format('MM/DD/YYYY');
    }      

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Fecha', Fecha);
    params = params.append('Fecha_Fin', Fecha_Fin);
    params = params.append('Flg_Pendiente', Flg_Pendiente);

    return this.http.get(this.baseUrlTinto + 'TjSeguimientoSaldoHilo/getListaOT_Terminada', { headers, params });
  }    

  postProceso(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TjSeguimientoSaldoHilo/postProceso', data, { headers })
  }

  getListaSolicitudAuditoria(Num_Solicitud, Cod_OrdProv, FecInicio, FecFin, Estado){

    if (!_moment(FecInicio).isValid()) {
      FecInicio = '';
    } else {
      FecInicio = _moment(FecInicio.valueOf()).format('MM/DD/YYYY');
    }

    if (!_moment(FecFin).isValid()) {
      FecFin = '';
    } else {
      FecFin = _moment(FecFin.valueOf()).format('MM/DD/YYYY');
    }      

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Num_Solicitud', Num_Solicitud);
    params = params.append('Lote', Cod_OrdProv);
    params = params.append('FechaIni', FecInicio);
    params = params.append('FechaFin', FecFin);
    params = params.append('Estado', Estado);

    return this.http.get(this.baseUrlTinto + 'TjSolicitudDevolucionAuditoria/getListaSolicitudAuditoria', { headers, params });
  }    

  getListaSolicitudAuditoriaBultos(Num_Solicitud, Lote, Semana, Color, Marca, Conera){

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Num_Solicitud', Num_Solicitud);
    params = params.append('Lote', Lote);
    params = params.append('Semana', Semana);
    params = params.append('Color', Color);
    params = params.append('Marca', Marca);
    params = params.append('Conera', Conera);

    return this.http.get(this.baseUrlTinto + 'TjSolicitudDevolucionAuditoria/getListaSolicitudAuditoriaBultos', { headers, params });
  }      

  postProcesoSolAuditoria(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TjSolicitudDevolucionAuditoria/postProceso', data, { headers })
  }



}
