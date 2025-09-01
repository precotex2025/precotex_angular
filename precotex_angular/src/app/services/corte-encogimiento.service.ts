import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CortesEncogimientoService {

  private actualizarVistaSource = new BehaviorSubject<boolean>(false);
  actualizarVista$ = this.actualizarVistaSource.asObservable();

  emitirCambio() {
    this.actualizarVistaSource.next(true);
  }
  //urlCortesEncogimiento = environment.cnServerCortes + "CorteEncogimiento/getListaCorteEncogimiento?opcion=";
  baseUrlTinto  = GlobalVariable.baseUrlProcesoTenido;

  urlCortesEncogimiento = this.baseUrlTinto + "CorteEncogimiento";
  sCod_Usuario = GlobalVariable.vusu;

  httpOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  constructor(private http: HttpClient) { }
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });

  listarCorteEncogimeinto() {
    const headers = this.Header;
    let params = new HttpParams();
    return this.http.get(this.urlCortesEncogimiento +'/getListaCorteEncogimiento', { headers, params });

  }

  insertCorteEncogimeinto(Opcion: string, Cod_Ordtra: string) {
    const headers = this.Header;
    let params = new HttpParams();
    return this.http.get(this.urlCortesEncogimiento + '/getInsertCorteEncogimiento?pTipo=' + Opcion + "&pCod_Ordtra=" + Cod_Ordtra,{ headers, params });
  }

  listarCorteEncogimeintoDet(opcion: string, num_secuencia: string, cod_Partida: string, ancho_Antes_Lav: number, alto_Antes_Lav: number, ancho_Despues_Lav: number, alto_Despues_Lav: number, sesgadura: number) {
    const headers = this.Header;
    let params = new HttpParams();
    return this.http.get(this.urlCortesEncogimiento + '/getListCorteEncogimientoDet?pTipo=' + opcion + "&pNum_Secuencia=" + num_secuencia + "&pCodPartida=" + cod_Partida +"&pAncho_Antes_Lav=" + ancho_Antes_Lav + "&pAlto_Antes_Lav=" + alto_Antes_Lav + "&pAncho_Despues_Lav=" + ancho_Despues_Lav + "&pAlto_Despues_Lav=" + alto_Despues_Lav + "&pSesgadura=" + sesgadura,{ headers, params });

  }

  buscarCorteEncogimiento(Cod_Ordtra: string) {
    const headers = this.Header;
    let params = new HttpParams();
    return this.http.get(this.urlCortesEncogimiento + '/getBuscarCorteEncogimiento?pCod_Ordtra=' + Cod_Ordtra,{ headers, params });
  }


  updateMedidasTablaMaestra(pData: any[]): Observable<any> {
    return this.http.post(this.urlCortesEncogimiento + '/getUpdateMedidasTablaMaestra', pData);
  }

  buscarUsuario(Usuario: string) {
    const headers = this.Header;
    let params = new HttpParams();
    return this.http.get(this.urlCortesEncogimiento + '/getBuscarUsuario?pUsuario=' + Usuario,{ headers, params });
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.error);
  }
}
