import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError,lastValueFrom  } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';
import { ClientesResponse, EstadoResponse, MotivoReclamo, MotivoReclamoResponse, UnidadNegocio, UnidadNegocioResponse, UsuarioResponsable, UsuarioResponsableResponse } from '../components/quejas-reclamos/quejas-reclamos.model';

export interface Cliente {
  cod_Cliente_Tex : string;
  nom_Cliente : string;
  abr_Cliente : string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroQuejasReclamosv2Service {

    //urlCortesEncogimiento = environment.cnServerCortes + "CorteEncogimiento/getListaCorteEncogimiento?opcion=";
    baseUrl  = GlobalVariable.baseUrlProcesoTenido;

    url = this.baseUrl + "QuejasReclamosv2";
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

    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    obtenerClientes(): Observable<ClientesResponse> {
      return this.http.get<ClientesResponse>(`${this.url}/getObtenerListaClientes`);
    }

    obtenerEstados(): Observable<EstadoResponse> {
      return this.http.get<EstadoResponse>(`${this.url}/getObtenerEstado`);
    }

    obtenerUnidadNegocio(): Observable<UnidadNegocioResponse> {
      return this.http.get<UnidadNegocioResponse>(`${this.url}/getObtenerUnidadNegocio`);
    }

    obtenerUsuarioResponsable(): Observable<UsuarioResponsableResponse> {
      return this.http.get<UsuarioResponsableResponse>(`${this.url}/getObtenerResponsable`);
    }

    obtenerMotivoReclamo(): Observable<MotivoReclamoResponse> {
      return this.http.get<MotivoReclamoResponse>(`${this.url}/getObtenerMotivo`);
    }

    // Método para enviar el reclamo
    enviarReclamo(reclamo: any): Observable<any> {
      return this.http.post(`${this.url}/postGuardarQuejasReclamos`, reclamo);
    }

    obtenerClienteArticulo(filtros: any): Observable<any> {
      alert(filtros);
      return this.http.post(`${this.url}/postObtenerClienteArticulo`, filtros);
    }

    obtenerReclamos(filtros: any): Observable<any> {
      return this.http.post(`${this.url}/postObtenerReclamos`, filtros);
    }

    obtenerDetReclamos(filtros: any): Observable<any> {
      return this.http.post(`${this.url}/postObtenerDetReclamos`, filtros);
    }

    eliminarReclamo(nroCaso: string) {
      return this.http.delete(`${this.url}/deleteReclamos/${nroCaso}`);
    }

    verArchivo(nombreArchivo: string) {
      const url = `${this.url}/getArchivoReclamo?nombreArchivo=${encodeURIComponent(nombreArchivo)}`;
      window.open(url, '_blank');
    }
  }
