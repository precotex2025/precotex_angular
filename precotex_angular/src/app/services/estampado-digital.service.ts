import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';
import { environment } from 'src/environments/environment';
import { ProgramaEmpastado, TipPasta, VersionPrograma } from '../models/Estampado/ProgramaEmpastado';

@Injectable({
  providedIn: 'root'
})
export class EstampadoDigitalService {

  urlProgramaEmpastado = environment.cnServerTinto + "estampadodigital/est_ManProgramaEmpastado?opcion=";
  urlSecuenciaPrograma = environment.cnServerTinto + "estampadodigital/est_ActualizaSecuenciaPrograma?sec_origen=";
  urlVersion = environment.cnServerTinto + "estampadodigital/est_MuestraProgramasConfirmados/";
  urlTipPasta = environment.cnServerTinto + "estampadodigital/est_muestra_tippasta/";

  sCod_Usuario = GlobalVariable.vusu;

  httpOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  constructor(private http: HttpClient) { }

  ManProgramaEmpastado(Opcion: string, Tipo:string, Cod_Ordtra: string,Num_Secuencia:string, Id_Programa:string,Kgs_Progr:string, Obs:string, Version_B:string, Cod_Tip_Pasta:string): Observable<ProgramaEmpastado[]> {

    // if (!_moment(Fec_Reg_Ini).isValid()) {
    //   Fec_Reg_Ini = '01/01/1900';
    // }
    // if (!_moment(Fec_Reg_Fin).isValid()) {
    //   Fec_Reg_Fin = '01/01/1900';
    // }
    // Fec_Reg_Ini = _moment(Fec_Reg_Ini.valueOf()).format('DD/MM/YYYY');
    // Fec_Reg_Fin = _moment(Fec_Reg_Fin.valueOf()).format('DD/MM/YYYY');
return this.http.get<ProgramaEmpastado[]>(this.urlProgramaEmpastado + Opcion + "&Tipo=" + Tipo + "&Cod_Ordtra=" + Cod_Ordtra + "&Num_Secuencia=" + Num_Secuencia + "&Id_Programa=" + Id_Programa + "&Kgs_Progr=" + Kgs_Progr + "&Obs=" + Obs + "&Version_B="+ Version_B + "&Cod_Tip_Pasta="+ Cod_Tip_Pasta + "&cod_usuario=" + this.sCod_Usuario);
}

saveSecuenciaPrograma(Version:string, Sec_Origen: string, Sec_Destino: string){
  const params = new HttpParams()
    .set('Version', Version)
    .set('Sec_Origen', Sec_Origen)
    .set('Sec_Destino', Sec_Destino)
    .set('Cod_Usuario', this.sCod_Usuario);

  return this.http.post(this.urlSecuenciaPrograma, params);
  // return this.http.post(this.urlSecuenciaPrograma + Sec_Origen + "&Sec_Destino=" + Sec_Destino + "&Cod_Usuario=" + this.sCod_Usuario);
}

MuestraVersionPrograma(): Observable<VersionPrograma[]> {
  return this.http.get<VersionPrograma[]>(this.urlVersion);
}

MuestraTipPasta(): Observable<TipPasta[]> {
  return this.http.get<TipPasta[]>(this.urlTipPasta);
}

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.error);
  }
}
