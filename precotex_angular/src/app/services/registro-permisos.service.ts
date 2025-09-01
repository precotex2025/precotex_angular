import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class RegistroPermisosService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  listarPermisosXFecha(Fecha_Inicio: string, Fecha_Fin: string, Empresa: string) {

    if (!_moment(Fecha_Inicio).isValid()) {
      Fecha_Inicio = '01/01/1900';
    }

    if (!_moment(Fecha_Fin).isValid()) {
      Fecha_Fin = '01/01/1900';
    }

    Fecha_Inicio = _moment(Fecha_Inicio.valueOf()).format('DD/MM/YYYY');
    Fecha_Fin = _moment(Fecha_Fin.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_listar_permisos_registrados.php?Fec_Inicio=${Fecha_Inicio}&Fec_Fin=${Fecha_Fin}&Empresa=${Empresa}&Cod_Usuario=${this.sCod_Usuario}`);
  }


  listarTrabajadores(usuario) {
    return this.http.get(`${this.baseUrl}/app_listar_mostrar_trabajadoresPermisosWeb.php?usuario=${usuario}`);
  }

  Rh_Mostrar_Areas_Permiso_Web(usuario) {
    return this.http.get(`${this.baseUrl}/app_Rh_Mostrar_Areas_Permiso_Web.php?Cod_Usuario=${usuario}`);
  }

  Rh_Muestra_Trabajadores_Jefe_Web(Opcion, Cod_Trabajador, Tip_Trabajador, Cod_Empresa) {
    return this.http.get(`${this.baseUrl}/app_Rh_Muestra_Trabajadores_Jefe_Web.php?Opcion=${Opcion}&Cod_Trabajador=${Cod_Trabajador}&Tip_Trabajador=${Tip_Trabajador}&Cod_Empresa=${Cod_Empresa}`);
  }

  eliminarAreaUsuarioPermiso(Cod_Trabajador: string ,Cod_Empresa: string, RH_Cod_Area:string){
    return this.http.get(`${this.baseUrl}/Rh_Eliminar_Area_Usuario.php?Cod_Trabajador=${Cod_Trabajador}&Cod_Empresa=${Cod_Empresa}&RH_Cod_Area=${RH_Cod_Area}`);
  }
  Rh_Muestra_Permisos_Por_Aprobar(Fecha,
    Tip_Trabajador,
    Cod_Trabajador,
    Cod_Empresa){
    return this.http.get(`${this.baseUrl}/app_Rh_Muestra_Permisos_Por_Aprobar.php?Fecha=${Fecha}&Tip_Trabajador=${Tip_Trabajador}&Cod_Trabajador=${Cod_Trabajador}&Cod_Empresa=${Cod_Empresa}`);
  }

  Rh_Jefatura_Aprueba_Permisos(Num_Permiso, Cod_Trabajador, Tip_Trabajador){
    return this.http.get(`${this.baseUrl}/app_Rh_Jefatura_Aprueba_Permisos.php?Num_Permiso=${Num_Permiso}&Cod_Trabajador=${Cod_Trabajador}&Tip_Trabajador=${Tip_Trabajador}`);
  }

  
  

  

  eliminarPermiso(Permiso) {
    return this.http.get(`${this.baseUrl}/Rh_Permiso_Eliminar.php?Permiso=${Permiso}`);
  }

  horariosFeriados(fecha) {
    return this.http.get(`${this.baseUrl}/app_devuelve_feriado.php?fecha=${fecha}`);
  }

  horariosTrabajadores(cod_empresa, tipo, codigo, fecha, condicion) {
    return this.http.get(`${this.baseUrl}/app_devuelve_HorarioTrabajador.php?cod_empresa=${cod_empresa}&tipo=${tipo}&codigo=${codigo}&fecha=${fecha}&condicion=${condicion}`);
  }

  horarioTrabajador(tipo, codigo, fecha) {
    return this.http.get(`${this.baseUrl}/app_Rh_Horario_Trabajador.php?&Tip_Trabajador=${tipo}&Cod_Trabajador=${codigo}&Fecha=${fecha}`);
  }

  horariosTrabajadoresEmpresa(cod_empresa, tipo, codigo, fecha, condicion) {
    return this.http.get(`${this.baseUrl}/app_devuelve_HorarioTrabajadorEmpresa.php?cod_empresa=${cod_empresa}&tipo=${tipo}&codigo=${codigo}&fecha=${fecha}&condicion=${condicion}`);
  }

  retornaIdPermiso(fecha) {
    return this.http.get(`${this.baseUrl}/retornaIdPermisos.php`);
  }

  guardarPermiso(fecha, jefe, tipos, motivos, obse) {
    let id = this.retornaIdPermiso(fecha)
    return id
  }

  getEmpresasVacaciones(Opcion, Cod_Trabajador, Tip_Trabajador, Cod_Empresa) {
    return this.http.get(`${this.baseUrl}/app_Rh_muestra_empresas_vacaciones.php?Opcion=${Opcion}&Cod_Trabajador=${Cod_Trabajador}&Tip_Trabajador=${Tip_Trabajador}&Cod_Empresa=${Cod_Empresa}`);
  }

  actualizarRegistroMerma(Opcion, IdMerma, Peso, Defecto_Principal, Validacion, Observaciones, Cod_Usuario, Defecto_Principal_Interno) {
    return this.http.get(`${this.baseUrl}/app_CF_Actualizar_Registro_Merma_Interno.php?Opcion=${Opcion}&IdMerma=${IdMerma}&Peso=${Peso}&Defecto_Principal=${Defecto_Principal}&Validacion=${Validacion}&Observaciones=${Observaciones}&Cod_Usuario=${Cod_Usuario}&Defecto_Principal_Interno=${Defecto_Principal_Interno}`);
  }

  
  registroMermaPrendasTalla(Opcion, IdMerma, Cod_Talla, MERCADO_LOCAL, RECUPERACION) {
    return this.http.get(`${this.baseUrl}/app_CF_Insertar_Registro_Merma_Talla.php?Opcion=${Opcion}&IdMerma=${IdMerma}&Cod_Talla=${Cod_Talla}&MERCADO_LOCAL=${MERCADO_LOCAL}&RECUPERACION=${RECUPERACION}`);
  }

  

  verUsuariosBd(Empresa: string){    
    return this.http.get(`${this.baseUrl}/seg_obtener_usuarios_bd.php?Empresa=${Empresa}`);
  }

  CF_Obtener_Lista_Merma(Opcion: string, oc,
    OP,
    Fecha_inicio,
    Fecha_Fin){    
      if (!_moment(Fecha_inicio).isValid()) {
        Fecha_inicio = '';
      }else{
        Fecha_inicio = _moment(Fecha_inicio.valueOf()).format('DD/MM/YYYY');
      }
  
      if (!_moment(Fecha_Fin).isValid()) {
        Fecha_Fin = '';
      }else{
        Fecha_Fin = _moment(Fecha_Fin.valueOf()).format('DD/MM/YYYY');
      }
  
      
      
    return this.http.get(`${this.baseUrl}/app_CF_Obtener_Lista_Merma.php?Opcion=${Opcion}&OC=${oc}&OP=${OP}&Fecha_Inicio=${Fecha_inicio}&Fecha_Fin=${Fecha_Fin}`);
  }

  

  obtenerOpSec(OC: string){
    return this.http.get(`${this.baseUrl}/app_CF_obtener_data_Op.php?OC=${OC}`);
  }

  ObtenerAdicionalesMerma(Opcion: string){
    return this.http.get(`${this.baseUrl}/app_CF_Obtener_Adicionales_Merma.php?Opcion=${Opcion}`);
  }

  registroMermaPrendasOp(Opcion: string, Turno, OP_SEC, OC, Partida, Estilo, Color, Defecto_Principal, Pzas_Buenas, Merma_Declarada, Merma_Fisica, Dif, Prendas_Mercado_Local, Valor_Mercado, Prendas_Recuperadas, Valor_Recuperadas, Notas, Cod_Auditor_Calidad, Cliente, IdMerma, Fase){
    return this.http.get(`${this.baseUrl}/app_CF_Insertar_Registro_Merma.php?Opcion=${Opcion}&Turno=${Turno}&OP_SEC=${OP_SEC}&OC=${OC}&Partida=${Partida}&Estilo=${Estilo}&Color=${Color}&Defecto_Principal=${Defecto_Principal}&Pzas_Buenas=${Pzas_Buenas}&Merma_Declarada=${Merma_Declarada}&Merma_Fisica=${Merma_Fisica}&Dif=${Dif}&Prendas_Mercado_Local=${Prendas_Mercado_Local}&Valor_Mercado=${Valor_Mercado}&Prendas_Recuperadas=${Prendas_Recuperadas}&Valor_Recuperadas=${Valor_Recuperadas}&Notas=${Notas}&Cod_Auditor_Calidad=${Cod_Auditor_Calidad}&Cliente=${Cliente}&IdMerma=${IdMerma}&Fase=${Fase}`);
  }
  


  
  
  obtenerDatosPorOp(OP: string, Num_SecOrd: string){
    return this.http.get(`${this.baseUrl}/app_CF_Obtener_Datos_por_OP.php?OP=${OP}&Num_SecOrd=${Num_SecOrd}`);
  }

  obtenerMermaGeneralOp(OP: string){
    return this.http.get(`${this.baseUrl}/app_CF_Obtener_Merma_General_Op.php?OP=${OP}`);
  }
  
  obtenerMermaPrendasOp(Opcion: string, Cod_OrdPro, Num_SecOrd: string, IdMerma){
    return this.http.get(`${this.baseUrl}/app_CF_Obtener_Merma_Prendas_por_OP.php?Opcion=${Opcion}&Cod_OrdPro=${Cod_OrdPro}&Num_SecOrd=${Num_SecOrd}&IdMerma=${IdMerma}`);
  }
  
  
  
  updateEstadoVacaciones(Opcion, Flg_Estado, id) {
    return this.http.get(`${this.baseUrl}/app_Rh_Actualizar_Vacaciones_Web.php?Opcion=${Opcion}&Flg_Estado=${Flg_Estado}&id=${id}`);
  }

  

  grabarDatosVacaciones(data) {
    return this.http.post(`${this.baseUrl}/app_Rh_Insertar_Vacaciones_web.php`, data);
  }

  getControlVacacionesTrabajador(Cod_Trabajador, Tip_Trabajador, Cod_Empresa) {
    return this.http.get(`${this.baseUrl}/app_Rh_control_vacaciones_trabajador.php?Cod_Trabajador=${Cod_Trabajador}&Tip_Trabajador=${Tip_Trabajador}&Cod_Empresa=${Cod_Empresa}`);
  }
  
  retornaIdPermisoRefrigerio(fecha) {
    return this.http.get(`${this.baseUrl}/retornaldPermisosRefrigerio.php?Fecha=${fecha}`);
  }

  muestraTrabajadorporCodigo(Cod_Trabajador, Tip_Trabajador) {
    return this.http.get(`${this.baseUrl}/app_Rh_Muestra_Trabajador_x_Codigo.php?Cod_Trabajador=${Cod_Trabajador}&Tip_Trabajador=${Tip_Trabajador}`);
  }

  muestraAreasPorEmpresa(Cod_Empresa) {
    return this.http.get(`${this.baseUrl}/Rh_Muestra_Areas_x_Empresa.php?Cod_Empresa=${Cod_Empresa}`);
  }

  insertaAreasPorUsuario(Opcion, Cod_Fabrica, Tip_Trabajador, Cod_Trabajador, Cod_Empresa, RH_Cod_Area, Tipo) {
    return this.http.get(`${this.baseUrl}/Rh_Insertar_Usuario_Area_Permisos.php?Opcion=${Opcion}&Cod_Fabrica=${Cod_Fabrica}&Tip_Trabajador=${Tip_Trabajador}&Cod_Trabajador=${Cod_Trabajador}&Cod_Empresa=${Cod_Empresa}&RH_Cod_Area=${RH_Cod_Area}&Tipo=${Tipo}`);
  }

  mantenimientoUsuariosService(Nombres: string){
    return this.http.get(`${this.baseUrl}/app_mantenimiento_muestra_usuarios.php?Nombres=${Nombres}`);
    }
  

  

  guardarPermisoRefrigerio(fecha, jefe, tipos, motivos, obse) {
    let id = this.retornaIdPermisoRefrigerio(fecha)
    return id
  }

  grabarCabeceraPermiso(opcion, idPermiso, fecha, Tipos, Motivos, tipoJefe, codJefe, Observaciones, usuario, sede) {
    return this.http.get(`${this.baseUrl}/Rh_Man_Permiso_Cab.php?Opcion=${opcion}
    &Num_Permiso=${idPermiso}
    &Fec_Permiso=${fecha}
    &Cod_Tipo_Permiso=${Tipos}
    &Cod_Motivo_Permiso=${Motivos}
    &Tip_Trabajador_Autoriza=${tipoJefe}
    &Cod_Trabajador_Autoriza=${codJefe}
    &Observacion=${Observaciones}
    &Cod_Usuario=${usuario}
    &Sede_partida=${sede}`
    );
  }

  grabarCabeceraPermisoRefrigerio(data) {
    return this.http.post(`${this.baseUrl}/Rh_Man_Permiso_Cab_Re.php`, data);
  }

  grabarCabeceraPermisoRe(opcion, idPermiso, fecha, Tipos, Motivos, tipoJefe, codJefe, Observaciones, usuario) {
    return this.http.get(`${this.baseUrl}/Rh_Man_Permiso_Cab_Re.php?Opcion=${opcion}
    &Num_Permiso=${idPermiso}
    &Fec_Permiso=${fecha}
    &Cod_Tipo_Permiso=${Tipos}
    &Cod_Motivo_Permiso=${Motivos}
    &Tip_Trabajador_Autoriza=${tipoJefe}
    &Cod_Trabajador_Autoriza=${codJefe}
    &Observacion=${Observaciones}
    &Cod_Usuario=${usuario}`);
  }

  muestraPermisoTrabajadorLec(Dni, Fecha) {
    if (!_moment(Fecha).isValid()) {
      Fecha = '01/01/1900';
    }
    Fecha = _moment(Fecha.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/Rh_Muestra_Permiso_Trabajador_Lec.php?Dni=${Dni}&Fecha=${Fecha}`);
  }

  muestraPermisoRefrigerioLec(Fecha, Sede_partida) {
    if (!_moment(Fecha).isValid()) {
      Fecha = '01/01/1900';
    }
    Fecha = _moment(Fecha.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/Rh_Muestra_Permisos_Refrigerio.php?Fecha=${Fecha}&Sede_partida=${Sede_partida}`);
  }

  muestraPermisoDetalle(Permiso) {

    return this.http.get(`${this.baseUrl}/Rh_Permiso_Detalle_Trabajadores.php?Permiso=${Permiso}`);
  }
  muestraPermisoRefrigerioLecturados(Fecha, Sede_partida) {
    if (!_moment(Fecha).isValid()) {
      Fecha = '01/01/1900';
    }
    Fecha = _moment(Fecha.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/Rh_Permisos_Refrigerio_Lecturados.php?Fecha=${Fecha}&Sede_partida=${Sede_partida}`);
  }

  Rh_Permisos_Refrigerio_Lecturados

  muestraComisionTrabajadorLec(Dni, Fecha) {
    if (!_moment(Fecha).isValid()) {
      Fecha = '01/01/1900';
    }
    Fecha = _moment(Fecha.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/Rh_Muestra_Comision_Trabajador_Lec.php?Dni=${Dni}&Fecha=${Fecha}`);
  }

  insertaPermisoTrabajadorLec(Num_Permiso, Fec_Permiso, Cod_Tipo_Permiso, Tip_Trabajador, Cod_Trabajador, Lectura_Hora, Lectura_Minuto, Cod_Usuario, Tipo, Sede) {
    return this.http.get(`${this.baseUrl}/Rh_Insertar_Permiso_Lectura.php?Num_Permiso=${Num_Permiso}
    &Fec_Permiso=${Fec_Permiso}
    &Cod_Tipo_Permiso=${Cod_Tipo_Permiso}
    &Tip_Trabajador=${Tip_Trabajador}
    &Cod_Trabajador=${Cod_Trabajador}
    &Lectura_Hora=${Lectura_Hora}
    &Lectura_Minuto=${Lectura_Minuto}
    &Cod_Usuario=${Cod_Usuario}
    &Tipo=${Tipo}
    &Sede=${Sede}`
    );
  }

  grabarDetallePermiso(opcion: string, idPermiso: string, codigo: string, tipoTrab: string, CodigoTrab: string, Hini: string, Mini: string, Hfin: string, Mfin: string, usuario: string, Cod_Empresa: string) : Observable<Response[]>{

    return this.http.get<Response[]>(`${this.baseUrl}/Rh_Man_Permiso_Det.php?Opcion=${opcion}&Num_Permiso=${idPermiso}&Cod_Fabrica=${codigo}&Tip_Trabajador=${tipoTrab}&Cod_Trabajador=${CodigoTrab}&Inicio_Hora=${Hini}&Inicio_Minuto=${Mini}&Termino_Hora=${Hfin}&Termino_Minuto=${Mfin}&Cod_Usuario=${usuario}&Cod_Empresa=${Cod_Empresa}`);
  }

  recogedatosJefes(jefe) {
    return this.http.get(`${this.baseUrl}/Datos_Jefes_Permiso_Cab.php?jefe=${jefe}`);
  }

  MostrarAlerta(idPermiso, Cod_Usuario) {

    return this.http.get(`${this.baseUrl}/app_Mostrar_Alerta_Permiso_User_h2.php?Num_Permiso=${idPermiso}&Cod_Usuario=${Cod_Usuario}`);
  }

  /*
  Genererar registro de interface para registrar permiso en el Spring
  2024Nov06, Ahmed
  */

  interfaceSpring(Num_Permiso: string, Tip_Trabajador: string, Cod_Trabajador: string, Tipo: number) : Observable<Response[]>{
    return this.http.get<Response[]>(`${this.baseUrl}/spring/app_Rh_Permiso_Spring.php?Num_Permiso=${Num_Permiso}
    &Tip_Trabajador=${Tip_Trabajador}
    &Cod_Trabajador=${Cod_Trabajador}
    &Tipo=${Tipo}`
    );
  }

  generarPermisoSpring(Tipo: string, NroDocumento: string, CompaniaSocio: string, Fecha: string, ConceptoAcceso: string, Desde: string, FechaFin: string, Hasta: string, FechaAutorizacion: string, Observacion: string, FechaSolicitud: string, UltimoUsuario: string, UltimaFechaModif: string, FlagPermisoInicioFinJornada: string) : Observable<Response[]>{   
    return this.http.get<Response[]>(this.baseUrl + "/spring/app_As_Grabar_Permiso.php?Tipo=" + Tipo.trim() +
      "&NroDocumento=" + NroDocumento.trim() +
      "&CompaniaSocio=" + CompaniaSocio.trim() +
      "&Fecha=" + Fecha +
      "&ConceptoAcceso=" + ConceptoAcceso.trim() +
      "&Desde=" + Desde +
      "&FechaFin=" + FechaFin +
      "&Hasta=" + Hasta +
      "&FechaAutorizacion=" + FechaAutorizacion +
      "&Observacion=" + Observacion.trim() +
      "&FechaSolicitud=" + FechaSolicitud +
      "&UltimoUsuario=" + UltimoUsuario.trim() +
      "&UltimaFechaModif=" + UltimaFechaModif +
      "&FlagPermisoInicioFinJornada=" + FlagPermisoInicioFinJornada.trim()
    );

    /*return this.http.get(`${this.baseUrl}/spring/app_As_Grabar_Permiso.php?NroDocumento=${NroDocumento.trim()}
    &CompaniaSocio=${CompaniaSocio.trim()}
    &Fecha=${Fecha}
    &ConceptoAcceso=${ConceptoAcceso.trim()}
    &Desde=${Desde}
    &FechaFin=${FechaFin}
    &Hasta=${Hasta}
    &FechaAutorizacion=${FechaAutorizacion}
    &Observacion=${Observacion.trim()}
    &FechaSolicitud=${FechaSolicitud}
    &UltimoUsuario=${UltimoUsuario.trim()}
    &UltimaFechaModif=${UltimaFechaModif}`
    );*/
  }


}
