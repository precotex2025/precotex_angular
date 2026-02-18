import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from '../../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TomaFotoService {
  baseUrlTinto  = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });
  constructor(private http: HttpClient) { }

  getObtenerNombre(Nro_Dni: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Nro_Dni', Nro_Dni);

    return this.http.get(this.baseUrlTinto + 'TxPersonas/getObtenerNombre', { headers, params });
  }

  getObtenerDatosRegistro(Cam_Mar_Id: number, Nro_Dni: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Id_Marcacion', Cam_Mar_Id);
    params = params.append('Nro_Dni', Nro_Dni);

    return this.http.get(this.baseUrlTinto + 'TxPersonas/getObtenerDatosRegistro', { headers, params });
  }

  getObtenerMarcación1p1() {
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxPersonas/getObtenerMarcación1p1', { headers });
  }

  postRegistrarDniFoto(data: any) {
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxPersonas/postRegistrarDniFoto', data, { headers });
  }

  patchActualizarDniFoto(data: any) {
    const headers = this.Header;
    return this.http.patch(this.baseUrlTinto + 'TxPersonas/patchActualizarDniFoto', data, { headers });
  }

}
