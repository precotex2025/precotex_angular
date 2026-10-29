import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';

@Injectable({
    providedIn: 'root'
})
export class NoConformidadesService {
    private baseUrl = GlobalVariable.baseUrlProcesoTenido + 'NoConformidades/';

    constructor(private http: HttpClient) { }

    getDatosInformeCalidad(tipo: string, cod: string = ''): Observable<any[]> {
        const params = new HttpParams().set('tipo', tipo).set('cod', cod);
        return this.http.get<any[]>(`${this.baseUrl}getDatosInformeCalidad`, { params });
    }

    getInformesCabecera(numInforme: string = '', fIni: string = '', fFin: string = '', partida: string = ''): Observable<any[]> {
        const params = new HttpParams()
            .set('numInforme', numInforme)
            .set('fIni', fIni)
            .set('fFin', fFin)
            .set('partida', partida);
        return this.http.get<any[]>(`${this.baseUrl}getInformesCabecera`, { params });
    }

    getPartida(partida: string, tipo: string = ''): Observable<any[]> {
        const params = new HttpParams().set('partida', partida).set('tipo', tipo);
        return this.http.get<any[]>(`${this.baseUrl}getPartida`, { params });
    }

    getInformeDetalle(numInforme: string = '', partida: string = ''): Observable<any[]> {
        const params = new HttpParams().set('numInforme', numInforme).set('partida', partida);
        return this.http.get<any[]>(`${this.baseUrl}getInformeDetalle`, { params });
    }

    getInformeDetalleMotivo(numInforme: string, partida: string = ''): Observable<any[]> {
        const params = new HttpParams().set('numInforme', numInforme).set('partida', partida);
        return this.http.get<any[]>(`${this.baseUrl}getInformeDetalleMotivo`, { params });
    }

    getReporteNoConformidad(fIni: string = '', fFin: string = ''): Observable<any[]> {
        const params = new HttpParams().set('fIni', fIni).set('fFin', fFin);
        return this.http.get<any[]>(`${this.baseUrl}getReporteNoConformidad`, { params });
    }

    getEvolutivo(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}getEvolutivo`);
    }

    guardarInforme(payload: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}guardarInforme`, payload);
    }

    anularInforme(payload: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}anularInforme`, payload);
    }

    getUrlImagen(imageId: string): string {
        if (!imageId) return '';
        return `${this.baseUrl}getImagen?imageId=${encodeURIComponent(imageId.trim())}`;
    }
}

