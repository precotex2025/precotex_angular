import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError,lastValueFrom  } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';
import { ClientesResponse, EstadoResponse, MotivoReclamo, MotivoReclamoResponse, UnidadNegocio, UnidadNegocio2Response, UnidadNegocioResponse, UsuarioResponsable, UsuarioResponsableResponse } from '../components/quejas-reclamos/quejas-reclamos.model';

export interface Cliente {
  cod_Cliente_Tex : string;
  nom_Cliente : string;
  abr_Cliente : string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroQuejasReclamosService {

    //urlCortesEncogimiento = environment.cnServerCortes + "CorteEncogimiento/getListaCorteEncogimiento?opcion=";
    baseUrl  = GlobalVariable.baseUrlProcesoTenido;

    url = this.baseUrl + "QuejasReclamos";
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

    //Nuevos Metodos
    buscarPorPartida(partida: string): Observable<any> {
      const params = new HttpParams().set('partida', partida);
      return this.http.get<any>(`${this.url}/getBuscarPorPartida`, { params });
    }    
    
     
    ListaUnidadNegocio(): Observable<UnidadNegocio2Response> {
      return this.http.get<UnidadNegocio2Response>(`${this.url}/getListaUnidadNegocio`);
    }

    ListaAreasCalidad(): Observable<any> {
      return this.http.get<any>(`${this.url}/getListaAreasCalidad`);
    }        

    AvanzaEstadoReclamo(sId: number){
      const headers = this.Header;
      return this.http.post(`${this.url}/postAvanzaEstadoReclamo`, sId, { headers })
    }   

    ProcesoConfirmarReclamo(data: any){
      return this.http.post(`${this.url}/postProcesoConfirmarReclamo`, data)
    }  

    ListaTipoConsecuencia(): Observable<any> {
      return this.http.get<any>(`${this.url}/getListaTipoConsecuencia`);
    }    

    ListaSubTipoDevolucion(sCod_Tipo_Consecuencia: string): Observable<any> {
      const params = new HttpParams().set('sCod_Tipo_Consecuencia', sCod_Tipo_Consecuencia);
      return this.http.get<any>(`${this.url}/getListaSubTipoDevolucion`, { params });
    }    

    ProcesoCerrarReclamo(data: any){
      return this.http.post(`${this.url}/postProcesoCerrarReclamo`, data)
    }  

    ObtieneUsuarioArea(Cod_Trabajador: string): Observable<any> {
      const params = new HttpParams().set('Cod_Trabajador', Cod_Trabajador);
      return this.http.get<any>(`${this.url}/getObtieneUsuarioArea`, { params });
    }  
    
    ObtieneDetalleInformeCalidad(Id: number): Observable<any> {
      const params = new HttpParams().set('Id', Id);
      return this.http.get<any>(`${this.url}/getObtieneDetalleInformeCalidad`, { params });
    }   
    
    ObtieneDetalleInformeComercial(Id: number): Observable<any> {
      const params = new HttpParams().set('Id', Id);
      return this.http.get<any>(`${this.url}/getObtieneDetalleInformeComercial`, { params });
    }        

    descargarArchivo(nombre: string): Observable<Blob> {
      const params = new HttpParams().set('fileName', nombre);
      return this.http.get(`${this.url}/getDescargar`, {
        responseType: 'blob',
        params  // 👈 importante
      });
    }

    ListaEstadosOficial(): Observable<any> {
      return this.http.get<any>(`${this.url}/getListaEstados`);
    }       

    ExportarReclamo(filtros: any): Observable<any> {
      return this.http.post(`${this.url}/getExportarReclamo`, filtros);
    }      

  }
