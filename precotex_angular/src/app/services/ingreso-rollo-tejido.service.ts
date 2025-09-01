import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';

import * as _moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class IngresoRolloTejidoService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;
  baseUrlTeje  = GlobalVariable.baseUrlProcesoTenido;
  sCod_Usuario = GlobalVariable.vusu;

  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  ListarRolloTejidoService(sFec_Despacho: string, sOrden_Servicio: string) {

    if (!_moment(sFec_Despacho).isValid()) {
      sFec_Despacho = '01/01/1900';
    }

    sFec_Despacho = _moment(sFec_Despacho.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_listar_rollo_tejido.php?Fec_Despacho=${sFec_Despacho}&Orden_Servicio=${sOrden_Servicio}&Cod_Usuario=${this.sCod_Usuario}`);
  }

  ListarDetalleRolloTejidoService(sNum_Movstk: string) {

    return this.http.get(`${this.baseUrl}/app_listar_detalle_rollo_tejido.php?Num_Movstk=${sNum_Movstk}&Cod_Usuario=${this.sCod_Usuario}`);
  }



  GenerarMovimientoRolloTejidoService(sCod_Barras: string) {

    return this.http.get(`${this.baseUrl}/app_man_ingreso_rollo_tejido_genera_mov.php?Cod_Barras=${sCod_Barras}&Cod_Usuario=${this.sCod_Usuario}`);

  }

  LecturarBultoRolloTejidoService(sAccion: string, sCod_Almacen: string, sNum_Movstk: string, sCod_Barras: string) {

    return this.http.get(`${this.baseUrl}/app_man_ingreso_rollo_tejido_lectura.php?Accion=${sAccion}&Cod_Almacen=${sCod_Almacen}&Num_Movstk=${sNum_Movstk}&Cod_Barras=${sCod_Barras}&Cod_Usuario=${this.sCod_Usuario}`);

  }

 
  BuscarRolloCalificacion(sCod_Barras: string) {

    return this.http.get(`${this.baseUrl}/app_lectura_rollo_calificacion_web.php?Cod_Barras=${sCod_Barras}`);

  }

  
  showDefectos(opcion, defecto){
    return this.http.get(`${this.baseUrl}/app_listar_defectos_calidad_web.php?Opcion=${opcion}&Defecto=${defecto}`);

  }


  showAuditor(Cod_Auditor, Nom_Auditor, FLat_Inspecion: string){
    //return this.http.get(`${this.baseUrlAuditor+this.sCod_Usuario+"/''/"+ FLat_Inspecion}`);
    return this.http.get(`${this.baseUrl}/app_listar_auditor_web.php?&FLat_Inspecion=${FLat_Inspecion}`);
    
  }

 
  showRestric(){
    //return this.http.get(`${this.baseUrlRestriccion}`);
    return this.http.get(`${this.baseUrl}/app_listar_restriccion_web.php`);
  }

  showDetalleDefectos(Ot, PrefijoMAquina, CodigoRollo){
    return this.http.get(`${this.baseUrl}/app_listar_detalle_defectos_rollo_tejeduria.php?Cod_Ordtra=${Ot}&Prefijo_maquina=${PrefijoMAquina}&Codigo_Rollo=${CodigoRollo}`);
  }



      GuardarDefecto(data: any) {
       return this.http.post(`${this.baseUrl}/app_man_registro_defecto_calidad_web.php`, data);
       }


      eliminarDefecto(data: any){
      return this.http.post(`${this.baseUrl}/app_man_registro_defecto_calidad_eliminar_web.php`, data);
      }
      

        GuardarCalidad(data: any) {
        return this.http.post(`${this.baseUrl}/app_man_registro_calidad_web.php`, data);
        }


        CrearParticion(data: any) {
        return this.http.post(`${this.baseUrl}/app_man_particion_rollo_web.php`, data);
        }


        showDetalleRolloParticionado(Ot, PrefijoMAquina, CodigoRollo){
          return this.http.get(`${this.baseUrl}/app_muestra_rollos_particion_web.php?Cod_Ordtra=${Ot}&Prefijo_Maquina=${PrefijoMAquina}&Codigo_Rollo=${CodigoRollo}`);
        }
      
    

        showListaStatusOt(Fec_Inicio, Fec_Final, Ot, Inspector){
          return this.http.get(`${this.baseUrl}/app_muestra_lista_status_ot.php?xFecIni=${Fec_Inicio}&xFecFinal=${Fec_Final}&xOt=${Ot}&xInspect=${Inspector}`);
        }

            

        ShowDetalleOt(Cod_Ordtra){
          return this.http.get(`${this.baseUrl}/app_muestra_lista_status_ot.php?Cod_Ordtra=${Cod_Ordtra}`);
        }

        
        MostrarDetalleOt(Cod_Ordtra: string, Num_Secuencia: string) {
          return this.http.get(`${this.baseUrl}/app_tj_muestra_datos_ot_para_arranque.php?Cod_Ordtra=${Cod_Ordtra}&Num_Secuencia=${Num_Secuencia}`);                                             
        }

        
        ShowDetalleDefectos(Cod_Ordtra){
          return this.http.get(`${this.baseUrl}/app_muestra_detalle_defectos_por_ot.php?Cod_Ordtra=${Cod_Ordtra}`);
        }


        insertarColaImpresionAuditoria(Cod_Ordtra: string, Num_Secuencia) {
          return this.http.get(`${this.baseUrl}/app_insertar_cola_auditoria_tela.php?Cod_Ordtra=${Cod_Ordtra}&Num_Secuencia=${Num_Secuencia}&Cod_Usuario=${this.sCod_Usuario}`);
        }

        /*MOSTRAR LISTA MAQUINA REVISADORA*/
        getListaMaquinaRevisadora(){
            const headers = this.Header;
            return this.http.get(this.baseUrlTeje + 'TxTelaEstructuraTejido/getListaMaquinaRevisadora', { headers });
        }  

}