import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';

import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SeguridadControlVehiculoService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;

  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  HabilitarNum_Planta(nNum_Planta: number) {
    return this.http.get(`https://192.168.1.31:9443/ws_android/app_habilitar_num_planta.php?Num_Planta=${nNum_Planta}`);
  }

  ListarOrigenesService(sNum_Planta: number) {

    return this.http.get(`${this.baseUrl}/app_listar_planta.php?Accion=I&Num_Planta=${sNum_Planta}`);
  }

  listarClientesGrupo(cliente: string) {

    return this.http.get(`${this.baseUrl}/App_CO_listar_clientes_grupo.php?Cliente=${cliente}`);
  }

  listaGrupoTextilCorte(cliente: any, grupo: any) {

    return this.http.get(`${this.baseUrl}/app_CO_LISTADO_GRUPO_TEXTIL_CORTE_LG.php?Cliente=${cliente}&Grupo=${grupo}`);
  }

  AperturaCierreGirado(data: any) {

    return this.http.post(`${this.baseUrl}/app_CO_Apertura_Girado.php`, data);
  }

  CoAperturaCierreLiquidado(data: any) {

    return this.http.post(`${this.baseUrl}/App_Co_Apertura_Liquidado.php`, data);
  }

  //app_CO_LISTADO_GRUPO_TEXTIL_CORTE_LG


  traerInfoVehiculoService(
    sNum_Planta: number, sCod_barras: string) {
    return this.http.get(`${this.baseUrl}/app_buscar_vehiculo.php?Cod_Barras=${sCod_barras}&Num_Planta=${sNum_Planta}`)
  }

  traerInfoConductorService(sNum_Planta: number, sCod_conductor: string) {
    return this.http.get(`${this.baseUrl}/app_muestra_nom_trabajador_nro_docide_vehiculo.php?Nro_DocIde=${sCod_conductor}`)
  }


  GuardarService(Accion: string, sCod_Accion: string, nNum_Planta: number, sCod_barras: string, sDni_conductor: string, nNum_Planta_Ref: number, nNum_kilometraje: number,
    sGlosa: string, sOperacion: string, Fecha_Registro: string) {

    if (Fecha_Registro != '') {
      sGlosa = sGlosa.replace(/\s+/g, " ").trim();
      sGlosa = sGlosa.replace("ñ", "n").trim();
    }

    //return this.http.get(`${this.baseUrl}/app_man_registro_control_guia.php?Accion=${'I'}&Num_Planta=${nNum_Planta}&Cod_Accion=${sCod_Accion}&Num_Guia=${sNum_Guia}&Cod_Proveedor=${sCod_Proveedor}&Num_Planta_Destino=${nNum_Planta_Destino}&Num_Planta_Origen=${nNum_Planta_Origen}&Dni_Entregado=${sDni_Entregado}&Num_Bulto=${nNum_Bulto}&Num_Cantidad=${nNum_Cantidad}&Num_Peso=${nNum_Peso}&Dni_Despachado=${sDni_Despachado}&Glosa=${sGlosa}&Cod_Usuario=${this.sCod_Usuario}`);
    return this.http.get(`${this.baseUrl}/app_man_registro_vehiculo.php?Accion=${Accion}&Num_Planta=${nNum_Planta}&Cod_Accion=${sCod_Accion}&Cod_Barras=${sCod_barras}&Dni_Conductor=${sDni_conductor}&Num_Planta_Referencia=${nNum_Planta_Ref}&Num_Kilometraje=${nNum_kilometraje}&Observacion=${sGlosa}&Cod_Usuario=${this.sCod_Usuario}&Operacion=${sOperacion}&Fecha_Registro=${Fecha_Registro}`);

  }



  GuardarServiceCopia(data: any) {


    //return this.http.get(`${this.baseUrl}/app_man_registro_control_guia.php?Accion=${'I'}&Num_Planta=${nNum_Planta}&Cod_Accion=${sCod_Accion}&Num_Guia=${sNum_Guia}&Cod_Proveedor=${sCod_Proveedor}&Num_Planta_Destino=${nNum_Planta_Destino}&Num_Planta_Origen=${nNum_Planta_Origen}&Dni_Entregado=${sDni_Entregado}&Num_Bulto=${nNum_Bulto}&Num_Cantidad=${nNum_Cantidad}&Num_Peso=${nNum_Peso}&Dni_Despachado=${sDni_Despachado}&Glosa=${sGlosa}&Cod_Usuario=${this.sCod_Usuario}`);
    return this.http.post(`${this.baseUrl}/app_man_registro_vehiculo_copia.php`, data);

  }



  ListarDestinosService(sNum_Planta: number) {

    return this.http.get(`${this.baseUrl}/app_listar_planta.php?Accion=S&Num_Planta=${sNum_Planta}`);
  }



  ListarHistoritalService(nNum_Planta: number, sCod_Barras: string, nDni_Conductor: String, sFec_Registro: string) {

    if (!_moment(sFec_Registro).isValid()) {
      sFec_Registro = '01/01/1900';
    }

    sFec_Registro = _moment(sFec_Registro.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_listar_historial_control_vehiculo.php?Num_Planta=${nNum_Planta}&Cod_Barras=${sCod_Barras}&Dni_Conductor=${nDni_Conductor}&Fec_Registro=${sFec_Registro}`);
  }


  EliminarRegistroService(nNum_Planta: Number, Cod_Barras: String, Cod_Accion: string, Cod_Vehiculo: string, Num_Kilometraje: string, Num_Planta_Destino: String, Dni_Conductor: string, Numero_Planta: string, ope: string) {

    return this.http.get(`${this.baseUrl}/app_man_registro_vehiculo.php?Accion=${'D'}&Num_Planta=${Numero_Planta}&Cod_Accion=${Cod_Accion}&Cod_Barras=${Cod_Barras}&Dni_Conductor=${Dni_Conductor}&Num_Planta_Referencia=${Num_Planta_Destino}&Num_Kilometraje=${Num_Kilometraje}&Observacion=${''}&Cod_Usuario=${this.sCod_Usuario}&Operacion=${ope}`);
  }

  mantenimientoConductorService(Cod_Accion: string, Cod_Conductor: string, dni: string, nombres: string, apellido_p: string, apellido_m: string, NumLic: string, Cat: string, Fec_Fin_Lic: string, Flg_Status: string) {

    if (!_moment(Fec_Fin_Lic).isValid()) {
      Fec_Fin_Lic = '01/01/1900';
    }

    Fec_Fin_Lic = _moment(Fec_Fin_Lic.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_man_conductor_vehiculo.php?Accion=${Cod_Accion}&Cod_Conductor=${Cod_Conductor}&Nro_DocIde=${dni}&Nombres=${nombres}&Apellido_P=${apellido_p}&Apellido_M=${apellido_m}&NumLic=${NumLic}&Cat=${Cat}&Fec_Fin_Lic=${Fec_Fin_Lic}&Flg_Status=${Flg_Status}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  mantenimientoUsuariosService(Nombres: string) {
    return this.http.get(`${this.baseUrl}/app_mantenimiento_muestra_usuarios.php?Nombres=${Nombres}`);
  }

  seg_listar_roles_opciones(Opcion: string, Cod_Rol) {
    return this.http.get(`${this.baseUrl}/seg_listar_roles_opciones.php?Opcion=${Opcion}&Cod_Rol=${Cod_Rol}`);
  }

  seg_modificar_estado_usuario(Id_Usuario: string, Flg_Activo) {
    return this.http.get(`${this.baseUrl}/seg_modificar_estado_usuario.php?Id_Usuario=${Id_Usuario}&Flg_Activo=${Flg_Activo}`);
  }


  seg_listar_usuario_rol(Opcion, Cod_Usuario_Rol) {
    return this.http.get(`${this.baseUrl}/seg_listar_usuario_rol.php?Opcion=${Opcion}&Cod_Usuario_Rol=${Cod_Usuario_Rol}`);
  }


  seg_crear_rol(Des_Rol: string, Cod_Usuario) {
    return this.http.get(`${this.baseUrl}/seg_crear_rol_web.php?Des_Rol=${Des_Rol}&Cod_Usuario=${Cod_Usuario}`);
  }
  seg_insertar_usuario_rol(Id_Usuario: string, Cod_Rol, Cod_Usuario_Reg) {
    return this.http.get(`${this.baseUrl}/seg_insertar_usuario_rol.php?Id_Usuario=${Id_Usuario}&Cod_Rol=${Cod_Rol}&Cod_Usuario_Reg=${Cod_Usuario_Reg}`);
  }

  seg_modificar_acceso_especial(Id_Usuario: string, Fec_Inicio_Acceso_Especial, Dias_Acceso_Especial) {
    if (!_moment(Fec_Inicio_Acceso_Especial).isValid()) {
      Fec_Inicio_Acceso_Especial = '01/01/1900';
    }

    Fec_Inicio_Acceso_Especial = _moment(Fec_Inicio_Acceso_Especial.valueOf()).format('DD/MM/YYYY');
    return this.http.get(`${this.baseUrl}/seg_modificar_acceso_especial.php?Id_Usuario=${Id_Usuario}&Fec_Inicio_Acceso_Especial=${Fec_Inicio_Acceso_Especial}&Dias_Acceso_Especial=${Dias_Acceso_Especial}`);
  }

  seg_insertar_opcion_rol(Opcion: string, Cod_Empresa: string, Cod_Rol, Cod_Opcion, Cod_Usuario_Reg) {
    return this.http.get(`${this.baseUrl}/seg_insertar_opcion_rol.php?Opcion=${Opcion}&Cod_Empresa=${Cod_Empresa}&Cod_Rol=${Cod_Rol}&Cod_Opcion=${Cod_Opcion}&Cod_Usuario_Reg=${Cod_Usuario_Reg}`);
  }

  seg_crud_opcion_usuario(Cod_Empresa: string, Cod_Rol, Cod_Opcion, Cod_Usuario) {
    return this.http.get(`${this.baseUrl}/seg_crud_opcion_usuario.php?Cod_Empresa=${Cod_Empresa}&Cod_Rol=${Cod_Rol}&Cod_Opcion=${Cod_Opcion}&Cod_Usuario=${Cod_Usuario}`);
  }

  mantenimientoUsuariosPermisosService() {
    return this.http.get(`${this.baseUrl}/Rh_Muestra_Usuarios_Areas_Asignadas.php`);
  }


  mantenimientoInspeccionService(Ticket: string, Usuario: string) {
    return this.http.get(`${this.baseUrl}/app_mantenimiento_inspeccion_paquete.php?Ticket=${Ticket}&Usuario=${Usuario}`);
  }

  eliminarAreaUsuarioPermiso(Cod_Trabajador: string, Cod_Empresa: string, RH_Cod_Area: string) {
    return this.http.get(`${this.baseUrl}/Rh_Eliminar_Area_Usuario.php?Cod_Trabajador=${Cod_Trabajador}&Cod_Empresa=${Cod_Empresa}&RH_Cod_Area=${RH_Cod_Area}`);
  }



  mantenimientoSeguimientoOrdenesService(Fecha, Fecha_Fin) {
    if (!_moment(Fecha).isValid()) {
      Fecha = '01/01/1900';
    }
    Fecha = _moment(Fecha.valueOf()).format('DD/MM/YYYY');

    if (!_moment(Fecha_Fin).isValid()) {
      Fecha_Fin = '01/01/1900';
    }
    Fecha_Fin = _moment(Fecha_Fin.valueOf()).format('DD/MM/YYYY');
    return this.http.get(`${this.baseUrl}/app_seguimiento_ordenes_atencion.php?Fec_Inicio=${Fecha}&Fec_Fin=${Fecha_Fin}`);
  }

  mantenimientoCorteSaldos(Fecha, Fecha_Fin) {
    if (!_moment(Fecha).isValid()) {
      Fecha = '01/01/1900';
    }
    Fecha = _moment(Fecha.valueOf()).format('DD/MM/YYYY');

    if (!_moment(Fecha_Fin).isValid()) {
      Fecha_Fin = '01/01/1900';
    }
    Fecha_Fin = _moment(Fecha_Fin.valueOf()).format('DD/MM/YYYY');
    return this.http.get(`${this.baseUrl}/app_CO_Reporte_Saldo_Devolver.php?Fec_Inicio=${Fecha}&Fec_Fin=${Fecha_Fin}`);
  }


  muestraReporteLecturaService(Opcion, Fecha, Fecha_Fin) {
    if (!_moment(Fecha).isValid()) {
      Fecha = '01/01/1900';
    }
    Fecha = _moment(Fecha.valueOf()).format('DD/MM/YYYY');

    if (!_moment(Fecha_Fin).isValid()) {
      Fecha_Fin = '01/01/1900';
    }
    Fecha_Fin = _moment(Fecha_Fin.valueOf()).format('DD/MM/YYYY');
    return this.http.get(`${this.baseUrl}/Rh_Muestra_Reporte_Lectura.php?Opcion=${Opcion}&Fec_Inicio=${Fecha}&Fec_Fin=${Fecha_Fin}`);
  }



  actualizarPaqueteInspeccionService(Id: string, Usuario: string) {
    return this.http.get(`${this.baseUrl}/app_CF_Man_Inspeccion_Prenda_Reversion_Paquete.php?Id=${Id}&Usuario=${Usuario}`);
  }

  CF_Modular_Inspeccion_Prenda_Reversion_Paquete(Id: string, Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Inspeccion_Prenda_Reversion_Paquete.php?Id=${Id}&Usuario=${Usuario}`);
  }

  CF_MUESTRA_MODULAR_PAQUETES_FINALIZADO(Ticket: string, Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MUESTRA_MODULAR_PAQUETES_FINALIZADO.php?Ticket=${Ticket}&Usuario=${Usuario}`);
  }

  mantenimientoVehiculoService(Cod_Accion: string, Des_Vehiculo: string, Num_Placa: string, Cod_Barras: string, Flg_Activo: string, Num_Soat: string, Fec_Fin_Soat: string, Num_Tarjeta_Prop: string, Tmp_Carga: string, Tmp_Descarga: string, Cod_Conductor: string, Cod_Vehiculo: string) {
    if (!_moment(Fec_Fin_Soat).isValid()) {
      Fec_Fin_Soat = '01/01/1900';
    }

    Fec_Fin_Soat = _moment(Fec_Fin_Soat.valueOf()).format('DD/MM/YYYY');


    return this.http.get(`${this.baseUrl}/app_man_vehiuculo_vehiculo.php?Accion=${Cod_Accion}&Des_Vehiculo=${Des_Vehiculo}&Num_Placa=${Num_Placa}&Cod_Barras=${Cod_Barras}&Flg_Activo=${Flg_Activo}&Cod_Usuario=${this.sCod_Usuario}&Num_Soat=${Num_Soat}&Fec_Fin_Soat=${Fec_Fin_Soat}&Num_Tarjeta_Prop=${Num_Tarjeta_Prop}&Tmp_Carga=${Tmp_Carga}&Tmp_Descarga=${Tmp_Descarga}&Cod_Conductor=${Cod_Conductor}&Cod_Vehiculo=${Cod_Vehiculo}`);
  }

  verReporteControlVehiculos(Fecha_Auditoria: string, Fecha_Auditoria2: string) {
    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '01/01/1900';
    }
    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '01/01/1900';
    }

    Fecha_Auditoria = _moment(Fecha_Auditoria.valueOf()).format('DD/MM/YYYY');
    Fecha_Auditoria2 = _moment(Fecha_Auditoria2.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_ver_reporte_control_vehiculo.php?Fec_Inicio=${Fecha_Auditoria}&Fec_Fin=${Fecha_Auditoria2}`);
  }

  Modificar_Km_Vehiculo(Id: number, Num_Kilometraje: number) {
    return this.http.get(`${this.baseUrl}/app_Modificar_Km_Vehiculo.php?Id=${Id}&Km=${Num_Kilometraje}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  mantenimientoUsuarioService(Usuario: string) {
    return this.http.get(`${this.baseUrl}/app_mantenimiento_muestra_usuario.php?Usuario=${Usuario}`);
  }
}
