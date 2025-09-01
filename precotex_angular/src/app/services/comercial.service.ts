import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ComercialService {
  
  
  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;
  // _url: string ="/ws_android/muestra_auditoria_en_linea_cab.php";
  // //_url: string ="https://gestion.precotex.com/ws_android/muestra_auditoria_en_linea_cab.php";

  constructor(private http: HttpClient) { }

  CargarEstilosAte(OP, Estilo_Propio, Estilo_Cliente, Cod_Cliente, Cod_TemCli) { 

    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_ESTILOS_PROPIOS_IMAGEN_WEB_ATE.php?OP=${OP}&Estilo_Propio=${Estilo_Propio}&Estilo_Cliente=${Estilo_Cliente}&Cod_Cliente=${Cod_Cliente}&Cod_TemCli=${Cod_TemCli}`);

  }

  mantenimientoDerivadosService(sAbr: string, sCod:string,sCliente:string, sCod_Accion:string) {
    return this.http.get(`${this.baseUrl}/app_listar_cliente_abr_derivados.php?Abr=${sAbr}&Abr_Motivo=${sCod}&Nom_Cliente=${sCliente}&Cod_Accion=${sCod_Accion}`);
  }

  buscarTempCliente(Cod_Cliente: string) {
    return this.http.get(`${this.baseUrl}/app_buscaTempCli.php?Cod_Cliente=${Cod_Cliente}`);
  }

  CC_BUSCAR_ESTILOCLIENTE(Cod_EstCli: string) {
    return this.http.get(`${this.baseUrl}/app_CC_BUSCAR_ESTILOCLIENTE.php?Cod_EstCli=${Cod_EstCli}`);
  }

  

  CargarEstilosHuachipa(OP, Grupo_Textil, OT, Partida) { 

    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_ESTILOS_PROPIOS_IMAGEN_WEB_HUACHIPA.php?OP=${OP}&Grupo_Textil=${Grupo_Textil}&OT=${OT}&Partida=${Partida}`);

  }

  cargarImagenes(data) { 
    return this.http.post(`${this.baseUrl}/app_CF_MUESTRA_ESTILOS_PROPIOS_IMAGEN_WEB_DETALLE_ATE.php`, data);
  }

  cargarImagenes2(data) { 
    return this.http.post(`${this.baseUrl}/app_CF_MUESTRA_ESTILOS_PROPIOS_IMAGEN_WEB_DETALLE_ATE2.php`, data);
  }

  copiarImagenes(Cod_Est_O, Cod_Est_D) { 
    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_ESTILOS_PROPIOS_IMAGEN_WEB_COPIA.php?Cod_EstPro_O=${Cod_Est_O}&Cod_EstPro_D=${Cod_Est_D}&Cod_Usuario=${this.sCod_Usuario}` );
  }

  CargarEstilosDigitalizacion(OP, Estilo_Propio, Estilo_Cliente, Cod_Cliente, Cod_TemCli) { 

    return this.http.get(`${this.baseUrl}/app_CF_MUESTRA_ESTILOS_PROPIOS_DIGITALIZACION.php?OP=${OP}&Estilo_Propio=${Estilo_Propio}&Estilo_Cliente=${Estilo_Cliente}&Cod_Cliente=${Cod_Cliente}&Cod_TemCli=${Cod_TemCli}`);

  }

  CargarEstilosVersion(data) { 
    return this.http.post(`${this.baseUrl}/app_CF_MUESTRA_ESTILOS_PROPIOS_VERSION.php`,data);

  }

  CargarEstilosArchivos(data) { 
    return this.http.post(`${this.baseUrl}/app_CF_MUESTRA_ESTILOS_PROPIOS_ARCHIVOS.php`,data);

  }
  
}
