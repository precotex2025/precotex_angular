import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class ActasAcuerdosService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;
  
  constructor(private http: HttpClient) { }


  MuestraAcuerdosService(Opcion: string, Sede: string, Area: string, Fecha_Inicio: string,Fecha_Fin: string){

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

    return this.http.get(`${this.baseUrl}/app_AC_Muestra_Actas_Acuerdos.php?Opcion=${Opcion}&Sede=${Sede}&Area=${Area}&Fecha_Inicio=${Fecha_Inicio}&Fecha_Fin=${Fecha_Fin}`);                                             
  }

  InsertarParticipanteService(Opcion: string, IdParticipante: string, Nombres: string, Apellidos: string,Telefono: string,Correo: string,Firma: string, Cargo: string){
    return this.http.get(`${this.baseUrl}/app_AC_Insertar_Participantes.php?Opcion=${Opcion}&IdParticipante=${IdParticipante}&Nombres=${Nombres}&Apellidos=${Apellidos}&Telefono=${Telefono}&Correo=${Correo}&Firma=${Firma}&Cargo=${Cargo}`);
  }

  areasService(){
    return this.http.get(`${this.baseUrl}/app_cc_muestra_Areas_Trabajo.php`);
  }

  insertarActasAcuerdos(data){
    return this.http.post(`${this.baseUrl}/app_AC_Insertar_Actas_Acuerdos.php`, data);
  }

  actualizarFirma(data){
    return this.http.post(`${this.baseUrl}/app_AC_Actualizar_Firma_Participante.php`, data);
  }

  

  muestraParticipantesActa(IdActa){
    return this.http.get(`${this.baseUrl}/app_AC_Muestra_Participantes_Actas.php?IdActa=${IdActa}`);
  }

  enviarCorreo(IdParticipante, IdActa){
    return this.http.get(`${this.baseUrl}/app_AC_ENVIO_CORREO_PARTICIPANTE_ACTA.php?IdParticipante=${IdParticipante}&IdActa=${IdActa}`);
  }

  
  
  mantenimientoParticipantesActa(IdActa, IdParticipante){
    return this.http.get(`${this.baseUrl}/app_AC_Insertar_Actas_Participantes.php?IdActa=${IdActa}&IdParticipante=${IdParticipante}`);
  }

  revertirEnvioCorreo(IdActa, IdParticipante){
    return this.http.get(`${this.baseUrl}/app_AC_REVERTIR_ENVIO_CORREO.php?IdActa=${IdActa}&IdParticipante=${IdParticipante}`);
  }
  
  
}
