import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from '../../VarGlobals';
import * as _moment from 'moment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PrimerapartidaService {
  baseUrlTinto  = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });
  constructor(private http: HttpClient) { }

  getListaPrimeraPartida(FecIni, FecFin){

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

    return this.http.get(this.baseUrlTinto + 'PrimeraPartida/getListaPrimeraPartida', { headers, params });
  }    

  postAuditoriaPrimeraPartida(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'PrimeraPartida/postAuditoriaPrimeraPartida', data, { headers })
  }
}
