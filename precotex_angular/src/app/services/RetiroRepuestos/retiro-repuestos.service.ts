import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from 'src/app/VarGlobals';
import * as _moment from 'moment';
import { param } from 'jquery';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RetiroRepuestosService {

  baseUrlTinto = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });
  constructor(private http: HttpClient) { }

  getListaRetiros(FecIni, FecFin){
    if(!_moment(FecIni).isValid())
    { FecIni = ''; }
    else
    { FecIni = _moment(FecIni.valueOf()).format('MM/DD/YYYY'); }

    if(!_moment(FecFin).isValid())
    { FecFin = ''; }
    else
    { FecFin = _moment(FecFin.valueOf()).format('MM/DD/YYYY'); }

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('FecIni', FecIni);
    params = params.append('FecFin', FecFin);

    return this.http.get(this.baseUrlTinto + 'TxRetiroRepuestos/getListaRetiros', {headers, params});
  }

  getUsuariosPorTipoSeguridad(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxRetiroRepuestos/getListaRetiroRepuestoUsuarioSeguridadNombres', {headers});
  }

  getUsuariosPorTipoMantenimiento(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxRetiroRepuestos/getListaRetiroRepuestoUsuarioMantenimientoNombres', {headers});
  }

  getDetalleRequerimiento(Num_Requerimiento){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Num_Requerimiento', Num_Requerimiento);
    return this.http.get(this.baseUrlTinto + 'TxRetiroRepuestos/getListaRetiroDetallePorNumRequerimiento', {headers, params});
  }

  getItems(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxRetiroRepuestos/getListaItemsCompletos', {headers});
  }

  getDatositem(Cod_Item){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_Item', Cod_Item);
    return this.http.get(this.baseUrlTinto + 'TxRetiroRepuestos/getListaItems', {headers, params});
  }

  getListaRetirosPorNumReq(Num_Req){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Num_Requerimiento', Num_Req);
    return this.http.get(this.baseUrlTinto + 'TxRetiroRepuestos/getListaRetirosPorNumRequerimiento', {headers, params});
  }

  getDatosItemPorNumReqySecuencia(Num_Req, Nro_Sec){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Num_Requerimiento', Num_Req);
    params = params.append('Nro_Secuencia', Nro_Sec);
    return this.http.get(this.baseUrlTinto + 'TxRetiroRepuestos/getListaDatosItemsPorNumReqySecuencia', {headers, params});
  }

  getDatosReporte(FecIni, FecFin){
    if(!_moment(FecIni).isValid())
    { FecIni = ''; }
    else
    { FecIni = _moment(FecIni.valueOf()).format('MM/DD/YYYY'); }

    if(!_moment(FecFin).isValid())
    { FecFin = ''; }
    else
    { FecFin = _moment(FecFin.valueOf()).format('MM/DD/YYYY'); }

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('FecIni', FecIni);
    params = params.append('FecFin', FecFin);

    return this.http.get(this.baseUrlTinto + 'TxRetiroRepuestos/getListaDatosReporte', {headers, params});
  }

  getGetImageBase64FromUrlAsync(imageUrl: string): Observable<{ base64Image: string }>{
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('imageUrl', imageUrl!); 
    return this.http.get<{ base64Image: string }>(this.baseUrlTinto + 'TxRetiroRepuestos/GetImageBase64FromUrlAsync', { headers, params });
  }

  getListaRetiroRepuestosPorIdRequerimientoMAX(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxRetiroRepuestos/getListaRetiroRepuestosPorIdRequerimientoMAX', {headers});
  }

  getListaRetiroRepuestosDetallePorNumRequerimiento(Num_Requerimiento: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Num_Requerimiento', Num_Requerimiento)
    return this.http.get(this.baseUrlTinto + 'TxRetiroRepuestos/getListaRetiroRepuestosPorIdRequerimientoMAX', {headers, params});
  }
  
  postRegistrarRequerimiento(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxRetiroRepuestos/postRegistrarRequerimiento', data, {headers});
  }

  // postRegistrarRequerimientoDetalle(data: any){
  //   const headers = this.Header;
  //   return this.http.post(this.baseUrlTinto + 'TxRetiroRepuestos/postRegistrarRequerimientoDetalle', data, {headers});
  // }

  postRegistrarRequerimientoDetalle(data: any){
    return this.http.post(this.baseUrlTinto + 'TxRetiroRepuestos/postProcesoConfirmarReclamo', data);
  }

  patchActualizarRequerimiento(data: any){
    const headers = this.Header;
    return this.http.patch(this.baseUrlTinto + 'TxRetiroRepuestos/patchActualizarRequerimiento', data, {headers});
  }

  patchActualizarPrecintoCierre(data: any){
    const headers = this.Header;
    return this.http.patch(this.baseUrlTinto + 'TxRetiroRepuestos/patchActualizarRequerimientoPrecintoCierre', data, {headers})
  }

  // patchActualizarRequerimientoDetalle(data: any){
  //   const headers = this.Header;
  //   return this.http.post(this.baseUrlTinto + 'TxRetiroRepuestos/patchActualizarRequerimientoDetalle', data, {headers});
  // }

  patchActualizarRequerimientoDetalle(data: any){
    return this.http.patch(this.baseUrlTinto + 'TxRetiroRepuestos/patchActualizarRequerimientoDetalle', data);
  }

  EnviarCorreo(){
    // console.log('ENTRA AL SERVICIO');
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxRetiroRepuestos/postEnviarCorreo', '"1"', {headers});
    
  }

  EnviarCorreo2(Num_Requerimiento: any){
    const headers = this.Header;
    console.log('Entra a enviar correo 2');
    console.log('NroReq',Num_Requerimiento);
    return this.http.post(this.baseUrlTinto + 'TxRetiroRepuestos/postEnviarCorreo2', Num_Requerimiento, {headers});
  }

  getimagen(imageId: string):Observable<Blob>{

    const url = `${this.baseUrlTinto}/${imageId}`;
    return this.http.get(url, { responseType: 'blob' });

  }

}
