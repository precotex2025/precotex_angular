import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DialogMaestroBolsaTransService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  obtenerDatos_Trans(Opcion: string, Id_Bolsa: number, Id_Bolsa_Det: number, Id_Barra: number, Cod_Barra_Destino: string, Cantidad: number) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES_ITEM_TRANS.php?Opcion=${Opcion}
    &Id_Bolsa=${Id_Bolsa}&Id_Bolsa_Det=${Id_Bolsa_Det}&Id_Barra=${Id_Barra}&Cod_Barra_Destino=${Cod_Barra_Destino}&Cantidad=${Cantidad}&sCod_Usuario=${this.sCod_Usuario}`);
  }

  grabarDatos_Trans(data: any) {
    return this.http.post(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES_ITEM_TRANS_2.php`, data);
  }
}