import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';

@Injectable({
  providedIn: 'root'
})
export class ActasService {

  baseUrl: string = GlobalVariable.baseUrl;

  constructor(private httpClient: HttpClient) { }

  manComiteEmergencia(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/app_Man_AC_ComiteEmergencia.php`, data);
  }

  manComiteEmergenciaParticipante(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/app_Man_AC_ComiteEmergenciaParticipante.php`, data);
  }

  getOP_PartidaClienteEstiloColor(Cod_OrdPro: string, Cod_OrdTra: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/app_Man_AC_OP_PartidaClienteEstiloColor.php?Cod_OrdPro=${Cod_OrdPro}&Cod_OrdTra=${Cod_OrdTra}`);
  }

  getComiteEmergenciaProblema(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/app_Man_AC_ComiteEmergenciaProblema.php`);
  }
  
  getComiteEmergenciaProceso(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/app_Man_AC_ComiteEmergenciaProceso.php`);
  }  
}
