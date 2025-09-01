import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReposicionesService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  getClientes(sAbr: string, sCod: string, sCliente: string, sCod_Accion: string) {
    return this.http.get(`${this.baseUrl}/app_listar_cliente_abr_derivados.php?Abr=${sAbr}&Abr_Motivo=${sCod}&Nom_Cliente=${sCliente}&Cod_Accion=${sCod_Accion}`);
  }

  getValidarOP(OP: string) {
    return this.http.get(`${this.baseUrl}/app_CF_ValidarOP.php?OP=${OP}`);
  }

  getColoresOP(OP: string) {
    return this.http.get(`${this.baseUrl}/app_SM_BUSCA_PRESENTACIONES_OP.php?op=${OP}`);
  }

  insertarFechasReposicion(Accion: string, Num_Solicitud: string, Tipo?:string) {
    return this.http.get(`${this.baseUrl}/app_CF_INSERTAR_FECHAS_REPOSICION.php?Accion=${Accion}&Num_Solicitud=${Num_Solicitud}&Tipo=${Tipo}`);
  }

  getReposiciones(Accion: string, Num_Solicitud: string, Fec_Inicio, Fec_Fin, Estado?, Tipo?, Sede?) {

    if (!_moment(Fec_Inicio).isValid()) {
      Fec_Inicio = '';
    } else {
      Fec_Inicio = _moment(Fec_Inicio.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(Fec_Fin).isValid()) {
      Fec_Fin = '';
    } else {
      Fec_Fin = _moment(Fec_Fin.valueOf()).format('DD/MM/YYYY');
    }

    return this.http.get(`${this.baseUrl}/app_CF_OBTENER_REPOSICION_CAB.php?Accion=${Accion}&Num_Solicitud=${Num_Solicitud}&Fec_Inicio=${Fec_Inicio}&Fec_Fin=${Fec_Fin}&Estado=${Estado}&Tipo=${Tipo}&Sede=${Sede}`);
  }

  getReporteReposiciones(Fec_Inicio, Fec_Fin) {

    if (!_moment(Fec_Inicio).isValid()) {
      Fec_Inicio = '';
    } else {
      Fec_Inicio = _moment(Fec_Inicio.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(Fec_Fin).isValid()) {
      Fec_Fin = '';
    } else {
      Fec_Fin = _moment(Fec_Fin.valueOf()).format('DD/MM/YYYY');
    }

    return this.http.get(`${this.baseUrl}/app_CF_REPORTE_REPOSICIONES_WEB.php?Fecha=${Fec_Inicio}&Fecha1=${Fec_Fin}`);
  }

  saveAprobReposiciones(Accion: string, Num_Solicitud: string, Observacion: string, Estado: string) {
    return this.http.get(`${this.baseUrl}/app_CF_APROBACION_REPOSICION.php?Accion=${Accion}&Num_Solicitud=${Num_Solicitud}&Observacion=${Observacion}&Estado=${Estado}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  saveRecepcionReposiciones(Num_Solicitud: string, Recepcion_Conforme: string, Observaciones_Recepcion: string) {
    return this.http.get(`${this.baseUrl}/app_CF_RECEPCION_REPOSICION.php?Num_Solicitud=${Num_Solicitud}&Recepcion_Conforme=${Recepcion_Conforme}&Observaciones_Recepcion=${Observaciones_Recepcion}`);
  }



  saveDespachoReposicion(Num_Solicitud: string, Observaciones_Despacho: string, Piezas_ML: string, Piezas_Prod: string, Reposicion_Completa: string) {
    return this.http.get(`${this.baseUrl}/app_CF_DESPACHO_REPOSICION.php?Num_Solicitud=${Num_Solicitud}&Observaciones_Despacho=${Observaciones_Despacho}&Piezas_ML=${Piezas_ML}&Piezas_Prod=${Piezas_Prod}&Reposicion_Completa=${Reposicion_Completa}`);
  }



  saveLecturaReposiciones(Accion: string, Num_Solicitud: string, Cod_Usuario: string, Conductor: string) {
    return this.http.get(`${this.baseUrl}/app_CF_INSERTAR_LECTURA_REPOSICION.php?Accion=${Accion}&Num_Solicitud=${Num_Solicitud}&Cod_Usuario=${Cod_Usuario}&Conductor=${Conductor}`);
  }

  listaChoferesService() {

    return this.http.get(`${this.baseUrl}/app_man_vehiuculo_vehiculo.php?Accion=C&Des_Vehiculo=&Num_Placa=&Cod_Barras=&Flg_Activo=&Cod_Usuario=sistemas&Num_Soat=&Fec_Fin_Soat=&Num_Tarjeta_Prop=&Tmp_Carga=&Tmp_Descarga=&Cod_Conductor=&Cod_Vehiculo=`);
  }




  cf_busca_Componentes(OC: string) {
    return this.http.get(`${this.baseUrl}/app_CF_BUSCAR_COMPONENTES_OC.php?OC=${OC}`);
  }

  insertarDetalle(Accion: string, Id_Reposicion_Detalle: string, Num_Solicitud: string, Co_CodOrdPro: string, Cod_Est:string, Cod_OrdPro:string, Cod_Present: string, Des_Present: string, Pieza: string,
    Cod_Talla:string, Cantidad:string, Tipo_Tela:string, Cod_Compest:string, COMBO:string, Version:string, Cod_EstPro:string) {
    return this.http.get(`${this.baseUrl}/app_CF_INSERTAR_REPOSICION_DET.php?Accion=${Accion}&Id_Reposicion_Detalle=${Id_Reposicion_Detalle}&Num_Solicitud=${Num_Solicitud}&Co_CodOrdPro=${Co_CodOrdPro}&Co_CodOrdPro=${Co_CodOrdPro}&Cod_Est=${Cod_Est}&Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Des_Present=${Des_Present}&Pieza=${Pieza}&Cod_Talla=${Cod_Talla}&Cantidad=${Cantidad}&Tipo_Tela=${Tipo_Tela}&Cod_Compest=${Cod_Compest}&COMBO=${COMBO}&Version=${Version}&Cod_EstPro=${Cod_EstPro}`);
  }

  buscarPiezaComponente(Accion: string, Estilo_Propio: string, version: string, componente: string) {
    return this.http.get(`${this.baseUrl}/app_UP_Es_EstProCompPza.php?Accion=${Accion}&Estilo_Propio=${Estilo_Propio}&version=${version}&componente=${componente}`);
  }

  CF_BUSCAR_PIEZA_TALLA(OP: string, Cod_Present) {
    return this.http.get(`${this.baseUrl}/app_CF_BUSCAR_PIEZA_TALLA.php?OP=${OP}&Cod_Present=${Cod_Present}`);
  }

  retornaIdReposicion() {
    return this.http.get(`${this.baseUrl}/retornaIdReposicion.php`);
  }

  CF_INSERTAR_REPOSICION_CAB(data) {
    return this.http.post(`${this.baseUrl}/app_CF_INSERTAR_REPOSICION_CAB.php`, data);
  }

}
