import { Injectable } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import {
  UnidadNegocioItem, UnidadNegocioTipoItem, RecetaAntipillingItem,
  ValidaColorItem, TelaItem, RutaTelaRawItem,
  PrecioXColorItem, ProcesoExportacionItem,
  CorrelativoVersionItem, CentroCostoRawItem,
  HiladoTelaItem,
  ListaPrecioXColorRequest, ListarProcesosExportacionRequest, ObtenerNuevoCorrelativoVersionRequest,
  ProcesoCotizacionRequest
} from 'src/app/interfaces/cotizaciones';
import { ComboItem } from 'src/app/models/cotizaciones';
import { ServiceResponse, ServiceResponseList } from 'src/app/interfaces/shared';

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

  getListaUnidadNegocio(): Observable<ServiceResponseList<UnidadNegocioItem>> {
    return this.http
      .get<ServiceResponseList<UnidadNegocioItem>>(`${this.baseUrlTinto}${this.endpoint}/getListaUnidadNegocio`, { headers: this.headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaRecetasAntipilling(): Observable<ServiceResponseList<RecetaAntipillingItem>> {
    return this.http
      .get<ServiceResponseList<RecetaAntipillingItem>>(`${this.baseUrlTinto}${this.endpoint}/getListaRecetasAntipilling`, { headers: this.headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  getValidaColorExiste(Cod_Color: string): Observable<ServiceResponseList<ValidaColorItem>> {
    const params = this.buildParams({ Cod_Color });
    return this.http
      .get<ServiceResponseList<ValidaColorItem>>(`${this.baseUrlTinto}${this.endpoint}/getValidaColorExiste`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaTelas(Cod_Tela: string): Observable<ServiceResponseList<TelaItem>> {
    const params = this.buildParams({ Cod_Tela });
    return this.http
      .get<ServiceResponseList<TelaItem>>(`${this.baseUrlTinto}${this.endpoint}/getListaTelas`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getRutaXCodTela(Cod_Tela: string): Observable<ServiceResponseList<RutaTelaRawItem>> {
    // NOTA: el backend espera el param en minúscula ("cod_tela"), a diferencia del resto de
    // endpoints. Se mantiene así hasta confirmar con backend que puede unificarse.
    const params = this.buildParams({ cod_tela: Cod_Tela });
    return this.http
      .get<ServiceResponseList<RutaTelaRawItem>>(`${this.baseUrlTinto}${this.endpoint}/getRutaXCodTela`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaColoresXCliente(Cod_Cliente: string): Observable<ServiceResponseList<ComboItem>> {
    const params = this.buildParams({ Cod_Cliente });
    return this.http
      .get<ServiceResponseList<ComboItem>>(`${this.baseUrlTinto}${this.endpoint}/getListaColoresXCliente`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaUnidadNegocioTipo(Id_Unidad_NegocioKey: number): Observable<ServiceResponseList<UnidadNegocioTipoItem>> {
    const params = this.buildParams({ Id_Unidad_NegocioKey });
    return this.http
      .get<ServiceResponseList<UnidadNegocioTipoItem>>(`${this.baseUrlTinto}${this.endpoint}/getListaUnidadNegocioTipo`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaPrecioXColor(request: ListaPrecioXColorRequest): Observable<ServiceResponseList<PrecioXColorItem>> {
    const params = this.buildParams({ ...request });
    return this.http
      .get<ServiceResponseList<PrecioXColorItem>>(`${this.baseUrlTinto}${this.endpoint}/getListaPrecioXColor`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListarProcesosExportacion(request: ListarProcesosExportacionRequest): Observable<ServiceResponseList<ProcesoExportacionItem>> {
    const params = this.buildParams({ ...request });
    // NOTA: prefijo con "T" mayúscula, distinto del resto (this.endpoint = 'txCotizaciones').
    // Se mantiene el literal original hasta confirmar con backend si la ruta es case-insensitive.
    return this.http
      .get<ServiceResponseList<ProcesoExportacionItem>>(`${this.baseUrlTinto}TxCotizaciones/getListarProcesosExportacion`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  postProcesoCotizacion(data: ProcesoCotizacionRequest): Observable<ServiceResponse<null>> {
    return this.http
      .post<ServiceResponse<null>>(`${this.baseUrlTinto}${this.endpoint}/postProcesoCotizacion`, data, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // Devuelve el siguiente correlativo/versión para un borrador nuevo (elements[0] = { correlativo, version })
  getObtenerNuevoCorrelativoVersion(request: ObtenerNuevoCorrelativoVersionRequest): Observable<ServiceResponseList<CorrelativoVersionItem>> {
    const params = this.buildParams({ ...request });
    return this.http
      .get<ServiceResponseList<CorrelativoVersionItem>>(`${this.baseUrlTinto}${this.endpoint}/getObtenerNuevoCorrelativoVersion`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaCentroCosto(): Observable<ServiceResponseList<CentroCostoRawItem>> {
    return this.http
      .get<ServiceResponseList<CentroCostoRawItem>>(`${this.baseUrlTinto}${this.endpoint}/getListaCentroCosto`, { headers: this.headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaIntensidad(Id_Unidad_NegocioKey: number): Observable<ServiceResponseList<ComboItem>> {
    const params = this.buildParams({ Id_Unidad_NegocioKey });
    return this.http
      .get<ServiceResponseList<ComboItem>>(`${this.baseUrlTinto}${this.endpoint}/getListaIntensidad`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }

  getListaHiladoxTela(Cod_Tela: string): Observable<ServiceResponseList<HiladoTelaItem>> {
    const params = this.buildParams({ Cod_Tela });
    return this.http
      .get<ServiceResponseList<HiladoTelaItem>>(`${this.baseUrlTinto}${this.endpoint}/getListaHiladoxTela`, { headers: this.headers, params })
      .pipe(retry(1), catchError(this.handleError));
  }
}
