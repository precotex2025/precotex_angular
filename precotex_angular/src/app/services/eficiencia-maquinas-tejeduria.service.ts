import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EficienciaMaquinasTejeduriaService {
  baseUrl = GlobalVariable.baseUrl;
  constructor(private http: HttpClient) { }


  UP_RPT_SITUACION_ORDENES_INSPECCION_PANTALLA_FINAL(Cod_Accion: string ){


    if (!_moment(Cod_Accion).isValid()) {
      Cod_Accion = '01/01/1900';
    }

    Cod_Accion = _moment(Cod_Accion.valueOf()).format('MM/DD/YYYY');
    console.log(Cod_Accion)

    //return this.http.get(`${this.baseUrl}/app_listar_eficiencia_maquina_turno.php?Fec_Registro=${Cod_Accion}`);
    return this.http.get(`${this.baseUrl}/app_listar_eficiencia_maquina_turno.php?Fec_Registro=${Cod_Accion}`);
  }

  ActualizarIni(){

    return this.http.get(`${this.baseUrl}/app_ActualizarIni.php`);
  }
}
