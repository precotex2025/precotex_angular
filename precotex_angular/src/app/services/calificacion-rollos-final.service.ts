import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError,lastValueFrom  } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';
import { AuditorResponse, CalificacionResponse, EstadoPartidaResponse, EstadoProceso, EstadoProcesoResponse, MaquinaResponse, ProcesoAuditadoResponse, SupervisorResponse, TurnoResponse,UnidadNegocioResponse } from '../components/calificacion-rollos-final/calificacion-rollos-final.model';


@Injectable({
  providedIn: 'root'
})
export class CalificacionRollosFinalService {

  baseUrl  = GlobalVariable.baseUrlProcesoTenido;

    url = this.baseUrl + "CalificacionRollosFinal";
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

    buscarRolloPorPartidaDetalle(partida: string, articulo: string, 
          sObs:string,
          sCodUsu:string,
          sReco:string,
          sIns:string,
          sResDig:string,
          sObsRec:string,
          sCodCal:string,
          sCodTel:string
    ): Observable<any> {
      const params = new HttpParams()
        .set('partida', partida)
        .set('articulo', articulo)
        .set('sObs', sObs)
        .set('sCodUsu', sCodUsu)
        .set('sReco', sReco)
        .set('sIns', sIns)
        .set('sResDig', sResDig)
        .set('sObsRec', sObsRec)
        .set('sCodCal', sCodCal)
        .set('sCodTel', sCodTel)

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

    obtenerDatosUnionRollos(filtros: any): Observable<any> {
      return this.http.post(`${this.url}/postObtenerDatosUnionRollos`, filtros);
    }

    guardarDatosUnionRollos(unionRollos: any): Observable<any> {
      return this.http.post(`${this.url}/postGuardarDatosUnionRollos`, unionRollos);
    }

    //Agregado por Henry Medina
    getObtenerDefectosRegistradosPorRollo(Cod_OrdTra  : string, Cod_Tela: string, PrefijoMaquina: string, CodigoRollo: string): Observable<any> {

      const params = new HttpParams()
      .set('Cod_OrdTra' , Cod_OrdTra)
      .set('Cod_Tela'   , Cod_Tela  )
      .set('PrefijoMaquina' , PrefijoMaquina)
      .set('CodigoRollo'    , CodigoRollo   );
      return this.http.get<any>(`${this.url}/getObtenerDefectosRegistradosPorRollo`, { params });
    }    

    postGuardarDefectosPartida(partidaCab: any): Observable<any> {
      return this.http.post(`${this.url}/postGuardarDefectosPartida`, partidaCab);
    }    

    postEliminarDefectoRollo(data: any){
      const headers = this.Header;
      return this.http.post(`${this.url}/postEliminarDefectoRollo`, data)
    }
}