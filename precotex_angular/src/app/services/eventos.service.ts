import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  baseUrl: string = GlobalVariable.baseUrl;

  constructor(private httpClient: HttpClient) { }

  consutarFirmaColaborador(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/app_Man_RH_SignaturaColaborador.php`, data);
  }

  registrarFirmaColaborador(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/app_Man_RH_RegistrarSignatura.php`, data);
  }

  registroEventosColaborador(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/app_Man_RH_RegistroEventos.php`, data);
  }

  entregasEventoColaborador(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/app_Man_RH_EntregasEventos.php`, data);
  }

  tipoEventosColaborador(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/app_Man_RH_TipoEventos.php`);
  }

  listaPlantaEventos(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/app_Lg_Man_Planta_Web.php`);
  }


}
