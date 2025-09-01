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
export class SeguimientoToberaService {


  baseUrl = environment.cnServerTinto;
  //baseUrlLocal = GlobalVariable.baseUrlLocal;
  baseUrlLecturaTobera = environment.cnServerTinto + "seguimientotobera/showLectura/";
  baseUrlgrabarlecturaTobera = environment.cnServerTinto + "seguimientotobera/grabarlecturatobera/";
  //baseUrlgrabarlecturaToberaImagen = environment.cnServer + "seguimientotobera/GuardarImagen";
  baseUrlgrabarlecturaToberaImagen = environment.cnServerTinto + "seguimientotobera/CargarImagen/";
  baseUrlLecturaToberaDetalle = environment.cnServerTinto + "seguimientotobera/showLecturaDetalleImagen/";
  baseUrlShowParamReceta = environment.cnServerTinto + "procesos/MuestraParamReceta/";
  baseUrlSaveParamReceta = environment.cnServerTinto + "paramreceta/SaveParamReceta/";
  

  sCod_Usuario = GlobalVariable.vusu;

        httpOptions = {
          headers: {
            'Content-Type': 'application/json'
          }
        };



  constructor(private http: HttpClient) { }

  showLecturaTobera(Lectura, CodReceta, TipoPrueba){
    return this.http.get(`${this.baseUrlLecturaTobera+Lectura+"/0/1900-01-01/"+CodReceta+"/0/''/''/''/''/"+this.sCod_Usuario+"/"+TipoPrueba+"/''/''/"}`);
  } 

  showLecturaToberaDetalle(CodReceta){
    return this.http.get(`${this.baseUrlLecturaToberaDetalle+CodReceta}`);
  }


   showGrabarLecturaTobera(Lectura, IdSeg, CodReceta, Toberasel, Maquina, Partida, TipoPrueba, Autoriza, FlgReproceso, CodMotivoReproceso ): Observable<any>{
     return this.http.post(`${this.baseUrlgrabarlecturaTobera+Lectura+"/"+IdSeg+"/1900-01-01/"+CodReceta.replace(/\s+/g, " ").trim()+"/"+Toberasel+"/'-'/"+Partida+"/''/''/"+this.sCod_Usuario+"/"+TipoPrueba+"/"+Autoriza+"/"+FlgReproceso+"/"+CodMotivoReproceso}`, Observable);
   }


   showGrabarImagen(Imagen, CodReceta, Tipo){
   console.log(Imagen);
    return this.http.post(this.baseUrlgrabarlecturaToberaImagen+CodReceta.replace(/\s+/g, " ").trim()+"/"+Tipo,Imagen);
  }

  showParamReceta(Nro_Referencia){
    return this.http.get(`${this.baseUrlShowParamReceta+Nro_Referencia+"/"+this.sCod_Usuario}`);
  }

  saveParamReceta(Data){    
     return this.http.post(this.baseUrlSaveParamReceta+this.sCod_Usuario,Data);
   }
}
