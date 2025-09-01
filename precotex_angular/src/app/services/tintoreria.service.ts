import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';
import { SolicitudAguja } from '../models/Tejeduria/solicitudAguja';
import * as _moment from 'moment';
import { environment } from 'src/environments/environment';
import { Gama } from '../models/Tintoreria/Gama';
import { TipAncho } from '../models/Tintoreria/TipAncho';
import { Capacidades } from '../models/Tintoreria/Capacidades';
import { FamArticulo } from '../models/Tintoreria/FamArticulo';
import { Cliente } from '../models/Cliente';
import { ProgramaEmpastado } from '../models/Estampado/ProgramaEmpastado';
//pch 21/01/25
import { TipMotivoReproceso } from '../models/Tintoreria/TipMotivoReproceso';

@Injectable({
  providedIn: 'root'
})
export class TintoreriaService {
  
  urlSolicitudAgujas = environment.cnServerTinto + "tejeduria/tj_man_solicitud_agujas?opcion=";    
  urlCapacidades = environment.cnServerTinto + "tintoreria/ti_mant_capacidades?opcion=";
  urlGama = environment.cnServerTinto + "tintoreria/ti_muestra_gama/";
  urlTipAncho = environment.cnServerTinto + "tintoreria/ti_muestra_tipancho/";
  urlFamArticulo = environment.cnServerTinto + "tintoreria/ti_muestra_famarticulo?opcion=";
  urlCliente= environment.cnServerTinto + "tintoreria/ti_muestra_cliente?opcion=";

  urlProgramaEmpastado = environment.cnServerTinto + "estampadodigital/est_ConsultaProgramaEmpastado?opcion=";
  
  sCod_Usuario = GlobalVariable.vusu;

  //pch 21/01/25
  urlTipMotivoReproceso = environment.cnServerTinto + "tintoreria/ti_muestra_TipMotivoReproceso/";  
  
  httpOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  constructor(private http: HttpClient) { }

  MantConsultaAguja(Opcion: string, Num_Registro:string, Cod_Maquina_Tejeduria: string,Cod_Ordtra:string, Tip_Trabajador:string, Cod_Trabajador:string, Cod_Tipo_Aguja:string
                , T1:string, T2:string, T3:string,T4:string, Tp1:string, Tp2:string,Cntd:string,Fec_Reg_Ini:string, Fec_Reg_Fin:string): Observable<SolicitudAguja[]> {  
                  
                  if (!_moment(Fec_Reg_Ini).isValid()) {
                    Fec_Reg_Ini = '01/01/1900';
                  }
                  if (!_moment(Fec_Reg_Fin).isValid()) {
                    Fec_Reg_Fin = '01/01/1900';
                  }
                  Fec_Reg_Ini = _moment(Fec_Reg_Ini.valueOf()).format('DD/MM/YYYY');
                  Fec_Reg_Fin = _moment(Fec_Reg_Fin.valueOf()).format('DD/MM/YYYY');                  

    return this.http.get<SolicitudAguja[]>(this.urlSolicitudAgujas + Opcion + "&Num_Registro=" + Num_Registro + "&Cod_Maquina_Tejeduria=" + Cod_Maquina_Tejeduria + "&Cod_Ordtra=" + Cod_Ordtra + "&Tip_Trabajador=" + Tip_Trabajador + "&Cod_Trabajador=" + Cod_Trabajador
    + "&Cod_Tipo_Aguja=" + Cod_Tipo_Aguja + "&T1=" + T1 + "&T2=" + T2 + "&T3=" + T3 + "&T4=" + T4 + "&Tp1=" + Tp1 + "&Tp2=" + Tp2 + "&Cntd=" + Cntd + "&cod_usuario=" + this.sCod_Usuario + "&fecregini=" + Fec_Reg_Ini + "&fecregfin=" + Fec_Reg_Fin);                      
  }

