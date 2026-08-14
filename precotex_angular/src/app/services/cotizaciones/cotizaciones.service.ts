import { Injectable } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import {
  ListaUnidadNegocioResponse, ListaUnidadNegocioTipoResponse, ListaRecetasAntipillingResponse,
  ValidaColorExisteResponse, ListaTelasResponse, RutaXCodTelaResponse, ListaColoresXClienteResponse,
  ListaPrecioXColorResponse, ListarProcesosExportacionResponse, ProcesoCotizacionResponse,
  ObtenerNuevoCorrelativoVersionResponse, ListaCentroCostoResponse, ListaIntensidadResponse,
  ListaHiladoXTelaResponse,
  ListaPrecioXColorRequest, ListarProcesosExportacionRequest, ObtenerNuevoCorrelativoVersionRequest,
  ProcesoCotizacionRequest
} from 'src/app/interfaces/cotizaciones';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {

  private readonly baseUrlTinto = GlobalVariable.baseUrlProcesoTenido;
  private readonly endpoint = 'txCotizaciones';
  private readonly headers = new HttpHeaders({
    'Content-type': 'application/json'
  });

  constructor(private readonly http: HttpClient) { }

  private readonly handleError = (error: HttpErrorResponse): Observable<never> =>
    throwError(() => new Error(
      error?.error?.message ?? error.message ?? 'Error de comunicación con el servidor'
    ));

  private buildParams(request: Record<string, string | number | boolean>): HttpParams {
    let params = new HttpParams();
    Object.entries(request).forEach(([key, value]) => { params = params.append(key, value); });
    return params;
  }

  getListaUnidadNegocio(): Observable<ListaUnidadNegocioResponse> {
    return this.http
      .get<ListaUnidadNegocioResponse>(`${this.baseUrlTinto}${this.endpoint}/getListaUnidadNegocio`, { headers: this.headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaRecetasAntipilling(): Observable<ListaRecetasAntipillingResponse> {
    return this.http
      .get<ListaRecetasAntipillingResponse>(`${this.baseUrlTinto}${this.endpoint}/getListaRecetasAntipilling`, { headers: this.headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  getValidaColorExiste(Cod_Color: string): Observable<ValidaColorExisteResponse> {
    const params = this.buildParams({ Cod_Color });
    return this.http
      .get<ValidaColorExisteResponse>(`${this.baseUrlTinto}${this.endpoint}/getValidaColorExiste`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaTelas(Cod_Tela: string): Observable<ListaTelasResponse> {
    const params = this.buildParams({ Cod_Tela });
    return this.http
      .get<ListaTelasResponse>(`${this.baseUrlTinto}${this.endpoint}/getListaTelas`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getRutaXCodTela(Cod_Tela: string): Observable<RutaXCodTelaResponse> {
    // NOTA: el backend espera el param en minúscula ("cod_tela"), a diferencia del resto de
    // endpoints. Se mantiene así hasta confirmar con backend que puede unificarse.
    const params = this.buildParams({ cod_tela: Cod_Tela });
    return this.http
      .get<RutaXCodTelaResponse>(`${this.baseUrlTinto}${this.endpoint}/getRutaXCodTela`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaColoresXCliente(Cod_Cliente: string): Observable<ListaColoresXClienteResponse> {
    const params = this.buildParams({ Cod_Cliente });
    return this.http
      .get<ListaColoresXClienteResponse>(`${this.baseUrlTinto}${this.endpoint}/getListaColoresXCliente`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaUnidadNegocioTipo(Id_Unidad_NegocioKey: number): Observable<ListaUnidadNegocioTipoResponse> {
    const params = this.buildParams({ Id_Unidad_NegocioKey });
    return this.http
      .get<ListaUnidadNegocioTipoResponse>(`${this.baseUrlTinto}${this.endpoint}/getListaUnidadNegocioTipo`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaPrecioXColor(request: ListaPrecioXColorRequest): Observable<ListaPrecioXColorResponse> {
    const params = this.buildParams({ ...request });
    return this.http
      .get<ListaPrecioXColorResponse>(`${this.baseUrlTinto}${this.endpoint}/getListaPrecioXColor`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListarProcesosExportacion(request: ListarProcesosExportacionRequest): Observable<ListarProcesosExportacionResponse> {
    const params = this.buildParams({ ...request });
    // NOTA: prefijo con "T" mayúscula, distinto del resto (this.endpoint = 'txCotizaciones').
    // Se mantiene el literal original hasta confirmar con backend si la ruta es case-insensitive.
    return this.http
      .get<ListarProcesosExportacionResponse>(`${this.baseUrlTinto}TxCotizaciones/getListarProcesosExportacion`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  postProcesoCotizacion(data: ProcesoCotizacionRequest): Observable<ProcesoCotizacionResponse> {
    return this.http
      .post<ProcesoCotizacionResponse>(`${this.baseUrlTinto}${this.endpoint}/postProcesoCotizacion`, data, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // Devuelve el siguiente correlativo/versión para un borrador nuevo (elements[0] = { correlativo, version })
  getObtenerNuevoCorrelativoVersion(request: ObtenerNuevoCorrelativoVersionRequest): Observable<ObtenerNuevoCorrelativoVersionResponse> {
    const params = this.buildParams({ ...request });
    return this.http
      .get<ObtenerNuevoCorrelativoVersionResponse>(`${this.baseUrlTinto}${this.endpoint}/getObtenerNuevoCorrelativoVersion`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaCentroCosto(): Observable<ListaCentroCostoResponse> {
    return this.http
      .get<ListaCentroCostoResponse>(`${this.baseUrlTinto}${this.endpoint}/getListaCentroCosto`, { headers: this.headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaIntensidad(Id_Unidad_NegocioKey: number): Observable<ListaIntensidadResponse> {
    const params = this.buildParams({ Id_Unidad_NegocioKey });
    return this.http
      .get<ListaIntensidadResponse>(`${this.baseUrlTinto}${this.endpoint}/getListaIntensidad`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaHiladoxTela(Cod_Tela: string): Observable<ListaHiladoXTelaResponse> {
    const params = this.buildParams({ Cod_Tela });
    return this.http
      .get<ListaHiladoXTelaResponse>(`${this.baseUrlTinto}${this.endpoint}/getListaHiladoxTela`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }
}
