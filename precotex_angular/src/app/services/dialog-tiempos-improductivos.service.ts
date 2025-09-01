import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

interface maquinas {
  Codigo: string,
  Descripcion: string,
}

interface motivos {
  Codigo: string,
  Descripcion: string,
}

@Injectable({
  providedIn: 'root'
})
export class DialogTiemposImproductivosService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  mantenimientoConductorService(){
    return this.http.get(`${this.baseUrl}/app_Listar_Maquinas.php`);
  }

  cargarMaquinas(Cod_Area: string){
    return this.http.get(`${this.baseUrl}/app_Listar_Maquinas_V2.php?Cod_Area=${Cod_Area}`);
  }

  listadoMotivosTiemposImproductivos() {
    return this.http.get(`${this.baseUrl}/app_Listar_MotivosTiempoImproductivo.php`);
  }

  traerTejedor(dni: string) {
    return this.http.get(`${this.baseUrl}/app_muestra_nom_trabajador_nro_docide.php?Nro_DocIde=${dni}`);
  }

  ingresaTiempóimproductivo(sFec_Registro: string, cod_maquina: string, cod_motivo: string,finicio: string, hinicio: string, ffin: string,hfin: string, observacion: string, dni: string) {

    let sFec_Despacho="";
    let sFec_Inicio="";
    let sFec_Fin="";

    let dtinicio="";
    let dtfin="";

    if (!_moment(sFec_Registro).isValid()) { sFec_Despacho = '01/01/1900';  }
    sFec_Despacho = _moment(sFec_Registro.valueOf()).format('DD/MM/YYYY');

    if (!_moment(finicio).isValid()) { sFec_Inicio = '01/01/1900';  }
    sFec_Inicio = _moment(finicio.valueOf()).format('DD/MM/YYYY');
    dtinicio=sFec_Inicio + ' ' + hinicio;

    if (!_moment(ffin).isValid()) { sFec_Fin = '01/01/1900';  }
    sFec_Fin = _moment(ffin.valueOf()).format('DD/MM/YYYY');
    console.log(sFec_Fin);
    if(sFec_Fin=='Invalid date') {  dtfin='';  } else {
      dtfin=sFec_Fin + ' ' + hfin;
    }

    if(dtfin == 'Fecha inválida 00:00'){
      dtfin='01/01/9999' + ' ' + '00:00';
    }

    return this.http.get(`${this.baseUrl}/app_Mantenimiento_Tiempo_Improductivo.php?Accion=I
    &Fec_Registro=${sFec_Despacho}&Cod_Maquina=${cod_maquina}&Nro_DocIde=${dni}&Cod_Motivo=${cod_motivo}
    &Fec_Hora_Inicio=${dtinicio}&Fec_Hora_Fin=${dtfin}&Observacion=${observacion}&Cod_Usuario=${this.sCod_Usuario}&Fec_Crea=`);
  }

  modificaTiempóimproductivo(sFec_Registro: string, cod_maquina: string, cod_motivo: string,finicio: string, hinicio: string, ffin: string,hfin: string, observacion: string, Dni: string, FecCrea: string) {

    let sFec_Despacho="";
    let sFec_Inicio="";
    let sFec_Fin="";

    let dtinicio="";
    let dtfin="";

    /*if (!_moment(sFec_Registro).isValid()) { sFec_Despacho = '01/01/1900';  }
    sFec_Despacho = _moment(sFec_Registro.valueOf()).format('DD/MM/YYYY');

    if (!_moment(finicio).isValid()) { sFec_Inicio = '01/01/1900';  }
    sFec_Inicio = _moment(finicio.valueOf()).format('DD/MM/YYYY');
    dtinicio=sFec_Inicio + ' ' + hinicio;

    if (!_moment(ffin).isValid()) { sFec_Fin = '01/01/1900';  }
    sFec_Fin = _moment(ffin.valueOf()).format('DD/MM/YYYY');
    dtfin=sFec_Fin + ' ' + hfin;*/
    sFec_Despacho = sFec_Registro;
    dtinicio=finicio + ' ' + hinicio;
    dtfin=ffin + ' ' + hfin;

   //let FecCrea="";


    return this.http.get(`${this.baseUrl}/app_Mantenimiento_Tiempo_Improductivo.php?Accion=U&Fec_Registro=${sFec_Despacho}&Cod_Maquina=${cod_maquina}&Nro_DocIde=${Dni}&Cod_Motivo=${cod_motivo}&Fec_Hora_Inicio=${dtinicio}&Fec_Hora_Fin=${dtfin}&Observacion=${observacion}&Cod_Usuario=${this.sCod_Usuario}&Fec_Crea=${FecCrea}`);
  }




  eliminarTiempoimproductivo(sFec_Registro: string, cod_maquina: string, cod_motivo: string,finicio: string, ffin: string) {

    let sFec_Despacho="";
    let sFec_Inicio="";
    let sFec_Fin="";
    //let dtinicio="";
    //let dtfin="";

    //if (!_moment(sFec_Registro).isValid()) { sFec_Despacho = '01/01/1900';  }
    //sFec_Despacho = _moment(sFec_Registro.valueOf()).format('DD/MM/YYYY');

    if (!_moment(finicio).isValid()) { sFec_Inicio = '01/01/1900';  }
    sFec_Inicio = _moment(finicio.valueOf()).format('DD/MM/YYYY');
    //dtinicio=sFec_Inicio + ' ' + hinicio;

    if (!_moment(ffin).isValid()) { sFec_Fin = '01/01/1900';  }
    sFec_Fin = _moment(ffin.valueOf()).format('DD/MM/YYYY');
    //dtfin=sFec_Fin + ' ' + hfin;

    return this.http.get(`${this.baseUrl}/app_Mantenimiento_Tiempo_Improductivo.php?Accion=D&Fec_Registro=${sFec_Registro}&Cod_Maquina=${cod_maquina}&Nro_DocIde=&Cod_Motivo=${cod_motivo}&Fec_Hora_Inicio=${finicio}&Fec_Hora_Fin=${ffin}&Observacion=&Cod_Usuario=${this.sCod_Usuario}`);

  }


}
