import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';


import * as _moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class DefectosAlmacenDerivadosService {
  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;

  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  

  mantenimientoDerivadosService(sAbr: string, sCod:string,sCliente:string, sCod_Accion:string) {
    return this.http.get(`${this.baseUrl}/app_listar_cliente_abr_derivados.php?Abr=${sAbr}&Abr_Motivo=${sCod}&Nom_Cliente=${sCliente}&Cod_Accion=${sCod_Accion}`);
  }

  mantenimientoDerivadosWebService(sAbr: string, sCod:string,sCliente:string, sCod_Accion:string, Defecto:string) {
    return this.http.get(`${this.baseUrl}/app_listar_cliente_abr_derivados_web.php?Abr=${sAbr}&Abr_Motivo=${sCod}&Nom_Cliente=${sCliente}&Cod_Accion=${sCod_Accion}&Defecto=${Defecto}`);
  }

  ListarClienteService(sAbr: string,sCod:string, sCod_Accion:string){
    return this.http.get(`${this.baseUrl}/app_listar_cliente_derivados.php?Abr=${sAbr}&Abr_Motivo=${sCod}&Cod_Accion=${sCod_Accion}`);
  }
  
  es_muestra_estilos_del_cliente(Codigo_Cliente: string, Cod_TemCli:string, sEstilo:string){
    return this.http.get(`${this.baseUrl}/app_es_muestra_estilos_del_cliente.php?cod_cliente=${Codigo_Cliente}&Cod_TemCli=${Cod_TemCli}&Cod_EstCli=${sEstilo}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  Cf_Busca_Derivado_TemporadaCliente(Cod_Cliente: string,sEstilo:string){
    return this.http.get(`${this.baseUrl}/app_muestra_temporada_del_cliente.php?Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${sEstilo}`);
  }

  Cf_Busca_TemporadaCliente(Cod_Cliente: string,sEstilo:string){
    return this.http.get(`${this.baseUrl}/app_muestra_temporada_cliente.php?Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${sEstilo}`);
  }

  Cf_Buscar_Derivado_Estilo_Color(Cod_Cliente: string, Cod_TemCli:string, Cod_EstCli:string){
    return this.http.get(`${this.baseUrl}/app_muestra_color_del_cliente.php?Cod_Cliente=${Cod_Cliente}&Cod_TemCli=${Cod_TemCli}&Cod_EstCli=${Cod_EstCli}`);
  }

  SM_Presentaciones_OrdPro(op: string){
    return this.http.get(`${this.baseUrl}/app_SM_Presentaciones_OrdPro.php?op=${op}`);
  }

  CF_CHECKLIST_LISTAR_DETALLE(Opcion, Id) {

    return this.http.get(`${this.baseUrl}/app_CF_CHECKLIST_LISTAR_DETALLE.php?Opcion=${Opcion}&Id=${Id}`);

  }

 

  

  Cf_Crear_Num_Auditoria(){
    return this.http.get(`${this.baseUrl}/app_traer_num_auditoria.php?`);
  }

  Cf_Busca_Derivado_Talla(Cod_Cliente: string, Cod_TemCli:string, Cod_EstCli:string, Cod_ColCli:string){
    return this.http.get(`${this.baseUrl}/app_muestra_tallas_del_cliente.php?Cod_Cliente=${Cod_Cliente}&Cod_TemCli=${Cod_TemCli}&Cod_EstCli=${Cod_EstCli}&Cod_ColCli=${Cod_ColCli}`);
  }
 
  
  GuardarService(Accion: string, Num_Auditoria: number, Cod_Cliente: string, Fec_Auditoria: string, Cod_EstCli: string, Cod_TemCli: string,
    Cod_ColCli: string, Cod_Talla: string,Cod_Motivo: string, Can_Defecto: string) {

       

    //return this.http.get(`${this.baseUrl}/app_man_registro_control_guia.php?Accion=${'I'}&Num_Planta=${nNum_Planta}&Cod_Accion=${sCod_Accion}&Num_Guia=${sNum_Guia}&Cod_Proveedor=${sCod_Proveedor}&Num_Planta_Destino=${nNum_Planta_Destino}&Num_Planta_Origen=${nNum_Planta_Origen}&Dni_Entregado=${sDni_Entregado}&Num_Bulto=${nNum_Bulto}&Num_Cantidad=${nNum_Cantidad}&Num_Peso=${nNum_Peso}&Dni_Despachado=${sDni_Despachado}&Glosa=${sGlosa}&Cod_Usuario=${this.sCod_Usuario}`);
    return this.http.get(`${this.baseUrl}/app_man_cf_derivadosv2.php?Accion=${Accion}&Num_Auditoria=${Num_Auditoria}&Cod_Cliente=${Cod_Cliente}&Cod_Auditor=${this.sCod_Usuario}&Fec_Auditoria=${Fec_Auditoria}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Cod_ColCli=${Cod_ColCli}&Cod_Talla=${Cod_Talla}&Cod_Motivo=${Cod_Motivo}&Can_Defecto=${Can_Defecto}`);  

  } 

  Cf_Busca_Derivado_Detalle(Num_Auditoria: number){
    return this.http.get(`${this.baseUrl}/app_Cf_Auditoria_Derivados_Busca_Detalle.php?Num_Auditoria=${Num_Auditoria}`);
  }


  ListarHistoritalService(Accion: string, Cod_Cliente: string, Fec_Auditoria: string, Cod_EstCli: string,
    Cod_ColCli: string, Nom_Auditor:string) {

    if (!_moment(Fec_Auditoria).isValid()) {
      Fec_Auditoria = '01/01/1900';
    }


    Fec_Auditoria = _moment(Fec_Auditoria.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Mostrar_Cabecera_Derivados.php?Accion=${Accion}&Cod_Cliente=${Cod_Cliente}&Cod_Auditor=${Nom_Auditor}&Fec_Auditoria=${Fec_Auditoria}&Cod_EstCli=${Cod_EstCli}&Cod_ColCli=${Cod_ColCli}`);
  }

  ListarReporteService(Accion: string, Cod_Cliente: string, Cod_EstCli: string,
    Cod_ColCli: string, Nom_Auditor:string) {

  

    return this.http.get(`${this.baseUrl}/app_Mostrar_Reporte_Derivados.php?Accion=${Accion}&Cod_Cliente=${Cod_Cliente}&Cod_Auditor=${Nom_Auditor}&Cod_EstCli=${Cod_EstCli}&Cod_ColCli=${Cod_ColCli}`);
  }

  ListarReporteDetalladoService(Accion: string, Cod_Cliente: string, Cod_EstCli: string, Cod_TemCli:string, Cod_ColCli: string, fIni: string,fFin: string) {
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
    return this.http.get(`${this.baseUrl}/app_Mostrar_Reporte_Detallado_Derivados_V3.php?Accion=${Accion}&Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Cod_ColCli=${Cod_ColCli}&fIni=${fIni}&fFin=${fFin}`);
  }
  
  ListarReporteDetallado3Service(Accion: string, Cod_Cliente: string, Cod_EstCli: string, Cod_TemCli:string, Cod_ColCli: string, fIni: string,fFin: string) {
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
    return this.http.get(`${this.baseUrl}/app_Mostrar_Reporte_Detallado3_Derivados.php?Accion=${Accion}&Cod_Cliente=${Cod_Cliente}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Cod_ColCli=${Cod_ColCli}&fIni=${fIni}&fFin=${fFin}`);
  }

  

  Cf_Busca_Derivado_OP_Cliente_Estilo_Temporada(COD_ORDPRO: string){
    return this.http.get(`${this.baseUrl}/app_Cf_Busca_Derivado_OP_Cliente_Estilo_Temporada.php?COD_ORDPRO=${COD_ORDPRO}`);
  }

  Cf_Busca_OP_Cliente_Estilo_Temporada(COD_ORDPRO: string){
    return this.http.get(`${this.baseUrl}/app_Cf_Busca_OP_Cliente_Estilo_Temporada.php?Cod_OrdPro=${COD_ORDPRO}`);
  }

  obtenerOpAprobacion(Opcion: string, Cod_EstCli: string, Des_Present: string, Id_CheckList: string, Cod_OrdPro: string, Temporada: string, Nom_TemCli: string, Cod_Destino: string, Des_Destino: string, Cod_EstPro: string, Cod_Present: string, Flg_Estado: string, Cod_Usuario: string){
    return this.http.get(`${this.baseUrl}/app_CF_CHECK_LIST_OBTENER_OP.php?Opcion=${Opcion}&Cod_EstCli=${Cod_EstCli}&Des_Present=${Des_Present}&Id_CheckList=${Id_CheckList}
    &Cod_OrdPro=${Cod_OrdPro}
    &Temporada=${Temporada}
    &Nom_TemCli=${Nom_TemCli}
    &Cod_Destino=${Cod_Destino}
    &Des_Destino=${Des_Destino}
    &Cod_EstPro=${Cod_EstPro}
    &Cod_Present=${Cod_Present}
    &Flg_Estado=${Flg_Estado}
    &Cod_Usuario=${Cod_Usuario}`);
  }  

  insertarOPAprobacion(data){
    return this.http.post(`${this.baseUrl}/app_CF_CHECK_LIST_OBTENER_OP.php?Cod_Usuario=${this.sCod_Usuario}`, data);
  }

  ActualizarDerivadoCantidadTotal(Cod_Accion: string, Num_Auditoria: number, Total: number){
    return this.http.get(`${this.baseUrl}/app_Cf_Actualizar_Cantidad_Total_Derivado.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Total=${Total}`);
  }

  ActualizarDerivadoObservacion(Cod_Accion: string, Num_Auditoria: number, Observacion: string){
    return this.http.get(`${this.baseUrl}/app_Cf_Actualizar_Observacion_Derivado.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Glosa=${Observacion}`);
  }

  ReporteCantidadesPorFecha(Cod_Accion: string, Fec_Auditoria: string, Cod_Usuario){
    if (!_moment(Fec_Auditoria).isValid()) {
      Fec_Auditoria = '01/01/1900';
  }                                                       
  Fec_Auditoria = _moment(Fec_Auditoria.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Cf_Reporte_CantidadesPorFecha_Derivado.php?Accion=${Cod_Accion}&Fec_Auditoria=${Fec_Auditoria}&Cod_Usuario=${Cod_Usuario}`);
  }

  ReporteCantidadesPorFecha_Web(Cod_Accion: string, Fec_Auditoria: string){
    if (!_moment(Fec_Auditoria).isValid()) {
      Fec_Auditoria = '01/01/1900';
  }                                                       
  Fec_Auditoria = _moment(Fec_Auditoria.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Cf_Reporte_CantidadesPorFecha_Derivado_Web.php?Accion=${Cod_Accion}&Fec_Auditoria=${Fec_Auditoria}&Cod_Usuario=${this.sCod_Usuario}`);
  }


  Cf_Mantenimiento_Derivados( Cod_Accion: string,   Num_Auditoria: number,  Cod_Cliente: string,
                              Cod_Auditor: string,  Fec_Auditoria: string,  Total: number,
                              Cod_EstCli: string,   Cod_TemCli: string,     Cod_ColCli: string,
                              Glosa:string,         Cod_Talla: string,      Cod_Motivo:string,
                              Can_Defecto: number,  Op:string, Tipo_Registro:string, Clasificacion:string){

  if (!_moment(Fec_Auditoria).isValid()) {
    Fec_Auditoria = '01/01/1900'; 
  }else{
    Fec_Auditoria = _moment(Fec_Auditoria.valueOf()).format('DD/MM/YYYY');
  }                                                       
  

  return this.http.get(`${this.baseUrl}/app_Cf_Mantenimiento_Auditoria_Derivados.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Cod_Cliente=${Cod_Cliente}&Cod_Auditor=${this.sCod_Usuario}&Fec_Auditoria=${Fec_Auditoria}&Total=${Total}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Cod_ColCli=${Cod_ColCli}&Glosa=${Glosa}&Cod_Talla=${Cod_Talla}&Cod_Motivo=${Cod_Motivo}&Can_Defecto=${Can_Defecto}&Op=${Op}&Tipo_Registro=${Tipo_Registro}&Clasificacion=${Clasificacion}`);
  }



  Cf_Enviar_Alerta_Audita_Defectos_Derivados_Telegram1(Cod_Cliente: string, Nom_Cliente: string,Cod_EstCli: string, Cod_TemCli: string, Nom_TemCli: string,Cod_ColCli: string, Total_solicitado: number, Total_requerido: number, Total_Num_Defecto: number, Caidas_solicitado: number, Caidas_requerido: number){
    return this.http.get(`${this.baseUrl}/app_Cf_Enviar_Alerta_Audita_Defectos_Derivados_Telegram1.php?Cod_Cliente=${Cod_Cliente}&Nom_Cliente=${Nom_Cliente}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Nom_TemCli=${Nom_TemCli}&Cod_ColCli=${Cod_ColCli}&Total_solicitado=${Total_solicitado}&Total_requerido=${Total_requerido}&Total_Num_Defecto=${Total_Num_Defecto}&Caidas_solicitado=${Caidas_solicitado}&Caidas_requerido=${Caidas_requerido}`);
  }

  CF_Auditor_Derivado(){
    return this.http.get(`${this.baseUrl}/app_CF_Auditor_Derivado.php`);
  }


  Cf_Enviar_Alerta_Audita_Defectos_Derivados_Telegram5(Cod_Cliente: string, Nom_Cliente: string,Cod_EstCli: string, Cod_TemCli: string, Nom_TemCli: string,Cod_ColCli: string, Total_solicitado: number, Total_requerido: number, Total_Num_Defecto: number, Caidas_solicitado: number, Caidas_requerido: number){
    return this.http.get(`${this.baseUrl}/app_Cf_Enviar_Alerta_Audita_Defectos_Derivados_Telegram5.php?Cod_Cliente=${Cod_Cliente}&Nom_Cliente=${Nom_Cliente}&Cod_EstCli=${Cod_EstCli}&Cod_TemCli=${Cod_TemCli}&Nom_TemCli=${Nom_TemCli}&Cod_ColCli=${Cod_ColCli}&Total_solicitado=${Total_solicitado}&Total_requerido=${Total_requerido}&Total_Num_Defecto=${Total_Num_Defecto}&Caidas_solicitado=${Caidas_solicitado}&Caidas_requerido=${Caidas_requerido}`);
  }
  

} 