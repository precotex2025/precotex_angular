import { Injectable } from '@angular/core';
import { GlobalVariable } from '../VarGlobals';
//import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _moment from 'moment';
import { Auditor } from '../models/Auditor';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Archivo } from "src/app/models/Archivo/Archivo";
import { HttpClient, HttpHeaders, HttpHandler } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LecturarollodespachoService {

  baseUrl = environment.cnServerTinto;
  
  baseUrlListaClienteDespacho = environment.cnServerTinto + "exportacion/Listar_Cliente?abr_cliente=";
  baseUrlListaPrePacking = environment.cnServerTinto + "exportacion/Listar_PrePackingList?cod_cliente=";
  baseUrlLecturaRollo = environment.cnServerTinto + "exportacion/Registro_PackingList?cod_prepackinglist=";
  baseUrlDetallePrePacking = environment.cnServerTinto + "exportacion/Listar_PrePackingListDet?opcion=";
  baseUrlRollosPendientes = environment.cnServerTinto + "exportacion/Listar_PrePackingListDetPartida?cod_cliente=";
  

  sCod_Usuario = GlobalVariable.vusu;

  httpOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };


  constructor(private http: HttpClient) {   }

    ShowListaClienteDespacho(Abr,Nombre){
      return this.http.get(this.baseUrlListaClienteDespacho+Abr  + "&Nom_Cliente=" + Nombre);
    } 

    ShowListaPrepacking(CodCliente){
      return this.http.get(this.baseUrlListaPrePacking+CodCliente);
    } 


    LecturaRolloDespacho(xPrePack : string , CodRollo: string){
      return this.http.get(this.baseUrlLecturaRollo+xPrePack+ "&id_rollokey=" + CodRollo);
    } 


    ShowDetallePartida(yyOpcion, yycod_cliente,yycod_prepackinglist,yycod_ordtra){
      return this.http.get(this.baseUrlDetallePrePacking+yyOpcion+"&Cod_Cliente="+yycod_cliente+"&cod_prepackinglist="+yycod_prepackinglist+ "&cod_ordtra="+yycod_ordtra);
    } 

    ShowPendientes(zzcod_cliente,zzcod_prepackinglist,zzcod_ordtra, zzcodigo_tela){
      return this.http.get(this.baseUrlRollosPendientes+zzcod_cliente+ "&cod_prepackinglist="+zzcod_prepackinglist+ "&cod_ordtra="+zzcod_ordtra+"&cod_tela="+zzcodigo_tela);
    } 


}
