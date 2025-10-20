import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from 'src/app/VarGlobals';
import * as _moment from 'moment';
import { param } from 'jquery';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReporteNCService {

  baseUrlTinto = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });
  constructor(private http: HttpClient) { }

  getListarRegistro(Rep_ID: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Rep_ID", Rep_ID)
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getListarRegistro', { headers, params });
  }

  getListarPlantas(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getListarPlantas', {headers});
  }

  getListarClasificaciones(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getListarClasificaciones', {headers});
  }

  getListarDatosResolvedor(Rep_ID: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Rep_ID", Rep_ID);
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getListarDatosResolvedor', { headers, params });
  }

  getListarEstados(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getListarEstados', {headers});
  }

  getObtenerImagenes(Rep_Id: number, Img_Fam: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Rep_Id", Rep_Id);
    params = params.append("Img_Fam", Img_Fam);
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getObtenerImagenes', {headers, params});
  }

  getBuscarRegistros(Num_Planta: number, Are_Id: number, Resp_Id: number, Rep_Niv_Rgo: number, Rep_Est: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Num_Planta', Num_Planta);
    params = params.append('Are_Id', Are_Id);
    params = params.append('Resp_Id', Resp_Id);
    params = params.append('Rep_Niv_Rgo', Rep_Niv_Rgo);
    params = params.append('Rep_Est', Rep_Est);
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getBuscarRegistros', { headers, params })
  }

  getListarRiesgos(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getListarRiesgos', { headers });
  }

  postRegistrarReporteNC(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxReporteNC/postRegistrarReporteNC', data, {headers});
  }

  patchActualizarEstado(data: any){
    const headers = this.Header;
    return this.http.patch(this.baseUrlTinto + 'TxReporteNC/patchActualizarEstado', data, {headers});
  }
  
  patchActualizarReporteNC(data: any){
    const headers = this.Header;
    return this.http.patch(this.baseUrlTinto + 'TxReporteNC/patchActualizarReporteNC', data, {headers});
  }

  patchActualizarReporteNCOriginal(data: any){
    const headers = this.Header;
    return this.http.patch(this.baseUrlTinto + 'TxReporteNC/patchActualizarReporteNCOriginal', data, {headers});
  }

  deleteEliminarImagenes(Img_Id: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Img_Id', Img_Id);
    return this.http.delete(this.baseUrlTinto + 'TxReporteNC/deleteEliminarImagenes', {headers, params})
  }

  private bas = 'https://gestion.precotex.com:444/ubicaciones/api/TxRetiroRepuestos/getImagenDesdeBackEnd';
  
  getImagenUrl(imageId: string): string {
    // console.log('el nombre de la imagen es: ', imageId);
    return `${this.bas}?imageId=${encodeURIComponent(imageId)}`;
  }

  /*AREAS*/

  getObtenerAreas(Are_Id: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Are_Id', Are_Id);
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getObtenerAreas', {headers, params});
  }

  postRegistrarArea(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxReporteNC/postRegistrarArea', data, {headers});
  }

  patchActualizarArea(data: any){
    const headers = this.Header;
    return this.http.patch(this.baseUrlTinto + 'TxReporteNC/patchActualizarArea', data, {headers});
  }

  deleteEliminarArea(Are_Id: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Are_Id', Are_Id);
    return this.http.delete(this.baseUrlTinto + 'TxReporteNC/deleteEliminarArea', {headers, params});
  }

  getObtenerAreaXSede(Num_Planta: number, Are_Id: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Num_Planta', Num_Planta);
    params = params.append('Are_Id', Are_Id);
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getObtenerAreaXSede', {headers, params});
  }

  /*RESPONSABLES*/

  getObtenerResponsables(Resp_Id: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Resp_Id', Resp_Id);
    return this.http.get(this.baseUrlTinto + 'TxReporteNC/getObtenerResponsables', {headers, params});
  }

  postRegistrarResponsable(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'TxReporteNC/postRegistrarResponsable', data, {headers});
  }

  patchActualizarResponsable(data: any){
    const headers = this.Header;
    return this.http.patch(this.baseUrlTinto + 'TxReporteNC/patchActualizarResponsable', data, {headers});
  }

  deleteEliminarResponsable(Resp_Id: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Resp_Id', Resp_Id);
    return this.http.delete(this.baseUrlTinto + 'TxReporteNC/deleteEliminarResponsable', {headers, params});
  }


}