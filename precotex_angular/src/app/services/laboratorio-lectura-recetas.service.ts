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
export class LaboratorioLecturaRecetasService {

  baseUrl = environment.cnServer;
  //baseUrlLocal = GlobalVariable.baseUrlLocal;
  baseUrlLecturaReceta = environment.cnServer + "laboratorio/showLecturaReceta/";
  baseUrlgrabarlecturareceta = environment.cnServer + "laboratorio/grabarlecturareceta/";
  

  sCod_Usuario = GlobalVariable.vusu;

        httpOptions = {
          headers: {
            'Content-Type': 'application/json'
          }
        };



  constructor( private http: HttpClient) { }


  showLecturaReceta(Lectura, Sticker){
    return this.http.get(`${this.baseUrlLecturaReceta+Lectura+"/''/''/''/''/''/''/''/1900-01-01/"+Sticker+"/"+this.sCod_Usuario}`);
  }


  showGrabarLecturaReceta(Lectura, Sticker): Observable<any>{
    return this.http.post(`${this.baseUrlgrabarlecturareceta+Lectura+"/''/''/''/''/''/''/''/1900-01-01/"+Sticker+"/"+this.sCod_Usuario}`, Observable);
  }

  



}
