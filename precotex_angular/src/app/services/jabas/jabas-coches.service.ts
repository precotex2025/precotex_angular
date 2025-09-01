import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class JabasCochesService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;
  
  constructor(private http: HttpClient) { }


  ManteJabasCoches(Opcion, Codigo, Codigo_Barra, Ubicacion, Fecha_Compra, Observacion, Nro_Hoja, Tipo, Cod_Usuario,EstadoOK, Estado2RL, Estado2RT, EstadoG, EstadoOUT, EstadoRL, EstadoRO, EstadoRT){
/*
    if (!_moment(Fecha_Compra).isValid()) {
      Fecha_Compra = '';
    }else{
      Fecha_Compra = _moment(Fecha_Compra.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(Fecha_Compra).isValid()) {
      Fecha_Compra = '';
    }else{
      Fecha_Compra = _moment(Fecha_Compra.valueOf()).format('DD/MM/YYYY');
    }
*/
    return this.http.get(`${this.baseUrl}/jabas/app_Lg_Man_Jaba_Coche.php?Opcion=${Opcion}&Codigo=${Codigo}&Codigo_Barra=${Codigo_Barra}&Ubicacion=${Ubicacion}&Fecha_Compra=${Fecha_Compra}&Observacion=${Observacion}&Nro_Hoja=${Nro_Hoja}&Tipo=${Tipo}&Cod_Usuario=${Cod_Usuario}&EstadoOK=${EstadoOK}&Estado2RL=${Estado2RL}&Estado2RT=${Estado2RT}&EstadoG=${EstadoG}&EstadoOUT=${EstadoOUT}&EstadoRL=${EstadoRL}&EstadoRO=${EstadoRO}&EstadoRT=${EstadoRT}`);                                             
  }


  
  
}
