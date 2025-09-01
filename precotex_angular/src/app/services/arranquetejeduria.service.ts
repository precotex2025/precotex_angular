import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';

import * as _moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ArranquetejeduriaService {
  baseUrl       = GlobalVariable.baseUrl      ;
  baseUrlLocal  = GlobalVariable.baseUrlLocal ;
  sCod_Usuario  = GlobalVariable.vusu         ;
  baseUrl2      = GlobalVariable.baseUrl      ;
  baseUrlTinto  = GlobalVariable.baseUrlProcesoTenido;

  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  MostrarPendientes() {
    return this.http.get(
      `${this.baseUrl}/App_Muestra_Cola_Arranque_Tj.php?Cod_Usuario=${this.sCod_Usuario}`
    );
  }

  MostrarOt(Cod_Ordtra: string, Num_Secuencia: string) {
    return this.http.get(
      `${this.baseUrl}/app_tj_muestra_datos_ot_para_arranque.php?Cod_Ordtra=${Cod_Ordtra}&Num_Secuencia=${Num_Secuencia}`
    );
  }

  GuardarArranque(data: any) {
    return this.http.post(
      `${this.baseUrl}/app_man_registro_arranque_tejeduria.php`,
      data
    );
  }

  traerDatosInspector(Cod_Trabajador: string, Tip_Trabajador: string) {
    return this.http.get(
      `${this.baseUrl2}/app_muestra_nom_trabajador_4_puntos.php?Cod_Trabajador=${Cod_Trabajador}&Tip_Trabajador=${Tip_Trabajador}`
    );
  }

  showAuditor(Cod_Trabajador: string) {
    return this.http.get(
      `${this.baseUrl}/app_muestra_datos_inspector.php?Cod_Usuario=${Cod_Trabajador}&FLat_Inspecion=TEJ`
    );
  }


  MostrarLongitudMalla(Cod_Ordtra) {
    return this.http.get(
      `${this.baseUrl}/app_mostrar_longitud_malla.php?Cod_Ordtra=${Cod_Ordtra}`
    );
  }

  GuardarLongitudMallaReal(data: any) {
    return this.http.post(
      `${this.baseUrl}/app_man_registro_longitud_malla_real.php`,
      data
    );
  }

  listarTipoTejido() {
    return this.http.get(`${this.baseUrl}/app_mostrar_tipo_tejido_tela.php`);
  }

  //Nuevo metodo para obtener combinaciones de arranque
  obtenerCombinacionesArranque(Cod_Ordtra: string){
    return this.http.get(
      `${this.baseUrl}/app_Tj_Muestra_Combinaciones_Arranque.php?Cod_Ordtra=${Cod_Ordtra}`
    );    
  }

  obtenerDatosReales(Cod_Ordtra: string, Cod_Comb: string, Cod_Talla: string){
    return this.http.get(
      `${this.baseUrl}/app_Man_Arranque_Tejeduria_Pasadas_Obtener.php?Cod_Ordtra=${Cod_Ordtra}&Cod_Comb=${Cod_Comb}&Cod_Talla=${Cod_Talla}`
    );     
  }

  GuardarDatosReales(data: any) {
    return this.http.post(
      `${this.baseUrl}/app_Man_Arranque_Tejeduria_Pasadas.php`,
      data
    );
  }

  EliminarDatosReales(data: any){
    return this.http.post(
      `${this.baseUrl}/app_Man_Arranque_Tejeduria_Pasadas_Eliminar.php`,
      data
    );    
  }

  /*Nuevos servicios */
  getObtieneEstructuraTejidoItem(codTela: string, Cod_Ordtra: string, Num_Secuencia: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('codTela', codTela);
    params = params.append('Cod_Ordtra', Cod_Ordtra);
    params = params.append('Num_Secuencia', Num_Secuencia);
    return this.http.get(this.baseUrlTinto + 'TxTelaEstructuraTejido/getObtieneEstructuraTejidoItem', { headers, params });
  }

  postRegistraEstructuraTejidoItem(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxTelaEstructuraTejido/postRegistraEstructuraTejidoItem', data, { headers })
  }

  // putModificarMedida(data: any){
  //   const headers = this.Header;
  //   return this.http.post(this.baseUrlTinto + 'TxTelaEstructuraTejido/putModificarMedida', data, { headers })
  // }

  //MEDIDAS
  getObtieneTelaMedida(codTela: string, Cod_Talla: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('codTela', codTela);
    params = params.append('Cod_Talla', Cod_Talla);
    return this.http.get(this.baseUrlTinto + 'TxTelaEstructuraTejido/getObtieneTelaMedida', { headers, params });
  }

  getObtieneTelaMedidaHist(codTela: string, Cod_Ordtra: string, Num_Secuencia: string, Cod_Comb: string, Cod_Talla: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('codTela', codTela);
    params = params.append('Cod_Ordtra', Cod_Ordtra);
    params = params.append('Num_Secuencia', Num_Secuencia);
    params = params.append('Cod_Comb', Cod_Comb);
    params = params.append('Cod_Talla', Cod_Talla);
    return this.http.get(this.baseUrlTinto + 'TxTelaEstructuraTejido/getObtieneTelaMedidaHist', { headers, params });
  }

  postRegistraTelaMedida(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxTelaEstructuraTejido/postRegistraTelaMedida', data, { headers })
  }

  postRegistraEstructuraTejido (data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxTelaEstructuraTejido/postRegistraEstructuraTejido', data, { headers })
  }

  //Versiones
  getGeneraVersionHojasArranque(Cod_Ordtra: string, Num_Secuencia: number, Cod_Talla: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_Ordtra', Cod_Ordtra);
    params = params.append('Num_Secuencia', Num_Secuencia);
    params = params.append('Cod_Talla', Cod_Talla);
    return this.http.get(this.baseUrlTinto + 'TxTelaEstructuraTejido/getGeneraVersionHojasArranque', { headers, params });
  }  

  getObtenerVersionHojasArranque(Cod_Ordtra: string, Num_Secuencia: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_Ordtra', Cod_Ordtra);
    params = params.append('Num_Secuencia', Num_Secuencia);
    return this.http.get(this.baseUrlTinto + 'TxTelaEstructuraTejido/getObtenerVersionHojasArranque', { headers, params });
  }  

  getValidaVersionHojasArranque(Cod_Ordtra: string, Num_Secuencia: number, Version: number, Flg_Rectilineo: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_Ordtra', Cod_Ordtra);
    params = params.append('Num_Secuencia', Num_Secuencia);
    params = params.append('Version', Version);
    params = params.append('Flg_Rectilineo', Flg_Rectilineo);
    return this.http.get(this.baseUrlTinto + 'TxTelaEstructuraTejido/getValidaVersionHojasArranque', { headers, params });
  }  

  getListadoVersionHojasArranqueHist(FecIni, FecFin, Cod_Ordtra: string){

    if (!_moment(FecIni).isValid()) {
      FecIni = '';
    } else {
      FecIni = _moment(FecIni.valueOf()).format('MM/DD/YYYY');
    }

    if (!_moment(FecFin).isValid()) {
      FecFin = '';
    } else {
      FecFin = _moment(FecFin.valueOf()).format('MM/DD/YYYY');
    }

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('FecIni', FecIni);
    params = params.append('FecFin', FecFin);
    params = params.append('Cod_Ordtra', Cod_Ordtra);
    return this.http.get(this.baseUrlTinto + 'TxTelaEstructuraTejido/getListadoVersionHojasArranqueHist', { headers, params });
  }

  //Cambios para arranque Calidad
  listarAreaTejido() {
    return this.http.get(`${this.baseUrl}/app_listar_area_tejido.php`);
  }  

  obtenerCtrolInicioTejido(Cod_Ordtra: string, Num_Secuencia: string) {
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_Ordtra', Cod_Ordtra);
    params = params.append('Num_Secuencia', Num_Secuencia);
    return this.http.get(`${this.baseUrl}/app_listar_ctrol_inicio_tejido.php`, { headers, params });    
  }

  //Cambios Arranque Control
  postCrudArranqueCtrol(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxTelaEstructuraTejido/postCrudArranqueCtrol', data, { headers })
  }  

  getObtenerArranqueCtrol(Cod_Ordtra: string, Num_Secuencia: number, Version: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_Ordtra', Cod_Ordtra);
    params = params.append('Num_Secuencia', Num_Secuencia);
    params = params.append('Version', Version);
    return this.http.get(this.baseUrlTinto + 'TxTelaEstructuraTejido/getObtenerArranqueCtrol', { headers, params });
  }    

  GuardarArranqueV2(data: any) {
    return this.http.post(
      `${this.baseUrl}/app_man_registro_arranque_tejeduria_v2.php`,
      data
    );
  }

  getObtenerArranqueCtrolSinVersion(Cod_Ordtra: string, Num_Secuencia: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_Ordtra', Cod_Ordtra);
    params = params.append('Num_Secuencia', Num_Secuencia);
    return this.http.get(this.baseUrlTinto + 'TxTelaEstructuraTejido/ObtenerArranqueCtrolSinVersion', { headers, params });
  }  
  
  getListadoVersionHojasArranqueHistDetail(FecIni, FecFin, Cod_Ordtra: string){

    if (!_moment(FecIni).isValid()) {
      FecIni = '';
    } else {
      FecIni = _moment(FecIni.valueOf()).format('MM/DD/YYYY');
    }

    if (!_moment(FecFin).isValid()) {
      FecFin = '';
    } else {
      FecFin = _moment(FecFin.valueOf()).format('MM/DD/YYYY');
    }

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('FecIni', FecIni);
    params = params.append('FecFin', FecFin);
    params = params.append('Cod_Ordtra', Cod_Ordtra);
    return this.http.get(this.baseUrlTinto + 'TxTelaEstructuraTejido/getListadoVersionHojasArranqueHistDetail', { headers, params });
  }  
  

}
