import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesarrolloTelaService {
  baseUrlTinto  = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  postListadoColgadoresBandeja(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxDesarrolloTela/postListadoColgadoresBandeja', data, { headers })
  }  

  postProcesoDesarrolloTela(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxDesarrolloTela/postProcesoDesarrolloTela', data, { headers })
  }    

  getPdf(ruta: string) {
    
    const headers = this.Header;
    return this.http.get(
      this.baseUrlTinto + 'TxDesarrolloTela/getPdf',
      {
        headers,
        params: { ruta },
        responseType: 'blob' // importante para recibir el PDF como archivo
      }
    );
  }  
}
