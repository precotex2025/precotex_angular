import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';

import * as _moment from 'moment';

@Injectable({
  providedIn: 'root' 
})
export class DigitalizacionFichasService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;

  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  obtenerPdfByte(data) { 
    return this.http.post(`${this.baseUrl}/app_Lg_Man_Digitalizacion_Fichas.php`, data);
  }
  cargarTipoImpresion() { 
    return this.http.get(`${this.baseUrl}/app_cargar_tipo_impresion.php`);
  }
}
