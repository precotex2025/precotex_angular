import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';

@Injectable({
  providedIn: 'root'
})
export class SeguridadRondasService {

  baseUrl: string = GlobalVariable.baseUrl;

  constructor(private httpClient: HttpClient) { }

  registroRondas(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/app_Man_SG_RegistroRondas.php`, data);
  }

  registroOcurrencias(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/app_Man_SG_RegistroRondasOcurrencias.php`, data);
  }

  listarOperarioAreas(Cod_Fabrica: string, Cod_Area: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/app_Man_RH_OperarioXAreas.php?Cod_Fabrica=${Cod_Fabrica}&Cod_Area=${Cod_Area}`);
  }

  listarAreasPlanta(Id_Planta: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/app_Man_SG_AreasPlanta.php?Id_Planta=${Id_Planta}`);
  }

  listarEstandarSeguridad(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/app_Man_SG_EstandarSeguridad.php`);
  }

  // SALIDA TIENDA

  listarMovimientoTienda(Tipo: string, Serie: string, Numero: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/app_Man_Seg_MovimientoTienda.php?Tipo=${Tipo}&Serie=${Serie}&Numero=${Numero}`);
  }

  listarSalidaTienda(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/app_Man_Seg_Salidas_Tienda.php`, data);
  }
  
}
