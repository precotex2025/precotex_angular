import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ProduccionArtesInspeccionService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  MantenimientoProduccionArtesInspeccion(Cod_Accion: string, Cod_OrdPro: string, fIni: string,fFin: string) {
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
    return this.http.get(`${this.baseUrl}/app_Man_Produccion_Artes_Inspeccion.php?Accion=${Cod_Accion}&Cod_OrdPro=${Cod_OrdPro}&fIni=${fIni}&fFin=${fFin}&Cod_Usuario=${this.sCod_Usuario}`);
  }
  
  MantenimientoProduccionArtesInspeccionComplemento(Cod_Accion: string, Cod_OrdPro: string, Cod_EstPro: string,Cod_Version: string, Co_CodOrdPro: string, Cod_Present: string, Cod_EstCli: string, Cod_Cliente: string, Tipo_Prenda: string,sFlgStrike: string,sFechaHoraIngreso: string,sFechaHoraEntrega: string,flgSuperAseg: string,flgSuperProd: string, IdProduccionArtes: number) {
    return this.http.get(`${this.baseUrl}/app_Man_Produccion_Artes_Inspeccion_Complemento.php?Accion=${Cod_Accion}&Cod_OrdPro=${Cod_OrdPro}&Cod_EstPro=${Cod_EstPro}&Cod_Version=${Cod_Version}&Co_CodOrdPro=${Co_CodOrdPro}&Cod_Present=${Cod_Present}&Cod_EstCli=${Cod_EstCli}&Cod_Cliente=${Cod_Cliente}&Tipo_Prenda=${Tipo_Prenda}&sFlgStrike=${sFlgStrike}&sFechaHoraIngreso=${sFechaHoraIngreso}&sFechaHoraEntrega=${sFechaHoraEntrega}&flgSuperAseg=${flgSuperAseg}&flgSuperProd=${flgSuperProd}&Cod_Usuario=${this.sCod_Usuario}&IdProduccionArtes=${IdProduccionArtes}`);
  }

  MantenimientoProduccionArtesInspeccionOpciones(dataItemsComposicion) {
    return this.http.post(`${this.baseUrl}/app_Man_Produccion_Artes_Inspeccion_Opciones.php`, dataItemsComposicion);
  }

  MantenimientoProduccionArtesInspeccionActualizarWithOpciones(dataItemsComposicion) {
    return this.http.post(`${this.baseUrl}/app_Man_Produccion_Artes_Inspeccion_Actualizar_With_Opciones.php`, dataItemsComposicion);
  }

  MantenimientoProduccionArtesProcesoInspeccion(Cod_Accion: string, Cod_OrdPro: string, fIni: string,fFin: string, Id_ProcesoArtes: number) {
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
    return this.http.get(`${this.baseUrl}/app_Man_Produccion_Artes_Proceso_Inspeccion.php?Accion=${Cod_Accion}&Cod_OrdPro=${Cod_OrdPro}&fIni=${fIni}&fFin=${fFin}&Id_ProcesoArtes=${Id_ProcesoArtes}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  MantenimientoProduccionArtesProcesoInspeccionComplemento(Cod_Accion: string, Cod_OrdPro: string, Cod_EstPro: string,Cod_Version: string, Co_CodOrdPro: string, Cod_EstCli: string, Cod_Cliente: string,Cod_Present: string,sIdMaquina: string,sIdHorno: string, sVelocidad: string, sTiempo: string,sPresion: string, sTemperatura: string, sOperario: string, sSupervisor: string,sPrendasCant: number,sPiezasCant: number,sPrendasPri: number, sPrendasDef: number, sPrendasRec: number, sPrendasSeg: number, sPrendasEsp: number,sTotalPrenAud: number,sFlgAprobacion: string,flgInspeCalidad: string,flgSuperProd: string, sObservacion: string, sTipoPrenda: string, sHabilitadas: number, sFechaInicio:string, sFechaFin:string, IdProcesoArtes: number) {
    return this.http.get(`${this.baseUrl}/app_Man_Produccion_Artes_Proceso_Inspeccion_Complemento.php?Accion=${Cod_Accion}&Cod_OrdPro=${Cod_OrdPro}&Cod_EstPro=${Cod_EstPro}&Cod_Version=${Cod_Version}&Co_CodOrdPro=${Co_CodOrdPro}&Cod_EstCli=${Cod_EstCli}&Cod_Cliente=${Cod_Cliente}&Cod_Present=${Cod_Present}&sIdMaquina=${sIdMaquina}&sIdHorno=${sIdHorno}&sVelocidad=${sVelocidad}&sTiempo=${sTiempo}&sPresion=${sPresion}&sTemperatura=${sTemperatura}&sOperario=${sOperario}&sSupervisor=${sSupervisor}&sPrendasCant=${sPrendasCant}&sPiezasCant=${sPiezasCant}&sPrendasPri=${sPrendasPri}&sPrendasDef=${sPrendasDef}&sPrendasRec=${sPrendasRec}&sPrendasSeg=${sPrendasSeg}&sPrendasEsp=${sPrendasEsp}&sTotalPrenAud=${sTotalPrenAud}&sFlgAprobacion=${sFlgAprobacion}&flgInspeCalidad=${flgInspeCalidad}&flgSuperProd=${flgSuperProd}&sObservacion=${sObservacion}&sTipoPrenda=${sTipoPrenda}&sHabilitadas=${sHabilitadas}&sFechaInicio=${sFechaInicio}&sFechaFin=${sFechaFin}&Cod_Usuario=${this.sCod_Usuario}&IdProcesoArtes=${IdProcesoArtes}`);
  }

  MantenimientoProduccionArtesProcesoInspeccionOpciones(dataItemsProceso) {
    return this.http.post(`${this.baseUrl}/app_Man_Produccion_Artes_Proceso_Inspeccion_Opciones.php`, dataItemsProceso);
  }

  MantenimientoProduccionArtesProcesoInspeccionDefectos(Cod_Accion: string, Id_ProcesoArtes: number, Id_Defecto: number, Tipo_Defecto: string, Cod_Motivo: string, Cantidad: number) {
    return this.http.get(`${this.baseUrl}/app_Man_Produccion_Artes_Proceso_Inspeccion_Defectos.php?Accion=${Cod_Accion}&Id_ProcesoArtes=${Id_ProcesoArtes}&Id_Defecto=${Id_Defecto}&Tipo_Defecto=${Tipo_Defecto}&Cod_Motivo=${Cod_Motivo}&Cantidad=${Cantidad}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  MantenimientoProduccionArtesProcesoInspeccionOperarios(Cod_Accion: string, Id_ProcesoArtes: number, Tipo_Operario: string, Id_Operario: number, Cod_Operario: string) {
    return this.http.get(`${this.baseUrl}/app_Man_Produccion_Artes_Proceso_Inspeccion_Operarios.php?Accion=${Cod_Accion}&Id_ProcesoArtes=${Id_ProcesoArtes}&Tipo_Operario=${Tipo_Operario}&Id_Operario=${Id_Operario}&Cod_Operario=${Cod_Operario}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  MantenimientoProduccionArtesProcesoInspeccionActualizarWithOpciones(dataItemsProceso) {
    return this.http.post(`${this.baseUrl}/app_Man_Produccion_Artes_Proceso_Inspeccion_Actualizar_With_Opciones.php`, dataItemsProceso);
  }
  
  SM_Presentaciones_OrdPro(op: string){
    return this.http.get(`${this.baseUrl}/app_SM_Presentaciones_OrdPro.php?op=${op}`);
  }

  MantenimientoProduccionArtesSalidaInspeccion(Cod_Accion: string, Cod_OrdPro: string, fIni: string,fFin: string) {
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
    return this.http.get(`${this.baseUrl}/app_Man_Produccion_Artes_Salida_Inspeccion.php?Accion=${Cod_Accion}&Cod_OrdPro=${Cod_OrdPro}&fIni=${fIni}&fFin=${fFin}`);
  }

  MantenimientoProduccionArtesSalidaInspeccionComplemento(Cod_Accion: string, Cod_OrdPro: string, Cod_Cliente: string,sNomCli:string,Cod_EstCli: string, Cod_TemCli: string, Nom_TemCli: string, Cod_Present: string, Des_Present: string, Lote: string, Muestra: number, sRutaPrenda: string, sFechaHoraIngreso:string, sSupervisor: string, sObservacion: string, Cod_Destino: string, Des_Destino: string, Cod_EstPro: string, Flg_Estado_Op:string, IdSalidaArtes: number) {
    return this.http.get(`${this.baseUrl}/app_Man_Produccion_Artes_Salida_Inspeccion_Complemento.php?Accion=${Cod_Accion}&Cod_OrdPro=${Cod_OrdPro}&Cod_Cliente=${Cod_Cliente}&sNomCli=${sNomCli}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Nom_TemCli=${Nom_TemCli}&Cod_Present=${Cod_Present}&Des_Present=${Des_Present}&Lote=${Lote}&Muestra=${Muestra}&sRutaPrenda=${sRutaPrenda}&sFechaHoraIngreso=${sFechaHoraIngreso}&sSupervisor=${sSupervisor}&sObservacion=${sObservacion}&Cod_Destino=${Cod_Destino}&Des_Destino=${Des_Destino}&Cod_EstPro=${Cod_EstPro}&Flg_Estado_Op=${Flg_Estado_Op}&Cod_Usuario=${this.sCod_Usuario}&IdSalidaArtes=${IdSalidaArtes}`);
  }

  MantenimientoProduccionArtesSalidaInspeccionActualizarWithOpciones(dataItemsSalida) {
    return this.http.post(`${this.baseUrl}/app_Man_Produccion_Artes_Salida_Inspeccion_Actualizar_With_Opciones.php`, dataItemsSalida);
  }

  MantenimientoProduccionArtesSalidaInspeccionOpciones(dataItemsWithDefectos) {
    return this.http.post(`${this.baseUrl}/app_Man_Produccion_Artes_Salida_Inspeccion_Opciones.php`, dataItemsWithDefectos);
  }

  MantenimientoProduccionArtesSalidaInspeccionOps(dataItemsOps) {
    return this.http.post(`${this.baseUrl}/app_Man_Produccion_Artes_Salida_Inspeccion_Ops.php`, dataItemsOps);
  }

  Cf_Busca_TemporadaCliente(Cod_Cliente: string,sEstilo:string){
    return this.http.get(`${this.baseUrl}/app_muestra_temporada_cliente.php?Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${sEstilo}`);
  }

  /********************************/
  //Hoja de Ingenieria//
  /********************************/
  MantenimientoHojaIngenieria(Cod_Accion: string, Cod_EstPro: string, fIni: string,fFin: string) {
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
    return this.http.get(`${this.baseUrl}/app_Man_Hoja_Ingenieria_Operaciones.php?Accion=${Cod_Accion}&Cod_EstPro=${Cod_EstPro}&fIni=${fIni}&fFin=${fFin}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  MantenimientoHojaIngenieriaComplemento(Cod_Accion: string, Cod_EstPro: string, Des_EstPro: string,Cod_Version:string,Cod_EstCli: string, Des_EstCli: string, Cod_Cliente: string, Des_Cliente: string, Cod_TipPre: string, Des_TipPre: string,Complejidad: string, Url_Archivo: string, Analista:string, Grupo: string, TipoTela: string, Available: string,Tipo_Estilo:string, Fecha_Ingreso: string, IdHojaIngenieria: number) {
    return this.http.get(`${this.baseUrl}/app_Man_Hoja_Ingenieria_Operaciones_Complemento.php?Accion=${Cod_Accion}&Cod_EstPro=${Cod_EstPro}&Des_EstPro=${Des_EstPro}&Cod_Version=${Cod_Version}&Cod_EstCli=${Cod_EstCli}&Des_EstCli=${Des_EstCli}&Cod_Cliente=${Cod_Cliente}&Des_Cliente=${Des_Cliente}&Cod_TipPre=${Cod_TipPre}&Des_TipPre=${Des_TipPre}&Complejidad=${Complejidad}&Url_Archivo=${Url_Archivo}&Analista=${Analista}&Grupo=${Grupo}&TipoTela=${TipoTela}&Available=${Available}&Tipo_Estilo=${Tipo_Estilo}&Fecha_Ingreso=${Fecha_Ingreso}&Cod_Usuario=${this.sCod_Usuario}&IdHojaIngenieria=${IdHojaIngenieria}`);
  }

  HojaIngenieriaUploadFile(data) {
    return this.http.post(`${this.baseUrl}/app_Man_Hoja_Ingenieria_Operaciones_Upload_Files.php`, data);
  }

  MantenimientoHojaIngenieriaPasos(dataItemsWithPasos) {
    return this.http.post(`${this.baseUrl}/app_Man_Hoja_Ingenieria_Operaciones_Pasos.php`, dataItemsWithPasos);
  }

  MantenimientoHojaIngenieriaActualizarWithOpciones(data) {
    return this.http.post(`${this.baseUrl}/app_Man_Hoja_Ingenieria_Operaciones_Actualizar_With_Pasos.php`, data);
  }


}