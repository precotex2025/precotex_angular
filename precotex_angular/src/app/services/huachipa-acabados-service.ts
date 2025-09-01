import { Injectable } from '@angular/core';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpHandler } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class HuachipaAcabadosService {

  baseUrl = environment.cnServerTinto;    
  baseUrlShowParamReceta = environment.cnServerTinto + "procesos/MuestraPartidasPendientes/";

  sCod_Usuario = GlobalVariable.vusu;

        httpOptions = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

  constructor(private http: HttpClient) { }

  showPartidasPendientesEstRef(){
    return this.http.get(`${this.baseUrlShowParamReceta}`);
  }


}
