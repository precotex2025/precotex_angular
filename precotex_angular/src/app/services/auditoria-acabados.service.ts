import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class AuditoriaAcabadosService {

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



  AuditoriaHojaMedidaComplementoService(Cod_Accion: string, Cod_Cliente: string, Cod_EstCli: string, Cod_EstPro: String, Cod_Version: string) {
    return this.http.get(`${this.baseUrl}/app_Auditoria_Hoja_Medida_Complemento.php?Accion=${Cod_Accion}&Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${Cod_EstCli}&Cod_EstPro=${Cod_EstPro}&Cod_Version=${Cod_Version}`);
  }

  AuditoriaHojaMedidaPrendaService(Cod_Accion: string, Cod_Cliente: string, Cod_EstCli: string, Cod_OrdPro: string) {
    return this.http.get(`${this.baseUrl}/app_Auditoria_Hoja_Medida_Prenda.php?Accion=${Cod_Accion}&Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${Cod_EstCli}&Cod_OrdPro=${Cod_OrdPro}`);
  }

  ObtenerAuditoriaHojaMedida(Cod_EstPro: string, Cod_Version: string, Opcion?:string) {
    return this.http.get(`${this.baseUrl}/app_CC_OBTENER_HOJAS_MEDIDA.php?Cod_EstPro=${Cod_EstPro}&Cod_Version=${Cod_Version}&Opcion=${Opcion}`);
  }

  

  AuditoriaHojaMedidaVersionesService(Cod_Accion: string, Cod_EstPro: string) {
    return this.http.get(`${this.baseUrl}/app_Auditoria_Hoja_Medida_Versiones.php?Accion=${Cod_Accion}&Cod_EstPro=${Cod_EstPro}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  AuditoriaHojaMedidaCargaMedidaService(Cod_EstPro: string, Cod_Version: string, Cod_OrdPro: string, Cod_Hoja_Medida_Cab: number) {
    return this.http.get(`${this.baseUrl}/app_Auditoria_Hoja_Medida_Carga_Medida.php?Cod_EstPro=${Cod_EstPro}&Cod_Version=${Cod_Version}&Cod_OrdPro=${Cod_OrdPro}&Cod_Hoja_Medida_Cab=${Cod_Hoja_Medida_Cab}`);
  }

  AuditoriaHojaMedidaCargaMedidaServiceInsp(Cod_EstPro: string, Cod_Version: string, Cod_OrdPro: string, Cod_Hoja_Medida_Cab: number) {
    return this.http.get(`${this.baseUrl}/app_Auditoria_Hoja_Medida_Carga_Medida_Insp.php?Cod_EstPro=${Cod_EstPro}&Cod_Version=${Cod_Version}&Cod_OrdPro=${Cod_OrdPro}&Cod_Hoja_Medida_Cab=${Cod_Hoja_Medida_Cab}`);
  }




  MantenimientoAuditoriaInspeccionCosturaDetalleService(Cod_Accion: string, Num_Auditoria_Detalle: number, Num_Auditoria: number, Cod_Inspector: string,
    Cod_OrdPro: string, Cod_Cliente: string, Cod_EstCli: string, Cod_Present: string, Can_Lote: number, Can_Muestra: number, Observacion: string, Flg_Status: string, Flg_Reproceso: string, Flg_Reproceso_Num: number) {

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Inspeccion_Costura_det.php?Accion=${Cod_Accion}&Num_Auditoria_Detalle=${Num_Auditoria_Detalle}&Num_Auditoria=${Num_Auditoria}&Cod_Inspector=${Cod_Inspector}&Cod_OrdPro=${Cod_OrdPro}&Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${Cod_EstCli}&Cod_Present=${Cod_Present}&Can_Lote=${Can_Lote}&Can_Muestra=${Can_Muestra}&Observacion=${Observacion}&Flg_Status=${Flg_Status}&Cod_Usuario=${this.sCod_Usuario}&Flg_Reproceso=${Flg_Reproceso}&Flg_Reproceso_Num=${Flg_Reproceso_Num}`);
  }

  MantenimientoAuditoriaInspeccionCosturaSubDetalleService(Cod_Accion: string, Num_Auditoria_Sub_Detalle: number, Num_Auditoria_Detalle: number, Cod_Motivo: string,
    Cantidad: number) {

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Inspeccion_Costura_sub_det.php?Accion=${Cod_Accion}&Num_Auditoria_Sub_Detalle=${Num_Auditoria_Sub_Detalle}&Num_Auditoria_Detalle=${Num_Auditoria_Detalle}&Cod_Motivo=${Cod_Motivo}&Cantidad=${Cantidad}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  MantenimientoAuditoriaAcabadosCabecera(Cod_Accion: string, Cod_Hoja_Medida_Cab: number, Cod_OrdPro: string, Cod_ColCli: string, Cod_Cliente: string, Cod_EstCli: string,
    Cod_TemCli: string, Cod_EstPro: string, Cod_Version: string, Cod_LinPro: string, Cod_Supervisor: string, Cod_Auditor: string,
    Observaciones: string, Flg_Estado: string, Fecha1: string, Fecha2: string, Sec: number, Tipo: string) {

    if (!_moment(Fecha1).isValid()) {
      Fecha1 = '01/01/1900';
    }
    if (!_moment(Fecha2).isValid()) {
      Fecha2 = '01/01/1900';
    }
    Fecha1 = _moment(Fecha1.valueOf()).format('DD/MM/YYYY');
    Fecha2 = _moment(Fecha2.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Hoja_Medida_Acabados_Cab.php?Accion=${Cod_Accion}&Cod_Hoja_Medida_Cab=${Cod_Hoja_Medida_Cab}&Cod_OrdPro=${Cod_OrdPro}&Cod_ColCli=${Cod_ColCli}&Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Cod_EstPro=${Cod_EstPro}&Cod_Version=${Cod_Version}&Cod_LinPro=${Cod_LinPro}&Cod_Supervisor=${Cod_Supervisor}&Cod_Auditor=${Cod_Auditor}&Observaciones=${Observaciones}&Flg_Estado=${Flg_Estado}&Cod_Usuario=${this.sCod_Usuario}&Fecha1=${Fecha1}&Fecha2=${Fecha2}&Sec=${Sec}&Tipo=${Tipo}`);
  }

  MantenimientoAuditoriaHojaMedidaCabeceraExt(Cod_Accion: string, Cod_Hoja_Medida_Cab: number, Cod_OrdPro: string, Cod_ColCli: string, Cod_Cliente: string, Cod_EstCli: string,
    Cod_TemCli: string, Cod_EstPro: string, Cod_Version: string, Cod_LinPro: string, Cod_Supervisor: string, Cod_Auditor: string,
    Observaciones: string, Flg_Estado: string, Fecha1: string, Fecha2: string, Sec: number) {

    if (!_moment(Fecha1).isValid()) {
      Fecha1 = '01/01/1900';
    }
    if (!_moment(Fecha2).isValid()) {
      Fecha2 = '01/01/1900';
    }
    Fecha1 = _moment(Fecha1.valueOf()).format('DD/MM/YYYY');
    Fecha2 = _moment(Fecha2.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Hoja_Medida_Cab_Ext.php?Accion=${Cod_Accion}&Cod_Hoja_Medida_Cab=${Cod_Hoja_Medida_Cab}&Cod_OrdPro=${Cod_OrdPro}&Cod_ColCli=${Cod_ColCli}&Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Cod_EstPro=${Cod_EstPro}&Cod_Version=${Cod_Version}&Cod_LinPro=${Cod_LinPro}&Cod_Supervisor=${Cod_Supervisor}&Cod_Auditor=${Cod_Auditor}&Observaciones=${Observaciones}&Flg_Estado=${Flg_Estado}&Cod_Usuario=${this.sCod_Usuario}&Fecha1=${Fecha1}&Fecha2=${Fecha2}&Sec=${Sec}`);
  }

  BuscarLineaExtService() {
    return this.http.get(`${this.baseUrl}/app_buscar_linea_servicio.php`);
  }

  MantenimientoAuditoriaHojaMedidaCabeceraInsp(Cod_Accion: string, Cod_Hoja_Medida_Cab: number, Cod_OrdPro: string, Cod_ColCli: string, Cod_Cliente: string, Cod_EstCli: string,
    Cod_TemCli: string, Cod_EstPro: string, Cod_Version: string, Cod_LinPro: string, Cod_Supervisor: string, Cod_Auditor: string,
    Observaciones: string, Flg_Estado: string, Fecha1: string, Fecha2: string, Tipo_Prenda: string, Temporada:string, Lin_Pro:string, Cod_OrdPro2: string, Cod_EstCli2, Sec) {

    if (!_moment(Fecha1).isValid()) {
      Fecha1 = '01/01/1900';
    }
    if (!_moment(Fecha2).isValid()) {
      Fecha2 = '01/01/1900';
    }
    Fecha1 = _moment(Fecha1.valueOf()).format('DD/MM/YYYY');
    Fecha2 = _moment(Fecha2.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Hoja_Medida_Cab_Insp.php?Accion=${Cod_Accion}&Cod_Hoja_Medida_Cab=${Cod_Hoja_Medida_Cab}&Cod_OrdPro=${Cod_OrdPro}&Cod_ColCli=${Cod_ColCli}&Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Cod_EstPro=${Cod_EstPro}&Cod_Version=${Cod_Version}&Cod_LinPro=${Cod_LinPro}&Cod_Supervisor=${Cod_Supervisor}&Cod_Auditor=${Cod_Auditor}&Observaciones=${Observaciones}&Flg_Estado=${Flg_Estado}&Cod_Usuario=${this.sCod_Usuario}&Fecha1=${Fecha1}&Fecha2=${Fecha2}&Tipo_Prenda=${Tipo_Prenda}&Temporada=${Temporada}&Lin_Pro=${Lin_Pro}&Cod_OrdPro2=${Cod_OrdPro2}&Cod_EstCli2=${Cod_EstCli2}&Sec=${Sec}`);
  }

  Cf_Busca_Derivado_TemporadaCliente(Cod_Cliente: string,sEstilo:string){
    return this.http.get(`${this.baseUrl}/app_muestra_temporada_cliente.php?Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${sEstilo}`);
  }

  CF_ObtenerLinea(
    op:any
  ){
    return this.http.get(`${this.baseUrl}/app_CF_ObtenerLinea.php?op=${op}`);
  }

  MantenimientoAuditoriaHojaMedidaDetalle(Cod_Accion: string, Cod_Hoja_Medida_Det: number, Cod_Hoja_Medida_Cab: number, Sec: number, Tip_Medida: string, Sec_Medida: string,
    Cod_Talla: string, ColumnHeader: string, medida: string) {
    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Hoja_Medida_Det.php?Accion=${Cod_Accion}&Cod_Hoja_Medida_Det=${Cod_Hoja_Medida_Det}&Cod_Hoja_Medida_Cab=${Cod_Hoja_Medida_Cab}&Sec=${Sec}&Tip_Medida=${Tip_Medida}&Sec_Medida=${Sec_Medida}&Cod_Talla=${Cod_Talla}&ColumnHeader=${ColumnHeader}&Medida=${medida}&Cod_Usuario=${this.sCod_Usuario}`);
  }


  MantenimientoAuditoriaHojaMedidaDetalleInsp(Cod_Accion: string, Cod_Hoja_Medida_Det: number, Cod_Hoja_Medida_Cab: number, Sec: number, Tip_Medida: string, Sec_Medida: string,
    Cod_Talla: string, ColumnHeader: string, medida: string) {
    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Hoja_Medida_Det_Insp.php?Accion=${Cod_Accion}&Cod_Hoja_Medida_Det=${Cod_Hoja_Medida_Det}&Cod_Hoja_Medida_Cab=${Cod_Hoja_Medida_Cab}&Sec=${Sec}&Tip_Medida=${Tip_Medida}&Sec_Medida=${Sec_Medida}&Cod_Talla=${Cod_Talla}&ColumnHeader=${ColumnHeader}&Medida=${medida}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  CargarModulos() {
    return this.http.get(`${this.baseUrl}/app_buscar_modulos_acabados.php`);
  }

  // AUDITORIA MODULO ACABADO

  Mant_AuditoriaModuloAcabadoCabService(Cod_Accion: string, Num_Auditoria: number, Cod_Supervisor: string, Cod_Auditor: string,
    Fecha_Auditoria: string, Fecha_Auditoria2: string, Cod_Modulo: string, Observacion: string, Flg_Status: string, Cod_OrdPro: string, Cod_OrdCor: string) {
    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '01/01/1900';
    }
    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '01/01/1900';
    }
    Fecha_Auditoria = _moment(Fecha_Auditoria.valueOf()).format('DD/MM/YYYY');
    Fecha_Auditoria2 = _moment(Fecha_Auditoria2.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Cc_Man_Auditoria_Modulo_Acabado_Cab.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Cod_Supervisor=${Cod_Supervisor}&Cod_Auditor=${Cod_Auditor}&Fecha_Auditoria=${Fecha_Auditoria}&Fecha_Auditoria2=${Fecha_Auditoria2}&Cod_Modulo=${Cod_Modulo}&Observacion=${Observacion}&Flg_Status=${Flg_Status}&Cod_Usuario=${this.sCod_Usuario}&Cod_OrdPro=${Cod_OrdPro}&Cod_OrdCor=${Cod_OrdCor}`);
  }

  Mant_AuditoriaModuloAcabadoDetService(data) {
    return this.http.post(`${this.baseUrl}/app_Cc_Man_Auditoria_Modulo_Acabado_Det.php`,data);
  }

  Mant_AuditoriaModuloAcabadoDefectosDetService(Cod_Accion: string, Num_Auditoria_Defecto: number, Num_Auditoria_Detalle: number, Cod_Motivo: string,
    Cantidad: number) {

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Modulo_Acabado_Defectos.php?Accion=${Cod_Accion}&Num_Auditoria_Defecto=${Num_Auditoria_Defecto}&Num_Auditoria_Detalle=${Num_Auditoria_Detalle}&Cod_Motivo=${Cod_Motivo}&Cantidad=${Cantidad}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  // AUDITORIA MODULO VAPORIZADO

  Mant_AuditoriaModuloVaporizadoCabService(Cod_Accion: string, Num_Auditoria: number, Cod_Supervisor: string, Cod_Auditor: string,
    Fecha_Auditoria: string, Fecha_Auditoria2: string, Observacion: string, Flg_Status: string, Cod_OrdPro: string) {
    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '01/01/1900';
    }
    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '01/01/1900';
    }
    Fecha_Auditoria = _moment(Fecha_Auditoria.valueOf()).format('DD/MM/YYYY');
    Fecha_Auditoria2 = _moment(Fecha_Auditoria2.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Cc_Man_Auditoria_Modulo_Vaporizado_Cab.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Cod_Supervisor=${Cod_Supervisor}&Cod_Auditor=${Cod_Auditor}&Fecha_Auditoria=${Fecha_Auditoria}&Fecha_Auditoria2=${Fecha_Auditoria2}&Observacion=${Observacion}&Flg_Status=${Flg_Status}&Cod_Usuario=${this.sCod_Usuario}&Cod_OrdPro=${Cod_OrdPro}`);
  }

  Mant_AuditoriaModuloVaporizadoDetService(data) {
    return this.http.post(`${this.baseUrl}/app_Cc_Man_Auditoria_Modulo_Vaporizado_Det.php`,data);
  }

  Mant_AuditoriaModuloVaporizadoDefectosDetService(Cod_Accion: string, Num_Auditoria_Defecto: number, Num_Auditoria_Detalle: number, Cod_Motivo: string,
    Cantidad: number) {

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Modulo_Vaporizado_Defectos.php?Accion=${Cod_Accion}&Num_Auditoria_Defecto=${Num_Auditoria_Defecto}&Num_Auditoria_Detalle=${Num_Auditoria_Detalle}&Cod_Motivo=${Cod_Motivo}&Cantidad=${Cantidad}&Cod_Usuario=${this.sCod_Usuario}`);
  }
  
  ListarLineaProd_Servicios(){
    return this.http.get(`${this.baseUrl}/app_Cf_Auditoria_Buscar_Linea_Servicios.php`);
  }


  // AUDITORIA SALIDA ACABADO

  Mant_AuditoriaModuloSalidaAcabado(Cod_Accion: string, Num_Auditoria: number, Cod_Auditor: string, Fecha_Auditoria: string, Fecha_Auditoria2: string, Cod_EstCli: string, Cod_TemCli: string, Lote: string, Tamano_Muestra: string, Observacion: string, Obs_Medida: string, Flg_Status: string) {
    //let fecha = new Date();
    //console.log(fecha)

    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '01/01/1900';
    }
    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '01/01/2100';
    }

    Fecha_Auditoria = _moment(Fecha_Auditoria.valueOf()).format('DD/MM/YYYY');
    Fecha_Auditoria2 = _moment(Fecha_Auditoria2.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Cc_Man_Auditoria_Modulo_Salida_Cab.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Cod_Auditor=${Cod_Auditor}&Fecha_Auditoria=${Fecha_Auditoria}&Fecha_Auditoria2=${Fecha_Auditoria2}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Lote=${Lote}&Tamano_Muestra=${Tamano_Muestra}&Observacion=${Observacion}&Obs_Medida=${Obs_Medida}&Flg_Status=${Flg_Status}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  Mant_AuditoriaModuloSalidaAcabadoOp(Cod_Accion: string, Num_Auditoria_Op: number, Num_Auditoria: number, Cod_OrdPro: string, Cod_EstCli: string, Cod_TemCli: string, Cod_Present: string, Flg_Estado: string) {

    return this.http.get(`${this.baseUrl}/app_Cc_Man_Auditoria_Modulo_Salida_Op.php?Accion=${Cod_Accion}&Num_Auditoria_Op=${Num_Auditoria_Op}&Num_Auditoria=${Num_Auditoria}&Cod_OrdPro=${Cod_OrdPro}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Cod_Present=${Cod_Present}&Flg_Estado=${Flg_Estado}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  Mant_AuditoriaModuloSalidaAcabadoDefecto(Cod_Accion: string, Num_Auditoria_Defecto: number, Num_Auditoria: number, Cod_Defecto: string, Cantidad: string, Tipo: string) {
    
    return this.http.get(`${this.baseUrl}/app_Cc_Man_Auditoria_Modulo_Salida_Defectos.php?Accion=${Cod_Accion}&Num_Auditoria_Defecto=${Num_Auditoria_Defecto}&Num_Auditoria=${Num_Auditoria}&Cod_Defecto=${Cod_Defecto}&Cantidad=${Cantidad}&Tipo=${Tipo}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  Get_TemporadaClienteXEstilo(Cod_EstCli: string){
    return this.http.get(`${this.baseUrl}/app_Cc_Temporada_ClienteXEstilo.php?Cod_EstCli=${Cod_EstCli}`);
  }

  // AUDITORIA EMPAQUE ACABADO

  Mant_AuditoriaModuloEmpaqueAcabado(Cod_Accion: string, Num_Auditoria: number, Cod_Auditor: string, Fecha_Auditoria: string, Fecha_Auditoria2: string, Cod_EstCli: string, Cod_TemCli: string, Lote: string, Tamano_Muestra: string, Observacion: string, Obs_Medida: string, Flg_Status: string) {
    //let fecha = new Date();
    //console.log(fecha)

    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '01/01/1900';
    }
    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '01/01/2100';
    }

    Fecha_Auditoria = _moment(Fecha_Auditoria.valueOf()).format('DD/MM/YYYY');
    Fecha_Auditoria2 = _moment(Fecha_Auditoria2.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Cc_Man_Auditoria_Modulo_Empaque_Cab.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Cod_Auditor=${Cod_Auditor}&Fecha_Auditoria=${Fecha_Auditoria}&Fecha_Auditoria2=${Fecha_Auditoria2}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Lote=${Lote}&Tamano_Muestra=${Tamano_Muestra}&Observacion=${Observacion}&Obs_Medida=${Obs_Medida}&Flg_Status=${Flg_Status}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  Mant_AuditoriaModuloEmpaqueAcabadoOp(Cod_Accion: string, Num_Auditoria_Op: number, Num_Auditoria: number, Cod_OrdPro: string, Cod_EstCli: string, Cod_TemCli: string, Cod_Present: string, Flg_Estado: string) {

    return this.http.get(`${this.baseUrl}/app_Cc_Man_Auditoria_Modulo_Empaque_Op.php?Accion=${Cod_Accion}&Num_Auditoria_Op=${Num_Auditoria_Op}&Num_Auditoria=${Num_Auditoria}&Cod_OrdPro=${Cod_OrdPro}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Cod_Present=${Cod_Present}&Flg_Estado=${Flg_Estado}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  Mant_AuditoriaModuloEmpaqueAcabadoDefecto(Cod_Accion: string, Num_Auditoria_Defecto: number, Num_Auditoria: number, Cod_Defecto: string, Cantidad: string) {
    
    return this.http.get(`${this.baseUrl}/app_Cc_Man_Auditoria_Modulo_Empaque_Defectos.php?Accion=${Cod_Accion}&Num_Auditoria_Defecto=${Num_Auditoria_Defecto}&Num_Auditoria=${Num_Auditoria}&Cod_Defecto=${Cod_Defecto}&Cantidad=${Cantidad}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  // AUDITORIA EMPAQUE CAJAS

  Mant_AuditoriaEmpaqueCajas(Cod_Accion: string, Num_Auditoria: number, Num_Caja: number, Num_Packing: number, Cod_Auditor: string, Fec_Ini_Auditoria: string, Fec_Fin_Auditoria: string, Num_Vez: number, Cod_Supervisor: string, Flg_Estado: string) {
    //let fecha = new Date();
    console.log(Fec_Ini_Auditoria)

    if (!_moment(Fec_Ini_Auditoria).isValid()) {
      Fec_Ini_Auditoria = '01/01/1900';
    }
    if (!_moment(Fec_Fin_Auditoria).isValid()) {
      Fec_Fin_Auditoria = '01/01/2100';
    }

    Fec_Ini_Auditoria = _moment(Fec_Ini_Auditoria.valueOf()).format();
    Fec_Fin_Auditoria = _moment(Fec_Fin_Auditoria.valueOf()).format();

    return this.http.get(`${this.baseUrl}/app_Cc_Man_Auditoria_Empaque_Cajas_Cab.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Num_Caja=${Num_Caja}&Num_Packing=${Num_Packing}&Cod_Auditor=${Cod_Auditor}&Fec_Ini_Auditoria=${Fec_Ini_Auditoria}&Fec_Fin_Auditoria=${Fec_Fin_Auditoria}&Num_Vez=${Num_Vez}&Cod_Supervisor=${Cod_Supervisor}&Flg_Estado=${Flg_Estado}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  Mant_AuditoriaEmpaqueCajasDetalle(Cod_Accion: string, Num_Auditoria_Detalle: number, Num_Auditoria: number, Cod_Motivo: string, Cantidad: number) {
    
    return this.http.get(`${this.baseUrl}/app_Cc_Man_Auditoria_Empaque_Cajas_Det.php?Accion=${Cod_Accion}&Num_Auditoria_Detalle=${Num_Auditoria_Detalle}&Num_Auditoria=${Num_Auditoria}&Cod_Motivo=${Cod_Motivo}&Cantidad=${Cantidad}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  Get_DetalleCajaEmpaque(Num_Caja: string){
    return this.http.get(`${this.baseUrl}/app_Cc_Empaque_Caja_Tallas.php?Num_Caja=${Num_Caja}`);
  }

  Get_ComponenteCajaEmpaque(Cod_EstPro: string, Cod_Version: string){
    return this.http.get(`${this.baseUrl}/app_Cc_Empaque_Caja_Componentes.php?Cod_EstPro=${Cod_EstPro}&Cod_Version=${Cod_Version}`);
  }

  Get_PackingCajaEmpaque(Num_Packing: string){
    return this.http.get(`${this.baseUrl}/app_Cc_Man_Auditoria_Empaque_Cajas_Packing.php?Num_Packing=${Num_Packing}`);
  }

  //- PROGRAMACION AUDITORIAS

  MantenimientoProgramacionAuditoria(data) {
    return this.http.post(`${this.baseUrl}/app_Cc_Man_Programacion_Auditorias.php`,data);
  }

  MantenimientoProgramacionAuditoriaOp(data) {
    return this.http.post<any[]>(`${this.baseUrl}/app_Cc_Man_Programacion_Auditorias_Op.php`,data);
  }

  ListaTipoAuditoria(tipo: string) {
    return this.http.get(`${this.baseUrl}/app_CC_Lista_Tipo_Auditoria.php?Tipo=${tipo}`);
  }

  ListaClientes() {
    return this.http.get(`${this.baseUrl}/app_Cc_Listar_Clientes.php`);
  }

  ListaTemporadaCliente(codCliente: string) {
    return this.http.get(`${this.baseUrl}/app_Cc_Listar_TemporadaCliente.php?Cod_Cliente=${codCliente}`);
  }


}