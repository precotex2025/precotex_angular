import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';


import * as _moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class BusquedaRollosPartidaService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

    showMostrarPartida(xPartida){
      return this.http.get(`${this.baseUrl}/app_tj_muestra_rollo_por_partida.php?Cod_Ordtra=${xPartida}&Tipo=C`);

   }

   showMostrarPartidaDetalle(xPartida){
    return this.http.get(`${this.baseUrl}/app_tj_muestra_rollo_por_partida.php?Cod_Ordtra=${xPartida}&Tipo=D`);

 }
}
