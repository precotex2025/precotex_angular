import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaProcesoCorteService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  MantenimientoAuditoriaIngresoCorte(Cod_Accion: string, Num_Auditoria: number, Co_CodOrdPro: string, Cod_Auditor: string, Turno: string, Flg_Estado_Tizado: string, Flg_Estado_Tendido: string, Flg_Estado: string, fIni: string, fFin: string) {
    if (!_moment(fIni).isValid()) {
      fIni = '';
    }else{
      fIni = _moment(fIni.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(fFin).isValid()) {
      fFin = '';
    }else{
      fFin = _moment(fFin.valueOf()).format('DD/MM/YYYY');
    }
    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Ingreso_Corte.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Co_CodOrdPro=${Co_CodOrdPro}&Cod_Auditor=${Cod_Auditor}&Turno=${Turno}&Flg_Estado_Tizado=${Flg_Estado_Tizado}&Flg_Estado_Tendido=${Flg_Estado_Tendido}&Flg_Estado=${Flg_Estado}&fIni=${fIni}&fFin=${fFin}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  MantenimientoAuditoriaIngresoCorteComplemento(Cod_Accion: string, Co_CodOrdPro: string, Cod_OrdProv: string,Cod_OrdPro:string,Cod_EstCli: string, Cod_Cliente: string, Des_Cliente: string, Cod_Present: string, Des_Present: string, Des_TipPre: string,Cod_TemCli: string, Nom_TemCli: string, Des_Tela:string, Encogim_molde_t: string, Encogim_molde_h: string, Auditor: string,Fecha_Ingreso: string, Flg_Estado_Tendido:string, Flg_Estado_Tizado: string, Flg_Estado: string, Id: number) {
    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Ingreso_Corte_Complemento.php?Accion=${Cod_Accion}&Co_CodOrdPro=${Co_CodOrdPro}&Cod_OrdProv=${Cod_OrdProv}&Cod_OrdPro=${Cod_OrdPro}&Cod_EstCli=${Cod_EstCli}&Cod_Cliente=${Cod_Cliente}&Des_Cliente=${Des_Cliente}&Cod_Present=${Cod_Present}&Des_Present=${Des_Present}&Des_TipPre=${Des_TipPre}&Cod_TemCli=${Cod_TemCli}&Nom_TemCli=${Nom_TemCli}&Des_Tela=${Des_Tela}&Encogim_molde_t=${Encogim_molde_t}&Encogim_molde_h=${Encogim_molde_h}&Auditor=${Auditor}&Fecha_Ingreso=${Fecha_Ingreso}&Flg_Estado_Tendido=${Flg_Estado_Tendido}&Flg_Estado_Tizado=${Flg_Estado_Tizado}&Flg_Estado=${Flg_Estado}&Cod_Usuario=${this.sCod_Usuario}&Id=${Id}`);
  }

  MantenimientoAuditoriaCorteComplemento(Cod_Accion: string, Co_CodOrdPro: string, Cod_EstPro: string, Cod_Version:string, Id_Auditoria: number) {
    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Corte_Complemento.php?Accion=${Cod_Accion}&Co_CodOrdPro=${Co_CodOrdPro}&Cod_EstPro=${Cod_EstPro}&Cod_Version=${Cod_Version}&Id_Auditoria=${Id_Auditoria}`);
  }

  MantenimientoAuditoriaIngresoCorteObsCalidad(Co_CodOrdPro: string) {
    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Ingreso_Corte_Obs_Calidad.php?Co_CodOrdPro=${Co_CodOrdPro}`);
  }

  MantenimientoAuditoriaIngresoCorteComplementoTizado(dataAuditoriaWithTizado) {
    return this.http.post(`${this.baseUrl}/app_Man_Auditoria_Ingreso_Corte_Complemento_Tizado.php`, dataAuditoriaWithTizado);
  }

  MantenimientoAuditoriaIngresoCorteComplementoTendido(dataAuditoriaWithTendido) {
    return this.http.post(`${this.baseUrl}/app_Man_Auditoria_Ingreso_Corte_Complemento_Tendido.php`, dataAuditoriaWithTendido);
  }

  MantenimientoAuditoriaIngresoCorteComplementoTendidoItem(Cod_Accion: string, IdAuditoria: number, Largo: number,Alto:number,Cantidad: number, Id: number) {
    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Ingreso_Corte_Complemento_Tendido_Item.php?Accion=${Cod_Accion}&IdAuditoria=${IdAuditoria}&Largo=${Largo}&Alto=${Alto}&Cantidad=${Cantidad}&Id=${Id}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  MantenimientoAuditoriaProcesoCorte(Cod_Accion: string, Id_Auditoria: number, Co_CodOrdPro: string, Cod_Auditor: string, Fecha_Auditoria: string, Fecha_Auditoria2: string, Cod_Maquina: string, Par_Velolidad: number, Par_Succion: number, Par_DistanciaAfilado: number, Val_PuntoAnclaje: string, Lote: number, Muestra: number, Turno: string, Observacion: string, Obs_Defectos: string, Flg_Estado_Corte: string, Flg_Estado: string) {
    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '';
    }
    //else{
    //  Fecha_Auditoria = _moment(Fecha_Auditoria.valueOf()).format('yyyy-MM-ddTHH:mm:ss');
    //}

    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '';
    }//else{
    //  Fecha_Auditoria2 = _moment(Fecha_Auditoria2.valueOf()).format('yyyy-MM-ddTHH:mm:ss');
    //}
    
    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Corte_Proceso.php?Accion=${Cod_Accion}&Id_Auditoria=${Id_Auditoria}&Co_CodOrdPro=${Co_CodOrdPro}&Cod_Auditor=${Cod_Auditor}&Fecha_Auditoria=${Fecha_Auditoria}&Fecha_Auditoria2=${Fecha_Auditoria2}&Cod_Maquina=${Cod_Maquina}&Par_Velolidad=${Par_Velolidad}&Par_Succion=${Par_Succion}&Par_DistanciaAfilado=${Par_DistanciaAfilado}&Val_PuntoAnclaje=${Val_PuntoAnclaje}&Lote=${Lote}&Muestra=${Muestra}&Turno=${Turno}&Observacion=${Observacion}&Obs_Defectos=${Obs_Defectos}&Flg_Estado_Corte=${Flg_Estado_Corte}&Flg_Estado=${Flg_Estado}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  MantenimientoAuditoriaProcesoCorteDefecto(Cod_Accion: string, Id_AuditoriaDefecto: number, Id_Auditoria: number, Cod_CompEst: string, Cod_PzaEst: string, Cod_Motivo: string, Tipo: string, Cantidad: number) {

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Proceso_Corte_Defecto.php?Accion=${Cod_Accion}&Id_AuditoriaDefecto=${Id_AuditoriaDefecto}&Id_Auditoria=${Id_Auditoria}&Cod_CompEst=${Cod_CompEst}&Cod_PzaEst=${Cod_PzaEst}&Cod_Motivo=${Cod_Motivo}&Tipo=${Tipo}&Cantidad=${Cantidad}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  MantenimientoAuditoriaFinalCorte(Cod_Accion: string, Id_Auditoria: number, Co_CodOrdPro: string, Num_SecOrd: string, Cod_Auditor: string, Fecha_Auditoria: string, Fecha_Auditoria2: string, Lote: number, Muestra: number, Turno: string, Flg_Estado: string, Observacion: string, Obs_Defectos: string) {
    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '';
    }

    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '';
    }
    
    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Final_Corte.php?Accion=${Cod_Accion}&Id_Auditoria=${Id_Auditoria}&Co_CodOrdPro=${Co_CodOrdPro}&Num_SecOrd=${Num_SecOrd}&Cod_Auditor=${Cod_Auditor}&Fecha_Auditoria=${Fecha_Auditoria}&Fecha_Auditoria2=${Fecha_Auditoria2}&Lote=${Lote}&Muestra=${Muestra}&Turno=${Turno}&Flg_Estado=${Flg_Estado}&Observacion=${Observacion}&Obs_Defectos=${Obs_Defectos}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  MantenimientoAuditoriaFinalCorteComplementoDetalle(data) {
    return this.http.post(`${this.baseUrl}/app_Man_Auditoria_Final_Corte_Complemento_Detalle.php`, data);
  }

  MantenimientoAuditoriaFinalCorteDefecto(Cod_Accion: string, Id_AuditoriaDefecto: number, Id_Auditoria: number, Cod_CompEst: string, Cod_PzaEst: string, Num_Paquete: string, Num_Pieza: number, Cod_Motivo: string, Tipo: string, Cantidad: number) {

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Final_Corte_Defecto.php?Accion=${Cod_Accion}&Id_AuditoriaDefecto=${Id_AuditoriaDefecto}&Id_Auditoria=${Id_Auditoria}&Cod_CompEst=${Cod_CompEst}&Cod_PzaEst=${Cod_PzaEst}&Num_Paquete=${Num_Paquete}&Num_Pieza=${Num_Pieza}&Cod_Motivo=${Cod_Motivo}&Tipo=${Tipo}&Cantidad=${Cantidad}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  MantenimientoAuditoriaFinalCorteComplementoTalla(Cod_Fabrica: string, Cod_OrdPro: string, Num_SecOrd: string) {

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Final_Corte_Complemento_Talla.php?Cod_Fabrica=${Cod_Fabrica}&Cod_OrdPro=${Cod_OrdPro}&Num_SecOrd=${Num_SecOrd}`);
  }

  MantenimientoAuditoriaFinalCorteComplementoPaquete(Cod_Fabrica: string, Cod_OrdPro: string, Num_SecOrd: string) {

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Final_Corte_Complemento_Paquete.php?Cod_Fabrica=${Cod_Fabrica}&Cod_OrdPro=${Cod_OrdPro}&Num_SecOrd=${Num_SecOrd}`);
  }

  MantenimientValidaCorteDespacho(Tipo: string, Cantidad: number, Porcentje: number, Usuario: string) {

    return this.http.get(`${this.baseUrl}/app_Man_USP_ValidaCorteDespacho.php?Tipo=${Tipo}&Cantidad=${Cantidad}&Porcentje=${Porcentje}&Usuario=${Usuario}`);
  }

  MantenimientLiberaOPColor(Tipo: string, Cod_OrdPro: string, Cadena: string, Usuario: string) {

    return this.http.get(`${this.baseUrl}/app_Man_USP_LiberaOPColor.php?Tipo=${Tipo}&Cod_OrdPro=${Cod_OrdPro}&Cadena=${Cadena}&Usuario=${Usuario}`);
  }

}