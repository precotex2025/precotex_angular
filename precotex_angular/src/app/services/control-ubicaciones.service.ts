import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';

export interface ControlUbicacionResumen {
  des_Ubicacion: string;
  tot_Peso_Neto: number;
  tot_Bulto: number;
}

export interface ControlUbicacionDetalle {
  iD_Rollo_X_Anio: string;
  cod_Ordtra: string;
  des_Color: string;
  peso_Neto: number;
}

export interface ControlUbicacionResponse {
  resumen?: ControlUbicacionResumen;
  detalle: ControlUbicacionDetalle[];
}

export interface ControlUbicacionGuiaBulto {
  iD_Rollo_X_Anio: string;
  cod_Ordtra: string;
  peso_Neto: number;
}

export interface ControlUbicacionGuiaTotales {
  tot_Enviados: number;
  tot_Ubicados: number;
  tot_Pendientes: number;
  tot_Lecturados: number;
  tot_Peso_Neto: number;
}

export interface ControlUbicacionGuiaResponse {
  cod: number;
  msg: string;
  totales: ControlUbicacionGuiaTotales;
  bultos: ControlUbicacionGuiaBulto[];
}

export interface ControlUbicacionLecturaRequest {
  numGuia: string;
  idRollo: string;
  codUsuario?: string;
}

export interface ControlUbicacionGuardarRequest {
  numGuia: string;
  desUbicacion: string;
  codUsuario?: string;
}

export interface ControlUbicacionReubicacionBulto {
  iD_Rollo_X_Anio: string;
  cod_Ordtra: string;
  peso_Neto: number;
}

export interface ControlUbicacionReubicacionTotales {
  tot_Bulto: number;
  tot_Peso_Neto: number;
}

export interface ControlUbicacionUltimoBulto {
  iD_Rollo_X_Anio: string;
  des_Ubicacion: string;
  cod_Ordtra: string;
  peso_Neto: number;
}

export interface ControlUbicacionReubicacionResponse {
  cod: number;
  msg: string;
  totales: ControlUbicacionReubicacionTotales;
  bultos: ControlUbicacionReubicacionBulto[];
  ultimoBulto?: ControlUbicacionUltimoBulto;
}

export interface ControlUbicacionReubicacionLecturaRequest {
  idRollo: string;
  codUsuario?: string;
}

export interface ControlUbicacionGuardarReubicacionRequest {
  desUbicacion: string;
  codUsuario?: string;
}

export interface ControlUbicacionGuardarReubicacionResponse {
  cod: number;
  msg: string;
}

export interface ServiceResponse<T> {
  success: boolean;
  codeResult: number;
  message: string;
  element: T;
}

@Injectable({
  providedIn: 'root'
})
export class ControlUbicacionesService {

  private baseUrl = GlobalVariable.baseUrlProcesoTenido + 'ControlUbicaciones';

  constructor(private http: HttpClient) { }

  obtenerDetalleUbicacion(desUbicacion: string, idRollo: string, codUsuario?: string): Observable<ServiceResponse<ControlUbicacionResponse>> {
    let params = new HttpParams()
      .set('desUbicacion', (desUbicacion || '').trim())
      .set('idRollo', (idRollo || '').trim())
      .set('codUsuario', (codUsuario || GlobalVariable.vusu || 'sistemas').trim());

    return this.http.get<ServiceResponse<ControlUbicacionResponse>>(`${this.baseUrl}/getMuestraDetalleUbicacion`, { params });
  }

  limpiarTemporalGuia(codUsuario?: string): Observable<ServiceResponse<boolean>> {
    let params = new HttpParams()
      .set('codUsuario', (codUsuario || GlobalVariable.vusu || 'sistemas').trim());

    return this.http.post<ServiceResponse<boolean>>(`${this.baseUrl}/limpiarTemporalGuia`, null, { params });
  }

  consultarGuia(numGuia: string, codUsuario?: string): Observable<ServiceResponse<ControlUbicacionGuiaResponse>> {
    let params = new HttpParams()
      .set('numGuia', (numGuia || '').trim())
      .set('codUsuario', (codUsuario || GlobalVariable.vusu || 'sistemas').trim());

    return this.http.get<ServiceResponse<ControlUbicacionGuiaResponse>>(`${this.baseUrl}/consultarGuia`, { params });
  }

  insertarBultoGuia(request: ControlUbicacionLecturaRequest): Observable<ServiceResponse<ControlUbicacionGuiaResponse>> {
    const payload = {
      ...request,
      numGuia: (request.numGuia || '').trim(),
      idRollo: (request.idRollo || '').trim(),
      codUsuario: (request.codUsuario || GlobalVariable.vusu || 'sistemas').trim()
    };

    return this.http.post<ServiceResponse<ControlUbicacionGuiaResponse>>(`${this.baseUrl}/insertarBultoGuia`, payload);
  }

  guardarUbicacionGuia(request: ControlUbicacionGuardarRequest): Observable<ServiceResponse<ControlUbicacionGuiaResponse>> {
    const payload = {
      ...request,
      numGuia: (request.numGuia || '').trim(),
      desUbicacion: (request.desUbicacion || '').trim(),
      codUsuario: (request.codUsuario || GlobalVariable.vusu || 'sistemas').trim()
    };

    return this.http.post<ServiceResponse<ControlUbicacionGuiaResponse>>(`${this.baseUrl}/guardarUbicacionGuia`, payload);
  }

  // ==========================================
  // METODOS DE REUBICACION
  // ==========================================

  limpiarTemporalReubicacion(codUsuario?: string): Observable<ServiceResponse<boolean>> {
    let params = new HttpParams()
      .set('codUsuario', (codUsuario || GlobalVariable.vusu || 'sistemas').trim());

    return this.http.post<ServiceResponse<boolean>>(`${this.baseUrl}/limpiarTemporalReubicacion`, null, { params });
  }

  consultarReubicacion(codUsuario?: string): Observable<ServiceResponse<ControlUbicacionReubicacionResponse>> {
    let params = new HttpParams()
      .set('codUsuario', (codUsuario || GlobalVariable.vusu || 'sistemas').trim());

    return this.http.get<ServiceResponse<ControlUbicacionReubicacionResponse>>(`${this.baseUrl}/consultarReubicacion`, { params });
  }

  insertarBultoReubicacion(request: ControlUbicacionReubicacionLecturaRequest): Observable<ServiceResponse<ControlUbicacionReubicacionResponse>> {
    const payload = {
      ...request,
      idRollo: (request.idRollo || '').trim(),
      codUsuario: (request.codUsuario || GlobalVariable.vusu || 'sistemas').trim()
    };

    return this.http.post<ServiceResponse<ControlUbicacionReubicacionResponse>>(`${this.baseUrl}/insertarBultoReubicacion`, payload);
  }

  guardarReubicacion(request: ControlUbicacionGuardarReubicacionRequest): Observable<ServiceResponse<ControlUbicacionGuardarReubicacionResponse>> {
    const payload = {
      ...request,
      desUbicacion: (request.desUbicacion || '').trim(),
      codUsuario: (request.codUsuario || GlobalVariable.vusu || 'sistemas').trim()
    };

    return this.http.post<ServiceResponse<ControlUbicacionGuardarReubicacionResponse>>(`${this.baseUrl}/guardarReubicacion`, payload);
  }
}
