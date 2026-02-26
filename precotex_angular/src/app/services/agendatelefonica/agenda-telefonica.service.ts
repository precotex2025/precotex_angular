import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from 'src/app/VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AgendaTelefonicaService {

  baseUrlTinto = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  getObtenerNumeros(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'CnAgenda/getObtenerNumeros', { headers })
  }

}
