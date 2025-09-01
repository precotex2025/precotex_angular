import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';

import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SeguridadActivoFijoReporteService {
  
  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  verReporteActivoFijo(Fecha_Auditoria: string, Fecha_Auditoria2: string){
    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '01/01/1900';
    } 
    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '01/01/1900';
    } 

    Fecha_Auditoria = _moment(Fecha_Auditoria.valueOf()).format('DD/MM/YYYY');
    Fecha_Auditoria2 = _moment(Fecha_Auditoria2.valueOf()).format('DD/MM/YYYY');
    
    return this.http.get(`${this.baseUrl}/app_ver_reporte_activo_fijo.php?Fec_Inicio=${Fecha_Auditoria}&Fec_Fin=${Fecha_Auditoria2}`);
  }

  verHistorialActivoFijo(Fecha_Auditoria: string, Fecha_Auditoria2: string){
    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '01/01/1900';
    } 
    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '01/01/1900';
    } 

    Fecha_Auditoria = _moment(Fecha_Auditoria.valueOf()).format('DD/MM/YYYY');
    Fecha_Auditoria2 = _moment(Fecha_Auditoria2.valueOf()).format('DD/MM/YYYY');
    
    return this.http.get(`${this.baseUrl}/app_ver_historial_activo_fijo.php?Fec_Inicio=${Fecha_Auditoria}&Fec_Fin=${Fecha_Auditoria2}`);
  }

  verActivoFijo(Opcion, Cod_Activo_Fijo: string){
    return this.http.get(`${this.baseUrl}/app_obtener_Activo_Fijo.php?Opcion=${Opcion}&Cod_Activo_Fijo=${Cod_Activo_Fijo}`);
  }

  verReporteInspeccionPrenda(Accion: string, Fecha_Inicio: string, Fecha_Fin: string){
    if (!_moment(Fecha_Inicio).isValid()) {
      Fecha_Inicio = '01/01/1900';
    } 
    if (!_moment(Fecha_Fin).isValid()) {
      Fecha_Fin = '01/01/1900';
    } 

    Fecha_Inicio = _moment(Fecha_Inicio.valueOf()).format('DD/MM/YYYY');
    Fecha_Fin = _moment(Fecha_Fin.valueOf()).format('DD/MM/YYYY');
    
    return this.http.get(`${this.baseUrl}/app_muestra_reporte_inspeccion.php?Accion=${Accion}&Fecha_Inicio=${Fecha_Inicio}&Fecha_Fin=${Fecha_Fin}`);
  }

  reporteInspeccionSeguimiento(Fecha_Inicio: string, Fecha_Fin: string){
    if (!_moment(Fecha_Inicio).isValid()) {
      Fecha_Inicio = '01/01/1900';
    } 
    if (!_moment(Fecha_Fin).isValid()) {
      Fecha_Fin = '01/01/1900';
    } 

    Fecha_Inicio = _moment(Fecha_Inicio.valueOf()).format('DD/MM/YYYY');
    Fecha_Fin = _moment(Fecha_Fin.valueOf()).format('DD/MM/YYYY');
    
    return this.http.get(`${this.baseUrl}/app_CF_Man_Inspeccion_Seguimiento_OP.php?Fecha_Inicio=${Fecha_Inicio}&Fecha_Fin=${Fecha_Fin}`);
  }

  verModularReporteInspeccionDefectosPrenda(Accion: string, Cod_Modulo: string, Fecha_Inicio: string, Fecha_Fin: string){
    if (!_moment(Fecha_Inicio).isValid()) {
      Fecha_Inicio = '01/01/1900';
    } 
    if (!_moment(Fecha_Fin).isValid()) {
      Fecha_Fin = '01/01/1900';
    } 

    Fecha_Inicio = _moment(Fecha_Inicio.valueOf()).format('DD/MM/YYYY');
    Fecha_Fin = _moment(Fecha_Fin.valueOf()).format('DD/MM/YYYY');
    
    return this.http.get(`${this.baseUrl}/app_modular_reporte_inspeccion_defectos.php?Accion=${Accion}&Cod_Modulo=${Cod_Modulo}&Fecha_Inicio=${Fecha_Inicio}&Fecha_Fin=${Fecha_Fin}`);
  }

  CF_Modular_Reporte_Auditoria_Salida(Accion: any, Cod_Modulo: string, fIni: string,fFin: string) {
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
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Reporte_Auditoria_Salida.php?Accion=${Accion}&Cod_Modulo=${Cod_Modulo}&fIni=${fIni}&fFin=${fFin}`);
  }
  CF_Modular_Reporte_Auditoria_Proceso(Accion: any, Cod_Modulo: string, fIni: string,fFin: string) {
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
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Reporte_Auditoria_Proceso.php?Accion=${Accion}&Cod_Modulo=${Cod_Modulo}&fIni=${fIni}&fFin=${fFin}`);
  }

   
  
}