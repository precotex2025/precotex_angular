import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { MotivoImproductivo } from '../models/motivoImproductivo';
import { TelaFicha } from '../models/telaficha';

import { throwError as observableThrowError } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';

@Injectable({
  providedIn: 'root'
})
export class TiempoImproductivoService {

  urlMotivoReproceso = GlobalVariable.wsHuachipa + "reprocesos/showMotivoImproductivo";
  urlTelaficha = GlobalVariable.wsHuachipa + "procesos/ti_sm_muestra_telas_partida_resumen/";
  urlSaveTimproductivos=GlobalVariable.wsHuachipa + "procesos/ti_GrabartiemposImproductivos?accion=";
  httpOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://192.168.3.143'
    }
  };
  
  constructor(private http:HttpClient) { }

  showMotivosImproductivos(): Observable<MotivoImproductivo[]>{
    return this.http.get<MotivoImproductivo[]>(this.urlMotivoReproceso)
  }

  showTelaFichas(idGrupo: number, codTela: string): Observable<TelaFicha[]> {
    console.log("urlTelaficha Improductivos" + this.urlTelaficha + idGrupo + "/" + codTela);
    return this.http.get<TelaFicha[]>(this.urlTelaficha + idGrupo + "/" + codTela);

  }

  /** 
   * List<partida_resumen> lstPartida, string accion, string maquina, int secuencia, string motivo, DateTime fechaInicio,  string observaciones
   * 
   * **/
  saveTiemposImproductivos(lstpartida: TelaFicha[], accion: string, maquina: String, secuencia: number, motivo:string, fechaInicio: string, observaciones: string): Observable<any> {
console.log("url save improductivos")
console.log(this.urlSaveTimproductivos + accion + "&maquina=" + maquina+"&secuencia="+secuencia+"&motivo="+motivo+"&fechaInicio="+fechaInicio+"&observaciones="+observaciones)

    return this.http
      .post<any>(this.urlSaveTimproductivos + accion + "&maquina=" + maquina+"&secuencia="+secuencia+"&motivo="+motivo+"&fechaInicio="+fechaInicio+"&observaciones="+observaciones, lstpartida)
      .pipe(catchError(this.errorHandler))

  }


  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.error);
  }


}
