import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CheckListService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;
  // _url: string ="/ws_android/muestra_auditoria_en_linea_cab.php";
  // //_url: string ="https://gestion.precotex.com/ws_android/muestra_auditoria_en_linea_cab.php";

  constructor(private http: HttpClient) { }

  CargarEstilosAte(OP, Estilo_Propio, Estilo_Cliente) {

    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_ESTILOS_PROPIOS_IMAGEN_WEB_ATE.php?OP=${OP}&Estilo_Propio=${Estilo_Propio}&Estilo_Cliente=${Estilo_Cliente}`);

  }

  insertarOPAprobacion(data){
    return this.http.post(`${this.baseUrl}/app_CF_CHECK_LIST_OBTENER_OP_I.php?Cod_Usuario=${this.sCod_Usuario}`, data);
  }

  CF_INSERTAR_CHECKLIST_OBS(Opcion, Id_Observaciones, Id_CheckList, Cantidad, Cod_Defecto, Defecto, Tipo_Defecto?) {

    return this.http.get(`${this.baseUrl}/app_CF_INSERTAR_CHECKLIST_OBS.php?Opcion=${Opcion}&Id_Observaciones=${Id_Observaciones}&Id_CheckList=${Id_CheckList}&Cantidad=${Cantidad}&Cod_Defecto=${Cod_Defecto}&Defecto=${Defecto}&Tipo_Defecto=${Tipo_Defecto}`);

  }

  

  CF_ObtenerCantidad_OP(op, cod_present) {

    return this.http.get(`${this.baseUrl}/app_CF_ObtenerCantidad_OP.php?op=${op}&cod_present=${cod_present}`);

  }

  CF_CHECKLIST_LISTAR_DETALLE(Opcion, Id) {

    return this.http.get(`${this.baseUrl}/app_CF_CHECKLIST_LISTAR_DETALLE.php?Opcion=${Opcion}&Id=${Id}`);

  }
  

  CF_LISTAR_CHECKLIST(
    Fecha,
    Fecha2,
    OP,
    Cod_EstCli,
    Flg_Aprobado,
    Hoja_Rechazo
  ){

    if (!_moment(Fecha).isValid()) {
      Fecha = '';
    }else{
      Fecha = _moment(Fecha.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(Fecha2).isValid()) {
      Fecha2 = '';
    }else{
      Fecha2 = _moment(Fecha2.valueOf()).format('DD/MM/YYYY');
    }
    
    return this.http.get(`${this.baseUrl}/app_CF_LISTAR_CHECKLIST.php?Fecha=${Fecha}&Fecha2=${Fecha2}&OP=${OP}&Cod_EstCli=${Cod_EstCli}&Flg_Aprobado=${Flg_Aprobado}&Hoja_Rechazo=${Hoja_Rechazo}`);
  }

  CF_REPORTE_CHECKLIST(
    Accion,
    Fecha,
    Fecha2
  ){

    if (!_moment(Fecha).isValid()) {
      Fecha = '';
    }else{
      Fecha = _moment(Fecha.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(Fecha2).isValid()) {
      Fecha2 = '';
    }else{
      Fecha2 = _moment(Fecha2.valueOf()).format('DD/MM/YYYY');
    }
    
    return this.http.get(`${this.baseUrl}/app_CF_REPORTE_CHECKLIST.php?Accion=${Accion}&Fecha=${Fecha}&Fecha1=${Fecha2}`);
  }

  

  CF_CHECK_CREAR_DETECTO_OBS(
    Opcion:string,
    Id_CheckList:string,
    Corte:string,
    Costura_Ate:string,
    Costura_Indep:string,
    Estampado_Pieza:string,
    Estampado_Prenda:string,
    Bordado:string,
    Lavanderia:string,
    Inspeccion:string,
    Acabados:string
  ){
    return this.http.get(`${this.baseUrl}/app_CF_CHECK_CREAR_DETECTO_OBS.php?Opcion=${Opcion}&Id_CheckList=${Id_CheckList}&Corte=${Corte}&Costura_Ate=${Costura_Ate}&Costura_Indep=${Costura_Indep}&Estampado_Pieza=${Estampado_Pieza}&Estampado_Prenda=${Estampado_Prenda}&Bordado=${Bordado}&Lavanderia=${Lavanderia}&Inspeccion=${Inspeccion}&Acabados=${Acabados}`);
  }

  CF_CHECK_CREAR_INVESTIGACION(
    Opcion:string,
    Id_Investigacion:string,
    Id_CheckList:string,
    Tipo:string,
    Descripcion:string
  ){
    return this.http.get(`${this.baseUrl}/app_CF_CHECK_CREAR_INVESTIGACION.php?Opcion=${Opcion}&Id_Investigacion=${Id_Investigacion}&Id_CheckList=${Id_CheckList}&Tipo=${Tipo}&Descripcion=${Descripcion}`);
  }

  CF_LISTAR_CHECKLIST_REPROCESO(
    Opcion:string,
    Id_CheckList:string,
    Cod_Usuario:string
  ){
    return this.http.get(`${this.baseUrl}/app_CF_LISTAR_CHECKLIST_REPROCESO.php?Opcion=${Opcion}&Id_CheckList=${Id_CheckList}&Cod_Usuario=${Cod_Usuario}`);
  }

  
  CF_CHECK_CREAR_PLAN_ACCION(
    Opcion:string,
    Id_Plan_Accion:string,
    Id_CheckList:string,
    Actividad:string
  ){
    return this.http.get(`${this.baseUrl}/app_CF_CHECK_CREAR_PLAN_ACCION.php?Opcion=${Opcion}&Id_Plan_Accion=${Id_Plan_Accion}&Id_CheckList=${Id_CheckList}&Actividad=${Actividad}`);
  }

  CF_ValidarTamano_Muestra(
    cantidad:any
  ){
    return this.http.get(`${this.baseUrl}/app_CF_ValidarTamano_Muestra.php?cantidad=${cantidad}`);
  }

  CF_ObtenerLinea(
    op:any
  ){
    return this.http.get(`${this.baseUrl}/app_CF_ObtenerLinea.php?op=${op}`);
  }

  


  CF_ValidarTicket(
    ticket:any
  ){
    return this.http.get(`${this.baseUrl}/app_CF_ValidarTicket.php?ticket=${ticket}`);
  }

  


  CF_INSERTAR_CHECKLIST_INDICACIONES(Opcion, Id_Indicaciones, Id_CheckList, Indicaciones) {

    return this.http.get(`${this.baseUrl}/app_CF_INSERTAR_CHECKLIST_INDICACIONES.php?Opcion=${Opcion}&Id_Indicaciones=${Id_Indicaciones}&Id_CheckList=${Id_CheckList}&Indicaciones=${Indicaciones}`);
    
  }

  CF_CHECK_CREAR_TICKET_AUDITORIA(Opcion, Cod_OrdPro, DES_PRESENT, COD_TALLA, Cantidad, Cantidad_Auditoria,
    Cod_Usuario,
    Ticket,
    Id_CheckList) {

    return this.http.get(`${this.baseUrl}/app_CF_CHECK_CREAR_TICKET_AUDITORIA.php?Opcion=${Opcion}&Cod_OrdPro=${Cod_OrdPro}&DES_PRESENT=${DES_PRESENT}&COD_TALLA=${COD_TALLA}&Cantidad=${Cantidad}&Cantidad_Auditoria=${Cantidad_Auditoria}&Cod_Usuario=${Cod_Usuario}&Ticket=${Ticket}&Id_CheckList=${Id_CheckList}`);
    
  }

  /* Se reemplaza metodo de solicitud de GET a POST.  2024Dic27, Ahmed*/
  Cf_Mantenimiento_CheckList(data) {
    return this.http.post(`${this.baseUrl}/app_CF_INSERTAR_CHECKLIST_CAB.php`,data);
  }
  
  Cf_Mantenimiento_CheckList_old(
    Opcion:string,
    Id_CheckList: any,
    Cod_OrdPro:string,
    Cod_Cliente:string,
    Cod_EstCli:string,
    Tipo_Prenda:string,
    Des_Present:string,
    Cantidad:string,
    Cod_TemCli:string,
    Lote_Tela:string,
    Lote:string,
    Tamano_Muestra:string,
    Numero_Defectos:string,
    Tamano_Muestra_Porc:any,
    Num_Defectos:any,
    Flg_Aprobado:string,
    Flg_FichaTecnica:string,
    Flg_ReporteCalidad:string,
    Flg_Estampado:string,
    Flg_Bordado:string,
    Cod_Usuario:string,
    Ruta_Prenda:string,
    Linea:string,
  ) {

    return this.http.get(`${this.baseUrl}/app_CF_INSERTAR_CHECKLIST_CAB.php?Opcion=${Opcion}&Id_CheckList=${Id_CheckList}&Cod_OrdPro=${Cod_OrdPro}&Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${Cod_EstCli}&Tipo_Prenda=${Tipo_Prenda}&Des_Present=${Des_Present}&Cantidad=${Cantidad}&Cod_TemCli=${Cod_TemCli}&Lote_Tela=${Lote_Tela}&Lote=${Lote}&Tamano_Muestra=${Tamano_Muestra}&Numero_Defectos=${Numero_Defectos}&Tamano_Muestra_Porc=${Tamano_Muestra_Porc}&Num_Defectos=${Num_Defectos}&Flg_Aprobado=${Flg_Aprobado}&Flg_FichaTecnica=${Flg_FichaTecnica}&Flg_ReporteCalidad=${Flg_ReporteCalidad}&Flg_Estampado=${Flg_Estampado}&Flg_Bordado=${Flg_Bordado}&Cod_Usuario=${Cod_Usuario}&Ruta_Prenda=${Ruta_Prenda}&Linea=${Linea}`);
  }
}