import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';
import { SolicitudAguja } from '../models/Tejeduria/solicitudAguja';
import * as _moment from 'moment';
import { Tejedor } from '../models/Tejeduria/tejedor';
import { MaqTejeduria } from '../models/Tejeduria/maquinatejeduria';
import { Tipo_Aguja } from '../models/Tejeduria/tipoaguja';
import { environment } from 'src/environments/environment';
import { Tela } from '../models/tela';
import { produccion_rectilineo } from '../models/Tejeduria/produccionRectilineo';
import { Respuesta } from '../models/Respuesta';

@Injectable({
  providedIn: 'root'
})
export class TejeduriaService {
  
  urlSolicitudAgujas = environment.cnServerTinto + "tejeduria/tj_man_solicitud_agujas?opcion=";  
  urlTejedor = environment.cnServerTinto + "tejeduria/tj_muestra_Tejedor/?cod_trabajador=";
  urlMaqTejeduria = environment.cnServerTinto + "tejeduria/tj_muestra_MaqTejeduria/";
  urlTipoAguja = environment.cnServerTinto + "tejeduria/tj_muestra_TipoAguja/";
  urlTela = environment.cnServerTinto + "tejeduria/tj_muestra_tela/?cod_tela=";
  urlProdRectilineo= environment.cnServerTinto + "tejeduria/Tj_Muestra_Produccion_Rectilineo?fec_produccion_ini=";
  urlMantProdRectilineo= environment.cnServerTinto + "tejeduria/Tj_Mant_Produccion_Rectilineo?accion=";
  urlOtProdRectilineo= environment.cnServerTinto + "tejeduria/Tj_Muestra_Produccion_Rectilineo_Det?Cod_Ordtra=";
  
  sCod_Usuario = GlobalVariable.vusu;
  
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


  MuestraTejedor(Cod_Trabajador: string): Observable<Tejedor[]> {
    return this.http.get<Tejedor[]>(this.urlTejedor + Cod_Trabajador);
  }

  MuestraTela(Cod_Tela: string): Observable<Tela[]> {
    return this.http.get<Tela[]>(this.urlTela + Cod_Tela);
  }

  MuestraMaqTejeduria(): Observable<MaqTejeduria[]> {
    return this.http.get<MaqTejeduria[]>(this.urlMaqTejeduria);
  }

  MuestraTipoAguja(): Observable<Tipo_Aguja[]> {
    return this.http.get<Tipo_Aguja[]>(this.urlTipoAguja);
  }

  BuscarProduccion(Fec_Reg_Ini:string, Fec_Reg_Fin:string,Cod_Ordtra:string,Cod_Tela:string): Observable<produccion_rectilineo[]> {  
      
      if (!_moment(Fec_Reg_Ini).isValid()) {
        Fec_Reg_Ini = '01/01/1900';
      }
      if (!_moment(Fec_Reg_Fin).isValid()) {
        Fec_Reg_Fin = '01/01/1900';
      }
      Fec_Reg_Ini = _moment(Fec_Reg_Ini.valueOf()).format('DD/MM/YYYY');
      Fec_Reg_Fin = _moment(Fec_Reg_Fin.valueOf()).format('DD/MM/YYYY');                  

      return this.http.get<produccion_rectilineo[]>(this.urlProdRectilineo + Fec_Reg_Ini + "&fec_produccion_fin=" + Fec_Reg_Fin + "&ot=" + Cod_Ordtra + "&cod_tela=" + Cod_Tela + "&cod_usuario=" + this.sCod_Usuario);                  
  }

  MantProduccionRectilineo(accion: string, Cod_Ordtra: String, Num_Secuencia: string, Sec_Maquina: string, Und_Producido: string, Uni_Fallado: string, Tip_Trabajador: string, Cod_Trabajador: string, Id: string): Observable<any> {
    return this.http      
      .get<Respuesta>(this.urlMantProdRectilineo + accion +  "&cod_ordtra=" + Cod_Ordtra + "&num_secuencia=" + Num_Secuencia  + "&sec_maquina=" + Sec_Maquina+ "&und_producido=" + Und_Producido + "&und_fallado=" + Uni_Fallado + "&tip_trabajador=" + Tip_Trabajador + "&cod_trabajador=" + Cod_Trabajador + "&id=" + Id  + "&cod_usuario=" + this.sCod_Usuario )
      .pipe(catchError(this.errorHandler))
  }

  BuscarOT(Cod_Ordtra:string,Cod_Maquina:string): Observable<produccion_rectilineo[]> {  
          return this.http.get<produccion_rectilineo[]>(this.urlOtProdRectilineo + Cod_Ordtra + "&Cod_Maquina=" + Cod_Maquina + "&cod_usuario=" + this.sCod_Usuario);                  
}
 
  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.error);
  }

}
