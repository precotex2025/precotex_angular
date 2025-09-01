import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class InspeccionPrendaService {
  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }


  MantenimientoAuditoriaInspeccionCosturaCabeceraService(Cod_Accion: string, Num_Auditoria: number, Cod_Supervisor: string, Cod_Auditor: string,
    Fecha_Auditoria: string, Fecha_Auditoria2: string, Cod_LinPro: string, Observacion: string, Flg_Status: string, Cod_OrdPro: string, Cod_EstCli: string) {
    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '01/01/1900';
    }
    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '01/01/1900';
    }
    Fecha_Auditoria = _moment(Fecha_Auditoria.valueOf()).format('DD/MM/YYYY');
    Fecha_Auditoria2 = _moment(Fecha_Auditoria2.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Inspeccion_Costura_cab.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Cod_Supervisor=${Cod_Supervisor}&Cod_Auditor=${Cod_Auditor}&Fecha_Auditoria=${Fecha_Auditoria}&Fecha_Auditoria2=${Fecha_Auditoria2}&Cod_LinPro=${Cod_LinPro}&Observacion=${Observacion}&Flg_Status=${Flg_Status}&Cod_Usuario=${this.sCod_Usuario}&Cod_OrdPro=${Cod_OrdPro}&Cod_EstCli=${Cod_EstCli}`);
  }



  CF_MUESTRA_INSPECCION_DEFECTO_FAMILIA(Id: number, Cod_Familia: string) {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_DEFECTO_FAMILIA.php?Id=${Id}&Cod_Familia=${Cod_Familia}`);
  }

  CF_MUESTRA_INSPECCION_DEFECTO_FAMILIA_AUDI(Id: number, Cod_Familia: string) {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_DEFECTO_FAMILIA_AUDI.php?Id=${Id}&Cod_Familia=${Cod_Familia}`);
  }

  CF_MUESTRA_INSPECCION_DEFECTO_FAMILIA_AUDI_JP(Id: number, Cod_Familia: string) {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_DEFECTO_FAMILIA_AUDI_JP.php?Id=${Id}&Cod_Familia=${Cod_Familia}`);
  }

  CF_MUESTRA_INSPECCION_LECTURA_TICKET(Codigo: string) {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_LECTURA_TICKET.php?Codigo=${Codigo}`);
  }

  CF_MUESTRA_INSPECCION_LECTURA_AUDI(Codigo: string) {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_LECTURA_AUDI.php?Codigo=${Codigo}`);
  }

  CF_Man_Inspeccion_Prenda_Web(Cod_Accion: string, Cod_Fabrica: string, Cod_OrdPro: string, Cod_Present: number, Cod_Talla: string, Num_Paquete: string, Prendas_Paq: number, Ticket: string) {
    return this.http.get(`${this.baseUrl}/app_CF_Man_Inspeccion_Prenda_Web.php?Accion=${Cod_Accion}&Cod_Fabrica=${Cod_Fabrica}&Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Cod_Talla=${Cod_Talla}&Prendas_Paq=${Prendas_Paq}&Num_Paquete=${Num_Paquete}&Cod_Usuario=${this.sCod_Usuario}&Ticket=${Ticket}`);
  }

  CF_Man_Inspeccion_Prenda_Web2(Cod_Accion: string, Cod_Fabrica: string, Cod_OrdPro: string, Cod_Present: number, Cod_Talla: string, Num_Paquete: string, Prendas_Paq: number, Ticket: string) {
    return this.http.get(`${this.baseUrl}/app_CF_Man_Inspeccion_Prenda_Web_copia.php?Accion=${Cod_Accion}&Cod_Fabrica=${Cod_Fabrica}&Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Cod_Talla=${Cod_Talla}&Prendas_Paq=${Prendas_Paq}&Num_Paquete=${Num_Paquete}&Cod_Usuario=${this.sCod_Usuario}&Ticket=${Ticket}`);
  }

  CF_Man_Inspeccion_Prenda_Audi_Web(Cod_Accion: string, ID: number, Prendas_Paq: number) {
    return this.http.get(`${this.baseUrl}/app_CF_Man_Inspeccion_Prenda_Audi_Web.php?Accion=${Cod_Accion}&ID=${ID}&Prendas_Paq=${Prendas_Paq}&Cod_Usuario=${this.sCod_Usuario}`);
  }



  CF_Man_Inspeccion_Prenda_Detalle_Web(Cod_Accion: string, Id: number, Tipo_Sub_Proceso: string, Cod_Defecto: string) {
    return this.http.get(`${this.baseUrl}/app_CF_Man_Inspeccion_Prenda_Detalle_Web.php?Accion=${Cod_Accion}&Id=${Id}&Tipo_Sub_Proceso=${Tipo_Sub_Proceso}&Cod_Defecto=${Cod_Defecto}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  CF_Man_Inspeccion_Prenda_Detalle_Audi_Web(Cod_Accion: string, Id: number, Tipo_Sub_Proceso: string, Cod_Defecto: string) {
    return this.http.get(`${this.baseUrl}/app_CF_Man_Inspeccion_Prenda_Detalle_Audi_Web_JP.php?Accion=${Cod_Accion}&Id=${Id}&Tipo_Sub_Proceso=${Tipo_Sub_Proceso}&Cod_Defecto=${Cod_Defecto}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  CF_MUESTRA_INSPECCION_RESUMEN(Id: number) {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_RESUMEN.php?Id=${Id}`);
  }

  CF_MUESTRA_PENDIENTE_RECOGER_HABILITADOR(usuario: string) {
    return this.http.get(`${this.baseUrl}/app_Cf_Muestra_Pendiente_Recoger.php?Nom_Usuario=${usuario}`);
  }

  CF_MUESTRA_INSPECCION_RESUMEN_AUDI(Id: number) {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_RESUMEN_AUDI.php?Id=${Id}`);
  }


  CF_MUESTRA_INSPECCION_EFICIENCIA() {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_EFICIENCIA.php?Cod_Usuario=${this.sCod_Usuario}`);
  }

  CF_MUESTRA_INSPECCION_COLOR(Cod_OrdPro: string) {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_COLOR.php?Cod_OrdPro=${Cod_OrdPro}`)
  }

  CF_MUESTRA_INSPECCION_TALLA(Cod_OrdPro: string, Cod_Present: number) {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_TALLA.php?Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}`)
  }

  CF_MUESTRA_INSPECCION_FAMILIA() {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_FAMILIA.php`)
  }

  CF_MUESTRA_MODULO() {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_MODULO.php`)
  }

  CF_MUESTRA_INSPECCION_RECOJO_PRENDA(Cod_Modulo: string, Cod_Familia: string, Ticket: string, Id_R: number) {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_RECOJO_PRENDA.php?Cod_Modulo=${Cod_Modulo}&Cod_Familia=${Cod_Familia}&Ticket=${Ticket}&Id_R=${Id_R}&Cod_Usuario=${this.sCod_Usuario}`)
  }

  CF_Man_Inspeccion_Prenda_Finalizado_Web(Id: number) {
    return this.http.get(`${this.baseUrl}/app_CF_Man_Inspeccion_Prenda_Finalizado_Web.php?Id=${Id}&Cod_Usuario=${this.sCod_Usuario}`)
  }

  CF_Man_Inspeccion_Prenda_Finalizado_Audi_Web(Id: number, Flg_Estado: string) {
    return this.http.get(`${this.baseUrl}/app_CF_Man_Inspeccion_Prenda_Finalizado_Audi_Web.php?Id=${Id}&Flg_Estado=${Flg_Estado}&Cod_Usuario=${this.sCod_Usuario}`)
  }

  CF_Man_Inspeccion_Recojo_Finalizado_Web(Id_R: number) {
    return this.http.get(`${this.baseUrl}/app_CF_Man_Inspeccion_Recojo_Finalizado_Web.php?Id_R=${Id_R}&Cod_Usuario=${this.sCod_Usuario}`)
  }

  CF_FINALIZAR_TICKET_DERIVADO(Ticket: string) {
    return this.http.get(`${this.baseUrl}/app_CF_FINALIZAR_TICKET_DERIVADO.php?Ticket=${Ticket}&Usuario_Finaliza=${this.sCod_Usuario}`)
  }


  CF_Man_Inspeccion_Prenda_Detalle_Recojo_Web(Cod_Accion: string, Id_R: number, Sec: number, Id: number, Tipo_Proceso: string, Prendas_Recoger: number) {
    return this.http.get(`${this.baseUrl}/app_CF_Man_Inspeccion_Prenda_Detalle_Recojo_Web.php?Accion=${Cod_Accion}&Id_R=${Id_R}&Sec=${Sec}&Id=${Id}&Tipo_Proceso=${Tipo_Proceso}&Prendas_Recoger=${Prendas_Recoger}&Cod_Usuario=${this.sCod_Usuario}`)
  }

  CF_MUESTRA_INSPECCION_RESUMEN_RECOJO(Id_R: number) {
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_INSPECCION_RESUMEN_RECOJO.php?Id_R=${Id_R}`)
  }


}