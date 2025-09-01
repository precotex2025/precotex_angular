import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';

import * as _moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class UbicacionHilosAlmacenService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;

  sCod_Usuario = GlobalVariable.vusu;
 
  constructor(private http: HttpClient) { }

  

     mantenimientoBultoService(Cod_Accion: string, nIdNum:number ,nRack:number, nPiso: string, nNicho: number, nCodigo: string){
      return this.http.get(`${this.baseUrl}/app_Tx_Man_Ubicacion_Bultos_Almacen.php?Accion=${Cod_Accion}&Id_num=${nIdNum}&n_Rack=${nRack}&n_Piso=${nPiso}&n_Nicho=${nNicho}&n_Codigo=${nCodigo}&Cod_Usuario=${this.sCod_Usuario}`);
    }

    

}
