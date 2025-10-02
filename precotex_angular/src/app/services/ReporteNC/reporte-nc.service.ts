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


  postRegistrarReporteNC(data: any){
    const headers = this.Header;
    console.log('Entra al servicio para el backend');
    return this.http.post(this.baseUrlTinto + 'TxReporteNC/postRegistrarReporteNC', data, {headers});
  }

}