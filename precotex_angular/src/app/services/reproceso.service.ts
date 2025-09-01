import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reproceso } from '../models/reproceso';



import { catchError } from 'rxjs/operators';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { MotivoReproceso } from '../models/motivosReproceso';
import { GlobalVariable } from '../VarGlobals';


@Injectable({
  providedIn: 'root'
})
export class ReprocesoService { 

  
  urlPartidasReproceso = GlobalVariable.wsHuachipa + "reprocesos/showReprocesos";
  urlGrabarReproceso = GlobalVariable.wsHuachipa + "reprocesos/ti_GrabarPartidasRollosReprocesos?observacion=";
  urlvisualrReproceso = GlobalVariable.wsHuachipa + "reprocesos/ti_GrabarPartidasRollosReprocesos?observacion=";
  urlMotivoReproceso = GlobalVariable.wsHuachipa + "reprocesos/motivosReprocesos";

  httpOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://192.168.3.143'
    }
  };

  //'Access-Control-Allow-Origin': 'http://192.168.1.31'
  constructor(private http: HttpClient) { }

  showPartidasReproceso(): Observable<Reproceso[]> {
    return this.http
      .get<Reproceso[]>(this.urlPartidasReproceso, this.httpOptions)
      .pipe(catchError(this.errorHandler))
  }

  guardarReproceso(lstReprocesos: Reproceso[], observa: string, motivo: string): Observable<any> {
    console.log("url grabar")
    console.log(this.urlGrabarReproceso + observa + "&motivo=" + motivo)
    return this.http.
      post<any>(this.urlGrabarReproceso + observa + "&motivo=" + motivo, lstReprocesos)
      .pipe(catchError(this.errorHandler))
  }

  motivosReprocesos(): Observable<MotivoReproceso[]> {
    return this.http.get<MotivoReproceso[]>(this.urlMotivoReproceso, this.httpOptions)
  }


  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.error)
  }


}


