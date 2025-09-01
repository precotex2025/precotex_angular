import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';

import * as _moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class SeguridadControlJabaService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;

  sCod_Usuario = GlobalVariable.vusu; 
 
  constructor(private http: HttpClient) { }

  HabilitarNum_Planta(nNum_Planta: number) {
    return this.http.get(`https://192.168.1.31:9443/ws_android/app_habilitar_num_planta.php?Num_Planta=${nNum_Planta}`);
  }

  
  ListarHistoritalService(nNum_Planta:number,sCod_Barras: string, sFec_Registro: string) {

    if (!_moment(sFec_Registro).isValid()) {
      sFec_Registro = '01/01/1900';
    }

    sFec_Registro = _moment(sFec_Registro.valueOf()).format('DD/MM/YYYY');

    return this.http.get(`${this.baseUrl}/app_listar_historial_control_jabas.php?Num_Planta=${nNum_Planta}&Cod_Barras=${sCod_Barras}&Fec_Registro=${sFec_Registro}`);
  }

  ListarHistoritalExcelService(){
    return this.http.get(`${this.baseUrl}/app_listar_historial_excel_control_jabas.php`);
  }


  ListarGuiaSalidaService(
    sNum_Planta: number) {
    return this.http.get(`${this.baseUrl}/app_listar_guia_salida_jabas.php?Num_Planta=${sNum_Planta}`);
  }




  ListarGuiaInternoService(
    sNum_Planta: number) {

    return this.http.get(`${this.baseUrl}/app_listar_guia_interno_jabas.php?Num_Planta=${sNum_Planta}`);
  }

  traerInfoJabaService(
    sNum_Planta: number, sCod_barras: string, sNum_Guia: string, sCod_Accion: string) {
      return this.http.get(`${this.baseUrl}/app_buscar_jaba.php?Cod_Barras=${sCod_barras}&Num_Planta=${sNum_Planta}&Num_Guia=${sNum_Guia}&Cod_Accion=${sCod_Accion}`)
    }

    

     /*GuardarService(nNum_Planta: number,sCod_Accion: string,  sNum_Guia: string, nDestino: number, nOrigen:number,nCantidad: number, sGlosa: string) {
    
    
        sGlosa = sGlosa.replace(/\s+/g, " ").trim();
        sGlosa = sGlosa.replace("ñ", "n").trim();
    
        return this.http.get(`${this.baseUrl}/app_man_registro_control_jaba.php?Accion=${'I'}&Num_Planta=${nNum_Planta}&Cod_Accion=${sCod_Accion}&Num_Guia=${sNum_Guia}&Num_Planta_Destino=${nDestino}&Num_Planta_Origen=${nOrigen}&Num_Cantidad=${nCantidad}&Glosa=${sGlosa}&Cod_Usuario=${this.sCod_Usuario}`);
          

      }*/
    
 /*@Accion					AS CHAR(1),
    @Cod_Registro			AS INT,
    @Num_Planta				AS INT,
    @Cod_Accion				AS CHAR(1),
    @Num_Guia				AS VARCHAR(15),
    @Num_Planta_Destino		AS INT,
    @Num_Planta_Origen		AS INT,
    @Cod_Barras				AS CHAR(9),
    @Glosa					AS VARCHAR(50),
    @Cod_Usuario			AS COD_USUARIO*/
      GuardarService(sAccion:string,nCod_reg: number, nNum_P: number, sCod_Acc: string, nNum_Gui: string, nNum_Planta_Destino: number, nNum_po: number, sBarras: string, sGlosa: string, sCod_Proveedor:string) {
    
     
        sGlosa = sGlosa.replace(/\s+/g, " ").trim();
        sGlosa = sGlosa.replace("ñ", "n").trim();
    
        return this.http.get(`${this.baseUrl}/app_man_registro_control_jaba.php?Accion=${sAccion}&Cod_Registro=${nCod_reg}&Num_Planta=${nNum_P}&Cod_Accion=${sCod_Acc}&Num_Guia=${nNum_Gui}&Num_Planta_Destino=${nNum_Planta_Destino}&Num_Planta_Origen=${nNum_po}&Cod_Barras=${sBarras}&Glosa=${sGlosa}&Cod_Usuario=${this.sCod_Usuario}&Cod_Proveedor=${sCod_Proveedor}`);
          

      }

      InsertarJabasDetalleService(nCod_Registro: number, sCod_Barras: string){
  
        return this.http.get(`${this.baseUrl}/app_man_insertar_detalle_control_jaba.php?Cod_Registro=${nCod_Registro}&Cod_Barras=${sCod_Barras}&Cod_Usuario=${this.sCod_Usuario}`);
      }

      ListarDestinosService(
        sNum_Planta: number) {
    
        return this.http.get(`${this.baseUrl}/app_listar_planta.php?Accion=S&Num_Planta=${sNum_Planta}`);
      }
      

      CargarRegistroControlSalidaByGuia(sNum_Planta: number, sNum_Guia: string, sCod_Accion: string) {
        return this.http.get(`${this.baseUrl}/app_cargar_registro_salida_jaba.php?Num_Planta=${sNum_Planta}&Num_Guia=${sNum_Guia}&Cod_Accion=${sCod_Accion}`);
      }


      VerificarGuiasPendientesControlJabas(sNum_Planta: number,sCod_Accion:string){
        return this.http.get(`${this.baseUrl}/app_verificar_guias_pendientes_control_jabas.php?Num_Planta=${sNum_Planta}&Cod_Accion=${sCod_Accion}`);

      }



      ListarCabeceraJabaService(Cod_Accion: string, Cod_Registro_Cab: number, Observacion: string, Total: number, Fec_Registro: string){
   
        if (!_moment(Fec_Registro).isValid()) {
          Fec_Registro = '01/01/1900';
        }
        Fec_Registro = _moment(Fec_Registro.valueOf()).format('DD/MM/YYYY');

        return this.http.get(`${this.baseUrl}/app_Man_Control_Jaba_Cabecera.php?Accion=${Cod_Accion}&Cod_Registro_Cab=${Cod_Registro_Cab}&Observacion=${Observacion}&Total=${Total}&Fec_Registro=${Fec_Registro}&Cod_Usuario=${this.sCod_Usuario}`);
      }

      ListarDetalleJabaService(Cod_Accion: string, Cod_Registro_Det: number, Cod_Registro_Cab: number, Cod_Barras: string,Total: number, Fec_Registro: string){
   
        if (!_moment(Fec_Registro).isValid()) {
          Fec_Registro = '01/01/1900';
        }
        Fec_Registro = _moment(Fec_Registro.valueOf()).format('DD/MM/YYYY');

        return this.http.get(`${this.baseUrl}/app_Man_Control_Jaba_Detalle.php?Accion=${Cod_Accion}&Cod_Registro_Det=${Cod_Registro_Det}&Cod_Registro_Cab=${Cod_Registro_Cab}&Cod_Barras=${Cod_Barras}&Total=${Total}&Fec_Registro=${Fec_Registro}&Cod_Usuario=${this.sCod_Usuario}`);
      }
      

      ListarSubDetalleJabaService(Cod_Accion: string, Cod_Registro_Sub_Det: number, Cod_Registro_Det: number, Cod_fabrica: string, Cod_OrdPro: string, Cod_Present: string, Cod_Talla: String, Cant_Prendas: number, Fec_Registro: string){
        if (!_moment(Fec_Registro).isValid()) {
          Fec_Registro = '01/01/1900';
        }
        Fec_Registro = _moment(Fec_Registro.valueOf()).format('DD/MM/YYYY');

        return this.http.get(`${this.baseUrl}/app_Man_Control_Jaba_Sub_Detalle.php?Accion=${Cod_Accion}&Cod_Registro_Sub_Det=${Cod_Registro_Sub_Det}&Cod_Registro_Det=${Cod_Registro_Det}&Cod_fabrica=${Cod_fabrica}&Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Cod_Talla=${Cod_Talla}&Cant_Prendas=${Cant_Prendas}&Fec_Registro=${Fec_Registro}&Cod_Usuario=${this.sCod_Usuario}`);
      }

      ListarMovimientosJabas(Cod_Accion: string, Cod_Mov_Jaba: number, Cod_Barras: string, Cod_Estado: string, Observacion: string, Operacion: string, Fec_Registro: string){
        return this.http.get(`${this.baseUrl}/app_Man_Movimiento_Jaba.php?Accion=${Cod_Accion}&Cod_Mov_Jaba=${Cod_Mov_Jaba}&Cod_Barras=${Cod_Barras}&Cod_Estado=${Cod_Estado}&Observacion=${Observacion}&Cod_Accion=${Operacion}&Fec_Registro=${Fec_Registro}&Cod_Usuario=${this.sCod_Usuario}`);
      }

      BuscarNomProveedorService(Ruc_Proveedor: string) {
        return this.http.get(`${this.baseUrl}/app_muestra_nom_proveedor_num_ruc.php?Ruc_Proveedor=${Ruc_Proveedor}`);
      }


      LG_MOVIMIENTOS_JABA(Cod_Accion: string,Id_Mov_Jaba_Cab: number,Id_Mov_Jaba_Det: number,cod_proveedor: string,Num_Guia: string,Cod_Baras: string){
        return this.http.get(`${this.baseUrl}/app_LG_MOVIMIENTOS_JABA.php?Accion=${Cod_Accion}&Id_Mov_Jaba_Cab=${Id_Mov_Jaba_Cab}&Id_Mov_Jaba_Det=${Id_Mov_Jaba_Det}&cod_proveedor=${cod_proveedor}&Num_Guia=${Num_Guia}&Cod_Baras=${Cod_Baras}&Cod_Usuario=${this.sCod_Usuario}`);
      }

      BuscarKardexJabas(Fecha_Inicio, Fecha_Fin, Jaba) { 
        if (!_moment(Fecha_Inicio).isValid()) {
          Fecha_Inicio = '01/01/1900';
        }
        Fecha_Inicio = _moment(Fecha_Inicio.valueOf()).format('DD/MM/YYYY');
    
        if (!_moment(Fecha_Fin).isValid()) {
          Fecha_Fin = '01/01/1900';
        }
        Fecha_Fin = _moment(Fecha_Fin.valueOf()).format('DD/MM/YYYY');

         return this.http.get(`${this.baseUrl}/app_lg_Buscar_Kardex_Jabas.php?Fecha_Inicio=${Fecha_Inicio}&Fecha_Fin=${Fecha_Fin}&Jaba=${Jaba}`);
      }
}
     