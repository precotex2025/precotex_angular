import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from '../../VarGlobals';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisoresGeneralesService {
  baseUrlTinto  = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });
  constructor(private http: HttpClient) { }

  getEstatusRequerimientoAlmacen(sEstado){

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('sEstado', sEstado);
    return this.http.get(this.baseUrlTinto + 'TmpVisorPermanenciaTelaCruda/getEstatusRequerimientoAlmacen', { headers, params });
  }  
}
