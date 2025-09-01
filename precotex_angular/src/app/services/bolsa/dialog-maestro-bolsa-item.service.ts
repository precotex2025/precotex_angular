import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MantMaestroBolsaItemService {
  baseUrl = GlobalVariable.baseUrl;
  Cod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  obtenerDatos_S(Opcion: string, Id_Bolsa: number, Id_Bolsa_Det: number, Cod_Barra: string, Cod_Almacen_Ult: string , Num_MovStk_Ult: string) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES_ITEM.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Id_Bolsa_Det=${Id_Bolsa_Det}&Cod_Barra=${Cod_Barra}&Cod_Almancen=${Cod_Almacen_Ult}&Num_MovStk=${Num_MovStk_Ult}&Cod_Usuario=${this.Cod_Usuario}`);
  }

  insertarDatos_S(Opcion: string, Id_Bolsa: number, Id_Bolsa_Det: number, Cod_Barra: string, Cod_Almacen_Ult: string , Num_MovStk_Ult: string) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES_ITEM.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Id_Bolsa_Det=${Id_Bolsa_Det}&Cod_Barra=${Cod_Barra}&Cod_Almancen=${Cod_Almacen_Ult}&Num_MovStk=${Num_MovStk_Ult}&Cod_Usuario=${this.Cod_Usuario}`);
  }

  actualizarDatos_S(Opcion: string, Id_Bolsa: number, Id_Bolsa_Det: number, Cod_Barra: string, Cod_Almacen_Ult: string , Num_MovStk_Ult: string) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES_ITEM.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Id_Bolsa_Det=${Id_Bolsa_Det}&Cod_Barra=${Cod_Barra}&Cod_Almancen=${Cod_Almacen_Ult}&Num_MovStk=${Num_MovStk_Ult}&Cod_Usuario=${this.Cod_Usuario}`);
  }

  eliminarDatos_S(Opcion: string, Id_Bolsa: number, Id_Bolsa_Det: number, Cod_Barra: string, Cod_Almacen_Ult: string , Num_MovStk_Ult: string) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES_ITEM.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Id_Bolsa_Det=${Id_Bolsa_Det}&Cod_Barra=${Cod_Barra}&Cod_Almancen=${Cod_Almacen_Ult}&Num_MovStk=${Num_MovStk_Ult}&Cod_Usuario=${this.Cod_Usuario}`);
  }

  obtenerDatos_D(Opcion: string, Id_Bolsa: number, Id_Bolsa_Det: number, Id_Barra: number, Cod_OrdPro: string, Cod_Present: number, Cod_Talla: String, Num_SecOrd: string, Cantidad: number) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES_ITEM_DET.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Id_Bolsa_Det=${Id_Bolsa_Det}&Id_Barra=${Id_Barra}&Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Cod_Talla=${Cod_Talla}&Num_SecOrd=${Num_SecOrd}&Cantidad=${Cantidad}&Cod_Usuario=${this.Cod_Usuario}`);
  }
}