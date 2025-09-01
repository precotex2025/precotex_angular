import { Injectable } from '@angular/core';
import { GlobalVariable } from '../VarGlobals';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GuiacontingenciaService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;

  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  grabaAutorizacionguiacontingencia(flag:string){
    return this.http.get(`${this.baseUrl}/app_AutorizaGuiaContingencia.php?Flag=${flag}&Cod_Usuario=${this.sCod_Usuario}`);
  }

}
