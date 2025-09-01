import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError,lastValueFrom  } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class RegistroPartidaParihuelaService {

    //urlCortesEncogimiento = environment.cnServerCortes + "CorteEncogimiento/getListaCorteEncogimiento?opcion=";
    baseUrl  = GlobalVariable.baseUrlProcesoTenido;

    urlRegistro = this.baseUrl + "RegistroPartidaParihuela";
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

    private headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })

    obtenerDetPartida(Cod_Partida: string, Opcion: string) {
      const headers = this.Header;
      let params = new HttpParams();
      return this.http.get(this.urlRegistro + '/getObtenerDetPartida?pCod_Partida=' + Cod_Partida + "&pOpcion="+ Opcion,{ headers, params });
    }

    updateDetPartida(pData: any[], pCod_Usuario: String, pEstadoParihuela: string): Observable<any> {
      const body = { pData, pCod_Usuario, pEstadoParihuela };  // Se envía un objeto con ambas propiedades
      return this.http.post(this.urlRegistro + '/postUpdateDetPartida', body);
    }

    getCategoriasById(id: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.urlRegistro+ '/GetCategoriasById'}?idPartida=${id}`);
    }

    validaMerma(Cod_Partida: string) {
      const headers = this.Header;
      let params = new HttpParams();
      return this.http.get(this.urlRegistro + '/getValidarMermaPartida?pCod_Partida=' + Cod_Partida,{ headers, params });
    }

    enviarDespacho(codPartida: string): Observable<any> {
      return this.http.post(`${this.urlRegistro}/getEnviarDespacho`, {}, {
        headers: this.headers,
        params: { pCod_Partida: codPartida }
      });
    }

    /*enviarDespacho(Cod_Partida: string) {
      const headers = this.Header;
      let params = new HttpParams();
      return this.http.get(this.urlRegistro + '/getEnviarDespacho?pCod_Partida=' + Cod_Partida,{ headers, params });
    }*/


    /*async enviarDespacho(pCod_Partida: string): Promise<any> {
      try {
        let params = { pCod_Partida };

        // Convertimos el observable a una promesa con `lastValueFrom`
        const response = await lastValueFrom(
          this.http.post(`${this.urlRegistro}/getEnviarDespacho`, {}, { headers: this.headers, params })
        );

      } catch (error) {
        // Capturamos errores de la API o de la conexión
        console.error('🔴 Error en la API:', error);

        if (error instanceof HttpErrorResponse) {
          throw new Error(error.error?.message || 'Error al conectar con el servidor.');
        } else {
          throw new Error(error.message || 'Ocurrió un error inesperado.');
        }
      }
    }*/
  }
