import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';
import * as _moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';

interface IRangeFechas {
  start: any, 
  end: any
}

@Injectable({
  providedIn: 'root'
})

export class MantMaestroBolsaService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;
  fechasSubject = new BehaviorSubject([]);
  private fechas: IRangeFechas[] = [];

  constructor(private http: HttpClient) { }

  obtenerDatos_S(Opcion: string, Id_Bolsa: number, Fec_Inicio: string, Fec_Fin: string) {
    if (!_moment(Fec_Inicio).isValid()) {
      Fec_Inicio = '';
    } else {
      Fec_Inicio = _moment(Fec_Inicio.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(Fec_Fin).isValid()) {
      Fec_Fin = '';
    } else {
      Fec_Fin = _moment(Fec_Fin.valueOf()).format('DD/MM/YYYY');
    }

    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Cod_Usuario=${this.sCod_Usuario}&Fec_Inicio=${Fec_Inicio}&Fec_Fin=${Fec_Fin}`);
  }

  insertarDatos_S(Opcion: string, Id_Bolsa: number, Fec_Inicio: string, Fec_Fin: string) {
    if (!_moment(Fec_Inicio).isValid()) {
      Fec_Inicio = '';
    } else {
      Fec_Inicio = _moment(Fec_Inicio.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(Fec_Fin).isValid()) {
      Fec_Fin = '';
    } else {
      Fec_Fin = _moment(Fec_Fin.valueOf()).format('DD/MM/YYYY');
    }

    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Cod_Usuario=${this.sCod_Usuario}&Fec_Inicio=${Fec_Inicio}&Fec_Fin=${Fec_Fin}`);
  }

  actualizarDatos_S(Opcion: string, Id_Bolsa: number, Fec_Inicio: string, Fec_Fin: string) {
    if (!_moment(Fec_Inicio).isValid()) {
      Fec_Inicio = '';
    } else {
      Fec_Inicio = _moment(Fec_Inicio.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(Fec_Fin).isValid()) {
      Fec_Fin = '';
    } else {
      Fec_Fin = _moment(Fec_Fin.valueOf()).format('DD/MM/YYYY');
    }

    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Cod_Usuario=${this.sCod_Usuario}&Fec_Inicio=${Fec_Inicio}&Fec_Fin=${Fec_Fin}`);
  }

  eliminarDatos_S(Opcion: string, Id_Bolsa: number, Fec_Inicio: string, Fec_Fin: string) {
    if (!_moment(Fec_Inicio).isValid()) {
      Fec_Inicio = '';
    } else {
      Fec_Inicio = _moment(Fec_Inicio.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(Fec_Fin).isValid()) {
      Fec_Fin = '';
    } else {
      Fec_Fin = _moment(Fec_Fin.valueOf()).format('DD/MM/YYYY');
    }
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_ARTES.php?Opcion=${Opcion}&Id_Bolsa=${Id_Bolsa}&Cod_Usuario=${this.sCod_Usuario}&Fec_Inicio=${Fec_Inicio}&Fec_Fin=${Fec_Fin}`);
  }

  movimientoProcesoWeb(Accion: string, Cod_Almacen_Origen: string, Cod_Almacen_Destino: string, Cod_Barra: string) {

    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_MOVIMIENTO_PROCESO_WEB.php?Accion=${Accion}&Cod_Almacen_Origen=${Cod_Almacen_Origen}&Cod_Almacen_Destino=${Cod_Almacen_Destino}&Cod_Barra=${Cod_Barra}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  obtenerDatosProcesos(Accion: string, Cod_Barra: string) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_BOLSA_PROCESO_WEB.php?Accion=${Accion}&Cod_Barra=${Cod_Barra}`);
  }

  getRangoFechas(): Observable<IRangeFechas[]> {
    return this.fechasSubject.asObservable();
  }

  setRangoFechas(item: IRangeFechas) {
    this.cleanDataFechas();
    this.fechas.push(item);
    this.fechasSubject.next(this.fechas);
  }

  cleanDataFechas(){
    this.fechasSubject = new BehaviorSubject([]);
  }

  getDatosReporteBolsasArte(Accion: string,sOP: string, fIni: string, fFin: string) {
    if (!_moment(fIni).isValid()) {
      fIni = '';
    } else {
      fIni = _moment(fIni.valueOf()).format('DD/MM/YYYY');
    }

    if (!_moment(fFin).isValid()) {
      fFin = '';
    } else {
      fFin = _moment(fFin.valueOf()).format('DD/MM/YYYY');
    }

    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_REPORTE_BOLSA_ARTES.php?Accion=${Accion}&Cod_OrdPro=${sOP}&fIni=${fIni}&fFin=${fFin}`);
  }
  
  getDatosReporteAlmacenArte(Accion: string,sOP: string, sColor: string) {
    return this.http.get(`${this.baseUrl}/bolsa-artes/app_CF_MAN_CF_REPORTE_ALMACEN_ARTES.php?Accion=${Accion}&Cod_OrdPro=${sOP}&Cod_Present=${sColor}`);
  }

  SM_Presentaciones_OrdPro(op: string){
    return this.http.get(`${this.baseUrl}/app_SM_Presentaciones_OrdPro.php?op=${op}`);
  }


}
