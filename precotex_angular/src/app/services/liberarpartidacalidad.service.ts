import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';

import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class LiberarpartidacalidadService {


  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;

  sCod_Usuario = GlobalVariable.vusu;



  constructor(private http: HttpClient) { }


  ShowPartidasLiberadas(Cod_Ordtra, xOpcion){
    return this.http.get(`${this.baseUrl}/app_man_liberar_partida_calidad.php?Cod_Ordtra=${Cod_Ordtra}&Cod_Usuario=${this.sCod_Usuario}&Opcion=${xOpcion}`);
  }


}