  MantCapacidades(Opcion: string, Cod_Familia:string, Cod_Cliente: string,Tip_Ancho:string, Cod_Gama:string, Eco_Master:string, IMaster:string
    , TRD:string, ATYC:string, MS:string, Obs_Eco_Master:string,Obs_IMaster:string, Obs_TRD:string, Obs_ATYC:string, Obs_MS:string, Fec_Reg_Ini:string,Fec_Reg_Fin:string): Observable<Capacidades[]> {  
      
      if (!_moment(Fec_Reg_Ini).isValid()) {
        Fec_Reg_Ini = '01/01/1900';
      }
      if (!_moment(Fec_Reg_Fin).isValid()) {
        Fec_Reg_Fin = '01/01/1900'; 
      }
      Fec_Reg_Ini = _moment(Fec_Reg_Ini.valueOf()).format('DD/MM/YYYY');
      Fec_Reg_Fin = _moment(Fec_Reg_Fin.valueOf()).format('DD/MM/YYYY');
      

  return this.http.get<Capacidades[]>(this.urlCapacidades + Opcion + "&Cod_Familia=" + Cod_Familia + "&Cod_Cliente=" + Cod_Cliente + "&Tip_Ancho=" + Tip_Ancho + "&Cod_Gama=" + Cod_Gama + "&Eco_Master=" + Eco_Master
  + "&IMaster=" + IMaster + "&TRD=" + TRD + "&ATYC=" + ATYC + "&MS=" + MS + "&Obs_Eco_Master=" + Obs_Eco_Master + "&Obs_IMaster=" + Obs_IMaster + "&Obs_TRD=" + Obs_TRD + "&Obs_ATYC=" + Obs_ATYC + "&Obs_Ms=" + Obs_MS + "&fec_reg_ini=" + Fec_Reg_Ini + "&fec_reg_fin=" + Fec_Reg_Fin + "&cod_usuario=" + this.sCod_Usuario);
  }
 
  MuestraGama(): Observable<Gama[]> {
    return this.http.get<Gama[]>(this.urlGama);
  }

  MuestraTipAncho(): Observable<TipAncho[]> {
    return this.http.get<TipAncho[]>(this.urlTipAncho);
  }

  MuestraFamArticulo(Opcion:string): Observable<FamArticulo[]> {
    return this.http.get<FamArticulo[]>(this.urlFamArticulo + Opcion);
  }

  MuestraCliente(Opcion:string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.urlCliente + Opcion);
  }

  //pch 21/01/25
  MuestraTipMotivoReproceso(): Observable<TipMotivoReproceso[]> {
    return this.http.get<TipMotivoReproceso[]>(this.urlTipMotivoReproceso);
  }  

//   ConsultaProgramaEmpastado(Opcion: string, Tipo:string, Cod_Ordtra: string,Num_Secuencia:string, Id_Programa:string, Obs:string): Observable<ProgramaEmpastado[]> {  
      
//     // if (!_moment(Fec_Reg_Ini).isValid()) {
//     //   Fec_Reg_Ini = '01/01/1900';
//     // }
//     // if (!_moment(Fec_Reg_Fin).isValid()) {
//     //   Fec_Reg_Fin = '01/01/1900'; 
//     // }
//     // Fec_Reg_Ini = _moment(Fec_Reg_Ini.valueOf()).format('DD/MM/YYYY');
//     // Fec_Reg_Fin = _moment(Fec_Reg_Fin.valueOf()).format('DD/MM/YYYY');
    

// return this.http.get<ProgramaEmpastado[]>(this.urlProgramaEmpastado + Opcion + "&Tipo=" + Tipo + "&Cod_Ordtra=" + Cod_Ordtra + "&Num_Secuencia=" + Num_Secuencia + "&Id_Programa=" + Id_Programa + "&Obs=" + Obs + "&cod_usuario=" + this.sCod_Usuario);
// }
 
  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.error);
  }

}
