import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoHoraService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;

  sCod_Usuario = GlobalVariable.vusu;

  httpOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };


  constructor(private http: HttpClient) { }


    BuscarAreaService() {
      return this.http.get(`${this.baseUrl}/app_Lg_Man_Area_Web.php`)
    }

    MantenimientoHoraService(data) {
      return this.http.post(`${this.baseUrl}/app_Lg_Man_Upd_Hora_Web_Post.php`,data)
    }

    MantMostrarControlBitacoraService(data) {
      return this.http.post(`${this.baseUrl}/app_Lg_Man_Control_Bitacora_Web.php`,data)
    }
 
    BuscarHoraControl(data) {
      return this.http.post(`${this.baseUrl}/app_Lg_Man_Sel_Hora_Control_Web.php`,data)
    }

}
