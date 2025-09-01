import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';
import * as _moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class EncuestasComedorService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;
  
  constructor(private http: HttpClient) { }

  obtenerPreguntasComedor(Opcion: string, Id_Cabecera: string, Id_Detalle: any, Pregunta: String) {
    return this.http.get(`${this.baseUrl}/app_COM_CREATE_PREGUNTAS_DET_WEB.php?Opcion=${Opcion}&Id_Cabecera=${Id_Cabecera}&Id_Detalle=${Id_Detalle}&Pregunta=${Pregunta}`);
  }

  obtenerReportesComedor(Tipo: string, Fec_Inicio: string, Fec_Fin: string, Sede : string) {

    if (!_moment(Fec_Inicio).isValid()) {
      Fec_Inicio = '';
    }else{
      Fec_Inicio = _moment(Fec_Inicio.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(Fec_Fin).isValid()) {
      Fec_Fin = '';
    }else{
      Fec_Fin = _moment(Fec_Fin.valueOf()).format('DD/MM/YYYY');
    }

    
    
    return this.http.get(`${this.baseUrl}/app_COM_REPORTE_RESPUESTAS_WEB.php?Tipo=${Tipo}&Fec_Inicio=${Fec_Inicio}&Fec_Fin=${Fec_Fin}&Sede=${Sede}`);
  }


  COM_REPORTE_PREG_RESPUESTAS_WEB(Tipo_Servicio: string, Tipo: string, Fec_Inicio: string, Fec_Fin: string, Sede: string) {
    if (!_moment(Fec_Inicio).isValid()) {
      Fec_Inicio = '';
    }else{
      Fec_Inicio = _moment(Fec_Inicio.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(Fec_Fin).isValid()) {
      Fec_Fin = '';
    }else{
      Fec_Fin = _moment(Fec_Fin.valueOf()).format('DD/MM/YYYY');
    }
    return this.http.get(`${this.baseUrl}/app_COM_REPORTE_PREG_RESPUESTAS_WEB.php?Tipo_Servicio=${Tipo_Servicio}&Tipo=${Tipo}&Fec_Inicio=${Fec_Inicio}&Fec_Fin=${Fec_Fin}&Sede=${Sede}`);
  }

  
  obtenerPreguntaCabComedor(Opcion: string, Id_Cabecera: any, Tipo_Servicio: string, Titulo: String, Descripcion: string, Flg_Estado: string) {
    return this.http.get(`${this.baseUrl}/app_COM_CREATE_PREGUNTAS_CAB_WEB.php?Opcion=${Opcion}&Id_Cabecera=${Id_Cabecera}&Tipo_Servicio=${Tipo_Servicio}&Titulo=${Titulo}&Descripcion=${Descripcion}&Flg_Estado=${Flg_Estado}`);
  }

  
}
