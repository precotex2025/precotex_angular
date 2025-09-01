import { Injectable } from '@angular/core';
import { GlobalVariable } from '../VarGlobals';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _moment from 'moment';
import { Auditor } from '../models/Auditor';

import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError } from 'rxjs';
import { environment } from 'src/environments/environment';





@Injectable({
  providedIn: 'root'
})
export class RegistroCalidadTejeduriaService {

  // baseUrl = GlobalVariable.baseUrl;
  // baseUrlLocal = GlobalVariable.baseUrlLocal;
  // baseUrlAuditor = GlobalVariable.baseUrlVb + "calidadtj/showAuditor/";
  // baseUrlRestriccion = GlobalVariable.baseUrlVb + "calidadtj/showrestric/";
  // baseUrlBuscaOt = GlobalVariable.baseUrlVb + "calidadtj/showOt/";
  // sCod_Usuario = GlobalVariable.vusu;


  baseUrl = environment.cnServerTinto;
  baseUrl2 = GlobalVariable.baseUrl;
  //baseUrlLocal = GlobalVariable.baseUrlLocal;
  baseUrlAuditor = environment.cnServerTinto + "calidadtj/showAuditor/";
  baseUrlRestriccion =environment.cnServerTinto + "calidadtj/showrestric/";
  baseUrlBuscaOt = environment.cnServerTinto + "calidadtj/showOt/";
  baseUrlBuscaDefecto = environment.cnServerTinto + "calidadtj/showDefectos/";
  baseUrlDetalleDefecto = environment.cnServer + "calidadtj/showDetalleDefectos/";

  baseUrlGuardarDefecto = environment.cnServerTinto + "calidadtj/tj_GrabarDetalleDefecto/";
  baseUrlEliminarDefecto = environment.cnServerTinto + "calidadtj/tj_EliminarDetalleDefecto/";
  baseUrlSumaPtos = environment.cnServerTinto + "calidadtj/showSumaPtos/";

  sCod_Usuario = GlobalVariable.vusu;

        httpOptions = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

  constructor( private http: HttpClient) {}


   showAuditor(Cod_Auditor, Nom_Auditor, FLat_Inspecion: string){
    return this.http.get(`${this.baseUrlAuditor+this.sCod_Usuario+"/''/"+ FLat_Inspecion}`);
  }

  showDigitador(Cod_Digitador, Nom_Digitador, FLat_Inspecion: string){
    return this.http.get(`${this.baseUrlAuditor+"''/''/"+ FLat_Inspecion}`);
  }


  showRestric(){
    return this.http.get(`${this.baseUrlRestriccion}`);
  }

  showOtRollos(Opcion, COD_ORDTRA, RolloTeje, RolloTeje1, RolloTeje2, SER_ORDCOMP, COD_ORDCOMP, FlagReporte, Estado){
    return this.http.get(`${this.baseUrlBuscaOt+Opcion+"/"+COD_ORDTRA+"/''/''/''/''/''/"+FlagReporte+"/"+Estado}`);
  }


  showDefectos(opcion, defecto){
    return this.http.get(`${this.baseUrlBuscaDefecto+opcion+"/"+defecto}`);
  }

  showDetalleDefectos(ot, CodigoRollo){
    return this.http.get(`${this.baseUrlDetalleDefecto+ot+"/"+CodigoRollo}`);
  }


  GuardarDefectos(Accion: string,  Ot: string, CodRollo: string, DpMaquina:string, Inspector, Digitador, Restriccion, Turno, 
    Mts:string, CodDefecto: string,  Ptos: string, Usuario: string,
     Ancho: string, Calidad: number, Tip_Trabajador: string, Cod_Trabajador: string, Observacion: string, MetrosCuad:number) : Observable<any> {

      return this.http.post<any>(`${this.baseUrlGuardarDefecto+Accion+"/"+Ot+"/"+CodRollo+"/"+DpMaquina+"/"+Inspector+"/"+Digitador
      +"/"+Restriccion+"/"+Turno+"/"+CodDefecto+"/"+Mts+"/"+Ptos+"/"+this.sCod_Usuario+"/"+Ancho+"/"+Calidad+"/"+Tip_Trabajador+"/"+Cod_Trabajador+"/"+Observacion+"/"+MetrosCuad+"/''"}`,Observable).pipe(catchError(this.errorHandler));
          
}


eliminarDefecto(Accion: string,  Ot: string, Rollo: string,  DpMaquina:string, Inspector, Digitador, Restriccion, Turno,
  Mts:string, CodDefecto: string,  Ptos: string, Usuario: string, Size: string,  
  Calidad: number, Tip_Trabajador: string, Cod_Trabajador: string, Observacion: string, Secuencia_n:number) : Observable<any> {
  return this.http.post<any>(`${this.baseUrlGuardarDefecto+Accion+"/"+Ot+"/"+Rollo+"/"+DpMaquina
  +"/''/''/''/''/"+CodDefecto+"/0/0/"+this.sCod_Usuario+"/0/"+Calidad+"/"+Tip_Trabajador+"/"+Cod_Trabajador+"/''/0/"+Secuencia_n}`, Observable).pipe(catchError(this.errorHandler));
  }


  /*ESTA FUNCION SE ACTUALIZA LA CALIDAD DEL ROLLO */
  showSumaPtos(Ot, Rollo, Prefijo_Maquina,MetrosCuad ){
    return this.http.get(`${this.baseUrlSumaPtos+Ot+"/"+Rollo+"/"+Prefijo_Maquina+"/"+MetrosCuad}`);
  }





errorHandler(error: HttpErrorResponse) {
  return observableThrowError(error.error);
}


traerDatosInspector(Cod_Trabajador: string, Tip_Trabajador: string ) {
  return this.http.get(`${this.baseUrl2}/app_muestra_nom_trabajador_4_puntos.php?Cod_Trabajador=${Cod_Trabajador}&Tip_Trabajador=${Tip_Trabajador}`);
}



  


}
