import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DespachoOpIncompletaService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

 constructor(private http: HttpClient) { }


  MantenimientoAuditoriaInspeccionCosturaCabeceraService( Cod_Accion: string, Num_Auditoria: number,  Cod_Supervisor: string, Cod_Auditor: string,
                                                          Fecha_Auditoria: string, Fecha_Auditoria2: string, Cod_LinPro: string, Observacion: string, Flg_Status: string, Cod_OrdPro: string, Cod_EstCli: string){
    if (!_moment(Fecha_Auditoria).isValid()) {
      Fecha_Auditoria = '01/01/1900';
    }
    if (!_moment(Fecha_Auditoria2).isValid()) {
      Fecha_Auditoria2 = '01/01/1900';
    }
    Fecha_Auditoria = _moment(Fecha_Auditoria.valueOf()).format('DD/MM/YYYY');
    Fecha_Auditoria2 = _moment(Fecha_Auditoria2.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_Man_Auditoria_Inspeccion_Costura_cab.php?Accion=${Cod_Accion}&Num_Auditoria=${Num_Auditoria}&Cod_Supervisor=${Cod_Supervisor}&Cod_Auditor=${Cod_Auditor}&Fecha_Auditoria=${Fecha_Auditoria}&Fecha_Auditoria2=${Fecha_Auditoria2}&Cod_LinPro=${Cod_LinPro}&Observacion=${Observacion}&Flg_Status=${Flg_Status}&Cod_Usuario=${this.sCod_Usuario}&Cod_OrdPro=${Cod_OrdPro}&Cod_EstCli=${Cod_EstCli}`);
  }



  MantenimientoDespachoOpIncompleta(Cod_Accion: string, Cod_Ordtra: string, IdMotivo: number){
      return this.http.get(`${this.baseUrl}/app_Man_Despacho_Op_Incompleta.php?Accion=${Cod_Accion}&Cod_Ordtra=${Cod_Ordtra}&IdMotivo=${IdMotivo}&Cod_Usuario=${this.sCod_Usuario}`);
}

ReporteDespachoOpIncompleta(Cod_Accion: string, Fec_Inicio: string, Fec_Fin: string){

  if (!_moment(Fec_Inicio).isValid()) {
    Fec_Inicio = '01/01/1900';
  }
  if (!_moment(Fec_Fin).isValid()) {
    Fec_Fin = '01/01/1900';
  }
  Fec_Inicio = _moment(Fec_Inicio.valueOf()).format('DD/MM/YYYY');
  Fec_Fin = _moment(Fec_Fin.valueOf()).format('DD/MM/YYYY');

  return this.http.get(`${this.baseUrl}/app_Reporte_Despacho_Op_Incompleta.php?Accion=${Cod_Accion}&Fec_Inicio=${Fec_Inicio}&Fec_Fin=${Fec_Fin}`);
}

ListarMotivoDespachoOpIncompleta(){
  return this.http.get(`${this.baseUrl}/app_Listar_Motivo_Despacho_Op_Incompleta.php`);
}

PermitirGiradoOp(Cod_Accion: string, Cod_OrdPro: string, Fec_Inicio: string, Fec_Fin: string){

  if (!_moment(Fec_Inicio).isValid()) {
    Fec_Inicio = '01/01/1900';
  }
  if (!_moment(Fec_Fin).isValid()) {
    Fec_Fin = '01/01/1900';
  }
  Fec_Inicio = _moment(Fec_Inicio.valueOf()).format('DD/MM/YYYY');
  Fec_Fin = _moment(Fec_Fin.valueOf()).format('DD/MM/YYYY');

  return this.http.get(`${this.baseUrl}/app_Permitir_Girado_Op.php?Accion=${Cod_Accion}&Cod_OrdPro=${Cod_OrdPro}&Fec_Inicio=${Fec_Inicio}&Fec_Fin=${Fec_Fin}&Cod_Usuario=${this.sCod_Usuario}`);
}


Ti_Man_Aprobacion_Despacho_Cod_OrdPro_V2(Cod_Accion: string, Num_Grupo: number, Cod_OrdPro: string, Cod_Present:number, Cod_OrdTra: string, Id_Motivo:number, Fec_Inicio: string, Fec_Fin: string, Estado:string){

  if (!_moment(Fec_Inicio).isValid()) {
    Fec_Inicio = '01/01/1900';
  }
  if (!_moment(Fec_Fin).isValid()) {
    Fec_Fin = '01/01/1900';
  }
  Fec_Inicio = _moment(Fec_Inicio.valueOf()).format('DD/MM/YYYY');
  Fec_Fin = _moment(Fec_Fin.valueOf()).format('DD/MM/YYYY');

  return this.http.get(`${this.baseUrl}/app_Ti_Man_Aprobacion_Despacho_Cod_OrdPro_V2.php?Accion=${Cod_Accion}&Num_Grupo=${Num_Grupo}&Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Cod_OrdTra=${Cod_OrdTra}&Id_Motivo=${Id_Motivo}&Cod_Usuario=${this.sCod_Usuario}&Fec_Inicio=${Fec_Inicio}&Fec_Fin=${Fec_Fin}&Estado=${Estado}`);
}

}
