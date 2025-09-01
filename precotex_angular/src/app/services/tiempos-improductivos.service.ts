import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';

import * as _moment from 'moment';

interface maquinas {
  Codigo: string,
  Descripcion: string,
}

@Injectable({
  providedIn: 'root'
})
export class TiemposImproductivosService {
  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;

  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }


  






  mantenimientoConductorService(){
    return this.http.get(`${this.baseUrl}/app_Listar_Maquinas.php`);
  }

  eliminarTiempoimproductivo(sFec_Registro: string, cod_maquina: string, cod_motivo: string,finicio: string, ffin: string, Dni: String, Fec_Creacion: string) {

    let sFec_Despacho="";
    let sFec_Inicio="";
    let sFec_Fin="";
    //let dtinicio="";
    //let dtfin="";

    if (!_moment(sFec_Registro).isValid()) { sFec_Despacho = '01/01/1900';  }
    sFec_Despacho = _moment(sFec_Registro.valueOf()).format('DD/MM/YYYY');

    if (!_moment(finicio).isValid()) { sFec_Inicio = '01/01/1900';  }
    sFec_Inicio = _moment(finicio.valueOf()).format('DD/MM/YYYY');
    //dtinicio=sFec_Inicio + ' ' + hinicio;

    if (!_moment(ffin).isValid()) { sFec_Fin = '01/01/1900';  }
    sFec_Fin = _moment(ffin.valueOf()).format('DD/MM/YYYY');
    //dtfin=sFec_Fin + ' ' + hfin;

    return this.http.get(`${this.baseUrl}/app_Mantenimiento_Tiempo_Improductivo.php?Accion=D&Fec_Registro=${sFec_Registro}&Cod_Maquina=${cod_maquina}&Nro_DocIde=${Dni}&Cod_Motivo=${cod_motivo}&Fec_Hora_Inicio=${finicio}&Fec_Hora_Fin=${ffin}&Observacion=&Cod_Usuario=${this.sCod_Usuario}&Fec_Crea=${Fec_Creacion}`);

  }


  ListarDespachoService(sFec_Despacho1: string, sFec_Despacho2: string, CodMaquina: string) {

    return this.http.get(`${this.baseUrl}/app_Mantenimiento_Tiempo_Improductivo.php?Accion=V&Fec_Registro=${sFec_Despacho1}&Cod_Maquina=${CodMaquina}&Nro_DocIde=&Cod_Motivo=&Fec_Hora_Inicio=&Fec_Hora_Fin=&Observacion=&Cod_Usuario=${this.sCod_Usuario}&Fec_Crea=&Fec_Registro2=${sFec_Despacho2}`);
  }


  ExportarExcel(sFec_Despacho1: string, sFec_Despacho2: string, CodMaquina: string) {

    return this.http.get(`${this.baseUrl}/app_Mantenimiento_Tiempo_Improductivo.php?Accion=V&Fec_Registro=${sFec_Despacho1}&Cod_Maquina=${CodMaquina}&Nro_DocIde=&Cod_Motivo=&Fec_Hora_Inicio=&Fec_Hora_Fin=&Observacion=&Cod_Usuario=${this.sCod_Usuario}&Fec_Crea=&Fec_Registro2=${sFec_Despacho2}`);
  }


}
