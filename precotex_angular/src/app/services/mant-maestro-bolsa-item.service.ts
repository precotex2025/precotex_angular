import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MantMaestroBolsaItemService {
  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  obtenerDatos_S(Opcion: string, Id_Bolsa: number, Id_Bolsa_Det: number, Cod_Barra: string, Cod_Almacen_Ult: string , Num_MovStk_Ult: string) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES_ITEM.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Id_Bolsa_Det=${Id_Bolsa_Det}&Cod_Barra=${Cod_Barra}&Cod_Almancen=${Cod_Almacen_Ult}&Num_MovStk=${Num_MovStk_Ult}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  insertarDatos_S(Opcion: string, Id_Bolsa: number, Id_Bolsa_Det: number, Cod_Barra: string, Cod_Almacen_Ult: string , Num_MovStk_Ult: string) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES_ITEM.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Id_Bolsa_Det=${Id_Bolsa_Det}&Cod_Barra=${Cod_Barra}&Cod_Almancen=${Cod_Almacen_Ult}&Num_MovStk=${Num_MovStk_Ult}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  actualizarDatos_S(Opcion: string, Id_Bolsa: number, Id_Bolsa_Det: number, Cod_Barra: string, Cod_Almacen_Ult: string , Num_MovStk_Ult: string) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES_ITEM.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Id_Bolsa_Det=${Id_Bolsa_Det}&Cod_Barra=${Cod_Barra}&Cod_Almancen=${Cod_Almacen_Ult}&Num_MovStk=${Num_MovStk_Ult}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  eliminarDatos_S(Opcion: string, Id_Bolsa: number, Id_Bolsa_Det: number, Cod_Barra: string, Cod_Almacen_Ult: string , Num_MovStk_Ult: string) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES_ITEM.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Id_Bolsa_Det=${Id_Bolsa_Det}&Cod_Barra=${Cod_Barra}&Cod_Almancen=${Cod_Almacen_Ult}&Num_MovStk=${Num_MovStk_Ult}&Cod_Usuario=${this.sCod_Usuario}`);
  }


}
