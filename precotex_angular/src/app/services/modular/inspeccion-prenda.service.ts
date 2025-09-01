import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';

@Injectable({
  providedIn: 'root'
})
export class InspeccionPrendaService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }


  CF_MUESTRA_INSPECCION_LECTURA_TICKET(Ticket: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MUESTRA_INSPECCION_LECTURA_TICKET_MODULAR.php?Ticket=${Ticket}`);
  }

  CF_MUESTRA_MODULO() {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_MODULO.php`)
  }


  CF_MUESTRA_LISTADO_GENERAR_TICKET_WEB(Cod_Modulo: string, Abr_Familia: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MUESTRA_LISTADO_GENERAR_TICKET_WEB.php?Cod_Modulo=${Cod_Modulo}&Abr_Familia=${Abr_Familia}`);
  }

  devuelve_Organico(Cod_OrdPro: string) {
    return this.http.get(`${this.baseUrl}/modular/app_Devuelve_Organico.php?Cod_OrdPro=${Cod_OrdPro}`);
  }

  CF_MUESTRA_LISTADO_GENERADO_TICKET_WEB(Cod_Modulo: string, Abr_Familia: string, sOp: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MUESTRA_LISTADO_GENERADO_TICKET_WEB.php?Cod_Modulo=${Cod_Modulo}&Abr_Familia=${Abr_Familia}&Cod_OrdPro=${sOp}`);
  }

  CF_MUESTRA_MODULAR_PAQUETES_FINALIZADO(Ticket: string, Usuario: string) {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_MODULAR_PAQUETES_FINALIZADO.php?Ticket=${Ticket}&Usuario=${Usuario}`);
  }

  CF_MUESTRA_LISTADO_TICKET_R_WEB(Cod_Modulo: string, Familia: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MUESTRA_LISTADO_TICKET_R_WEB.php?Cod_Modulo=${Cod_Modulo}&Familia=${Familia}`);
  }

  CF_Modular_Control_Ruta_Web(Ticket: string, Tipo:string, Cod_Usuario:string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Control_Ruta_Web.php?Ticket=${Ticket}&Tipo=${Tipo}&Cod_Usuario=${Cod_Usuario}`);
  }

  

  
  

  CF_MODULAR_INSPECCION_PRENDAS(Id: number) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_INSPECCION_PRENDAS.php?Id=${Id}`);
  }

  CF_MODULAR_RESUMEN_POR_RECOJER_INSPECTORA(Cod_Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_RESUMEN_POR_RECOJER_INSPECTORA.php?Cod_Usuario=${Cod_Usuario}`);
  }

  

  CF_Modular_Inspeccion_Prenda_Web(Cod_Accion: string, Cod_Fabrica: string, Cod_OrdPro: string, Cod_Present: number, Cod_Talla: string, Num_Paquete: string, Prendas_Paq: number, Ticket: string, Tipo_Ticket:string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Inspeccion_Prenda_Web.php?Accion=${Cod_Accion}&Cod_Fabrica=${Cod_Fabrica}&Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Cod_Talla=${Cod_Talla}&Prendas_Paq=${Prendas_Paq}&Num_Paquete=${Num_Paquete}&Cod_Usuario=${this.sCod_Usuario}&Ticket=${Ticket}&Tipo_Ticket=${Tipo_Ticket}`);
  }

  CF_MUESTRA_INSPECCION_EFICIENCIA() {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_EFICIENCIA.php?Cod_Usuario=${this.sCod_Usuario}`);
  }

  CF_MUESTRA_GENERACION_TICKET_FAMILIA_WEB(Cod_Fabrica: string, Cod_OrdPro: string, Cod_Present: number, Cod_Talla: string, Cantidad: string, Usuario: string, Cod_Modulo: string, Ruta_Inspeccion: string, Tipo_Ticket:string, Compostura:string, Estampado:string, Zurcido:string, Desmanche:string, Retoque: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MUESTRA_GENERACION_TICKET_FAMILIA_WEB.php?Cod_Fabrica=${Cod_Fabrica}&Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Cod_Talla=${Cod_Talla}&Usuario=${Usuario}&Cantidad=${Cantidad}&Cod_Usuario=${this.sCod_Usuario}&Cod_Modulo=${Cod_Modulo}&Ruta_Inspeccion=${Ruta_Inspeccion}&Tipo_Ticket=${Tipo_Ticket}&Compostura=${Compostura}&Estampado=${Estampado}&Zurcido=${Zurcido}&Desmanche=${Desmanche}&Retoque=${Retoque}`);
  }

  

  CF_Modular_Agregar_Prenda_Web(Accion: string, Id: number, Id_Numero_Prenda: string, Cod_Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Agregar_Prenda_Web.php?Accion=${Accion}&Id=${Id}&Id_Numero_Prenda=${Id_Numero_Prenda}&Cod_Usuario=${Cod_Usuario}`);
  }

  CF_MODULAR_MOVI_INSPECCION_AUTOMATICO(Cod_Modulo: string, Abr_Familia: string, Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_MOVI_INSPECCION_AUTOMATICO.php?Cod_Modulo=${Cod_Modulo}&Abr_Familia=${Abr_Familia}&Usuario=${Usuario}`);
  }

  CF_MODULAR_MOVI_INSPECCION_AUTOMATICO_V2(Cod_Modulo: string, Abr_Familia: string, Usuario: string, Ticket: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_MOVI_INSPECCION_AUTOMATICO_V2.php?Cod_Modulo=${Cod_Modulo}&Abr_Familia=${Abr_Familia}&Usuario=${Usuario}&Ticket=${Ticket}`);
  }

  CF_MODULAR_R_MOVI_INSPECCION_AUTOMATICO(Cod_Modulo: string, Abr_Familia: string, Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_R_MOVI_INSPECCION_AUTOMATICO.php?Cod_Modulo=${Cod_Modulo}&Abr_Familia=${Abr_Familia}&Usuario=${Usuario}`);
  }

  
  

  CF_Modular_Inspeccion_Prenda_Finalizado_Web(Id: number, Cod_Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Inspeccion_Prenda_Finalizado_Web.php?Id=${Id}&Cod_Usuario=${Cod_Usuario}`);
  }

  

  CF_MODULAR_INSPECCION_DEFECTO_FAMILIA(Id: number, Cod_Familia: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_INSPECCION_DEFECTO_FAMILIA.php?Id=${Id}&Cod_Familia=${Cod_Familia}`);
  }

  CF_MODULAR_INSPECCION_RECOJO_PRENDA(Cod_Modulo: string, Ticket: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_INSPECCION_RECOJO_PRENDA.php?Cod_Modulo=${Cod_Modulo}&Ticket=${Ticket}`);
  }

  CF_MODULAR_GUARDAR_RECOJO_PRENDA(data:any) {
    return this.http.post(`${this.baseUrl}/modular/app_CF_MODULAR_GUARDAR_RECOJO_PRENDA.php?Cod_Usuario=${GlobalVariable.vusu}`, data);
  }

  

  //AGREGAR DEFECTO
  CF_Man_Modular_Inspeccion_Detalle_Web(Accion: string, Id: number, Cod_Familia: string, Cod_Defecto: string, Id_Numero_Prenda: string, Defecto_Leve: string, Defecto_Critico: string, Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Man_Modular_Inspeccion_Detalle_Web.php?Accion=${Accion}&Id=${Id}&Cod_Familia=${Cod_Familia}&Cod_Defecto=${Cod_Defecto}&Id_Numero_Prenda=${Id_Numero_Prenda}&Defecto_Leve=${Defecto_Leve}&Defecto_Critico=${Defecto_Critico}&Usuario=${Usuario}`);
  }

  
  CF_MODULAR_LISTADO_GENERAR_TICKET_PARTICION_RETOQUE_WEB(Accion: string, Cod_Modulo: string, NumTicket: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_LISTADO_GENERAR_TICKET_PARTICION_RETOQUE_WEB.php?Accion=${Accion}&Cod_Modulo=${Cod_Modulo}&NumTicket=${NumTicket}&Cod_Usuario=${GlobalVariable.vusu}`);
  }


  CF_MUESTRA_GENERACION_TICKET_PARTICION_RETOQUE_WEB(Ticket_Habilitador: string, Id: string, Cantidad: number, Num_Paquete: string, Tipo_Paquete: string, Ruta_Inspeccion: string, Tipo_Movimiento: string, Compostura:string, Estampado:string, Zurcido:string, Desmanche:string, Retoque: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MUESTRA_GENERACION_TICKET_PARTICION_RETOQUE_WEB.php?Ticket_Habilitador=${Ticket_Habilitador}&Id=${Id}&Cantidad=${Cantidad}&Num_Paquete=${Num_Paquete}&Tipo_Paquete=${Tipo_Paquete}&Ruta_Inspeccion=${Ruta_Inspeccion}&Tipo_Movimiento=${Tipo_Movimiento}&Compostura=${Compostura}&Estampado=${Estampado}&Zurcido=${Zurcido}&Desmanche=${Desmanche}&Retoque=${Retoque}&Usuario=${GlobalVariable.vusu}`);
  }

  CF_MODULAR_MOVI_PARTICION_AUTOMATICO(Cod_Modulo: string, Abr_Familia: string, Usuario: string, Ticket: string, Tipo_Movimiento: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_MOVI_PARTICION_AUTOMATICO.php?Cod_Modulo=${Cod_Modulo}&Abr_Familia=${Abr_Familia}&Usuario=${Usuario}&Ticket=${Ticket}&Tipo_Movimiento=${Tipo_Movimiento}`);
  }  
 

}
