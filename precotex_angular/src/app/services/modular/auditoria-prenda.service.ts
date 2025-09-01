import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaPrendaService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }


  CF_Modular_Auditoria_Muestra_Paquete(Accion: string, Ticket: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Auditoria_Muestra_Paquete.php?Accion=${Accion}&Ticket=${Ticket}`);
  }

  CF_Modular_Man_Auditoria_Prendas(data: any) {
    return this.http.post(`${this.baseUrl}/modular/app_CF_Modular_Man_Auditoria_Prendas.php`, data);
  }

  CF_MUESTRA_INSPECCION_LECTURA_TICKET(Ticket: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MUESTRA_INSPECCION_LECTURA_TICKET_MODULAR.php?Ticket=${Ticket}`);
  }

  verReporteInspeccionPrenda(Fecha_Inicio, Fecha_Fin){
    /*if (!_moment(Fecha_Inicio).isValid()) {
      Fecha_Inicio = '';
    } 
    if (!_moment(Fecha_Fin).isValid()) {
      Fecha_Fin = '';
    } 

    Fecha_Inicio = _moment(Fecha_Inicio.valueOf()).format('DD/MM/YYYY');
    Fecha_Fin = _moment(Fecha_Fin.valueOf()).format('DD/MM/YYYY');*/
    if (!_moment(Fecha_Inicio).isValid()) {
      Fecha_Inicio = '';
    }else{
      Fecha_Inicio = _moment(Fecha_Inicio.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(Fecha_Fin).isValid()) {
      Fecha_Fin = '';
    }else{
      Fecha_Fin = _moment(Fecha_Fin.valueOf()).format('DD/MM/YYYY');
    }
    
    return this.http.get(`${this.baseUrl}/modular/app_CF_Reporte_Modular_Prenda_Ticket.php?Fecha_Inicio=${Fecha_Inicio}&Fecha_Fin=${Fecha_Fin}`);
  }

  CF_Modular_Reporte_Auditoria_Web(Accion: any, fIni: string,fFin: string) {
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
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Reporte_Auditoria_Web.php?Accion=${Accion}&fIni=${fIni}&fFin=${fFin}`);
  }
  
  CF_MODULAR_AUDITORIA_PRENDAS_WEB(Id_Auditoria_Modular: number) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_AUDITORIA_PRENDAS_WEB.php?Id_Auditoria_Modular=${Id_Auditoria_Modular}`);
  }

  CF_MODULAR_AUDITORIA_DEFECTO_FAMILIA(Id: number, Cod_Familia: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_AUDITORIA_DEFECTO_FAMILIA.php?Id=${Id}&Cod_Familia=${Cod_Familia}`);
  }

  CF_Man_Modular_Auditoria_Finaliza_Web(Accion:string, Flg_Estado: string, Id: number, Muestra: number, Cod_Usuario:string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Man_Modular_Auditoria_Finaliza_Web.php?Accion=${Accion}&Flg_Estado=${Flg_Estado}&Id=${Id}&Muestra=${Muestra}&Cod_Usuario=${Cod_Usuario}`);
  }

  
  //AGREGAR DEFECTO
  CF_Man_Modular_Auditoria_Detalle_Web(Accion: string, Id: number, Cod_Familia: string, Cod_Defecto: string, Id_Numero_Prenda: string, Defecto_Leve: string, Defecto_Critico: string, Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Man_Modular_Auditoria_Detalle_Web.php?Accion=${Accion}&Id=${Id}&Cod_Familia=${Cod_Familia}&Cod_Defecto=${Cod_Defecto}&Id_Numero_Prenda=${Id_Numero_Prenda}&Defecto_Leve=${Defecto_Leve}&Defecto_Critico=${Defecto_Critico}&Usuario=${Usuario}`);
  }


  CF_Auditoria_Agregar_Prenda_Web(Accion: string, Id_Auditoria_Modular: number, Id_Numero_Prenda: string, Cod_Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Auditoria_Agregar_Prenda_Web.php?Accion=${Accion}&Id_Auditoria_Modular=${Id_Auditoria_Modular}&Id_Numero_Prenda=${Id_Numero_Prenda}&Cod_Usuario=${Cod_Usuario}`);
  }

  CF_MODULAR_CANTIDAD_AUDITORIA_PRENDAS(Id_Auditoria_Modular: number) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_CANTIDAD_AUDITORIA_PRENDAS.php?Id_Auditoria_Modular=${Id_Auditoria_Modular}`);
  }

  CF_Modular_Reporte_Auditoria_Ticket_Web(Accion: any, fIni: string,fFin: string, usuario: string) {
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
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Reporte_Auditoria_Ticket_Web.php?Accion=${Accion}&fIni=${fIni}&fFin=${fFin}&usuario=${usuario}`);
  }
  
  
}
