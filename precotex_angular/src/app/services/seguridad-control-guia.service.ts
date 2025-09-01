import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';

import * as _moment from 'moment';

@Injectable({
  providedIn: 'root' 
})
export class SeguridadControlGuiaService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;

  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  ListarGuiaSalidaService(
    sNum_Planta: number) {
    return this.http.get(`${this.baseUrl}/app_listar_guia_salida.php?Num_Planta=${sNum_Planta}`);
  }


  ListarGuiaSalidaServiceWeb(
    sNum_Planta: number, Serie:string, Nro_Guia:string) {
    return this.http.get(`${this.baseUrl}/app_listar_guia_salida_web.php?Num_Planta=${sNum_Planta}&Serie=${Serie}&Nro_Guia=${Nro_Guia}`);
  }

  Lg_Packing_Select_Jaba(Opcion, Codigo_Barra: string, Id:string, Estado:string, Ubicacion: string, Cod_Usuario:string, Num_Guia?:string) {
    return this.http.get(`${this.baseUrl}/app_Lg_Packing_Select_Jaba.php?Opcion=${Opcion}&Codigo_Barra=${Codigo_Barra}&Id=${Id}&Estado=${Estado}&Ubicacion=${Ubicacion}&Cod_Usuario=${Cod_Usuario}&Num_Guia=${Num_Guia}`);
  }

  ListarGuiaSalidaJabas(Serie:string, Nro_Guia:string) {
    return this.http.get(`${this.baseUrl}/app_Lg_Packing_Add_Jaba.php?Serie=${Serie}&Nro_Guia=${Nro_Guia}`);
  }

  Lg_Man_Packing_Jaba_Web(
    Opcion,
    Cod_Packing_Jaba,
    Cod_Usuario,
    Num_Planta,
    Num_Planta_Destino,
    Cod_Usuario_Ingreso,
    Codigo_Barra,
    Estado
  ) {
    return this.http.get(`${this.baseUrl}/app_Lg_Man_Packing_Jaba_Web.php?Opcion=${Opcion}&Cod_Packing_Jaba=${Cod_Packing_Jaba}&Cod_Usuario=${Cod_Usuario}&Num_Planta=${Num_Planta}&Num_Planta_Destino=${Num_Planta_Destino}&Cod_Usuario_Ingreso=${Cod_Usuario_Ingreso}&Codigo_Barra=${Codigo_Barra}&Estado=${Estado}`);
  }

  Lg_Man_Packing_Jaba_Web_Post(
    data
  ) {
    return this.http.post(`${this.baseUrl}/app_Lg_Man_Packing_Jaba_Web_Post.php`, data);
  }

  

  ListarGuiaInternoService(
    sNum_Planta: number) {

    return this.http.get(`${this.baseUrl}/app_listar_guia_interno.php?Num_Planta=${sNum_Planta}`);
  }

  ListarGuiaInternoServiceWeb(
    sNum_Planta: number, Num_Guia) {

    return this.http.get(`${this.baseUrl}/app_listar_guia_interno_web.php?Num_Planta=${sNum_Planta}&Num_Guia=${Num_Guia}`);
  }

  BuscarNomTrabajadorService(sNro_DocIde: string) {
    return this.http.get(`${this.baseUrl}/app_muestra_nom_trabajador_nro_docide.php?Nro_DocIde=${sNro_DocIde}`);
  }

  BuscarNomProveedorService(sRuc_Proveedor: string) {
    return this.http.get(`${this.baseUrl}/app_muestra_nom_proveedor_num_ruc.php?Ruc_Proveedor=${sRuc_Proveedor}`);
  }

  packingUpdateJaba(dataJabas:any) {
    return this.http.post(`${this.baseUrl}/app_Lg_Packing_Update_Jaba.php`, dataJabas);
  }

  packingReemplazaJaba(dataJabas) {
    console.log("dataJabas")
    console.log(dataJabas)
    return this.http.post(`${this.baseUrl}/app_Lg_Packing_Reemplaza_Jaba.php`, dataJabas);
  }

  packingQuitarJaba(numGuia: string, id: any, codAccion) {

    return this.http.get(`${this.baseUrl}/app_Lg_Packing_Quitar_Jaba.php?numGuia=${numGuia}&id=${id}&codAccion=${codAccion}`);
  }

  packingUpdateJabaEx(dataJabas:any) {
    return this.http.post(`${this.baseUrl}/app_Lg_Packing_Update_Jaba_ex.php`, dataJabas);
  }

  GuardarService(sCod_Accion: string, nNum_Planta: number, sNum_Guia: string, sCod_Proveedor: string, nNum_Planta_Destino: number, nNum_Planta_Origen: number,
    sDni_Entregado: string, nNum_Bulto: number, nNum_Cantidad: number, nNum_Peso: number, sDni_Despachado: string, sGlosa: string, Cod_Vehiculo:string, Fecha_Inicio:string, Fecha_Fin:string, GRE_ESTADO_SUNAT?:string, Fec_Traslado_Guia_Rem?:string) {
  
    // sAccion : String = 'I'
    // this.nNum_Planta
    // sCod_Accion = 'S'
    // sNum_Guia
    // sCod_Proveedor
    // nNum_Planta_Destino
    // nNum_Planta_Origen = this.sNum_Planta
    // sDni_Entregado
    // nNum_Bulto
    // nNum_Cantidad
    // nNum_Peso
    // sDni_Despachado
    // sGlosa
    // this.sCod_Usuario

    sGlosa = sGlosa.replace(/\s+/g, " ").trim();
    sGlosa = sGlosa.replace("ñ", "n").trim();

    return this.http.get(`${this.baseUrl}/app_man_registro_control_guia.php?Accion=${'I'}&Num_Planta=${nNum_Planta}&Cod_Accion=${sCod_Accion}&Num_Guia=${sNum_Guia}&Cod_Proveedor=${sCod_Proveedor}&Num_Planta_Destino=${nNum_Planta_Destino}&Num_Planta_Origen=${nNum_Planta_Origen}&Dni_Entregado=${sDni_Entregado}&Num_Bulto=${nNum_Bulto}&Num_Cantidad=${nNum_Cantidad}&Num_Peso=${nNum_Peso}&Dni_Despachado=${sDni_Despachado}&Glosa=${sGlosa}&Cod_Usuario=${this.sCod_Usuario}&Cod_Vehiculo=${Cod_Vehiculo}&Fecha_Inicio=${Fecha_Inicio}&Fecha_Fin=${Fecha_Fin}&GRE_ESTADO_SUNAT=${GRE_ESTADO_SUNAT}&Fec_Traslado_Guia_Rem=${Fec_Traslado_Guia_Rem}`);

  }

  mantenimientoVehiculoService(Cod_Accion: string, Des_Vehiculo: string, Num_Placa: string, Cod_Barras: string, Flg_Activo: string, Num_Soat: string, Fec_Fin_Soat: string, Num_Tarjeta_Prop: string, Tmp_Carga: string, Tmp_Descarga: string, Cod_Conductor: string, Cod_Vehiculo: string){
    if (!_moment(Fec_Fin_Soat).isValid()) {
      Fec_Fin_Soat = '01/01/1900';
    } 

    Fec_Fin_Soat = _moment(Fec_Fin_Soat.valueOf()).format('DD/MM/YYYY');
   
    
    return this.http.get(`${this.baseUrl}/app_man_vehiuculo_vehiculo.php?Accion=${Cod_Accion}&Des_Vehiculo=${Des_Vehiculo}&Num_Placa=${Num_Placa}&Cod_Barras=${Cod_Barras}&Flg_Activo=${Flg_Activo}&Cod_Usuario=${this.sCod_Usuario}&Num_Soat=${Num_Soat}&Fec_Fin_Soat=${Fec_Fin_Soat}&Num_Tarjeta_Prop=${Num_Tarjeta_Prop}&Tmp_Carga=${Tmp_Carga}&Tmp_Descarga=${Tmp_Descarga}&Cod_Conductor=${Cod_Conductor}&Cod_Vehiculo=${Cod_Vehiculo}`);
  }

  HabilitarNum_Planta(nNum_Planta: number) {
    return this.http.get(`https://192.168.1.31:9443/ws_android/app_habilitar_num_planta.php?Num_Planta=${nNum_Planta}`);
  }

  GuardarPersonalService(sNum_Dni: string, sApe_Paterno: string, sApe_Materno: string, sNombres: string) {

    sNum_Dni = sNum_Dni.replace(/\s+/g, " ").trim();
    sNum_Dni = sNum_Dni.replace("ñ", "n").trim();

    sApe_Paterno = sApe_Paterno.replace(/\s+/g, " ").trim();
    sApe_Paterno = sApe_Paterno.replace("ñ", "n").trim();

    sApe_Materno = sApe_Materno.replace(/\s+/g, " ").trim();
    sApe_Materno = sApe_Materno.replace("ñ", "n").trim();

    sNombres = sNombres.replace(/\s+/g, " ").trim();
    sNombres = sNombres.replace("ñ", "n").trim();

    return this.http.get(`${this.baseUrl}/app_man_personal_control_guia.php?Num_Dni=${sNum_Dni}&Ape_Paterno=${sApe_Paterno}&Ape_Materno=${sApe_Materno}&Nombres=${sNombres}&Cod_Usuario=${this.sCod_Usuario}`);

  }

  ListarOrdCompService(sCod_Proveedor: string) {

    return this.http.get(`${this.baseUrl}/app_listar_ordcomp.php?Cod_Proveedor=${sCod_Proveedor}`);
  }

  CargarListaNumGuiaOrdCompService(sNum_Guia: string, sCod_Proveedor: string) {

    return this.http.get(`${this.baseUrl}/app_cargar_lista_num_guia_ordcomp.php?Num_Guia=${sNum_Guia}&Cod_Proveedor=${sCod_Proveedor}`);
  }

  ManOrdCompService(sAccion: string, sNum_Guia: string, sCod_Proveedor: string, sNum_OrdComp: string) {

    return this.http.get(`${this.baseUrl}/app_man_ordcomp_control_guia.php?Accion=${sAccion}&Num_Guia=${sNum_Guia}&Cod_Proveedor=${sCod_Proveedor}&Num_OrdComp=${sNum_OrdComp}&Cod_Usuario=${this.sCod_Usuario}`);

  }

  ListarHistoritalService(nNum_Planta: number, sFec_Registro: string, guia:string) {

    if (!_moment(sFec_Registro).isValid()) {
      sFec_Registro = '01/01/1900';
    }

    sFec_Registro = _moment(sFec_Registro.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_listar_historial_control_guia.php?Num_Planta=${nNum_Planta}&Fec_Registro=${sFec_Registro}&Guia=${guia}`);
  }

  EliminarRegistroService(nNum_Planta: number, sNum_Guia: string, sCod_Proveedor: string) {

    return this.http.get(`${this.baseUrl}/app_eliminar_registro_control_guia.php?Num_Planta=${nNum_Planta}&Num_Guia=${sNum_Guia}&Cod_Proveedor=${sCod_Proveedor}&Cod_Usuario=${this.sCod_Usuario}`);
  }
 

  ListarMemorandumService(nNum_Planta: number, sFec_Registro: string) {

    if (!_moment(sFec_Registro).isValid()) {
      sFec_Registro = '01/01/1900';
    }

    sFec_Registro = _moment(sFec_Registro.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_listar_memorandum_control_guia.php?Num_Planta=${nNum_Planta}&Fec_Registro=${sFec_Registro}`);
  }

  ListarPersonalAutoriza() {
    return this.http.get(`${this.baseUrl}/app_listar_personal_autoriza_memorandum.php`);
  }

  GuardarMemorandumService(sCod_Accion: string, nNum_Planta: number, nNum_Memorandum: number, 
                          sFec_Registro: string, sDni_Emisor: string, sDni_Receptor: string, 
                          sAsunto: string, sNom_Autoriza: string, sGlosa: string, 
                          nNum_Cantidad: number, nNum_Peso: number) {

    if (!_moment(sFec_Registro).isValid()) {
      sFec_Registro = '01/01/1900';
    }

    sFec_Registro = _moment(sFec_Registro.valueOf()).format('DD/MM/YYYY');

    sAsunto = sAsunto.replace(/\s+/g, " ").trim();
    sAsunto = sAsunto.replace("ñ", "n").trim();

    sGlosa = sGlosa.replace(/\s+/g, " ").trim();
    sGlosa = sGlosa.replace("ñ", "n").trim();

    return this.http.get(`${this.baseUrl}/app_man_registro_memorandum.php?Cod_Accion=${sCod_Accion}&Num_Planta=${nNum_Planta}&Num_Memorandum=${nNum_Memorandum}&Fec_Registro=${sFec_Registro}&Dni_Emisor=${sDni_Emisor}&Dni_Receptor=${sDni_Receptor}&Asunto=${sAsunto}&Nom_Autoriza=${sNom_Autoriza}&Glosa=${sGlosa}&Num_Cantidad=${nNum_Cantidad}&Num_Peso=${nNum_Peso}&Cod_Usuario=${this.sCod_Usuario}`);

  }

  MostrarDatosMemorandumService(nNum_Memorandum: number) {
    return this.http.get(`${this.baseUrl}/app_muestra_registro_num_memorandum.php?Num_Memorandum=${nNum_Memorandum}`);
  }
  
  cargarJabaImagenes(data:any) { 
    return this.http.post(`${this.baseUrl}/app_Lg_Man_Packing_Jaba_Seg_Det_Imagen.php`, data);
  }

  verImagenesJaba(data) { 
    return this.http.post(`${this.baseUrl}/app_Lg_Man_Packing_Jaba_Seg_Det_Imagen.php`, data);
  }
}
