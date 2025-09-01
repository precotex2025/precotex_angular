import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError,lastValueFrom  } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';
import { AuditorResponse, CalificacionResponse, EstadoPartidaResponse, EstadoProceso, EstadoProcesoResponse, MaquinaResponse, ProcesoAuditadoResponse, SupervisorResponse, TurnoResponse,UnidadNegocioResponse } from '../components/calificacion-rollos-proceso/calificacion-rollos-proceso.model';
import { RegistroDesglose } from '../components/tiempos-improductivosv2//registro-desglose.model';

@Injectable({
  providedIn: 'root'
})
export class CalificacionRollosProcesoService {

  baseUrl  = GlobalVariable.baseUrlProcesoTenido;

    url = this.baseUrl + "CalificacionRollosEnProceso";
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

    ObtenerDefecto(filtros: any): Observable<any> {
      return this.http.post(`${this.url}/getObtenerDefecto`, filtros);
    }

    obtenerMaquina(): Observable<MaquinaResponse> {
      return this.http.get<MaquinaResponse>(`${this.url}/getObtenerMaquina`);
    }



    obtenerSupervisor(): Observable<SupervisorResponse> {
      return this.http.get<SupervisorResponse>(`${this.url}/getObtenerSupervisor`);
    }

    obtenerAuditor(): Observable<AuditorResponse> {
      return this.http.get<AuditorResponse>(`${this.url}/getObtenerAuditor`);
    }

    obtenerTurno(): Observable<TurnoResponse> {
      return this.http.get<TurnoResponse>(`${this.url}/getObtenerTurno`);
    }

    obtenerUnidadNegocio(): Observable<UnidadNegocioResponse> {
      return this.http.get<UnidadNegocioResponse>(`${this.url}/getObtenerUnidadNegocio`);
    }

    obtenerEstadoPartida(): Observable<EstadoPartidaResponse> {
      return this.http.get<EstadoPartidaResponse>(`${this.url}/getObtenerEstadoPartida`);
    }

    obtenerProcesoAuditado(): Observable<ProcesoAuditadoResponse> {
      return this.http.get<ProcesoAuditadoResponse>(`${this.url}/getObtenerProcesoAuditado`);
    }


    obtenerCalificacion(): Observable<CalificacionResponse> {
      return this.http.get<CalificacionResponse>(`${this.url}/getObtenerCalificacion`);
    }
    obtenerEstadoProceso(): Observable<EstadoProcesoResponse> {
      return this.http.get<EstadoProcesoResponse>(`${this.url}/getObtenerEstadoProceso`);
    }

    buscarPorPartida(partida: string): Observable<any> {
      const params = new HttpParams().set('partida', partida);
      return this.http.get<any>(`${this.url}/getBuscarPorPartida`, { params });
    }

    buscarArticuloPorPartida(partida: string): Observable<any> {
      const params = new HttpParams().set('partida', partida);
      return this.http.get<any>(`${this.url}/getBuscarArticuloPorPartida`, { params });
    }

    buscarRolloPorPartidaDetalle(partida: string, articulo: string): Observable<any> {
      const params = new HttpParams()
        .set('partida', partida)
        .set('articulo', articulo);

      return this.http.get<any>(`${this.url}/getBuscarRolloPorPartidaDetalle`, { params });
    }

    guardarPartida(partidaCab: any): Observable<any> {
      return this.http.post(`${this.url}/postGuardarPartida`, partidaCab);
    }

    buscarPorRollo(partida: string, usuario: string): Observable<any> {

      const params = new HttpParams()
      .set('partida', partida)
      .set('usuario', usuario);;
      return this.http.get<any>(`${this.url}/getBuscarPorRollo`, { params });
    }

    updatePorPartida(partida: string, id: number): Observable<any> {
      const params = new HttpParams()
      .set('partida', partida)
      .set('id', id);
      return this.http.get<any>(`${this.url}/getUpdatePorPartida`, { params });
    }

    subirArchivo(archivo: File): Observable<any> {
      const formData = new FormData();
      formData.append('archivo', archivo, archivo.name);
      return this.http.post(`${this.url}/subir-archivo`, formData);

    }

    //REGISTRO DE SERVICIO DE DESGLOSE
    obtenerDni(usuario: string): Observable<any> {
      const params = new HttpParams().set('usuario', usuario);
      return this.http.get<any>(`${this.url}/getObtenerDni`, { params });
    }

    buscarPartida(partida: string): Observable<any> {
      const params = new HttpParams().set('partida', partida);
      return this.http.get<any>(`${this.url}/getBuscarPartida`, { params });
    }

    obtenerProveedores(): Observable<MaquinaResponse> {
      return this.http.get<MaquinaResponse>(`${this.url}/getObtenerProveedores`);
    }

    registrarDesglose(data: RegistroDesglose) : Observable<any>{
      return this.http.post(`${this.url}/postRegistrarDesglose`, data);
    }

    listarDesglose():  Observable<any> {
      return this.http.get<any>(`${this.url}/getListarDesglose`);
    }

    listarDesgloseItem(id_Desglose: string): Observable<any> {
      const params = new HttpParams().set('id_Desglose', id_Desglose);
      return this.http.get<any>(`${this.url}/getListarDesgloseItem`, { params });
    }

    actualizarDesglose(datos: any): Observable<any> {
      return this.http.post<any>(`${this.url}/postActualizarDesgloseItem`, datos);
    }

    eliminarDesglose(id: number): Observable<any> {
      return this.http.delete(`${this.url}/DelteDesglose/${id}`);
    }
}