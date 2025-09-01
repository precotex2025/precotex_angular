import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaInspeccionCosturaService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  ViewAuditoriaService_Cab(
    nNum_Auditoria: string, sFec_Auditoria: string, sCod_LinPro: string, sCod_Auditor: string, sCod_OrdPro: string, sFlg_Pendiente: string, sFlg_Cerrado: string) {

    if (!_moment(sFec_Auditoria).isValid()) {
      sFec_Auditoria = '01/01/1900';
    }

    sFec_Auditoria = _moment(sFec_Auditoria.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_muestra_auditoria_en_linea_cab_copia.php?Cod_Estilo=${nNum_Auditoria}&Fec_Auditoria=${sFec_Auditoria}&Cod_LinPro=${sCod_LinPro}&Cod_Auditor=${sCod_Auditor}&Cod_OrdPro=${sCod_OrdPro}&Flg_Pendiente=${sFlg_Pendiente}&Flg_Cerrado=${sFlg_Cerrado}&Cod_Usuario=${this.sCod_Usuario}`);
  }

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

  MantAuditoriaInspeccionCosturaCabeceraExtService(Cod_Accion: string, Num_Auditoria: number, Cod_Supervisor: string, Cod_Auditor: string,
    Fecha_Auditoria: string, Fecha_Auditoria2: string, Cod_LinPro: string, Observacion: string, Flg_Status: string, Cod_OrdPro: string, Cod_EstCli: string, Num_Guia: string) {
    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '01/01/1900';
    }
    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '01/01/1900';
    }
    Fecha_Auditoria = _moment(Fecha_Auditoria.valueOf()).format('DD/MM/YYYY');
    Fecha_Auditoria2 = _moment(Fecha_Auditoria2.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Inspeccion_Costura_ext_cab.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Cod_Supervisor=${Cod_Supervisor}&Cod_Auditor=${Cod_Auditor}&Fecha_Auditoria=${Fecha_Auditoria}&Fecha_Auditoria2=${Fecha_Auditoria2}&Cod_LinPro=${Cod_LinPro}&Observacion=${Observacion}&Flg_Status=${Flg_Status}&Cod_Usuario=${this.sCod_Usuario}&Cod_OrdPro=${Cod_OrdPro}&Cod_EstCli=${Cod_EstCli}&Num_Guia=${Num_Guia}`);
  }
  

  MantenimientoAuditoriaInspeccionCosturaComplemento(Cod_Accion: string, Cod_Auditor: string, Nom_Auditor: string, Cod_OrdPro: string, Can_Lote: number, Cod_Motivo: string) {
    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Inspeccion_Costura_Complemento.php?Accion=${Cod_Accion}&Cod_Auditor=${Cod_Auditor}&Nom_Auditor=${Nom_Auditor}&Cod_OrdPro=${Cod_OrdPro}&Can_Lote=${Can_Lote}&Cod_Motivo=${Cod_Motivo}`);
  }

  MantenimientoAuditoriaInspeccionCosturaDetalleService(Cod_Accion: string, Num_Auditoria_Detalle: number, Num_Auditoria: number, Cod_Inspector: string,
    Cod_OrdPro: string, Cod_Cliente: string, Cod_EstCli: string, Cod_Present: string, Can_Lote: number, Can_Muestra: number, Observacion: string, Flg_Status: string, Flg_Reproceso: string, Flg_Reproceso_Num: number,Co_CodOrdPro: string, Num_Paquete: string) {

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Inspeccion_Costura_det.php?Accion=${Cod_Accion}&Num_Auditoria_Detalle=${Num_Auditoria_Detalle}&Num_Auditoria=${Num_Auditoria}&Cod_Inspector=${Cod_Inspector}&Cod_OrdPro=${Cod_OrdPro}&Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${Cod_EstCli}&Cod_Present=${Cod_Present}&Can_Lote=${Can_Lote}&Can_Muestra=${Can_Muestra}&Observacion=${Observacion}&Flg_Status=${Flg_Status}&Cod_Usuario=${this.sCod_Usuario}&Flg_Reproceso=${Flg_Reproceso}&Flg_Reproceso_Num=${Flg_Reproceso_Num}&Co_CodOrdPro=${Co_CodOrdPro}&Num_Paquete=${Num_Paquete}`);
  }

  MantenimientoAuditoriaInspeccionCosturaSubDetalleService(Cod_Accion: string, Num_Auditoria_Sub_Detalle: number, Num_Auditoria_Detalle: number, Cod_Motivo: string,
    Cantidad: number) {

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Inspeccion_Costura_sub_det.php?Accion=${Cod_Accion}&Num_Auditoria_Sub_Detalle=${Num_Auditoria_Sub_Detalle}&Num_Auditoria_Detalle=${Num_Auditoria_Detalle}&Cod_Motivo=${Cod_Motivo}&Cantidad=${Cantidad}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  
  BuscarLineaExtService() {
    return this.http.get(`${this.baseUrl}/app_buscar_linea_servicio.php`);
  }
  
  cargarImagenes(data) { 
    return this.http.post(`${this.baseUrl}/app_Man_Auditoria_Inspeccion_Costura_det_imagen.php`, data);
  }

  cargarImagenesFirmas(data) { 
    return this.http.post(`${this.baseUrl}/app_TG_Regsitro_Fimas.php`, data);
  }
 
  cargarImagenInspeccion(data) { 
    return this.http.post(`${this.baseUrl}/app_Lg_Man_Auditoria_Inspeccion_Imagen.php`, data);
  }

  cargarImagenesAuditoriaFinal(data) { 
    return this.http.post(`${this.baseUrl}/app_CC_MAN_AUDITORIA_INSPECCION_COSTURA_DETALLE_IMAGEN.php`, data);
  } 
  
  cargarObservaciones(data) {
    return this.http.post(`${this.baseUrl}/app_Cc_Man_Auditoria_Inspeccion_Costura_Despachar.php`,data);
  }

  cargarIndicadores(data) {
    return this.http.post(`${this.baseUrl}/app_Cc_Man_Auditoria_Inspeccion_Costura_Despachar.php`,data);
  }
 
  DespacharProduccion(data) {
    return this.http.post(`${this.baseUrl}/app_Cc_Man_Auditoria_Inspeccion_Costura_Despachar.php`,data);
  }
 
  BuscarAuditoriaFinalExternaService(Cod_Accion: string, Num_Auditoria: number, Cod_Supervisor: string, Cod_Auditor: string,
    Fecha_Auditoria: string, Fecha_Auditoria2: string, Cod_LinPro: string, Observacion: string, Flg_Status: string, Cod_OrdPro: string, Cod_EstCli: string) {
    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '01/01/1900';
    }
    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '01/01/1900';
    }
    Fecha_Auditoria = _moment(Fecha_Auditoria.valueOf()).format('DD/MM/YYYY');
    Fecha_Auditoria2 = _moment(Fecha_Auditoria2.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Inspeccion_Costura_Reversion.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Cod_Supervisor=${Cod_Supervisor}&Cod_Auditor=${Cod_Auditor}&Fecha_Auditoria=${Fecha_Auditoria}&Fecha_Auditoria2=${Fecha_Auditoria2}&Cod_LinPro=${Cod_LinPro}&Observacion=${Observacion}&Flg_Status=${Flg_Status}&Cod_Usuario=${this.sCod_Usuario}&Cod_OrdPro=${Cod_OrdPro}&Cod_EstCli=${Cod_EstCli}`);
  }
  
  RevertirDetalleAuditoria(data) {
    return this.http.post(`${this.baseUrl}/app_Cc_Man_Auditoria_Inspeccion_Costura_Reversion_Det.php`,data);
  }

  VerificarAuditoria(data) {
    return this.http.post(`${this.baseUrl}/app_Verificar_Auditoria_Inspeccion_Costura_ext_cab.php`,data);
  }  
  Mant_AuditoriaChecklistIngresoCosturaCabService(Cod_Accion: string, Num_Auditoria: number, Cod_Supervisor: string, Cod_Auditor: string,
    Fecha_Auditoria: string, Fecha_Auditoria2: string, Cod_LinPro: string, Observacion: string, Flg_Status: string, Cod_OrdPro: string, Cod_OrdCor: string) {
    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '01/01/1900';
    }
    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '01/01/1900';
    }
    Fecha_Auditoria = _moment(Fecha_Auditoria.valueOf()).format('DD/MM/YYYY');
    Fecha_Auditoria2 = _moment(Fecha_Auditoria2.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Cc_Man_Auditoria_Checklist_Ingreso_Costura_Cab.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Cod_Supervisor=${Cod_Supervisor}&Cod_Auditor=${Cod_Auditor}&Fecha_Auditoria=${Fecha_Auditoria}&Fecha_Auditoria2=${Fecha_Auditoria2}&Cod_LinPro=${Cod_LinPro}&Observacion=${Observacion}&Flg_Status=${Flg_Status}&Cod_Usuario=${this.sCod_Usuario}&Cod_OrdPro=${Cod_OrdPro}&Cod_OrdCor=${Cod_OrdCor}`);
  }

  AuditoriaChecklistIngresoCosturaComplemento(Cod_Accion: string, Cod_Auditor: string, Nom_Auditor: string, Cod_OrdPro: string, Can_Lote: number, Cod_Motivo: string, Cod_OrdCor: string) {
    return this.http.get(`${this.baseUrl}/app_Cc_Man_Auditoria_Checklist_Ingreso_Costura_Complemento.php?Accion=${Cod_Accion}&Cod_Auditor=${Cod_Auditor}&Nom_Auditor=${Nom_Auditor}&Cod_OrdPro=${Cod_OrdPro}&Can_Lote=${Can_Lote}&Cod_Motivo=${Cod_Motivo}&Cod_OrdCor=${Cod_OrdCor}`);
  }

  Mant_AuditoriaChecklistIngresoCosturaDetService(data) {
    return this.http.post(`${this.baseUrl}/app_Cc_Man_Auditoria_Checklist_Ingreso_Costura_Det.php`,data);
  }
  
  MantenimientoAuditoriaChecklistDetDefectosService(Cod_Accion: string, Num_Auditoria_Defecto: number, Num_Auditoria_Detalle: number, Cod_Motivo: string,
    Cantidad: number) {

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Checklist_Ingreso_Costura.php?Accion=${Cod_Accion}&Num_Auditoria_Defecto=${Num_Auditoria_Defecto}&Num_Auditoria_Detalle=${Num_Auditoria_Detalle}&Cod_Motivo=${Cod_Motivo}&Cantidad=${Cantidad}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  BuscarLineaCosturaService() {
    return this.http.get(`${this.baseUrl}/app_buscar_linea_costura.php`);
  }

  ActualizarChecklistCosturaDetalle(data) {
    return this.http.post(`${this.baseUrl}/app_Cc_Man_Auditoria_Checklist_Ingreso_Costura_Det.php`,data);
  }
  /*
  RegistrarFirmaAuditoria(Cod_Accion: string, Num_Auditoria_Detalle: number, Num_Auditoria: number, Cod_OrdPro: string, Imagen64: string) {

    return this.http.get(`${this.baseUrl}/app_TG_Fima_Digital.php?Accion=${Cod_Accion}&Num_Auditoria_Detalle=${Num_Auditoria_Detalle}&Num_Auditoria=${Num_Auditoria}&Cod_OrdPro=${Cod_OrdPro}&Imagen64=${Imagen64}&Cod_Usuario=${this.sCod_Usuario}`);
  }*/

  RegistrarFirmaAuditoria(data) {
    return this.http.post(`${this.baseUrl}/app_TG_Fima_Digital.php`,data);
  }
}