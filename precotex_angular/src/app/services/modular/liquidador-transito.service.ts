import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';

@Injectable({
  providedIn: 'root'
})
export class LiquidadorTransitoService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  GNRAR_TICKET_INSPECCION_ACABADOS(Cod_OrdPro: string, Cod_Present: Number, Tipo:string, Opcion) {
    return this.http.get(`${this.baseUrl}/modular/app_GNRAR_TICKET_INSPECCION_ACABADOS.php?Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Tipo=${Tipo}&Opcion=${Opcion}`);
  }

  devuelve_Organico(Cod_OrdPro: string) {
    return this.http.get(`${this.baseUrl}/modular/app_Devuelve_Organico.php?Cod_OrdPro=${Cod_OrdPro}`);
  }

  CS_GENERA_ARCHIVO_TICKETS_TOTAL_PRENDAS_INSP_ACABADO(Cod_OrdPro: string, Cod_Present: Number, LISTA_PAQUETES_INI:string, TIPO_VARIANTE:string, COD_PLANTA: string, USUARIO:string) {
    return this.http.get(`${this.baseUrl}/modular/app_CS_GENERA_ARCHIVO_TICKETS_TOTAL_PRENDAS_INSP_ACABADO.php?Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&LISTA_PAQUETES_INI=${LISTA_PAQUETES_INI}&TIPO_VARIANTE=${TIPO_VARIANTE}&COD_PLANTA=${COD_PLANTA}&USUARIO=${USUARIO}`);
  }

  SM_MUESTRA_PAQUETES_A_IMPRIMIR_PRENDAS_INSPECCION_NEW(Cod_Fabrica:string, Cod_OrdPro:string, Cod_Tarifado:string, Cod_Variante_Tarifado:string, Des_Present:string, Option:string, Cod_Planta:string, Cod_Present:string, Usuario:string) {
    return this.http.get(`${this.baseUrl}/modular/app_SM_MUESTRA_PAQUETES_A_IMPRIMIR_PRENDAS_INSPECCION_NEW.php?Cod_Fabrica=${Cod_Fabrica}&Cod_OrdPro=${Cod_OrdPro}&Cod_Tarifado=${Cod_Tarifado}&Cod_Variante_Tarifado=${Cod_Variante_Tarifado}&Des_Present=${Des_Present}&Option=${Option}&Cod_Planta=${Cod_Planta}&Cod_Present=${Cod_Present}&Usuario=${Usuario}`);
  }

  

  CF_MUESTRA_DETALLE_PAQUETES(Cod_Fabrica:string, Cod_OrdPro: string, Cod_Present: string, Cod_Almacen: string, Cod_Talla:string, Opcion:string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MUESTRA_DETALLE_PAQUETES.php?Cod_Fabrica=${Cod_Fabrica}&Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Cod_Almacen=${Cod_Almacen}&Cod_Talla=${Cod_Talla}&Opcion=${Opcion}`);
  }

  

  CF_Modular_Muestra_Ticket_Inspeccion(Opcion: string, Ticket: string, Cantidad: any) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Muestra_Ticket_Inspeccion.php?Opcion=${Opcion}&Ticket=${Ticket}&Cantidad=${Cantidad}`);
  }

  CF_Modular_Liquida_Adicionales(Opcion: string, Ticket: string, Cantidad: any, Num_Movstk: string, Usuario: any, TipMov:string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Liquida_Adicionales.php?Opcion=${Opcion}&Ticket=${Ticket}&Cantidad=${Cantidad}&Num_Movstk=${Num_Movstk}&Usuario=${Usuario}&TipMov=${TipMov}`);
  }

  CF_Modular_Liquida_Adicionales_Post(data:any) {
    return this.http.post(`${this.baseUrl}/modular/app_CF_Modular_Liquida_Adicionales_Post.php?`, data);
  }

  

  CF_MAN_GENERAR_CF_ORDPRO_PAQ_PRENDAS_INSPECCION_NEW(data:any) {
    return this.http.post(`${this.baseUrl}/modular/app_CF_MAN_GENERAR_CF_ORDPRO_PAQ_PRENDAS_INSPECCION_NEW.php`, data);
  }

  

  CF_Obtener_TicketAcb(Cod_Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Obtener_TicketAcb.php?Cod_Usuario=${Cod_Usuario}`);
  }

  //MOVIMIENTO AL 53
  SM_MUESTRA_PAQUETES_A_MOVIMIENTO_NEW(Cod_Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_SM_MUESTRA_PAQUETES_A_MOVIMIENTO_NEW.php?Cod_Usuario=${Cod_Usuario}`);
  }

  

  SM_MUESTRA_Cod_OrdPro(Cod_Fabrica: string, Cod_OrdPro: any) {
    return this.http.get(`${this.baseUrl}/modular/app_SM_MUESTRA_Cod_OrdPro.php?Cod_Fabrica=${Cod_Fabrica}&Cod_OrdPro=${Cod_OrdPro}`);
  }

  
}
