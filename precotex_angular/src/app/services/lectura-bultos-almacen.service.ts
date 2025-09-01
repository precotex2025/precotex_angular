import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import { Observable } from 'rxjs';
import { Bulto } from '../models/CodBulto';
import { Ubicacion_Almacen } from '../models/CodUbicacionAlmacen';
import { TranferB } from '../models/TranferBulto';


import * as _moment from 'moment';
 



@Injectable({
  providedIn: 'root'
})
export class LecturaBultosAlmacenService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;

  sCod_Usuario = GlobalVariable.vusu;

  httpOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };


  constructor(private http: HttpClient) { }


    showUbicacionCod(Cod_Accion: string, CodUbicacion: string) {
      return this.http.get(`${this.baseUrl}/app_buscar_ubicacion_almacen.php?Accion=${Cod_Accion}&Cod_Ubicacion=${CodUbicacion}`)
    }

         
    showBultoDato(CodBulto: string, CodLlote: string) {
      return this.http.get(`${this.baseUrl}/app_buscar_bulto_almacen.php?Cod_Bulto=${CodBulto}&Cod_Lote=${CodLlote}`)
    }

    ManBultoAlmacen(Cod_Accion: string, nNum: number, nCorre:string, nIdDetalle: number, nPalet:string ){
      return this.http.get(`${this.baseUrl}/app_man_bulto_ubicacion_almacen.php?Accion=${Cod_Accion}
      &Id_Num=${nNum}&Num_Corre=${nCorre}&dPalet=${nPalet}&Id_Detalle=${nIdDetalle}&Cod_Usuario=${this.sCod_Usuario}&dPalet=${nPalet}`);
    }


    saveTtranferBulto(data) {
      console.log(data);
      return this.http.post(`${this.baseUrl}/app_man_tranfer_bulto_ubicacion.php`,data)
    }




}
