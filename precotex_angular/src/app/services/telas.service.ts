import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tela } from '../models/tela';
import { Maquina } from '../models/maquina';
import { TelaFicha } from '../models/telaficha';
import { MaquinaProcesos } from '../models/maquinaProcesos';
import { Telapartidas } from '../models/telaPartidas';
import { Respuesta } from '../models/Respuesta';

import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError } from 'rxjs';
import { Proceso } from '../models/proceso';
import { Reproceso } from '../models/reproceso';
import { GlobalVariable } from '../VarGlobals';

@Injectable({
  providedIn: 'root'
})
export class TelasService {

  urlTelas = GlobalVariable.wsHuachipa + "telas/showTela/";
  urlMaquina = GlobalVariable.wsHuachipa + "maquina/showMaquina/";

  urlTelaficha = GlobalVariable.wsHuachipa + "procesos/ti_sm_muestra_telas_partida_resumen/";
  urlMaquinaProceso = GlobalVariable.wsHuachipa + "procesos/ac_Maquina_Proceso/";
  urlRolloPartida = GlobalVariable.wsHuachipa + "procesos/ti_sm_muestra_telas_partida_proceso_SECUENCIA/";
  urlTelaPrincipal = GlobalVariable.wsHuachipa + "telas/showTelaPrincipal/";
  urlPartidas = GlobalVariable.wsHuachipa + "ficha/traerPartidas/";

  urlPartidaRollos = GlobalVariable.wsHuachipa + "procesos/ti_GrabarPartidasRollos?proceso=";
  urlProcesoIdGrupo = GlobalVariable.wsHuachipa + "procesos/TI_MUESTRA_TI_ORDTRA_TINTORERIA_PROCESOS/";

urlvisualizarprocesos=  GlobalVariable.wsHuachipa + "reprocesos/showReprocesosObserva";
urlValidarReproceso = GlobalVariable.wsHuachipa+"reprocesos/validaReprocesos?IdGrupo="; //50071&Cod_Tela=se008149&Cod_Ordtra=G4873&Cod_Proceso_Tinto=10";
  //urlTelas = 'https://localhost:44373/telas/showTela/RE002064';
  httpOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };


  constructor(private http: HttpClient) { }

  showTelas(tela: Tela): Observable<Tela> {
    return this.http.get<Tela>(this.urlTelas + tela.Cod_Tela);
  }


  showMaquina(Cod_Usuario: string): Observable<Maquina[]> {
    console.log(" url maquina ");
    console.log( this.urlMaquina + Cod_Usuario);
    return this.http.get<Maquina[]>(this.urlMaquina + Cod_Usuario);
  }

  showTelaFichas(idGrupo: number, codTela: string): Observable<TelaFicha[]> {
    console.log("urlTelaficha" + this.urlTelaficha + idGrupo + "/" + codTela);
    return this.http.get<TelaFicha[]>(this.urlTelaficha + idGrupo + "/" + codTela);

  }

  showMaquinaProcesos(codMaquina: string): Observable<MaquinaProcesos[]> {
    return this.http.get<MaquinaProcesos[]>(this.urlMaquinaProceso + codMaquina);

  }

  showRollosPartidas(idGrupo: number, cod_tela: string, cod_prod: string, secuencia: number): Observable<Telapartidas[]> {
    console.log("url rollos a traer " + this.urlRolloPartida +  idGrupo + "/" + cod_tela + "/" + cod_prod + "/" + secuencia);
    return this.http.get<Telapartidas[]>(this.urlRolloPartida + idGrupo + "/" + cod_tela + "/" + cod_prod + "/" + secuencia);

  }


  showTelaPrincipal(idGrupo: number): Observable<Tela> {
    console.log(this.urlTelaPrincipal + idGrupo);
    return this.http.get<Tela>(this.urlTelaPrincipal + idGrupo);
  }

  showRutas(metodo: string, urlRuta: string) {
    console.log(metodo);
    console.log(urlRuta);
  }

  showPartidas(idGrupo: number): Observable<Respuesta> {
    console.log("urlpartidas " + this.urlPartidas + idGrupo);
    return this.http.get<Respuesta>(this.urlPartidas + idGrupo);
  }

  savePartidaRollos(lsttelapartida: Telapartidas[], proceso: string, maquina: String, secuencia: number, accion:string, fechafinal: string, IdGrupo: number, fechainicial:string, usuario:string): Observable<any> {
    console.log("para grabar los rollos")  
    console.log(this.urlPartidaRollos + proceso + "&maquina=" + maquina+"&secuencia="+secuencia+"&accion="+accion+"&fechaFinal="+fechafinal+"&IdGrupo="+IdGrupo+"&fechainicial="+fechainicial+"&usuario="+usuario)

    return this.http
    .post<any>(this.urlPartidaRollos + proceso + "&maquina=" + maquina+"&secuencia="+secuencia+"&accion="+accion+"&fechaFinal="+fechafinal+"&IdGrupo="+IdGrupo+"&fechainicial="+fechainicial+"&usuario="+usuario, lsttelapartida)
      .pipe(catchError(this.errorHandler))

  }

  showProcesoIdGrupo(idGrupo: number): Observable<Proceso[]> {
    console.log("endpint ");
    console.log(this.urlProcesoIdGrupo + idGrupo);

    return this.http
    .get<Proceso[]>(this.urlProcesoIdGrupo + idGrupo)
    .pipe(catchError(this.errorHandler))
  }


visualizarComentario(): Observable<Reproceso[]>{
  return this.http.get<Reproceso[]>(this.urlvisualizarprocesos)
}

//IdGrupo=50071&Cod_Tela=se008149&Cod_Ordtra=G4873&Cod_Proceso_Tinto
///reprocesos/validaReprocesos?IdGrupo=50071&Cod_Tela=se008149&Cod_Ordtra=G4873&Cod_Proceso_Tinto=10
validarReproceso(IdGrupo:number, cod_tela:string, Cod_Ordtra:string, Cod_Proceso_Tinto:string, Secuencia:number ): Observable<any>{
  return this.http.get<any>(this.urlValidarReproceso+IdGrupo+"&Cod_Tela="+cod_tela+"&Cod_Ordtra="+Cod_Ordtra+"&Cod_Proceso_Tinto="+Cod_Proceso_Tinto+"&Secuencia="+Secuencia)
}

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.error);
  }



}
