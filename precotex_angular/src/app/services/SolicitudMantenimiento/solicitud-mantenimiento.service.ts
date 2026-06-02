import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from '../../VarGlobals';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudMantenimientoService {
  baseUrlTinto  = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });
  constructor(private http: HttpClient) { }


  getObtieneInformacionSolicitudMantenimiento(FecIni, FecFin, codUsuario: string){
    
    if (!_moment(FecIni).isValid()) {
      FecIni = '';
    } else {
      FecIni = _moment(FecIni.valueOf()).format('MM/DD/YYYY');
    }

    if (!_moment(FecFin).isValid()) {
      FecFin = '';
    } else {
      FecFin = _moment(FecFin.valueOf()).format('MM/DD/YYYY');
    }

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('FecIni', FecIni);
    params = params.append('FecFin', FecFin);
    params = params.append('codUsuario', codUsuario);

    return this.http.get(this.baseUrlTinto + 'TMSolicitudMantenimiento/getObtieneInformacionSolicitudMantenimiento', { headers, params });
  }    

  getObtieneInformacionMaquinas(sCodMaquina){

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('sCodMaquina', sCodMaquina);

    return this.http.get(this.baseUrlTinto + 'TMSolicitudMantenimiento/getObtieneInformacionMaquinas', { headers, params });
  }    

  getObtieneInformacionSolicitudesVisor(sCodUsuario){

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('sCodUsuario', sCodUsuario);

    return this.http.get(this.baseUrlTinto + 'TMSolicitudMantenimiento/getObtieneInformacionSolicitudesVisor', { headers, params });
  }

  postProcesoMntoSolicitudMantenimiento(data: any){
    return this.http.post(this.baseUrlTinto + 'TMSolicitudMantenimiento/postProcesoMntoSolicitudMantenimiento', data)
  }  

  postAvanzaEstadoSolicitudMantenimiento(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TMSolicitudMantenimiento/postAvanzaEstadoSolicitudMantenimiento', data, { headers })
  }  

  //IMAGENES
  private bas = 'https://gestion.precotex.com:444/ubicaciones/api/TxRetiroRepuestos/getImagenDesdeBackEnd';
  
  getImagenUrl(imageId: string): string {
    return `${this.bas}?imageId=${encodeURIComponent(imageId)}`;
  }

  postProcesoMntoTiempoManMquina(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TMSolicitudMantenimiento/postProcesoMntoTiempoManMquina', data, { headers })
  }   

}
