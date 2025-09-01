import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from 'src/app/VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MantMaestroBolsaItemDetService {
  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(
    private http: HttpClient
  ) { }

  obtenerDatos_D(Opcion: string, Id_Bolsa: number, Id_Bolsa_Det: number, Id_Barra: number, Cod_OrdPro: string, Cod_Present: number, Cod_Talla: String, Num_SecOrd: string, Cantidad: number, Cod_Item?: string) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES_ITEM_DET.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Id_Bolsa_Det=${Id_Bolsa_Det}&Id_Barra=${Id_Barra}&Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Cod_Talla=${Cod_Talla}&Num_SecOrd=${Num_SecOrd}&Cantidad=${Cantidad}&Cod_Item=${Cod_Item}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  Cf_Busca_OP_Color(Cod_OrdPro: string){
    return this.http.get(`${this.baseUrl}/app_SM_Presentaciones_OrdPro.php?op=${Cod_OrdPro}`);
  }

  obtenerPlanilla_OP(Cod_OrdPro: string, Cod_Present: number) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_Obtener_Planilla_OP_Present.php?Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  obtenerItem_OP(Cod_Fabrica: string, Cod_OrdPro: string) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_Obtener_Item_OP_Sec.php?Cod_Fabrica=${Cod_Fabrica}&Cod_OrdPro=${Cod_OrdPro}&Cod_Usuario=${this.sCod_Usuario}`);
  }
}