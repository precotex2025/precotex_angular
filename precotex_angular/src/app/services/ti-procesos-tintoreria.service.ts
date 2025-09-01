import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiProcesosTintoreriaService {
  UrlBase: string = GlobalVariable.baseUrlProcesoTenido + "TiProcesosTintoreria/";
  sCod_Usuario = GlobalVariable.vusu;
  //TiProcesosTintoreria/getListaEstatusControlTenido

  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });

  constructor(private http: HttpClient) { }

    getListaEstatusControlTenido(sCodPartida: string, sFecha_Inicio: string, sFecha_Fin: string){
      const headers = this.Header;
      let params = new HttpParams();

      params = params.append('Cod_Ordtra', sCodPartida!);
      params = params.append('Cod_Usuario', this.sCod_Usuario);

      if (!_moment(sFecha_Inicio).isValid()) {
        params = params.append('Fecha_Ini', '');
      }else{
        params = params.append('Fecha_Ini', _moment(sFecha_Inicio.valueOf()).format('YYYY-MM-DD'));
      }
  
      if (!_moment(sFecha_Fin).isValid()) {
        params = params.append('Fecha_Fin', '');
      }else{
        params = params.append('Fecha_Fin', _moment(sFecha_Fin.valueOf()).format('YYYY-MM-DD'));
      }
      
      return this.http.get(this.UrlBase + 'getListaEstatusControlTenido', { headers, params });
    }

    getObtieneMuestraControlProceso(sCodPartida: string, sFecha_Inicio: Date, sFecha_Fin: Date){
      const headers = this.Header;
      let params = new HttpParams();

      params = params.append('Cod_Ordtra', sCodPartida!);
      params = params.append('Fecha_Ini', _moment(sFecha_Inicio.valueOf()).format('YYYY-MM-DD'));
      params = params.append('Fecha_Fin', _moment(sFecha_Fin.valueOf()).format('YYYY-MM-DD'));

      return this.http.get(this.UrlBase + 'getObtieneMuestraControlProceso', { headers, params });
    }

    getListaDetalleToberaPruebaTenido(sCodPartida: string, IdOrgatexUnico: string){
      const headers = this.Header;
      let params = new HttpParams();
      params = params.append('Cod_Ordtra', sCodPartida!);
      params = params.append('IdOrgatexUnico', IdOrgatexUnico!);

      return this.http.get(this.UrlBase + 'getListaDetalleToberaPruebaTenido', { headers, params });
    }

    GetImageBase64FromUrlAsync(imageUrl: string): Observable<{ base64Image: string }> {
      const headers = this.Header;
      let params = new HttpParams();
      params = params.append('imageUrl', imageUrl!);
    
      return this.http.get<{ base64Image: string }>(this.UrlBase + 'GetImageBase64FromUrlAsync', { headers, params });
    }        
}
